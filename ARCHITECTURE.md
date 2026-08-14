# Architecture du portfolio

Ce document décrit l'état actuel du projet et sert de référence avant l'ajout d'un chatbot.

## 1. Vue d'ensemble

Le projet est un portfolio personnel construit avec :

- Next.js 16.1.6 et son App Router ;
- React 19.2.3 et TypeScript 5 en mode strict ;
- Tailwind CSS 4 pour les styles ;
- Framer Motion pour les animations ;
- EmailJS pour l'envoi du formulaire de contact ;
- Lucide React et React Icons pour les icônes.

L'application utilise maintenant une Route Handler Next.js pour son assistant IA. Elle ne contient toujours ni backend séparé, ni base de données, ni système d'authentification.

## 2. Arborescence utile

```text
portfolio/
|-- app/                         # Routes et mise en page Next.js
|   |-- layout.tsx               # Layout racine, polices et métadonnées SEO
|   |-- page.tsx                 # Page d'accueil et assemblage des sections
|   |-- globals.css              # Tailwind, couleurs et styles globaux
|   |-- favicon.ico              # Icône du site
|   |-- projects/
|   |   `-- page.tsx             # Page contenant tous les projets
|   `-- certifications/
|       `-- page.tsx             # Page contenant toutes les certifications
|   `-- api/chat/route.ts         # Endpoint serveur sécurisé du chatbot
|-- components/                  # Composants réutilisables de l'interface
|   |-- AnimatedBackground.tsx   # Arrière-plan animé partagé
|   |-- CertificatePreviewModal.tsx # Fenêtre de prévisualisation d'un certificat
|   |-- CertificationCard.tsx    # Carte de certification
|   |-- Footer.tsx               # Pied de page
|   |-- IntroAnimation.tsx       # Animation d'introduction
|   |-- LoadingScreen.tsx        # Écran de chargement initial
|   |-- Navbar.tsx               # Navigation principale
|   |-- ProjectCard.tsx          # Carte de projet
|   `-- RotatingText.tsx         # Texte animé de la section Hero
|-- sections/                    # Grandes sections de la page d'accueil
|   |-- Hero.tsx                 # Présentation principale
|   |-- About.tsx                # Profil et spécialités
|   |-- Projects.tsx             # Sélection des projets vedettes
|   |-- Skills.tsx               # Compétences techniques
|   |-- Certifications.tsx       # Certifications vedettes
|   |-- Experience.tsx           # Parcours académique et professionnel
|   `-- Contact.tsx              # Formulaire envoyé avec EmailJS
|-- data/                        # Contenu structuré séparé de l'interface
|   |-- projects.ts              # 9 projets et liste des projets vedettes
|   |-- certifications.ts        # 11 certifications et liste vedette
|   |-- skills.ts                # Compétences dev, data et IA/ML
|   `-- journey.ts               # 4 étapes du parcours
|-- public/                      # Fichiers accessibles directement par URL
|   |-- profile.jpg              # Photo de profil
|   |-- cv-issam_elghbali.pdf    # CV téléchargeable
|   |-- *.png / *.svg            # Images des projets et icônes statiques
|   |-- certificate-images/      # Aperçus des certificats
|   `-- certificates/            # Certificats PDF ou image à ouvrir
|-- lib/                         # Dossier vide, prévu pour la logique partagée
|   `-- chatbot/                 # Contexte, prompt, ressources, types et validation
|-- .env.local                   # Identifiants publics EmailJS, non versionnés
|-- package.json                 # Dépendances et scripts npm
|-- next.config.ts               # Configuration Next.js (actuellement minimale)
|-- tsconfig.json                # Configuration TypeScript et alias @/*
|-- postcss.config.mjs           # Intégration Tailwind/PostCSS
|-- eslint.config.mjs            # Règles ESLint Next.js
|-- README.md                    # Documentation initiale du projet
`-- ARCHITECTURE.md              # Le présent document
```

Les dossiers `node_modules/` et `.next/` sont générés automatiquement. Ils ne font pas partie du code métier et ne doivent pas être modifiés manuellement. Le fichier `tsconfig.tsbuildinfo` est également un cache généré par TypeScript.

## 3. Routes actuelles

| URL | Fichier | Rôle |
|---|---|---|
| `/` | `app/page.tsx` | Page principale composée de toutes les sections |
| `/projects` | `app/projects/page.tsx` | Liste complète des projets |
| `/certifications` | `app/certifications/page.tsx` | Liste complète et aperçu des certifications |

La page d'accueil affiche les éléments dans cet ordre : arrière-plan, barre de navigation, Hero, About, Projects, Skills, Certifications, Experience, Contact et Footer. Un écran de chargement est affiché une seule fois par session grâce à `sessionStorage`.

## 4. Organisation et flux des données

```text
data/*.ts
   |
   v
sections/*.tsx ou app/*/page.tsx
   |
   v
components/*.tsx
   |
   v
Interface affichée dans le navigateur
```

- `data/projects.ts` alimente la section des projets, la page `/projects` et `ProjectCard`.
- `data/certifications.ts` alimente la section des certifications, la page `/certifications`, `CertificationCard` et `CertificatePreviewModal`.
- `data/skills.ts` alimente directement la section `Skills`.
- `data/journey.ts` alimente la section `Experience`.
- Les images référencées dans ces données sont servies depuis `public/`.
- Le formulaire `Contact` appelle directement EmailJS depuis le navigateur avec les variables `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` et `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.

La majorité des pages et composants sont des Client Components (`"use client"`) parce qu'ils utilisent des animations, des événements, le stockage de session ou un état React. `app/layout.tsx` reste un Server Component et fournit les métadonnées globales.

## 5. Limites actuelles importantes

- Aucun stockage persistant : les conversations ne peuvent pas encore être sauvegardées.
- Les variables EmailJS commencent par `NEXT_PUBLIC_` et sont donc volontairement visibles côté navigateur. Une future clé d'API d'IA ne doit jamais utiliser ce préfixe.
- La limite de requêtes est stockée en mémoire du processus et devra être remplacée par un stockage partagé pour un déploiement distribué à grande échelle.

## 6. Architecture du chatbot

L'intégration ajoute les éléments suivants :

```text
app/
`-- api/
    `-- chat/
        `-- route.ts             # Endpoint serveur : validation et appel au modèle
components/
`-- chatbot/
    |-- ChatWidget.tsx           # Bouton flottant et fenêtre du chat
    |-- ChatMessages.tsx         # Historique visuel des messages
    `-- ChatInput.tsx            # Saisie et envoi
lib/
`-- chatbot/
    |-- portfolio-context.ts     # Contexte fiable extrait du portfolio
    |-- prompts.ts               # Instructions système du chatbot
    `-- types.ts                 # Types Message, Request et Response
```

Flux recommandé :

```text
Visiteur -> ChatWidget -> POST /api/chat -> fournisseur IA
                              |
                              `-> contexte contrôlé du portfolio
```

Principes à respecter lors de l'implémentation :

1. Garder la clé Groq dans la variable serveur `GROQ_API_KEY`, sans `NEXT_PUBLIC_`.
2. Effectuer l'appel au modèle uniquement dans `app/api/chat/route.ts`.
3. Donner au modèle un contexte construit depuis les données réelles du portfolio pour limiter les réponses inventées.
4. Valider la taille et la forme des messages reçus par l'API.
5. Ajouter une limite de requêtes avant la mise en production pour contrôler les abus et les coûts.
6. Monter `ChatWidget` dans `app/layout.tsx` si le chatbot doit être disponible sur toutes les pages, ou dans `app/page.tsx` s'il doit rester limité à l'accueil.

## 7. Scripts disponibles

| Commande | Utilité |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Produit et vérifie la version de production |
| `npm run start` | Lance la version déjà compilée |
| `npm run lint` | Analyse le code avec ESLint |

## 8. Résumé pour la prochaine étape

Le projet possède une séparation simple et saine : `app/` définit les routes, `sections/` compose l'accueil, `components/` contient les briques réutilisables, `data/` contient le contenu et `public/` les ressources. Le chatbot devra ajouter une petite couche serveur sécurisée et un composant d'interface, sans modifier cette organisation principale.

## 9. Fournisseur IA actuel

Le chatbot appelle Groq exclusivement depuis `app/api/chat/route.ts` avec le modèle open-source `llama-3.1-8b-instant`. La clé privée est fournie par `GROQ_API_KEY` et ne doit jamais être préfixée par `NEXT_PUBLIC_`.

Le modèle utilise JSON Object Mode. La route valide strictement `answer`, `language` et `resourceIds`, retente une seule fois une sortie invalide, puis transforme uniquement les identifiants connus en ressources locales vérifiées. Le rate limiting, la limitation de l'historique et les protections contre les hallucinations et prompt injections restent actifs.

## 10. Fast path V2

Avant le rate limiter et l'appel Groq, `lib/chatbot/intent-resolver.ts` normalise le message et reconnaît les salutations, CV, certifications, projets, compétences, GitHub, LinkedIn, contact et changements explicites de langue. `local-responses.ts` construit alors une réponse structurée directement depuis `data/` et le catalogue de ressources. Ces réponses sont instantanées et ne consomment aucun quota Groq.

Les requêtes réellement conversationnelles passent encore par Groq. `portfolio-context.ts` sélectionne les sections utiles selon la question afin de ne pas envoyer systématiquement tous les projets, certifications et compétences. Le frontend conserve une préférence linguistique explicite pendant la conversation et affiche un badge animé lorsqu'une réponse arrive pendant que le widget est fermé, avec respect de `prefers-reduced-motion`.

## 11. Knowledge Base V3

La V3 structure les faits vérifiés du CV public dans `data/profile.ts`, ajoute des métadonnées de domaine et de valeur recruteur dans `data/projects.ts`, et des métadonnées de domaine et pertinence dans `data/certifications.ts`. Le contexte dynamique distingue Backend, Data Science, éducation, projet précis, certification et comparaison.

Les demandes complexes ne passent plus par le fast path de simple liste. Groq reçoit des exigences explicites de conclusion, comparaison, sélection et justification. `lib/chatbot/grounded-reasoning.ts` fournit une synthèse contrôlée pour les scénarios recruteur importants si le modèle 8B omet les preuves ou renvoie un JSON invalide.

## 12. Routeur V4

`query-analysis.ts` extrait les contraintes de sortie et les indices de suivi conversationnel. `entity-resolver.ts` valide les projets et certifications nommés avec des alias prudents. `v4-responses.ts` traite avant les listes génériques les scénarios sûrs : entité précise, fausse prémisse, fait non documenté, preuves croisées, contraintes exactes et langues arabe/Darija. Les synthèses recruteur déjà contrôlées sont maintenant retournées avant Groq afin d'éviter un appel inutile. Groq reste utilisé pour les questions portfolio valides non couvertes, avec un timeout de 15 secondes et aucun retry implicite du SDK ; un seul retry applicatif demeure réservé au JSON invalide.

## 13. Semantic Router V4.2

```text
User
  ↓
Trusted protections + Local Safe Fast Path
  ↓ unknown
Semantic Router Groq (message + 2 derniers messages, sans portfolio)
  ├── LOCAL ───────────→ réponse déterministe depuis data/
  ├── CLARIFICATION ───→ question courte à l'utilisateur
  └── REASONING
         ↓
    Portfolio Context filtré
         ↓
      Groq #2
         ↓
    JSON Validator + grounded override/fallback
         ↓
    Ressources whitelistées
```

`lib/chatbot/semantic-router.ts` ne répond jamais à la question et ne reçoit aucune donnée métier complète. Il retourne un JSON strict comprenant langue, intention, confiance, domaine, entité, route et motif éventuel de clarification. Une classification simple déclenche `local-responses.ts` sans second appel. Une ambiguïté indispensable déclenche une clarification. Seule une vraie synthèse utilise le contexte filtré puis la génération grounded.

## 14. Planification multi-intent V4.3

Les requêtes simples conservent le flux `trusted/local -> réponse`. Les formulations sémantiques simples conservent `semantic-router -> local/grounded -> validation -> réponse`. Une requête composée suit désormais :

`message -> request-plan.ts -> RequestPlan -> résolution indépendante -> response-composer.ts -> validation -> réponse`.

Le `RequestPlan` contient une langue, jusqu'à six `SubRequest`, les contraintes globales (`exactCount`, `maxCount`, concision, mode de réponse, séparation et ordre de conclusion), une confiance et un éventuel besoin de clarification. Chaque sous-demande porte une intention, un domaine, une entité, une cardinalité et les besoins d'explication, preuve ou sélection.

Le planificateur Groq utilise un prompt compact, JSON Object Mode, température 0, un historique limité à deux messages tronqués et aucun contexte portfolio. Il comprend la structure mais n'établit aucun fait. Les résolveurs serveur utilisent exclusivement les catalogues officiels pour les projets, certifications, technologies, études et expérience. Les assertions utilisateur restent des faits à vérifier.

Le compositeur exige que chaque sous-demande soit résolue. Le validateur vérifie les cardinalités, la sélection finale et la cohérence du nombre de cartes projet. Les identifiants passent encore par la whitelist de `resources.ts`. Si le plan sémantique est indisponible ou invalide, un plan déterministe fondé sur l'analyse des contraintes et les entités officielles permet de conserver une réponse sûre sans transformer l'utilisateur ou l'historique en source de vérité.

Politique mixte hors périmètre : seule la partie externe est signalée comme hors périmètre ; toute sous-demande légitime sur le portfolio est néanmoins résolue et incluse dans la même réponse.

Le rate limit compte un message utilisateur une seule fois, même lorsqu'il entraîne deux appels fournisseur. Les latences `routerLatencyMs`, `generationLatencyMs` et `totalLatencyMs` sont consignées uniquement dans les logs serveur. En cas de panne du routeur, les protections trusted, les fast paths exacts et les réponses grounded déjà disponibles restent fonctionnels.
