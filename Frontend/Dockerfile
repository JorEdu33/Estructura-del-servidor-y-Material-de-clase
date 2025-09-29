# Etapa 1: build
FROM node:20 AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Etapa 2: servidor estático
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
