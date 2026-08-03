// Certifications data — single source of truth for the homepage and /certifications page.
//
// Convention:
//   image  → /certificate-images/<baseName>.png
//   pdf    → /certificates/<baseName>.pdf
//
// The helper `makePaths` builds both paths from one base name so you never
// duplicate strings.  For edge-cases (Oracle) the paths are set manually.

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  /** Path to the PNG thumbnail in /public/certificate-images/ */
  image: string;
  /** Path to the downloadable PDF in /public/certificates/ — null when no local PDF exists */
  pdf: string | null;
  /** External URL (e.g. LinkedIn) — null for normal downloadable certs */
  externalUrl: string | null;
  /** "download" → has local PDF  |  "external" → opens external link */
  actionType: "download" | "external";
  /** If true the cert appears in the homepage preview (max 3) */
  featured: boolean;
};

// ---------------------------------------------------------------------------
// Helper — avoids repeating /certificate-images/ and /certificates/ manually
// ---------------------------------------------------------------------------
function makePaths(baseName: string) {
  return {
    image: `/certificate-images/${baseName}.png`,
    pdf: `/certificates/${baseName}.pdf`,
  };
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
export const certifications: Certification[] = [
  // ── Featured certifications (shown on homepage) ──────────────────────
  {
    id: "python-data-science-ai",
    title: "Python for Data Science, AI & Development",
    issuer: "IBM (via Coursera)",
    date: "July 15, 2026",
    ...makePaths("Python_for_Data_Science_AI"),
    externalUrl: null,
    actionType: "download",
    featured: true,
  },
  {
    id: "supervised-ml-regression-classification",
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "DeepLearning.AI (via Coursera)",
    date: "July 27, 2026",
    ...makePaths("Supervised_ML_Regression_Classification"),
    externalUrl: null,
    actionType: "download",
    featured: true,
  },
  {
    id: "introduction-to-software-engineering",
    title: "Introduction to Software Engineering",
    issuer: "IBM (via Coursera)",
    date: "July 8, 2026",
    ...makePaths("Introduction_to_Software_Engineering"),
    externalUrl: null,
    actionType: "download",
    featured: true,
  },

  // ── Other certifications ─────────────────────────────────────────────
  {
    id: "cs250-python-for-data-scientists",
    title: "CS250: Python for Data Scientists",
    issuer: "Saylor Academy",
    ...makePaths("CS250_Python_for_dataScientist"),
    externalUrl: null,
    actionType: "download",
    featured: false,
  },
  {
    id: "the-data-science-profession",
    title: "The Data Science Profession",
    issuer: "University of London (via Coursera)",
    date: "July 14, 2026",
    ...makePaths("The_Data_Science_Profession"),
    externalUrl: null,
    actionType: "download",
    featured: false,
  },
  {
    id: "spring-ecosystem-and-core",
    title: "Spring — Ecosystem and Core",
    issuer: "LearnQuest (via Coursera)",
    date: "July 10, 2026",
    ...makePaths("Spring_Ecosystem_and_Core"),
    externalUrl: null,
    actionType: "download",
    featured: false,
  },
  {
    id: "introduction-to-machine-learning",
    title: "Introduction to Machine Learning",
    issuer: "Duke University (via Coursera)",
    date: "July 8, 2026",
    ...makePaths("Introduction_to_Machine_Learning"),
    externalUrl: null,
    actionType: "download",
    featured: false,
  },
  {
    // Special case — no local PDF, external LinkedIn link only
    id: "java-explorer",
    title: "Java Explorer",
    issuer: "Oracle",
    image: "/certificate-images/Oracle.png",
    pdf: null,
    externalUrl:
      "https://www.linkedin.com/posts/issam-elghbali-2937b6258_oracle-java-foundations-activity-7415090851426562048-TlQ-",
    actionType: "external",
    featured: false,
  },
  {
    id: "python-for-machine-learning",
    title: "Python for Machine Learning",
    issuer: "SimpliLearn",
    ...makePaths("SimpliLearn_python_for_ML"),
    externalUrl: null,
    actionType: "download",
    featured: false,
  },
];

// ---------------------------------------------------------------------------
// Derived lists (used by components — avoids filtering in render)
// ---------------------------------------------------------------------------
export const featuredCertifications = certifications.filter((c) => c.featured);
