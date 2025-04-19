# Analyse de la structure et des fonctionnalités du frontend

## Structure générale du frontend

Le frontend est développé avec React et TypeScript, utilisant Vite comme bundler. Il s'agit d'une application moderne avec une architecture basée sur les composants et les services.

### Organisation des fichiers

- **src/services/** : Contient les services pour communiquer avec l'API backend
- **src/components/** : Contient les composants réutilisables
- **src/pages/** : Contient les pages principales de l'application
- **src/contexts/** : Contient les contextes React pour la gestion d'état global
- **src/utils/** : Contient des fonctions utilitaires
- **src/types/** : Contient les définitions de types TypeScript

### Services API

Les services sont bien structurés et suivent un modèle cohérent :

1. **api.ts** : Configuration de base d'Axios avec intercepteurs pour l'authentification
2. **authService.ts** : Gestion de l'authentification (login, register, etc.)
3. **classificationService.ts** : Gestion des classifications de prunes
4. **dashboardService.ts** : Récupération des données pour le dashboard
5. **farmService.ts** : Gestion des fermes
6. **batchService.ts** : Gestion des lots de prunes
7. **rolePermissionService.ts** : Gestion des permissions basées sur les rôles

### Gestion des rôles

Le système de gestion des rôles est implémenté via `rolePermissionService.ts` qui définit :
- Les permissions disponibles (PERMISSIONS)
- Le mappage des rôles aux permissions (ROLE_PERMISSIONS)
- Des méthodes utilitaires pour vérifier les permissions

Les rôles principaux sont :
- **admin** : Accès complet à toutes les fonctionnalités
- **technician** : Accès aux fermes, lots, classifications et statistiques
- **farmer** : Accès à ses propres fermes, lots et classifications

### Pages spécifiques aux rôles

- **DashboardPage.tsx** : Page générique qui redirige les agriculteurs vers FarmerDashboardPage
- **FarmerDashboardPage.tsx** : Dashboard spécifique pour les agriculteurs

## Fonctionnalités existantes

### Authentification
- Login/Logout
- Inscription
- Réinitialisation de mot de passe
- Vérification d'email

### Gestion des fermes
- Affichage des fermes
- Création/modification/suppression de fermes
- Statistiques par ferme

### Gestion des lots
- Affichage des lots
- Création/modification/suppression de lots
- Classification par lot

### Classification des prunes
- Classification individuelle d'images
- Classification par lot
- Affichage des résultats de classification

### Dashboard
- Statistiques globales
- Distribution de qualité
- Classifications récentes
- Widgets spécifiques par rôle

## Lacunes et incohérences identifiées

### Gestion des rôles
1. **Pages admin manquantes** : Pas de pages dédiées pour la gestion des utilisateurs et des modèles
2. **Page technicien manquante** : Pas de dashboard spécifique pour les techniciens
3. **Permissions incomplètes** : Certaines permissions définies ne sont pas utilisées dans l'interface

### Fonctionnalités backend non exploitées
1. **Nouvelles fonctionnalités du dashboard** : Les fonctionnalités avancées d'analyse ajoutées au backend ne sont pas utilisées
2. **API de prédiction** : Pas d'utilisation des endpoints de prédiction
3. **Comparaison de fermes** : Fonctionnalité non implémentée dans le frontend
4. **Heatmap d'activité** : Non implémenté dans le frontend
5. **Métriques d'exactitude** : Non implémenté dans le frontend

### Problèmes d'interface utilisateur
1. **Incohérence de design** : Mélange de styles et d'approches
2. **Navigation limitée** : Pas de menu latéral cohérent
3. **Responsive design incomplet** : Certaines pages ne s'adaptent pas bien aux mobiles

### Problèmes techniques
1. **Gestion d'état inconsistante** : Mélange de contextes React et de props drilling
2. **Gestion des erreurs limitée** : Pas de gestion centralisée des erreurs API
3. **Tests manquants** : Pas de tests unitaires ou d'intégration

## Prochaines étapes

1. Implémenter les pages manquantes pour chaque rôle
2. Intégrer les nouvelles fonctionnalités du backend
3. Améliorer la gestion des rôles et permissions
4. Moderniser l'interface utilisateur
5. Améliorer la gestion d'état et des erreurs
