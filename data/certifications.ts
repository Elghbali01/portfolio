// Certifications data for the Certifications section

export type Certification = {
  name: string;
  issuer: string; // e.g. "IBM (via Coursera)"
  date?: string; // e.g. "July 8, 2026"
  duration?: string; // e.g. "~14 hours"
  score?: string; // e.g. "91.30%"
  pdfPath?: string; // local PDF path in /certificates/
  externalLink?: string; // external URL (LinkedIn, etc.)
  actionLabel: string; // button text: "Download" or "View"
};

export const certifications: Certification[] = [
  {
    name: "Introduction to Software Engineering",
    issuer: "IBM (via Coursera)",
    date: "July 8, 2026",
    duration: "~14 hours",
    score: "91.30%",
    pdfPath: "/certificates/Introduction_to_Software_Engineering.pdf",
    actionLabel: "Download",
  },
  {
    name: "Introduction to Machine Learning",
    issuer: "Duke University (via Coursera)",
    date: "July 8, 2026",
    duration: "~25 hours",
    score: "89%",
    pdfPath: "/certificates/Introduction_to_Machine_Learning.pdf",
    actionLabel: "Download",
  },
  {
    name: "Java Explorer",
    issuer: "Oracle",
    score: "95%",
    externalLink:
      "https://www.linkedin.com/posts/issam-elghbali-2937b6258_oracle-java-foundations-activity-7415090851426562048-TlQ-",
    actionLabel: "View",
  },
];
