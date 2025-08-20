import { Repository, Like, ILike } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Area } from '../entities/Area';
import { IAreaRepository } from '../interfaces/IAreaRepository';
import { AreaPaginationQueryDto } from '../dtos/PaginationDto';
import { PaginatedResponseDto } from '../dtos/PaginationDto';
import { calculatePaginationMeta, getPaginationParams } from '../utils/pagination';

export class AreaRepository implements IAreaRepository {
  private repository: Repository<Area>;

  constructor() {
    this.repository = AppDataSource.getRepository(Area);
  }

  async create(name: string, description?: string): Promise<Area> {
    const area = this.repository.create({ name, description });
    return await this.repository.save(area);
  }

  async findAll(): Promise<Area[]> {
    return await this.repository.find({
      relations: ['processes']
    });
  }

  async findWithPagination(query: AreaPaginationQueryDto): Promise<PaginatedResponseDto<Area>> {
    const { page, limit, skip, search, sortBy, sortOrder } = getPaginationParams(query);
    
    // Construir query builder para otimização
    const queryBuilder = this.repository
      .createQueryBuilder('area')
      .leftJoinAndSelect('area.processes', 'processes')
      .orderBy(`area.${sortBy}`, sortOrder);

    // Aplicar filtros de busca
    if (search) {
      queryBuilder.where(
        '(area.name ILIKE :search OR area.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Aplicar filtros específicos
    if (query.name) {
      queryBuilder.andWhere('area.name ILIKE :name', { name: `%${query.name}%` });
    }

    if (query.description) {
      queryBuilder.andWhere('area.description ILIKE :description', { description: `%${query.description}%` });
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

  async findById(id: string): Promise<Area | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['processes']
    });
  }

  async update(id: string, updates: Partial<Omit<Area, 'id' | 'createdAt'>>): Promise<Area | null> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByName(name: string): Promise<Area | null> {
    return await this.repository.findOne({
      where: { name }
    });
  }

  async countTotal(): Promise<number> {
    return await this.repository.count();
  }

  async findByNameWithPagination(name: string, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<Area>> {
    const skip = (page - 1) * limit;
    
    const [data, totalItems] = await this.repository.findAndCount({
      where: { name: ILike(`%${name}%`) },
      relations: ['processes'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    const meta = calculatePaginationMeta(totalItems, page, limit);
    return { data, meta };
  }
} 