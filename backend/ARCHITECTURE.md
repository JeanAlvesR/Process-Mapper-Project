# Arquitetura do Backend

## Estrutura de Pastas

```
src/
├── config/          # Configurações (database, etc.)
├── controllers/     # Controllers - Responsáveis por receber requests e retornar responses
├── services/        # Services - Lógica de negócio
├── repositories/    # Repositories - Acesso a dados
├── entities/        # Entidades do TypeORM
├── dtos/           # Data Transfer Objects - Interfaces para request/response
├── routes/         # Definição das rotas
├── db/             # Configuração do banco de dados
└── seed/           # Scripts de seed
```

## Camadas da Aplicação

### 1. Controllers (`/controllers`)
- **Responsabilidade**: Receber requests HTTP e retornar responses
- **Características**:
  - Não contém lógica de negócio
  - Validação básica de entrada
  - Tratamento de erros HTTP
  - Conversão de requests para DTOs
  - Chamada dos services apropriados

### 2. Services (`/services`)
- **Responsabilidade**: Lógica de negócio da aplicação
- **Características**:
  - Contém toda a lógica de negócio
  - Validações complexas
  - Orquestração de operações
  - Conversão de entidades para DTOs
  - Não conhece HTTP ou Express

### 3. Repositories (`/repositories`)
- **Responsabilidade**: Acesso a dados
- **Características**:
  - Operações CRUD básicas
  - Queries específicas
  - Abstração do banco de dados
  - Retornam entidades do TypeORM

### 4. DTOs (`/dtos`)
- **Responsabilidade**: Definição de interfaces para transferência de dados
- **Tipos**:
  - **Create DTOs**: Para criação de recursos
  - **Update DTOs**: Para atualização de recursos
  - **Response DTOs**: Para retorno de dados
  - **Detail DTOs**: Para retornos com informações completas

## Fluxo de Dados

```
Request → Controller → Service → Repository → Database
Response ← Controller ← Service ← Repository ← Database
```

### Exemplo de Fluxo:

1. **Request** chega no Controller
2. **Controller** valida entrada e converte para DTO
3. **Controller** chama o Service com o DTO
4. **Service** executa lógica de negócio
5. **Service** chama Repository para operações de dados
6. **Repository** executa query no banco
7. **Service** converte entidade para DTO de resposta
8. **Controller** retorna response HTTP

## Benefícios da Nova Arquitetura

### 1. Separação de Responsabilidades
- Cada camada tem uma responsabilidade específica
- Facilita manutenção e testes
- Reduz acoplamento entre componentes

### 2. Reutilização de Código
- Services podem ser reutilizados por diferentes controllers
- Lógica de negócio centralizada
- DTOs padronizam a estrutura de dados

### 3. Testabilidade
- Cada camada pode ser testada independentemente
- Mocks mais fáceis de implementar
- Testes unitários mais focados

### 4. Manutenibilidade
- Mudanças em uma camada não afetam outras
- Código mais organizado e legível
- Facilita debugging

### 5. Escalabilidade
- Fácil adicionar novas funcionalidades
- Estrutura preparada para crescimento
- Padrões consistentes

## DTOs Implementados

### Area DTOs
- `CreateAreaDto`: Para criação de áreas
- `UpdateAreaDto`: Para atualização de áreas
- `AreaResponseDto`: Retorno básico de área
- `AreaWithProcessesDto`: Retorno com processos incluídos

### Process DTOs
- `CreateProcessDto`: Para criação de processos
- `UpdateProcessDto`: Para atualização de processos
- `ProcessResponseDto`: Retorno básico de processo
- `ProcessWithDetailsDto`: Retorno com detalhes completos

## Novos Endpoints

### Areas
- `GET /areas/:id/processes` - Retorna área com todos os processos

### Processes
- `GET /processes/:id/details` - Retorna processo com detalhes completos

## Tratamento de Erros

Cada camada tem responsabilidades específicas para tratamento de erros:

- **Controllers**: Erros HTTP (400, 404, 500, etc.)
- **Services**: Erros de negócio (validações, regras de negócio)
- **Repositories**: Erros de banco de dados

## Próximos Passos

1. Implementar validação de entrada com bibliotecas como `class-validator`
2. Adicionar middleware de autenticação/autorização
3. Implementar logging estruturado
4. Adicionar testes unitários para cada camada
5. Implementar cache para consultas frequentes
