import { permanentRedirect } from "next/navigation";

export default function LegacyCertificationsRedirect() {
  permanentRedirect("/en/certifications");
}
