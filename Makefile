# Makefile para Process Mapper com Docker

.PHONY: help setup dev prod build clean logs stop restart seed backup restore

# Comando padrão
help:
	@echo "🐳 Process Mapper - Comandos Docker"
	@echo ""
	@echo "📋 Comandos disponíveis:"
	@echo "  install   - Instalar Docker e Docker Compose"
	@echo "  setup     - Configurar Docker e ambiente"
	@echo "  dev       - Iniciar em modo desenvolvimento"
	@echo "  prod      - Iniciar em modo produção"
	@echo "  build     - Construir imagens Docker"
	@echo "  logs      - Ver logs dos containers"
	@echo "  stop      - Parar todos os containers"
	@echo "  restart   - Reiniciar containers"
	@echo "  clean     - Limpar containers, volumes e imagens"
	@echo "  seed      - Executar seed do banco de dados"
	@echo "  backup    - Fazer backup do banco de dados"
	@echo "  restore   - Restaurar backup do banco de dados"
	@echo "  shell     - Acessar shell do backend"
	@echo "  db        - Acessar PostgreSQL"
	@echo ""

# Instalação do Docker
install:
	@echo "🐳 Instalando Docker e Docker Compose..."
	@./scripts/install-docker.sh

# Configuração inicial
setup:
	@echo "🔧 Configurando Docker..."
	@./scripts/setup-docker.sh

# Desenvolvimento
dev:
	@echo "🚀 Iniciando modo desenvolvimento..."
	@./scripts/docker-dev.sh

# Produção
prod:
	@echo "🏭 Iniciando modo produção..."
	@./scripts/docker-prod.sh

# Construir imagens
build:
	@echo "🔨 Construindo imagens Docker..."
	@docker-compose build

# Ver logs
logs:
	@echo "📋 Mostrando logs..."
	@docker-compose logs -f

# Parar containers
stop:
	@echo "🛑 Parando containers..."
	@docker-compose down

# Reiniciar containers
restart:
	@echo "🔄 Reiniciando containers..."
	@docker-compose restart

# Limpeza completa
clean:
	@echo "🧹 Limpando tudo..."
	@docker-compose down -v
	@docker system prune -af
	@docker volume prune -f

# Executar seed
seed:
	@echo "🌱 Executando seed do banco de dados..."
	@docker-compose exec backend npm run seed

# Backup do banco
backup:
	@echo "💾 Fazendo backup do banco de dados..."
	@docker-compose exec postgres pg_dump -U postgres process_mapper > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup salvo como backup_$(shell date +%Y%m%d_%H%M%S).sql"

# Restaurar backup
restore:
	@if [ -z "$(file)" ]; then \
		echo "❌ Especifique o arquivo de backup: make restore file=backup.sql"; \
		exit 1; \
	fi
	@echo "📥 Restaurando backup: $(file)"
	@docker-compose exec -T postgres psql -U postgres process_mapper < $(file)

# Shell do backend
shell:
	@echo "🐚 Acessando shell do backend..."
	@docker-compose exec backend sh

# Acessar PostgreSQL
db:
	@echo "🗄️ Acessando PostgreSQL..."
	@docker-compose exec postgres psql -U postgres -d process_mapper

# Status dos containers
status:
	@echo "📊 Status dos containers:"
	@docker-compose ps

# Uso de recursos
stats:
	@echo "📈 Uso de recursos:"
	@docker stats --no-stream

# Produção - comandos específicos
prod-build:
	@echo "🔨 Construindo imagens de produção..."
	@docker-compose -f docker-compose.prod.yml build

prod-logs:
	@echo "📋 Mostrando logs de produção..."
	@docker-compose -f docker-compose.prod.yml logs -f

prod-stop:
	@echo "🛑 Parando containers de produção..."
	@docker-compose -f docker-compose.prod.yml down

prod-restart:
	@echo "🔄 Reiniciando containers de produção..."
	@docker-compose -f docker-compose.prod.yml restart

# Desenvolvimento - comandos específicos
dev-build:
	@echo "🔨 Construindo imagens de desenvolvimento..."
	@docker-compose build

dev-logs:
	@echo "📋 Mostrando logs de desenvolvimento..."
	@docker-compose logs -f

dev-stop:
	@echo "🛑 Parando containers de desenvolvimento..."
	@docker-compose down

dev-restart:
	@echo "🔄 Reiniciando containers de desenvolvimento..."
	@docker-compose restart 