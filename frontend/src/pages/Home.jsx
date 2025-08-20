import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, GitBranch, Eye, ArrowRight } from 'lucide-react'

export function Home() {
  const features = [
    {
      title: 'Gestão de Áreas',
      description: 'Cadastre e organize as diferentes áreas da sua empresa',
      icon: Building2,
      path: '/areas',
      color: 'text-blue-600'
    },
    {
      title: 'Processos e Subprocessos',
      description: 'Mapeie processos complexos com hierarquia ilimitada',
      icon: GitBranch,
      path: '/processes',
      color: 'text-green-600'
    },
    {
      title: 'Visualização Interativa',
      description: 'Visualize a cadeia de processos de forma clara e intuitiva',
      icon: Eye,
      path: '/visualization',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Mapeamento de Processos Empresariais
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Organize, documente e visualize os processos da sua empresa de forma clara e estruturada.
          Identifique fluxos, ferramentas e responsabilidades em uma interface intuitiva.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.path} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
                <CardTitle>{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="save">
                <Link to={feature.path} className="flex items-center justify-center space-x-2">
                  <span>Acessar</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Como funciona?</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium">1. Cadastre Áreas</div>
            <p className="text-muted-foreground">
              Defina as diferentes áreas da sua empresa (RH, Vendas, TI, etc.)
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-medium">2. Mapeie Processos</div>
            <p className="text-muted-foreground">
              Crie processos e subprocessos com detalhes sobre ferramentas e responsáveis
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-medium">3. Visualize</div>
            <p className="text-muted-foreground">
              Explore a hierarquia de processos de forma visual e interativa
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

