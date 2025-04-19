# Composants de Dashboard par Rôle

Ce document décrit les composants de dashboard spécifiques à chaque rôle dans l'application TriPrune.

## Structure des Sidebars

Chaque rôle dans l'application (farmer, technician, admin) dispose désormais d'une sidebar personnalisée qui affiche uniquement les fonctionnalités pertinentes pour ce rôle. Les sidebars suivent une structure commune pour maintenir la cohérence de l'interface utilisateur.

### Composants communs

- `SidebarItem` : Élément de menu principal avec icône, libellé et indicateur de sous-menu
- `SubmenuItem` : Élément de sous-menu avec libellé
- Animation des sous-menus avec Framer Motion
- Indicateurs visuels pour les éléments actifs
- Section d'information en bas de la sidebar
- Pied de page avec version et copyright

## Sidebars par Rôle

### FarmerSidebar

Sidebar spécifique aux agriculteurs avec des fonctionnalités centrées sur la gestion des fermes, des lots et des classifications.

**Sections principales :**
- Tableau de bord
- Mes fermes (avec sous-menu)
- Mes lots (avec sous-menu)
- Classifications (avec sous-menu)
- Statistiques
- Rapports (avec sous-menu)
- Paramètres
- Aide & Support

### TechnicianSidebar

Sidebar spécifique aux techniciens avec des fonctionnalités centrées sur la maintenance, les statistiques et les rapports.

**Sections principales :**
- Tableau de bord
- Fermes (avec sous-menu)
- Lots (avec sous-menu)
- Classifications (avec sous-menu)
- Statistiques
- Rapports (avec sous-menu)
- Maintenance (avec sous-menu)
- Paramètres
- Aide & Support

### AdminSidebar

Sidebar spécifique aux administrateurs avec des fonctionnalités centrées sur la gestion des utilisateurs, des modèles et du système.

**Sections principales :**
- Tableau de bord
- Utilisateurs (avec sous-menu)
- Modèles (avec sous-menu)
- Système (avec sous-menu)
- Fermes (avec sous-menu)
- Lots (avec sous-menu)
- Classifications (avec sous-menu)
- Statistiques
- Rapports (avec sous-menu)
- Paramètres

## Intégration dans le Layout

Le composant `DashboardLayout` a été modifié pour afficher automatiquement la sidebar appropriée en fonction du rôle de l'utilisateur connecté. Une fonction `renderSidebar()` sélectionne le bon composant de sidebar en fonction de la propriété `role` de l'utilisateur.

## Utilisation

Les sidebars sont automatiquement intégrées dans le layout de l'application et ne nécessitent pas d'implémentation supplémentaire. Lorsqu'un utilisateur se connecte, la sidebar correspondant à son rôle est automatiquement affichée.

## Personnalisation

Pour ajouter de nouveaux éléments de menu ou modifier les éléments existants, modifiez le fichier de la sidebar correspondante :

- `/src/components/FarmerSidebar.tsx`
- `/src/components/TechnicianSidebar.tsx`
- `/src/components/AdminSidebar.tsx`

Assurez-vous que les routes correspondantes sont également définies dans le fichier `RoleContext.tsx` pour que les utilisateurs aient les permissions nécessaires pour accéder aux nouvelles pages.
