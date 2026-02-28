"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Practice", href: "/practice" }
];

const heroHighlights = [
  "Framework-First Playwright",
  "AI-Accelerated Coding",
  "UI + API Automation",
  "Stable Auto-Wait Locators",
  "CI/CD-Ready Execution",
  "Interview + Placement Focus"
];

const heroFeaturePoints = [
  "Live Framework Build",
  "Copilot + MCP + CODEX Workflows",
  "Flaky Test Debugging Drills",
  "Hiring-Focused Preparation"
];

const heroQuickStats = [
  { label: "Modern Stack", value: "Playwright + AI" },
  { label: "Learning Style", value: "Hands-On First" },
  { label: "Career Focus", value: "Interview + Placement" }
];

const painPoints = [
  "Flaky test runs",
  "Slow releases and debugging",
  "High maintenance frameworks",
  "Outdated, low-growth skill stack"
];

const playwrightChecklist = [
  "Built-in auto waiting",
  "Multi-browser support",
  "Parallel execution out of the box",
  "Network interception + API testing"
];

const outcomes = [
  "Build a complete Playwright framework from scratch",
  "Implement POM with reusable architecture",
  "Design reusable utilities",
  "Automate dynamic UI + API workflows",
  "Run stable CI/CD-ready suites",
  "Use Copilot + MCP + CODEX in delivery workflows"
];

const audienceCards = [
  "Manual Testers moving into automation",
  "Selenium Engineers upgrading to modern tools",
  "Automation Engineers adding AI workflows",
  "QA Engineers aiming for SDET roles"
];

const benefitChips = [
  "Higher earning potential",
  "Faster career growth",
  "Stronger job profile",
  "Future-ready career path"
];

const finalOutcomes = [
  "Build scalable Playwright frameworks confidently",
  "Use Copilot + MCP + CODEX effectively",
  "Automate modern web apps with stable test design",
  "Integrate automation into CI/CD pipelines"
];

const deliveryStack = [
  "Playwright Framework",
  "POM + Utilities",
  "UI + API Workflows",
  "CI/CD Execution",
  "AI Workflow Integration"
];

const sectionClass =
  "relative overflow-hidden rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-6 shadow-[0_22px_48px_-30px_rgba(11,42,74,0.45)] sm:p-8";

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

function SectionHeader({ title, body }) {
  return (
    <header className="mb-8 max-w-4xl">
      <h2 className="text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">{title}</h2>
      {body ? <p className="mt-3 text-base leading-7 text-[#475569] sm:text-[1.05rem]">{body}</p> : null}
    </header>
  );
}

function SoftCard({ children, className = "", delay = 0 }) {
  return (
    <motion.article
      {...withDelay(delay)}
      className={`rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-5 shadow-[0_16px_36px_-26px_rgba(11,42,74,0.42)] transition-[transform,box-shadow,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB] md:hover:shadow-[0_20px_40px_-22px_rgba(37,99,235,0.3)] ${className}`}
    >
      {children}
    </motion.article>
  );
}

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_9%,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(59,130,246,0.1),transparent_32%),radial-gradient(circle_at_50%_96%,rgba(191,219,254,0.32),transparent_36%),#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-50 border-b border-[#D6E3F8]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(248,250,252,0.84)_100%)] shadow-[0_14px_34px_-24px_rgba(11,42,74,0.55)] backdrop-blur-xl">
        <nav
          className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
          aria-label="Primary navigation"
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[conic-gradient(from_140deg_at_50%_50%,rgba(59,130,246,0.28),rgba(147,197,253,0.08),rgba(37,99,235,0.26),rgba(59,130,246,0.28))] blur-sm"
            />
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#DCE6F8] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,250,252,0.9)_100%)] px-3 py-2 shadow-[0_16px_34px_-24px_rgba(11,42,74,0.58)] sm:px-4">
            <Link
              href="/"
              className="inline-flex items-center py-1"
              aria-label="Playwright Mastery Academy Home"
            >
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
              <ul className="flex flex-nowrap items-center gap-1.5 rounded-xl border border-[#DBEAFE] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(241,245,249,0.9)_100%)] p-1.5 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_-20px_rgba(11,42,74,0.45)]">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm transition-[background-color,color,box-shadow,transform] duration-200 ${
                        link.label === "Home"
                          ? "bg-[linear-gradient(180deg,#EFF6FF_0%,#DBEAFE_100%)] font-semibold text-[#1D4ED8] shadow-[0_8px_18px_-14px_rgba(37,99,235,0.8)]"
                          : "font-semibold text-[#0F172A] hover:-translate-y-px hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/enroll"
                aria-label="Enroll Now"
                className="inline-flex w-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#1D4ED8]/70 bg-[linear-gradient(135deg,#2563EB_0%,#1D4ED8_55%,#1E40AF_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_-16px_rgba(37,99,235,0.9)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_20px_36px_-16px_rgba(37,99,235,0.92)] sm:w-[9rem]"
              >
                Enroll Now
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#CBD5E1] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] text-[#0F172A] shadow-[0_10px_22px_-16px_rgba(11,42,74,0.55)] transition-colors duration-200 hover:bg-[#F1F5F9] sm:hidden"
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
          </div>

          <div
            id="mobile-nav-menu"
            className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 sm:hidden ${
              isMobileMenuOpen ? "mt-3 max-h-80 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-2xl border border-[#DCE6F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-3 shadow-[0_20px_38px_-24px_rgba(11,42,74,0.48)]">
              <ul className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-lg border px-3 py-2 text-center text-sm font-semibold transition-[transform,background-color,color] duration-200 ${
                      link.label === "Home"
                        ? "border-[#BFDBFE] bg-[linear-gradient(180deg,#EFF6FF_0%,#DBEAFE_100%)] text-[#1D4ED8]"
                        : "border-[#E2E8F0] bg-white text-[#0F172A] hover:-translate-y-px hover:text-[#2563EB]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              </ul>
              <Link
                href="/enroll"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Enroll Now"
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#1D4ED8]/70 bg-[linear-gradient(135deg,#2563EB_0%,#1D4ED8_55%,#1E40AF_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_-18px_rgba(37,99,235,0.88)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_18px_34px_-18px_rgba(37,99,235,0.92)]"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <section
        id="home"
        className="relative overflow-hidden bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_100%)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.22),transparent_68%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-80 w-80 bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_72%)]"
        />
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#DBEAFE]">
              Next Batch Enrollment Open
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              From Tester to{" "}
              <span className="text-[#BFDBFE]">AI-Ready Automation Engineer.</span>
            </h1>
            <p className="mt-5 text-lg font-semibold text-white/90 sm:text-xl">
              Learn Playwright with Copilot, MCP, and CODEX to build stable, scalable, and
              interview-ready automation systems.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {heroHighlights.map((item, index) => (
                <motion.li
                  key={item}
                  {...withDelay(index * 0.08)}
                  className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-[transform,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB]"
                >
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/enroll"
                aria-label="Enroll Now"
                className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(37,99,235,0.95)] transition-[transform,box-shadow,background-color,filter] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:brightness-105 hover:shadow-[0_18px_36px_-16px_rgba(37,99,235,0.95)]"
              >
                Enroll Now
              </Link>
              <Link
                href="/curriculum"
                aria-label="Explore Curriculum"
                className="rounded-lg border border-white/60 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-white/[0.12] hover:shadow-md"
              >
                Explore Curriculum
              </Link>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {heroQuickStats.map((item, index) => (
                <motion.div
                  key={item.label}
                  {...withDelay(index * 0.06)}
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#BFDBFE]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/20 bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)] p-6 shadow-[0_24px_54px_-26px_rgba(11,42,74,0.85)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BFDBFE]">
              Program Snapshot
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-white">Why Learners Choose This</h3>
            <ul className="mt-4 space-y-3">
              {heroFeaturePoints.map((point, index) => (
                <motion.li
                  key={point}
                  {...withDelay(index * 0.08)}
                  className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white transition-[transform,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#93C5FD]"
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#93C5FD]" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl border border-white/20 bg-[#0B2A4A]/55 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#BFDBFE]">
                High-Impact Outcomes
              </p>
              <p className="mt-2 text-sm leading-6 text-white/90">
                Build real frameworks, execute confidently in interviews, and deliver automation
                aligned with modern engineering teams.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-10 px-6 py-12 lg:px-8 lg:py-14">
        <motion.section id="problem" className={sectionClass} {...revealProps}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_70%)]"
          />
          <SectionHeader
            title="Automation Is Evolving. Are You?"
            body="Old automation is slow and brittle. Modern teams expect Playwright + AI-assisted delivery."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {painPoints.map((item, index) => (
                <SoftCard key={item} delay={index * 0.06}>
                  <p className="text-sm font-semibold text-[#0F172A] sm:text-base">{item}</p>
                </SoftCard>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">Why Playwright + AI Now</h3>
              <ul className="mt-3 space-y-2.5">
                {playwrightChecklist.map((item, index) => (
                  <motion.li
                    key={item}
                    {...withDelay(index * 0.06)}
                    className="rounded-xl border border-[#D7E4F8] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-[0_10px_20px_-18px_rgba(11,42,74,0.45)]"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {benefitChips.map((chip, index) => (
                  <motion.span
                    key={chip}
                    {...withDelay(index * 0.05)}
                    className="rounded-full border border-[#DBEAFE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F5F9_100%)] px-3 py-1.5 text-xs font-semibold text-[#0B2A4A]"
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="curriculum" className={sectionClass} {...revealProps}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-14 top-8 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_72%)]"
          />
          <SectionHeader
            title="What You Build Inside the Program"
            body="Hands-on, project-first learning from fundamentals to advanced automation."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((item, index) => (
              <SoftCard key={item} className="h-full" delay={index * 0.08}>
                <p className="text-sm font-semibold text-[#0F172A]">{item}</p>
              </SoftCard>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">Best For</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {audienceCards.map((item, index) => (
                <motion.span
                  key={item}
                  {...withDelay(index * 0.05)}
                  className="rounded-full border border-[#DBEAFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8]"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
              Delivery Stack
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {deliveryStack.map((item, index) => (
                <motion.span
                  key={item}
                  {...withDelay(index * 0.05)}
                  className="rounded-full border border-[#BFDBFE] bg-white px-3 py-1 text-xs font-semibold text-[#1E3A8A]"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="outcome" className={sectionClass} {...revealProps}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.12),transparent_72%)]"
          />
          <SectionHeader
            title="After Completing This Program, You Will:"
            body="Clear execution confidence, interview clarity, and stronger job outcomes."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {finalOutcomes.map((item, index) => (
              <motion.li
                key={item}
                {...withDelay(index * 0.08)}
                className="rounded-xl border border-[#D7E4F8] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] sm:text-base transition-[transform,border-color,box-shadow] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB] md:hover:shadow-[0_12px_28px_-20px_rgba(37,99,235,0.32)]"
              >
                {item}
              </motion.li>
            ))}
          </ul>
          <p className="mt-5 text-lg font-bold text-[#0B2A4A]">
            Most importantly, you stand out in a crowded automation market.
          </p>
        </motion.section>

        <motion.section
          id="final-cta"
          className="relative overflow-hidden rounded-2xl border border-[#0b2a4a]/40 bg-[linear-gradient(90deg,#0B2A4A_0%,#0F3A66_100%)] p-8 text-white shadow-[0_22px_48px_-24px_rgba(11,42,74,0.85)] sm:p-10"
          {...revealProps}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-40 w-40 bg-[radial-gradient(circle,rgba(147,197,253,0.26),transparent_72%)]"
          />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            The Future of Automation Is AI-Enhanced.
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg">
            Playwright plus AI workflows is now the practical standard. Upgrade now and move ahead
            with confidence.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-[#DBEAFE]">
              Live Mentor Sessions
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-[#DBEAFE]">
              Project-Based Learning
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-[#DBEAFE]">
              Interview-Oriented Execution
            </span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/enroll"
              aria-label="Start Your Journey"
              className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-16px_rgba(37,99,235,0.95)] transition-[transform,box-shadow,background-color,filter] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:brightness-105 hover:shadow-[0_18px_34px_-16px_rgba(37,99,235,1)]"
            >
              Start Your Journey
            </Link>
            <Link
              href="/curriculum"
              aria-label="View Curriculum"
              className="rounded-lg border border-white px-5 py-3 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-white/10 hover:shadow-md"
            >
              View Curriculum
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}


