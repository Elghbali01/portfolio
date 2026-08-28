interface FooterProps {
  rights?: string;
}

export default function Footer({ rights = "All rights reserved." }: FooterProps) {
  return (
    <footer className="mt-24 border-t border-[#334155]/80 pb-8 pt-10 text-[#A8B6CA]">
      <div className="mx-auto max-w-4xl space-y-4 px-6 text-center">
        <p className="text-lg font-semibold tracking-wide text-white">Issam Elghbali</p>
        <div aria-hidden="true" className="mx-auto h-px w-16 rounded-full bg-[#60A5FA]/60" />
        <p className="text-sm">
          © {new Date().getFullYear()} Issam Elghbali. <span>{rights}</span>
        </p>
      </div>
    </footer>
  );
}
