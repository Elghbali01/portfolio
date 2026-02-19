"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Mail, Linkedin, Github } from "lucide-react";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setSuccess(null);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      setSuccess("Message sent successfully 🚀");
      formRef.current.reset();
    } catch (error) {
      setSuccess("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-10 text-white"
    >
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Let’s Build <span className="text-[#3B82F6]">Something Great</span>
          </h2>

          <p className="text-[#94A3B8] leading-relaxed">
            I’m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision. Let’s connect and turn
            ideas into impactful digital solutions.
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="mailto:elghbaliissam1@gmail.com"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-[#334155] hover:border-[#3B82F6] hover:text-[#3B82F6] transition"
            >
              <Mail size={18} />
            </a>

            <a
              href="https://www.linkedin.com/in/issam-elghbali-2937b6258/"
              target="_blank"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-[#334155] hover:border-[#3B82F6] hover:text-[#3B82F6] transition"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="https://github.com/Elghbali01"
              target="_blank"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-[#334155] hover:border-[#3B82F6] hover:text-[#3B82F6] transition"
            >
              <Github size={18} />
            </a>
          </div>
        </motion.div>

        {/* RIGHT SIDE - FORM */}
        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[#1E293B]/50 backdrop-blur-md border border-[#334155] p-8 rounded-xl space-y-6"
        >
          <div>
            <input
              type="text"
              name="user_name"
              required
              placeholder="Your Name"
              className="w-full bg-transparent border border-[#334155] rounded-lg px-4 py-3 focus:border-[#3B82F6] outline-none transition"
            />
          </div>

          <div>
            <input
              type="email"
              name="user_email"
              required
              placeholder="Your Email"
              className="w-full bg-transparent border border-[#334155] rounded-lg px-4 py-3 focus:border-[#3B82F6] outline-none transition"
            />
          </div>

          <div>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Your Message"
              className="w-full bg-transparent border border-[#334155] rounded-lg px-4 py-3 focus:border-[#3B82F6] outline-none transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] transition font-medium shadow-lg shadow-blue-500/20"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="text-center text-sm text-[#3B82F6]">{success}</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
