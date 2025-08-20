#!/bin/bash

# Script para instalar Docker e Docker Compose no Ubuntu/Debian

set -e

echo "🐳 Instalando Docker e Docker Compose..."

# Verificar se é Ubuntu/Debian
if ! command -v apt &> /dev/null; then
    echo "❌ Este script é específico para Ubuntu/Debian."
    echo "📖 Para outras distribuições, consulte: https://docs.docker.com/engine/install/"
    exit 1
fi

# Atualizar repositórios
echo "📦 Atualizando repositórios..."
sudo apt update

# Instalar dependências
echo "🔧 Instalando dependências..."
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common

# Adicionar chave GPG oficial do Docker
echo "🔑 Adicionando chave GPG do Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório do Docker
echo "📋 Adicionando repositório do Docker..."
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Atualizar repositórios novamente
sudo apt update

# Instalar Docker
echo "🐳 Instalando Docker..."
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Adicionar usuário ao grupo docker
echo "👤 Adicionando usuário ao grupo docker..."
sudo usermod -aG docker $USER

# Instalar Docker Compose standalone (versão mais antiga para compatibilidade)
echo "📦 Instalando Docker Compose standalone..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
echo "✅ Verificando instalação..."
if command -v docker &> /dev/null; then
    echo "✅ Docker instalado com sucesso!"
    docker --version
else
    echo "❌ Erro na instalação do Docker"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose instalado com sucesso!"
    docker-compose --version
else
    echo "❌ Erro na instalação do Docker Compose"
    exit 1
fi

# Iniciar e habilitar Docker
echo "🚀 Iniciando serviço Docker..."
sudo systemctl start docker
sudo systemctl enable docker

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Faça logout e login novamente para aplicar as permissões do grupo docker"
echo "   2. Ou execute: newgrp docker"
echo ""
echo "🧪 Para testar a instalação:"
echo "   docker run hello-world"
echo ""
echo "📖 Próximos passos:"
echo "   1. Faça logout e login novamente"
echo "   2. Execute: make setup"
echo "   3. Execute: make dev" 