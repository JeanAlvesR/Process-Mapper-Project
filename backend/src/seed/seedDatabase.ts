import { AppDataSource } from '../config/database';
import { AreaRepository } from '../repositories/AreaRepository';
import { ProcessRepository } from '../repositories/ProcessRepository';

export const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    
    // Synchronize database schema (create tables if they don't exist)
    await AppDataSource.synchronize();
    
    const areaRepository = new AreaRepository();
    const processRepository = new ProcessRepository();

    // Clear existing data
    try {
      await AppDataSource.query('TRUNCATE TABLE processes CASCADE');
      await AppDataSource.query('TRUNCATE TABLE areas CASCADE');
    } catch (error) {
      console.log('Tables do not exist yet, they will be created by synchronize');
    }

    // Create areas
    const area1 = await areaRepository.create('Recursos Humanos', 'Responsável pela gestão de pessoas.');
    const area2 = await areaRepository.create('Tecnologia', 'Responsável pela infraestrutura e desenvolvimento de sistemas.');

    // Create processes for RH
    const process1 = await processRepository.create({
      name: 'Recrutamento e Seleção',
      description: 'Processo de contratação de novos colaboradores.',
      areaId: area1.id,
      type: 'manual',
      tools: 'Trello, Gupy',
      responsible: 'Equipe de RH',
      documentation: 'Link para o manual de recrutamento',
    });

    await processRepository.create({
      name: 'Definição de perfil da vaga',
      description: 'Definição dos requisitos e qualificações para a vaga.',
      areaId: area1.id,
      parentId: process1.id,
      type: 'manual',
    });

    await processRepository.create({
      name: 'Divulgação da vaga',
      description: 'Publicação da vaga em plataformas de emprego.',
      areaId: area1.id,
      parentId: process1.id,
      type: 'systemic',
      tools: 'LinkedIn, Infojobs',
    });

    // Create processes for Technology
    const process2 = await processRepository.create({
      name: 'Desenvolvimento de Software',
      description: 'Ciclo de vida de desenvolvimento de novas aplicações.',
      areaId: area2.id,
      type: 'systemic',
      tools: 'Jira, Git, VS Code',
      responsible: 'Equipe de Desenvolvimento',
      documentation: 'Confluence, Documentação de APIs',
    });

    await processRepository.create({
      name: 'Levantamento de Requisitos',
      description: 'Coleta e análise das necessidades dos usuários.',
      areaId: area2.id,
      parentId: process2.id,
      type: 'manual',
    });

    await processRepository.create({
      name: 'Codificação',
      description: 'Implementação do código fonte.',
      areaId: area2.id,
      parentId: process2.id,
      type: 'systemic',
    });

    console.log('✅ Database seeded successfully!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}; 