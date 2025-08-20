import { IAreaRepository } from '../interfaces/IAreaRepository';
import { IProcessRepository } from '../interfaces/IProcessRepository';
import { CreateAreaDto, UpdateAreaDto } from '../dtos/AreaDto';
import { Area } from '../entities/Area';
import { IAreaService } from '../interfaces/IAreaService';

export class AreaService implements IAreaService {
  constructor(
    private areaRepository: IAreaRepository,
    private processRepository: IProcessRepository
  ) {}

  async createArea(createAreaDto: CreateAreaDto): Promise<Area> {
    const { name, description } = createAreaDto;

    if (!name || name.trim() === '') {
      throw new Error('Name is required');
    }

    const existingArea = await this.areaRepository.findByName(name.trim());
    if (existingArea) {
      throw new Error('Area with this name already exists');
    }

    const area = await this.areaRepository.create(name.trim(), description?.trim());
    return area;
  }

  async getAllAreas(): Promise<Area[]> {
    return await this.areaRepository.findAll();
  }

  async getAreaById(id: string): Promise<Area> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new Error('Area not found');
    }
    return area;
  }

  async getAreaWithProcesses(id: string): Promise<Area> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new Error('Area not found');
    }
    return area;
  }

  async updateArea(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const { name, description } = updateAreaDto;

    const existingArea = await this.areaRepository.findById(id);
    if (!existingArea) {
      throw new Error('Area not found');
    }

    if (name && name.trim() !== '') {
      const areaWithSameName = await this.areaRepository.findByName(name.trim());
      if (areaWithSameName && areaWithSameName.id !== id) {
        throw new Error('Area with this name already exists');
      }
    }

    const updatedArea = await this.areaRepository.update(id, {
      name: name?.trim(),
      description: description?.trim()
    });

    if (!updatedArea) {
      throw new Error('Failed to update area');
    }

    return updatedArea;
  }

  async deleteArea(id: string): Promise<void> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new Error('Area not found');
    }

    if (area.processes && area.processes.length > 0) {
      throw new Error('Cannot delete area with existing processes');
    }

    const deleted = await this.areaRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete area');
    }
  }

  async getAreasByName(name: string, page: number = 1, limit: number = 10) {
    return await this.areaRepository.findByNameWithPagination(name, page, limit);
  }

  async getAreasWithPagination(query: any) {
    return await this.areaRepository.findWithPagination(query);
  }

  async getAreasCount(): Promise<number> {
    return await this.areaRepository.countTotal();
  }
}
