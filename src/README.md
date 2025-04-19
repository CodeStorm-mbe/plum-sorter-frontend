# Documentation des Fonctionnalités du Système de Classification des Prunes

## Fonctionnalités par Rôle

### Rôle Farmer

Le rôle "Farmer" dispose des fonctionnalités suivantes pour gérer ses fermes, lots et classifications de prunes :

#### 1. Gestion des Fermes

- **Création de fermes** : Le farmer peut créer de nouvelles fermes en spécifiant le nom, la localisation, la description, la superficie et les coordonnées géographiques.
- **Modification de fermes** : Le farmer peut modifier les informations de ses fermes existantes.
- **Suppression de fermes** : Le farmer peut supprimer des fermes qu'il ne souhaite plus gérer.
- **Visualisation des fermes** : Le farmer peut consulter la liste de toutes ses fermes avec des statistiques associées.

#### 2. Gestion des Lots

- **Création de lots** : Le farmer peut créer de nouveaux lots de prunes associés à une ferme spécifique.
- **Modification de lots** : Le farmer peut modifier les informations des lots existants.
- **Suppression de lots** : Le farmer peut supprimer des lots qu'il ne souhaite plus gérer.
- **Visualisation des lots** : Le farmer peut consulter la liste de tous ses lots avec des statistiques associées.

#### 3. Classification des Prunes

- **Ajout d'images de prunes** : Le farmer peut télécharger des images de prunes pour les ajouter à un lot spécifique.
- **Classification des images** : Le farmer peut lancer la classification automatique des images de prunes téléchargées.
- **Visualisation des résultats** : Le farmer peut consulter les résultats de classification pour chaque lot et chaque image.
- **Options avancées** : Le farmer peut utiliser des options comme TTA (Test Time Augmentation) et la géolocalisation lors de la classification.

### Rôle Technician

Le rôle "Technician" dispose des fonctionnalités suivantes pour surveiller et maintenir le système :

- Surveillance des fermes et des lots
- Maintenance des équipements
- Calibration du système
- Analyse des données de classification
- Génération de rapports techniques

### Rôle Admin

Le rôle "Admin" dispose des fonctionnalités suivantes pour administrer l'ensemble du système :

- Gestion des utilisateurs et des rôles
- Configuration du système
- Surveillance des performances
- Gestion des modèles de classification
- Analyse des données globales
- Sauvegarde et restauration du système

## Composants Implémentés

### Dashboards par Rôle

Chaque rôle dispose d'un dashboard spécifique avec une sidebar adaptée à ses besoins :

1. **FarmerSidebar** : Interface pour les agriculteurs avec accès aux fermes, lots et classifications.
2. **TechnicianSidebar** : Interface pour les techniciens avec accès à la maintenance et aux rapports.
3. **AdminSidebar** : Interface pour les administrateurs avec accès à la gestion des utilisateurs et du système.

### Gestion des Fermes

- **FarmsPage** : Page principale listant toutes les fermes avec filtrage et tri.
- **FarmPage** : Page détaillée d'une ferme spécifique.
- **FarmFormPage** : Formulaire pour créer ou modifier une ferme.

### Gestion des Lots

- **BatchesPage** : Page principale listant tous les lots avec filtrage et tri.
- **BatchPage** : Page détaillée d'un lot spécifique.
- **BatchForm** : Composant pour créer ou modifier un lot.

### Classification des Prunes

- **BatchClassificationPage** : Page pour télécharger et classifier des images de prunes pour un lot spécifique.
- **ClassificationPage** : Page pour visualiser les résultats de classification.
- **ClassificationForm** : Composant pour configurer les options de classification.

## Services API

Les services suivants ont été implémentés pour interagir avec l'API backend :

- **FarmService** : Service pour la gestion des fermes (création, modification, suppression, récupération).
- **BatchService** : Service pour la gestion des lots (création, modification, suppression, récupération).
- **ClassificationService** : Service pour la classification des prunes (téléchargement d'images, classification, récupération des résultats).

## Modifications Apportées

### Remplacement des Données Statiques

Les données statiques ont été remplacées par des appels API dynamiques dans les composants suivants :

- **FarmsPage** : Remplacement des fermes de démonstration par des données réelles provenant de l'API.
- Autres composants utilisant des données dynamiques : BatchPage, BatchClassificationPage, etc.

### Intégration des Dashboards par Rôle

- Implémentation de sidebars spécifiques pour chaque rôle (farmer, technician, admin).
- Modification du DashboardLayout pour afficher automatiquement la sidebar appropriée en fonction du rôle de l'utilisateur.

## Utilisation

### Création d'une Ferme

1. Accéder à la page "Fermes" depuis la sidebar.
2. Cliquer sur le bouton "Nouvelle ferme".
3. Remplir le formulaire avec les informations de la ferme.
4. Cliquer sur "Enregistrer" pour créer la ferme.

### Création d'un Lot

1. Accéder à la page "Lots" depuis la sidebar.
2. Cliquer sur le bouton "Nouveau lot".
3. Sélectionner la ferme associée et remplir les informations du lot.
4. Cliquer sur "Créer" pour créer le lot.

### Ajout de Prunes à un Lot

1. Accéder à la page "Lots" depuis la sidebar.
2. Trouver le lot souhaité et cliquer sur l'icône "Classifier".
3. Télécharger les images de prunes à classifier.
4. Configurer les options de classification si nécessaire.
5. Cliquer sur "Classifier les images" pour lancer le processus.

## Conclusion

Le système de classification des prunes offre une interface utilisateur complète et intuitive adaptée aux différents rôles. Les fonctionnalités de gestion des fermes, des lots et de classification des prunes sont pleinement opérationnelles et utilisent des données dynamiques provenant de l'API backend.
