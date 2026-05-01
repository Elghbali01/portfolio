export interface Project {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  github: string;
  demo?: string; // optionnel
  image: string;
}

export const projects: Project[] = [
  {
    title: "Indonesia Tourism Website",
    slug: "indonesia-tourism",
    category: "Frontend / Web Development",
    shortDescription:
      "A static tourism website showcasing Indonesia's culture, destinations, and travel attractions.",
    fullDescription: `
This project is a tourism-focused landing website dedicated to Indonesia.

The goal was to design and structure an informative and visually engaging website presenting the country's culture, landmarks, and travel experiences.

The website includes:
- Landing hero section
- Destination highlights
- Cultural presentation
- Image gallery
- Contact section

The project focuses on front-end structure, responsive design, and dynamic interaction using JavaScript.
    `,
    technologies: ["HTML", "CSS", "JavaScript", "PHP"],
    github: "https://github.com/Elghbali01",
    image: "/indonesia.png",
  },

  {
    title: "Academic Resource Management Platform",
    slug: "resource-platform",
    category: "Fullstack Application",
    shortDescription:
      "A fullstack platform that allows professors to share and manage academic resources with students.",
    fullDescription: `
This project is a fullstack academic resource management system designed for educational institutions.

It allows:
- Professors to upload and manage course materials
- Students to access and download resources
- Organized classification of materials by subject
- Secure authentication system

The backend was developed using Spring Boot, while the frontend was built with React.js to provide a modern and dynamic user experience.

This project demonstrates:
- REST API development
- Authentication handling
- Fullstack architecture
- React state management
    `,
    technologies: ["React.js", "Spring Boot", "REST API"],
    github: "https://github.com/Elghbali01",
    image: "/platform.png",
  },

  {
    title: "Employee & Salary Management System",
    slug: "employee-management",
    category: "Enterprise Web Application",
    shortDescription:
      "A 3-tier MVC web application to manage employees, supervisors, and salary operations.",
    fullDescription: `
This project is a 3-tier MVC enterprise web application developed using Spring Boot and Thymeleaf.

It includes:
- Employee management (CRUD)
- Supervisor management
- Salary management
- Role-based authentication (Director, Supervisor, Employee)

The system follows a layered architecture:
- Controller Layer
- Service Layer
- Repository Layer
    `,
    technologies: ["Spring Boot", "Thymeleaf", "JDBC", "MySQL"],
    github: "https://github.com/Elghbali01",
    image: "/employee.png",
  },

  {
    title: "NoSQL & Machine Learning Football Prediction System",
    slug: "nosql-ml-redis",
    category: "Data Engineering / Machine Learning",
    shortDescription:
      "A complete ML architecture combining Redis, model training, API prediction, and React frontend.",
    fullDescription: `
This project demonstrates a complete architecture integrating:
- Redis (NoSQL database)
- Machine Learning model training
- REST API prediction
- React frontend interface
    `,
    technologies: [
      "Python",
      "Redis",
      "Machine Learning",
      "REST API",
      "React.js",
    ],
    github: "https://github.com/Elghbali01/nosql-ml-project",
    image: "/redis-ml.png",
  },

  {
    title: "Personal Portfolio Website",
    slug: "personal-portfolio",
    category: "Frontend / Fullstack",
    shortDescription:
      "A modern developer portfolio built with Next.js and Tailwind CSS to showcase projects, skills, and experience.",
    fullDescription: `
This project represents my personal developer portfolio built using modern web technologies.

The goal was to create a visually engaging, responsive, and scalable portfolio website that highlights my projects, technical skills, and professional journey.

Key features include:
- Animated landing page with custom loading screen
- Dynamic project routing using Next.js
- Interactive skills section with animated scrolling
- Professional timeline section
- Functional contact form integrated with EmailJS
- Fully responsive design

The architecture follows a component-based structure with centralized project data management, ensuring scalability and maintainability.
  `,
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "EmailJS",
    ],
    github: "https://github.com/Elghbali01/portfolio.git",
    image: "/portfolio.png",
  },

  {
    title: "Advanced Ticket Management System",
    slug: "ticket-management-system",
    category: "Backend / Enterprise Application",
    shortDescription:
      "A backend REST API for managing support tickets, users, and workflows using Spring Boot and a clean layered architecture. (In Development)",
    fullDescription: `
This project is a backend REST API developed with Spring Boot to simulate a real-world ticket management system used in companies to handle incidents, support requests, and internal tasks.

The system allows different types of users (User, Agent, Admin) to interact with tickets through a structured workflow.

Key features include:
- User management and authentication preparation
- Ticket creation and lifecycle workflow (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- Clean layered architecture (Controller, Service, Repository)
- DTO pattern to protect internal entities
- Mapper layer for object transformation
- RESTful API design
- Validation using Jakarta Validation
- Database persistence with Spring Data JPA

This project focuses on building a professional backend architecture similar to what is used in enterprise environments.

It demonstrates:
- REST API development
- Clean architecture principles
- DTO & Mapper patterns
- Spring Boot backend design
  `,
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Web",
      "Spring Data JPA",
      "PostgreSQL",
      "REST API",
    ],
    github: "https://github.com/Elghbali01/ticket-system",
    image: "/ticket-system.png",
  },

  {
    title: "University Material Resource Management System",
    slug: "resource-management-system",
    category: "Fullstack / Enterprise Application",
    shortDescription:
      "A complete platform to manage faculty hardware resources, tender calls, supplier proposals, inventory assignment, and maintenance workflows.",
    fullDescription: `
This project is a comprehensive resource management system developed for university faculties to handle the full lifecycle of material resources (computers and printers) across departments.

The system connects four types of actors: department heads, the resource manager, the maintenance service, and external suppliers — all communicating through a centralized and secured platform.

Key modules include:

**Tender & Procurement Management:**
- Department heads collect hardware needs from teachers (computers, printers)
- Needs are reviewed and validated during a departmental meeting
- The resource manager aggregates all department requests into a formal tender call with start and end dates
- Suppliers can register and submit proposals including delivery date, warranty duration, brand, unit prices, and total

**Supplier Management:**
- External suppliers register with a secure account (company name)
- The resource manager can blacklist non-compliant suppliers and notify them with a rejection reason
- The lowest bidder is selected; acceptance and rejection notifications are sent automatically

**Inventory & Assignment:**
- Each delivered resource receives a unique inventory number (barcode)
- New suppliers are registered with full company details (location, address, website, manager)
- Resources are assigned to specific teachers or to a whole department
- The resource manager can list, update, or delete resources and assignments

**Maintenance & Failure Reporting:**
- Teachers report hardware failures to the maintenance service
- Technicians intervene and, for severe failures, submit a formal report including failure description, date, frequency (rare / frequent / permanent), and type (software or hardware)
- The resource manager reviews the report and decides to send the resource back to the supplier for repair or replacement (if under warranty)

The system is built with a clean layered architecture (Controller, Service, Repository) and secured access for all user roles.

It demonstrates:
- Role-based access control (Department Head, Resource Manager, Technician, Supplier, Teacher)
- Complex multi-actor workflow management
- REST API design with Spring Boot
- Full enterprise-grade backend architecture
  `,
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Spring Data JPA",
      "PostgreSQL",
      "REST API",
    ],
    github: "https://github.com/Elghbali01/resource-management-backend.git",
    image: "/gestion_resource.png",
  },

  {
    title: "Water Potability Prediction System",
    slug: "water-potability-ml",
    category: "Machine Learning / Data Science",
    shortDescription:
      "A complete ML pipeline to predict water potability from physicochemical measurements, with a Streamlit web application for real-time prediction.",
    fullDescription: `
This project is a complete Machine Learning study aimed at predicting whether water is safe to drink (potable or not) based on 9 physicochemical parameters.

The goal is to minimize the risk of classifying non-potable water as safe — a critical safety requirement in real-world water quality assessment.

**Dataset & Features:**
The model is trained on the water_potability.csv dataset containing 9 input features:
- pH, Hardness, Solids, Chloramines, Sulfate
- Conductivity, Organic Carbon, Trihalomethanes, Turbidity

**Project Phases:**

**Phase 1 — Feature Importance Analysis:**
- A Decision Tree (max depth 5) is trained to rank the contribution of each variable
- Results are visualized with a bar chart of feature importances

**Phase 2 — Strategy 1 (Median Imputation):**
- Missing values are filled with the column median
- All rows and all columns are preserved
- 3 models are trained and evaluated: Random Forest, KNN, SVM

**Phase 3 — Strategy 2 (NaN Row Removal):**
- Rows containing missing values are dropped entirely
- Same 3 models are trained and evaluated on the cleaned dataset

**Model Evaluation & Selection:**
- Primary metric: Recall of class 0 (non-potable water), to minimize false positives
- Secondary metrics: Accuracy, F1-score, ROC-AUC
- Confusion matrices and ROC curves generated for each model and strategy
- Best model and scaler saved as .pkl artifacts for reuse
- Cross-validation (cv=3) performed on the best configuration

**Streamlit Application:**
An interactive web interface allows:
- Manual entry of the 9 physicochemical parameters with sliders and inputs
- Real-time binary prediction (potable / non-potable)
- SVM decision function score display (distance to decision boundary)
- Quick test from a dataset row with class filter and index selector
- Full prediction history with CSV export

This project demonstrates:
- End-to-end ML pipeline (preprocessing, training, evaluation, deployment)
- Missing value strategy comparison and impact analysis
- Binary classification with safety-oriented metric prioritization
- Model persistence and interactive deployment with Streamlit
  `,
    technologies: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Streamlit",
      "Joblib",
    ],
    github: "https://github.com/Elghbali01",
    image: "/portabilite_eau.png",
  },
];
