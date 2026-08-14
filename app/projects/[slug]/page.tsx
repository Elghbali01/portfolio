import Link from "next/link";
import { notFound } from "next/navigation";
import AnimatedBackground from "../../../components/AnimatedBackground";
import { projects } from "../../../data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((candidate) => candidate.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <AnimatedBackground />

      <article className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-16">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#3B82F6] text-sm font-medium transition-colors duration-300 mb-10"
        >
          ← Back to All Projects
        </Link>

        <div className="overflow-hidden rounded-xl border border-[#334155] bg-[#1E293B]/50 shadow-xl backdrop-blur-md">
          <div className="h-64 md:h-96 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-10">
            <p className="text-sm font-medium text-[#3B82F6] mb-3">
              {project.category}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-5">
              {project.title}
            </h1>
            <p className="text-[#94A3B8] text-lg mb-8">
              {project.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="text-xs px-3 py-1 rounded-full border border-[#334155] bg-[#0F172A] text-gray-300"
                >
                  {technology}
                </span>
              ))}
            </div>

            <div className="space-y-4 text-[#CBD5E1] leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </div>

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-10 bg-[#3B82F6] px-5 py-3 rounded-lg hover:bg-[#2563EB] transition"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
