import type { PortfolioDictionary } from "../types";

const fr = {
  locale: "fr",
  direction: "ltr",
  localeName: "Français",
  common: {
    siteName: "Portfolio d’Issam Elghbali",
    portfolioOwner: "Issam Elghbali",
    skipToContent: "Aller au contenu principal",
    loading: "Chargement",
    close: "Fermer",
    back: "Retour",
    previous: "Précédent",
    next: "Suivant",
    opensInNewTab: "s’ouvre dans un nouvel onglet",
    externalLink: "Lien externe",
    download: "Télécharger",
    notAvailable: "Indisponible",
  },
  navigation: {
    ariaLabel: "Navigation principale",
    brandLabel: "Issam Elghbali — aller à l’accueil",
    sections: {
      home: "Accueil",
      about: "À propos",
      projects: "Projets",
      skills: "Compétences",
      certifications: "Certifications",
      experience: "Parcours",
      contact: "Contact",
    },
    openMenu: "Ouvrir le menu de navigation",
    closeMenu: "Fermer le menu de navigation",
    menuLabel: "Menu de navigation",
  },
  languageSwitcher: {
    label: "Langue",
    currentLanguage: "Langue actuelle",
    changeLanguage: "Changer de langue",
  },
  hero: {
    greeting: "Bonjour, je suis",
    name: "Issam Elghbali",
    stableHeadline: "Développeur Full-Stack & Data Scientist",
    rotatingRoles: [
      "Développeur Full-Stack",
      "Data Scientist",
      "Praticien du Machine Learning",
      "Concepteur de systèmes intelligents",
      "Résolution de problèmes par la donnée",
    ],
    profileImageAlt: "Portrait d’Issam Elghbali",
    viewProjects: "Voir les projets",
    contactMe: "Me contacter",
    downloadCv: "Télécharger le CV",
    linkedinLabel: "Voir le profil LinkedIn d’Issam Elghbali",
    githubLabel: "Voir le profil GitHub d’Issam Elghbali",
  },
  about: {
    titleLead: "Qui",
    titleAccent: "je suis",
    summary:
      "Étudiant en Master Data Science, avec de solides bases en informatique et un intérêt marqué pour le Machine Learning, l’Intelligence Artificielle et les systèmes logiciels évolutifs.",
    paragraphs: [
      "Je travaille à l’intersection du Machine Learning, de l’Intelligence Artificielle et du génie logiciel moderne.",
      "Je conçois des systèmes intelligents qui répondent à des problématiques concrètes grâce à des pratiques data rigoureuses et à des architectures capables d’évoluer.",
      "Porté par la curiosité et l’apprentissage continu, je développe des solutions numériques qui concilient performance, maintenabilité et valeur d’usage.",
    ],
    focusAreas: [
      {
        id: "artificial-intelligence",
        title: "Intelligence Artificielle",
        description:
          "Concevoir des systèmes intelligents fondés sur le Machine Learning et des algorithmes adaptés au besoin.",
      },
      {
        id: "data-science",
        title: "Data Science",
        description:
          "Transformer des données brutes en analyses claires et en solutions décisionnelles fondées sur les faits.",
      },
      {
        id: "software-engineering",
        title: "Génie logiciel",
        description:
          "Construire des applications évolutives et maintenables, sur des fondations backend et frontend fiables.",
      },
    ],
  },
  skills: {
    titleLead: "Expertise",
    titleAccent: "technique",
    description:
      "Les technologies que j’utilise pour transformer une idée en solution numérique intelligente, robuste et utile.",
    developerTitle: "Développeur",
    developerDescription:
      "Je construis des applications full-stack avec des frameworks modernes et des architectures évolutives, de l’interface claire aux API robustes et aux backends performants.",
    dataScientistTitle: "Data Scientist",
    dataScientistDescription:
      "Je transforme les données brutes en informations exploitables grâce à l’analyse statistique, au Machine Learning et à la visualisation, afin d’éclairer la décision.",
    technologiesLabel: "Technologies",
    categories: {
      development: "Développement",
      dataScience: "Data Science",
      aiMachineLearning: "IA / Machine Learning",
    },
    tickerInstructions:
      "Survolez la liste des technologies ou placez-y le focus pour interrompre son défilement.",
  },
  experience: {
    titleLead: "Mon",
    titleAccent: "parcours",
    description:
      "Un parcours académique et professionnel qui développe mes compétences en génie logiciel, Data Science et systèmes intelligents.",
    timelineLabel: "Parcours académique et professionnel",
    items: {
      "master-data-science": {
        title: "Master en Data Science & Systèmes Intelligents",
        period: "2025 – aujourd’hui",
        institution: "Faculté des Sciences et Techniques de Fès (FST Fès)",
        location: "Fès, Maroc",
        description:
          "Formation avancée centrée sur le Machine Learning, l’Intelligence Artificielle et les systèmes intelligents évolutifs.",
        typeLabel: "Formation",
      },
      "software-engineering-internship": {
        title: "Stagiaire en génie logiciel",
        period: "2025",
        institution: "École Polytechnique des Génies",
        location: "Fès, Maroc",
        duration: "2 mois",
        description:
          "Conception et développement d’une plateforme interne de gestion des ressources avec Spring Boot et React.js, avec un travail centré sur l’architecture backend, les API REST et une intégration fiable des composants du système.",
        typeLabel: "Expérience professionnelle",
      },
      "computer-engineering-licence": {
        title: "Licence Sciences et Techniques — Génie informatique",
        period: "2024 – 2025",
        institution: "Faculté des Sciences et Techniques de Fès (FST Fès)",
        location: "Fès, Maroc",
        description:
          "Spécialisation en développement logiciel, algorithmique et architecture des systèmes.",
        typeLabel: "Formation",
      },
      deust: {
        title: "DEUST",
        period: "2022 – 2024",
        institution: "Faculté des Sciences et Techniques de Fès (FST Fès)",
        location: "Fès, Maroc",
        description:
          "Acquisition de bases solides en mathématiques et en informatique, avec le développement du raisonnement analytique, de la résolution de problèmes et des principes fondamentaux de l’ingénierie.",
        typeLabel: "Formation",
      },
    },
  },
  projects: {
    section: {
      titleLead: "Projets",
      titleAccent: "à la une",
      description:
        "Une sélection de réalisations en développement full-stack, Data Science et architectures logicielles évolutives.",
      viewAll: "Voir tous les projets",
    },
    listing: {
      titleLead: "Tous les",
      titleAccent: "projets",
      description:
        "L’ensemble de mes projets en développement full-stack, Data Science, Machine Learning et applications d’entreprise.",
      count: {
        zero: "Aucun projet",
        one: "{count} projet",
        two: "{count} projets",
        few: "{count} projets",
        many: "{count} projets",
        other: "{count} projets",
      },
      backToPortfolio: "Retour au portfolio",
      collectionLabel: "Collection de projets",
    },
    card: {
      githubProfile: "Profil GitHub",
      githubRepository: "Dépôt GitHub",
      viewDetails: "Découvrir le projet",
      viewDetailsFor: "Découvrir le projet {project}",
      technologiesLabel: "Technologies utilisées",
    },
    detail: {
      backToProjects: "Retour à tous les projets",
      githubProfile: "Voir le profil GitHub",
      githubRepository: "Voir le dépôt sur GitHub",
      projectImageLabel: "Aperçu du projet",
      technologiesHeading: "Technologies",
      caseStudyHeading: "Étude de cas",
    },
    items: {
      "indonesia-tourism": {
        title: "Indonesia Tourism Website",
        category: "Frontend / Développement web",
        shortDescription:
          "Un site touristique statique consacré à la culture, aux destinations et aux attractions de l’Indonésie.",
        imageAlt: "Aperçu du site touristique consacré à l’Indonésie",
        seo: {
          title: "Indonesia Tourism Website",
          description:
            "Un site touristique responsive qui présente la culture, les destinations, les attractions et l’univers visuel de l’Indonésie.",
        },
        introduction: [
          "Une landing page touristique consacrée à l’Indonésie, conçue pour présenter sa culture, ses sites emblématiques et ses expériences de voyage dans une interface informative et visuellement engageante.",
        ],
        caseStudy: [
          {
            id: "content",
            heading: "Contenu du site",
            items: [
              "Hero d’introduction",
              "Mise en avant des destinations",
              "Présentation culturelle",
              "Galerie d’images",
              "Section de contact",
            ],
          },
          {
            id: "focus",
            heading: "Objectifs techniques",
            paragraphs: [
              "Le projet est centré sur la structuration frontend, le responsive design et des interactions développées en JavaScript.",
            ],
          },
        ],
      },
      "resource-platform": {
        title: "Academic Resource Management Platform",
        category: "Application Full-Stack",
        shortDescription:
          "Une plateforme full-stack permettant aux enseignants de partager et gérer des ressources pédagogiques destinées aux étudiants.",
        imageAlt: "Aperçu de la plateforme de gestion des ressources pédagogiques",
        seo: {
          title: "Plateforme de ressources pédagogiques",
          description:
            "Une plateforme Spring Boot et React pour organiser, partager et consulter des supports de cours de manière sécurisée.",
        },
        introduction: [
          "Un système full-stack de gestion de ressources pédagogiques conçu pour les établissements d’enseignement.",
        ],
        caseStudy: [
          {
            id: "capabilities",
            heading: "Fonctionnalités principales",
            items: [
              "Dépôt et gestion des supports de cours par les enseignants",
              "Consultation et téléchargement des ressources par les étudiants",
              "Classement des supports par matière",
              "Protection de l’accès par un système d’authentification",
            ],
          },
          {
            id: "architecture",
            heading: "Architecture",
            paragraphs: [
              "Le backend Spring Boot expose les API REST. Le frontend React.js prend en charge l’expérience interactive et la gestion d’état de l’application.",
            ],
          },
          {
            id: "demonstrates",
            heading: "Compétences mises en œuvre",
            items: [
              "Développement d’API REST",
              "Gestion de l’authentification",
              "Intégration full-stack",
              "Gestion d’état avec React",
            ],
          },
        ],
      },
      "employee-management": {
        title: "Employee & Salary Management System",
        category: "Application web d’entreprise",
        shortDescription:
          "Une application MVC trois tiers pour gérer les employés, les superviseurs, les salaires et les accès par rôle.",
        imageAlt: "Aperçu du système de gestion des employés et des salaires",
        seo: {
          title: "Système de gestion des employés",
          description:
            "Une application MVC Spring Boot pour gérer employés, superviseurs, salaires et accès selon les rôles.",
        },
        introduction: [
          "Une application web d’entreprise en trois tiers, développée avec Spring Boot et Thymeleaf.",
        ],
        caseStudy: [
          {
            id: "features",
            heading: "Fonctionnalités principales",
            items: [
              "Opérations CRUD sur les employés",
              "Gestion des superviseurs",
              "Gestion des salaires",
              "Authentification par rôle pour les profils Directeur, Superviseur et Employé",
            ],
          },
          {
            id: "architecture",
            heading: "Architecture en couches",
            items: ["Couche Controller", "Couche Service", "Couche Repository"],
          },
        ],
      },
      "nosql-ml-redis": {
        title: "NoSQL & Machine Learning Football Prediction System",
        category: "Data Engineering / Machine Learning",
        shortDescription:
          "Une architecture applicative réunissant Redis, l’entraînement d’un modèle, une API de prédiction et un frontend React.",
        imageAlt: "Aperçu du système de prédiction football avec Redis et Machine Learning",
        seo: {
          title: "Prédiction football Redis et ML",
          description:
            "Une architecture de prédiction football combinant Redis, entraînement Machine Learning, inférence par API REST et React.",
        },
        introduction: [
          "Une architecture applicative complète qui relie stockage NoSQL, entraînement Machine Learning, service de prédiction et interface web.",
        ],
        caseStudy: [
          {
            id: "architecture",
            heading: "Architecture intégrée",
            items: [
              "Redis comme base de données NoSQL",
              "Entraînement d’un modèle de Machine Learning",
              "Prédictions exposées par une API REST",
              "Interface frontend développée avec React",
            ],
          },
        ],
      },
      "personal-portfolio": {
        title: "Personal Portfolio Website",
        category: "Frontend / Full-Stack",
        shortDescription:
          "Un portfolio moderne développé avec Next.js et Tailwind CSS pour présenter projets, compétences et parcours professionnel.",
        imageAlt: "Aperçu du portfolio personnel d’Issam Elghbali",
        seo: {
          title: "Portfolio personnel Next.js",
          description:
            "Un portfolio responsive développé avec Next.js, TypeScript, Tailwind CSS, Framer Motion et EmailJS.",
        },
        introduction: [
          "Mon portfolio de développeur, conçu pour présenter mes projets, mes compétences techniques et mon parcours dans une interface responsive et maintenable.",
        ],
        caseStudy: [
          {
            id: "features",
            heading: "Fonctionnalités principales",
            items: [
              "Page d’accueil animée",
              "Routes projet dynamiques avec Next.js",
              "Présentation interactive des compétences",
              "Timeline du parcours",
              "Formulaire de contact intégré à EmailJS",
              "Mise en page responsive",
            ],
          },
          {
            id: "architecture",
            heading: "Architecture",
            paragraphs: [
              "Le projet adopte une organisation par composants et centralise les données des projets pour faciliter la maintenance et les évolutions futures.",
            ],
          },
        ],
      },
      "ticket-management-system": {
        title: "Advanced Ticket Management System",
        category: "Backend / Application d’entreprise",
        shortDescription:
          "Une API REST Spring Boot en cours de développement pour gérer tickets de support, utilisateurs et workflows structurés.",
        imageAlt: "Aperçu du système avancé de gestion des tickets",
        seo: {
          title: "API REST de gestion des tickets",
          description:
            "Une API REST Spring Boot en développement pour les tickets, utilisateurs, validations, données persistantes et workflows métier.",
        },
        introduction: [
          "Une API REST Spring Boot en cours de développement qui modélise la gestion des incidents, demandes de support et tâches internes en entreprise.",
        ],
        caseStudy: [
          {
            id: "workflow",
            heading: "Utilisateurs et cycle de vie des tickets",
            items: [
              "Rôles User, Agent et Admin",
              "États OPEN, IN_PROGRESS, RESOLVED et CLOSED",
              "Gestion des utilisateurs et préparation de l’authentification",
            ],
          },
          {
            id: "architecture",
            heading: "Architecture backend",
            items: [
              "Couches Controller, Service et Repository",
              "DTO pour protéger les entités internes",
              "Couche Mapper pour transformer les objets",
              "Conception d’API RESTful",
              "Validation avec Jakarta Validation",
              "Persistance avec Spring Data JPA",
            ],
          },
          {
            id: "status",
            heading: "État du projet",
            paragraphs: ["Ce projet est actuellement en cours de développement."],
          },
        ],
      },
      "resource-management-system": {
        title: "University Material Resource Management System",
        category: "Full-Stack / Application d’entreprise",
        shortDescription:
          "Une plateforme pour gérer besoins matériels universitaires, appels d’offres, fournisseurs, affectations et maintenance.",
        imageAlt: "Aperçu du système universitaire de gestion des ressources matérielles",
        seo: {
          title: "Gestion des ressources universitaires",
          description:
            "Une plateforme Spring Boot sécurisée pour les achats de matériel, fournisseurs, stocks, affectations et opérations de maintenance.",
        },
        introduction: [
          "Un système complet destiné aux facultés universitaires pour gérer tout le cycle de vie des ordinateurs et imprimantes répartis entre les départements.",
          "La plateforme relie les chefs de département, le responsable des ressources, le service de maintenance et les fournisseurs externes au moyen de workflows centralisés et sécurisés.",
        ],
        caseStudy: [
          {
            id: "procurement",
            heading: "Appels d’offres et achats",
            items: [
              "Collecte des besoins matériels des enseignants par les chefs de département",
              "Examen et validation des besoins lors d’une réunion de département",
              "Regroupement des demandes dans un appel d’offres daté par le responsable des ressources",
              "Propositions fournisseurs comprenant livraison, garantie, marque, prix unitaires et total",
            ],
          },
          {
            id: "suppliers",
            heading: "Gestion des fournisseurs",
            items: [
              "Inscription des fournisseurs avec un compte entreprise sécurisé",
              "Mise sur liste noire des fournisseurs non conformes avec notification du motif",
              "Sélection de l’offre la moins chère et notifications d’acceptation ou de refus",
            ],
          },
          {
            id: "inventory",
            heading: "Inventaire et affectations",
            items: [
              "Attribution à chaque ressource livrée d’un numéro d’inventaire unique sous forme de code-barres",
              "Enregistrement des informations détaillées des fournisseurs",
              "Affectation d’une ressource à un enseignant ou à un département entier",
              "Consultation, modification et suppression des ressources et affectations",
            ],
          },
          {
            id: "maintenance",
            heading: "Maintenance et signalement des pannes",
            items: [
              "Signalement des pannes au service de maintenance par les enseignants",
              "Rapport des techniciens pour les pannes graves, avec date, fréquence et nature logicielle ou matérielle",
              "Décision de renvoyer sous garantie la ressource au fournisseur pour réparation ou remplacement",
            ],
          },
          {
            id: "architecture",
            heading: "Architecture et contrôle d’accès",
            paragraphs: [
              "Le backend suit les couches Controller, Service et Repository et sécurise les rôles Chef de département, Responsable des ressources, Technicien, Fournisseur et Enseignant.",
            ],
          },
        ],
      },
      "water-potability-ml": {
        title: "Water Potability Prediction System",
        category: "Machine Learning / Data Science",
        shortDescription:
          "Un pipeline ML de bout en bout et une application Streamlit pour prédire la potabilité de l’eau à partir de mesures physico-chimiques.",
        imageAlt: "Aperçu de l’application de prédiction de la potabilité de l’eau",
        seo: {
          title: "Prédiction ML de la potabilité de l’eau",
          description:
            "Une étude Machine Learning complète et une application Streamlit pour une prédiction de potabilité centrée sur le risque sanitaire.",
        },
        introduction: [
          "Une étude complète de Machine Learning qui prédit la potabilité de l’eau à partir de neuf mesures physico-chimiques.",
          "L’évaluation privilégie la réduction du risque de classer une eau non potable comme sûre.",
        ],
        caseStudy: [
          {
            id: "data",
            heading: "Jeu de données et variables",
            paragraphs: [
              "Le jeu water_potability.csv fournit les variables pH, Hardness, Solids, Chloramines, Sulfate, Conductivity, Organic Carbon, Trihalomethanes et Turbidity.",
            ],
            metrics: [{ label: "Variables d’entrée", value: "9" }],
          },
          {
            id: "feature-importance",
            heading: "Importance des variables",
            items: [
              "Un Decision Tree limité à une profondeur de 5 classe la contribution des variables",
              "Les importances sont représentées dans un graphique en barres",
            ],
          },
          {
            id: "missing-values",
            heading: "Stratégies de valeurs manquantes",
            items: [
              "La stratégie 1 remplace les valeurs manquantes par la médiane de chaque colonne et conserve toutes les lignes",
              "La stratégie 2 supprime les lignes comportant des valeurs manquantes",
              "Random Forest, KNN et SVM sont entraînés et évalués pour les deux stratégies",
            ],
          },
          {
            id: "evaluation",
            heading: "Évaluation et sélection du modèle",
            items: [
              "Métrique principale : rappel de la classe 0, correspondant à l’eau non potable",
              "Métriques secondaires : accuracy, F1-score et ROC-AUC",
              "Matrices de confusion et courbes ROC pour chaque modèle et stratégie",
              "Sauvegarde du meilleur modèle et du scaler au format .pkl",
              "Évaluation finale par validation croisée en 3 plis",
            ],
          },
          {
            id: "application",
            heading: "Application Streamlit",
            items: [
              "Saisie manuelle des neuf paramètres",
              "Prédiction en temps réel : potable ou non potable",
              "Score de décision SVM indiquant la distance à la frontière de décision",
              "Test rapide à partir d’une ligne du jeu de données",
              "Historique des prédictions exportable en CSV",
            ],
          },
        ],
      },
      "customer-churn-prediction": {
        title: "Customer Churn Prediction",
        category: "Machine Learning / Data Science",
        shortDescription:
          "Un système de prédiction du churn de bout en bout, avec explicabilité, API FastAPI et application web responsive.",
        imageAlt: "Aperçu de l’application de prédiction du churn client",
        seo: {
          title: "Prédiction du churn client",
          description:
            "Un pipeline explicable de prédiction du churn avec ajustement du seuil, FastAPI, tests automatisés et déploiement Docker.",
        },
        introduction: [
          "Un système Machine Learning de bout en bout qui prédit le churn client et transforme les probabilités du modèle en signaux opérationnels pour la rétention.",
        ],
        caseStudy: [
          {
            id: "business-goal",
            heading: "Objectif métier",
            items: [
              "Identifier les clients susceptibles de partir",
              "Produire une probabilité de churn pour chaque client",
              "Aider les équipes de rétention à prioriser les clients à risque",
            ],
          },
          {
            id: "data",
            heading: "Données et analyse exploratoire",
            items: [
              "Jeu IBM Telco Customer Churn de 7 043 clients",
              "Analyse de la distribution du churn et du déséquilibre des classes",
              "Étude de tenure, Contract, MonthlyCharges, InternetService, TechSupport, PaymentMethod et d’autres caractéristiques clients",
            ],
          },
          {
            id: "machine-learning",
            heading: "Approche Machine Learning",
            items: [
              "Prétraitement sans fuite de données et feature engineering déterministe",
              "Comparaison de Logistic Regression, Decision Tree, Random Forest et Gradient Boosting",
              "Sélection finale du pipeline Logistic Regression",
              "Seuil opérationnel fixé à 0,30 selon le compromis métier précision/rappel",
            ],
          },
          {
            id: "results",
            heading: "Résultats validés",
            metrics: [
              { label: "ROC-AUC sur le test", value: "0,8429" },
              { label: "Clients churn détectés", value: "285 sur 374" },
              { label: "Seuil opérationnel", value: "0,30" },
            ],
          },
          {
            id: "explainability",
            heading: "Explicabilité",
            paragraphs: [
              "Les coefficients du modèle et SHAP servent à analyser l’influence globale des variables et à expliquer les facteurs associés aux prédictions, sans formuler de conclusion causale.",
            ],
          },
          {
            id: "production",
            heading: "API et application",
            items: [
              "Sérialisation du prétraitement et du pipeline Logistic Regression",
              "Schémas Pydantic validés et exposés par FastAPI",
              "Endpoints de santé, informations modèle, prédiction unitaire et batch, documentés avec Swagger",
              "Interface responsive pour 19 variables client, probabilité, prédiction et seuil opérationnel",
            ],
          },
          {
            id: "validation",
            heading: "Tests et Docker",
            metrics: [
              { label: "Tests automatisés", value: "39 réussis" },
              { label: "Validations finales", value: "70 réalisées" },
            ],
            items: [
              "Conteneur Docker validé en bonne santé",
              "Parité des prédictions et du modèle entre Python, FastAPI local et Docker",
            ],
          },
        ],
      },
      "football-intelligence-player-recommendation-system": {
        title: "Football Intelligence & Player Recommendation System",
        category: "Data Science / Système de recommandation",
        shortDescription:
          "Une plateforme complète d’analyse des joueurs, similarité statistique, scouting, recommandations de remplacement et découverte de talents.",
        imageAlt: "Aperçu de la plateforme d’intelligence football et de recommandation de joueurs",
        seo: {
          title: "Recommandation de joueurs de football",
          description:
            "Une plateforme d’intelligence football réunissant analytics, similarité, scouting, FastAPI, React et recommandations explicables.",
        },
        introduction: [
          "Un système de Football Intelligence et de recommandation de joueurs de bout en bout, qui transforme les données de performance en analyses explicables pour le scouting et le recrutement.",
        ],
        caseStudy: [
          {
            id: "business-goal",
            heading: "Objectif métier",
            items: [
              "Explorer les joueurs à partir d’indicateurs statistiques",
              "Trouver des profils de jeu statistiquement similaires",
              "Construire des shortlists selon des critères sportifs",
              "Identifier des candidats au remplacement",
              "Comparer les joueurs dans des contextes de poste pertinents",
              "Faire émerger des joueurs moins exposés mais performants relativement à leur poste",
            ],
          },
          {
            id: "data-science",
            heading: "Data Science et football analytics",
            items: [
              "Collecte, validation, nettoyage et préparation des données d’événements et de joueurs",
              "Profils contextualisés joueur-équipe-compétition-saison",
              "Feature engineering adapté au poste",
              "Métriques par 90 minutes et percentiles relatifs au poste",
              "Profils radar et comparaisons analytiques",
            ],
          },
          {
            id: "recommendation",
            heading: "Système de recommandation",
            items: [
              "Similarité cosinus sur des profils statistiques normalisés",
              "Recommandations entre joueurs du même poste",
              "Scouting intelligent avec contraintes strictes et préférences sportives pondérées",
              "Recommandations de remplacement excluant l’équipe de référence",
              "Découverte de Sporting Hidden Gems selon l’exposition et les forces en percentiles",
              "Résultats explicables et contextualisés",
            ],
          },
          {
            id: "application",
            heading: "Backend et application",
            items: [
              "Services Data Science exposés avec FastAPI et Pydantic",
              "Endpoints REST pour joueurs, profils, similarité, scouting, remplacements, Hidden Gems, comparaison et analytics",
              "Interface React et TypeScript avec exploration, radars, comparaison, workflows de scouting et analytics",
              "Client API typé centralisé entre frontend et backend de recommandation",
            ],
          },
          {
            id: "validation",
            heading: "Validation",
            items: [
              "Tests backend, recommandation, validation des données et API",
              "Validations frontend TypeScript, ESLint, composants, API et build de production",
              "Audit technique final terminé sans problème critique restant",
            ],
          },
        ],
      },
    },
  },
  certifications: {
    section: {
      titleLead: "Mes",
      titleAccent: "certifications",
      description:
        "Des certifications qui consolident mes acquis en génie logiciel, Data Science, Machine Learning, Python et Java.",
      viewAll: "Voir toutes les certifications",
    },
    listing: {
      titleLead: "Toutes les",
      titleAccent: "certifications",
      description: "L’ensemble de mes certificats et attestations documentés.",
      count: {
        zero: "Aucune certification",
        one: "{count} certification",
        two: "{count} certifications",
        few: "{count} certifications",
        many: "{count} certifications",
        other: "{count} certifications",
      },
      backToPortfolio: "Retour au portfolio",
      collectionLabel: "Collection de certifications",
    },
    card: {
      preview: "Aperçu",
      previewCertificate: "Afficher l’aperçu de {certificate}",
      verify: "Vérifier",
      verifyCertificate: "Vérifier la certification",
      viewOnLinkedIn: "Voir sur LinkedIn",
      downloadCertificate: "Télécharger le certificat",
    },
    modal: {
      dialogLabel: "Aperçu de la certification",
      closePreview: "Fermer l’aperçu de la certification",
      close: "Fermer",
      imageLabel: "Image du certificat",
    },
    items: {
      "python-data-science-ai": {
        title: "Python for Data Science, AI & Development",
        issuer: "IBM (via Coursera)",
        imageAlt: "Certificat Python for Data Science, AI & Development délivré par IBM via Coursera",
      },
      "supervised-ml-regression-classification": {
        title: "Supervised Machine Learning: Regression and Classification",
        issuer: "DeepLearning.AI (via Coursera)",
        imageAlt: "Certificat Supervised Machine Learning délivré par DeepLearning.AI via Coursera",
      },
      "introduction-to-software-engineering": {
        title: "Introduction to Software Engineering",
        issuer: "IBM (via Coursera)",
        imageAlt: "Certificat Introduction to Software Engineering délivré par IBM via Coursera",
      },
      "cs250-python-for-data-scientists": {
        title: "CS250: Python for Data Scientists",
        issuer: "Saylor Academy",
        imageAlt: "Certificat CS250: Python for Data Scientists délivré par Saylor Academy",
      },
      "the-data-science-profession": {
        title: "The Data Science Profession",
        issuer: "University of London (via Coursera)",
        imageAlt: "Certificat The Data Science Profession délivré par University of London via Coursera",
      },
      "spring-ecosystem-and-core": {
        title: "Spring — Ecosystem and Core",
        issuer: "LearnQuest (via Coursera)",
        imageAlt: "Certificat Spring Ecosystem and Core délivré par LearnQuest via Coursera",
      },
      "introduction-to-machine-learning": {
        title: "Introduction to Machine Learning",
        issuer: "Duke University (via Coursera)",
        imageAlt: "Certificat Introduction to Machine Learning délivré par Duke University via Coursera",
      },
      "java-explorer": {
        title: "Java Explorer",
        issuer: "Oracle",
        imageAlt: "Attestation Java Explorer délivrée par Oracle",
      },
      "python-for-machine-learning": {
        title: "Python for Machine Learning",
        issuer: "SimpliLearn",
        imageAlt: "Certificat Python for Machine Learning délivré par SimpliLearn",
      },
      "kaggle-data-visualization": {
        title: "Data Visualization",
        issuer: "Kaggle",
        imageAlt: "Certificat Data Visualization délivré par Kaggle",
      },
    },
  },
  contact: {
    titleLead: "Construisons",
    titleAccent: "quelque chose d’utile",
    description:
      "Je suis disponible pour échanger sur des projets, des idées techniques ou des opportunités où le génie logiciel et la Data Science peuvent créer une valeur concrète.",
    formLabel: "Contacter Issam Elghbali",
    fields: {
      name: {
        label: "Nom",
        placeholder: "Votre nom",
        requiredError: "Veuillez saisir votre nom.",
      },
      email: {
        label: "Adresse e-mail",
        placeholder: "vous@exemple.com",
        requiredError: "Veuillez saisir votre adresse e-mail.",
        invalidError: "Saisissez une adresse e-mail valide.",
      },
      message: {
        label: "Message",
        placeholder: "Présentez-moi votre projet ou votre opportunité",
        requiredError: "Veuillez saisir un message.",
      },
    },
    send: "Envoyer le message",
    sending: "Envoi en cours…",
    success: "Votre message a bien été envoyé.",
    error: "Le message n’a pas pu être envoyé. Veuillez réessayer.",
    emailLabel: "Envoyer un e-mail à Issam Elghbali",
    linkedinLabel: "Voir le profil LinkedIn d’Issam Elghbali",
    githubLabel: "Voir le profil GitHub d’Issam Elghbali",
  },
  footer: {
    copyright: "© {year} Issam Elghbali.",
    rights: "Tous droits réservés.",
    navigationLabel: "Navigation de pied de page",
  },
  breadcrumbs: {
    ariaLabel: "Fil d’Ariane",
    home: "Accueil",
    projects: "Projets",
    certifications: "Certifications",
    separatorLabel: "Page suivante",
  },
  notFound: {
    title: "Page introuvable",
    description: "La page demandée n’existe pas ou n’est plus disponible.",
    projectTitle: "Projet introuvable",
    projectDescription: "Le projet demandé n’existe pas dans ce portfolio.",
    backHome: "Revenir à l’accueil",
    backToProjects: "Parcourir tous les projets",
  },
  chatbot: {
    title: "Assistant d’Issam",
    subtitle: "Guide du portfolio",
    dialogLabel: "Assistant IA du portfolio d’Issam",
    open: "Ouvrir l’assistant IA",
    close: "Fermer l’assistant IA",
    inputPlaceholder: "Posez une question sur Issam…",
    inputLabel: "Message destiné à l’assistant IA d’Issam",
    send: "Envoyer le message",
    thinking: "L’assistant d’Issam prépare une réponse",
    disclaimer: "Les réponses utilisent uniquement le portfolio et le CV documentés d’Issam.",
    welcome:
      "Bonjour ! Je suis l’assistant IA du portfolio d’Issam. Vous pouvez m’interroger sur son expérience, ses projets, ses compétences, sa formation ou ses certifications. Mes réponses s’appuient uniquement sur les informations documentées dans son portfolio et son CV.",
    unavailable: "Impossible de joindre l’assistant. Vérifiez votre connexion et réessayez.",
    suggestions: [
      "Présente-moi Issam",
      "Montre-moi ses meilleurs projets",
      "Quelles sont ses principales compétences ?",
      "Montre-moi ses certifications",
    ],
    userMessageLabel: "Votre message",
    assistantMessageLabel: "Réponse de l’assistant",
    unreadOne: "1 réponse non lue de l’assistant",
    unreadMany: "{count} réponses non lues de l’assistant",
    resources: {
      types: {
        project: "Projet",
        certificate: "Certification",
        pdf: "PDF",
        image: "Image",
        github: "GitHub",
        link: "Lien",
      },
      actions: {
        project: "Voir le projet",
        certificate: "Vérifier la certification",
        pdf: "Voir le CV",
        image: "Voir l’image",
        github: "Ouvrir GitHub",
        link: "Ouvrir le lien",
      },
    },
  },
  seo: {
    titleTemplate: "%s | Issam Elghbali",
    defaultTitle: "Issam Elghbali — Développeur Full-Stack & Data Scientist",
    defaultDescription:
      "Portfolio d’Issam Elghbali, développeur Full-Stack et Data Scientist travaillant avec Java, Spring Boot, React, Python et le Machine Learning.",
    home: {
      title: "Développeur Full-Stack & Data Scientist",
      description:
        "Découvrez les projets Full-Stack, Data Science et Machine Learning d’Issam Elghbali, ainsi que ses compétences, son parcours et ses certifications.",
    },
    projects: {
      title: "Projets logiciel & Data Science",
      description:
        "Découvrez dix projets autour de Spring Boot, React, Next.js, la Data Science, le Machine Learning, FastAPI et l’architecture logicielle.",
    },
    certifications: {
      title: "Certifications Data Science & logiciel",
      description:
        "Consultez les certifications documentées d’Issam Elghbali en Python, Data Science, Machine Learning, génie logiciel, Spring et Java.",
    },
    notFound: {
      title: "Page introuvable",
      description: "La page demandée n’existe pas dans ce portfolio.",
    },
    openGraphImageAlt: "Issam Elghbali — Développeur Full-Stack et Data Scientist",
  },
  accessibility: {
    decorativeImageAlt: "",
    mainContentLabel: "Contenu principal",
    sectionNavigationLabel: "Sections du portfolio",
    scrollTickerPaused: "Défilement des technologies en pause",
    scrollTickerPlaying: "Défilement des technologies en cours",
    currentPage: "Page actuelle",
    errorPrefix: "Erreur :",
    successPrefix: "Succès :",
  },
} as const satisfies PortfolioDictionary;

export default fr;
