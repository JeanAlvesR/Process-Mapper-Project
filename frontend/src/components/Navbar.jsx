import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Building2, GitBranch, Eye, Home } from 'lucide-react'

export function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/areas', label: 'Áreas', icon: Building2 },
    { path: '/processes', label: 'Processos', icon: GitBranch },
    { path: '/visualization', label: 'Visualização', icon: Eye },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <GitBranch className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Process Mapper</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to={path} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

