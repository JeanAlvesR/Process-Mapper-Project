import { Process } from '../entities/Process';
import { CreateProcessDto, UpdateProcessDto } from '../dtos/ProcessDto';
import { ProcessPaginationQueryDto, PaginatedResponseDto } from '../dtos/PaginationDto';

export interface IProcessService {
  createProcess(createProcessDto: CreateProcessDto): Promise<Process>;
  getAllProcesses(areaId?: string): Promise<Process[]>;
  getProcessesWithPagination(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>>;
  getProcessesByAreaWithPagination(areaId: string, page?: number, limit?: number): Promise<PaginatedResponseDto<Process>>;
  getProcessesHierarchical(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>>;
  getProcessById(id: string): Promise<Process>;
  getProcessWithDetails(id: string): Promise<Process>;
  updateProcess(id: string, updateProcessDto: UpdateProcessDto): Promise<Process>;
  deleteProcess(id: string): Promise<void>;
  getProcessesCount(): Promise<number>;
  getProcessesCountByArea(areaId: string): Promise<number>;
}
