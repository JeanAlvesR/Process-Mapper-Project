import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Button } from './button'
import { Search, Filter, X } from 'lucide-react'

export function Filters({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  searchPlaceholder = "Buscar...",
  className = ""
}) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    const clearedFilters = {}
    Object.keys(filters).forEach(key => {
      if (key !== 'page') {
        clearedFilters[key] = ''
      }
    })
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    value !== '' && value !== undefined && value !== null && key !== 'page'
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de busca */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSearch()
              }
            }}
          />
        </div>
        <Button onClick={onSearch} size="sm">
          Buscar
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" size="sm">
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros específicos */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        
        {/* Ordenação */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <Select 
            value={filters.sortBy || 'createdAt'} 
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Data</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="updatedAt">Atualização</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.sortOrder || 'DESC'} 
            onValueChange={(value) => handleFilterChange('sortOrder', value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">A-Z</SelectItem>
              <SelectItem value="DESC">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Itens por página */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Por página:</span>
          <Select 
            value={filters.limit || '10'} 
            onValueChange={(value) => handleFilterChange('limit', value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
