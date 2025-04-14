<<<<<<< HEAD
# Dockerfile pour le déploiement du frontend plum-sorter

# Étape de build
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json ./
=======
FROM node:20-alpine as build

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314

# Installer les dépendances
RUN npm ci

<<<<<<< HEAD
# Copier le reste des fichiers du projet
COPY . .
=======
# Copier le code source
COPY src/ ./src/
COPY public/ ./public/
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314

# Construire l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

<<<<<<< HEAD
# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de build depuis l'étape précédente
=======
# Copier nginx.conf comme template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copier les fichiers de build
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

<<<<<<< HEAD
# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
=======
# Substituer les variables d'environnement au démarrage
CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314
