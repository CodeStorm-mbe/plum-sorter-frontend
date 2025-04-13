# Plum Classification Frontend

Ce projet est le frontend pour le système de classification de prunes, conçu pour faciliter la vie des agriculteurs en leur permettant de classifier leurs prunes à l'aide d'un modèle de machine learning.

## Fonctionnalités

- **Authentification sécurisée** avec vérification d'email et gestion des tokens JWT
- **Tableau de bord** avec statistiques et indicateurs clés de performance
- **Gestion des fermes** pour organiser les données par exploitation agricole
- **Classification des prunes** par téléchargement d'images individuelles
- **Gestion des lots** pour classifier des groupes d'images simultanément
- **Statistiques et visualisations** pour analyser la qualité des prunes
- **Paramètres utilisateur** pour personnaliser l'expérience

## Technologies utilisées

- **React 18** avec **TypeScript** pour un développement robuste et typé
- **Vite** comme outil de build rapide et moderne
- **Mantine UI** pour les composants d'interface utilisateur
- **React Router** pour la navigation
- **React Query** pour la gestion des données côté client
- **Axios** pour les requêtes API
- **Mantine Charts** pour les visualisations de données
- **JWT Decode** pour la gestion des tokens d'authentification

## Prérequis

- Node.js 16+ et npm 8+
- API backend de classification de prunes en cours d'exécution

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-organisation/plum-classification-frontend.git
   cd plum-classification-frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   VITE_API_URL=plum-api.onrender.com
   ```

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Structure du projet

```
plum-frontend/
├── public/                 # Fichiers statiques
├── src/
│   ├── components/         # Composants réutilisables
│   ├── contexts/           # Contextes React (auth, thème)
│   ├── hooks/              # Hooks personnalisés
│   ├── layouts/            # Layouts de l'application
│   ├── pages/              # Pages principales
│   ├── services/           # Services API
│   ├── types/              # Types TypeScript
│   ├── utils/              # Fonctions utilitaires
│   ├── App.tsx             # Composant principal
│   └── main.tsx            # Point d'entrée
├── .env                    # Variables d'environnement
├── index.html              # Template HTML
├── package.json            # Dépendances et scripts
├── tsconfig.json           # Configuration TypeScript
└── vite.config.ts          # Configuration Vite
```

## Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production localement
- `npm run lint` : Vérifie le code avec ESLint
- `npm run type-check` : Vérifie les types TypeScript

## Déploiement

Pour déployer l'application en production :

1. Construisez l'application :
   ```bash
   npm run build
   ```

2. Le dossier `dist` contient les fichiers statiques prêts à être déployés sur n'importe quel serveur web.

3. Pour un déploiement avec Docker, utilisez le Dockerfile fourni :
   ```bash
   docker build -t plum-classification-frontend .
   docker run -p 80:80 plum-classification-frontend
   ```

## Configuration du backend

Ce frontend est conçu pour fonctionner avec l'API backend de classification de prunes. Assurez-vous que le backend est correctement configuré et accessible à l'URL spécifiée dans le fichier `.env`.

## Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification. Les tokens sont stockés dans le localStorage et automatiquement rafraîchis lorsqu'ils expirent.

## Personnalisation

- **Thème** : Modifiez les couleurs dans `src/App.tsx` pour personnaliser l'apparence
- **Logo** : Remplacez les fichiers dans le dossier `public`
- **API URL** : Modifiez la variable `VITE_API_URL` dans le fichier `.env`

## Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## Contact

Pour toute question ou assistance, veuillez contacter support@plumclassifier.com
