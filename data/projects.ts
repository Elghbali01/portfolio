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
      "A static tourism website showcasing Indonesia’s culture, destinations, and travel attractions.",
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
    // demo: "https://your-demo-link.com", // ajoute quand tu déploies
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
    github: "https://github.com/Elghbali01",
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

    github: "https://github.com/Elghbali01", // remplace par le repo exact plus tard
    image: "/portfolio.png",
  },
];
