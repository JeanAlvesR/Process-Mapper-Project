import { 
  CreateAreaDto, 
  UpdateAreaDto, 
  AreaResponseDto, 
  AreaWithProcessesDto 
} from '../dtos/AreaDto';

export interface IAreaService {
  createArea(createAreaDto: CreateAreaDto): Promise<AreaResponseDto>;
  getAllAreas(): Promise<AreaResponseDto[]>;
  getAreaById(id: string): Promise<AreaResponseDto>;
  getAreaWithProcesses(id: string): Promise<AreaWithProcessesDto>;
  updateArea(id: string, updateAreaDto: UpdateAreaDto): Promise<AreaResponseDto>;
  deleteArea(id: string): Promise<void>;
}
