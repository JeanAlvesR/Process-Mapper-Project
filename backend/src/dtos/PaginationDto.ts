export interface PaginationQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationMetaDto {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}

export interface AreaPaginationQueryDto extends PaginationQueryDto {
  name?: string;
  description?: string;
}

export interface ProcessPaginationQueryDto extends PaginationQueryDto {
  areaId?: string;
  parentId?: string;
  type?: 'manual' | 'systemic';
  responsible?: string;
}
