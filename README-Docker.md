# 🐳 Docker - Process Mapper

Este documento explica como usar Docker para executar o projeto Process Mapper.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 2.0 ou superior)

### Instalação do Docker (Ubuntu/Debian)

```bash
# Atualizar repositórios
sudo apt update

# Instalar dependências
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Adicionar chave GPG oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório do Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 🚀 Modo Desenvolvimento

### Execução Rápida

```bash
# Dar permissão de execução aos scripts
chmod +x scripts/docker-dev.sh

# Executar em modo desenvolvimento
./scripts/docker-dev.sh
```

### Execução Manual

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Executar em background
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Limpeza Completa

```bash
# Parar e remover containers, volumes e imagens
./scripts/docker-dev.sh --clean
```

## 🏭 Modo Produção

### Execução Rápida

```bash
# Dar permissão de execução aos scripts
chmod +x scripts/docker-prod.sh

# Executar em modo produção
./scripts/docker-prod.sh
```

### Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Banco de Dados
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_segura

# URL da API
API_URL=http://localhost:3000
```

### Execução Manual

```bash
# Construir e iniciar em modo produção
docker-compose -f docker-compose.prod.yml up --build -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar serviços
docker-compose -f docker-compose.prod.yml down
```

## 📊 Serviços Disponíveis

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend | 80 (prod) / 5173 (dev) | Interface React com Vite |
| Backend | 3000 | API Node.js com Express |
| PostgreSQL | 5432 | Banco de dados |

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Executar comando dentro de um container
docker-compose exec backend npm run seed
docker-compose exec postgres psql -U postgres -d process_mapper

# Reconstruir um serviço específico
docker-compose up --build backend
```

### Produção

```bash
# Ver logs de um serviço específico
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Executar comando dentro de um container
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

## 🗄️ Banco de Dados

### Acessar PostgreSQL

```bash
# Desenvolvimento
docker-compose exec postgres psql -U postgres -d process_mapper

# Produção
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d process_mapper
```

### Backup e Restore

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres process_mapper > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres process_mapper < backup.sql
```

## 🔍 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   # Verificar portas em uso
   sudo netstat -tulpn | grep :3000
   
   # Parar processo que está usando a porta
   sudo kill -9 <PID>
   ```

2. **Permissões do Docker**
   ```bash
   # Adicionar usuário ao grupo docker
   sudo usermod -aG docker $USER
   
   # Fazer logout e login novamente
   ```

3. **Limpar cache do Docker**
   ```bash
   docker system prune -a
   docker volume prune
   ```

4. **Reconstruir imagens**
   ```bash
   docker-compose build --no-cache
   ```

### Logs de Erro

```bash
# Ver logs detalhados
docker-compose logs --tail=100 -f

# Ver logs de erro específicos
docker-compose logs --tail=50 -f | grep ERROR
```

## 📁 Estrutura de Arquivos Docker

```
projeto/
├── docker-compose.yml          # Configuração desenvolvimento
├── docker-compose.prod.yml     # Configuração produção
├── .dockerignore              # Arquivos ignorados pelo Docker
├── backend/
│   ├── Dockerfile             # Dockerfile desenvolvimento
│   └── Dockerfile.prod        # Dockerfile produção
├── frontend/
│   ├── Dockerfile             # Dockerfile desenvolvimento
│   ├── Dockerfile.prod        # Dockerfile produção
│   └── nginx.conf             # Configuração Nginx
└── scripts/
    ├── docker-dev.sh          # Script desenvolvimento
    └── docker-prod.sh         # Script produção
```

## 🔒 Segurança

### Para Produção

1. **Altere as senhas padrão** no arquivo `.env`
2. **Use HTTPS** em produção
3. **Configure firewall** para limitar acesso às portas
4. **Monitore logs** regularmente
5. **Mantenha imagens atualizadas**

### Variáveis de Ambiente

```env
# Configurações do Banco de Dados
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha_segura
DB_NAME=process_mapper

# Configurações da API
API_URL=https://seu-dominio.com
NODE_ENV=production
```

## 📈 Monitoramento

### Verificar Status dos Containers

```bash
# Status geral
docker-compose ps

# Uso de recursos
docker stats

# Espaço em disco
docker system df
```

### Logs Estruturados

```bash
# Logs com timestamp
docker-compose logs -f --timestamps

# Logs de um período específico
docker-compose logs --since="2024-01-01T00:00:00" --until="2024-01-02T00:00:00"
``` 