import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  GitBranch, 
  Settings, 
  Users, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Eye,
  Expand,
  Minimize,
  Loader2
} from 'lucide-react'
import { areaService, processService } from '../services/api'
import { useNotifications } from '../hooks/useNotifications'
import { Pagination } from '@/components/ui/pagination'

export function ProcessVisualization() {
  const { showError, showInfo } = useNotifications()
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState('all')

  // Raízes paginadas
  const [rootProcesses, setRootProcesses] = useState([])
  const [rootLoading, setRootLoading] = useState(true)
  const [rootPage, setRootPage] = useState(1)
  const [rootLimit, setRootLimit] = useState(10)
  const [rootMeta, setRootMeta] = useState({ page: 1, limit: 10, totalItems: 0, totalPages: 1 })

  // Cache de filhos por nó: { [parentId]: { items, meta, loading } }
  const [childrenCache, setChildrenCache] = useState({})

  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [expandAll, setExpandAll] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  // Carregar áreas na montagem
  useEffect(() => {
    loadAreas()
  }, [])

  // Carregar raízes e contagem ao mudar filtro/página
  useEffect(() => {
    loadRootProcesses()
    loadTotalCount()
  }, [selectedArea, rootPage, rootLimit])

  const loadAreas = async () => {
    try {
      const areasData = await areaService.getAll()
      setAreas(areasData)
    } catch (error) {
      console.error('Erro ao carregar áreas:', error)
      showError('Erro ao carregar áreas. Verificando dados locais...')
      const savedAreas = localStorage.getItem('process-mapper-areas')
      if (savedAreas) {
        setAreas(JSON.parse(savedAreas))
      }
    }
  }

  const loadRootProcesses = async () => {
    try {
      setRootLoading(true)
      const params = {
        page: rootPage,
        limit: rootLimit,
        sortBy: 'name',
        sortOrder: 'ASC',
        parentId: 'null',
      }
      if (selectedArea !== 'all') params.areaId = selectedArea

      const res = await processService.getPaginated(params)
      setRootProcesses(res.data || [])
      setRootMeta(res.meta || { page: rootPage, limit: rootLimit, totalItems: 0, totalPages: 1 })
    } catch (error) {
      console.error('Erro ao carregar processos raiz:', error)
      showError('Erro ao carregar processos')
    } finally {
      setRootLoading(false)
    }
  }

  const loadTotalCount = async () => {
    try {
      if (selectedArea === 'all') {
        const res = await processService.getCount()
        setTotalCount(res?.count ?? 0)
      } else {
        const res = await processService.getCountByArea(selectedArea)
        setTotalCount(res?.count ?? 0)
      }
    } catch (e) {
      setTotalCount(0)
    }
  }

  const getAreaName = (areaId) => {
    const area = areas.find(a => a.id === areaId)
    return area ? area.name : 'Área não encontrada'
  }

  const toggleExpanded = async (processId) => {
    const newExpanded = new Set(expandedNodes)
    const willExpand = !newExpanded.has(processId)
    if (willExpand) newExpanded.add(processId); else newExpanded.delete(processId)
    setExpandedNodes(newExpanded)

    // Carregar filhos sob demanda quando expandir
    if (willExpand) {
      if (!childrenCache[processId] || !childrenCache[processId].items) {
        await loadChildren(processId, 1)
      }
    }
  }

  const loadChildren = async (parentId, page = 1, limit = 10) => {
    setChildrenCache(prev => ({
      ...prev,
      [parentId]: { ...(prev[parentId] || {}), loading: true }
    }))
    try {
      const params = {
        page,
        limit,
        sortBy: 'name',
        sortOrder: 'ASC',
        parentId,
      }
      // Opcionalmente restringe por área selecionada
      if (selectedArea !== 'all') params.areaId = selectedArea

      const res = await processService.getPaginated(params)

      setChildrenCache(prev => ({
        ...prev,
        [parentId]: {
          items: res.data || [],
          meta: res.meta || { page, limit, totalItems: 0, totalPages: 1 },
          loading: false,
        }
      }))
    } catch (error) {
      console.error('Erro ao carregar filhos:', error)
      setChildrenCache(prev => ({
        ...prev,
        [parentId]: { items: [], meta: { page, limit, totalItems: 0, totalPages: 1 }, loading: false }
      }))
    }
  }

  const toggleExpandAll = async () => {
    if (expandAll) {
      setExpandedNodes(new Set())
      setExpandAll(false)
      return
    }
    // Expandir todos os nós visíveis (somente raízes) e carregar seus filhos
    const expanded = new Set(rootProcesses.map(p => p.id))
    setExpandedNodes(expanded)
    setExpandAll(true)
    // Carregar filhos para cada raiz
    await Promise.all(rootProcesses.map(p => (
      !childrenCache[p.id]?.items ? loadChildren(p.id, 1) : Promise.resolve()
    )))
  }

  const ProcessNode = ({ process, level = 0 }) => {
    const cache = childrenCache[process.id] || {}
    const isExpanded = expandedNodes.has(process.id)
    const marginLeft = level * 20

    const children = cache.items || []
    const childMeta = cache.meta || { page: 1, limit: 10, totalItems: 0, totalPages: 1 }
    const childLoading = !!cache.loading

    const handleChildPageChange = (page) => {
      loadChildren(process.id, page, childMeta.limit)
    }

    return (
      <div style={{ marginLeft: `${marginLeft}px` }}>
        <Card className="mb-2 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(process.id)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                
                {process.type === 'systemic' ? (
                  <Settings className="h-5 w-5 text-blue-600" />
                ) : (
                  <GitBranch className="h-5 w-5 text-green-600" />
                )}
                
                <CardTitle className="text-base">{process.name}</CardTitle>
                
                <Badge variant={process.type === 'systemic' ? 'default' : 'secondary'}>
                  {process.type === 'systemic' ? 'Sistêmico' : 'Manual'}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{getAreaName(process.areaId)}</span>
              </div>
            </div>
            
            {process.description && (
              <CardDescription className="mt-2">
                {process.description}
              </CardDescription>
            )}
          </CardHeader>

          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {process.tools && (
                <div className="flex items-start space-x-2">
                  <Settings className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Ferramentas</p>
                    <p className="text-muted-foreground break-words">{process.tools}</p>
                  </div>
                </div>
              )}
              
              {process.responsible && (
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Responsáveis</p>
                    <p className="text-muted-foreground break-words">{process.responsible}</p>
                  </div>
                </div>
              )}
              
              {process.documentation && (
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Documentação</p>
                    <p className="text-muted-foreground break-words">{process.documentation}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Criado em {new Date(process.createdAt).toLocaleDateString('pt-BR')}
              {process.updatedAt && process.updatedAt !== process.createdAt && (
                <span> • Atualizado em {new Date(process.updatedAt).toLocaleDateString('pt-BR')}</span>
              )}
            </div>

            
            {isExpanded && (
              <div className="pt-3">
                {childLoading ? (
                  <div className="flex items-center py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Carregando subprocessos...
                  </div>
                ) : (
                  <>
                    {children.length === 0 ? (
                      <div className="py-2 text-sm text-muted-foreground">Sem subprocessos</div>
                    ) : (
                      <div className="ml-4 border-l-2 border-muted pl-4">
                        {children.map((child) => (
                          <ProcessNode key={child.id} process={child} level={level + 1} />
                        ))}
                        <Pagination
                          currentPage={childMeta.page}
                          totalPages={childMeta.totalPages}
                          totalItems={childMeta.totalItems}
                          itemsPerPage={childMeta.limit}
                          onPageChange={handleChildPageChange}
                          className="mt-3"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (rootLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Carregando visualização...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visualização de Processos</h1>
          <p className="text-muted-foreground">
            Visualize a hierarquia dos processos. Pais primeiro; filhos sob demanda ao expandir.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={toggleExpandAll}
            className="flex items-center space-x-2"
            disabled={rootProcesses.length === 0}
          >
            {expandAll ? (
              <>
                <Minimize className="h-4 w-4" />
                <span>Recolher Todos</span>
              </>
            ) : (
              <>
                <Expand className="h-4 w-4" />
                <span>Expandir Todos</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Estatísticas básicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total de Processos</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Áreas Ativas</p>
                <p className="text-2xl font-bold">{areas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div />
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Label htmlFor="area-filter">Filtrar por área:</Label>
        <Select value={selectedArea} onValueChange={(val) => { setSelectedArea(val); setRootPage(1); setExpandedNodes(new Set()); setChildrenCache({}); setExpandAll(false); }}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Raízes paginadas */}
      {rootProcesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Eye className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum processo para visualizar</h3>
            <p className="text-muted-foreground text-center mb-4">
              {selectedArea === 'all' 
                ? 'Não há processos cadastrados ainda'
                : 'Não há processos cadastrados para a área selecionada'
              }
            </p>
            <Button asChild>
              <a href="/processes">Cadastrar Processos</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {rootProcesses.map((process) => (
              <ProcessNode key={process.id} process={process} />
            ))}
          </div>
          <Pagination
            currentPage={rootMeta.page}
            totalPages={rootMeta.totalPages}
            totalItems={rootMeta.totalItems}
            itemsPerPage={rootMeta.limit}
            onPageChange={(p) => setRootPage(p)}
            className="mt-6"
          />
        </>
      )}
    </div>
  )
}

