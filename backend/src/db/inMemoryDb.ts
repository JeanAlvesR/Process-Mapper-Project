import { v4 as uuidv4 } from 'uuid';

export interface Area {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Process {
  id: string;
  name: string;
  description?: string;
  areaId: string;
  parentId?: string;
  tools?: string;
  responsible?: string;
  documentation?: string;
  type: 'manual' | 'systemic';
  createdAt: string;
  updatedAt: string;
}

interface Database {
  areas: Area[];
  processes: Process[];
}

const db: Database = {
  areas: [],
  processes: [],
};

// --- Area CRUD Operations ---

export const createArea = (name: string, description?: string): Area => {
  const newArea: Area = {
    id: uuidv4(),
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.areas.push(newArea);
  return newArea;
};

export const getAreas = (): Area[] => {
  return db.areas;
};

export const getAreaById = (id: string): Area | undefined => {
  return db.areas.find((area) => area.id === id);
};

export const updateArea = (id: string, updates: Partial<Omit<Area, 'id' | 'createdAt'>>): Area | undefined => {
  const areaIndex = db.areas.findIndex((area) => area.id === id);
  if (areaIndex === -1) {
    return undefined;
  }
  db.areas[areaIndex] = { ...db.areas[areaIndex], ...updates, updatedAt: new Date().toISOString() };
  return db.areas[areaIndex];
};

export const deleteArea = (id: string): boolean => {
  const initialLength = db.areas.length;
  db.areas = db.areas.filter((area) => area.id !== id);
  // Also delete all processes associated with this area
  db.processes = db.processes.filter((process) => process.areaId !== id);
  return db.areas.length < initialLength;
};

// --- Process CRUD Operations ---

export const createProcess = (processData: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>): Process => {
  const newProcess: Process = {
    id: uuidv4(),
    ...processData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.processes.push(newProcess);
  return newProcess;
};

export const getProcesses = (): Process[] => {
  return db.processes;
};

export const getProcessById = (id: string): Process | undefined => {
  return db.processes.find((process) => process.id === id);
};

export const updateProcess = (id: string, updates: Partial<Omit<Process, 'id' | 'createdAt'>>): Process | undefined => {
  const processIndex = db.processes.findIndex((process) => process.id === id);
  if (processIndex === -1) {
    return undefined;
  }
  db.processes[processIndex] = { ...db.processes[processIndex], ...updates, updatedAt: new Date().toISOString() };
  return db.processes[processIndex];
};

export const deleteProcess = (id: string): boolean => {
  const initialLength = db.processes.length;
  const processToDelete = db.processes.find(p => p.id === id);

  if (!processToDelete) {
    return false;
  }

  // Recursively delete child processes
  const deleteChildren = (parentId: string) => {
    const children = db.processes.filter(p => p.parentId === parentId);
    children.forEach(child => deleteChildren(child.id));
    db.processes = db.processes.filter(p => p.parentId !== parentId);
  };

  deleteChildren(id);
  db.processes = db.processes.filter(p => p.id !== id);

  return db.processes.length < initialLength;
};

// --- H2-like Console Simulation (for demonstration) ---

export const getDbState = (): Database => {
  return JSON.parse(JSON.stringify(db)); // Return a deep copy to prevent external modification
};

export const resetDb = (): void => {
  db.areas = [];
  db.processes = [];
};

export const seedDb = (): void => {
  resetDb();

  const area1 = createArea('Recursos Humanos', 'Responsável pela gestão de pessoas.');
  const area2 = createArea('Tecnologia', 'Responsável pela infraestrutura e desenvolvimento de sistemas.');

  const process1 = createProcess({
    name: 'Recrutamento e Seleção',
    description: 'Processo de contratação de novos colaboradores.',
    areaId: area1.id,
    type: 'manual',
    tools: 'Trello, Gupy',
    responsible: 'Equipe de RH',
    documentation: 'Link para o manual de recrutamento',
  });

  createProcess({
    name: 'Definição de perfil da vaga',
    description: 'Definição dos requisitos e qualificações para a vaga.',
    areaId: area1.id,
    parentId: process1.id,
    type: 'manual',
  });

  createProcess({
    name: 'Divulgação da vaga',
    description: 'Publicação da vaga em plataformas de emprego.',
    areaId: area1.id,
    parentId: process1.id,
    type: 'systemic',
    tools: 'LinkedIn, Infojobs',
  });

  const process2 = createProcess({
    name: 'Desenvolvimento de Software',
    description: 'Ciclo de vida de desenvolvimento de novas aplicações.',
    areaId: area2.id,
    type: 'systemic',
    tools: 'Jira, Git, VS Code',
    responsible: 'Equipe de Desenvolvimento',
    documentation: 'Confluence, Documentação de APIs',
  });

  createProcess({
    name: 'Levantamento de Requisitos',
    description: 'Coleta e análise das necessidades dos usuários.',
    areaId: area2.id,
    parentId: process2.id,
    type: 'manual',
  });

  createProcess({
    name: 'Codificação',
    description: 'Implementação do código fonte.',
    areaId: area2.id,
    parentId: process2.id,
    type: 'systemic',
  });

  console.log('Database seeded with sample data.');
};

