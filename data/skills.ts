// Skills data organized by category for the Technical Arsenal section

export type Skill = {
  name: string;
  color: string; // brand color for the icon
  iconUrl: string; // devicon SVG URL or similar
};

const postgreSqlSkill: Skill = {
  name: "PostgreSQL",
  color: "#336791",
  iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
};

const modelEvaluationSkill: Skill = {
  name: "Model Evaluation",
  color: "#F39C12",
  iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
};

// ─── Development Skills ──────────────────────────────────────────────────────
export const devSkills: Skill[] = [
  {
    name: "Java",
    color: "#ED8B00",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "Spring Framework",
    color: "#6DB33F",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  },
  {
    name: "Spring Boot",
    color: "#6DB33F",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  },
  {
    name: "Spring MVC",
    color: "#6DB33F",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  },
  {
    name: "Spring Security",
    color: "#6DB33F",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  },
  {
    name: "Spring Data JPA",
    color: "#6DB33F",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  },
  {
    name: "Spring Cloud",
    color: "#6DB33F",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  },
  {
    name: "Hibernate",
    color: "#59666C",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hibernate/hibernate-original.svg",
  },
  {
    name: "Maven",
    color: "#C71A36",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg",
  },
  {
    name: "JDBC",
    color: "#ED8B00",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "REST API",
    color: "#009688",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },
  postgreSqlSkill,
  {
    name: "MySQL",
    color: "#4479A1",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "Redis",
    color: "#DC382D",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  {
    name: "Docker",
    color: "#2496ED",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "Docker Compose",
    color: "#2496ED",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "Git",
    color: "#F05032",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "GitHub",
    color: "#FFFFFF",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  {
    name: "GitHub Actions",
    color: "#2088FF",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg",
  },
  {
    name: "React",
    color: "#61DAFB",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "TypeScript",
    color: "#3178C6",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "JavaScript",
    color: "#F7DF1E",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "HTML5",
    color: "#E34F26",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    color: "#1572B6",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "Tailwind CSS",
    color: "#06B6D4",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Bootstrap",
    color: "#7952B3",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  },
  {
    name: "JUnit 5",
    color: "#25A162",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/junit/junit-original.svg",
  },
  {
    name: "Mockito",
    color: "#78A641",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "MockMvc",
    color: "#6DB33F",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  },
  {
    name: "Microservices",
    color: "#1BA0D8",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
];

// ─── Data Science Skills ─────────────────────────────────────────────────────
export const dataSkills: Skill[] = [
  {
    name: "Python",
    color: "#3776AB",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "NumPy",
    color: "#013243",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  {
    name: "Pandas",
    color: "#150458",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  {
    name: "SQL",
    color: "#336791",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg",
  },
  postgreSqlSkill,
  {
    name: "Matplotlib",
    color: "#11557C",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg",
  },
  {
    name: "Seaborn",
    color: "#4C72B0",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Scikit-Learn",
    color: "#F7931E",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "SciPy",
    color: "#8CAAE6",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Statsmodels",
    color: "#4C72B0",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Jupyter Notebook",
    color: "#F37626",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
  },
  {
    name: "Data Analysis",
    color: "#2ECC71",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  {
    name: "Data Cleaning",
    color: "#1ABC9C",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  {
    name: "Data Visualization",
    color: "#E74C3C",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg",
  },
  {
    name: "Exploratory Data Analysis (EDA)",
    color: "#3498DB",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
  },
  {
    name: "Feature Engineering",
    color: "#E67E22",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Statistics",
    color: "#9B59B6",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  {
    name: "Probability",
    color: "#8E44AD",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  modelEvaluationSkill,
  {
    name: "FastAPI",
    color: "#009688",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },
  {
    name: "Pydantic",
    color: "#E92063",
    iconUrl: "https://cdn.simpleicons.org/pydantic/E92063",
  },
  {
    name: "Uvicorn",
    color: "#2ECC71",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Postman",
    color: "#FF6C37",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  },
  {
    name: "Pytest",
    color: "#0A9EDC",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytest/pytest-original.svg",
  },
  {
    name: "MLflow",
    color: "#0194E2",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "DVC",
    color: "#945DD6",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Apache Spark",
    color: "#E25A1C",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg",
  },
  {
    name: "PySpark",
    color: "#E25A1C",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg",
  },
  {
    name: "Airflow",
    color: "#017CEE",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg",
  },
  {
    name: "Prefect",
    color: "#024DFD",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
];

// ─── AI / Machine Learning Skills ────────────────────────────────────────────
export const aiSkills: Skill[] = [
  {
    name: "Machine Learning",
    color: "#FF6F00",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "Deep Learning",
    color: "#FF6F00",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "Supervised Learning",
    color: "#3498DB",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Unsupervised Learning",
    color: "#1ABC9C",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Reinforcement Learning",
    color: "#7D3C98",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Classification",
    color: "#E67E22",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Regression",
    color: "#2980B9",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Clustering",
    color: "#27AE60",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Decision Trees",
    color: "#8E44AD",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Random Forest",
    color: "#16A085",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Gradient Boosting",
    color: "#2ECC71",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "XGBoost",
    color: "#EC4E20",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "LightGBM",
    color: "#02569B",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "CatBoost",
    color: "#FFCC00",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Support Vector Machine (SVM)",
    color: "#D35400",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "K-Nearest Neighbors (KNN)",
    color: "#C0392B",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Naive Bayes",
    color: "#2C3E50",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Logistic Regression",
    color: "#3498DB",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Linear Regression",
    color: "#1ABC9C",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Neural Networks",
    color: "#FF6F00",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "TensorFlow",
    color: "#FF6F00",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "Keras",
    color: "#D00000",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg",
  },
  {
    name: "Model Training",
    color: "#F39C12",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  modelEvaluationSkill,
  {
    name: "Cross Validation",
    color: "#2C3E50",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Hyperparameter Tuning",
    color: "#7D3C98",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Data Preprocessing",
    color: "#17A589",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  {
    name: "Feature Selection",
    color: "#E67E22",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Dimensionality Reduction",
    color: "#8E44AD",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "PCA",
    color: "#9B59B6",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "Model Deployment",
    color: "#2ECC71",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
];

export type SkillDomainId =
  | "backend-engineering"
  | "frontend-engineering"
  | "data-science"
  | "ai-machine-learning";

export type SkillKind = "technology" | "practice" | "method";
export type SkillSourceCategory = "development" | "data-science" | "ai-machine-learning";

export interface TechnicalSkill extends Skill {
  /** Stable URL-safe key derived from the unchanged display name. */
  id: string;
  domains: readonly SkillDomainId[];
  sourceCategories: readonly SkillSourceCategory[];
  kind: SkillKind;
}

const frontendNames = new Set([
  "React",
  "TypeScript",
  "JavaScript",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "Bootstrap",
]);

const sharedDomainMemberships: Partial<Record<string, readonly SkillDomainId[]>> = {
  "Git": ["backend-engineering", "frontend-engineering", "data-science", "ai-machine-learning"],
  "GitHub": ["backend-engineering", "frontend-engineering", "data-science", "ai-machine-learning"],
  "GitHub Actions": ["backend-engineering", "frontend-engineering", "data-science", "ai-machine-learning"],
  "REST API": ["backend-engineering", "frontend-engineering"],
  "Python": ["data-science", "ai-machine-learning"],
  "NumPy": ["data-science", "ai-machine-learning"],
  "Pandas": ["data-science", "ai-machine-learning"],
  "Scikit-Learn": ["data-science", "ai-machine-learning"],
  "SQL": ["backend-engineering", "data-science"],
  "PostgreSQL": ["backend-engineering", "data-science"],
  "Docker": ["backend-engineering", "ai-machine-learning"],
  "FastAPI": ["backend-engineering", "data-science", "ai-machine-learning"],
  "Pydantic": ["backend-engineering", "ai-machine-learning"],
  "Uvicorn": ["backend-engineering", "ai-machine-learning"],
  "Postman": ["backend-engineering"],
  "Pytest": ["backend-engineering", "ai-machine-learning"],
  "MLflow": ["data-science", "ai-machine-learning"],
  "DVC": ["data-science", "ai-machine-learning"],
  "Feature Engineering": ["data-science", "ai-machine-learning"],
  "Model Evaluation": ["data-science", "ai-machine-learning"],
  "Model Training": ["data-science", "ai-machine-learning"],
  "Cross Validation": ["data-science", "ai-machine-learning"],
  "Data Preprocessing": ["data-science", "ai-machine-learning"],
  "Feature Selection": ["data-science", "ai-machine-learning"],
  "Dimensionality Reduction": ["data-science", "ai-machine-learning"],
  "PCA": ["data-science", "ai-machine-learning"],
  "Model Deployment": ["backend-engineering", "ai-machine-learning"],
};

const practiceNames = new Set([
  "Data Analysis",
  "Data Cleaning",
  "Data Visualization",
  "Exploratory Data Analysis (EDA)",
  "Feature Engineering",
  "Statistics",
  "Probability",
  "Model Evaluation",
  "Model Training",
  "Cross Validation",
  "Hyperparameter Tuning",
  "Data Preprocessing",
  "Feature Selection",
  "Dimensionality Reduction",
  "Model Deployment",
  "Microservices",
]);

const methodNames = new Set([
  "Machine Learning",
  "Deep Learning",
  "Supervised Learning",
  "Unsupervised Learning",
  "Reinforcement Learning",
  "Classification",
  "Regression",
  "Clustering",
  "Decision Trees",
  "Random Forest",
  "Gradient Boosting",
  "XGBoost",
  "LightGBM",
  "CatBoost",
  "Support Vector Machine (SVM)",
  "K-Nearest Neighbors (KNN)",
  "Naive Bayes",
  "Logistic Regression",
  "Linear Regression",
  "Neural Networks",
  "PCA",
]);

const skillSources: readonly { category: SkillSourceCategory; skills: readonly Skill[] }[] = [
  { category: "development", skills: devSkills },
  { category: "data-science", skills: dataSkills },
  { category: "ai-machine-learning", skills: aiSkills },
];

function toStableSkillId(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

function getSkillDomains(name: string, sources: readonly SkillSourceCategory[]): SkillDomainId[] {
  const domains = new Set<SkillDomainId>();
  for (const source of sources) {
    if (source === "development") {
      domains.add(frontendNames.has(name) ? "frontend-engineering" : "backend-engineering");
    } else if (source === "data-science") {
      domains.add("data-science");
    } else {
      domains.add("ai-machine-learning");
    }
  }
  for (const domain of sharedDomainMemberships[name] ?? []) domains.add(domain);
  return [...domains];
}

function getSkillKind(name: string): SkillKind {
  if (practiceNames.has(name)) return "practice";
  if (methodNames.has(name)) return "method";
  return "technology";
}

const canonicalSkillMap = new Map<string, { skill: Skill; sources: Set<SkillSourceCategory> }>();
for (const source of skillSources) {
  for (const skill of source.skills) {
    const existing = canonicalSkillMap.get(skill.name);
    if (existing) {
      existing.sources.add(source.category);
    } else {
      canonicalSkillMap.set(skill.name, { skill, sources: new Set([source.category]) });
    }
  }
}

/** Canonical inventory. Repeated source entries retain all category memberships. */
export const technicalSkills: TechnicalSkill[] = [...canonicalSkillMap.entries()].map(
  ([name, entry]) => ({
    ...entry.skill,
    id: toStableSkillId(name),
    domains: getSkillDomains(name, [...entry.sources]),
    sourceCategories: [...entry.sources],
    kind: getSkillKind(name),
  }),
);

export const skillDomainIds: readonly SkillDomainId[] = [
  "backend-engineering",
  "frontend-engineering",
  "data-science",
  "ai-machine-learning",
];

// Legacy export for backward compatibility; duplicate entries remain represented.
export const skills = [...devSkills, ...dataSkills, ...aiSkills];
