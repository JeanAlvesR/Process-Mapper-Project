import { Process } from '../../entities/Process';
import { IProcessRepository } from '../../interfaces/IProcessRepository';

export class MockProcessRepository implements IProcessRepository {
  private processes: Process[] = [];

  async create(processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt' | 'area' | 'parent' | 'children'>): Promise<Process> {
    const process = new Process();
    process.id = Math.random().toString(36).substr(2, 9);
    Object.assign(process, processData);
    process.createdAt = new Date();
    process.updatedAt = new Date();
    
    this.processes.push(process);
    return process;
  }

  async findAll(): Promise<Process[]> {
    return [...this.processes];
  }

  async findById(id: string): Promise<Process | null> {
    return this.processes.find(process => process.id === id) || null;
  }

  async findByAreaId(areaId: string): Promise<Process[]> {
    return this.processes.filter(process => process.areaId === areaId);
  }

  async findChildren(parentId: string): Promise<Process[]> {
    return this.processes.filter(process => process.parentId === parentId);
  }

  async countByAreaId(areaId: string): Promise<number> {
    return this.processes.filter(process => process.areaId === areaId).length;
  }

  async countChildren(parentId: string): Promise<number> {
    return this.processes.filter(process => process.parentId === parentId).length;
  }

  async update(id: string, updates: Partial<Omit<Process, 'id' | 'createdAt'>>): Promise<Process | null> {
    const processIndex = this.processes.findIndex(process => process.id === id);
    if (processIndex === -1) return null;

    this.processes[processIndex] = { ...this.processes[processIndex], ...updates, updatedAt: new Date() };
    return this.processes[processIndex];
  }

  async delete(id: string): Promise<boolean> {
    const processIndex = this.processes.findIndex(process => process.id === id);
    if (processIndex === -1) return false;

    this.processes.splice(processIndex, 1);
    return true;
  }

  // Método para limpar dados de teste
  clear(): void {
    this.processes = [];
  }
}
