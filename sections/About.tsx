import ExpertiseCard, { type ExpertiseCardData } from "@/components/ExpertiseCard";
import Reveal from "@/components/Reveal";

export interface AboutCopy {
  title: string;
  highlightedTitle: string;
  summary: string;
  paragraphs: string[];
  cards: readonly ExpertiseCardData[];
}

const defaultCopy: AboutCopy = {
  title: "Who",
  highlightedTitle: "I Am",
  summary:
    "Data Science Master’s student with a strong Computer Science foundation, focused on Machine Learning, Artificial Intelligence, and reliable software systems.",
  paragraphs: [
    "I specialize in Machine Learning, Artificial Intelligence, and modern Software Engineering.",
    "I design data-informed systems that address concrete needs through maintainable software and scalable architectures.",
    "Curiosity and continuous learning guide my work, from understanding a problem to delivering a useful technical solution.",
  ],
  cards: [
    {
      id: "artificial-intelligence",
      title: "Artificial Intelligence",
      description: "Designing intelligent systems powered by Machine Learning and well-chosen algorithms.",
      badges: ["Machine Learning", "Deep Learning", "Neural Networks"],
    },
    {
      id: "data-science",
      title: "Data Science",
      description: "Turning raw data into clear insights, tested models, and useful decision support.",
      badges: ["Data Analysis", "Data Visualization", "EDA"],
    },
    {
      id: "software-engineering",
      title: "Software Engineering",
      description: "Building maintainable, reliable, and performance-conscious applications.",
      badges: ["Java", "Spring Boot", "REST API", "PostgreSQL"],
    },
  ],
};

interface AboutProps {
  copy?: Partial<AboutCopy>;
  rtl?: boolean;
}

export default function About({ copy: overrides, rtl = false }: AboutProps) {
  const copy = { ...defaultCopy, ...overrides };

  return (
    <section
      id="about"
      className="relative flex min-h-screen scroll-mt-24 items-center justify-center px-6 py-20 text-content-primary md:px-10"
    >
      <div className="w-full max-w-6xl">
        <Reveal className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            {copy.title} <span className="text-accent">{copy.highlightedTitle}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-content-secondary">{copy.summary}</p>
        </Reveal>

        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal from="start" rtl={rtl} className="space-y-6 text-start leading-relaxed text-content-strong">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal from="end" rtl={rtl} className="grid gap-6">
            {copy.cards.map((card) => (
              <ExpertiseCard key={card.id} card={card} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
