export const profile = {
  name: "Issam Elghbali",
  headline: "Full-Stack Developer & Data Scientist",
  summary:
    "Data Science Master's student with a strong foundation in Computer Science, focused on Machine Learning, Artificial Intelligence, and scalable software systems.",
  professionalFocus: [
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Software Engineering",
    "Scalable systems",
  ],
  about: [
    "I specialize in Machine Learning, Artificial Intelligence, and modern Software Engineering.",
    "My focus is on designing intelligent systems capable of solving real-world challenges through data-driven strategies and scalable architectures.",
    "Driven by curiosity and continuous learning, I aim to build impactful digital solutions that combine performance, innovation, and real-world value.",
  ],
  careerObjective:
    "Seeking a final-year project (PFE) in Data Science or Machine Learning to contribute to real-world data problems.",
  education: [
    {
      degree: "Master in Data Science",
      period: "2025 – Present",
      institution: "Faculty of Sciences and Techniques of Fez (FST Fez)",
      location: "Fez, Morocco",
      status: "In progress",
    },
    {
      degree: "Licence Sciences et Techniques — Computer Engineering",
      period: "2024 – 2025",
      institution: "Faculty of Sciences and Techniques of Fez (FST Fez)",
      location: "Fez, Morocco",
      status: "Completed",
    },
    {
      degree: "DEUST",
      period: "2022 – 2024",
      institution: "Faculty of Sciences and Techniques of Fez (FST Fez)",
      location: "Fez, Morocco",
      status: "Completed",
    },
  ],
  baccalaureate: {
    year: null,
    note: "The baccalaureate year is not documented in the portfolio or public CV.",
  },
  documentedExperience: [
    {
      role: "Full-Stack Developer Intern",
      organization: "École Polytechnique des Génies",
      year: "2025",
      duration: "2 months",
      location: "Fez, Morocco",
      work: [
        "Developed an internal resource management platform",
        "Designed REST APIs with Java and Spring Boot",
        "Integrated the user interface with React.js",
      ],
    },
  ],
  cvDocumentedProjects: [
    {
      title: "Customer Churn Prediction",
      domain: "Data Science / Machine Learning",
      technologies: ["Python", "Pandas", "Scikit-learn", "Machine Learning", "SHAP"],
      highlights: [
        "Exploratory analysis, data cleaning, and preparation",
        "Feature engineering and classification model training",
        "Model comparison using appropriate metrics",
        "Prediction interpretation with SHAP",
      ],
      note: "Documented in the public CV and also available as a complete portfolio project with its own repository.",
    },
    {
      title: "Intelligent Product Recommendation System",
      domain: "Data Science / Recommendation Systems",
      technologies: ["Python", "Pandas", "Scikit-learn", "Recommendation Systems"],
      highlights: [
        "Prepared and analyzed user, product, and interaction data",
        "Implemented content-based and collaborative filtering approaches",
        "Evaluated recommendation relevance",
      ],
      note: "Documented in the public CV; no separate project page or repository link is provided in the portfolio.",
    },
  ],
  cv: "/cv-issam_elghbali.pdf",
  contact: {
    phone: "06 20 68 83 40",
    email: "elghbaliissam1@gmail.com",
    github: "https://github.com/Elghbali01",
    linkedin: "https://www.linkedin.com/in/issam-elghbali-2937b6258/",
  },
  location: "Fès, Maroc",
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "Good" },
    { name: "English", level: "Basic" },
  ],
  cvTechnicalSkills: [
    "Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "EDA", "Data Cleaning",
    "Feature Engineering", "Classification", "Regression", "Clustering", "Cross-validation",
    "Hyperparameter optimization", "ROC-AUC", "SHAP", "Matplotlib", "Seaborn", "PostgreSQL",
    "MySQL", "Git", "GitHub", "REST API", "Model deployment", "Deep Learning fundamentals",
    "MLOps fundamentals",
  ],
  cvCertificationIds: [
    "supervised-ml-regression-classification",
    "python-data-science-ai",
    "kaggle-data-visualization",
  ],
} as const;
