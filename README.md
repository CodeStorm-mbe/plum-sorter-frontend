# TriPrune - Interface Frontend pour le Tri Automatique des Prunes

Ce projet a été développé dans le cadre du hackathon JCIA 2025 pour le tri automatique des prunes en six catégories (bonne qualité, non mûre, tachetée, fissurée, meurtrie et pourrie) à l'aide de techniques avancées de vision par ordinateur et d'apprentissage profond.

## Technologies utilisées

- React avec TypeScript
- Tailwind CSS pour le styling
- Framer Motion pour les animations
- Recharts pour les visualisations de données
- React Router pour la navigation

## Structure du projet

```
plum-sorter/
├── public/
│   └── ...
├── src/
│   ├── components/      # Composants réutilisables
│   ├── pages/           # Pages principales de l'application
│   ├── styles/          # Fichiers CSS et styles globaux
│   ├── hooks/           # Hooks personnalisés React
│   ├── utils/           # Fonctions utilitaires
│   ├── assets/          # Images et autres ressources
│   ├── App.tsx          # Composant principal avec les routes
│   └── index.tsx        # Point d'entrée de l'application
└── ...
```

## Fonctionnalités

### Page d'accueil
- Section Hero avec titre, sous-titre et illustration
- Bouton CTA "Tester maintenant" qui redirige vers l'outil de prédiction
- Section "Comment ça marche" en 3 étapes (Upload → Prédiction → Résultat)
- Aperçu des statistiques (nombre d'images traitées, accuracy globale)

### Page de prédiction
- Zone drag & drop pour l'upload d'images
- Prévisualisation de l'image
- Bouton "Analyser" qui déclenche l'appel API
- Affichage du résultat :
  - Catégorie détectée (icône + nom)
  - Score de confiance (%)
  - Heatmap Grad-CAM superposée sur l'image (option "Voir explication")

### Dashboard de suivi
- Graphiques d'évolution de l'accuracy
- Répartition des prédictions par catégorie (pie chart)
- Tableau des dernières images traitées (miniatures + résultat + date)
- Filtres par date et par catégorie

### Page "À propos" / "Documentation"
- Explication du hackathon et des techniques utilisées
- Liens vers le code source et le dataset
- Contact et crédits

## Installation et démarrage

1. Assurez-vous d'avoir Node.js (version 16 ou supérieure) installé sur votre machine
2. Clonez ce dépôt
3. Installez les dépendances :
   ```
   cd plum-sorter
   npm install
   ```
4. Démarrez le serveur de développement :
   ```
   npm run dev
   ```
5. Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000)

## Déploiement

Pour créer une version de production :

```
npm run build
```

Les fichiers de production seront générés dans le dossier `build`.

## Intégration avec le backend

Cette interface frontend est conçue pour communiquer avec un backend via API. Pour l'instant, les données sont simulées, mais vous pouvez facilement intégrer votre propre API en modifiant les appels dans les composants appropriés.

## Crédits

Développé pour le hackathon JCIA 2025 - Tri Automatique des Prunes.
