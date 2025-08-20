# Usar Node.js 18 Alpine como imagem base
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 5173

# Comando padrão
CMD ["npm", "run", "dev"] 