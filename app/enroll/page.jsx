"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Practice", href: "/practice" }
];

const proofStats = [
  { label: "Career Transition Focus", value: "Manual to SDET Path" },
  { label: "Project-Centric Training", value: "Real Framework Build" },
  { label: "AI Workflow Readiness", value: "Copilot + MCP + CODEX" },
  { label: "Placement-Ready Preparation", value: "Interview + Profile Support" }
];

const outcomes = [
  "Design and build a scalable Playwright framework from scratch",
  "Automate UI + API flows with production-style patterns",
  "Use GitHub Copilot, Playwright MCP, and CODEX in real workflows",
  "Run tests in CI/CD with stable reporting and debugging",
  "Present your framework confidently in interviews"
];

const offerStack = [
  "Live, mentor-led sessions with step-by-step coding",
  "Hands-on assignments and scenario-based implementation",
  "Framework architecture using POM + reusable utilities",
  "Mock interviews and hiring-focused preparation",
  "Career support with Naukri and LinkedIn profile optimization"
];

const faqs = [
  {
    q: "Is this suitable for manual testers?",
    a: "Yes. The roadmap starts from fundamentals and progressively moves to advanced framework engineering."
  },
  {
    q: "Do I need coding experience before joining?",
    a: "Basic familiarity helps, but the program includes JavaScript and TypeScript foundations tailored for automation."
  },
  {
    q: "Will I get interview and placement support?",
    a: "Yes. The program includes mock interviews, profile optimization, and role-aligned preparation support."
  },
  {
    q: "Is AI-assisted automation included?",
    a: "Yes. You will learn practical usage of GitHub Copilot, Playwright MCP, and CODEX in test development workflows."
  },
  {
    q: "Will I work on real-time projects during training?",
    a: "Yes. You will build framework components and solve practical scenarios similar to real project expectations."
  },
  {
    q: "Do you cover API testing along with UI automation?",
    a: "Yes. The curriculum includes API fundamentals, assertions, and UI + API integration workflows."
  },
  {
    q: "Will CI/CD and reporting be part of the training?",
    a: "Yes. You will practice execution in CI pipelines and work with HTML and advanced reporting workflows."
  },
  {
    q: "How much practice support is included?",
    a: "You get structured hands-on assignments, dedicated practice labs, and scenario-based exercises for reinforcement."
  },
  {
    q: "Is this program useful for experienced automation engineers?",
    a: "Yes. Experienced engineers use this program to upgrade to modern Playwright architecture and AI-assisted workflows."
  },
  {
    q: "How do I know if this program is right for me?",
    a: "Submit the counseling form and our team will recommend the right path based on your current role and goals."
  }
];

const testimonialVideoCards = [
  {
    id: "video-1",
    name: "Raman",
    role: "QA Engineer",
    outcome: "Manual Tester -> Automation Engineer"
  },
  {
    id: "video-2",
    name: "Arivazhagan",
    role: "Fresher",
    outcome: "Fresher -> QA Automation Role"
  },
  {
    id: "video-3",
    name: "Faizal",
    role: "Automation Engineer",
    outcome: "Selenium -> Playwright + CI/CD"
  },
  {
    id: "video-4",
    name: "Anu",
    role: "Manual Tester",
    outcome: "Manual -> SDET Track"
  },
  {
    id: "video-5",
    name: "Suresh",
    role: "Automation Engineer",
    outcome: "Interview Success + Salary Growth"
  },
  {
    id: "video-6",
    name: "Pavithra",
    role: "Fresher",
    outcome: "Placement with AI-Ready Skills"
  }
];

const initialCountdownSeconds = 10 * 60;

const sectionClass =
  "rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_14px_34px_-24px_rgba(11,42,74,0.35)] sm:p-8";

const revealProps = {
  initial: { opacity: 0.92, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: "easeOut" }
};

function withDelay(delay) {
  return {
    initial: { opacity: 0.92, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: "easeOut", delay }
  };
}

function SoftCard({ children, delay = 0, className = "" }) {
  return (
    <motion.article
      {...withDelay(delay)}
      className={`rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_34px_-24px_rgba(11,42,74,0.35)] transition-[transform,border-color,box-shadow] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB] md:hover:shadow-[0_18px_38px_-20px_rgba(37,99,235,0.28)] ${className}`}
    >
      {children}
    </motion.article>
  );
}

export default function EnrollPage() {
  const advisorPhone = process.env.NEXT_PUBLIC_ADVISOR_PHONE || "+916385161126";
  const advisorTelHref = `tel:${advisorPhone.replace(/\s+/g, "")}`;
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [utmSummary, setUtmSummary] = useState("");
  const [countdownSeconds, setCountdownSeconds] = useState(initialCountdownSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    currentRole: "",
    goal: ""
  });

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const utmSource = search.get("utm_source");
    const utmCampaign = search.get("utm_campaign");
    const utmMedium = search.get("utm_medium");

    const values = [
      utmSource ? `source: ${utmSource}` : null,
      utmCampaign ? `campaign: ${utmCampaign}` : null,
      utmMedium ? `medium: ${utmMedium}` : null
    ].filter(Boolean);

    setUtmSummary(values.join(" | "));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const countdownMinutes = Math.floor(countdownSeconds / 60);
  const countdownRemainderSeconds = countdownSeconds % 60;
  const countdownLabel = `${String(countdownMinutes).padStart(2, "0")}:${String(
    countdownRemainderSeconds
  ).padStart(2, "0")}`;

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitLead = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setSubmitError("");
    setSubmitted(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enroll/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          utmSummary
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit lead.");
      }

      setSubmitted(true);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        experience: "",
        currentRole: "",
        goal: ""
      });
    } catch (error) {
      setSubmitError(error.message || "Failed to submit lead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_9%,rgba(37,99,235,0.08),transparent_36%),radial-gradient(circle_at_88%_26%,rgba(59,130,246,0.07),transparent_34%),#F8FAFC] pb-24 text-[#0F172A]">
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#F8FAFC]/95 shadow-sm backdrop-blur-sm">
        <nav
          className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 sm:py-5 lg:px-8"
          aria-label="Primary navigation"
        >
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center py-1" aria-label="Playwright Mastery Academy Home">
              <Image
                src="/company-logo.png"
                alt="Playwright Mastery Academy"
                width={290}
                height={96}
                className="h-12 w-auto sm:h-20"
                priority
                unoptimized
              />
            </Link>
            <div className="hidden sm:flex sm:flex-nowrap sm:items-center sm:justify-end sm:gap-4">
              <ul className="flex flex-nowrap items-center gap-5 text-base">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block whitespace-nowrap rounded-md px-0 py-0 text-center font-semibold text-[#0F172A] transition-colors duration-200 hover:text-[#2563EB]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href={advisorTelHref}
                aria-label={`Talk to advisor at ${advisorPhone}`}
                className="inline-flex w-[9rem] items-center justify-center whitespace-nowrap rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
              >
                Talk to Advisor
              </a>
            </div>
            <button
              type="button"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] shadow-sm transition-colors duration-200 hover:bg-[#F1F5F9] sm:hidden"
            >
              <span className="sr-only">Menu</span>
              <span className="relative inline-flex h-4 w-5 flex-col justify-between">
                <span
                  className={`block h-0.5 w-5 rounded bg-current transition-transform duration-200 ${
                    isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded bg-current transition-transform duration-200 ${
                    isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          <div
            id="mobile-nav-menu"
            className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 sm:hidden ${
              isMobileMenuOpen ? "mt-3 max-h-80 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="grid grid-cols-2 gap-2 rounded-xl border border-[#E2E8F0] bg-white p-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-colors duration-200 hover:text-[#2563EB]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={advisorTelHref}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label={`Talk to advisor at ${advisorPhone}`}
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
            >
              Talk to Advisor
            </a>
          </div>
        </nav>
      </header>

      <section className="border-b border-[#0b2a4a]/40 bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_100%)]">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <motion.div {...revealProps}>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Enroll in Playwright Mastery Academy
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
              A digital-first, career-focused automation program built for learners who want to
              become AI-ready Playwright engineers with strong placement outcomes.
            </p>

            <ul className="mt-6 space-y-2">
              {[
                "Live coding sessions with mentor guidance",
                "Framework from scratch with real project scenarios",
                "Interview and profile optimization support",
                "Practice labs for locators, network mocking, and table automation"
              ].map((item) => (
                <li key={item} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">
                  {item}
                </li>
              ))}
            </ul>

            {utmSummary ? (
              <p className="mt-4 rounded-lg border border-[#93C5FD] bg-[#DBEAFE]/20 px-3 py-2 text-xs font-semibold text-[#DBEAFE]">
                Tracking: {utmSummary}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/curriculum"
                className="rounded-lg border border-white/60 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-white/[0.08] hover:shadow-md"
              >
                View Full Curriculum
              </Link>
            </div>
          </motion.div>

          <motion.aside
            {...withDelay(0.06)}
            id="enroll-form"
            className="rounded-xl border border-white/20 bg-white/10 p-5 shadow-[0_20px_45px_-25px_rgba(11,42,74,0.8)] backdrop-blur-sm sm:p-6"
          >
            <h2 className="text-xl font-bold text-white sm:text-2xl">Get Free Counseling</h2>
            <p className="mt-1 text-sm text-white/90">
              Share your details and our advisor will contact you with the right learning plan.
            </p>

            <form className="mt-4 space-y-3" onSubmit={submitLead} data-testid="enroll-lead-form">
              <label className="block text-sm font-semibold text-white">
                Full Name
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(event) => updateForm("fullName", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/40 bg-white/95 px-3 py-2 text-sm text-[#0F172A] outline-none ring-0"
                  placeholder="Enter your name"
                />
              </label>
              <label className="block text-sm font-semibold text-white">
                Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/40 bg-white/95 px-3 py-2 text-sm text-[#0F172A] outline-none ring-0"
                  placeholder="Enter your email"
                />
              </label>
              <label className="block text-sm font-semibold text-white">
                Phone Number
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/40 bg-white/95 px-3 py-2 text-sm text-[#0F172A] outline-none ring-0"
                  placeholder="Enter your phone number"
                />
              </label>
              <label className="block text-sm font-semibold text-white">
                Experience Level
                <select
                  required
                  value={form.experience}
                  onChange={(event) => updateForm("experience", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/40 bg-white/95 px-3 py-2 text-sm text-[#0F172A] outline-none ring-0"
                >
                  <option value="">Select experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="0-2 Years">0-2 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="6+ Years">6+ Years</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-white">
                Current Role
                <input
                  type="text"
                  value={form.currentRole}
                  onChange={(event) => updateForm("currentRole", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/40 bg-white/95 px-3 py-2 text-sm text-[#0F172A] outline-none ring-0"
                  placeholder="Manual Tester / QA Engineer / Developer"
                />
              </label>
              <label className="block text-sm font-semibold text-white">
                Learning Goal
                <textarea
                  rows={3}
                  value={form.goal}
                  onChange={(event) => updateForm("goal", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/40 bg-white/95 px-3 py-2 text-sm text-[#0F172A] outline-none ring-0"
                  placeholder="What do you want to achieve in 3-6 months?"
                />
              </label>
              <button
                type="submit"
                data-testid="enroll-submit-btn"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
              >
                {isSubmitting ? "Submitting..." : "Request Callback"}
              </button>
            </form>

            {submitted ? (
              <p className="mt-3 rounded-lg border border-[#93C5FD] bg-[#DBEAFE]/25 px-3 py-2 text-sm font-semibold text-white">
                Thanks! Our team will contact you shortly with enrollment details.
              </p>
            ) : null}
            {submitError ? (
              <p className="mt-3 rounded-lg border border-[#FECACA] bg-[#7F1D1D]/35 px-3 py-2 text-sm font-semibold text-white">
                {submitError}
              </p>
            ) : null}
          </motion.aside>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 lg:px-8 lg:py-12">
        <motion.section {...revealProps} className={sectionClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Meet Your Mentor
            </h2>
            <span className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
              Mentor Introduction
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
            Get a quick mentor introduction about the program roadmap, teaching style, and how this training helps you become industry-ready.
          </p>
          <div
            data-testid="enroll-video-placeholder"
            className="mt-4 aspect-video w-full rounded-xl border-2 border-dashed border-[#93C5FD] bg-[radial-gradient(circle_at_30%_25%,rgba(37,99,235,0.14),transparent_45%),#F8FAFC] p-5"
          >
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-[#E2E8F0] bg-white/80 text-center">
              <p className="text-sm font-bold text-[#0F172A] sm:text-base">
                Mentor Introduction Video Area
              </p>
              <p className="mt-1 text-xs font-medium text-[#64748B] sm:text-sm">
                Embed your mentor intro video here (YouTube, Vimeo, or uploaded video).
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section {...revealProps} className={sectionClass}>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Why Learners Choose This Program
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {proofStats.map((item, index) => (
              <SoftCard key={item.label} delay={index * 0.06} className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">{item.label}</p>
                <p className="mt-2 text-sm font-bold text-[#0F172A]">{item.value}</p>
              </SoftCard>
            ))}
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.section {...revealProps} className={sectionClass}>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              What You Will Achieve
            </h2>
            <ul className="mt-4 space-y-3">
              {outcomes.map((item, index) => (
                <motion.li
                  key={item}
                  {...withDelay(index * 0.06)}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0F172A]"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.section>

          <motion.section {...revealProps} className={sectionClass}>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Enrollment Offer Stack
            </h2>
            <ul className="mt-4 space-y-3">
              {offerStack.map((item, index) => (
                <motion.li
                  key={item}
                  {...withDelay(index * 0.06)}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0F172A]"
                >
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
                Enrollment Window
              </p>
              <p className="mt-1 text-lg font-bold text-[#0F172A]">
                Limited seats per batch for mentor attention
              </p>
              <p className="mt-1 text-sm text-[#475569]">
                Submit your details to get the next batch schedule and fee plan.
              </p>
            </div>
          </motion.section>
        </div>

        <motion.section {...revealProps} className={sectionClass}>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Learner Testimonial Videos
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
            Real learner video stories highlighting career transition, interview wins, and framework confidence.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonialVideoCards.map((card, index) => (
              <motion.article
                key={card.id}
                {...withDelay(index * 0.05)}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
              >
                <div
                  data-testid={`testimonial-video-${index + 1}`}
                  className="group relative aspect-video overflow-hidden rounded-lg border border-[#CBD5E1] bg-[radial-gradient(circle_at_25%_20%,rgba(37,99,235,0.16),transparent_45%),#E2E8F0]"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full border border-[#93C5FD] bg-white/90 p-3 shadow-[0_10px_20px_-14px_rgba(37,99,235,0.9)] transition-transform duration-200 group-hover:scale-105">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#2563EB]" aria-hidden="true">
                        <path d="M8 6v12l10-6z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute left-2 top-2 rounded-full border border-white/60 bg-[#0B2A4A]/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Video {index + 1}
                  </div>
                </div>
                <p className="mt-3 text-sm font-bold text-[#0F172A]">{card.name}</p>
                <p className="text-xs font-semibold text-[#2563EB]">{card.role}</p>
                <p className="mt-1 text-xs text-[#475569]">{card.outcome}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section {...revealProps} className={sectionClass}>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-3">
            {faqs.map((item, index) => {
              const isOpen = index === openFaqIndex;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;

              return (
                <motion.article
                  key={item.q}
                  {...withDelay(index * 0.04)}
                  className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white"
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaqIndex((prev) => (prev === index ? -1 : index))}
                    className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left sm:items-center"
                  >
                    <span className="pr-2 text-sm font-bold leading-6 text-[#0F172A] sm:text-base">
                      {item.q}
                    </span>
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#DBEAFE] bg-[#EFF6FF] text-sm font-bold text-[#2563EB] transition-transform duration-200 sm:mt-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ${
                      isOpen ? "mt-0 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden px-4 pb-4 text-sm leading-6 text-[#475569]">
                      {item.a}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          {...revealProps}
          className="rounded-xl border border-[#0b2a4a]/40 bg-[linear-gradient(90deg,#0B2A4A_0%,#0F3A66_100%)] p-8 text-white shadow-[0_22px_48px_-24px_rgba(11,42,74,0.85)] sm:p-10"
        >
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Real Learner Success Snapshots
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg">
            These are the exact outcomes learners reported after completing structured Playwright,
            AI-assisted automation, and interview-focused practice tracks.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-sm leading-6 text-white/95">
                "Moved from Manual Tester to Automation Engineer after building a complete
                Playwright framework and clearing two interview rounds."
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#BFDBFE]">
                Role Transition
              </p>
            </article>
            <article className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-sm leading-6 text-white/95">
                "Switched from Selenium-only support work to Playwright ownership with CI/CD and
                API coverage, leading to a strong salary jump."
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#BFDBFE]">
                Salary Growth
              </p>
            </article>
            <article className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-sm leading-6 text-white/95">
                "Used GitHub Copilot, MCP, and CODEX workflows during practical interview tasks and secured
                a better package in a product-focused company."
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#BFDBFE]">
                AI-Ready Skill Growth
              </p>
            </article>
            <article className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-sm leading-6 text-white/95">
                "As a fresher, I moved from basic scripts to framework-level confidence and got my
                first QA automation offer within months."
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#BFDBFE]">
                Fresher Placement
              </p>
            </article>
            <article className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-sm leading-6 text-white/95">
                "Interview mock sessions fixed my weak answers; I started explaining architecture,
                debugging strategy, and framework decisions clearly."
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#BFDBFE]">
                Interview Results
              </p>
            </article>
            <article className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-sm leading-6 text-white/95">
                "I now handle dynamic UI, API + UI validations, and pipeline execution confidently
                instead of relying on fragile script fixes."
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#BFDBFE]">
                End-to-End Confidence
              </p>
            </article>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/testimonials"
              className="rounded-lg border border-white px-5 py-3 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-white/10 hover:shadow-md"
            >
              Read More Success Stories
            </Link>
          </div>
        </motion.section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#1E3A8A]/50 bg-[linear-gradient(90deg,rgba(11,42,74,0.98)_0%,rgba(15,58,102,0.98)_100%)] shadow-[0_-14px_34px_-20px_rgba(11,42,74,0.8)] backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#93C5FD]/60 bg-[#DBEAFE]/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#DBEAFE]">
                Limited Time Offer
              </span>
              <span className="text-sm font-semibold text-[#DBEAFE]">Offer closes in</span>
              <span
                data-testid="enroll-urgency-timer"
                className="rounded-lg border border-[#93C5FD] bg-white/10 px-2.5 py-1 font-mono text-base font-extrabold text-white shadow-[0_10px_18px_-14px_rgba(147,197,253,0.9)]"
              >
                {countdownLabel}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-[#BFDBFE]">
              Few seats left in this batch. Secure your slot now.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#60A5FA] bg-gradient-to-r from-white/15 to-white/5 px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_20px_-14px_rgba(147,197,253,0.9)]">
              <span className="line-through opacity-75">INR 25000</span>
              <span className="font-extrabold text-[#DBEAFE]">INR 14999 only</span>
              <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Save 40%
              </span>
            </span>

            <a
              href="#enroll-form"
              data-testid="sticky-enroll-btn"
              className="animate-pulse rounded-lg border border-[#60A5FA]/30 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-3 py-2 text-sm font-extrabold text-white shadow-[0_14px_28px_-16px_rgba(37,99,235,0.95)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-110 hover:shadow-[0_18px_34px_-18px_rgba(37,99,235,1)] sm:px-4 sm:tracking-wide"
            >
              Enroll Now - Seats Limited
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}




