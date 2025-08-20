import { Process } from '../entities/Process';
import { ProcessPaginationQueryDto, PaginatedResponseDto } from '../dtos/PaginationDto';

export interface IProcessRepository {
  create(processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'area' | 'parent' | 'children'>): Promise<Process>;
  findAll(): Promise<Process[]>;
  findWithPagination(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>>;
  findById(id: string): Promise<Process | null>;
  findByAreaId(areaId: string): Promise<Process[]>;
  findByAreaIdWithPagination(areaId: string, page?: number, limit?: number): Promise<PaginatedResponseDto<Process>>;
  update(id: string, updates: Partial<Omit<Process, 'id' | 'createdAt'>>): Promise<Process | null>;
  delete(id: string): Promise<boolean>;
  countByAreaId(areaId: string): Promise<number>;
  countChildren(parentId: string): Promise<number>;
  findChildren(parentId: string): Promise<Process[]>;
  countTotal(): Promise<number>;
  findHierarchicalWithPagination(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>>;
}
