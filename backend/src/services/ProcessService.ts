import { ProcessRepository } from '../repositories/ProcessRepository';
import { AreaRepository } from '../repositories/AreaRepository';
import { Process } from '../entities/Process';
import { 
  CreateProcessDto, 
  UpdateProcessDto, 
  ProcessResponseDto, 
  ProcessWithDetailsDto 
} from '../dtos/ProcessDto';

export class ProcessService {
  private processRepository: ProcessRepository;
  private areaRepository: AreaRepository;

  constructor() {
    this.processRepository = new ProcessRepository();
    this.areaRepository = new AreaRepository();
  }

  private mapToProcessResponseDto(process: Process, childrenCount?: number): ProcessResponseDto {
    return {
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
      updatedAt: process.updatedAt,
      area: process.area ? {
        id: process.area.id,
        name: process.area.name
      } : undefined,
      parent: process.parent ? {
        id: process.parent.id,
        name: process.parent.name
      } : undefined,
      childrenCount
    };
  }

  private mapToProcessWithDetailsDto(process: Process, children: Process[]): ProcessWithDetailsDto {
    const childrenDtos: ProcessResponseDto[] = children.map(child => ({
      id: child.id,
      name: child.name,
      description: child.description,
      areaId: child.areaId,
      parentId: child.parentId,
      tools: child.tools,
      responsible: child.responsible,
      documentation: child.documentation,
      type: child.type,
      createdAt: child.createdAt,
      updatedAt: child.updatedAt
    }));

    return {
      ...this.mapToProcessResponseDto(process, children.length),
      area: process.area ? {
        id: process.area.id,
        name: process.area.name,
        description: process.area.description
      } : {
        id: process.areaId,
        name: '',
        description: ''
      },
      parent: process.parent ? {
        id: process.parent.id,
        name: process.parent.name,
        description: process.parent.description
      } : undefined,
      children: childrenDtos
    };
  }

  async createProcess(createProcessDto: CreateProcessDto): Promise<ProcessResponseDto> {
    const { name, description, areaId, parentId, tools, responsible, documentation, type } = createProcessDto;
    
    if (!name || !areaId || !type) {
      throw new Error('Name, areaId, and type are required');
    }

    // Validate that the area exists
    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new Error('Area not found');
    }

    // Validate that the parent process exists (if provided)
    if (parentId) {
      const parentProcess = await this.processRepository.findById(parentId);
      if (!parentProcess) {
        throw new Error('Parent process not found');
      }
      // Ensure parent process is in the same area
      if (parentProcess.areaId !== areaId) {
        throw new Error('Parent process must be in the same area');
      }
    }

    const process = await this.processRepository.create({
      name,
      description,
      areaId,
      parentId: parentId || undefined,
      tools,
      responsible,
      documentation,
      type
    });

    return this.mapToProcessResponseDto(process);
  }

  async getAllProcesses(areaId?: string): Promise<ProcessResponseDto[]> {
    let processes;
    
    if (areaId) {
      processes = await this.processRepository.findByAreaId(areaId);
    } else {
      processes = await this.processRepository.findAll();
    }

    // Get children count for each process
    const processesWithCount = await Promise.all(
      processes.map(async (process) => {
        const childrenCount = await this.processRepository.countChildren(process.id);
        return this.mapToProcessResponseDto(process, childrenCount);
      })
    );

    return processesWithCount;
  }

  async getProcessById(id: string): Promise<ProcessResponseDto> {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new Error('Process not found');
    }

    const childrenCount = await this.processRepository.countChildren(id);
    return this.mapToProcessResponseDto(process, childrenCount);
  }

  async getProcessWithDetails(id: string): Promise<ProcessWithDetailsDto> {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new Error('Process not found');
    }

    const children = await this.processRepository.findChildren(id);
    return this.mapToProcessWithDetailsDto(process, children);
  }

  async updateProcess(id: string, updateProcessDto: UpdateProcessDto): Promise<ProcessResponseDto> {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new Error('Process not found');
    }

    // If updating areaId, validate that the area exists
    if (updateProcessDto.areaId) {
      const area = await this.areaRepository.findById(updateProcessDto.areaId);
      if (!area) {
        throw new Error('Area not found');
      }
    }

    // If updating parentId, validate that the parent process exists
    if (updateProcessDto.parentId) {
      const parentProcess = await this.processRepository.findById(updateProcessDto.parentId);
      if (!parentProcess) {
        throw new Error('Parent process not found');
      }
      // Ensure parent process is in the same area
      const targetAreaId = updateProcessDto.areaId || process.areaId;
      if (parentProcess.areaId !== targetAreaId) {
        throw new Error('Parent process must be in the same area');
      }
    }

    const updatedProcess = await this.processRepository.update(id, updateProcessDto);
    if (!updatedProcess) {
      throw new Error('Failed to update process');
    }

    const childrenCount = await this.processRepository.countChildren(id);
    return this.mapToProcessResponseDto(updatedProcess, childrenCount);
  }

  async deleteProcess(id: string): Promise<void> {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new Error('Process not found');
    }

    // Check if process has children
    const childrenCount = await this.processRepository.countChildren(id);
    if (childrenCount > 0) {
      throw new Error('Cannot delete process with existing children');
    }

    const deleted = await this.processRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete process');
    }
  }
}
