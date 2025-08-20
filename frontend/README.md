# 🎨 Process Mapper Frontend

> **Interface moderna e responsiva para gestão de processos organizacionais com foco em performance e experiência do usuário**

## 🚀 Visão Geral

O frontend do Process Mapper é uma aplicação React moderna desenvolvida com as melhores práticas de performance e UX. Utiliza tecnologias de ponta como **Vite**, **TailwindCSS 4**, **Radix UI** e **React 19** para oferecer uma experiência de usuário excepcional.

## ✨ Características Principais

- 🎯 **Interface Intuitiva**: Design limpo e navegação fluida
- 📱 **Totalmente Responsivo**: Adaptável a todos os dispositivos
- 🚀 **Performance Otimizada**: Carregamento rápido e operações eficientes
- ♿ **Acessibilidade**: Componentes Radix UI com suporte a screen readers
- 🎨 **Design System**: Sistema de design consistente com TailwindCSS
- 🔄 **Estado Real-time**: Atualizações em tempo real dos dados

## 🏗️ Arquitetura Frontend

```
frontend/
├── 📁 src/
│   ├── 📁 components/           # Componentes reutilizáveis
│   │   ├── 📁 ui/              # Componentes base (Radix UI)
│   │   ├── 📁 Navbar.jsx       # Navegação principal
│   │   └── 📁 ...              # Outros componentes
│   ├── 📁 pages/               # Páginas da aplicação
│   │   ├── 📁 Home.jsx         # Dashboard principal
│   │   ├── 📁 AreaManagement.jsx # Gestão de áreas
│   │   ├── 📁 ProcessManagement.jsx # Gestão de processos
│   │   └── 📁 ProcessVisualization.jsx # Visualização hierárquica
│   ├── 📁 hooks/               # Hooks customizados
│   │   ├── 📁 use-mobile.js    # Detecção de dispositivo móvel
│   │   └── 📁 useNotifications.js # Sistema de notificações
│   ├── 📁 services/            # Serviços de API
│   │   └── 📁 api.js           # Cliente HTTP e endpoints
│   ├── 📁 lib/                 # Utilitários e helpers
│   │   └── 📁 utils.js         # Funções utilitárias
│   └── 📁 assets/              # Recursos estáticos
├── 📁 public/                  # Assets públicos
├── 📄 vite.config.js           # Configuração Vite
├── 📄 tailwind.config.js       # Configuração TailwindCSS
└── 📄 package.json             # Dependências e scripts
```

## 🚀 Tecnologias Utilizadas

### Core Framework
- **React 19**: Framework principal com hooks modernos
- **Vite 6**: Build tool ultra-rápido com HMR otimizado
- **React Router 7**: Roteamento eficiente e lazy loading

### Styling & UI
- **TailwindCSS 4**: CSS utilitário com purge automático
- **Radix UI**: Componentes acessíveis e customizáveis
- **Framer Motion**: Animações suaves e performáticas
- **Lucide React**: Ícones vetoriais otimizados

### Formulários & Validação
- **React Hook Form**: Gerenciamento de formulários eficiente
- **Zod**: Validação de schemas TypeScript
- **@hookform/resolvers**: Integração entre React Hook Form e Zod

### Estado & Gerenciamento
- **React Context**: Gerenciamento de estado global
- **Custom Hooks**: Lógica reutilizável e organizada
- **Local Storage**: Persistência de preferências do usuário

### Performance & Otimização
- **React.memo**: Memoização de componentes
- **useMemo/useCallback**: Otimização de re-renders
- **Lazy Loading**: Carregamento sob demanda de componentes
- **Code Splitting**: Divisão automática de bundles

## 🚀 Otimizações Implementadas

### Build & Performance
- **Vite Build**: Compilação ultra-rápida com esbuild
- **Tree Shaking**: Eliminação automática de código não utilizado
- **Code Splitting**: Divisão inteligente de bundles
- **HMR Otimizado**: Hot Module Replacement instantâneo
- **CSS Purge**: Remoção automática de CSS não utilizado

### React Optimizations
- **React 19**: Hooks modernos e melhor performance
- **Component Memoization**: Prevenção de re-renders desnecessários
- **Lazy Components**: Carregamento sob demanda
- **Virtual Scrolling**: Renderização eficiente de listas grandes
- **Debounced Search**: Busca otimizada com debounce

### CSS & Styling
- **TailwindCSS 4**: Sistema de design atômico
- **CSS-in-JS**: Estilos dinâmicos e responsivos
- **CSS Variables**: Tema dinâmico e customizável
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Suporte a tema escuro

### User Experience
- **Skeleton Loading**: Estados de carregamento elegantes
- **Error Boundaries**: Tratamento robusto de erros
- **Toast Notifications**: Feedback visual imediato
- **Smooth Animations**: Transições suaves com Framer Motion
- **Keyboard Navigation**: Navegação completa por teclado

## 📱 Responsividade & Mobile

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile Optimizations
- **Touch-friendly**: Botões e interações otimizadas para touch
- **Gesture Support**: Suporte a gestos móveis
- **Viewport Meta**: Configuração otimizada para dispositivos móveis
- **Progressive Web App**: Funcionalidades PWA básicas

## 🎨 Sistema de Design

### Cores
```css
/* Primary Colors */
--primary: #3b82f6
--primary-dark: #1d4ed8
--primary-light: #93c5fd

/* Semantic Colors */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #06b6d4
```

### Tipografia
```css
/* Font Scale */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
```

### Componentes
- **Button**: Variantes primary, secondary, outline, ghost
- **Input**: Estados focus, error, disabled
- **Card**: Layouts flexíveis e responsivos
- **Modal**: Overlays acessíveis e responsivos
- **Table**: Tabelas com paginação e filtros

## 🔧 Como Executar

### Pré-requisitos
- **Node.js 18+** (recomendado: 20.x)
- **pnpm** (gerenciador de pacotes)

### Instalação
```bash
cd frontend
pnpm install
```

### Desenvolvimento
```bash
# Modo desenvolvimento
pnpm run dev

# Acesse: http://localhost:3000
```

### Build
```bash
# Build de produção
pnpm run build

# Preview do build
pnpm run preview
```

### Linting
```bash
# Verificar código
pnpm run lint

# Corrigir automaticamente
pnpm run lint:fix
```

## 📊 Componentes Principais

### 🏠 Home.jsx
- **Dashboard** com métricas principais
- **Resumo** de áreas e processos
- **Ações rápidas** para usuários
- **Gráficos** e visualizações

### 🎯 AreaManagement.jsx
- **CRUD completo** de áreas
- **Filtros** e busca avançada
- **Paginação** eficiente
- **Validação** em tempo real

### 🔄 ProcessManagement.jsx
- **Gestão hierárquica** de processos
- **Drag & Drop** para reorganização
- **Metadados** completos
- **Relacionamentos** entre processos

### 📈 ProcessVisualization.jsx
- **Vista hierárquica** interativa
- **Zoom** e navegação
- **Filtros** dinâmicos
- **Export** de visualizações

## 🎯 Hooks Customizados

### use-mobile.js
```javascript
// Detecção de dispositivo móvel
const { isMobile, isTablet, isDesktop } = useMobile();

// Uso responsivo
{isMobile ? <MobileLayout /> : <DesktopLayout />}
```

### useNotifications.js
```javascript
// Sistema de notificações
const { showSuccess, showError, showWarning } = useNotifications();

// Exemplo de uso
showSuccess('Processo criado com sucesso!');
```

## 🔌 Integração com API

### api.js
```javascript
// Cliente HTTP configurado
const api = {
  // Áreas
  getAreas: () => fetch('/api/areas'),
  createArea: (data) => fetch('/api/areas', { method: 'POST', body: JSON.stringify(data) }),
  
  // Processos
  getProcesses: () => fetch('/api/processes'),
  createProcess: (data) => fetch('/api/processes', { method: 'POST', body: JSON.stringify(data) }),
  
  // Paginação
  getPaginatedData: (endpoint, page, limit) => 
    fetch(`${endpoint}?page=${page}&limit=${limit}`)
};
```

## 📦 Deploy

### Build de Produção
```bash
# Gerar build otimizado
pnpm run build

# Build será gerado em /dist
```

### Docker
```dockerfile
# Dockerfile otimizado multi-stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

## 🚀 Performance Tips

### Code Splitting
```javascript
// Lazy loading de componentes
const ProcessManagement = lazy(() => import('./pages/ProcessManagement'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <ProcessManagement />
</Suspense>
```

### Memoização
```javascript
// Memoizar componentes pesados
const ExpensiveComponent = memo(({ data }) => {
  // Componente otimizado
});

// Memoizar valores computados
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);
```

### Bundle Analysis
```bash
# Analisar bundle
pnpm run build:analyze

# Ver tamanho dos chunks
pnpm run build:size
```

## 🔍 Debugging

### DevTools
- **React DevTools**: Inspeção de componentes e estado
- **Redux DevTools**: Debug de estado global (se aplicável)
- **Network Tab**: Monitoramento de requisições
- **Performance Tab**: Análise de performance

### Logging
```javascript
// Logging condicional
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Error boundaries
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
}
```

## 📚 Recursos Adicionais

- [📖 React Documentation](https://react.dev/)
- [🎨 TailwindCSS Docs](https://tailwindcss.com/docs)
- [🔧 Vite Guide](https://vitejs.dev/guide/)
- [♿ Radix UI](https://www.radix-ui.com/)
- [🎭 Framer Motion](https://www.framer.com/motion/)

## 🤝 Contribuindo

### Padrões de Código
- **ESLint**: Configuração estrita para qualidade
- **Prettier**: Formatação automática
- **TypeScript**: Tipagem estática (quando aplicável)
- **Conventional Commits**: Padrão de commits

---

⭐ **Frontend otimizado para performance e experiência do usuário!** ⭐
