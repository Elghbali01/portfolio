"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

interface FooterSignatureProps {
  rights: string;
}

export default function FooterSignature({ rights }: FooterSignatureProps) {
  const signatureRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(signatureRef, { once: true, amount: 0.12 });

  return (
    <div
      ref={signatureRef}
      className={`footer-signature mx-auto grid w-full max-w-4xl justify-items-center gap-4 px-6 text-center${
        isInView ? " footer-signature-is-visible" : ""
      }`}
    >
      <div aria-hidden="true" className="footer-separator">
        <span className="footer-separator-highlight" />
      </div>

      <p
        className="footer-signature-name text-lg font-semibold tracking-wide text-content-primary"
      >
        <span className="footer-signature-accent">Issam</span> Elghbali
      </p>

      <div
        aria-hidden="true"
        className="footer-signature-underline"
      />

      <p
        className="footer-copyright text-sm"
      >
        © {new Date().getFullYear()} Issam Elghbali. <span>{rights}</span>
      </p>
    </div>
  );
}
