# --- ETAPA 1: Build (Construcción) ---
# Usamos una imagen de Node para construir la aplicación
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias e instalamos todo (incluyendo devDependencies)
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Ejecutamos el comando de build de Nest.js para compilar el TypeScript a JavaScript
RUN npm run build

# --- ETAPA 2: Production (Producción) ---
# Empezamos desde una imagen limpia de Node para la versión final
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiamos los archivos de dependencias nuevamente
COPY package*.json ./
# Instalamos SOLAMENTE las dependencias de producción
RUN npm install --only=production

# Copiamos la carpeta 'dist' (con el código compilado) y 'node_modules' desde la etapa 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# Exponemos el puerto que usa Nest.js por defecto
EXPOSE 3000

# El comando para iniciar la aplicación en producción
CMD ["node", "dist/main"]