"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Mail, Linkedin, Github } from "lucide-react";

export interface ContactLabels {
  heading: string;
  headingHighlight: string;
  description: string;
  formAriaLabel: string;
  emailLinkAriaLabel: string;
  linkedInLinkAriaLabel: string;
  githubLinkAriaLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  nameRequiredError: string;
  emailRequiredError: string;
  invalidEmailError: string;
  messageRequiredError: string;
  sendMessage: string;
  sending: string;
  successMessage: string;
  errorMessage: string;
}

const DEFAULT_LABELS: ContactLabels = {
  heading: "Let’s Build",
  headingHighlight: "Something Great",
  description:
    "I’m always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Let’s connect and turn ideas into impactful digital solutions.",
  formAriaLabel: "Contact Issam Elghbali",
  emailLinkAriaLabel: "Send an email to Issam Elghbali",
  linkedInLinkAriaLabel:
    "Visit Issam Elghbali on LinkedIn (opens in a new tab)",
  githubLinkAriaLabel:
    "Visit Issam Elghbali on GitHub (opens in a new tab)",
  nameLabel: "Your name",
  namePlaceholder: "Your name",
  emailLabel: "Your email",
  emailPlaceholder: "you@example.com",
  messageLabel: "Your message",
  messagePlaceholder: "Tell me about your project or opportunity",
  nameRequiredError: "Please enter your name.",
  emailRequiredError: "Please enter your email address.",
  invalidEmailError: "Enter a valid email address.",
  messageRequiredError: "Please enter a message.",
  sendMessage: "Send Message",
  sending: "Sending message…",
  successMessage: "Message sent successfully.",
  errorMessage: "Something went wrong. Please try again.",
};

type ContactField = "name" | "email" | "message";
type FieldErrors = Partial<Record<ContactField, string>>;

interface ContactProps {
  labels?: Partial<ContactLabels>;
  dir?: "ltr" | "rtl";
}

export default function Contact({ labels, dir }: ContactProps) {
  const copy: ContactLabels = { ...DEFAULT_LABELS, ...labels };
  const formRef = useRef<HTMLFormElement>(null);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const sendingStatusId = useId();
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const shouldReduceMotion = useReducedMotion();

  const sendEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formRef.current) return;

    if (!formRef.current.checkValidity()) {
      const firstInvalidField =
        formRef.current.querySelector<HTMLElement>(":invalid");
      window.requestAnimationFrame(() => firstInvalidField?.focus());
      return;
    }

    setLoading(true);
    setSubmission(null);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      setSubmission({ type: "success", message: copy.successMessage });
      setFieldErrors({});
      formRef.current.reset();
    } catch {
      setSubmission({ type: "error", message: copy.errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInvalid = (
    field: ContactField,
    event: React.InvalidEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let message: string;

    if (field === "email" && event.currentTarget.validity.typeMismatch) {
      message = copy.invalidEmailError;
    } else if (field === "email") {
      message = copy.emailRequiredError;
    } else if (field === "message") {
      message = copy.messageRequiredError;
    } else {
      message = copy.nameRequiredError;
    }

    setFieldErrors((current) => ({ ...current, [field]: message }));
  };

  const clearFieldErrorWhenValid = (
    field: ContactField,
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!event.currentTarget.validity.valid || !fieldErrors[field]) return;

    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const motionProps = shouldReduceMotion
    ? { initial: false as const, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 32 },
        transition: { duration: 0.7 },
      };

  return (
    <section
      id="contact"
      dir={dir}
      className="relative flex min-h-screen scroll-mt-24 items-center justify-center px-6 py-24 text-white md:px-10"
    >
      <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          {...motionProps}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 text-start"
        >
          <h2 className="text-3xl font-bold md:text-5xl">
            {copy.heading}{" "}
            <span className="text-[#60A5FA]">{copy.headingHighlight}</span>
          </h2>

          <p className="leading-relaxed text-[#CBD5E1]">{copy.description}</p>

          <div data-chat-safe-zone className="mt-6 flex gap-4">
            <a
              href="mailto:elghbaliissam1@gmail.com"
              aria-label={copy.emailLinkAriaLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#64748B] transition hover:border-[#60A5FA] hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
            >
              <Mail aria-hidden="true" size={18} />
            </a>

            <a
              href="https://www.linkedin.com/in/issam-elghbali-2937b6258/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.linkedInLinkAriaLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#64748B] transition hover:border-[#60A5FA] hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
            >
              <Linkedin aria-hidden="true" size={18} />
            </a>

            <a
              href="https://github.com/Elghbali01"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.githubLinkAriaLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#64748B] transition hover:border-[#60A5FA] hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
            >
              <Github aria-hidden="true" size={18} />
            </a>
          </div>
        </motion.div>

        <motion.form
          {...motionProps}
          data-chat-safe-zone
          ref={formRef}
          onSubmit={sendEmail}
          noValidate
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          aria-label={copy.formAriaLabel}
          aria-busy={loading}
          aria-describedby={loading ? sendingStatusId : undefined}
          className="space-y-6 rounded-xl border border-[#64748B] bg-[#1E293B]/50 p-6 backdrop-blur-md sm:p-8"
        >
          <div>
            <label
              htmlFor={nameId}
              className="mb-2 block text-sm font-medium text-[#E2E8F0]"
            >
              {copy.nameLabel} <span aria-hidden="true">*</span>
            </label>
            <input
              id={nameId}
              type="text"
              name="user_name"
              required
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              aria-invalid={fieldErrors.name ? true : undefined}
              aria-describedby={
                fieldErrors.name ? `${nameId}-error` : undefined
              }
              onInvalid={(event) => handleInvalid("name", event)}
              onInput={(event) => clearFieldErrorWhenValid("name", event)}
              className="w-full rounded-lg border border-[#64748B] bg-transparent px-4 py-3 text-white outline-none transition placeholder:text-[#94A3B8] focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/40"
            />
            {fieldErrors.name && (
              <p id={`${nameId}-error`} className="mt-2 text-sm text-[#FCA5A5]">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={emailId}
              className="mb-2 block text-sm font-medium text-[#E2E8F0]"
            >
              {copy.emailLabel} <span aria-hidden="true">*</span>
            </label>
            <input
              id={emailId}
              type="email"
              name="user_email"
              required
              autoComplete="email"
              inputMode="email"
              dir="ltr"
              placeholder={copy.emailPlaceholder}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={
                fieldErrors.email ? `${emailId}-error` : undefined
              }
              onInvalid={(event) => handleInvalid("email", event)}
              onInput={(event) => clearFieldErrorWhenValid("email", event)}
              className="w-full rounded-lg border border-[#64748B] bg-transparent px-4 py-3 text-start text-white outline-none transition placeholder:text-[#94A3B8] focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/40"
            />
            {fieldErrors.email && (
              <p
                id={`${emailId}-error`}
                className="mt-2 text-sm text-[#FCA5A5]"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={messageId}
              className="mb-2 block text-sm font-medium text-[#E2E8F0]"
            >
              {copy.messageLabel} <span aria-hidden="true">*</span>
            </label>
            <textarea
              id={messageId}
              name="message"
              required
              rows={5}
              autoComplete="off"
              placeholder={copy.messagePlaceholder}
              aria-invalid={fieldErrors.message ? true : undefined}
              aria-describedby={
                fieldErrors.message ? `${messageId}-error` : undefined
              }
              onInvalid={(event) => handleInvalid("message", event)}
              onInput={(event) => clearFieldErrorWhenValid("message", event)}
              className="w-full resize-y rounded-lg border border-[#64748B] bg-transparent px-4 py-3 text-white outline-none transition placeholder:text-[#94A3B8] focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/40"
            />
            {fieldErrors.message && (
              <p
                id={`${messageId}-error`}
                className="mt-2 text-sm text-[#FCA5A5]"
              >
                {fieldErrors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2563EB] py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B] disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? copy.sending : copy.sendMessage}
          </button>

          <p
            id={sendingStatusId}
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            {loading ? copy.sending : ""}
          </p>

          {submission && (
            <p
              role={submission.type === "error" ? "alert" : "status"}
              aria-live={submission.type === "error" ? "assertive" : "polite"}
              className={`text-center text-sm font-medium ${
                submission.type === "error"
                  ? "text-[#FCA5A5]"
                  : "text-[#86EFAC]"
              }`}
            >
              {submission.message}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
