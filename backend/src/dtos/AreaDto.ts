import { ProcessResponseDto } from './ProcessDto';

export interface CreateAreaDto {
  name: string;
  description?: string;
}

export interface UpdateAreaDto {
  name?: string;
  description?: string;
}

export interface AreaResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  processCount?: number;
}

export interface AreaWithProcessesDto extends AreaResponseDto {
  processes: ProcessResponseDto[];
}
