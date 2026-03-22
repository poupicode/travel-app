# TravelApp — React Native / Expo

Application mobile de découverte et de planification de voyages, développée avec React Native et Expo dans le cadre du cours de Développement Mobile Cross-Platform.

---

## Lancement du projet

### Prérequis

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`) ou `npx expo`
- Expo Go sur iOS ou Android (ou un simulateur)

### Installation

```bash
npm install
```

### Démarrage

```bash
npm run start:tunnel
```

Scanner le QR code avec l'app Expo Go, ou appuyer sur `i` (iOS Simulator) / `a` (Android Emulator).

> Ce script lance Expo en mode tunnel avec nettoyage du cache (`npx expo@latest start --tunnel --clear`).
> Si Expo propose un autre port (ex: 8082), accepter la proposition.

---

## Choix techniques

### Framework : React Native + Expo

React Native a été choisi pour sa maturité, sa large communauté et la compatibilité native iOS/Android depuis une seule codebase JavaScript. Expo simplifie l'accès aux APIs natives (caméra, géolocalisation, galerie) sans nécessiter d'éjection ni de configuration Xcode/Android Studio.

### Backend : Supabase

Supabase remplit trois rôles :
- **Auth** — inscription, connexion, gestion des sessions JWT
- **Database** — PostgreSQL avec Row Level Security (RLS) pour isoler les données par utilisateur
- **Storage** — bucket `destination-images` pour le stockage des images uploadées

### Geocoding : Nominatim (OpenStreetMap)

API gratuite et sans clé utilisée pour l'autocomplétion du formulaire (nom de ville → pays + continent) et le tri des destinations par proximité géographique.

---

## Architecture du code

```
src/
├── constants/        # Tokens de design (couleurs, espacements, typographie)
├── context/          # AuthContext, ThemeContext (React Context API)
├── data/             # Données statiques (villes, continents, onboarding)
├── hooks/            # Logique métier isolée (useFeedFilter, useTrips, useLocation…)
├── services/         # Accès données Supabase (authService, destinationService…)
├── components/       # Composants UI réutilisables
│   ├── common/       # IconButton, RatingBadge, SectionHeader
│   ├── feed/         # FeedHeader, DestinationCard, BottomNav, CityModal…
│   ├── detail/       # DetailHeader, HeroImage, AuthorRow…
│   └── onboarding/   # OnboardingSlide, OnboardingButtons
├── screens/          # Écrans orchestrateurs (UI uniquement, aucun appel API direct)
├── navigation/       # AppNavigator (stack auth / stack app)
└── utils/            # geocode.js
```

**Principes appliqués :**
- Aucun appel API directement dans les composants UI → tout passe par `services/`
- Logique métier (états, effets, filtres) isolée dans des `hooks/` custom
- Composants UI sans état business, pilotés uniquement par leurs props

---

## Fonctionnalités implémentées

### 🔐 Authentification
- Inscription avec email + mot de passe (Supabase Auth)
- Connexion / déconnexion
- Persistence de session (token JWT stocké via Supabase + AsyncStorage)
- Rôles utilisateurs : **Traveler** (lecture) et **Guide** (CRUD destinations)
- Upgrade de rôle via code secret depuis l'écran Settings

### 🧭 Navigation
- Onboarding animé (carousel FlatList) au premier lancement
- Bottom navigation adaptative selon le rôle (Traveler / Guide)
- Stack navigation avec animations différenciées (slide, fade, bottom sheet)

### 📋 Écrans
| Écran | Rôle |
|---|---|
| Onboarding | Présentation de l'app (3 slides) |
| Login / Register | Authentification |
| Feed | Liste des destinations avec filtre continent + recherche texte |
| Detail | Détail d'une destination, booking, edit/delete (guide propriétaire) |
| Trips (Traveler) | Voyages planifiés avec possibilité d'annuler |
| Mes destinations (Guide) | CRUD complet sur ses destinations |
| Favoris | Destinations mises en favoris |
| Settings | Thème, infos compte, déconnexion |
| Créer / Modifier | Formulaire destination avec géocoding et upload image |

### 📡 Données & API
- Chargement asynchrone avec états `loading` / `success` / `error`
- Bouton "Réessayer" en cas d'erreur réseau
- Données déjà chargées restent affichées si le réseau est coupé
- Optimistic update sur les favoris (UI instantanée, rollback si erreur)

### 📱 Fonctionnalités natives

#### Géolocalisation (`expo-location`)
- Détection automatique de la position GPS
- Tri des destinations par proximité (même pays → même continent → reste)
- Permission demandée explicitement avec message justifié
- Gestion du refus (message d'erreur, pas de crash)

#### Galerie photo (`expo-image-picker`)
- Sélection d'image depuis la galerie pour les destinations (guides)
- Recadrage 16:9 intégré
- Permission demandée au moment de l'action
- Gestion du refus (alerte + fallback URL)
- Upload vers Supabase Storage (base64 → Uint8Array)

### 🎨 UX
- Thème Dark / Light / System (suivi automatique des préférences OS)
- Design cohérent inspiré Dribbble (palette sombre, accents jaune)
- Feedback visuel sur toutes les actions asynchrones (ActivityIndicator)
- Confirmations avant suppressions destructives

---

## Livrables

- Code source : dépôt Git
- Captures d'écran : voir dossier `/screenshots`
- Vidéo de démonstration : voir fichier `demo.mp4`

---

## Variables d'environnement

Le projet utilise les variables Supabase configurées dans `src/lib/supabase.js` :

```js
const SUPABASE_URL = 'https://xxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...';
```

> ⚠️ Pour lancer le projet, remplace ces valeurs par celles de ton propre projet Supabase.

---

## Tables Supabase requises

| Table | Colonnes principales |
|---|---|
| `profiles` | `id`, `username`, `role` (`traveler` / `guide`) |
| `destinations` | `id`, `name`, `location`, `continent`, `price`, `rating`, `image`, `description`, `created_by` |
| `favorites` | `id`, `user_id`, `destination_id` |
| `trips` | `id`, `user_id`, `destination_id`, `booked_at` |

Storage : bucket public `destination-images`.
