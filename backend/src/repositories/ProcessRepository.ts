import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Process } from '../entities/Process';

export class ProcessRepository {
  private repository: Repository<Process>;

  constructor() {
    this.repository = AppDataSource.getRepository(Process);
  }

  async create(processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'area' | 'parent' | 'children'>): Promise<Process> {
    const process = this.repository.create(processData);
    return await this.repository.save(process);
  }

  async findAll(): Promise<Process[]> {
    return await this.repository.find({
      relations: ['area', 'parent', 'children']
    });
  }

  async findById(id: string): Promise<Process | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['area', 'parent', 'children']
    });
  }

  async findByAreaId(areaId: string): Promise<Process[]> {
    return await this.repository.find({
      where: { areaId },
      relations: ['area', 'parent', 'children']
    });
  }

  async update(id: string, updates: Partial<Omit<Process, 'id' | 'createdAt'>>): Promise<Process | null> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    // First, recursively delete all child processes
    await this.deleteChildren(id);
    
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  private async deleteChildren(parentId: string): Promise<void> {
    const children = await this.repository.find({
      where: { parentId }
    });

    for (const child of children) {
      await this.deleteChildren(child.id);
      await this.repository.delete(child.id);
    }
  }
} 