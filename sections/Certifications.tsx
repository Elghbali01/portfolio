"use client";

import { motion } from "framer-motion";
import { certifications } from "../data/certifications";
import type { Certification } from "../data/certifications";

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-10 py-24 text-white"
    >
      <div className="max-w-6xl w-full">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            My <span className="text-[#3B82F6]">Certifications</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
            Industry-recognized credentials validating my expertise in software
            engineering, machine learning, and programming.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {certifications.map((cert: Certification, index: number) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-[#1E293B]/40 backdrop-blur-md border border-[#334155] rounded-xl p-6 flex flex-col items-center text-center
                         hover:border-[#3B82F6] hover:shadow-lg hover:shadow-blue-500/10
                         transition-all duration-300"
            >
              {/* Certificate Icon Badge */}
              <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center mb-5">
                <svg
                  className="w-8 h-8 text-[#3B82F6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                  />
                </svg>
              </div>

              {/* Certificate Name */}
              <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                {cert.name}
              </h3>

              {/* Issuer + Date */}
              <p className="text-sm text-[#3B82F6] font-medium mb-1">
                {cert.issuer}
              </p>
              {cert.date && (
                <p className="text-xs text-[#94A3B8] mb-1">{cert.date}</p>
              )}
              {cert.duration && (
                <p className="text-xs text-[#94A3B8] mb-3">{cert.duration}</p>
              )}

              {/* Score */}
              {cert.score && (
                <div className="bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 mb-5">
                  <span className="text-xs text-[#94A3B8] uppercase tracking-wider">
                    Score
                  </span>
                  <p className="text-xl font-bold text-[#3B82F6]">
                    {cert.score}
                  </p>
                </div>
              )}

              {/* Spacer to push button to bottom */}
              <div className="flex-1" />

              {/* Action Button */}
              {cert.pdfPath ? (
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(cert.pdfPath!);
                      const blob = await res.blob();
                      // Force download by creating a blob with octet-stream type
                      const downloadBlob = new Blob([blob], { type: "application/octet-stream" });
                      const url = window.URL.createObjectURL(downloadBlob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = cert.pdfPath!.split("/").pop() || "certificate.pdf";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      // Fallback: open in new tab
                      window.open(cert.pdfPath!, "_blank");
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-300 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  {cert.actionLabel}
                </button>
              ) : cert.externalLink ? (
                <a
                  href={cert.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  {cert.actionLabel}
                </a>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
