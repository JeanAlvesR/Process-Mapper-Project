import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Edit, Trash2, GitBranch, Building2, Users, FileText, Settings, Loader2 } from 'lucide-react'
import { areaService, processService } from '../services/api'
import { useNotifications } from '../hooks/useNotifications'
import { ConfirmDialog } from '../components/ui/confirm-dialog'
import { Pagination } from '../components/ui/pagination'
import { Filters } from '../components/ui/filters'

export function ProcessManagement() {
  const { showSuccess, showError, showInfo } = useNotifications()
  const [areas, setAreas] = useState([])
  const [processes, setProcesses] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState(null)
  const [selectedArea, setSelectedArea] = useState('all')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    areaId: '',
    parentId: '',
    tools: '',
    responsible: '',
    documentation: '',
    type: 'manual' // manual ou systemic
  })
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    processId: null,
    processName: ''
  })

  // Estados de paginação
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  // Estados de filtros
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    limit: '10',
    page: 1,
    areaId: '',
    type: '',
    responsible: ''
  })

  // Carregar dados da API
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (areas.length > 0) {
      loadProcesses()
    }
  }, [filters, areas])

  const loadData = async () => {
    try {
      setLoading(true)
      const areasData = await areaService.getAll()
      setAreas(areasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      showError('Erro ao carregar dados. Verificando dados locais...')
      // Em caso de erro, tenta carregar do localStorage como fallback
      const savedAreas = localStorage.getItem('process-mapper-areas')
      const savedProcesses = localStorage.getItem('process-mapper-processes')
      
      if (savedAreas) {
        setAreas(JSON.parse(savedAreas))
      }
      if (savedProcesses) {
        setProcesses(JSON.parse(savedProcesses))
        showInfo('Carregando dados salvos localmente')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadProcesses = async () => {
    try {
      setLoading(true)
      
      const response = await processService.getPaginated({
        ...filters,
        page: filters.page
      })
      
      setProcesses(response.data)
      setPagination({
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        itemsPerPage: response.meta.limit
      })
    } catch (error) {
      console.error('Erro ao carregar processos:', error)
      showError('Erro ao carregar processos')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }))
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset para primeira página ao mudar filtros
    }))
  }

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1
    }))
  }

  const handleAreaFilterChange = (areaId) => {
    setSelectedArea(areaId)
    setFilters(prev => ({
      ...prev,
      areaId: areaId === 'all' ? '' : areaId,
      page: 1
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingProcess) {
        // Editar processo existente
        const updatedProcess = await processService.update(editingProcess.id, formData)
        setProcesses(processes.map(process => 
          process.id === editingProcess.id ? updatedProcess : process
        ))
        showSuccess(`Processo "${formData.name}" atualizado com sucesso!`)
      } else {
        // Criar novo processo
        const newProcess = await processService.create(formData)
        setProcesses([...processes, newProcess])
        showSuccess(`Processo "${formData.name}" criado com sucesso!`)
      }
      
      resetForm()
      setIsDialogOpen(false)
      // Recarregar dados para atualizar paginação
      loadProcesses()
    } catch (error) {
      console.error('Erro ao salvar processo:', error)
      showError('Erro ao salvar processo. Verifique se todos os campos obrigatórios estão preenchidos corretamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (process) => {
    setEditingProcess(process)
    setFormData({
      name: process.name,
      description: process.description || '',
      areaId: process.areaId,
      parentId: process.parentId || '',
      tools: process.tools || '',
      responsible: process.responsible || '',
      documentation: process.documentation || '',
      type: process.type || 'manual'
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (processId) => {
    const processToDelete = processes.find(process => process.id === processId)
    setDeleteDialog({
      isOpen: true,
      processId,
      processName: processToDelete?.name || ''
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      await processService.delete(deleteDialog.processId)
      // Remove o processo e seus filhos da lista local
      const removeProcessAndChildren = (id) => {
        const children = processes.filter(p => p.parentId === id)
        children.forEach(child => removeProcessAndChildren(child.id))
        setProcesses(prev => prev.filter(p => p.id !== id))
      }
      removeProcessAndChildren(deleteDialog.processId)
      showSuccess(`Processo "${deleteDialog.processName}" excluído com sucesso!`)
      
      // Recarregar dados para atualizar paginação
      loadProcesses()
    } catch (error) {
      console.error('Erro ao deletar processo:', error)
      if (error?.status === 409) {
        const dependents = error?.data?.dependents
        showError(dependents !== undefined 
          ? `Não é possível excluir. Existem ${dependents} subprocesso(s) dependentes.`
          : 'Não é possível excluir. O processo possui subprocessos dependentes.'
        )
      } else {
        showError('Erro ao deletar processo. Tente novamente.')
      }
    } finally {
      setDeleteDialog({ isOpen: false, processId: null, processName: '' })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      areaId: '',
      parentId: '',
      tools: '',
      responsible: '',
      documentation: '',
      type: 'manual'
    })
    setEditingProcess(null)
  }

  const getAreaName = (areaId) => {
    const area = areas.find(a => a.id === areaId)
    return area ? area.name : 'Área não encontrada'
  }

  const getParentName = (parentId) => {
    const parent = processes.find(p => p.id === parentId)
    return parent ? parent.name : ''
  }

  const getProcessLevel = (process) => {
    let level = 0
    let currentProcess = process
    
    while (currentProcess.parentId) {
      level++
      currentProcess = processes.find(p => p.id === currentProcess.parentId)
      if (!currentProcess) break
    }
    
    return level
  }

  const getAvailableParents = () => {
    if (!formData.areaId) return []
    
    return processes.filter(p => 
      p.areaId === formData.areaId && 
      (!editingProcess || p.id !== editingProcess.id)
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Carregando processos...</span>
        </div>
      </div>
    )
  }

  const labelStyle = {
    paddingBottom: '5px',
    display: 'inline-block'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Processos</h1>
          <p className="text-muted-foreground">
            Mapeie processos e subprocessos com hierarquia ilimitada
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} disabled={areas.length === 0 || submitting}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProcess ? 'Editar Processo' : 'Novo Processo'}
              </DialogTitle>
              <DialogDescription>
                {editingProcess 
                  ? 'Edite as informações do processo selecionado'
                  : 'Preencha as informações para criar um novo processo'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" style={labelStyle}>Nome do Processo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Recrutamento e Seleção"
                    required
                    disabled={submitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type" style={labelStyle}>Tipo</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="systemic">Sistêmico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" style={labelStyle}>Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o objetivo e escopo deste processo"
                  rows={3}
                  disabled={submitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="areaId" style={labelStyle}>Área</Label>
                  <Select 
                    value={formData.areaId} 
                    onValueChange={(value) => setFormData({ ...formData, areaId: value, parentId: '' })}
                    required
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="parentId" style={labelStyle}>Processo Pai (Opcional)</Label>
                  <Select 
                    value={formData.parentId} 
                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum (processo principal)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum (processo principal)</SelectItem>
                      {getAvailableParents().map((process) => (
                        <SelectItem key={process.id} value={process.id}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="tools" style={labelStyle}>Ferramentas Utilizadas</Label>
                <Input
                  id="tools"
                  value={formData.tools}
                  onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                  placeholder="Ex: Trello, Notion, Excel"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <Label htmlFor="responsible" style={labelStyle}>Responsáveis</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  placeholder="Ex: Equipe de RH, João Silva"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <Label htmlFor="documentation" style={labelStyle}>Documentação Associada</Label>
                <Textarea
                  id="documentation"
                  value={formData.documentation}
                  onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                  placeholder="Links, arquivos ou descrição da documentação relacionada"
                  rows={2}
                  disabled={submitting}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingProcess ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    editingProcess ? 'Salvar' : 'Criar'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {areas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma área cadastrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Você precisa cadastrar pelo menos uma área antes de criar processos
            </p>
            <Button asChild>
              <a href="/areas">Cadastrar Áreas</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filtros */}
          <Filters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            searchPlaceholder="Buscar processos por nome, descrição, ferramentas ou responsáveis..."
          />

          {/* Filtro por área */}
          <div className="flex items-center space-x-4">
            <Label htmlFor="area-filter" style={labelStyle}>Filtrar por área:</Label>
            <Select value={selectedArea} onValueChange={handleAreaFilterChange}>
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

          {processes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum processo encontrado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {filters.search || selectedArea !== 'all' ? 'Tente ajustar os filtros de busca' : 'Comece criando o primeiro processo'}
                </p>
                {!filters.search && selectedArea === 'all' && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeiro processo
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {processes.map((process) => {
                  const level = getProcessLevel(process)
                  const marginLeft = level * 24
                  
                  return (
                    <Card key={process.id} className="hover:shadow-md transition-shadow" style={{ marginLeft: `${marginLeft}px` }}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center space-x-2">
                              {process.type === 'systemic' ? (
                                <Settings className="h-5 w-5 text-blue-600" />
                              ) : (
                                <GitBranch className="h-5 w-5 text-green-600" />
                              )}
                              <span>{process.name}</span>
                              <Badge variant={process.type === 'systemic' ? 'default' : 'secondary'}>
                                {process.type === 'systemic' ? 'Sistêmico' : 'Manual'}
                              </Badge>
                            </CardTitle>
                            
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Building2 className="h-4 w-4" />
                                <span>{getAreaName(process.areaId)}</span>
                              </div>
                              {process.parentId && (
                                <div className="flex items-center space-x-1">
                                  <GitBranch className="h-4 w-4" />
                                  <span>Subprocesso de: {getParentName(process.parentId)}</span>
                                </div>
                              )}
                            </div>
                            
                            {process.description && (
                              <CardDescription className="mt-2">
                                {process.description}
                              </CardDescription>
                            )}
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(process)}
                              disabled={submitting}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClick(process.id)}
                              disabled={submitting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {process.tools && (
                            <div className="flex items-center space-x-2">
                              <Settings className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Ferramentas</p>
                                <p className="text-muted-foreground">{process.tools}</p>
                              </div>
                            </div>
                          )}
                          
                          {process.responsible && (
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Responsáveis</p>
                                <p className="text-muted-foreground">{process.responsible}</p>
                              </div>
                            </div>
                          )}
                          
                          {process.documentation && (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Documentação</p>
                                <p className="text-muted-foreground">{process.documentation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 text-xs text-muted-foreground">
                          Criado em {new Date(process.createdAt).toLocaleDateString('pt-BR')}
                          {process.updatedAt !== process.createdAt && (
                            <span> • Atualizado em {new Date(process.updatedAt).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Paginação */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                className="mt-6"
              />
            </>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, processId: null, processName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir o processo "${deleteDialog.processName}"? Todos os subprocessos também serão excluídos e esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}

