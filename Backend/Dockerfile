# Imagen base
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto (coincide con .env PORT=3000)
EXPOSE 3000

# Comando para iniciar
CMD ["node", "server.js"]
