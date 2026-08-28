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
  /** Path to a downloadable image when no PDF exists — null for most certs */
  downloadImage: string | null;
  /** External URL (e.g. LinkedIn) — null for normal downloadable certs */
  externalUrl: string | null;
  /** Official credential page used by the Certifications UI; local files remain separate. */
  verificationUrl: string | null;
  /** "download" → has local PDF  |  "download-image" → download PNG  |  "external" → opens external link */
  actionType: "download" | "download-image" | "external";
  /** If true the cert appears in the homepage preview (max 3) */
  featured: boolean;
};

export interface CertificationKnowledge {
  domain: "data-science" | "machine-learning" | "software-engineering" | "backend-java";
  skillsCovered: string[];
  relevance: string;
}

export const certificationKnowledge: Record<string, CertificationKnowledge> = {
  "python-data-science-ai": { domain: "data-science", skillsCovered: ["Python", "Data Science", "AI development"], relevance: "Directly relevant to Python-based Data Science work." },
  "supervised-ml-regression-classification": { domain: "machine-learning", skillsCovered: ["Supervised learning", "Regression", "Classification"], relevance: "Strong evidence of core supervised Machine Learning foundations." },
  "introduction-to-software-engineering": { domain: "software-engineering", skillsCovered: ["Software Engineering fundamentals"], relevance: "Supports general software engineering foundations." },
  "cs250-python-for-data-scientists": { domain: "data-science", skillsCovered: ["Python", "Data Science programming"], relevance: "Relevant evidence of Python usage for Data Science." },
  "the-data-science-profession": { domain: "data-science", skillsCovered: ["Data Science profession"], relevance: "Demonstrates familiarity with the professional Data Science field." },
  "spring-ecosystem-and-core": { domain: "backend-java", skillsCovered: ["Spring Framework", "Spring Core"], relevance: "Directly relevant to Java and Spring backend roles." },
  "introduction-to-machine-learning": { domain: "machine-learning", skillsCovered: ["Machine Learning fundamentals"], relevance: "Relevant foundation for Machine Learning roles." },
  "java-explorer": { domain: "backend-java", skillsCovered: ["Java foundations"], relevance: "Supports documented Java knowledge for backend development." },
  "python-for-machine-learning": { domain: "machine-learning", skillsCovered: ["Python", "Machine Learning"], relevance: "Directly relevant to Python-based Machine Learning workflows." },
  "kaggle-data-visualization": { domain: "data-science", skillsCovered: ["Data Visualization"], relevance: "Relevant to communicating and exploring Data Science results." },
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
    downloadImage: null,
    externalUrl: null,
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/5PD92AQ5G8AB",
    actionType: "download",
    featured: true,
  },
  {
    id: "supervised-ml-regression-classification",
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "DeepLearning.AI (via Coursera)",
    date: "July 27, 2026",
    ...makePaths("Supervised_ML_Regression_Classification"),
    downloadImage: null,
    externalUrl: null,
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/VPFDGE72YVO3",
    actionType: "download",
    featured: true,
  },
  {
    id: "introduction-to-software-engineering",
    title: "Introduction to Software Engineering",
    issuer: "IBM (via Coursera)",
    date: "July 8, 2026",
    ...makePaths("Introduction_to_Software_Engineering"),
    downloadImage: null,
    externalUrl: null,
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/8PZB8OR69SKL",
    actionType: "download",
    featured: true,
  },

  // ── Other certifications ─────────────────────────────────────────────
  {
    id: "cs250-python-for-data-scientists",
    title: "CS250: Python for Data Scientists",
    issuer: "Saylor Academy",
    ...makePaths("CS250_Python_for_dataScientist"),
    downloadImage: null,
    externalUrl: null,
    verificationUrl: "https://learn.saylor.org/admin/tool/certificate/index.php?code=6370028377IE",
    actionType: "download",
    featured: false,
  },
  {
    id: "the-data-science-profession",
    title: "The Data Science Profession",
    issuer: "University of London (via Coursera)",
    date: "July 14, 2026",
    ...makePaths("The_Data_Science_Profession"),
    downloadImage: null,
    externalUrl: null,
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/TSI91CN3RIBW",
    actionType: "download",
    featured: false,
  },
  {
    id: "spring-ecosystem-and-core",
    title: "Spring — Ecosystem and Core",
    issuer: "LearnQuest (via Coursera)",
    date: "July 10, 2026",
    ...makePaths("Spring_Ecosystem_and_Core"),
    downloadImage: null,
    externalUrl: null,
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/RJS8ZM9CM5OH",
    actionType: "download",
    featured: false,
  },
  {
    id: "introduction-to-machine-learning",
    title: "Introduction to Machine Learning",
    issuer: "Duke University (via Coursera)",
    date: "July 8, 2026",
    ...makePaths("Introduction_to_Machine_Learning"),
    downloadImage: null,
    externalUrl: null,
    verificationUrl: "https://www.coursera.org/account/accomplishments/verify/DIR3KBKUA04I",
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
    downloadImage: null,
    externalUrl:
      "https://www.linkedin.com/posts/issam-elghbali-2937b6258_oracle-java-foundations-activity-7415090851426562048-TlQ-",
    verificationUrl: null,
    actionType: "external",
    featured: false,
  },
  {
    id: "python-for-machine-learning",
    title: "Python for Machine Learning",
    issuer: "SimpliLearn",
    ...makePaths("SimpliLearn_python_for_ML"),
    downloadImage: null,
    externalUrl: null,
    verificationUrl: "https://simpli-web.app.link/e/tKHj0iYsz5b",
    actionType: "download",
    featured: false,
  },
  {
    // Special case — PNG only, no PDF available
    id: "kaggle-data-visualization",
    title: "Data Visualization",
    issuer: "Kaggle",
    image: "/certificate-images/Kaglle_data_vis.png",
    pdf: null,
    downloadImage: "/certificates/Kaglle_data_vis.png",
    externalUrl: null,
    verificationUrl: "https://www.kaggle.com/learn/certification/issamelghbali/data-visualization",
    actionType: "download-image",
    featured: false,
  },
];

// ---------------------------------------------------------------------------
// Derived lists (used by components — avoids filtering in render)
// ---------------------------------------------------------------------------
export const featuredCertifications = certifications.filter((c) => c.featured);
