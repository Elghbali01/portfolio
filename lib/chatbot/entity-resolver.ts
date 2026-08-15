import { certifications } from "@/data/certifications";
import { projects } from "@/data/projects";
import { normalizeMessage } from "./language";

export type ResolvedEntity =
  | { kind: "project"; status: "known"; id: string }
  | { kind: "certification"; status: "known"; id: string }
  | { kind: "project" | "certification"; status: "unknown"; label: string };

const aliases: Record<string, string[]> = {
  "ticket-management-system": ["advanced ticket management", "ticket management system"],
  "resource-management-system": ["university material resource management", "material resource management"],
  "water-potability-ml": ["water potability prediction", "water potability"],
  "customer-churn-prediction": ["customer churn", "churn prediction", "projet customer churn"],
  "football-intelligence-player-recommendation-system": [
    "football intelligence",
    "player recommendation system",
    "player recommendation",
    "systeme de recommandation de joueurs",
    "recommandation de joueurs",
  ],
};

export function resolveEntity(message: string): ResolvedEntity | null {
  const text = normalizeMessage(message);
  for (const project of projects) {
    const names = [normalizeMessage(project.title), project.slug.replaceAll("-", " "), ...(aliases[project.slug] ?? [])];
    if (names.some((name) => text.includes(name))) return { kind: "project", status: "known", id: project.slug };
  }
  for (const cert of certifications) {
    if (text.includes(normalizeMessage(cert.title))) return { kind: "certification", status: "known", id: cert.id };
  }
  if (/e commerce recommendation platform/.test(text)) return { kind: "project", status: "unknown", label: "E-commerce Recommendation Platform" };
  if (/aws certified cloud practitioner/.test(text)) return { kind: "certification", status: "unknown", label: "AWS Certified Cloud Practitioner" };
  return null;
}
