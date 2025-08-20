import { IAreaService } from '../interfaces/IAreaService';
import { IProcessService } from '../interfaces/IProcessService';
import { IAreaRepository } from '../interfaces/IAreaRepository';
import { IProcessRepository } from '../interfaces/IProcessRepository';
import { AreaService } from '../services/AreaService';
import { ProcessService } from '../services/ProcessService';
import { AreaRepository } from '../repositories/AreaRepository';
import { ProcessRepository } from '../repositories/ProcessRepository';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.registerServices();
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  private registerServices(): void {
    // Register repositories
    this.services.set('IAreaRepository', new AreaRepository());
    this.services.set('IProcessRepository', new ProcessRepository());

    // Register services with dependency injection
    const areaRepository = this.services.get('IAreaRepository') as IAreaRepository;
    const processRepository = this.services.get('IProcessRepository') as IProcessRepository;

    this.services.set('IAreaService', new AreaService(areaRepository, processRepository));
    this.services.set('IProcessService', new ProcessService(processRepository, areaRepository));
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  // Method to replace services for testing
  public setMock<T>(serviceName: string, mockService: T): void {
    this.services.set(serviceName, mockService);
  }
}

// Export singleton instance
export const container = DependencyContainer.getInstance();
