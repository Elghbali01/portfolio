import BackToTopButton from "@/components/BackToTopButton";

interface FooterProps {
  rights?: string;
  backToTopLabel?: string;
}

export default function Footer({
  rights = "All rights reserved.",
  backToTopLabel = "Back to top",
}: FooterProps) {
  return (
    <footer className="mt-24 border-t border-outline-subtle/80 pb-8 pt-10 text-content-muted">
      <div className="mx-auto max-w-4xl space-y-4 px-6 text-center">
        <p className="text-lg font-semibold tracking-wide text-content-primary">Issam Elghbali</p>
        <div aria-hidden="true" className="mx-auto h-px w-16 rounded-full bg-accent/60" />
        <p className="text-sm">
          © {new Date().getFullYear()} Issam Elghbali. <span>{rights}</span>
        </p>
      </div>
      <BackToTopButton label={backToTopLabel} />
    </footer>
  );
}
