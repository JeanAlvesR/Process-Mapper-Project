#!/bin/bash

# Script para executar o projeto em modo desenvolvimento com Docker

set -e

echo "🚀 Iniciando Process Mapper em modo desenvolvimento..."

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

# Parar containers existentes se estiverem rodando
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover containers e volumes antigos (opcional)
if [ "$1" = "--clean" ]; then
    echo "🧹 Limpando containers e volumes antigos..."
    docker-compose down -v
    docker system prune -f
fi

# Construir e iniciar os containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build

echo "✅ Process Mapper iniciado com sucesso!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "Para parar os containers, pressione Ctrl+C ou execute: docker-compose down" 