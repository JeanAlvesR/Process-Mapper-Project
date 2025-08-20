# 🐳 Docker - Resumo Rápido

## 🚀 Início Rápido

### 1. Configuração Inicial
```bash
# Configurar Docker e ambiente
make setup
# ou
./scripts/setup-docker.sh
```

### 2. Desenvolvimento
```bash
# Iniciar em modo desenvolvimento
make dev
# ou
./scripts/docker-dev.sh
```

### 3. Produção
```bash
# Iniciar em modo produção
make prod
# ou
./scripts/docker-prod.sh
```

## 📊 URLs dos Serviços

| Ambiente | Frontend | Backend | Database |
|----------|----------|---------|----------|
| Desenvolvimento | http://localhost:5173 | http://localhost:3000 | localhost:5432 |
| Produção | http://localhost | http://localhost:3000 | localhost:5432 |

## 🔧 Comandos Úteis

### Comandos Básicos
```bash
make help          # Ver todos os comandos
make logs          # Ver logs
make stop          # Parar containers
make restart       # Reiniciar containers
make clean         # Limpeza completa
```

### Banco de Dados
```bash
make seed          # Executar seed
make db            # Acessar PostgreSQL
make backup        # Fazer backup
make restore file=backup.sql  # Restaurar backup
```

### Desenvolvimento
```bash
make dev-build     # Construir imagens dev
make dev-logs      # Logs de desenvolvimento
make dev-stop      # Parar containers dev
make shell         # Shell do backend
```

### Produção
```bash
make prod-build    # Construir imagens prod
make prod-logs     # Logs de produção
make prod-stop     # Parar containers prod
```

## 📁 Arquivos Criados

```
projeto/
├── docker-compose.yml          # Desenvolvimento
├── docker-compose.prod.yml     # Produção
├── .dockerignore              # Arquivos ignorados
├── env.example                # Variáveis de ambiente
├── Makefile                   # Comandos úteis
├── README-Docker.md           # Documentação completa
├── backend/
│   ├── Dockerfile             # Dev
│   └── Dockerfile.prod        # Produção
├── frontend/
│   ├── Dockerfile             # Dev
│   ├── Dockerfile.prod        # Produção
│   └── nginx.conf             # Config Nginx
└── scripts/
    ├── setup-docker.sh        # Configuração inicial
    ├── docker-dev.sh          # Script dev
    └── docker-prod.sh         # Script prod
```

## ⚡ Comandos Docker Diretos

### Desenvolvimento
```bash
docker-compose up --build        # Construir e iniciar
docker-compose down              # Parar
docker-compose logs -f           # Ver logs
docker-compose exec backend sh   # Shell backend
```

### Produção
```bash
docker-compose -f docker-compose.prod.yml up --build -d
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔒 Segurança

⚠️ **IMPORTANTE**: Para produção, altere as senhas no arquivo `.env`!

```env
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha_segura
```

## 🆘 Troubleshooting

### Problemas Comuns
1. **Porta em uso**: `sudo netstat -tulpn | grep :3000`
2. **Permissões**: `sudo usermod -aG docker $USER`
3. **Limpar cache**: `docker system prune -a`

### Logs de Erro
```bash
docker-compose logs --tail=100 -f
docker-compose logs --tail=50 -f | grep ERROR
```

## 📖 Documentação Completa

Para informações detalhadas, consulte: **README-Docker.md** 