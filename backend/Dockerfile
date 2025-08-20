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

# Compilar TypeScript
RUN pnpm run build

# Expor porta
EXPOSE 3000 9229
 
CMD ["node", "--inspect=0.0.0.0:9229", "index.ts"]

# Comando padrão
CMD ["npm", "run", "dev"] 

