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

export function AreaManagement() {
  const [areas, setAreas] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArea, setEditingArea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  // Carregar áreas da API
  useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      setLoading(true)
      const areasData = await areaService.getAll()
      setAreas(areasData)
    } catch (error) {
      console.error('Erro ao carregar áreas:', error)
      // Em caso de erro, tenta carregar do localStorage como fallback
      const savedAreas = localStorage.getItem('process-mapper-areas')
      if (savedAreas) {
        setAreas(JSON.parse(savedAreas))
      }
    } finally {
      setLoading(false)
    }
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
      } else {
        // Criar nova área
        const newArea = await areaService.create(formData)
        setAreas([...areas, newArea])
      }
      
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar área:', error)
      alert('Erro ao salvar área. Tente novamente.')
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

  const handleDelete = async (areaId) => {
    if (confirm('Tem certeza que deseja excluir esta área? Esta ação também removerá todos os processos associados.')) {
      try {
        await areaService.delete(areaId)
        setAreas(areas.filter(area => area.id !== areaId))
      } catch (error) {
        console.error('Erro ao deletar área:', error)
        alert('Erro ao deletar área. Tente novamente.')
      }
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

      {areas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma área cadastrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando a primeira área da sua empresa
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira área
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                      onClick={() => handleDelete(area.id)}
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
      )}
    </div>
  )
}

