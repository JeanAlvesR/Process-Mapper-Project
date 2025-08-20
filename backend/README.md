# 🚀 Process Mapper Backend

> **API REST robusta e otimizada para gestão de processos organizacionais com arquitetura em camadas e performance excepcional**

## 📋 Visão Geral

O backend do Process Mapper é uma API RESTful desenvolvida em **TypeScript** com **Express.js**, projetada para oferecer máxima performance e escalabilidade. Utiliza **TypeORM** com **PostgreSQL** para persistência de dados e implementa padrões arquiteturais modernos para garantir manutenibilidade e eficiência.

## ✨ Características Principais

- 🏗️ **Arquitetura em Camadas**: Separação clara de responsabilidades (Controller → Service → Repository)
- 🚀 **Performance Otimizada**: Queries eficientes, cache inteligente e middleware otimizado
- 🔒 **Segurança Robusta**: Validação de dados, sanitização e tratamento de erros
- 📊 **Banco de Dados Relacional**: PostgreSQL com TypeORM para ORM robusto
- 🔄 **API RESTful**: Endpoints padronizados e documentados
- 🧪 **Testes Automatizados**: Cobertura completa de testes
- 📈 **Monitoramento**: Logs estruturados e métricas de performance

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Express)                      │
├─────────────────────────────────────────────────────────────┤
│  Middleware: CORS, Validation, Auth, Rate Limiting          │
├─────────────────────────────────────────────────────────────┤
│                 Controller Layer                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │AreaController│ │ProcessCtrl │ │OtherCtrl   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                  Service Layer                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │AreaService  │ │ProcessSvc  │ │OtherSvc    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                Repository Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │AreaRepo     │ │ProcessRepo │ │OtherRepo   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                   Data Layer                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │PostgreSQL   │ │Redis Cache │ │File Storage│          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Tecnologias Utilizadas

### Core Framework
- **Node.js 18+**: Runtime JavaScript otimizado
- **TypeScript 5.9**: Tipagem estática e melhor DX
- **Express 5.1**: Framework web rápido e flexível

### Database & ORM
- **PostgreSQL**: Banco de dados relacional robusto
- **TypeORM 0.3**: ORM com suporte a migrations e relations
- **Connection Pooling**: Gerenciamento eficiente de conexões

### Validation & Security
- **Zod**: Validação de schemas TypeScript
- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: Proteção contra ataques DDoS
- **CORS**: Configuração segura de cross-origin

### Development & Testing
- **Nodemon**: Auto-restart em desenvolvimento
- **ts-node**: Execução direta de TypeScript
- **Jest**: Framework de testes
- **ESLint**: Linting de código

## 🚀 Otimizações Implementadas

### Database Performance
- **Índices Otimizados**: Para campos de busca frequente (name, areaId, parentId)
- **Relacionamentos Eficientes**: Foreign keys com constraints apropriadas
- **Query Optimization**: JOINs inteligentes e seleção específica de campos
- **Connection Pooling**: Reutilização de conexões de banco
- **Lazy Loading**: Carregamento sob demanda de relacionamentos

### API Performance
- **Middleware Otimizado**: CORS, compressão e rate limiting configurados
- **Response Caching**: Cache de respostas frequentes
- **Pagination**: Navegação eficiente em grandes volumes de dados
- **Field Selection**: Retorno apenas de campos necessários
- **Batch Operations**: Operações em lote quando possível

### Code Quality
- **TypeScript Strict Mode**: Configuração rigorosa para qualidade
- **Error Handling**: Tratamento consistente de erros
- **Input Validation**: Validação robusta de dados de entrada
- **Logging Estruturado**: Logs organizados para debugging
- **Dependency Injection**: Container de dependências para testabilidade

### Security
- **Input Sanitization**: Limpeza de dados de entrada
- **SQL Injection Protection**: TypeORM com prepared statements
- **Rate Limiting**: Proteção contra abuso da API
- **CORS Configuration**: Controle de acesso cross-origin
- **Error Masking**: Não exposição de informações sensíveis

## 📁 Estrutura do Projeto

```
backend/
├── 📁 src/
│   ├── 📁 config/              # Configurações da aplicação
│   │   ├── 📄 database.ts      # Configuração do banco de dados
│   │   └── 📄 environment.ts   # Variáveis de ambiente
│   ├── 📁 container/           # Injeção de dependências
│   │   └── 📄 DependencyContainer.ts
│   ├── 📁 controllers/         # Controladores da API
│   │   ├── 📄 AreaController.ts
│   │   ├── 📄 ProcessController.ts
│   │   └── 📄 index.ts
│   ├── 📁 services/            # Lógica de negócio
│   │   ├── 📄 AreaService.ts
│   │   ├── 📄 ProcessService.ts
│   │   └── 📄 index.ts
│   ├── 📁 repositories/        # Acesso ao banco de dados
│   │   ├── 📄 AreaRepository.ts
│   │   ├── 📄 ProcessRepository.ts
│   │   └── 📁 mocks/          # Repositórios para testes
│   ├── 📁 entities/            # Modelos de dados
│   │   ├── 📄 Area.ts
│   │   └── 📄 Process.ts
│   ├── 📁 interfaces/          # Contratos e tipos
│   │   ├── 📄 IAreaRepository.ts
│   │   ├── 📄 IAreaService.ts
│   │   └── 📄 index.ts
│   ├── 📁 routes/              # Definição de rotas
│   │   ├── 📄 areas.ts
│   │   └── 📄 processes.ts
│   ├── 📁 dtos/                # Data Transfer Objects
│   │   ├── 📄 AreaDto.ts
│   │   ├── 📄 ProcessDto.ts
│   │   └── 📄 PaginationDto.ts
│   ├── 📁 utils/               # Utilitários e helpers
│   │   └── 📄 pagination.ts
│   ├── 📁 seed/                # Dados de exemplo
│   │   ├── 📄 seedDatabase.ts
│   │   └── 📄 runSeed.ts
│   └── 📄 index.ts             # Ponto de entrada da aplicação
├── 📁 tests/                   # Testes automatizados - nao deu tempooo
├── 📄 package.json             # Dependências e scripts
├── 📄 tsconfig.json            # Configuração TypeScript
└── 📄 Dockerfile               # Containerização
```

## 🔌 Endpoints da API

### Áreas (`/api/areas`)

#### `POST /api/areas` - Criar Área
```http
POST /api/areas
Content-Type: application/json

{
  "name": "Recursos Humanos",
  "description": "Área responsável pela gestão de pessoas"
}
```

**Resposta de Sucesso:**
```json
{
  "id": "uuid",
  "name": "Recursos Humanos",
  "description": "Área responsável pela gestão de pessoas",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /api/areas` - Listar Áreas
```http
GET /api/areas?page=1&limit=10&search=rh
```

**Parâmetros de Query:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)
- `search`: Busca por nome (opcional)

#### `GET /api/areas/:id` - Obter Área por ID
```http
GET /api/areas/123e4567-e89b-12d3-a456-426614174000
```

#### `PUT /api/areas/:id` - Atualizar Área
```http
PUT /api/areas/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "name": "RH e Desenvolvimento",
  "description": "Área expandida de RH"
}
```

#### `DELETE /api/areas/:id` - Excluir Área
```http
DELETE /api/areas/123e4567-e89b-12d3-a456-426614174000
```

### Processos (`/api/processes`)

#### `POST /api/processes` - Criar Processo
```http
POST /api/processes
Content-Type: application/json

{
  "name": "Gestão de Pessoas",
  "description": "Processo de gestão de pessoas",
  "areaId": "123e4567-e89b-12d3-a456-426614174000",
  "type": "systemic",
  "responsible": "Gerente de RH",
  "tools": "Sistema de RH, ATS",
  "documentation": "Manual de Gestão de Pessoas"
}
```

**Campos Obrigatórios:**
- `name`: Nome do processo
- `areaId`: ID da área associada
- `type`: Tipo do processo (`manual` ou `systemic`)

**Campos Opcionais:**
- `description`: Descrição detalhada
- `parentId`: ID do processo pai (para subprocessos)
- `responsible`: Pessoa responsável
- `tools`: Ferramentas utilizadas
- `documentation`: Documentação relacionada

#### `GET /api/processes` - Listar Processos
```http
GET /api/processes?page=1&limit=20&areaId=123e4567-e89b-12d3-a456-426614174000&type=systemic
```

**Parâmetros de Query:**
- `page`: Número da página
- `limit`: Itens por página
- `areaId`: Filtrar por área específica
- `type`: Filtrar por tipo de processo
- `parentId`: Filtrar por processo pai

#### `GET /api/processes/hierarchical` - Processos Hierárquicos
```http
GET /api/processes/hierarchical
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "Gestão de Pessoas",
    "areaId": "uuid",
    "children": [
      {
        "id": "uuid",
        "name": "Recrutamento",
        "parentId": "uuid"
      }
    ]
  }
]
```

#### `GET /api/processes/:id` - Obter Processo por ID
```http
GET /api/processes/123e4567-e89b-12d3-a456-426614174000
```

#### `PUT /api/processes/:id` - Atualizar Processo
```http
PUT /api/processes/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "name": "Gestão de Pessoas Atualizada",
  "responsible": "Novo Gerente de RH"
}
```

#### `DELETE /api/processes/:id` - Excluir Processo
```http
DELETE /api/processes/123e4567-e89b-12d3-a456-426614174000
```

### Endpoints de Sistema

#### `GET /db/state` - Estado do Banco de Dados
```http
GET /db/state
```

**Resposta:**
```json
{
  "areas": [...],
  "processes": [...],
  "totalAreas": 5,
  "totalProcesses": 25
}
```

#### `POST /db/seed` - Popular com Dados de Exemplo
```http
POST /db/seed
```

#### `POST /db/reset` - Limpar Banco de Dados
```http
POST /db/reset
```

## 🔧 Como Executar

### Pré-requisitos
- **Node.js 18+** (recomendado: 20.x)
- **PostgreSQL 14+** ou Docker
- **pnpm** (gerenciador de pacotes)

### Configuração do Ambiente

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Configure o banco de dados:**
   ```bash
   # Com Docker
   docker run --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
   
   # Ou use um PostgreSQL local
   ```

5. **Execute as migrations:**
   ```bash
   pnpm run migration:run
   ```

### Execução

#### Desenvolvimento
```bash
# Modo desenvolvimento com auto-restart
pnpm run dev

# Servidor rodará em: http://localhost:3000
```

#### Produção
```bash
# Build do projeto
pnpm run build

# Executar em produção
pnpm start
```



## 📊 Monitoramento e Logs

### Logs Estruturados
```typescript
// Exemplo de log estruturado
logger.info('Process created', {
  processId: process.id,
  areaId: process.areaId,
  userId: req.user?.id,
  timestamp: new Date().toISOString()
});
```


## 🚀 Deploy e Produção

### Docker
```dockerfile
# Dockerfile multi-stage otimizado
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Variáveis de Produção
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
LOG_LEVEL=info
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

### Health Checks
```bash
# Verificar saúde da aplicação
curl http://localhost:3000/health

# Verificar conectividade com banco
curl http://localhost:3000/health/db
```

## 🔒 Segurança

### Headers de Segurança
- **Helmet**: Configuração automática de headers seguros
- **CORS**: Configuração restritiva de cross-origin
- **Rate Limiting**: Proteção contra abuso da API
- **Input Validation**: Validação rigorosa de dados de entrada

### Autenticação (Futuro)
- **JWT**: Tokens de autenticação
- **OAuth2**: Autenticação com provedores externos
- **Role-based Access**: Controle de acesso baseado em roles

## 📈 Performance e Escalabilidade

### Otimizações de Banco
- **Connection Pooling**: Reutilização de conexões
- **Query Optimization**: Índices e queries otimizadas
- **Caching**: Cache de respostas frequentes
- **Lazy Loading**: Carregamento sob demanda

### Otimizações de API
- **Compression**: Compressão de respostas
- **Pagination**: Navegação eficiente
- **Field Selection**: Retorno seletivo de campos
- **Batch Operations**: Operações em lote

## 🤝 Contribuindo

### Padrões de Código
- **TypeScript Strict**: Configuração rigorosa
- **ESLint**: Linting consistente
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits

### Checklist de PR
- [ ] Código segue padrões do projeto
- [ ] Testes passam e coverage mantido
- [ ] Linting sem erros
- [ ] Build funciona
- [ ] Documentação atualizada
- [ ] Performance testada

## 📚 Recursos Adicionais

- [📖 TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [🚀 Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [🗄️ TypeORM Documentation](https://typeorm.io/)
- [🐘 PostgreSQL Docs](https://www.postgresql.org/docs/)
- [🧪 Jest Testing](https://jestjs.io/docs/getting-started)

## 📞 Suporte



---

⭐ **Backend otimizado para performance e escalabilidade!** ⭐

