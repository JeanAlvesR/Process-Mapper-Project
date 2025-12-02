# Configuração do Banco de Dados PostgreSQL

## Pré-requisitos

1. **Node.js v22.18.0** (já configurado)
2. **PostgreSQL** instalado na sua máquina
3. **pnpm** (já configurado)

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

3. **Build para produção:**
```bash
pnpm build
pnpm start
```

## Estrutura do Banco de Dados

O TypeORM irá criar automaticamente as tabelas baseadas nas entidades:

- **areas**: Armazena as áreas da empresa
- **processes**: Armazena os processos com relacionamentos hierárquicos

## Endpoints Disponíveis

- `GET /api/areas` - Listar todas as áreas
- `POST /api/areas` - Criar nova área
- `GET /api/areas/:id` - Buscar área por ID
- `PUT /api/areas/:id` - Atualizar área
- `DELETE /api/areas/:id` - Deletar área

- `GET /api/processes` - Listar todos os processos
- `POST /api/processes` - Criar novo processo
- `GET /api/processes/:id` - Buscar processo por ID
- `PUT /api/processes/:id` - Atualizar processo
- `DELETE /api/processes/:id` - Deletar processo

- `GET /db/state` - Ver estado atual do banco
- `POST /db/seed` - Popular banco com dados de exemplo 