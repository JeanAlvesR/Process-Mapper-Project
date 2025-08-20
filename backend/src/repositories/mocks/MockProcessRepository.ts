import { Process } from '../../entities/Process';
import { IProcessRepository } from '../../interfaces/IProcessRepository';
import { PaginatedResponseDto, ProcessPaginationQueryDto } from '../../dtos/PaginationDto';

export class MockProcessRepository implements IProcessRepository {
  private processes: Process[] = [];

  async create(processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'area' | 'parent' | 'children'>): Promise<Process> {
    const process = new Process();
    process.id = Math.random().toString(36).substr(2, 9);
    Object.assign(process, processData);
    process.createdAt = new Date();
    process.updatedAt = new Date();
    
    this.processes.push(process);
    return process;
  }

  async findAll(): Promise<Process[]> {
    return [...this.processes];
  }

  async findWithPagination(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>> {
    const page = Math.max(1, parseInt((query.page as unknown as string) || '1'));
    const limit = Math.min(100, Math.max(1, parseInt((query.limit as unknown as string) || '10')));
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = (query.sortOrder || 'DESC').toUpperCase() as 'ASC' | 'DESC';
    const search = (query.search || '').toString().toLowerCase();

    let filtered = [...this.processes];

    if (search) {
      filtered = filtered.filter(p =>
        (p.name || '').toLowerCase().includes(search) ||
        (p.description || '').toLowerCase().includes(search) ||
        (p.tools || '').toLowerCase().includes(search) ||
        (p.responsible || '').toLowerCase().includes(search)
      );
    }

    if (query.areaId) {
      filtered = filtered.filter(p => p.areaId === query.areaId);
    }

    if (query.parentId) {
      if (query.parentId === 'null') {
        filtered = filtered.filter(p => !p.parentId);
      } else {
        filtered = filtered.filter(p => p.parentId === query.parentId);
      }
    }

    if (query.type) {
      filtered = filtered.filter(p => p.type === query.type);
    }

    if (query.responsible) {
      const r = query.responsible.toLowerCase();
      filtered = filtered.filter(p => (p.responsible || '').toLowerCase().includes(r));
    }

    filtered.sort((a: any, b: any) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av === bv) return 0;
      if (sortOrder === 'ASC') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });

    const totalItems = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      }
    };
  }

  async findById(id: string): Promise<Process | null> {
    return this.processes.find(process => process.id === id) || null;
  }

  async findByAreaId(areaId: string): Promise<Process[]> {
    return this.processes.filter(process => process.areaId === areaId);
  }

  async findByAreaIdWithPagination(areaId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<Process>> {
    const filtered = this.processes.filter(p => p.areaId === areaId);

    const totalItems = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      }
    };
  }

  async update(id: string, updates: Partial<Omit<Process, 'id' | 'createdAt'>>): Promise<Process | null> {
    const processIndex = this.processes.findIndex(process => process.id === id);
    if (processIndex === -1) return null;

    this.processes[processIndex] = { ...this.processes[processIndex], ...updates, updatedAt: new Date() } as Process;
    return this.processes[processIndex];
  }

  async delete(id: string): Promise<boolean> {
    const processIndex = this.processes.findIndex(process => process.id === id);
    if (processIndex === -1) return false;

    this.processes.splice(processIndex, 1);
    return true;
  }

  async countByAreaId(areaId: string): Promise<number> {
    return this.processes.filter(process => process.areaId === areaId).length;
  }

  async countChildren(parentId: string): Promise<number> {
    return this.processes.filter(process => process.parentId === parentId).length;
  }

  async findChildren(parentId: string): Promise<Process[]> {
    return this.processes.filter(process => process.parentId === parentId);
  }

  async countTotal(): Promise<number> {
    return this.processes.length;
  }

  async findHierarchicalWithPagination(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>> {
    // Reutiliza findWithPagination para mock; a hierarquia pode ser simulada externamente
    return this.findWithPagination(query);
  }

  // Método para limpar dados de teste
  clear(): void {
    this.processes = [];
  }
}
