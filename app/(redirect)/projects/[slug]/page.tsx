import { permanentRedirect } from "next/navigation";

interface LegacyProjectRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyProjectRedirect({ params }: LegacyProjectRedirectProps) {
  const { slug } = await params;
  permanentRedirect(`/en/projects/${encodeURIComponent(slug)}`);
}
