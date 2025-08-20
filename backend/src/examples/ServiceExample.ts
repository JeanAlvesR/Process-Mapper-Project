import { AreaService } from '../services/AreaService';
import { MockAreaRepository } from '../repositories/mocks/MockAreaRepository';
import { MockProcessRepository } from '../repositories/mocks/MockProcessRepository';
import { CreateAreaDto } from '../dtos/AreaDto';

/**
 * Exemplo de como usar as interfaces e mocks para testes
 */
export class ServiceExample {
  
  /**
   * Exemplo de uso do service com repositories reais
   */
  static async exampleWithRealRepositories() {
    console.log('=== Exemplo com Repositories Reais ===');
    
    const areaService = new AreaService();
    
    try {
      // Criar uma área
      const createAreaDto: CreateAreaDto = {
        name: 'Área de Teste',
        description: 'Descrição da área de teste'
      };
      
      const area = await areaService.createArea(createAreaDto);
      console.log('Área criada:', area);
      
      // Buscar todas as áreas
      const areas = await areaService.getAllAreas();
      console.log('Todas as áreas:', areas);
      
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
  /**
   * Exemplo de uso do service com mocks (para testes)
   */
  static async exampleWithMockRepositories() {
    console.log('\n=== Exemplo com Mock Repositories ===');
    
    const mockAreaRepository = new MockAreaRepository();
    const mockProcessRepository = new MockProcessRepository();
    
    const areaService = new AreaService(mockAreaRepository, mockProcessRepository);
    
    try {
      // Criar áreas usando mocks
      const area1 = await areaService.createArea({ name: 'Área Mock 1' });
      const area2 = await areaService.createArea({ name: 'Área Mock 2' });
      
      console.log('Área 1 criada:', area1);
      console.log('Área 2 criada:', area2);
      
      // Buscar todas as áreas
      const areas = await areaService.getAllAreas();
      console.log('Todas as áreas (mock):', areas);
      
      // Limpar dados de teste
      mockAreaRepository.clear();
      mockProcessRepository.clear();
      
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
  /**
   * Exemplo de como usar o container de dependências
   */
  static exampleWithDependencyContainer() {
    console.log('\n=== Exemplo com Container de Dependências ===');
    
    const { container } = require('../container/DependencyContainer');
    
    try {
      // Obter service do container
      const areaService = container.get('IAreaService');
      console.log('Service obtido do container:', typeof areaService);
      
      // Verificar se implementa a interface correta
      console.log('Tem método createArea:', typeof areaService.createArea === 'function');
      console.log('Tem método getAllAreas:', typeof areaService.getAllAreas === 'function');
      
    } catch (error) {
      console.error('Erro:', error);
    }
  }
}

// Executar exemplos se o arquivo for executado diretamente
if (require.main === module) {
  ServiceExample.exampleWithDependencyContainer();
}
