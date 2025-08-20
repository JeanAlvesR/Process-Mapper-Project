import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Building2, Loader2, Settings, Eye } from 'lucide-react'
import { areaService } from '../services/api'
import { useNotifications } from '../hooks/useNotifications'
import { ConfirmDialog } from '../components/ui/confirm-dialog'
import { Pagination } from '../components/ui/pagination'
import { Filters } from '../components/ui/filters'
import { toast } from 'sonner'

export function AreaManagement() {
  const { showSuccess, showError, showInfo, showLoading, updateToast, showTopLeft, showBottomRight } = useNotifications()
  const [areas, setAreas] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArea, setEditingArea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    areaId: null,
    areaName: ''
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
    page: 1
  })

  // Carregar áreas da API
  useEffect(() => {
    loadAreas()
  }, [filters])

  const loadAreas = async (showNotification = false) => {
    try {
      setLoading(true)
      let loadingToast = null
      
      if (showNotification) {
        loadingToast = showLoading('Carregando áreas...')
      }
      
      const response = await areaService.getPaginated({
        ...filters,
        page: filters.page
      })
      
      setAreas(response.data)
      setPagination({
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        itemsPerPage: response.meta.limit
      })
      
      if (showNotification && loadingToast) {
        updateToast(loadingToast, `${response.data.length} áreas carregadas com sucesso!`, 'success')
      }
    } catch (error) {
      console.error('Erro ao carregar áreas:', error)
      showError('Erro ao carregar áreas. Verificando dados locais...')
      // Em caso de erro, tenta carregar do localStorage como fallback
      const savedAreas = localStorage.getItem('process-mapper-areas')
      if (savedAreas) {
        setAreas(JSON.parse(savedAreas))
        showInfo('Carregando dados salvos localmente')
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingArea) {
        // Editar área existente
        const updatedArea = await areaService.update(editingArea.id, formData)
        setAreas(areas.map(area => 
          area.id === editingArea.id ? updatedArea : area
        ))
        
        // Notificação com ícone customizado
        toast.success(`Área "${formData.name}" atualizada!`, {
          description: 'As alterações foram salvas com sucesso.',
          icon: '✏️',
          duration: 4000
        })
      } else {
        // Criar nova área
        const newArea = await areaService.create(formData)
        setAreas([...areas, newArea])
        
        // Notificação com ícone customizado
        toast.success(`Área "${formData.name}" criada!`, {
          description: 'Nova área adicionada ao sistema.',
          icon: '✨',
          duration: 4000
        })
      }
      
      resetForm()
      // Recarregar dados para atualizar paginação
      loadAreas()
    } catch (error) {
      console.error('Erro ao salvar área:', error)
      
      // Notificação de erro com ícone
      toast.error('Erro ao salvar área', {
        description: 'Verifique se todos os campos estão preenchidos corretamente.',
        icon: '⚠️',
        duration: 6000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setEditingArea(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (area) => {
    setEditingArea(area)
    setFormData({
      name: area.name,
      description: area.description || ''
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (areaId) => {
    const areaToDelete = areas.find(area => area.id === areaId)
    setDeleteDialog({
      isOpen: true,
      areaId,
      areaName: areaToDelete?.name || ''
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      await areaService.delete(deleteDialog.areaId)
      const deletedArea = areas.find(area => area.id === deleteDialog.areaId)
      setAreas(areas.filter(area => area.id !== deleteDialog.areaId))
      
      // Notificação simples sem ação de restaurar
      toast.success(`Área "${deleteDialog.areaName}" excluída com sucesso!`)
      
      // Recarregar dados para atualizar paginação
      loadAreas()
    } catch (error) {
      console.error('Erro ao deletar área:', error)
      if (error?.status === 409) {
        const dependents = error?.data?.dependents
        toast.error('Não é possível excluir a área', {
          description: dependents !== undefined 
            ? `Existem ${dependents} processo(s) dependentes.`
            : 'A área possui processos dependentes.',
          icon: '⚠️'
        })
      } else {
        showError('Erro ao deletar área. Tente novamente.')
      }
    } finally {
      setDeleteDialog({ isOpen: false, areaId: null, areaName: '' })
    }
  }

  const handleBatchOperation = async () => {
    const toastId = toast.loading('Iniciando operação em lote...', {
      description: '0%'
    })
    
    try {
      // Simula uma operação em lote com progresso
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200)) // Simula delay
        toast.loading('Processando áreas...', {
          id: toastId,
          description: `${i}%`
        })
      }
      
      toast.success('Operação em lote concluída!', {
        id: toastId,
        description: `${areas.length} áreas processadas com sucesso.`,
        icon: '✅'
      })
    } catch (error) {
      toast.error('Erro na operação em lote', {
        id: toastId,
        description: 'Tente novamente mais tarde.',
        icon: '❌'
      })
    }
  }

  const handlePositionDemo = () => {
    // Demonstra notificações em diferentes posições
    showTopLeft('Notificação no canto superior esquerdo', 'info')
    
    setTimeout(() => {
      showBottomRight('Notificação no canto inferior direito', 'success')
    }, 500)
    
    setTimeout(() => {
      toast.warning('Notificação no canto superior direito', {
        position: 'top-right',
        icon: '⚠️'
      })
    }, 1000)
    
    setTimeout(() => {
      toast.error('Notificação no canto inferior esquerdo', {
        position: 'bottom-left',
        icon: '❌'
      })
    }, 1500)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Carregando áreas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Áreas</h1>
          <p className="text-muted-foreground">
            Cadastre e organize as diferentes áreas da sua empresa
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => loadAreas(true)}
            disabled={loading}
          >
            <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recarregar
          </Button>
          
          <Button
            variant="outline"
            onClick={handleBatchOperation}
            disabled={loading || areas.length === 0}
          >
            <Settings className="h-4 w-4 mr-2" />
            Operação em Lote
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePositionDemo}
            disabled={loading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Demo Posições
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Área
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingArea ? 'Editar Área' : 'Nova Área'}
              </DialogTitle>
              <DialogDescription>
                {editingArea 
                  ? 'Edite as informações da área selecionada'
                  : 'Preencha as informações para criar uma nova área'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Área</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Recursos Humanos"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva as responsabilidades e objetivos desta área"
                  rows={3}
                  disabled={submitting}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingArea ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    editingArea ? 'Salvar' : 'Criar'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Filters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        searchPlaceholder="Buscar áreas por nome ou descrição..."
      />

      {areas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma área encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              {filters.search ? 'Tente ajustar os filtros de busca' : 'Comece criando a primeira área da sua empresa'}
            </p>
            {!filters.search && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira área
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area) => (
              <Card key={area.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span>{area.name}</span>
                      </CardTitle>
                      {area.description && (
                        <CardDescription className="mt-2">
                          {area.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      Criada em {new Date(area.createdAt).toLocaleDateString()}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(area)}
                        disabled={submitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(area.id)}
                        disabled={submitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, areaId: null, areaName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir a área "${deleteDialog.areaName}"? Esta ação também removerá todos os processos associados e não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}

