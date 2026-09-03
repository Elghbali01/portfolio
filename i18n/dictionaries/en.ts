import type { PortfolioDictionary } from "../types";

const en = {
  locale: "en",
  direction: "ltr",
  localeName: "English",
  common: {
    siteName: "Issam Elghbali Portfolio",
    portfolioOwner: "Issam Elghbali",
    skipToContent: "Skip to main content",
    loading: "Loading",
    close: "Close",
    back: "Back",
    previous: "Previous",
    next: "Next",
    opensInNewTab: "opens in a new tab",
    externalLink: "External link",
    download: "Download",
    notAvailable: "Not available",
  },
  loader: {
    tagline: "Engineering Ideas into Digital Reality…",
  },
  navigation: {
    ariaLabel: "Primary navigation",
    brandLabel: "Issam Elghbali — go to the homepage",
    sections: {
      home: "Home",
      about: "About",
      projects: "Projects",
      skills: "Skills",
      certifications: "Certifications",
      experience: "Experience",
      contact: "Contact",
    },
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    menuLabel: "Navigation menu",
  },
  languageSwitcher: {
    label: "Language",
    currentLanguage: "Current language",
    changeLanguage: "Change language",
  },
  hero: {
    greeting: "Hi, I’m",
    name: "Issam Elghbali",
    stableHeadline: "Full-Stack Developer & Data Scientist",
    rotatingRoles: [
      "Full-Stack Developer",
      "Data Scientist",
      "Machine Learning Practitioner",
      "Intelligent Systems Builder",
      "Data-Driven Problem Solver",
    ],
    profileImageAlt: "Portrait of Issam Elghbali",
    viewProjects: "View projects",
    contactMe: "Contact me",
    downloadCv: "Download CV",
    linkedinLabel: "View Issam Elghbali’s LinkedIn profile",
    githubLabel: "View Issam Elghbali’s GitHub profile",
  },
  about: {
    titleLead: "Who",
    titleAccent: "I Am",
    summary:
      "Data Science Master’s student with a strong foundation in Computer Science, focused on Machine Learning, Artificial Intelligence, and scalable software systems.",
    paragraphs: [
      "I work at the intersection of Machine Learning, Artificial Intelligence, and modern Software Engineering.",
      "My focus is designing intelligent systems that address real-world problems through sound data practices and scalable architectures.",
      "Driven by curiosity and continuous learning, I build digital solutions that balance performance, maintainability, and practical value.",
    ],
    focusAreas: [
      {
        id: "artificial-intelligence",
        title: "Artificial Intelligence",
        description:
          "Designing intelligent systems supported by Machine Learning and well-chosen algorithms.",
      },
      {
        id: "data-science",
        title: "Data Science",
        description:
          "Turning raw data into clear insights and actionable, evidence-based solutions.",
      },
      {
        id: "software-engineering",
        title: "Software Engineering",
        description:
          "Building scalable, maintainable applications with reliable backend and frontend foundations.",
      },
    ],
  },
  skills: {
    titleLead: "Technical",
    titleAccent: "Arsenal",
    description:
      "The technologies I use to turn ideas into scalable, intelligent, and practical digital solutions.",
    developerTitle: "Developer",
    developerDescription:
      "I build full-stack applications with modern frameworks and scalable architectures, from clear user interfaces to robust APIs and high-performance backends.",
    dataScientistTitle: "Data Scientist",
    dataScientistDescription:
      "I turn raw data into actionable insights through statistical analysis, Machine Learning, and data visualization to support informed decisions.",
    technologiesLabel: "Technologies",
    categories: {
      development: "Development",
      dataScience: "Data Science",
      aiMachineLearning: "AI / Machine Learning",
    },
    tickerInstructions: "Pause the technology list by hovering over it or focusing it.",
  },
  experience: {
    titleLead: "Professional",
    titleAccent: "Journey",
    description:
      "My academic and professional path, building expertise in Software Engineering, Data Science, and intelligent systems.",
    timelineLabel: "Academic and professional timeline",
    items: {
      "master-data-science": {
        title: "Master in Data Science & Intelligent Systems",
        period: "2025 – Present",
        institution: "Faculty of Sciences and Techniques of Fez (FST Fez)",
        location: "Fez, Morocco",
        description:
          "Advanced studies focused on Machine Learning, Artificial Intelligence, and scalable intelligent systems.",
        typeLabel: "Education",
      },
      "software-engineering-internship": {
        title: "Software Engineering Intern",
        period: "2025",
        institution: "École Polytechnique des Génies",
        location: "Fez, Morocco",
        duration: "2 months",
        description:
          "Designed and developed an internal resource management platform with Spring Boot and React.js, focusing on backend architecture, REST APIs, and reliable system integration to streamline internal operations.",
        typeLabel: "Professional experience",
      },
      "computer-engineering-licence": {
        title: "Licence Sciences et Techniques — Computer Engineering",
        period: "2024 – 2025",
        institution: "Faculty of Sciences and Techniques of Fez (FST Fez)",
        location: "Fez, Morocco",
        description:
          "Specialized in software development, algorithms, and system architecture.",
        typeLabel: "Education",
      },
      deust: {
        title: "DEUST",
        period: "2022 – 2024",
        institution: "Faculty of Sciences and Techniques of Fez (FST Fez)",
        location: "Fez, Morocco",
        description:
          "Built a strong foundation in mathematics and computer science, developing analytical thinking, problem-solving skills, and core engineering principles.",
        typeLabel: "Education",
      },
    },
  },
  projects: {
    section: {
      titleLead: "Featured",
      titleAccent: "Projects",
      description:
        "A selection of projects spanning full-stack development, Data Science, and scalable software architectures.",
      viewAll: "View all projects",
    },
    listing: {
      titleLead: "All",
      titleAccent: "Projects",
      description:
        "A complete collection of my projects across full-stack development, Data Science, Machine Learning, and enterprise applications.",
      count: {
        zero: "No projects",
        one: "{count} project",
        two: "{count} projects",
        few: "{count} projects",
        many: "{count} projects",
        other: "{count} projects",
      },
      backToPortfolio: "Back to portfolio",
      collectionLabel: "Project collection",
    },
    card: {
      githubProfile: "GitHub profile",
      githubRepository: "GitHub repository",
      viewDetails: "View details",
      viewDetailsFor: "View details for {project}",
      technologiesLabel: "Technologies used",
    },
    detail: {
      backToProjects: "Back to all projects",
      githubProfile: "View GitHub profile",
      githubRepository: "View repository on GitHub",
      projectImageLabel: "Project preview",
      technologiesHeading: "Technologies",
      caseStudyHeading: "Case study",
    },
    items: {
      "indonesia-tourism": {
        title: "Indonesia Tourism Website",
        category: "Frontend / Web Development",
        shortDescription:
          "A static tourism website presenting Indonesia’s culture, destinations, and travel attractions.",
        imageAlt: "Preview of the Indonesia tourism website",
        seo: {
          title: "Indonesia Tourism Website",
          description:
            "A responsive tourism website presenting Indonesia’s culture, destinations, attractions, and visual travel content.",
        },
        introduction: [
          "A tourism-focused landing website dedicated to Indonesia, designed to present the country’s culture, landmarks, and travel experiences in an informative and visually engaging format.",
        ],
        caseStudy: [
          {
            id: "content",
            heading: "Website content",
            items: [
              "Landing Hero section",
              "Destination highlights",
              "Cultural presentation",
              "Image gallery",
              "Contact section",
            ],
          },
          {
            id: "focus",
            heading: "Engineering focus",
            paragraphs: [
              "The project focuses on frontend structure, responsive design, and interactive behavior implemented with JavaScript.",
            ],
          },
        ],
      },
      "resource-platform": {
        title: "Academic Resource Management Platform",
        category: "Full-Stack Application",
        shortDescription:
          "A full-stack platform that enables professors to share and manage academic resources for students.",
        imageAlt: "Preview of the academic resource management platform",
        seo: {
          title: "Academic Resource Platform",
          description:
            "A Spring Boot and React platform for securely organising, sharing, and accessing academic course materials.",
        },
        introduction: [
          "A full-stack academic resource management system designed for educational institutions.",
        ],
        caseStudy: [
          {
            id: "capabilities",
            heading: "Core capabilities",
            items: [
              "Professors can upload and manage course materials",
              "Students can access and download resources",
              "Materials are organised by subject",
              "Access is protected by an authentication system",
            ],
          },
          {
            id: "architecture",
            heading: "Architecture",
            paragraphs: [
              "The backend uses Spring Boot and exposes REST APIs. The React.js frontend provides the interactive user experience and manages application state.",
            ],
          },
          {
            id: "demonstrates",
            heading: "What the project demonstrates",
            items: [
              "REST API development",
              "Authentication handling",
              "Full-stack integration",
              "React state management",
            ],
          },
        ],
      },
      "employee-management": {
        title: "Employee & Salary Management System",
        category: "Enterprise Web Application",
        shortDescription:
          "A three-tier MVC application for managing employees, supervisors, salaries, and role-based access.",
        imageAlt: "Preview of the employee and salary management system",
        seo: {
          title: "Employee Management System",
          description:
            "A Spring Boot MVC application for employee, supervisor, salary, and role-based access management.",
        },
        introduction: [
          "A three-tier enterprise web application built with Spring Boot and Thymeleaf.",
        ],
        caseStudy: [
          {
            id: "features",
            heading: "Core features",
            items: [
              "Employee CRUD operations",
              "Supervisor management",
              "Salary management",
              "Role-based authentication for Director, Supervisor, and Employee roles",
            ],
          },
          {
            id: "architecture",
            heading: "Layered architecture",
            items: ["Controller layer", "Service layer", "Repository layer"],
          },
        ],
      },
      "nosql-ml-redis": {
        title: "NoSQL & Machine Learning Football Prediction System",
        category: "Data Engineering / Machine Learning",
        shortDescription:
          "An application architecture combining Redis, model training, a prediction API, and a React frontend.",
        imageAlt: "Preview of the Redis and Machine Learning football prediction system",
        seo: {
          title: "Redis ML Football Prediction",
          description:
            "A football prediction architecture combining Redis, Machine Learning model training, REST API inference, and React.",
        },
        introduction: [
          "A complete application architecture connecting NoSQL data storage, Machine Learning training, prediction services, and a web interface.",
        ],
        caseStudy: [
          {
            id: "architecture",
            heading: "Integrated architecture",
            items: [
              "Redis as the NoSQL database",
              "Machine Learning model training",
              "Predictions exposed through a REST API",
              "React frontend interface",
            ],
          },
        ],
      },
      "personal-portfolio": {
        title: "Personal Portfolio Website",
        category: "Frontend / Full-Stack",
        shortDescription:
          "A modern Next.js and Tailwind CSS portfolio presenting projects, skills, and professional experience.",
        imageAlt: "Preview of Issam Elghbali’s personal portfolio",
        seo: {
          title: "Personal Portfolio Website",
          description:
            "A responsive portfolio built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and EmailJS.",
        },
        introduction: [
          "My personal developer portfolio, created to present projects, technical skills, and my professional journey through a responsive and maintainable interface.",
        ],
        caseStudy: [
          {
            id: "features",
            heading: "Key features",
            items: [
              "Animated landing page",
              "Dynamic project routing with Next.js",
              "Interactive skills presentation",
              "Professional timeline",
              "Contact form integrated with EmailJS",
              "Responsive layout",
            ],
          },
          {
            id: "architecture",
            heading: "Architecture",
            paragraphs: [
              "The project follows a component-based structure and centralizes project data to support maintainability and future growth.",
            ],
          },
        ],
      },
      "ticket-management-system": {
        title: "Advanced Ticket Management System",
        category: "Backend / Enterprise Application",
        shortDescription:
          "An in-development Spring Boot REST API for support tickets, users, and structured ticket workflows.",
        imageAlt: "Preview of the advanced ticket management system",
        seo: {
          title: "Ticket Management REST API",
          description:
            "An in-development Spring Boot REST API for support tickets, users, validation, persistence, and enterprise workflows.",
        },
        introduction: [
          "An in-development Spring Boot REST API that models how companies manage incidents, support requests, and internal tasks.",
        ],
        caseStudy: [
          {
            id: "workflow",
            heading: "Users and ticket workflow",
            items: [
              "User, Agent, and Admin roles",
              "Ticket lifecycle: OPEN, IN_PROGRESS, RESOLVED, and CLOSED",
              "User management and authentication preparation",
            ],
          },
          {
            id: "architecture",
            heading: "Backend architecture",
            items: [
              "Controller, Service, and Repository layers",
              "DTOs to protect internal entities",
              "Mapper layer for object transformation",
              "RESTful API design",
              "Jakarta Validation",
              "Persistence with Spring Data JPA",
            ],
          },
          {
            id: "status",
            heading: "Status",
            paragraphs: ["This project is currently in development."],
          },
        ],
      },
      "resource-management-system": {
        title: "University Material Resource Management System",
        category: "Full-Stack / Enterprise Application",
        shortDescription:
          "A platform managing university hardware needs, tenders, suppliers, inventory assignment, and maintenance workflows.",
        imageAlt: "Preview of the university material resource management system",
        seo: {
          title: "University Resource Management",
          description:
            "A secured Spring Boot platform for university hardware procurement, suppliers, inventory, assignments, and maintenance.",
        },
        introduction: [
          "A comprehensive system designed for university faculties to manage the full lifecycle of computers and printers across departments.",
          "The platform connects department heads, a resource manager, a maintenance service, and external suppliers through centralized, secured workflows.",
        ],
        caseStudy: [
          {
            id: "procurement",
            heading: "Tender and procurement management",
            items: [
              "Department heads collect hardware needs from teachers",
              "Needs are reviewed and validated during a departmental meeting",
              "The resource manager aggregates requests into a tender with start and end dates",
              "Suppliers submit proposals with delivery date, warranty, brand, unit prices, and total price",
            ],
          },
          {
            id: "suppliers",
            heading: "Supplier management",
            items: [
              "Suppliers register with a secured company account",
              "The resource manager can blacklist non-compliant suppliers and notify them with a reason",
              "The lowest bidder is selected and acceptance or rejection notifications are sent",
            ],
          },
          {
            id: "inventory",
            heading: "Inventory and assignment",
            items: [
              "Each delivered resource receives a unique barcode inventory number",
              "Supplier company details are recorded",
              "Resources are assigned to an individual teacher or an entire department",
              "Resources and assignments can be listed, updated, and deleted",
            ],
          },
          {
            id: "maintenance",
            heading: "Maintenance and failure reporting",
            items: [
              "Teachers report hardware failures to the maintenance service",
              "Technicians document severe failures, their date, frequency, and software or hardware type",
              "The resource manager decides whether an in-warranty resource is returned for repair or replacement",
            ],
          },
          {
            id: "architecture",
            heading: "Architecture and access control",
            paragraphs: [
              "The backend follows Controller, Service, and Repository layers and secures the Department Head, Resource Manager, Technician, Supplier, and Teacher roles.",
            ],
          },
        ],
      },
      "water-potability-ml": {
        title: "Water Potability Prediction System",
        category: "Machine Learning / Data Science",
        shortDescription:
          "An end-to-end ML pipeline and Streamlit application for predicting water potability from physicochemical measurements.",
        imageAlt: "Preview of the water potability prediction application",
        seo: {
          title: "Water Potability ML System",
          description:
            "An end-to-end Machine Learning study and Streamlit application for safety-oriented water potability prediction.",
        },
        introduction: [
          "A complete Machine Learning study that predicts whether water is potable from nine physicochemical measurements.",
          "The evaluation prioritizes reducing the risk of classifying unsafe water as potable.",
        ],
        caseStudy: [
          {
            id: "data",
            heading: "Dataset and features",
            paragraphs: [
              "The water_potability.csv dataset provides pH, Hardness, Solids, Chloramines, Sulfate, Conductivity, Organic Carbon, Trihalomethanes, and Turbidity.",
            ],
            metrics: [{ label: "Input features", value: "9" }],
          },
          {
            id: "feature-importance",
            heading: "Feature importance",
            items: [
              "A Decision Tree with a maximum depth of 5 ranks the contribution of each variable",
              "Feature importances are displayed in a bar chart",
            ],
          },
          {
            id: "missing-values",
            heading: "Missing-value strategies",
            items: [
              "Strategy 1 fills missing values with each column’s median and preserves all rows and columns",
              "Strategy 2 removes rows that contain missing values",
              "Random Forest, KNN, and SVM are trained and evaluated for both strategies",
            ],
          },
          {
            id: "evaluation",
            heading: "Model evaluation and selection",
            items: [
              "Primary metric: recall for class 0, representing non-potable water",
              "Secondary metrics: accuracy, F1-score, and ROC-AUC",
              "Confusion matrices and ROC curves for each model and strategy",
              "The best model and scaler are saved as .pkl artifacts",
              "The selected configuration is evaluated with 3-fold cross-validation",
            ],
          },
          {
            id: "application",
            heading: "Streamlit application",
            items: [
              "Manual entry of nine parameters",
              "Real-time potable or non-potable prediction",
              "SVM decision score showing distance from the decision boundary",
              "Quick testing from a dataset row",
              "Prediction history with CSV export",
            ],
          },
        ],
      },
      "customer-churn-prediction": {
        title: "Customer Churn Prediction",
        category: "Machine Learning / Data Science",
        shortDescription:
          "An end-to-end churn prediction system combining explainability, a FastAPI inference API, and a responsive web application.",
        imageAlt: "Preview of the customer churn prediction application",
        seo: {
          title: "Customer Churn Prediction",
          description:
            "An explainable churn prediction pipeline with threshold tuning, FastAPI, automated tests, and Docker deployment.",
        },
        introduction: [
          "An end-to-end Machine Learning system that predicts customer churn and turns model probabilities into practical retention signals.",
        ],
        caseStudy: [
          {
            id: "business-goal",
            heading: "Business goal",
            items: [
              "Identify customers who are likely to churn",
              "Return a churn probability for each customer",
              "Help retention teams prioritize customers at risk",
            ],
          },
          {
            id: "data",
            heading: "Data and exploratory analysis",
            items: [
              "IBM Telco Customer Churn dataset with 7,043 customers",
              "Analysis of churn distribution and class imbalance",
              "Exploration of tenure, Contract, MonthlyCharges, InternetService, TechSupport, PaymentMethod, and other customer attributes",
            ],
          },
          {
            id: "machine-learning",
            heading: "Machine Learning approach",
            items: [
              "Leakage-safe preprocessing and deterministic feature engineering",
              "Comparison of Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting",
              "Final selection of the Logistic Regression pipeline",
              "Operational threshold tuned to 0.30 for the business precision/recall trade-off",
            ],
          },
          {
            id: "results",
            heading: "Validated results",
            metrics: [
              { label: "Test ROC-AUC", value: "0.8429" },
              { label: "Churners detected", value: "285 of 374" },
              { label: "Operational threshold", value: "0.30" },
            ],
          },
          {
            id: "explainability",
            heading: "Explainability",
            paragraphs: [
              "Model coefficients and SHAP are used to analyze global feature influence and explain factors associated with predictions without making causal claims.",
            ],
          },
          {
            id: "production",
            heading: "API and application",
            items: [
              "Serialised preprocessing and Logistic Regression pipeline",
              "Validated Pydantic schemas exposed through FastAPI",
              "Health, model information, single prediction, and batch prediction endpoints with Swagger documentation",
              "Responsive interface for 19 customer inputs, probability, prediction, and the operational threshold",
            ],
          },
          {
            id: "validation",
            heading: "Testing and Docker",
            metrics: [
              { label: "Automated tests", value: "39 passed" },
              { label: "Final validations", value: "70 completed" },
            ],
            items: [
              "Validated healthy Docker container",
              "Prediction and model parity across Python, local FastAPI, and Docker environments",
            ],
          },
        ],
      },
      "football-intelligence-player-recommendation-system": {
        title: "Football Intelligence & Player Recommendation System",
        category: "Data Science / Recommendation System",
        shortDescription:
          "An end-to-end platform for player analysis, statistical similarity, scouting, replacement recommendations, and talent discovery.",
        imageAlt: "Preview of the football intelligence and player recommendation platform",
        seo: {
          title: "Football Player Recommendation",
          description:
            "A football intelligence platform combining analytics, player similarity, scouting, FastAPI, React, and explainable recommendations.",
        },
        introduction: [
          "An end-to-end Football Intelligence and Player Recommendation System that transforms performance data into explainable scouting and recruitment insights.",
        ],
        caseStudy: [
          {
            id: "business-goal",
            heading: "Business goal",
            items: [
              "Explore players through statistical evidence",
              "Find statistically similar playing profiles",
              "Build shortlists from sporting requirements",
              "Identify replacement candidates",
              "Compare players within relevant positional contexts",
              "Surface lower-exposure players with strong position-relative dimensions",
            ],
          },
          {
            id: "data-science",
            heading: "Data Science and football analytics",
            items: [
              "Collection, validation, cleaning, and preparation of football event and player data",
              "Contextual player-team-competition-season profiles",
              "Position-aware feature engineering",
              "Per-90 metrics and position-relative percentiles",
              "Radar profiles and analytical comparisons",
            ],
          },
          {
            id: "recommendation",
            heading: "Recommendation system",
            items: [
              "Cosine similarity over normalized statistical profiles",
              "Same-position recommendation logic",
              "Intelligent scouting with hard constraints and weighted sporting preferences",
              "Replacement recommendations excluding the reference team",
              "Sporting Hidden Gems discovery based on exposure and percentile strengths",
              "Explainable, context-aware outputs",
            ],
          },
          {
            id: "application",
            heading: "Backend and application",
            items: [
              "FastAPI and Pydantic Data Science services",
              "REST endpoints for players, profiles, similarity, scouting, replacements, Hidden Gems, comparison, and analytics",
              "React and TypeScript interface with exploration, radar charts, comparisons, scouting workflows, and analytics",
              "Centralised typed API client connecting the frontend and recommendation backend",
            ],
          },
          {
            id: "validation",
            heading: "Validation",
            items: [
              "Backend, recommendation, data validation, and API tests",
              "Frontend TypeScript, ESLint, component, API, and production build validation",
              "Final technical audit completed with no critical remaining issues",
            ],
          },
        ],
      },
    },
  },
  certifications: {
    section: {
      titleLead: "My",
      titleAccent: "Certifications",
      description:
        "Credentials supporting my foundations in Software Engineering, Data Science, Machine Learning, Python, and Java.",
      viewAll: "View all certifications",
    },
    listing: {
      titleLead: "All",
      titleAccent: "Certifications",
      description: "A complete collection of my documented certificates and credentials.",
      count: {
        zero: "No certifications",
        one: "{count} certification",
        two: "{count} certifications",
        few: "{count} certifications",
        many: "{count} certifications",
        other: "{count} certifications",
      },
      backToPortfolio: "Back to portfolio",
      collectionLabel: "Certification collection",
    },
    card: {
      preview: "Preview",
      previewCertificate: "Preview {certificate}",
      verify: "Verify",
      verifyCertificate: "Verify certificate",
      viewOnLinkedIn: "View on LinkedIn",
      downloadCertificate: "Download certificate",
    },
    modal: {
      dialogLabel: "Certificate preview",
      closePreview: "Close certificate preview",
      close: "Close",
      imageLabel: "Certificate image",
    },
    items: {
      "python-data-science-ai": {
        title: "Python for Data Science, AI & Development",
        issuer: "IBM (via Coursera)",
        imageAlt: "Python for Data Science, AI & Development certificate issued by IBM via Coursera",
      },
      "supervised-ml-regression-classification": {
        title: "Supervised Machine Learning: Regression and Classification",
        issuer: "DeepLearning.AI (via Coursera)",
        imageAlt: "Supervised Machine Learning certificate issued by DeepLearning.AI via Coursera",
      },
      "introduction-to-software-engineering": {
        title: "Introduction to Software Engineering",
        issuer: "IBM (via Coursera)",
        imageAlt: "Introduction to Software Engineering certificate issued by IBM via Coursera",
      },
      "cs250-python-for-data-scientists": {
        title: "CS250: Python for Data Scientists",
        issuer: "Saylor Academy",
        imageAlt: "CS250: Python for Data Scientists certificate issued by Saylor Academy",
      },
      "the-data-science-profession": {
        title: "The Data Science Profession",
        issuer: "University of London (via Coursera)",
        imageAlt: "The Data Science Profession certificate issued by the University of London via Coursera",
      },
      "spring-ecosystem-and-core": {
        title: "Spring — Ecosystem and Core",
        issuer: "LearnQuest (via Coursera)",
        imageAlt: "Spring Ecosystem and Core certificate issued by LearnQuest via Coursera",
      },
      "introduction-to-machine-learning": {
        title: "Introduction to Machine Learning",
        issuer: "Duke University (via Coursera)",
        imageAlt: "Introduction to Machine Learning certificate issued by Duke University via Coursera",
      },
      "java-explorer": {
        title: "Java Explorer",
        issuer: "Oracle",
        imageAlt: "Java Explorer credential issued by Oracle",
      },
      "python-for-machine-learning": {
        title: "Python for Machine Learning",
        issuer: "SimpliLearn",
        imageAlt: "Python for Machine Learning certificate issued by SimpliLearn",
      },
      "kaggle-data-visualization": {
        title: "Data Visualization",
        issuer: "Kaggle",
        imageAlt: "Data Visualization certificate issued by Kaggle",
      },
    },
  },
  contact: {
    titleLead: "Let’s Build",
    titleAccent: "Something Valuable",
    description:
      "I’m open to discussing projects, technical ideas, and opportunities where Software Engineering and Data Science can create practical value.",
    formLabel: "Contact Issam Elghbali",
    fields: {
      name: {
        label: "Name",
        placeholder: "Your name",
        requiredError: "Please enter your name.",
      },
      email: {
        label: "Email address",
        placeholder: "you@example.com",
        requiredError: "Please enter your email address.",
        invalidError: "Enter a valid email address.",
      },
      message: {
        label: "Message",
        placeholder: "Tell me about your project or opportunity",
        requiredError: "Please enter a message.",
      },
    },
    send: "Send message",
    sending: "Sending…",
    success: "Your message was sent successfully.",
    error: "The message could not be sent. Please try again.",
    emailLabel: "Email Issam Elghbali",
    linkedinLabel: "View Issam Elghbali’s LinkedIn profile",
    githubLabel: "View Issam Elghbali’s GitHub profile",
  },
  footer: {
    copyright: "© {year} Issam Elghbali.",
    rights: "All rights reserved.",
    navigationLabel: "Footer navigation",
  },
  breadcrumbs: {
    ariaLabel: "Breadcrumb",
    home: "Home",
    projects: "Projects",
    certifications: "Certifications",
    separatorLabel: "Next page",
  },
  notFound: {
    title: "Page not found",
    description: "The page you requested does not exist or is no longer available.",
    projectTitle: "Project not found",
    projectDescription: "The requested project does not exist in this portfolio.",
    backHome: "Return to the homepage",
    backToProjects: "Browse all projects",
  },
  chatbot: {
    title: "Issam Assistant",
    subtitle: "Portfolio guide",
    dialogLabel: "Issam’s AI Portfolio Assistant",
    open: "Open AI assistant",
    close: "Close AI assistant",
    inputPlaceholder: "Ask about Issam…",
    inputLabel: "Message for Issam’s AI assistant",
    send: "Send message",
    thinking: "Issam’s assistant is preparing a response",
    disclaimer: "Answers use only Issam’s documented portfolio and CV.",
    welcome:
      "Hi! I’m Issam’s AI Portfolio Assistant. Ask me about his experience, projects, skills, education, or certifications. My answers are based only on information documented in his portfolio and CV.",
    unavailable: "I couldn’t reach the assistant. Check your connection and try again.",
    suggestions: [
      "Tell me about Issam",
      "Show his best projects",
      "What are his main skills?",
      "Show his certifications",
    ],
    userMessageLabel: "Your message",
    assistantMessageLabel: "Assistant response",
    unreadOne: "1 unread assistant response",
    unreadMany: "{count} unread assistant responses",
    resources: {
      types: {
        project: "Project",
        certificate: "Certificate",
        pdf: "PDF",
        image: "Image",
        github: "GitHub",
        link: "Link",
      },
      actions: {
        project: "View project",
        certificate: "Verify certificate",
        pdf: "View CV",
        image: "View image",
        github: "Open GitHub",
        link: "Open link",
      },
    },
  },
  seo: {
    titleTemplate: "%s | Issam Elghbali",
    defaultTitle: "Issam Elghbali — Full-Stack Developer & Data Scientist",
    defaultDescription:
      "Portfolio of Issam Elghbali, a Full-Stack Developer and Data Scientist working with Java, Spring Boot, React, Python, and Machine Learning.",
    home: {
      title: "Full-Stack Developer & Data Scientist",
      description:
        "Explore Issam Elghbali’s Full-Stack, Data Science, and Machine Learning projects, technical skills, experience, and certifications.",
    },
    projects: {
      title: "Software & Data Science Projects",
      description:
        "Explore ten projects covering Spring Boot, React, Next.js, Data Science, Machine Learning, FastAPI, and enterprise software architecture.",
    },
    certifications: {
      title: "Data Science & Software Certifications",
      description:
        "View Issam Elghbali’s documented certifications in Python, Data Science, Machine Learning, Software Engineering, Spring, and Java.",
    },
    notFound: {
      title: "Page not found",
      description: "The requested portfolio page could not be found.",
    },
    openGraphImageAlt: "Issam Elghbali — Full-Stack Developer and Data Scientist",
  },
  accessibility: {
    decorativeImageAlt: "",
    mainContentLabel: "Main content",
    sectionNavigationLabel: "Portfolio sections",
    scrollTickerPaused: "Technology list paused",
    scrollTickerPlaying: "Technology list moving",
    currentPage: "Current page",
    errorPrefix: "Error:",
    successPrefix: "Success:",
  },
} as const satisfies PortfolioDictionary;

export default en;
