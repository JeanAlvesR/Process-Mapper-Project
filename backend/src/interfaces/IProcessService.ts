import { 
  CreateProcessDto, 
  UpdateProcessDto, 
  ProcessResponseDto, 
  ProcessWithDetailsDto 
} from '../dtos/ProcessDto';

export interface IProcessService {
  createProcess(createProcessDto: CreateProcessDto): Promise<ProcessResponseDto>;
  getAllProcesses(areaId?: string): Promise<ProcessResponseDto[]>;
  getProcessById(id: string): Promise<ProcessResponseDto>;
  getProcessWithDetails(id: string): Promise<ProcessWithDetailsDto>;
  updateProcess(id: string, updateProcessDto: UpdateProcessDto): Promise<ProcessResponseDto>;
  deleteProcess(id: string): Promise<void>;
}
