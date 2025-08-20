import { PaginationQueryDto, PaginationMetaDto } from '../dtos/PaginationDto';

export function calculatePaginationMeta(
  totalItems: number,
  page: number,
  limit: number
): PaginationMetaDto {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null,
  };
}

export function getPaginationParams(query: PaginationQueryDto) {
  const page = Math.max(1, parseInt(query.page?.toString() || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit?.toString() || '10')));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    search: query.search?.trim(),
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder || 'DESC',
  };
}

export function buildSearchCondition(search: string, searchableFields: string[]) {
  if (!search) return {};

  const searchConditions = searchableFields.map(field => ({
    [field]: { $regex: search, $options: 'i' }
  }));

  return {
    $or: searchConditions
  };
}
