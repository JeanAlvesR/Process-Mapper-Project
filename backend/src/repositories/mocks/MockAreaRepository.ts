import { Area } from '../../entities/Area';
import { IAreaRepository } from '../../interfaces/IAreaRepository';

export class MockAreaRepository implements IAreaRepository {
  private areas: Area[] = [];

  async create(name: string, description?: string): Promise<Area> {
    const area = new Area();
    area.id = Math.random().toString(36).substr(2, 9);
    area.name = name;
    area.description = description;
    area.createdAt = new Date();
    area.updatedAt = new Date();
    
    this.areas.push(area);
    return area;
  }

  async findAll(): Promise<Area[]> {
    return [...this.areas];
  }

  async findById(id: string): Promise<Area | null> {
    return this.areas.find(area => area.id === id) || null;
  }

  async findByName(name: string): Promise<Area | null> {
    return this.areas.find(area => area.name === name) || null;
  }

  async update(id: string, updates: Partial<Omit<Area, 'id' | 'createdAt'>>): Promise<Area | null> {
    const areaIndex = this.areas.findIndex(area => area.id === id);
    if (areaIndex === -1) return null;

    this.areas[areaIndex] = { ...this.areas[areaIndex], ...updates, updatedAt: new Date() };
    return this.areas[areaIndex];
  }

  async delete(id: string): Promise<boolean> {
    const areaIndex = this.areas.findIndex(area => area.id === id);
    if (areaIndex === -1) return false;

    this.areas.splice(areaIndex, 1);
    return true;
  }

  // Método para limpar dados de teste
  clear(): void {
    this.areas = [];
  }
}
