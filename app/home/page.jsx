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
  "Modern Playwright Framework Design",
  "AI-Assisted Test Development (GitHub Copilot)",
  "Intelligent Automation with Playwright MCP + CODEX",
  "UI + API Automation",
  "CI/CD Integration",
  "Interview-Ready Skills"
];

const heroFeaturePoints = [
  "Modern Playwright Framework Design",
  "AI-Assisted Test Development",
  "Intelligent Workflows with MCP + CODEX",
  "Interview-Ready Skills"
];

const painPoints = [
  "Flaky and unstable test execution",
  "Manual script-heavy development",
  "Slow debugging and maintenance",
  "Poor scalability in frameworks",
  "No AI-assisted productivity"
];

const playwrightChecklist = [
  "Built-in Auto Waiting",
  "Multi-browser support",
  "Parallel execution out of the box",
  "Handles iframes, tabs, and popups",
  "Network interception & API testing",
  "Mobile emulation support",
  "Headless & headed execution",
  "AI-assisted test development workflows"
];

const focusPoints = [
  "Strong core fundamentals",
  "Framework architecture from scratch",
  "Real-time industry scenarios",
  "Clean coding practices",
  "AI-assisted development techniques",
  "Practical interview preparation"
];

const outcomes = [
  "Build a complete Playwright framework from scratch",
  "Implement Page Object Model properly",
  "Design reusable utilities",
  "Handle dynamic elements confidently",
  "Perform API + UI automation together",
  "Execute tests in parallel",
  "Integrate automation into CI/CD pipelines",
  "Use GitHub Copilot to accelerate development",
  "Apply Playwright MCP + CODEX for intelligent workflows"
];

const audienceCards = [
  "Manual Testers moving into automation",
  "Selenium Engineers upgrading to modern tools",
  "Automation Engineers wanting AI integration skills",
  "QA Engineers aiming for SDET roles",
  "Professionals seeking future-ready automation expertise",
  "Non-IT professionals transitioning into software testing and AI automation"
];

const benefitChips = [
  "More valuable",
  "More productive",
  "More competitive",
  "Future-ready",
  "Higher earning potential",
  "Faster career growth"
];

const teachingList = [
  "Step-by-step coding walkthroughs",
  "Hands-on assignments",
  "Real-world automation scenarios",
  "AI-assisted development practice",
  "Debugging with intelligent workflows",
  "Interview-oriented preparation"
];

const finalOutcomes = [
  "Build scalable Playwright frameworks confidently",
  "Use GitHub Copilot effectively in automation projects",
  "Apply Playwright MCP + CODEX for intelligent test workflows",
  "Automate complex modern applications",
  "Integrate automation into DevOps pipelines",
  "Work like a modern AI-ready automation engineer"
];

const testimonials = [
  "\"This program completely transformed my automation mindset. I didn't just learn Playwright - I learned how to design scalable frameworks and use AI tools like GitHub Copilot effectively. Within months, I felt more confident in interviews and capable of handling real-world automation challenges.\"",
  "\"Before joining, I was writing basic scripts. Now I can build a full Playwright framework from scratch and integrate AI-assisted workflows. The hands-on projects and practical structure gave me real engineering confidence, not just theoretical knowledge. It truly elevated my automation career.\"",
  "\"Learning Playwright combined with AI-assisted automation practices gave me a competitive edge in the job market. I improved my productivity, understood framework architecture clearly, and started thinking like a modern automation engineer. This program accelerated my growth far beyond traditional automation courses.\""
];

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

function SectionHeader({ title, body }) {
  return (
    <header className="mb-8 max-w-4xl">
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">{title}</h2>
      {body ? <p className="mt-3 text-base leading-7 text-[#475569] sm:text-lg">{body}</p> : null}
    </header>
  );
}

function SoftCard({ children, className = "", delay = 0 }) {
  return (
    <motion.article
      {...withDelay(delay)}
      className={`rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_34px_-24px_rgba(11,42,74,0.35)] transition-[transform,box-shadow,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB] md:hover:shadow-[0_18px_38px_-20px_rgba(37,99,235,0.28)] ${className}`}
    >
      {children}
    </motion.article>
  );
}

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_9%,rgba(37,99,235,0.08),transparent_36%),radial-gradient(circle_at_88%_26%,rgba(59,130,246,0.07),transparent_34%),#F8FAFC] text-[#0F172A]">
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
                      className={`block whitespace-nowrap rounded-md px-0 py-0 text-center transition-colors duration-200 ${
                        link.label === "Home"
                          ? "font-semibold text-[#2563EB]"
                          : "font-semibold text-[#0F172A] hover:text-[#2563EB]"
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
                className="inline-flex w-auto items-center justify-center whitespace-nowrap rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md sm:w-[9rem]"
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
                    className={`block rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-center text-sm font-semibold transition-colors duration-200 ${
                      link.label === "Home"
                        ? "text-[#2563EB]"
                        : "text-[#0F172A] hover:text-[#2563EB]"
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
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
            >
              Enroll Now
            </Link>
          </div>
        </nav>
      </header>

      <section id="home" className="bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_100%)]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              From Tester to AI-Ready Automation Engineer.
            </h1>
            <p className="mt-5 text-lg font-semibold text-white/90 sm:text-xl">
              Master Playwright and learn to leverage GitHub Copilot, Playwright MCP, and CODEX to
              build intelligent, scalable, future-ready automation systems.
            </p>
            <p className="mt-4 text-base leading-7 text-white/85 sm:text-lg">
              Stop writing outdated automation scripts. Start building modern, AI-assisted test
              systems used by high-performing engineering teams.
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
                className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
              >
                Enroll Now
              </Link>
              <Link
                href="/curriculum"
                aria-label="Explore Curriculum"
                className="rounded-lg border border-white/60 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-white/[0.08] hover:shadow-md"
              >
                Explore Curriculum
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-white/20 bg-white/10 p-6 shadow-[0_20px_45px_-25px_rgba(11,42,74,0.8)] backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white">Why Learners Choose This</h3>
            <ul className="mt-4 space-y-3">
              {heroFeaturePoints.map((point, index) => (
                <motion.li
                  key={point}
                  {...withDelay(index * 0.08)}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white transition-[transform,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB]"
                >
                  {point}
                </motion.li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-12 px-6 py-12 lg:px-8 lg:py-14">
        <motion.section id="problem" className={sectionClass} {...revealProps}>
          <SectionHeader
            title="Automation Is Evolving. Are You?"
            body="Modern applications are built with React, Angular, microservices, and CI/CD pipelines. Traditional automation approaches struggle with flaky tests, synchronization issues, slow execution, and complex maintenance. Engineering teams are now adopting AI-assisted workflows to move faster and build smarter systems. If you're not evolving with modern automation practices, you risk falling behind."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((item, index) => (
              <SoftCard key={item} delay={index * 0.08}>
                <p className="text-sm font-semibold text-[#0F172A] sm:text-base">{item}</p>
              </SoftCard>
            ))}
          </div>
        </motion.section>

        <motion.section id="why-playwright" className={sectionClass} {...revealProps}>
          <SectionHeader title="Why Playwright Is the Foundation of Modern Automation" body="" />
          <div className="grid gap-6 lg:grid-cols-2">
            <p className="text-base leading-8 text-[#475569] sm:text-lg">
              Playwright is a modern automation framework built for modern applications. It handles
              dynamic content, supports cross-browser testing, and integrates seamlessly into CI/CD
              pipelines. When combined with GitHub Copilot, Playwright MCP, and CODEX, it enables
              engineers to build smarter, faster, and more maintainable automation systems.
            </p>
            <ul className="space-y-3">
              {playwrightChecklist.map((item, index) => (
                <motion.li
                  key={item}
                  {...withDelay(index * 0.08)}
                  className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm leading-6 text-[#0F172A] transition-[transform,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB]"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.section>

        <motion.section id="about-academy" className={sectionClass} {...revealProps}>
          <SectionHeader
            title="This Is Not Just a Course. It's a Career Upgrade."
            body="Playwright Mastery Academy transforms you from a traditional tester into an AI-ready automation engineer. You won't just learn Playwright syntax. You'll learn how modern automation engineers design scalable frameworks, integrate AI tools into workflows, and build intelligent automation systems."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusPoints.map((item, index) => (
              <SoftCard key={item} delay={index * 0.08}>
                <p className="text-sm font-semibold text-[#0F172A] sm:text-base">{item}</p>
              </SoftCard>
            ))}
          </div>
        </motion.section>

        <motion.section id="curriculum" className={sectionClass} {...revealProps}>
          <SectionHeader title="Real Skills. Real Frameworks. Real Confidence." body="" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((item, index) => (
              <SoftCard key={item} className="h-full" delay={index * 0.08}>
                <p className="text-sm font-semibold text-[#0F172A]">{item}</p>
              </SoftCard>
            ))}
          </div>
        </motion.section>

        <motion.section id="who-this-is-for" className={sectionClass} {...revealProps}>
          <SectionHeader title="Who This Program Is For" body="" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audienceCards.map((item, index) => (
              <SoftCard key={item} delay={index * 0.08}>
                <p className="text-sm font-semibold text-[#0F172A] sm:text-base">{item}</p>
              </SoftCard>
            ))}
          </div>
        </motion.section>

        <motion.section id="industry-demand" className={sectionClass} {...revealProps}>
          <SectionHeader
            title="Why Becoming AI-Ready Matters Now"
            body="Modern engineering teams expect automation engineers to leverage AI-assisted tools to improve speed, efficiency, and scalability. Playwright combined with AI workflows gives you a strong competitive advantage in today's job market."
          />
          <div className="flex flex-wrap gap-3">
            {benefitChips.map((chip, index) => (
              <motion.span
                key={chip}
                {...withDelay(index * 0.08)}
                className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#0B2A4A] transition-[transform,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB]"
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </motion.section>

        <motion.section id="practice" className={sectionClass} {...revealProps}>
          <SectionHeader title="Learn by Building - Not Just Watching" body="" />
          <ol className="space-y-3">
            {teachingList.map((item, index) => (
              <motion.li
                key={item}
                {...withDelay(index * 0.08)}
                className="flex gap-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 shadow-[0_12px_30px_-24px_rgba(11,42,74,0.35)] transition-[transform,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB]"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B2A4A] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-semibold text-[#0F172A] sm:text-base">{item}</p>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        <motion.section id="outcome" className={sectionClass} {...revealProps}>
          <SectionHeader title="After Completing This Program, You Will Be Able To:" body="" />
          <ul className="space-y-3">
            {finalOutcomes.map((item, index) => (
              <motion.li
                key={item}
                {...withDelay(index * 0.08)}
                className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] sm:text-base transition-[transform,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB]"
              >
                {item}
              </motion.li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-bold text-[#0B2A4A]">
            Most importantly - you will evolve beyond a traditional tester.
          </p>
        </motion.section>

        <motion.section id="testimonials" className={sectionClass} {...revealProps}>
          <SectionHeader title="What Our Learners Say" body="" />
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((quote, index) => (
              <SoftCard key={quote} delay={index * 0.08}>
                <p className="text-sm leading-7 text-[#475569] sm:text-base">{quote}</p>
              </SoftCard>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-[#475569]">
            Note: Full testimonials available in the Testimonials page.
          </p>
        </motion.section>

        <motion.section
          id="final-cta"
          className="rounded-xl border border-[#0b2a4a]/40 bg-[linear-gradient(90deg,#0B2A4A_0%,#0F3A66_100%)] p-8 text-white shadow-[0_22px_48px_-24px_rgba(11,42,74,0.85)] sm:p-10"
          {...revealProps}
        >
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            The Future of Automation Is AI-Enhanced.
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg">
            Playwright is leading modern automation. AI tools are accelerating engineering workflows.
            If you want to stay relevant and competitive, this is your moment.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/enroll"
              aria-label="Start Your Journey"
              className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
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


