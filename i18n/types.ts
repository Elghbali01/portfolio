import type { Locale, TextDirection } from "./config";

export const sectionIds = [
  "home",
  "about",
  "projects",
  "skills",
  "certifications",
  "experience",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const projectSlugs = [
  "indonesia-tourism",
  "resource-platform",
  "employee-management",
  "nosql-ml-redis",
  "personal-portfolio",
  "ticket-management-system",
  "resource-management-system",
  "water-potability-ml",
  "customer-churn-prediction",
  "football-intelligence-player-recommendation-system",
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

export const certificationIds = [
  "python-data-science-ai",
  "supervised-ml-regression-classification",
  "introduction-to-software-engineering",
  "cs250-python-for-data-scientists",
  "the-data-science-profession",
  "spring-ecosystem-and-core",
  "introduction-to-machine-learning",
  "java-explorer",
  "python-for-machine-learning",
  "kaggle-data-visualization",
] as const;

export type CertificationId = (typeof certificationIds)[number];

export const experienceIds = [
  "master-data-science",
  "software-engineering-internship",
  "computer-engineering-licence",
  "deust",
] as const;

export type ExperienceId = (typeof experienceIds)[number];

export type PluralForms = {
  zero: string;
  one: string;
  two: string;
  few: string;
  many: string;
  other: string;
};

export type PageSeo = {
  /** Page-specific title without the site-name suffix from seo.titleTemplate. */
  title: string;
  description: string;
};

export type CaseStudyMetric = {
  label: string;
  value: string;
};

export type CaseStudySection = {
  id: string;
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
  metrics?: readonly CaseStudyMetric[];
};

export type ProjectTranslation = {
  title: string;
  category: string;
  shortDescription: string;
  imageAlt: string;
  seo: PageSeo;
  introduction: readonly string[];
  caseStudy: readonly CaseStudySection[];
};

export type RenderableCaseStudyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] };

/**
 * Serializable content shape accepted structurally by ProjectCaseStudy.
 * It intentionally contains data only, so it can cross a Server/Client boundary.
 */
export type RenderableCaseStudy = {
  lang: string;
  dir: TextDirection;
  technologyTerms: readonly string[];
  introduction: readonly RenderableCaseStudyBlock[];
  sections: readonly {
    id: string;
    heading: string;
    blocks: readonly RenderableCaseStudyBlock[];
  }[];
};

export type CertificationTranslation = {
  title: string;
  issuer: string;
  imageAlt: string;
};

export type ExperienceTranslation = {
  title: string;
  period: string;
  institution: string;
  location: string;
  duration?: string;
  description: string;
  typeLabel: string;
};

export type PortfolioDictionary = {
  locale: Locale;
  direction: TextDirection;
  localeName: string;
  common: {
    siteName: string;
    portfolioOwner: string;
    skipToContent: string;
    loading: string;
    close: string;
    back: string;
    previous: string;
    next: string;
    opensInNewTab: string;
    externalLink: string;
    download: string;
    notAvailable: string;
  };
  loader: {
    tagline: string;
  };
  navigation: {
    ariaLabel: string;
    brandLabel: string;
    sections: Record<SectionId, string>;
    openMenu: string;
    closeMenu: string;
    menuLabel: string;
  };
  languageSwitcher: {
    label: string;
    currentLanguage: string;
    changeLanguage: string;
  };
  hero: {
    greeting: string;
    name: string;
    stableHeadline: string;
    rotatingRoles: readonly string[];
    profileImageAlt: string;
    viewProjects: string;
    contactMe: string;
    downloadCv: string;
    linkedinLabel: string;
    githubLabel: string;
  };
  about: {
    titleLead: string;
    titleAccent: string;
    summary: string;
    paragraphs: readonly string[];
    focusAreas: readonly {
      id: "artificial-intelligence" | "data-science" | "software-engineering";
      title: string;
      description: string;
    }[];
  };
  skills: {
    titleLead: string;
    titleAccent: string;
    description: string;
    developerTitle: string;
    developerDescription: string;
    dataScientistTitle: string;
    dataScientistDescription: string;
    technologiesLabel: string;
    categories: {
      development: string;
      dataScience: string;
      aiMachineLearning: string;
    };
    tickerInstructions: string;
  };
  experience: {
    titleLead: string;
    titleAccent: string;
    description: string;
    timelineLabel: string;
    items: Record<ExperienceId, ExperienceTranslation>;
  };
  projects: {
    section: {
      titleLead: string;
      titleAccent: string;
      description: string;
      viewAll: string;
    };
    listing: {
      titleLead: string;
      titleAccent: string;
      description: string;
      count: PluralForms;
      backToPortfolio: string;
      collectionLabel: string;
    };
    card: {
      githubProfile: string;
      githubRepository: string;
      viewDetails: string;
      viewDetailsFor: string;
      technologiesLabel: string;
    };
    detail: {
      backToProjects: string;
      githubProfile: string;
      githubRepository: string;
      projectImageLabel: string;
      technologiesHeading: string;
      caseStudyHeading: string;
    };
    items: Record<ProjectSlug, ProjectTranslation>;
  };
  certifications: {
    section: {
      titleLead: string;
      titleAccent: string;
      description: string;
      viewAll: string;
    };
    listing: {
      titleLead: string;
      titleAccent: string;
      description: string;
      count: PluralForms;
      backToPortfolio: string;
      collectionLabel: string;
    };
    card: {
      preview: string;
      previewCertificate: string;
      verify: string;
      verifyCertificate: string;
      viewOnLinkedIn: string;
      downloadCertificate: string;
    };
    modal: {
      dialogLabel: string;
      closePreview: string;
      close: string;
      imageLabel: string;
    };
    items: Record<CertificationId, CertificationTranslation>;
  };
  contact: {
    titleLead: string;
    titleAccent: string;
    description: string;
    formLabel: string;
    fields: {
      name: { label: string; placeholder: string; requiredError: string };
      email: {
        label: string;
        placeholder: string;
        requiredError: string;
        invalidError: string;
      };
      message: { label: string; placeholder: string; requiredError: string };
    };
    send: string;
    sending: string;
    success: string;
    error: string;
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
  };
  footer: {
    copyright: string;
    rights: string;
    navigationLabel: string;
  };
  breadcrumbs: {
    ariaLabel: string;
    home: string;
    projects: string;
    certifications: string;
    separatorLabel: string;
  };
  notFound: {
    title: string;
    description: string;
    projectTitle: string;
    projectDescription: string;
    backHome: string;
    backToProjects: string;
  };
  chatbot: {
    title: string;
    subtitle: string;
    dialogLabel: string;
    open: string;
    close: string;
    inputPlaceholder: string;
    inputLabel: string;
    send: string;
    thinking: string;
    disclaimer: string;
    welcome: string;
    unavailable: string;
    suggestions: readonly string[];
    userMessageLabel: string;
    assistantMessageLabel: string;
    unreadOne: string;
    unreadMany: string;
    resources: {
      types: {
        project: string;
        certificate: string;
        pdf: string;
        image: string;
        github: string;
        link: string;
      };
      actions: {
        project: string;
        certificate: string;
        pdf: string;
        image: string;
        github: string;
        link: string;
      };
    };
  };
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    home: PageSeo;
    projects: PageSeo;
    certifications: PageSeo;
    notFound: PageSeo;
    openGraphImageAlt: string;
  };
  accessibility: {
    decorativeImageAlt: "";
    mainContentLabel: string;
    sectionNavigationLabel: string;
    scrollTickerPaused: string;
    scrollTickerPlaying: string;
    currentPage: string;
    errorPrefix: string;
    successPrefix: string;
  };
};

export type Dictionary = PortfolioDictionary;
