import { Area } from '../entities/Area';
import { AreaPaginationQueryDto, PaginatedResponseDto } from '../dtos/PaginationDto';

export interface IAreaRepository {
  create(name: string, description?: string): Promise<Area>;
  findAll(): Promise<Area[]>;
  findWithPagination(query: AreaPaginationQueryDto): Promise<PaginatedResponseDto<Area>>;
  findById(id: string): Promise<Area | null>;
  update(id: string, updates: Partial<Omit<Area, 'id' | 'createdAt'>>): Promise<Area | null>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<Area | null>;
  countTotal(): Promise<number>;
  findByNameWithPagination(name: string, page?: number, limit?: number): Promise<PaginatedResponseDto<Area>>;
}
