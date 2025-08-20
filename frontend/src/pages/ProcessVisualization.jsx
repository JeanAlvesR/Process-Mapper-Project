import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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

export function ProcessVisualization() {
  const [areas, setAreas] = useState([])
  const [processes, setProcesses] = useState([])
  const [selectedArea, setSelectedArea] = useState('all')
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [expandAll, setExpandAll] = useState(false)
  const [loading, setLoading] = useState(true)

  // Carregar dados da API
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [areasData, processesData] = await Promise.all([
        areaService.getAll(),
        processService.getAll()
      ])
      setAreas(areasData)
      setProcesses(processesData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      // Em caso de erro, tenta carregar do localStorage como fallback
      const savedAreas = localStorage.getItem('process-mapper-areas')
      const savedProcesses = localStorage.getItem('process-mapper-processes')
      
      if (savedAreas) {
        setAreas(JSON.parse(savedAreas))
      }
      if (savedProcesses) {
        setProcesses(JSON.parse(savedProcesses))
      }
    } finally {
      setLoading(false)
    }
  }

  const getAreaName = (areaId) => {
    const area = areas.find(a => a.id === areaId)
    return area ? area.name : 'Área não encontrada'
  }

  const getProcessesByArea = () => {
    let filtered = processes
    
    if (selectedArea !== 'all') {
      filtered = filtered.filter(p => p.areaId === selectedArea)
    }
    
    return filtered
  }

  const getChildProcesses = (parentId) => {
    return getProcessesByArea().filter(p => p.parentId === parentId)
  }

  const getRootProcesses = () => {
    return getProcessesByArea().filter(p => !p.parentId)
  }

  const toggleExpanded = (processId) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(processId)) {
      newExpanded.delete(processId)
    } else {
      newExpanded.add(processId)
    }
    setExpandedNodes(newExpanded)
  }

  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedNodes(new Set())
    } else {
      const allProcessIds = new Set(getProcessesByArea().map(p => p.id))
      setExpandedNodes(allProcessIds)
    }
    setExpandAll(!expandAll)
  }

  const getProcessStats = () => {
    const filtered = getProcessesByArea()
    const manual = filtered.filter(p => p.type === 'manual').length
    const systemic = filtered.filter(p => p.type === 'systemic').length
    const total = filtered.length
    
    return { manual, systemic, total }
  }

  const ProcessNode = ({ process, level = 0 }) => {
    const children = getChildProcesses(process.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedNodes.has(process.id)
    const marginLeft = level * 20

    return (
      <div style={{ marginLeft: `${marginLeft}px` }}>
        <Card className="mb-2 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                {hasChildren ? (
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
                ) : (
                  <div className="w-6" />
                )}
                
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
                    <p className="text-muted-foreground">{process.tools}</p>
                  </div>
                </div>
              )}
              
              {process.responsible && (
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Responsáveis</p>
                    <p className="text-muted-foreground">{process.responsible}</p>
                  </div>
                </div>
              )}
              
              {process.documentation && (
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Documentação</p>
                    <p className="text-muted-foreground">{process.documentation}</p>
                  </div>
                </div>
              )}
            </div>
            
            {hasChildren && (
              <div className="mt-3 text-xs text-muted-foreground">
                {children.length} subprocesso{children.length !== 1 ? 's' : ''}
              </div>
            )}
          </CardContent>
        </Card>
        
        {hasChildren && isExpanded && (
          <div className="ml-4 border-l-2 border-muted pl-4">
            {children.map((child) => (
              <ProcessNode key={child.id} process={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Carregando visualização...</span>
        </div>
      </div>
    )
  }

  const stats = getProcessStats()
  const rootProcesses = getRootProcesses()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visualização de Processos</h1>
          <p className="text-muted-foreground">
            Visualize a hierarquia completa dos seus processos organizacionais
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={toggleExpandAll}
            className="flex items-center space-x-2"
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total de Processos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Processos Manuais</p>
                <p className="text-2xl font-bold">{stats.manual}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Processos Sistêmicos</p>
                <p className="text-2xl font-bold">{stats.systemic}</p>
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
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Label htmlFor="area-filter">Filtrar por área:</Label>
        <Select value={selectedArea} onValueChange={setSelectedArea}>
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

      {/* Árvore de Processos */}
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
        <div className="space-y-4">
          {rootProcesses
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((process) => (
              <ProcessNode key={process.id} process={process} />
            ))}
        </div>
      )}
    </div>
  )
}

