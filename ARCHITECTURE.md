# Architecture du portfolio V2

Ce document décrit l’architecture présente dans le dépôt. Il ne constitue pas un rapport de validation : le lint, le build, les régressions du chatbot et les contrôles visuels doivent être exécutés séparément avant une livraison.

## 1. Vue d’ensemble

Le portfolio utilise :

- Next.js 16.1.6 avec App Router ;
- React 19.2.3 et TypeScript en mode strict ;
- Tailwind CSS 4 pour la mise en forme ;
- Framer Motion pour les îlots d’animation interactifs ;
- EmailJS pour le formulaire de contact côté navigateur ;
- Groq, exclusivement via une Route Handler serveur, pour les requêtes conversationnelles du chatbot ;
- Lucide React pour les icônes d’interface.

Il n’existe ni backend séparé, ni base de données, ni authentification. Le site public est disponible en anglais, français et arabe ; le chatbot sait en plus répondre en darija.

## 2. Routage public

Les locales publiques sont déclarées dans `i18n/config.ts` : `en`, `fr` et `ar`. L’anglais est la locale par défaut.

| URL | Implémentation | Rôle |
|---|---|---|
| `/` | `app/(redirect)/page.tsx` | Redirection permanente vers `/en` |
| `/projects` | `app/(redirect)/projects/page.tsx` | Redirection permanente vers `/en/projects` |
| `/projects/[slug]` | `app/(redirect)/projects/[slug]/page.tsx` | Redirection permanente vers le détail anglais correspondant |
| `/certifications` | `app/(redirect)/certifications/page.tsx` | Redirection permanente vers `/en/certifications` |
| `/[locale]` | `app/[locale]/page.tsx` | Accueil localisé |
| `/[locale]/projects` | `app/[locale]/projects/page.tsx` | Liste localisée des projets |
| `/[locale]/projects/[slug]` | `app/[locale]/projects/[slug]/page.tsx` | Étude de cas localisée d’un projet |
| `/[locale]/certifications` | `app/[locale]/certifications/page.tsx` | Liste localisée et prévisualisation des certifications |
| `/[locale]/social-card` | `app/[locale]/social-card/route.tsx` | Image Open Graph générée pour la locale |
| `/api/chat` | `app/api/chat/route.ts` | Endpoint `POST` du chatbot |
| `/sitemap.xml` | `app/sitemap.ts` | Sitemap des 39 URL localisées |
| `/robots.txt` | `app/robots.ts` | Règles d’indexation et lien vers le sitemap |

Le groupe `(redirect)` possède un layout racine minimal. Le segment `[locale]` possède le layout applicatif complet et valide la locale avant de produire `<html lang="…" dir="…">`. Une locale ou un slug inconnu déclenche `notFound()`. Les dix slugs projet sont combinés aux trois locales par `generateStaticParams()` sur les pages de détail.

## 3. Arborescence fonctionnelle

```text
portfolio/
|-- app/
|   |-- (redirect)/             # Compatibilité des anciennes URL sans locale
|   |-- [locale]/
|   |   |-- layout.tsx          # Document localisé, shell global et métadonnées de base
|   |   |-- page.tsx            # Accueil
|   |   |-- projects/           # Liste et dix études de cas
|   |   |-- certifications/     # Galerie complète
|   |   |-- social-card/        # Image sociale dynamique
|   |   `-- not-found.tsx       # 404 localisée
|   |-- api/chat/route.ts       # Orchestration serveur du chatbot
|   |-- globals.css             # Tailwind, fond, animations CSS et reduced motion
|   |-- sitemap.ts
|   `-- robots.ts
|-- assets/fonts/               # Geist, Noto Sans Arabic et licences locales
|-- components/                 # Briques partagées et îlots interactifs
|   |-- chatbot/                # Widget, saisie, messages et cartes de ressources
|   |-- Breadcrumbs.tsx
|   |-- LanguageSwitcher.tsx
|   |-- ProjectCard.tsx
|   |-- ProjectCaseStudy.tsx
|   |-- CertificationGallery.tsx
|   |-- CertificatePreviewModal.tsx
|   `-- ...
|-- sections/                   # Sections de l’accueil
|   |-- Hero.tsx
|   |-- About.tsx
|   |-- Projects.tsx
|   |-- Skills.tsx
|   |-- Certifications.tsx
|   |-- Experience.tsx
|   `-- Contact.tsx
|-- i18n/
|   |-- config.ts               # Locales, autonymes, formats et directions
|   |-- types.ts                # Contrat exhaustif des dictionnaires
|   |-- get-dictionary.ts       # Chargement serveur par locale
|   |-- helpers.ts              # Dates, nombres, chemins et études de cas
|   `-- dictionaries/           # en.ts, fr.ts et ar.ts
|-- data/                       # Sources structurées invariantes
|   |-- profile.ts
|   |-- projects.ts             # 10 projets
|   |-- certifications.ts       # 10 certifications
|   |-- skills.ts               # Compétences dev, data et IA/ML
|   `-- journey.ts              # Parcours
|-- lib/
|   |-- localized-portfolio.ts  # Fusion données invariantes + dictionnaire
|   |-- project-content.ts      # Normalisation sûre du contenu éditorial
|   |-- site.ts                 # Origine, URL, canonical et metadata
|   `-- chatbot/                # Pipeline IA et réponses déterministes existants
|-- public/                     # Profil, CV, captures et certificats
|-- scripts/                    # Régressions HTTP du chatbot
|-- .env.example
|-- next.config.ts
`-- package.json
```

`.next/`, `node_modules/` et les fichiers `*.tsbuildinfo` sont générés ; ils ne doivent pas être édités manuellement.

## 4. Modèle de contenu et i18n

La V2 sépare les faits invariants de leur présentation localisée :

```text
data/*.ts ─────────────┐
                      ├─> lib/localized-portfolio.ts ─> pages/sections/components
i18n/dictionaries/*.ts┘
```

- `data/projects.ts`, `data/certifications.ts`, `data/skills.ts`, `data/journey.ts` et `data/profile.ts` restent les sources de vérité partagées avec le chatbot.
- Les titres, descriptions, libellés, textes SEO et études de cas localisés vivent dans les trois dictionnaires.
- `i18n/types.ts` rend la structure des dictionnaires exhaustive : un slug ou identifiant déclaré doit avoir son contenu dans chaque langue.
- `getDictionary()` charge le dictionnaire demandé côté serveur.
- `lib/localized-portfolio.ts` associe les traductions aux données de base sans dupliquer ni remplacer la donnée métier.
- `toRenderableCaseStudy()` et `ProjectCaseStudy` transforment le contenu structuré en titres, paragraphes et listes, sans injection de HTML provenant des données.

Le sélecteur de langue utilise de vrais liens et conserve le chemin localisé ; après hydratation, il conserve aussi la query string et le hash. La direction arabe est posée sur le document entier. Les valeurs techniques LTR peuvent être isolées avec `bdi` ou `dir="ltr"` dans un contexte arabe.

La darija est une langue de réponse du chatbot, pas une quatrième route publique.

## 5. Frontières Server/Client

Les pages de route, le layout localisé, le footer, le fond décoratif, `About`, `Projects`, `Skills` et `Certifications` sont des Server Components par défaut. Ils chargent les dictionnaires et préparent des props limitées avant de rendre l’interface.

Les Client Components sont réservés aux comportements qui ont besoin du navigateur ou d’un état React :

- navbar responsive et sélecteur de langue ;
- Hero et texte rotatif ;
- animations de révélation et cartes animées ;
- formulaire EmailJS ;
- timeline animée ;
- galerie et dialogue de certificat ;
- interface complète du chatbot ;
- 404 localisée qui lit le paramètre courant.

Cette frontière empêche notamment d’envoyer le moteur Groq ou les données serveur sensibles dans le bundle client. `GROQ_API_KEY` n’est lu que dans `/api/chat`.

## 6. Shell, UX, responsive et accessibilité

`app/[locale]/layout.tsx` monte sur toutes les pages localisées :

- le lien d’évitement ;
- l’arrière-plan décoratif ;
- la navigation et le sélecteur de langue ;
- le contenu de la route ;
- le footer ;
- le chatbot localisé.

La navigation repose sur des liens avec hashes réels. Les principaux points de rupture retardent les compositions multi-colonnes à `lg` lorsque la place est insuffisante sur tablette. La timeline réserve une colonne à son axe. Les propriétés logiques CSS (`start`, `end`, `ms`, `me`) assurent le miroir RTL.

Les comportements interactifs incluent des noms accessibles, des focus visibles et des cibles tactiles dimensionnées. Le dialogue de certificat et le chatbot modal mobile gèrent Escape, le focus, sa restitution et l’inertage de l’arrière-plan. Le formulaire possède des labels, une validation associée aux champs et des régions de statut. Ces choix améliorent l’accessibilité, sans constituer à eux seuls une déclaration de conformité WCAG.

Les animations CSS et Framer Motion respectent `prefers-reduced-motion`. Le rail de compétences reste contrôlable au défilement sur mobile et se met en pause lors d’une interaction sur grand écran.

## 7. Images et performance

- Geist et Noto Sans Arabic sont servis localement ; les cartes sociales arabes utilisent deux fontes TTF statiques compatibles avec le moteur OG.
- Les images de profil, projets et certificats utilisent `next/image` avec des attributs `sizes` adaptés.
- L’image du Hero porte la priorité de chargement ; les cartes hors écran restent différées.
- Le fond ambiant et le champ d’étoiles de Skills sont produits en CSS, sans calcul aléatoire côté client.
- Skills rend une seule occurrence des 91 compétences au lieu de cloner plusieurs fois chaque liste.
- `next.config.ts` autorise AVIF/WebP, configure les qualités employées et un cache minimal de 30 jours pour l’optimiseur d’images.
- La politique globale `prefers-reduced-motion` neutralise les mouvements continus lorsque l’utilisateur le demande.

Ces décisions décrivent l’implémentation ; les métriques Core Web Vitals doivent être mesurées sur un build de production et sur le déploiement réel.

## 8. SEO

`lib/site.ts` centralise l’origine publique et construit les métadonnées localisées :

- title et description par type de page, et par projet ;
- canonical auto-référent ;
- alternates `hreflang` pour `en`, `fr`, `ar` et `x-default` ;
- Open Graph et Twitter Card ;
- image sociale localisée au format 1200 × 630.

Les pages ajoutent des données structurées JSON-LD : `ProfilePage`/`Person` pour l’accueil, `ItemList` pour les listes et `SoftwareSourceCode` pour les études de cas. `sitemap.ts` émet les 13 chemins publics dans les trois langues avec leurs alternates. `robots.ts` autorise le contenu public et exclut `/api/`.

L’origine suit cet ordre :

1. `NEXT_PUBLIC_SITE_URL` ;
2. `VERCEL_PROJECT_PRODUCTION_URL` lorsque Vercel la fournit ;
3. `http://localhost:3000` en développement.

`NEXT_PUBLIC_SITE_URL` doit donc contenir le domaine officiel avant le build de production, faute de quoi canonical, sitemap et données structurées peuvent pointer vers une origine incorrecte.

## 9. Architecture du chatbot

La refonte V2 conserve le moteur existant dans `app/api/chat/route.ts` et `lib/chatbot/*`. Elle localise son interface, améliore son comportement responsive et accessible, et adapte les liens de ressources projet aux routes localisées. Elle ne remplace ni le fournisseur, ni le modèle, ni les règles de grounding.

Flux simplifié :

```text
ChatWidget
   -> POST /api/chat
      -> validation + détection de langue
      -> routeur sémantique / réponses déterministes / plan multi-intent
      -> contexte portfolio filtré si une génération est nécessaire
      -> Groq openai/gpt-oss-20b
      -> validation JSON + ressources locales whitelistées
   -> réponse et cartes de ressources localisées
```

Le pipeline actuel contient notamment :

- normalisation conversationnelle et résolution prudente des entités ;
- réponses fiables construites depuis `data/*` ;
- routeur sémantique sans catalogue portfolio complet ;
- planification et composition de demandes multiples ;
- fallback grounded pour plusieurs scénarios recruteur ;
- validation du format de réponse et des identifiants de ressources ;
- limitation de débit en mémoire du processus.

La limite en mémoire convient à une instance simple, mais doit être remplacée par un stockage partagé pour un déploiement distribué. Les conversations ne sont pas persistées. Toute évolution du pipeline doit être couverte par les scripts de régression existants.

## 10. Variables d’environnement

| Variable | Exposition | Usage |
|---|---|---|
| `GROQ_API_KEY` | Serveur uniquement | Route `/api/chat` |
| `NEXT_PUBLIC_SITE_URL` | Publique | Origine des canonical, sitemap, JSON-LD et cartes sociales |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Publique | Formulaire de contact |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Publique | Formulaire de contact |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Publique | Formulaire de contact |

Les identifiants EmailJS sont nécessairement accessibles au navigateur. La clé Groq ne doit jamais recevoir le préfixe `NEXT_PUBLIC_`.

## 11. Commandes disponibles

| Commande | Effet déclaré dans `package.json` |
|---|---|
| `npm run dev` | Lance Next.js en développement |
| `npm run build` | Produit le build de production |
| `npm run start` | Sert un build existant |
| `npm run lint` | Lance ESLint |
| `npm run test:chatbot-v4` | Build puis régression V4 |
| `npm run test:chatbot-v4-1` | Build puis régression V4.1 |
| `npm run test:chatbot-v4-2` | Build puis régression V4.2 |
| `npm run test:chatbot-v4-3` | Build puis régression V4.3 |
| `npm run test:chatbot-new-projects` | Build puis scénarios des nouveaux projets |
| `npm run test:chatbot-source-scope` | Build puis contrôle du périmètre des sources |
| `npm run test:chatbot-compound` | Build puis scénarios composés |

Il n’existe pas de script agrégateur `test` dans `package.json`. Chaque script `test:chatbot-*` relance actuellement `npm run build` avant sa suite.
