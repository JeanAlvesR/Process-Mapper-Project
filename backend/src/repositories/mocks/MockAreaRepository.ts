import { Area } from '../../entities/Area';
import { IAreaRepository } from '../../interfaces/IAreaRepository';
import { AreaPaginationQueryDto, PaginatedResponseDto } from '../../dtos/PaginationDto';

export class MockAreaRepository implements IAreaRepository {
  private areas: Area[] = [];

  async create(name: string, description?: string): Promise<Area> {
    const area = new Area();
    area.id = Math.random().toString(36).substr(2, 9);
    area.name = name;
    area.description = description;
    area.createdAt = new Date();
    area.updatedAt = new Date();
    
    this.areas.push(area);
    return area;
  }

  async findAll(): Promise<Area[]> {
    return [...this.areas];
  }

  async findWithPagination(query: AreaPaginationQueryDto): Promise<PaginatedResponseDto<Area>> {
    const page = Math.max(1, parseInt((query.page as unknown as string) || '1'));
    const limit = Math.min(100, Math.max(1, parseInt((query.limit as unknown as string) || '10')));
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = (query.sortOrder || 'DESC').toUpperCase() as 'ASC' | 'DESC';
    const search = (query.search || '').toString().toLowerCase();

    let filtered = [...this.areas];

    if (search) {
      filtered = filtered.filter(a =>
        (a.name || '').toLowerCase().includes(search) ||
        (a.description || '').toLowerCase().includes(search)
      );
    }

    if (query.name) {
      const nameSearch = query.name.toLowerCase();
      filtered = filtered.filter(a => (a.name || '').toLowerCase().includes(nameSearch));
    }

    if (query.description) {
      const descSearch = query.description.toLowerCase();
      filtered = filtered.filter(a => (a.description || '').toLowerCase().includes(descSearch));
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

  async findById(id: string): Promise<Area | null> {
    return this.areas.find(area => area.id === id) || null;
  }

  async findByName(name: string): Promise<Area | null> {
    return this.areas.find(area => area.name === name) || null;
  }

  async update(id: string, updates: Partial<Omit<Area, 'id' | 'createdAt'>>): Promise<Area | null> {
    const areaIndex = this.areas.findIndex(area => area.id === id);
    if (areaIndex === -1) return null;

    this.areas[areaIndex] = { ...this.areas[areaIndex], ...updates, updatedAt: new Date() } as Area;
    return this.areas[areaIndex];
  }

  async delete(id: string): Promise<boolean> {
    const areaIndex = this.areas.findIndex(area => area.id === id);
    if (areaIndex === -1) return false;

    this.areas.splice(areaIndex, 1);
    return true;
  }

  async countTotal(): Promise<number> {
    return this.areas.length;
  }

  async findByNameWithPagination(name: string, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<Area>> {
    const search = name.toLowerCase();
    const filtered = this.areas.filter(a => (a.name || '').toLowerCase().includes(search));

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

  // Método para limpar dados de teste
  clear(): void {
    this.areas = [];
  }
}
