export interface CreateProcessDto {
  name: string;
  description?: string;
  areaId: string;
  parentId?: string;
  tools?: string;
  responsible?: string;
  documentation?: string;
  type: 'manual' | 'systemic';
}

export interface UpdateProcessDto {
  name?: string;
  description?: string;
  areaId?: string;
  parentId?: string;
  tools?: string;
  responsible?: string;
  documentation?: string;
  type?: 'manual' | 'systemic';
}

export interface ProcessResponseDto {
  id: string;
  name: string;
  description?: string;
  areaId: string;
  parentId?: string;
  tools?: string;
  responsible?: string;
  documentation?: string;
  type: 'manual' | 'systemic';
  createdAt: Date;
  updatedAt: Date;
  area?: {
    id: string;
    name: string;
  };
  parent?: {
    id: string;
    name: string;
  };
  children?: ProcessResponseDto[];
  childrenCount?: number;
}

export interface ProcessWithDetailsDto extends ProcessResponseDto {
  area: {
    id: string;
    name: string;
    description?: string;
  };
  parent?: {
    id: string;
    name: string;
    description?: string;
  };
  children: ProcessResponseDto[];
}
