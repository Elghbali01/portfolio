import BackToTopButton from "@/components/BackToTopButton";
import FooterSignature from "@/components/FooterSignature";

interface FooterProps {
  rights?: string;
  backToTopLabel?: string;
}

export default function Footer({
  rights = "All rights reserved.",
  backToTopLabel = "Back to top",
}: FooterProps) {
  return (
    <footer className="portfolio-footer relative mt-10 pb-8 pt-8 text-content-muted md:mt-14 md:pt-10">
      <FooterSignature rights={rights} />
      <BackToTopButton label={backToTopLabel} />
    </footer>
  );
}
