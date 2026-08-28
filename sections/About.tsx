import Reveal from "@/components/Reveal";

export interface AboutCopy {
  title: string;
  highlightedTitle: string;
  summary: string;
  paragraphs: string[];
  cards: Array<{ title: string; description: string }>;
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
      title: "Artificial Intelligence",
      description: "Designing intelligent systems powered by Machine Learning and well-chosen algorithms.",
    },
    {
      title: "Data Science",
      description: "Turning raw data into clear insights, tested models, and useful decision support.",
    },
    {
      title: "Software Engineering",
      description: "Building maintainable, reliable, and performance-conscious applications.",
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
      className="relative flex min-h-screen scroll-mt-24 items-center justify-center px-6 py-20 text-white md:px-10"
    >
      <div className="w-full max-w-6xl">
        <Reveal className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            {copy.title} <span className="text-[#60A5FA]">{copy.highlightedTitle}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-[#B7C3D4]">{copy.summary}</p>
        </Reveal>

        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal from="start" rtl={rtl} className="space-y-6 text-start leading-relaxed text-[#D4DCE8]">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal from="end" rtl={rtl} className="grid gap-6">
            {copy.cards.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-[#475569] bg-[#1E293B]/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#60A5FA] hover:shadow-lg hover:shadow-blue-500/10"
              >
                <h3 className="mb-2 text-lg font-semibold text-[#60A5FA]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#B7C3D4]">{item.description}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
