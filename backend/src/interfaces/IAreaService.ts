import { Area } from '../entities/Area';
import { CreateAreaDto, UpdateAreaDto } from '../dtos/AreaDto';
import { AreaPaginationQueryDto, PaginatedResponseDto } from '../dtos/PaginationDto';

export interface IAreaService {
  createArea(createAreaDto: CreateAreaDto): Promise<Area>;
  getAllAreas(): Promise<Area[]>;
  getAreasWithPagination(query: AreaPaginationQueryDto): Promise<PaginatedResponseDto<Area>>;
  getAreaById(id: string): Promise<Area>;
  getAreaWithProcesses(id: string): Promise<Area>;
  updateArea(id: string, updateAreaDto: UpdateAreaDto): Promise<Area>;
  deleteArea(id: string): Promise<void>;
  getAreasByName(name: string, page?: number, limit?: number): Promise<PaginatedResponseDto<Area>>;
  getAreasCount(): Promise<number>;
}
