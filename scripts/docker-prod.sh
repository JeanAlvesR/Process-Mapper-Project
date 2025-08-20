#!/bin/bash

# Script para executar o projeto em modo produção com Docker

set -e

echo "🚀 Iniciando Process Mapper em modo produção..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando arquivo .env com valores padrão..."
    cat > .env << EOF
# Configurações do Banco de Dados
DB_USERNAME=postgres
DB_PASSWORD=postgres

# URL da API
API_URL=http://localhost:3000
EOF
    echo "✅ Arquivo .env criado com valores padrão."
    echo "⚠️  IMPORTANTE: Altere as senhas no arquivo .env antes de usar em produção!"
fi

# Parar containers existentes se estiverem rodando
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Remover containers e volumes antigos (opcional)
if [ "$1" = "--clean" ]; then
    echo "🧹 Limpando containers e volumes antigos..."
    docker-compose -f docker-compose.prod.yml down -v
    docker system prune -f
fi

# Construir e iniciar os containers
echo "🔨 Construindo e iniciando containers em modo produção..."
docker-compose -f docker-compose.prod.yml up --build -d

echo "✅ Process Mapper iniciado com sucesso em modo produção!"
echo "📱 Frontend: http://localhost"
echo "🔧 Backend: http://localhost:3000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "Para ver os logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "Para parar os containers: docker-compose -f docker-compose.prod.yml down" 