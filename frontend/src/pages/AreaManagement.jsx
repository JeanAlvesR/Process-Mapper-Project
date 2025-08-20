import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Building2, Loader2 } from 'lucide-react'
import { areaService } from '../services/api'
import { useNotifications } from '../hooks/useNotifications'
import { ConfirmDialog } from '../components/ui/confirm-dialog'
import { Pagination } from '../components/ui/pagination'
import { Filters } from '../components/ui/filters'
import { toast } from 'sonner'

export function AreaManagement() {
  const { showSuccess, showError, showInfo, showLoading, updateToast } = useNotifications()
  const [areas, setAreas] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArea, setEditingArea] = useState(null)
  const [loading, setLoading] = useState(true) // somente para carregamento inicial
  const [listLoading, setListLoading] = useState(false) // atualizações por filtro/paginação
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

  // Filtros editáveis (UI)
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    limit: '10',
    page: 1
  })
  // Filtros aplicados (requisições)
  const [appliedFilters, setAppliedFilters] = useState(filters)

  // Carregar áreas (inicial)
  useEffect(() => {
    loadAreas(false, true)
  }, [])

  // Carregar áreas quando filtros aplicados mudarem
  useEffect(() => {
    if (!loading) {
      loadAreas()
    }
  }, [appliedFilters])

  const loadAreas = async (showNotification = false, isInitial = false) => {
    try {
      if (isInitial) setLoading(true); else setListLoading(true)
      let loadingToast = null
      
      if (showNotification) {
        loadingToast = showLoading('Carregando áreas...')
      }
      
      const response = await areaService.getPaginated({
        ...appliedFilters,
        page: appliedFilters.page
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
      const savedAreas = localStorage.getItem('process-mapper-areas')
      if (savedAreas) {
        setAreas(JSON.parse(savedAreas))
        showInfo('Carregando dados salvos localmente')
      }
    } finally {
      if (isInitial) setLoading(false); else setListLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setAppliedFilters(prev => ({
      ...prev,
      page
    }))
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // não busca ainda; só ao clicar em Buscar
    }))
  }

  const handleSearch = () => {
    setAppliedFilters({
      ...filters,
      page: 1
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingArea) {
        const updatedArea = await areaService.update(editingArea.id, formData)
        setAreas(areas.map(area => 
          area.id === editingArea.id ? updatedArea : area
        ))
        
        toast.success(`Área "${formData.name}" atualizada!`, {
          description: 'As alterações foram salvas com sucesso.',
          icon: '✏️',
          duration: 4000
        })
      } else {
        const newArea = await areaService.create(formData)
        setAreas([...areas, newArea])
        
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
      setAreas(areas.filter(area => area.id !== deleteDialog.areaId))
      
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

      {listLoading && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Atualizando...
        </div>
      )}

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

