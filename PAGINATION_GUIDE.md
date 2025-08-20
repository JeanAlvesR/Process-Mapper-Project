# Guia de Paginação - Sistema de Gestão de Processos

## Visão Geral

Este documento descreve a implementação completa de paginação no sistema, incluindo backend e frontend, com queries otimizadas e interface responsiva.

## Backend - Implementação

### 1. DTOs de Paginação

**Arquivo:** `backend/src/dtos/PaginationDto.ts`

```typescript
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
```

### 2. Utilitários de Paginação

**Arquivo:** `backend/src/utils/pagination.ts`

- `calculatePaginationMeta()`: Calcula metadados de paginação
- `getPaginationParams()`: Extrai e valida parâmetros de paginação
- `buildSearchCondition()`: Constrói condições de busca

### 3. Repositórios Otimizados

#### AreaRepository
- `findWithPagination()`: Query otimizada com QueryBuilder
- Suporte a busca por nome e descrição
- Filtros específicos por campos
- Ordenação dinâmica

#### ProcessRepository
- `findWithPagination()`: Query otimizada com joins
- `findHierarchicalWithPagination()`: Paginação hierárquica
- Filtros por área, tipo, responsável
- Busca em múltiplos campos

### 4. Endpoints de Paginação

#### Áreas
```
GET /areas/paginated?page=1&limit=10&search=rh&sortBy=name&sortOrder=ASC
GET /areas/count
GET /areas/search/{name}?page=1&limit=10
```

#### Processos
```
GET /processes/paginated?page=1&limit=10&search=recrutamento&areaId=123&type=manual
GET /processes/hierarchical?page=1&limit=10&areaId=123
GET /processes/count
GET /processes/area/{areaId}/paginated?page=1&limit=10
GET /processes/area/{areaId}/count
```

## Frontend - Implementação

### 1. Serviços de API

**Arquivo:** `frontend/src/services/api.js`

```javascript
// Função auxiliar para construir query string
const buildPaginationQuery = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  return queryParams.toString();
};

// Serviços com paginação
export const areaService = {
  getPaginated: (params = {}) => {
    const query = buildPaginationQuery(params);
    const endpoint = query ? `/areas/paginated?${query}` : '/areas/paginated';
    return apiRequest(endpoint);
  },
  // ... outros métodos
};
```

### 2. Componentes Reutilizáveis

#### Pagination Component
**Arquivo:** `frontend/src/components/ui/pagination.jsx`

- Navegação entre páginas
- Informações de total de itens
- Botões de primeira/última página
- Números de página visíveis

#### Filters Component
**Arquivo:** `frontend/src/components/ui/filters.jsx`

- Barra de busca
- Ordenação (campo e direção)
- Itens por página
- Limpar filtros

### 3. Páginas Atualizadas

#### AreaManagement
- Estados de paginação e filtros
- Carregamento otimizado
- Atualização automática após operações
- Interface responsiva

#### ProcessManagement
- Filtros avançados por área
- Paginação hierárquica
- Busca em múltiplos campos
- Filtros específicos por tipo

## Queries Otimizadas

### 1. QueryBuilder para Áreas

```typescript
const queryBuilder = this.repository
  .createQueryBuilder('area')
  .leftJoinAndSelect('area.processes', 'processes')
  .orderBy(`area.${sortBy}`, sortOrder);

if (search) {
  queryBuilder.where(
    '(area.name ILIKE :search OR area.description ILIKE :search)',
    { search: `%${search}%` }
  );
}
```

### 2. QueryBuilder para Processos

```typescript
const queryBuilder = this.repository
  .createQueryBuilder('process')
  .leftJoinAndSelect('process.area', 'area')
  .leftJoinAndSelect('process.parent', 'parent')
  .leftJoinAndSelect('process.children', 'children')
  .orderBy(`process.${sortBy}`, sortOrder);

if (search) {
  queryBuilder.where(
    '(process.name ILIKE :search OR process.description ILIKE :search OR process.tools ILIKE :search OR process.responsible ILIKE :search)',
    { search: `%${search}%` }
  );
}
```

## Performance e Otimizações

### 1. Índices Recomendados

```sql
-- Para busca em áreas
CREATE INDEX idx_area_name ON areas(name);
CREATE INDEX idx_area_description ON areas(description);
CREATE INDEX idx_area_created_at ON areas(created_at);

-- Para busca em processos
CREATE INDEX idx_process_name ON processes(name);
CREATE INDEX idx_process_area_id ON processes(area_id);
CREATE INDEX idx_process_parent_id ON processes(parent_id);
CREATE INDEX idx_process_type ON processes(type);
CREATE INDEX idx_process_created_at ON processes(created_at);
```

### 2. Limites de Paginação

- Máximo: 100 itens por página
- Padrão: 10 itens por página
- Mínimo: 1 item por página

### 3. Cache de Metadados

- Contadores de total podem ser cacheados
- Metadados de paginação reutilizáveis
- Cache de queries frequentes

## Uso da API

### Exemplo de Requisição

```javascript
// Buscar áreas com paginação
const response = await areaService.getPaginated({
  page: 1,
  limit: 10,
  search: 'recursos humanos',
  sortBy: 'name',
  sortOrder: 'ASC'
});

// Resposta
{
  data: [...], // Array de áreas
  meta: {
    page: 1,
    limit: 10,
    totalItems: 25,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: false,
    nextPage: 2,
    previousPage: null
  }
}
```

### Exemplo de Filtros Avançados

```javascript
// Buscar processos com filtros
const response = await processService.getPaginated({
  page: 1,
  limit: 20,
  search: 'recrutamento',
  areaId: 'area-123',
  type: 'manual',
  responsible: 'João Silva',
  sortBy: 'createdAt',
  sortOrder: 'DESC'
});
```

## Benefícios da Implementação

### 1. Performance
- Queries otimizadas com QueryBuilder
- Paginação no banco de dados
- Índices apropriados
- Carregamento sob demanda

### 2. Experiência do Usuário
- Interface responsiva
- Filtros em tempo real
- Navegação intuitiva
- Feedback visual

### 3. Escalabilidade
- Suporte a grandes volumes de dados
- Queries eficientes
- Cache implementado
- Arquitetura modular

### 4. Manutenibilidade
- Código reutilizável
- Componentes modulares
- Documentação completa
- Padrões consistentes

## Próximos Passos

1. **Cache Redis**: Implementar cache para metadados
2. **Busca Full-Text**: Integrar Elasticsearch para busca avançada
3. **Exportação**: Adicionar exportação paginada
4. **Analytics**: Métricas de uso da paginação
5. **Testes**: Testes unitários e de integração

## Conclusão

A implementação de paginação foi feita de forma completa e otimizada, considerando tanto performance quanto experiência do usuário. O sistema agora suporta grandes volumes de dados de forma eficiente, mantendo a responsividade e usabilidade.
