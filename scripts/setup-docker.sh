#!/bin/bash

# Script para configuração inicial do Docker

set -e

echo "🔧 Configurando Docker para Process Mapper..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado."
    echo "📖 Instruções de instalação:"
    echo "   Ubuntu/Debian: https://docs.docker.com/engine/install/ubuntu/"
    echo "   macOS: https://docs.docker.com/desktop/install/mac-install/"
    echo "   Windows: https://docs.docker.com/desktop/install/windows-install/"
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado."
    echo "📖 Instruções de instalação: https://docs.docker.com/compose/install/"
    exit 1
fi

# Verificar se o Docker está rodando
if ! docker info &> /dev/null; then
    echo "❌ Docker não está rodando."
    echo "🚀 Inicie o Docker e tente novamente."
    exit 1
fi

echo "✅ Docker está instalado e rodando!"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado com valores padrão."
    echo "⚠️  IMPORTANTE: Altere as senhas no arquivo .env antes de usar em produção!"
else
    echo "✅ Arquivo .env já existe."
fi

# Verificar se o usuário está no grupo docker
if ! groups $USER | grep -q docker; then
    echo "⚠️  Usuário não está no grupo docker."
    echo "🔧 Adicionando usuário ao grupo docker..."
    sudo usermod -aG docker $USER
    echo "✅ Usuário adicionado ao grupo docker."
    echo "🔄 Faça logout e login novamente para aplicar as mudanças."
fi

# Testar Docker
echo "🧪 Testando Docker..."
docker run --rm hello-world &> /dev/null
echo "✅ Docker funcionando corretamente!"

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Para desenvolvimento: ./scripts/docker-dev.sh"
echo "   2. Para produção: ./scripts/docker-prod.sh"
echo "   3. Para ver logs: docker-compose logs -f"
echo "   4. Para parar: docker-compose down"
echo ""
echo "📖 Documentação completa: README-Docker.md" 