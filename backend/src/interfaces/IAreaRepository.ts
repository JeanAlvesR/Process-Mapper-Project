import { Area } from '../entities/Area';

export interface IAreaRepository {
  create(name: string, description?: string): Promise<Area>;
  findAll(): Promise<Area[]>;
  findById(id: string): Promise<Area | null>;
  findByName(name: string): Promise<Area | null>;
  update(id: string, updates: Partial<Omit<Area, 'id' | 'createdAt'>>): Promise<Area | null>;
  delete(id: string): Promise<boolean>;
}
