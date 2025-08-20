import { Repository, Like, ILike } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Process } from '../entities/Process';
import { IProcessRepository } from '../interfaces/IProcessRepository';
import { ProcessPaginationQueryDto } from '../dtos/PaginationDto';
import { PaginatedResponseDto } from '../dtos/PaginationDto';
import { calculatePaginationMeta, getPaginationParams } from '../utils/pagination';

export class ProcessRepository implements IProcessRepository {
  private repository: Repository<Process>;

  constructor() {
    this.repository = AppDataSource.getRepository(Process);
  }

  async create(processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'area' | 'parent' | 'children'>): Promise<Process> {
    const process = this.repository.create(processData);
    return await this.repository.save(process);
  }

  async findAll(): Promise<Process[]> {
    return await this.repository.find({
      relations: ['area', 'parent', 'children']
    });
  }

  async findWithPagination(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>> {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(query);
    
    // Construir query builder para otimização
    const queryBuilder = this.repository
      .createQueryBuilder('process')
      .leftJoinAndSelect('process.area', 'area')
      .leftJoinAndSelect('process.parent', 'parent')
      .leftJoinAndSelect('process.children', 'children')
      .orderBy(`process.${sortBy}`, sortOrder);

    // Aplicar filtros de busca
    if (search) {
      queryBuilder.where(
        '(process.name ILIKE :search OR process.description ILIKE :search OR process.tools ILIKE :search OR process.responsible ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Aplicar filtros específicos
    if (query.areaId) {
      queryBuilder.andWhere('process.areaId = :areaId', { areaId: query.areaId });
    }

    if (query.parentId) {
      if (query.parentId === 'null') {
        queryBuilder.andWhere('process.parentId IS NULL');
      } else {
        queryBuilder.andWhere('process.parentId = :parentId', { parentId: query.parentId });
      }
    }

    if (query.type) {
      queryBuilder.andWhere('process.type = :type', { type: query.type });
    }

    if (query.responsible) {
      queryBuilder.andWhere('process.responsible ILIKE :responsible', { responsible: `%${query.responsible}%` });
    }

    // Contar total de registros
    const totalItems = await queryBuilder.getCount();

    // Aplicar paginação
    queryBuilder.skip(skip).take(limit);

    // Executar query
    const data = await queryBuilder.getMany();

    // Calcular metadados de paginação
    const meta = calculatePaginationMeta(totalItems, page, limit);

    return { data, meta };
  }

  async findById(id: string): Promise<Process | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['area', 'parent', 'children']
    });
  }

  async findByAreaId(areaId: string): Promise<Process[]> {
    return await this.repository.find({
      where: { areaId },
      relations: ['area', 'parent', 'children']
    });
  }

  async findByAreaIdWithPagination(areaId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<Process>> {
    const skip = (page - 1) * limit;
    
    const [data, totalItems] = await this.repository.findAndCount({
      where: { areaId },
      relations: ['area', 'parent', 'children'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    const meta = calculatePaginationMeta(totalItems, page, limit);
    return { data, meta };
  }

  async update(id: string, updates: Partial<Omit<Process, 'id' | 'createdAt'>>): Promise<Process | null> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    // First, recursively delete all child processes
    await this.deleteChildren(id);
    
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  private async deleteChildren(parentId: string): Promise<void> {
    const children = await this.repository.find({
      where: { parentId }
    });

    for (const child of children) {
      await this.deleteChildren(child.id);
      await this.repository.delete(child.id);
    }
  }

  async countByAreaId(areaId: string): Promise<number> {
    return await this.repository.count({
      where: { areaId }
    });
  }

  async countChildren(parentId: string): Promise<number> {
    return await this.repository.count({
      where: { parentId }
    });
  }

  async findChildren(parentId: string): Promise<Process[]> {
    return await this.repository.find({
      where: { parentId },
      relations: ['area', 'parent']
    });
  }

  async countTotal(): Promise<number> {
    return await this.repository.count();
  }

  async findHierarchicalWithPagination(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>> {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(query);
    
    // Query otimizada para hierarquia
    const queryBuilder = this.repository
      .createQueryBuilder('process')
      .leftJoinAndSelect('process.area', 'area')
      .leftJoinAndSelect('process.parent', 'parent')
      .leftJoinAndSelect('process.children', 'children')
      .orderBy('process.parentId', 'ASC') // Processos pai primeiro
      .addOrderBy(`process.${sortBy}`, sortOrder);

    // Aplicar filtros
    if (search) {
      queryBuilder.where(
        '(process.name ILIKE :search OR process.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (query.areaId) {
      queryBuilder.andWhere('process.areaId = :areaId', { areaId: query.areaId });
    }

    if (query.type) {
      queryBuilder.andWhere('process.type = :type', { type: query.type });
    }

    // Contar total
    const totalItems = await queryBuilder.getCount();

    // Aplicar paginação
    queryBuilder.skip(skip).take(limit);

    // Executar query
    const data = await queryBuilder.getMany();

    // Organizar hierarquicamente
    const hierarchicalData = this.organizeHierarchically(data);

    const meta = calculatePaginationMeta(totalItems, page, limit);
    return { data: hierarchicalData, meta };
  }

  private organizeHierarchically(processes: Process[]): Process[] {
    const processMap = new Map<string, Process>();
    const rootProcesses: Process[] = [];

    // Criar mapa de processos
    processes.forEach(process => {
      processMap.set(process.id, { ...process, children: [] });
    });

    // Organizar hierarquia
    processes.forEach(process => {
      const mappedProcess = processMap.get(process.id)!;
      
      if (process.parentId && processMap.has(process.parentId)) {
        const parent = processMap.get(process.parentId)!;
        parent.children.push(mappedProcess);
      } else {
        rootProcesses.push(mappedProcess);
      }
    });

    return rootProcesses;
  }
} 