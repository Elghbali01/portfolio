// Certifications data for the Certifications section

export type Certification = {
  name: string;
  issuer: string; // e.g. "IBM (via Coursera)"
  date?: string; // e.g. "July 8, 2026"
  duration?: string; // e.g. "~14 hours"
  score?: string; // e.g. "91.30%"
  verified?: boolean; // whether verified
  skills?: string[]; // skill tags
  pdfPath?: string; // local PDF path in /certificates/
  externalLink?: string; // external URL (LinkedIn, etc.)
  actionLabel: string; // button text: "Download" or "View"
};

export const certifications: Certification[] = [
  {
    name: "Python for Data Science, AI & Development",
    issuer: "IBM (via Coursera)",
    date: "July 15, 2026",
    duration: "~24 hours",
    score: "86.25%",
    skills: [
      "Data Collection",
      "Data Analysis",
      "Python Programming",
      "Scripting",
      "NumPy",
      "Data Import/Export",
    ],
    pdfPath: "/certificates/Python_for_Data_Science_AI.pdf",
    actionLabel: "Download",
  },
  {
    name: "The Data Science Profession",
    issuer: "University of London (via Coursera)",
    date: "July 14, 2026",
    duration: "~4 hours",
    score: "100%",
    skills: [
      "Data Science",
      "Data Literacy",
      "Machine Learning",
      "Applied Machine Learning",
      "Machine Learning Algorithms",
      "Unsupervised Learning",
    ],
    pdfPath: "/certificates/The_Data_Science_Profession.pdf",
    actionLabel: "Download",
  },
  {
    name: "Spring - Ecosystem and Core",
    issuer: "LearnQuest (via Coursera)",
    date: "July 10, 2026",
    duration: "~11 hours",
    score: "94.95%",
    skills: [
      "Integration Testing",
      "Configuration Management",
      "Unit Testing",
      "Application Frameworks",
      "Context Management",
      "JUnit",
      "Java Programming",
      "XML",
      "Development Environment",
      "Enterprise Application Management",
      "Spring Framework",
    ],
    pdfPath: "/certificates/Spring_Ecosystem_and_Core.pdf",
    actionLabel: "Download",
  },
  {
    name: "Introduction to Software Engineering",
    issuer: "IBM (via Coursera)",
    date: "July 8, 2026",
    duration: "~14 hours",
    score: "91.30%",
    skills: [
      "Development Environment",
      "Software Design",
      "Software Development",
      "Software Development Tools",
      "Full-Stack Web Development",
      "Web Applications",
      "Python Programming",
      "UML",
      "Web Development",
      "Software Design Patterns",
      "Back-End Web Development",
    ],
    pdfPath: "/certificates/Introduction_to_Software_Engineering.pdf",
    actionLabel: "Download",
  },
  {
    name: "Introduction to Machine Learning",
    issuer: "Duke University (via Coursera)",
    date: "July 8, 2026",
    duration: "~25 hours",
    score: "89%",
    skills: [
      "Applied Machine Learning",
      "Python Programming",
      "Unsupervised Learning",
      "Supervised Learning",
      "Reinforcement Learning",
      "Image Analysis",
      "Model Training",
      "Transfer Learning",
      "Artificial Neural Networks",
      "Natural Language Processing",
      "Model Optimization",
      "Convolutional Neural Networks",
    ],
    pdfPath: "/certificates/Introduction_to_Machine_Learning.pdf",
    actionLabel: "Download",
  },
  {
    name: "Java Explorer",
    issuer: "Oracle",
    score: "95%",
    skills: [
      "Java Programming",
      "Object-Oriented Programming (OOP)",
      "Code Design",
      "Error Handling",
      "Clean Code",
      "Cloud Environments",
    ],
    externalLink:
      "https://www.linkedin.com/posts/issam-elghbali-2937b6258_oracle-java-foundations-activity-7415090851426562048-TlQ-",
    actionLabel: "View",
  },
];
