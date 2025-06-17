# Rapport du Projet Digital Banking

![video démonstratif](../../assets/videos/demo.mp4)

## Table des matières

1. [Introduction](#introduction)
2. [Architecture générale](#architecture-générale)
3. [Partie Backend](#partie-backend)
   - [Technologies utilisées](#technologies-utilisées-backend)
   - [Fonctionnalités implémentées](#fonctionnalités-implémentées-backend)
   - [Architecture et conception](#architecture-et-conception-backend)
   - [Schéma de la base de données](#schéma-de-la-base-de-données)
   - [Configuration](#configuration-backend)
   - [Défis et solutions](#défis-et-solutions-backend)
4. [Partie Frontend](#partie-frontend)
   - [Technologies utilisées](#technologies-utilisées-frontend)
   - [Fonctionnalités implémentées](#fonctionnalités-implémentées-frontend)
   - [Architecture et conception](#architecture-et-conception-frontend)
   - [Composants principaux](#composants-principaux)
   - [Gestion de l'état](#gestion-de-létat)
   - [Style et design](#style-et-design)
   - [Défis et solutions](#défis-et-solutions-frontend)
5. [Connexion Frontend-Backend](#connexion-frontend-backend)
   - [Configuration CORS](#configuration-cors)
   - [Intercepteur JWT](#intercepteur-jwt)
   - [Services API](#services-api)
6. [Captures d'écran](#captures-décran)
   - [Interface utilisateur](#interface-utilisateur)
   - [Fonctionnalités](#fonctionnalités)
   - [Tableaux de bord](#tableaux-de-bord)
7. [Diagrammes](#diagrammes)
   - [Diagramme de classes](#diagramme-de-classes)
   - [Diagramme de séquence](#diagramme-de-séquence)
8. [Améliorations futures](#améliorations-futures)
9. [Conclusion](#conclusion)

## Introduction

Ce rapport présente le développement d'une application de Digital Banking, comprenant un backend développé avec Spring Boot et un frontend développé avec Angular. L'application permet la gestion des clients bancaires, des comptes, et des opérations bancaires, avec un système d'authentification sécurisé basé sur JWT.

## Architecture générale

L'application suit une architecture client-serveur avec une séparation claire entre:
- Une API RESTful développée avec Spring Boot (backend)
- Une interface utilisateur développée avec Angular (frontend)
- Communication via HTTP/JSON
- Authentification et autorisation gérées par JWT

## Partie Backend

### Technologies utilisées (Backend)

*   **Java 17**: Langage de programmation principal.
*   **Spring Boot 3.x**: Framework pour construire des applications robustes et scalables.
    *   **Spring MVC**: Pour créer des services web RESTful.
    *   **Spring Data JPA**: Pour la persistance des données et l'interaction avec la base de données.
    *   **Spring Security**: Pour gérer l'authentification et l'autorisation.
*   **JSON Web Tokens (JWT)**: Pour sécuriser les endpoints de l'API et gérer les sessions utilisateur.
*   **Hibernate**: Implémentation JPA pour l'ORM.
*   **Maven**: Automatisation de build et gestion des dépendances.
*   **Base de données**:
    *   **H2 Database**: Base de données en mémoire pour le développement et les tests.
    *   **MySQL**: Base de données relationnelle pour les environnements de type production.
*   **Lombok**: Pour réduire le code boilerplate (getters, setters, constructeurs).
*   **Swagger/OpenAPI 3**: Pour la documentation de l'API et les tests (accessible via `/swagger-ui.html`).

### Fonctionnalités implémentées (Backend)

*   **Authentification & Autorisation**:
    *   Inscription des utilisateurs (`/api/auth/signup`).
    *   Connexion des utilisateurs avec génération de JWT (`/api/auth/login`).
    *   Fonctionnalité de changement de mot de passe (`/api/auth/changePassword`).
    *   Contrôle d'accès basé sur les rôles (RBAC) avec les rôles "ADMIN" et "USER".
    *   Sécurisation des endpoints API avec Spring Security et JWT.
    *   Récupération du profil utilisateur (`/api/auth/profile`).
*   **Gestion des clients (Admin)**:
    *   Opérations CRUD pour les clients (Créer, Lire, Mettre à jour, Supprimer).
    *   Fonctionnalité de recherche pour les clients.
    *   Endpoints: `/api/customers`.
*   **Gestion des comptes bancaires**:
    *   Création de comptes Courants et d'Épargne.
    *   Récupération des détails des comptes et des listes de comptes.
    *   Récupération des comptes associés à un client spécifique.
    *   Endpoints: `/api/accounts`.
*   **Opérations sur les comptes**:
    *   Opérations de Débit et Crédit sur les comptes bancaires.
    *   Transfert de fonds entre comptes.
    *   Récupération de l'historique des opérations de compte avec pagination.
    *   Endpoints: `/api/accounts/{accountId}/operations`, `/api/accounts/debit`, `/api/accounts/credit`, `/api/accounts/transfer`.
*   **Gestion des utilisateurs (Admin)**:
    *   Liste des utilisateurs.
    *   Attribution/retrait de rôles aux utilisateurs.
    *   Endpoints: `/api/admin/users`, `/api/admin/roles`.

### Architecture et conception (Backend)

*   **Architecture en couches**:
    *   **Couche Contrôleur**: Gère les requêtes et réponses HTTP (API REST).
    *   **Couche Service**: Contient la logique métier.
    *   **Couche Repository**: Interagit avec la base de données en utilisant Spring Data JPA.
    *   **Couche Entité**: Définit les modèles de données (entités JPA).
    *   **Couche DTO (Data Transfer Object)**: Utilisée pour le transfert de données entre les couches, en particulier pour les réponses et requêtes API.
    *   **Couche Mapper**: Convertit entre les DTO et les Entités.
*   **Sécurité**:
    *   `JwtAuthenticationFilter` pour valider les tokens JWT à chaque requête.
    *   Implémentation de `UserDetailsService` pour charger les données spécifiques à l'utilisateur.
    *   `PasswordEncoder` (BCrypt) pour le stockage sécurisé des mots de passe.
    *   `AuthenticationEntryPoint` personnalisé pour gérer l'accès non autorisé.
*   **Gestion des erreurs**:
    *   Exceptions personnalisées (ex: `CustomerNotFoundException`, `BankAccountNotFoundException`, `BalanceNotSufficientException`).
    *   Gestion globale des exceptions (bien que non explicitement montrée dans les fichiers fournis, généralement implémentée avec `@ControllerAdvice`).
*   **Audit**:
    *   Champs d'audit de base (`createdBy`, `lastModifiedBy`) présents dans certaines entités, peuplés avec le nom d'utilisateur de l'utilisateur authentifié effectuant l'action.

### Schéma de la base de données

*   **`Customer`**: Stocke les informations sur les clients.
*   **`BankAccount`**: Classe de base abstraite pour les comptes bancaires, utilisant l'héritage sur une seule table (`CurrentAccount`, `SavingAccount`).
*   **`AccountOperation`**: Enregistre toutes les transactions (débit, crédit).
*   **`AppUser`**: Stocke les identifiants et rôles des utilisateurs pour l'accès à l'application.
*   **`AppRole`**: Définit les rôles des utilisateurs (ex: ADMIN, USER).

### Configuration (Backend)

*   **`application.properties`**: Configuration centralisée pour le port du serveur, la connexion à la base de données (H2/MySQL), les secrets JWT, et les niveaux de journalisation.
*   **Configuration CORS**: Activée pour autoriser les requêtes de l'application frontend (typiquement `http://localhost:4200`).
*   **Initialisation des données**: `CommandLineRunner` dans la classe principale de l'application pour créer les rôles par défaut (ADMIN, USER) et les utilisateurs (admin, user) au démarrage.

### Défis et solutions (Backend)

*   **Mismatch de signature JWT**: Assuré que la clé secrète utilisée pour signer et valider les JWT était identique et traitée de manière cohérente (ex: octets UTF-8 vs. décodage Base64). Cela a été résolu en standardisant la dérivation de clé dans `JwtUtils.java` et `JWTService.java` et en s'assurant de la configuration correcte dans `application.properties`.
*   **Analyse du fichier de propriétés**: Correction du formatage des propriétés numériques avec des commentaires dans `application.properties` pour éviter `NumberFormatException`.
*   **Problèmes d'initialisation paresseuse**: Résolution des potentielles `LazyInitializationException` en utilisant des DTO et en s'assurant que les données nécessaires sont récupérées dans les méthodes de service transactionnelles ou en configurant les types de récupération appropriés. (L'utilisation de `@Lazy` sur `UserDetailsService` dans `JwtAuthenticationFilter` et `ApplicationConfig` est un modèle courant pour briser les dépendances circulaires).

## Partie Frontend

### Technologies utilisées (Frontend)

*   **Angular (version récente)**: Framework principal pour construire la SPA.
*   **TypeScript**: Langage de programmation principal.
*   **HTML5 & CSS3**: Pour la structure et le style.
*   **Bootstrap 5**: Framework CSS pour la conception responsive et les composants UI.
*   **NgBootstrap**: Widgets Angular pour Bootstrap (utilisés pour les modales).
*   **Ng2-Charts (Chart.js)**: Pour afficher des graphiques sur le tableau de bord.
*   **RxJS**: Pour la programmation réactive et la gestion des opérations asynchrones.
*   **Angular CLI**: Pour la génération de projet, la construction et les tâches de développement.

### Fonctionnalités implémentées (Frontend)

*   **Authentification utilisateur**:
    *   Page de connexion avec validation du formulaire.
    *   Page d'inscription des utilisateurs.
    *   Gestion des tokens JWT (stockage et inclusion dans les requêtes API via un intercepteur HTTP).
    *   Fonctionnalité de déconnexion.
*   **Navigation & Mise en page**:
    *   Navbar responsive avec liens conditionnels selon l'état d'authentification et les rôles des utilisateurs.
    *   Routage pour les différentes sections de l'application.
*   **Tableau de bord**:
    *   Cartes récapitulatives (Total Clients, Total Comptes, Solde Total).
    *   Graphiques affichant les types et statuts des comptes.
*   **Gestion des clients (Vue Admin)**:
    *   Liste des clients avec fonctionnalité de recherche.
    *   Affichage des détails d'un client.
    *   Création de nouveaux clients (via modal/formulaire).
    *   Édition des clients existants (via formulaire).
    *   Suppression des clients.
*   **Gestion des comptes**:
    *   Liste des comptes bancaires avec fonctionnalité de recherche.
    *   Affichage des détails du compte, y compris l'historique des transactions (paginé).
    *   Création de nouveaux comptes Courants et d'Épargne (via des formulaires dédiés).
    *   Transfert de fonds entre comptes (via modal).
*   **Opérations**:
    *   Affichage de la liste de toutes les opérations (esquisse, pourrait être amélioré).
    *   Réalisation d'opérations de débit/crédit (via modals dans les Détails du Compte ou une page d'opérations dédiée).
*   **Gestion du profil utilisateur**:
    *   Affichage des informations du profil utilisateur.
    *   Changement du mot de passe utilisateur.

### Architecture et conception (Frontend)

*   **Architecture basée sur les composants**: L'application est structurée en composants modulaires et réutilisables.
*   **Services**: Services dédiés pour interagir avec l'API backend (ex: `AuthService`, `CustomerService`, `AccountService`).
*   **Routage**: Angular Router gère la navigation entre les différentes vues.
*   **Gardiens**:
    *   `AuthGuard`: Protège les routes nécessitant une authentification.
    *   `AdminGuard`: Protège les routes nécessitant des privilèges d'administrateur.
*   **Intercepteur HTTP (`AuthInterceptor`)**: Attache automatiquement les tokens JWT aux requêtes API sortantes.
*   **Formulaires réactifs**: Utilisés pour gérer les données et la validation des formulaires (ex: Connexion, Inscription, Formulaire Client, Formulaire Compte).
*   **Composants autonomes**: La plupart des composants sont implémentés en tant que composants autonomes, simplifiant la gestion des modules.
*   **Modèles**: Interfaces TypeScript définissant la structure des données (ex: `Customer`, `BankAccount`, `AccountOperation`).

### Composants principaux

*   `AppComponent`: Composant racine.
*   `NavbarComponent`: Barre de navigation principale.
*   `LoginComponent`: Connexion utilisateur.
*   `RegisterComponent`: Inscription utilisateur.
*   `DashboardComponent`: Vue d'ensemble et graphiques.
*   `CustomersComponent`: Liste et gestion des clients.
*   `CustomerFormComponent`: Pour créer/éditer des clients.
*   `CustomerDetailsComponent`: Affiche les détails d'un client et ses comptes.
*   `AccountsComponent`: Liste et gestion des comptes bancaires.
*   `AccountFormComponent`: Pour créer de nouveaux comptes bancaires.
*   `AccountDetailsComponent`: Affiche les détails d'un compte bancaire et ses opérations.
*   `OperationsComponent`: Vue générale des opérations (peut être étendue).
*   `TransferOperationComponent`: Modal pour les transferts de fonds.
*   `ProfileComponent`: Vue du profil utilisateur.
*   `ChangePasswordComponent`: Pour changer le mot de passe utilisateur.

### Gestion de l'état

*   Principalement gérée au sein des composants et services individuels.
*   `AuthService` utilise `BehaviorSubject` pour gérer et diffuser l'état d'authentification de l'utilisateur courant.
*   RxJS est utilisé de manière extensive pour gérer les flux de données asynchrones provenant des appels API.

### Style et design

*   **Bootstrap 5**: Fournit le style de base et le système de grille responsive.
*   **CSS personnalisé**: Styles spécifiques aux composants appliqués pour personnaliser l'apparence et la mise en page.
*   **Icônes Bootstrap**: Utilisées pour l'iconographie.

### Défis et solutions (Frontend)

*   **Problèmes de rendu de graphiques**: Erreurs "can't acquire context" avec `ng2-charts`. Résolu en s'assurant que `NgChartsModule` était correctement importé dans les composants autonomes et que l'élément canvas était disponible dans le DOM au moment de l'initialisation du graphique. Hauteurs des conteneurs de graphiques ajustées pour éviter la coupure de légende.
*   **Intégration JavaScript de Bootstrap**: Pour les composants autonomes, le JS de Bootstrap (pour les dropdowns, modals) était chargé dynamiquement dans `AppComponent` ou en utilisant des composants NgBootstrap.
*   **Configuration de l'intercepteur JWT**: Configuration de `AuthInterceptor` en utilisant `provideHttpClient(withInterceptors(...))` pour la configuration autonome de l'application.
*   **Problèmes CORS**: Gérés en configurant le backend pour autoriser les requêtes de l'origine du frontend (`http://localhost:4200`).
*   **Validation et soumission des formulaires réactifs**: Mise en œuvre d'une validation robuste des formulaires et retour d'information utilisateur pour divers formulaires.

## Connexion Frontend-Backend

### Configuration CORS

```java
// in package ma.digitbank.jeespringangularjwtdigitalbanking.config
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

### Intercepteur JWT

```typescript
// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
```

### Services API

```typescript
// src/app/services/customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  // ...autres méthodes
}
```

## Captures d'écran

Cette section présente les différentes interfaces et fonctionnalités de l'application Digital Banking.

### Interface utilisateur

#### Page de connexion
![Page de connexion](../../assets/images/login-screenshot.png)
*Description: Interface de connexion avec validation des champs*

#### Page d'inscription
![Page d'inscription](../../assets/images/register-screenshot.png)
*Description: Formulaire d'inscription pour les nouveaux utilisateurs*

#### Barre de navigation
![Barre de navigation](../../assets/images/navbar-screenshot.png)
*Description: Barre de navigation responsive avec éléments conditionnels selon le rôle de l'utilisateur*

### Fonctionnalités

#### Liste des clients
![Liste des clients](../../assets/images/customers-list-screenshot.png)
*Description: Interface de gestion des clients avec recherche et actions CRUD*
#### Détail d'un client
![Détail d'un client](../../assets/images/customer-details-screenshot.png)
*Description: Informations détaillées d'un client avec ses comptes associés*

#### Liste des comptes
![Liste des comptes](../../assets/images/accounts-list-screenshot.png)
![Liste des comptes](../../assets/images/accounts-list-screenshot2.png)

*Description: Liste de tous les comptes bancaires avec fonctionnalité de recherche*

#### Détail d'un compte
![Détail d'un compte](../../assets/images/account-details-screenshot.png)
![Détail d'un compte](../../assets/images/account-details-screenshot2.png)

*Description: Informations détaillées d'un compte avec historique des opérations*

#### Opérations bancaires
![Formulaire de transfert](../../assets/images/transfer-operation-screenshot.png)
*Description: Interface de transfert d'argent entre comptes*

### Tableaux de bord

#### Dashboard administrateur
![Dashboard administrateur](../../assets/images/admin-dashboard-screenshot.png)
*Description: Tableau de bord avec statistiques et graphiques pour les administrateurs*


## Diagrammes

### Diagramme de classes

Le diagramme de classes du backend illustre les relations entre les entités principales du système:

![Diagramme de classes](../../assets/images/class-diagram.png)
![Diagramme de classes](../../assets/images/class-diagram2.png)
![Diagramme de classes](../../assets/images/class-diagram3.png)
![Diagramme de classes](../../assets/images/class-diagram4.png)
![Diagramme de classes](../../assets/images/class-diagram5.png)

*Description: Diagramme UML des principales classes du système*

### Diagramme de séquence

Le diagramme de séquence illustre le flux d'authentification et d'opération bancaire:

![Diagramme de séquence](../../assets/images/sequence-diagram.png)
*Description: Flux d'authentification et d'opération bancaire*

## Améliorations futures

### Backend
- Implémentation de permissions plus granulaires
- Authentification à deux facteurs
- Rapports avancés et analyses
- Intégration avec des services externes (ex: notifications par email)
- Audit plus complet des actions utilisateurs

### Frontend
- Solution de gestion d'état plus sophistiquée (ex: NgRx ou Elf) si la complexité de l'application augmente
- Tables de données avancées avec pagination, tri et filtrage côté serveur pour les listes
- Notifications en temps réel (ex: pour les nouvelles transactions)
- Amélioration de l'interface utilisateur et animations
- Tests unitaires et end-to-end plus complets
- Internationalisation (i18n)

## Conclusion

Ce projet démontre une mise en œuvre complète d'une application bancaire digitale avec une architecture moderne et sécurisée. L'utilisation de Spring Boot pour le backend et Angular pour le frontend permet une séparation claire des préoccupations tout en offrant une expérience utilisateur riche et réactive.

La combinaison des technologies choisies offre une base solide pour l'évolution future de l'application, avec la possibilité d'ajouter de nouvelles fonctionnalités et d'améliorer les performances selon les besoins.
