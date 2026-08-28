import { certifications } from "@/data/certifications";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import type { ChatResource } from "./types";

const projectResources: ChatResource[] = projects.flatMap((project) => {
  const resources: ChatResource[] = [
    {
      id: `project:${project.slug}`,
      type: "project",
      title: project.title,
      description: `${project.category} · ${project.technologies.join(" · ")}`,
      url: `/en/projects/${project.slug}`,
      image: project.image,
    },
  ];

  if (project.github) {
    resources.push({
      id: `github:${project.slug}`,
      type: "github",
      title: `${project.title} — GitHub`,
      url: project.github,
    });
  }

  if (project.demo) {
    resources.push({
      id: `demo:${project.slug}`,
      type: "link",
      title: `${project.title} — Live demo`,
      url: project.demo,
    });
  }

  return resources;
});

const certificateResources: ChatResource[] = certifications.flatMap((cert) => {
  const url = cert.verificationUrl ?? cert.externalUrl ?? cert.pdf ?? cert.downloadImage;
  if (!url) return [];

  return [
    {
      id: `certificate:${cert.id}`,
      type: "certificate",
      title: cert.title,
      description: [cert.issuer, cert.date].filter(Boolean).join(" · "),
      url,
      image: cert.image,
    },
  ];
});

export const chatResources: ChatResource[] = [
  {
    id: "profile:cv",
    type: "pdf",
    title: "Issam Elghbali — CV",
    url: profile.cv,
  },
  {
    id: "profile:github",
    type: "github",
    title: "Issam Elghbali — GitHub",
    url: profile.contact.github,
  },
  {
    id: "profile:linkedin",
    type: "link",
    title: "Issam Elghbali — LinkedIn",
    url: profile.contact.linkedin,
  },
  ...projectResources,
  ...certificateResources,
];

const resourceMap = new Map(chatResources.map((resource) => [resource.id, resource]));

export function resolveResources(ids: string[]): ChatResource[] {
  return [...new Set(ids)]
    .slice(0, 4)
    .map((id) => resourceMap.get(id))
    .filter((resource): resource is ChatResource => Boolean(resource));
}
