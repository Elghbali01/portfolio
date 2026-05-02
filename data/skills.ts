import {
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiMysql,
  SiDocker,
  SiGit,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiBootstrap,
  SiTailwindcss,
  SiSpringboot,
  SiMongodb,
  // New icons
  SiPostgresql,
  SiRedis,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiStreamlit,
  SiLinux,
  SiApachehadoop,
  SiKubernetes,
  SiFlask,
  SiJupyter,
  SiApachekafka,
  SiElasticsearch,
  SiGraphql,
  SiFirebase,
  SiPhp,
  SiFigma,
  SiPostman,
  SiNginx,
  SiOpencv,
  SiTableau,
  SiApachespark,
  SiCplusplus,
} from "react-icons/si";
import { FaAws, FaNetworkWired, FaBrain, FaJava } from "react-icons/fa";

export const skills = [
  // ─── Frontend ───────────────────────────────────────
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  { name: "HTML", icon: SiHtml5 },
  { name: "CSS", icon: SiCss3 },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Bootstrap", icon: SiBootstrap },

  // ─── Backend & Languages ────────────────────────────
  { name: "Java", icon: FaJava },
  { name: "Spring Boot", icon: SiSpringboot },
  { name: "Python", icon: SiPython },
  { name: "Flask", icon: SiFlask },
  { name: "PHP", icon: SiPhp },
  { name: "C++", icon: SiCplusplus },

  // ─── Databases ──────────────────────────────────────
  { name: "SQL", icon: SiMysql },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB (NoSQL)", icon: SiMongodb },
  { name: "Redis", icon: SiRedis },

  // ─── Machine Learning / Data Science ────────────────
  { name: "TensorFlow", icon: SiTensorflow },
  { name: "PyTorch", icon: SiPytorch },
  { name: "Scikit-learn", icon: SiScikitlearn },
  { name: "Pandas", icon: SiPandas },
  { name: "NumPy", icon: SiNumpy },
  { name: "Streamlit", icon: SiStreamlit },
  { name: "Jupyter", icon: SiJupyter },
  { name: "OpenCV", icon: SiOpencv },
  { name: "Tableau", icon: SiTableau },
  { name: "Apache Spark", icon: SiApachespark },
  { name: "AI / Deep Learning", icon: FaBrain },

  // ─── DevOps / Cloud / Infra ─────────────────────────
  { name: "Docker", icon: SiDocker },
  { name: "Kubernetes", icon: SiKubernetes },
  { name: "Linux", icon: SiLinux },
  { name: "AWS", icon: FaAws },
  { name: "Nginx", icon: SiNginx },
  { name: "Firebase", icon: SiFirebase },
  { name: "Git", icon: SiGit },

  // ─── Big Data / Distributed Systems ─────────────────
  { name: "Hadoop", icon: SiApachehadoop },
  { name: "Kafka", icon: SiApachekafka },
  { name: "Elasticsearch", icon: SiElasticsearch },

  // ─── Tools & Design ──────────────────────────────────
  { name: "GraphQL", icon: SiGraphql },
  { name: "Postman", icon: SiPostman },
  { name: "Figma", icon: SiFigma },

  // ─── Networks & Security ─────────────────────────────
  { name: "Networks", icon: FaNetworkWired },
];
