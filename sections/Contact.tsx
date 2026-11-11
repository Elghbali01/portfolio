"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Github, Linkedin, LoaderCircle, Mail, Send } from "lucide-react";

const CONTACT_EASE = [0.22, 1, 0.36, 1] as const;

const headingSegmentVariants = (delay: number, reduceMotion: boolean) => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : "105%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduceMotion ? 0 : 0.5,
      delay: reduceMotion ? 0 : delay,
      ease: CONTACT_EASE,
    },
  },
});

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
  const textColumnRef = useRef<HTMLDivElement>(null);
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
  const [motionReady, setMotionReady] = useState(false);
  const [isStackedLayout, setIsStackedLayout] = useState(false);
  const textColumnInView = useInView(textColumnRef, { once: true, amount: 0.35 });
  const formColumnInView = useInView(formRef, { once: true, amount: 0.2 });

  useEffect(() => {
    setMotionReady(true);
    const layoutQuery = window.matchMedia("(max-width: 1023px)");
    const syncLayout = () => setIsStackedLayout(layoutQuery.matches);

    syncLayout();
    layoutQuery.addEventListener("change", syncLayout);
    return () => layoutQuery.removeEventListener("change", syncLayout);
  }, []);

  const sendEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formRef.current) return;
    if (loading) return;

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

  const reduceMotion = shouldReduceMotion ?? false;
  const textColumnOffset = isStackedLayout
    ? { x: 0, y: 16 }
    : { x: dir === "rtl" ? 18 : -18, y: 0 };
  const formColumnOffset = isStackedLayout
    ? { x: 0, y: 16 }
    : { x: dir === "rtl" ? -18 : 18, y: 0 };
  const textColumnVariants = {
    hidden: { opacity: 0, ...textColumnOffset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.56,
        delay: reduceMotion ? 0 : 0.02,
        ease: CONTACT_EASE,
      },
    },
  };
  const formColumnVariants = {
    hidden: { opacity: 0, ...formColumnOffset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.56,
        delay: reduceMotion ? 0 : 0.12,
        ease: CONTACT_EASE,
      },
    },
  };
  const textColumnAnimation = reduceMotion
    ? "visible"
    : motionReady
      ? textColumnInView
        ? "visible"
        : "hidden"
      : undefined;
  const formColumnAnimation = reduceMotion
    ? "visible"
    : motionReady
      ? formColumnInView
        ? "visible"
        : "hidden"
      : undefined;

  return (
    <section
      id="contact"
      dir={dir}
      className="relative flex scroll-mt-24 items-center justify-center px-6 pt-20 pb-10 text-content-primary md:px-10 md:pb-12 md:pt-24"
    >
      <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          ref={textColumnRef}
          variants={textColumnVariants}
          initial={false}
          animate={textColumnAnimation}
          className="space-y-6 text-start"
        >
          <h2 className="text-3xl font-bold md:text-5xl">
            <span className="contact-heading-mask">
              <motion.span
                className="contact-heading-segment"
                variants={headingSegmentVariants(0.08, reduceMotion)}
              >
                {copy.heading}
              </motion.span>
            </span>{" "}
            <span className="contact-heading-mask text-accent">
              <motion.span
                className="contact-heading-segment"
                variants={headingSegmentVariants(0.19, reduceMotion)}
              >
                {copy.headingHighlight}
              </motion.span>
            </span>
          </h2>

          <p className="leading-relaxed text-content-secondary">{copy.description}</p>

          <div data-chat-safe-zone className="mt-6 flex gap-4">
            <a
              href="mailto:elghbaliissam1@gmail.com"
              aria-label={copy.emailLinkAriaLabel}
              className="contact-social-link flex h-11 w-11 items-center justify-center rounded-full border border-outline-strong transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <Mail aria-hidden="true" size={18} />
            </a>

            <a
              href="https://www.linkedin.com/in/issam-elghbali-2937b6258/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.linkedInLinkAriaLabel}
              className="contact-social-link flex h-11 w-11 items-center justify-center rounded-full border border-outline-strong transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <Linkedin aria-hidden="true" size={18} />
            </a>

            <a
              href="https://github.com/Elghbali01"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.githubLinkAriaLabel}
              className="contact-social-link flex h-11 w-11 items-center justify-center rounded-full border border-outline-strong transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <Github aria-hidden="true" size={18} />
            </a>
          </div>
        </motion.div>

        <motion.form
          variants={formColumnVariants}
          initial={false}
          animate={formColumnAnimation}
          data-chat-safe-zone
          data-chat-desktop-safe-zone
          data-back-to-top-safe-zone
          ref={formRef}
          onSubmit={sendEmail}
          noValidate
          aria-label={copy.formAriaLabel}
          aria-busy={loading}
          aria-describedby={loading ? sendingStatusId : undefined}
          className="contact-form-card space-y-6 rounded-xl border border-outline-strong bg-surface-elevated/50 p-6 backdrop-blur-md sm:p-8"
        >
          <div>
            <label
              htmlFor={nameId}
              className="mb-2 block text-sm font-medium text-content-strong"
            >
              {copy.nameLabel} <span aria-hidden="true">*</span>
            </label>
            <input
              id={nameId}
              type="text"
              name="user_name"
              required
              maxLength={120}
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              aria-invalid={fieldErrors.name ? true : undefined}
              aria-describedby={
                fieldErrors.name ? `${nameId}-error` : undefined
              }
              onInvalid={(event) => handleInvalid("name", event)}
              onInput={(event) => clearFieldErrorWhenValid("name", event)}
              className="contact-field w-full rounded-lg border border-outline-strong bg-transparent px-4 py-3 text-content-primary outline-none transition placeholder:text-content-subtle focus:border-accent focus:ring-2 focus:ring-accent/40"
            />
            {fieldErrors.name && (
              <p id={`${nameId}-error`} className="mt-2 text-sm text-state-error">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={emailId}
              className="mb-2 block text-sm font-medium text-content-strong"
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
              maxLength={254}
              placeholder={copy.emailPlaceholder}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={
                fieldErrors.email ? `${emailId}-error` : undefined
              }
              onInvalid={(event) => handleInvalid("email", event)}
              onInput={(event) => clearFieldErrorWhenValid("email", event)}
              className="contact-field w-full rounded-lg border border-outline-strong bg-transparent px-4 py-3 text-start text-content-primary outline-none transition placeholder:text-content-subtle focus:border-accent focus:ring-2 focus:ring-accent/40"
            />
            {fieldErrors.email && (
              <p
                id={`${emailId}-error`}
                className="mt-2 text-sm text-state-error"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={messageId}
              className="mb-2 block text-sm font-medium text-content-strong"
            >
              {copy.messageLabel} <span aria-hidden="true">*</span>
            </label>
            <textarea
              id={messageId}
              name="message"
              required
              maxLength={4_000}
              rows={5}
              autoComplete="off"
              placeholder={copy.messagePlaceholder}
              aria-invalid={fieldErrors.message ? true : undefined}
              aria-describedby={
                fieldErrors.message ? `${messageId}-error` : undefined
              }
              onInvalid={(event) => handleInvalid("message", event)}
              onInput={(event) => clearFieldErrorWhenValid("message", event)}
              className="contact-field w-full resize-y rounded-lg border border-outline-strong bg-transparent px-4 py-3 text-content-primary outline-none transition placeholder:text-content-subtle focus:border-accent focus:ring-2 focus:ring-accent/40"
            />
            {fieldErrors.message && (
              <p
                id={`${messageId}-error`}
                className="mt-2 text-sm text-state-error"
              >
                {fieldErrors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="contact-submit inline-flex w-full items-center justify-center gap-2 rounded-lg bg-action py-3 font-medium text-on-action shadow-lg shadow-glow-primary/20 transition hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="contact-loading-icon"
                  size={17}
                />
                <span>{copy.sending}</span>
              </>
            ) : (
              <>
                <span>{copy.sendMessage}</span>
                <Send
                  aria-hidden="true"
                  className="contact-submit-send"
                  size={16}
                />
              </>
            )}
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
              className={`contact-submission-status text-center text-sm font-medium ${
                submission.type === "error"
                  ? "contact-submission-status--error text-state-error"
                  : "contact-submission-status--success text-state-success"
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
