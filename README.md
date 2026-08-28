# Portfolio V2 — Issam Elghbali

Portfolio multilingue construit avec Next.js, React et TypeScript. Le contenu public est disponible en anglais, français et arabe avec une vraie mise en page RTL. Le projet comprend dix études de cas, dix certifications, un formulaire EmailJS et un assistant portfolio relié à Groq côté serveur.

La description détaillée des choix techniques se trouve dans [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Démarrage local

Installez les dépendances verrouillées :

```bash
npm ci
```

Copiez `.env.example` vers `.env.local`, puis renseignez les valeurs nécessaires :

```env
GROQ_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

Lancez ensuite le serveur de développement :

```bash
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000). La racine redirige vers [http://localhost:3000/en](http://localhost:3000/en).

`GROQ_API_KEY` est privée et ne doit jamais être préfixée par `NEXT_PUBLIC_`. Les variables EmailJS sont publiques par conception, car le formulaire s’exécute dans le navigateur.

## Routes

Pour chacune des locales `en`, `fr` et `ar` :

- `/[locale]` — accueil ;
- `/[locale]/projects` — tous les projets ;
- `/[locale]/projects/[slug]` — étude de cas ;
- `/[locale]/certifications` — certifications ;
- `/[locale]/social-card` — image Open Graph générée.

Les anciennes URL `/`, `/projects`, `/projects/[slug]` et `/certifications` redirigent de façon permanente vers leur équivalent anglais. L’API du chatbot reste disponible sur `POST /api/chat`. Le sitemap et les règles robots sont servis sur `/sitemap.xml` et `/robots.txt`.

## Organisation du code

- `app/[locale]/` contient les pages localisées, leur layout, les métadonnées et la 404.
- `app/(redirect)/` conserve la compatibilité des URL historiques sans locale.
- `assets/fonts/` contient les fontes locales et leurs licences, y compris les variantes statiques utilisées par les cartes sociales arabes.
- `sections/` compose les grandes sections de l’accueil.
- `components/` contient les composants partagés et les îlots interactifs.
- `i18n/` définit les locales, les types, les helpers et les dictionnaires `en`, `fr`, `ar`.
- `data/` contient les faits invariants partagés par le site et le chatbot.
- `lib/localized-portfolio.ts` associe ces faits au contenu traduit.
- `lib/site.ts` centralise l’origine publique, les canonical et les alternates.
- `lib/chatbot/` contient le moteur existant du chatbot.
- `public/` contient le CV, le profil, les captures de projets et les certificats.
- `scripts/` contient les suites de régression HTTP du chatbot.

Les pages et le contenu statique restent des Server Components. Les fonctionnalités qui exigent le navigateur sont isolées dans des Client Components : navigation mobile, changement de langue, animations, formulaire, dialogue de certificat et interface du chatbot.

## Modifier le contenu

Les données invariantes restent dans :

- `data/profile.ts` ;
- `data/projects.ts` ;
- `data/certifications.ts` ;
- `data/skills.ts` ;
- `data/journey.ts`.

Le contenu visible et SEO localisé se trouve dans :

- `i18n/dictionaries/en.ts` ;
- `i18n/dictionaries/fr.ts` ;
- `i18n/dictionaries/ar.ts`.

Pour ajouter un projet ou une certification, mettez à jour la source `data/*`, les identifiants typés dans `i18n/types.ts` et les trois dictionnaires. Le compilateur TypeScript aide à détecter une traduction manquante. Les ressources du chatbot sont construites depuis les données officielles et leur catalogue contrôlé dans `lib/chatbot/resources.ts`.

Les textes techniques tels que les noms de bibliothèques ne doivent pas être traduits artificiellement. Dans une phrase arabe, conservez leur direction LTR avec les primitives bidi déjà utilisées par l’interface.

## SEO et domaine de production

Avant un build destiné à la production, définissez impérativement l’origine officielle :

```env
NEXT_PUBLIC_SITE_URL=https://votre-domaine.example
```

Cette valeur alimente les canonical, le sitemap, les données structurées et les URL sociales. En son absence, le code utilise `VERCEL_PROJECT_PRODUCTION_URL` si disponible, puis `http://localhost:3000`.

Chaque locale possède des title/description, canonical, `hreflang`, Open Graph et Twitter Cards. Les pages émettent aussi du JSON-LD adapté : profil, listes et projets logiciels.

## Assistant portfolio

L’interface du chatbot est localisée pour la route courante. Le moteur accepte des réponses en anglais, français, arabe standard et darija, tout en se limitant aux informations documentées dans le portfolio et le CV.

Architecture principale :

- `components/chatbot/` — lanceur, dialogue, historique, saisie et ressources ;
- `app/api/chat/route.ts` — validation, orchestration et appels Groq serveur ;
- `lib/chatbot/` — langues, entités, contexte filtré, routeur sémantique, planification, composition, grounding et validation ;
- `data/*` — faits vérifiés utilisés comme source de vérité.

Le modèle configuré est `openai/gpt-oss-20b`. Les identifiants de ressources renvoyés par le modèle sont résolus via une whitelist locale. Des réponses déterministes et des fallbacks grounded couvrent plusieurs intentions et scénarios recruteur. Le rate limiter actuel est conservé en mémoire du processus ; remplacez-le par un stockage partagé avant un déploiement horizontal à grande échelle.

## Commandes de validation

Les commandes réellement déclarées dans `package.json` sont :

```bash
npm run lint
npm run build
npm run start
npm run test:chatbot-v4
npm run test:chatbot-v4-1
npm run test:chatbot-v4-2
npm run test:chatbot-v4-3
npm run test:chatbot-new-projects
npm run test:chatbot-source-scope
npm run test:chatbot-compound
```

Chaque commande `test:chatbot-*` lance d’abord son propre build de production. Il n’existe pas actuellement de script `npm test` agrégateur. Cette section décrit les commandes disponibles ; elle ne signifie pas que leur dernière exécution a réussi.

Pour une validation de livraison complète, ajoutez aux commandes automatisées une inspection navigateur des trois langues, du RTL, du clavier, des dialogues et des largeurs mobiles/tablettes/desktop.

## Build et exécution de production

```bash
npm run build
npm run start
```

Le domaine final, les identifiants EmailJS et la clé Groq doivent être configurés dans l’environnement de déploiement avant la validation finale.
