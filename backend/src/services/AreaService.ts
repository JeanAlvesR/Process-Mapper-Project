import { AreaRepository } from '../repositories/AreaRepository';
import { ProcessRepository } from '../repositories/ProcessRepository';
import { Area } from '../entities/Area';
import { 
  CreateAreaDto, 
  UpdateAreaDto, 
  AreaResponseDto, 
  AreaWithProcessesDto 
} from '../dtos/AreaDto';
import { ProcessResponseDto } from '../dtos/ProcessDto';
import { IAreaService } from '../interfaces/IAreaService';
import { IAreaRepository } from '../interfaces/IAreaRepository';
import { IProcessRepository } from '../interfaces/IProcessRepository';

export class AreaService implements IAreaService {
  private areaRepository: IAreaRepository;
  private processRepository: IProcessRepository;

  constructor(
    areaRepository?: IAreaRepository,
    processRepository?: IProcessRepository
  ) {
    this.areaRepository = areaRepository || new AreaRepository();
    this.processRepository = processRepository || new ProcessRepository();
  }

  private mapToAreaResponseDto(area: Area, processCount?: number): AreaResponseDto {
    return {
      id: area.id,
      name: area.name,
      description: area.description,
      createdAt: area.createdAt,
      updatedAt: area.updatedAt,
      processCount
    };
  }

  private mapToAreaWithProcessesDto(area: Area, processes: any[]): AreaWithProcessesDto {
    const processDtos: ProcessResponseDto[] = processes.map(process => ({
      id: process.id,
      name: process.name,
      description: process.description,
      areaId: process.areaId,
      parentId: process.parentId,
      tools: process.tools,
      responsible: process.responsible,
      documentation: process.documentation,
      type: process.type,
      createdAt: process.createdAt,
      updatedAt: process.updatedAt
    }));

    return {
      ...this.mapToAreaResponseDto(area, processes.length),
      processes: processDtos
    };
  }

  async createArea(createAreaDto: CreateAreaDto): Promise<AreaResponseDto> {
    const { name, description } = createAreaDto;
    
    if (!name) {
      throw new Error('Name is required');
    }

    const existingArea = await this.areaRepository.findByName(name);
    if (existingArea) {
      throw new Error('Area with this name already exists');
    }

    const area = await this.areaRepository.create(name, description);
    return this.mapToAreaResponseDto(area);
  }

  async getAllAreas(): Promise<AreaResponseDto[]> {
    const areas = await this.areaRepository.findAll();
    
    // Get process count for each area
    const areasWithCount = await Promise.all(
      areas.map(async (area) => {
        const processCount = await this.processRepository.countByAreaId(area.id);
        return this.mapToAreaResponseDto(area, processCount);
      })
    );

    return areasWithCount;
  }

  async getAreaById(id: string): Promise<AreaResponseDto> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new Error('Area not found');
    }

    const processCount = await this.processRepository.countByAreaId(id);
    return this.mapToAreaResponseDto(area, processCount);
  }

  async getAreaWithProcesses(id: string): Promise<AreaWithProcessesDto> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new Error('Area not found');
    }

    const processes = await this.processRepository.findByAreaId(id);
    return this.mapToAreaWithProcessesDto(area, processes);
  }

  async updateArea(id: string, updateAreaDto: UpdateAreaDto): Promise<AreaResponseDto> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new Error('Area not found');
    }

    // Check if name is being updated and if it already exists
    if (updateAreaDto.name && updateAreaDto.name !== area.name) {
      const existingArea = await this.areaRepository.findByName(updateAreaDto.name);
      if (existingArea && existingArea.id !== id) {
        throw new Error('Area with this name already exists');
      }
    }

    const updatedArea = await this.areaRepository.update(id, updateAreaDto);
    if (!updatedArea) {
      throw new Error('Failed to update area');
    }

    const processCount = await this.processRepository.countByAreaId(id);
    return this.mapToAreaResponseDto(updatedArea, processCount);
  }

  async deleteArea(id: string): Promise<void> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new Error('Area not found');
    }

    // Check if area has processes
    const processCount = await this.processRepository.countByAreaId(id);
    if (processCount > 0) {
      throw new Error('Cannot delete area with existing processes');
    }

    const deleted = await this.areaRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete area');
    }
  }
}
