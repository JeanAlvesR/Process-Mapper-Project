import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Area } from '../entities/Area';

export class AreaRepository {
  private repository: Repository<Area>;

  constructor() {
    this.repository = AppDataSource.getRepository(Area);
  }

  async create(name: string, description?: string): Promise<Area> {
    const area = this.repository.create({ name, description });
    return await this.repository.save(area);
  }

  async findAll(): Promise<Area[]> {
    return await this.repository.find({
      relations: ['processes']
    });
  }

  async findById(id: string): Promise<Area | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['processes']
    });
  }

  async update(id: string, updates: Partial<Omit<Area, 'id' | 'createdAt'>>): Promise<Area | null> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 