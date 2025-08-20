import { Process } from '../entities/Process';

export interface IProcessRepository {
  create(processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'area' | 'parent' | 'children'>): Promise<Process>;
  findAll(): Promise<Process[]>;
  findById(id: string): Promise<Process | null>;
  findByAreaId(areaId: string): Promise<Process[]>;
  findChildren(parentId: string): Promise<Process[]>;
  countByAreaId(areaId: string): Promise<number>;
  countChildren(parentId: string): Promise<number>;
  update(id: string, updates: Partial<Omit<Process, 'id' | 'createdAt'>>): Promise<Process | null>;
  delete(id: string): Promise<boolean>;
}
