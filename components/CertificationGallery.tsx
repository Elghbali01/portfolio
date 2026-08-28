"use client";

import { useState } from "react";
import CertificatePreviewModal, { type CertificatePreviewModalLabels } from "@/components/CertificatePreviewModal";
import CertificationCard, { type CertificationCardLabels } from "@/components/CertificationCard";
import type { Certification } from "@/data/certifications";

interface CertificationGalleryProps {
  certifications: Certification[];
  collectionLabel: string;
  cardLabels: Partial<CertificationCardLabels>;
  modalLabels: Partial<CertificatePreviewModalLabels>;
  imageAlts: Record<string, string>;
  dir: "ltr" | "rtl";
}

export default function CertificationGallery({
  certifications,
  collectionLabel,
  cardLabels,
  modalLabels,
  imageAlts,
  dir,
}: CertificationGalleryProps) {
  const [previewCertificate, setPreviewCertificate] = useState<Certification | null>(null);

  return (
    <>
      <section aria-label={collectionLabel} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certification, index) => (
          <CertificationCard
            key={certification.id}
            cert={certification}
            index={index}
            variant="full"
            headingLevel="h2"
            labels={cardLabels}
            imageAlt={imageAlts[certification.id]}
            onImageClick={setPreviewCertificate}
          />
        ))}
      </section>
      <CertificatePreviewModal
        cert={previewCertificate}
        onClose={() => setPreviewCertificate(null)}
        labels={modalLabels}
        dir={dir}
        imageAlt={previewCertificate ? imageAlts[previewCertificate.id] : undefined}
      />
    </>
  );
}
