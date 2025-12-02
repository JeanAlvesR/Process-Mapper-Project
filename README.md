# 🚀 Process Mapper - Sistema de Gestão de Processos Organizacionais

[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript%20%7C%20Express-brightgreen)](backend/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TailwindCSS-blue)](frontend/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20TypeORM-orange)](backend/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](docker-compose.yml)
[![License](https://img.shields.io/badge/License-ISC-green)](LICENSE)

> **Sistema completo para mapeamento, visualização e gestão de processos organizacionais com arquitetura otimizada e interface moderna**

## 📋 Visão Geral

O **Process Mapper** é uma solução empresarial completa para gestão de processos organizacionais, desenvolvida com foco em **performance**, **escalabilidade** e **experiência do usuário**. O sistema permite mapear, visualizar e gerenciar processos de forma hierárquica, com suporte a múltiplas áreas organizacionais.

### ✨ Características Principais

- 🏗️ **Arquitetura Hierárquica**: Suporte a processos de múltiplos níveis (áreas → processos → subprocessos)
- 📊 **Visualização Intuitiva**: Interface moderna com gráficos e navegação fluida
- 🔄 **Gestão Completa**: CRUD completo para áreas e processos
- 📱 **Responsivo**: Interface adaptável para desktop e dispositivos móveis
- 🚀 **Performance Otimizada**: Carregamento rápido e operações eficientes
- 🐳 **Containerizado**: Deploy simplificado com Docker
- 🔒 **Seguro**: Validação de dados e tratamento de erros robusto

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│  (PostgreSQL)   │
│                 │    │   (Express)     │    │                 │
│   • Vite        │    │   • TypeORM     │    │   • TypeORM     │
│   • TailwindCSS │    │   • TypeScript  │    │   • Migrations  │
│   • Radix UI    │    │   • Validation  │    │   • Relations   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **TypeScript** para tipagem estática e melhor manutenibilidade
- **Express.js** com middleware otimizado para performance
- **TypeORM** com PostgreSQL para ORM robusto e eficiente
- **Validação de Dados** com Zod para integridade dos dados
- **Arquitetura em Camadas** (Controller → Service → Repository)

### Frontend
- **React 19** com hooks modernos para melhor performance
- **Vite** para build ultra-rápido e HMR otimizado
- **TailwindCSS 4** com sistema de design consistente
- **Radix UI** para componentes acessíveis e customizáveis
- **React Router 7** para navegação eficiente
- **Framer Motion** para animações suaves

### DevOps & Infraestrutura
- **Docker** para containerização e deploy consistente
- **PostgreSQL** como banco de dados principal
- **Nginx** para servidor web e proxy reverso
- **Scripts de Automação** para deploy e configuração

## 📁 Estrutura do Projeto

```
projeto/
├── 📁 backend/                 # API REST com TypeScript
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Controladores da API
│   │   ├── 📁 services/        # Lógica de negócio
│   │   ├── 📁 repositories/    # Acesso ao banco de dados
│   │   ├── 📁 entities/        # Modelos de dados
│   │   ├── 📁 routes/          # Definição de rotas
│   │   └── 📁 config/          # Configurações
│   ├── 📁 tests/               # Testes automatizados - Não deu tempoooo
│   └── 📁 seed/                # Dados de exemplo
├── 📁 frontend/                # Interface React moderna
│   ├── 📁 src/
│   │   ├── 📁 components/      # Componentes reutilizáveis
│   │   ├── 📁 pages/           # Páginas da aplicação
│   │   ├── 📁 hooks/           # Hooks customizados
│   │   └── 📁 services/        # Serviços de API
│   └── 📁 public/              # Assets estáticos
├── 📁 scripts/                  # Scripts de automação
├── 📁 docker/                   # Configurações Docker
└── 📄 docker-compose.yml        # Orquestração de containers
```

## 🚀 Como Executar

### Pré-requisitos
- **Docker** e **Docker Compose** instalados
- **Node.js 18+** (para desenvolvimento local)
- **pnpm** (gerenciador de pacotes recomendado)

### 🐳 Execução com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/jeanalvesr/process-mapper.git
cd process-mapper

# Instalação do Docker
sudo apt-get update
sudo snap install docker
sudo apt install docker-compose

# Execute com Docker Compose
sudo docker-compose up -d

# Acesse a aplicação
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Database: localhost:5432
```

### 🛠️ Desenvolvimento Local

## Instalação do PostgreSQL

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### macOS (com Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

### Windows:
Baixe e instale do site oficial: https://www.postgresql.org/download/windows/

## Configuração do PostgreSQL

1. **Iniciar o serviço PostgreSQL:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

2. **Acessar o PostgreSQL como superusuário:**
```bash
sudo -u postgres psql
```

3. **Criar o banco de dados e usuário:**
```sql
CREATE DATABASE process_mapper;
CREATE USER postgres WITH PASSWORD 'postgres'; || ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE process_mapper TO postgres;
\q
```

## Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=process_mapper

# Environment
NODE_ENV=development
```

## Instalação das Dependências

```bash
pnpm install || npm install
```

## Executando o Projeto

1. **Desenvolvimento:**
```bash
pnpm run dev || npm run dev
```

2. **Popular o banco com dados iniciais:**
```bash
pnpm run seed || npm run seed
```

```bash
# Backend
cd backend
pnpm install || npm install
pnpm run dev || npm run dev

# Frontend (em outro terminal)
cd frontend
pnpm install --legacy-peer-deps || npm install --legacy-peer-deps
pnpm run dev || npm run dev
```

## 📊 Funcionalidades

### 🎯 Gestão de Áreas
- Criação e edição de áreas organizacionais
- Descrições detalhadas e metadados
- Relacionamento com processos

### 🔄 Gestão de Processos
- **Processos Principais**: Definição de processos de alto nível
- **Subprocessos**: Hierarquia de processos detalhados
- **Metadados**: Ferramentas, responsáveis, documentação
- **Tipos**: Processos manuais vs. sistêmicos

### 📈 Visualização
- **Vista Hierárquica**: Navegação por níveis organizacionais
- **Dashboard**: Métricas e visão geral dos processos
- **Filtros**: Busca e filtragem avançada
- **Responsivo**: Adaptável a diferentes dispositivos

### 🔍 Busca e Filtros
- **Busca por Nome**: Encontre processos rapidamente
- **Filtros por Área**: Organize por departamento
- **Paginação**: Navegação eficiente em grandes volumes
- **Ordenação**: Múltiplos critérios de ordenação

## 🚀 Otimizações Implementadas

### Backend
- **TypeORM com Relações Otimizadas**: Queries eficientes com JOINs inteligentes
- **Validação com Zod**: Validação de dados em tempo de execução
- **Middleware Otimizado**: CORS, compressão e rate limiting
- **Arquitetura em Camadas**: Separação clara de responsabilidades
- **Tratamento de Erros**: Respostas consistentes e informativas

### Frontend
- **Vite Build**: Compilação ultra-rápida e HMR otimizado
- **React 19**: Hooks modernos e melhor performance
- **TailwindCSS 4**: CSS utilitário com purge automático
- **Componentes Lazy**: Carregamento sob demanda
- **Virtualização**: Renderização eficiente de listas grandes

### Banco de Dados
- **Índices Otimizados**: Para campos de busca frequente
- **Relacionamentos Eficientes**: Foreign keys e constraints
- **Migrations**: Versionamento de schema
- **Seeding**: Dados de exemplo para desenvolvimento

### DevOps
- **Docker Multi-stage**: Builds otimizados para produção
- **Nginx Config**: Servidor web otimizado
- **Health Checks**: Monitoramento de containers
- **Volumes Persistentes**: Dados persistentes entre restarts

## 📚 Documentação

- [📖 Backend API](backend/README.md) - Documentação completa da API
- [🎨 Frontend](frontend/README.md) - Guia de desenvolvimento frontend
- [🐳 Docker](README-Docker.md) - Configuração e deploy com Docker
- [📊 Paginação](PAGINATION_GUIDE.md) - Guia de implementação de paginação

## 🧪 Testes

```bash
# Backend
cd backend
pnpm run test

# Frontend
cd frontend
pnpm run test
```

## 📦 Deploy

### Produção
```bash
# Build e deploy
docker-compose -f docker-compose.prod.yml up -d

# Ou use o script automatizado
./scripts/docker-prod.sh
```

### Desenvolvimento
```bash
# Ambiente de desenvolvimento
docker-compose up -d

# Ou use o script automatizado
./scripts/docker-dev.sh
```

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📋 Padrões de Código
- **TypeScript**: Tipagem estática para backend e frontend
- **ESLint**: Linting consistente
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits

⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐
