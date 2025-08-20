import { IProcessRepository } from '../interfaces/IProcessRepository';
import { IAreaRepository } from '../interfaces/IAreaRepository';
import { CreateProcessDto, UpdateProcessDto } from '../dtos/ProcessDto';
import { ProcessPaginationQueryDto, PaginatedResponseDto } from '../dtos/PaginationDto';
import { Process } from '../entities/Process';
import { IProcessService } from '../interfaces/IProcessService';

export class ProcessService implements IProcessService {
  constructor(
    private processRepository: IProcessRepository,
    private areaRepository: IAreaRepository
  ) {}

  async createProcess(createProcessDto: CreateProcessDto): Promise<Process> {
    const { name, description, areaId, parentId, tools, responsible, documentation, type } = createProcessDto;

    if (!name || name.trim() === '') {
      throw new Error('Name is required');
    }

    if (!areaId) {
      throw new Error('Area ID is required');
    }

    // Verify area exists
    const area = await this.areaRepository.findById(areaId);
    if (!area) {
      throw new Error('Area not found');
    }

    // Verify parent process exists if provided
    if (parentId) {
      const parentProcess = await this.processRepository.findById(parentId);
      if (!parentProcess) {
        throw new Error('Parent process not found');
      }

      // Verify parent process is in the same area
      if (parentProcess.areaId !== areaId) {
        throw new Error('Parent process must be in the same area');
      }
    }

    return await this.processRepository.create({
      name: name.trim(),
      description: description?.trim(),
      areaId,
      parentId: parentId || undefined,
      tools: tools?.trim(),
      responsible: responsible?.trim(),
      documentation: documentation?.trim(),
      type: type || 'manual'
    });
  }

  async getAllProcesses(areaId?: string): Promise<Process[]> {
    if (areaId) {
      return await this.processRepository.findByAreaId(areaId);
    }
    return await this.processRepository.findAll();
  }

  async getProcessesWithPagination(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>> {
    return await this.processRepository.findWithPagination(query);
  }

  async getProcessesByAreaWithPagination(areaId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponseDto<Process>> {
    return await this.processRepository.findByAreaIdWithPagination(areaId, page, limit);
  }

  async getProcessesHierarchical(query: ProcessPaginationQueryDto): Promise<PaginatedResponseDto<Process>> {
    return await this.processRepository.findHierarchicalWithPagination(query);
  }

  async getProcessById(id: string): Promise<Process> {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new Error('Process not found');
    }
    return process;
  }

  async getProcessWithDetails(id: string): Promise<Process> {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new Error('Process not found');
    }
    return process;
  }

  async updateProcess(id: string, updateProcessDto: UpdateProcessDto): Promise<Process> {
    const { name, description, areaId, parentId, tools, responsible, documentation, type } = updateProcessDto;

    const existingProcess = await this.processRepository.findById(id);
    if (!existingProcess) {
      throw new Error('Process not found');
    }

    // Verify area exists if provided
    if (areaId) {
      const area = await this.areaRepository.findById(areaId);
      if (!area) {
        throw new Error('Area not found');
      }
    }

    // Verify parent process exists if provided
    if (parentId) {
      const parentProcess = await this.processRepository.findById(parentId);
      if (!parentProcess) {
        throw new Error('Parent process not found');
      }

      // Verify parent process is in the same area
      const targetAreaId = areaId || existingProcess.areaId;
      if (parentProcess.areaId !== targetAreaId) {
        throw new Error('Parent process must be in the same area');
      }
    }

    const updatedProcess = await this.processRepository.update(id, {
      name: name?.trim(),
      description: description?.trim(),
      areaId,
      parentId: parentId || undefined,
      tools: tools?.trim(),
      responsible: responsible?.trim(),
      documentation: documentation?.trim(),
      type
    });

    if (!updatedProcess) {
      throw new Error('Failed to update process');
    }

    return updatedProcess;
  }

  async deleteProcess(id: string): Promise<void> {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new Error('Process not found');
    }

    const deleted = await this.processRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete process');
    }
  }

  async getProcessesCount(): Promise<number> {
    return await this.processRepository.countTotal();
  }

  async getProcessesCountByArea(areaId: string): Promise<number> {
    return await this.processRepository.countByAreaId(areaId);
  }
}
