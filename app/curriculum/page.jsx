"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const statChips = [
  "JS -> Playwright",
  "TS -> Playwright",
  "Framework from Scratch",
  "CI/CD + BDD",
  "Copilot + MCP + CODEX"
];

const curriculumSections = [
  {
    id: "javascript-for-automation",
    title: "JavaScript for Automation",
    modules: [
      {
        id: "js-basics",
        title: "JavaScript Basics for Automation",
        level: "Beginner",
        description:
          "Build foundational JavaScript concepts required to start automation the right way.",
        topics: [
          "What is Automation?",
          "Manual vs Automation Testing",
          "Why do we need Automation?",
          "Where Playwright fits in real projects",
          "Why Playwright over Selenium & Cypress (high-level)",
          "What is JavaScript? Why JS for automation?",
          "Setting up Node.js & VS Code",
          "Variables - var, let, const",
          "Datatypes - string, number, boolean, null, undefined",
          "Operators - Arithmetic, Comparison, Logical",
          "If else, switch case"
        ]
      },
      {
        id: "js-intermediate",
        title: "JavaScript Intermediate for Automation",
        level: "Intermediate",
        description:
          "Learn reusable coding patterns and loop structures used in day-to-day test logic.",
        topics: [
          "Traditional Loops - while, do while, for",
          "Specialized Iteration Loops - for in, for of",
          "Functions - normal function, arrow functions",
          "Return values & Parameters"
        ]
      },
      {
        id: "js-advanced",
        title: "JavaScript Advanced for Automation",
        level: "Advanced",
        description:
          "Master modern JavaScript features that power scalable automation frameworks.",
        topics: [
          "Array methods - push(), pop(), shift(), unshift(), includes(), indexOf(), slice(), splice(), map(), filter(), find(), forEach(), sort(), reduce()",
          "Object Methods - Object.keys(), Object.values(), Object.entries(), Object.assign(), Object.freeze(), Object.seal(), Object.is()",
          "ES6 Concepts - array destructuring, object destructuring, spread operators, rest parameters",
          "Callback Function",
          "Exception Handling",
          "Promises, async & await",
        ]
      }
    ]
  },
  {
    id: "typescript-for-automation",
    title: "TypeScript for Automation",
    modules: [
      {
        id: "ts-basics",
        title: "TypeScript for Automation",
        level: "Advanced",
        description:
          "Master modern TypeScript features that power scalable automation frameworks.",
        topics: [
          "Introduction to TypeScript",
          "JS VS TS",
          "String, Number, Boolean, Null, Undefined, Any, Unknown",
          "Tuples",
          "Types, Intersection Types, Union Types",
          "Interfaces",
          "Enums"
        ]
      },
    ]
  },
  {
    id: "playwright-core",
    title: "Playwright Core",
    modules: [
      {
        id: "pw-setup",
        title: "Playwright Setup",
        level: "Beginner",
        description:
          "Set up Playwright correctly and run your first production-style tests.",
        topics: [
          "What is Playwright",
          "Playwright Architecture",
          "Playwright Installation",
          "Playwright Test Runner",
          "Writing a simple test case",
          "Annotations"
        ]
      },
      {
        id: "pw-locators",
        title: "Playwright Locators",
        level: "Beginner",
        description:
          "Use robust locator strategies to reduce flaky selectors in dynamic applications.",
        topics: [
          "Playwright Locators - getByRole(), getByText(), getByLabel(), getByPlaceholder(), getByAltText(), getByTitle(), getByTestId()",
          "Chaining Locators, Filtering Locators, first(), last(), nth()"
        ]
      },
      {
        id: "basic-element-handling",
        title: "Basics Element Handling",
        level: "Intermediate",
        description:
          "Handle core page interactions and assertions required in real test flows.",
        topics: [
          "Handling Basic elements -> Click Actions -> click(), dblclick(), hover()",
          "Input Handling -> fill('text'), type('text'), clear(), press('Enter')",
          "Checkbox & Radio Buttons -> element.check(), uncheck(), isChecked()",
          "Dropdown -> selectOption()",
          "Get Element Data -> textContent(), innerText(), inputValue(), getAttribute()",
          "Basic Element State Checks - isVisible(), isHidden(), isEnabled()",
          "Basic to Advanced Assertions - toBeVisible(), toContain(), toHaveText(), toBeHidden(), toBeEnabled(), toBeDisabled(), toBeChecked(), toHaveText(), toContainText(), toHaveValue(), toHaveAttribute(), toHaveCount(), toHaveURL()",
        ]
      },
      {
        id: "advanced-element-handling",
        title: "Advanced Element Handling",
        level: "Advanced",
        description:
          "Tackle complex UI scenarios including tables, iframes, windows, and uploads.",
        topics: [
          "Element State & Stability -> waitFor()",
          "Handling Multiple Elements -> count(), first(), last(), nth(), textContent(), allTextContents(), innerText(), allInnerText()",
          "Keyboard Handling -> keyboard.press()",
          "File Upload Handling -> setInputFiles()",
          "File Download Handling -> waitForEvent()",
          "Drag and Drop",
          "Scroll Handling",
          "Force Actions",
          "Element Screenshot",
          "Alerts",
          "iFrames",
          "Multiple tabs/windows",
          "Shadow DOM",
          "Handling tables & pagination",
          "Advanced Assertions"
        ]
      },
      {
        id: "test-hooks",
        title: "Test Hooks",
        level: "Intermediate",
        description:
          "Organize setup and teardown logic to keep test suites clean and reusable.",
        topics: ["beforeEach, afterEach, beforeAll, afterAll"]
      }
    ]
  },
  {
    id: "framework-engineering-pom-oops",
    title: "Framework Engineering (POM + OOPS)",
    modules: [
      {
        id: "pom-oops",
        title: "POM - Page Object Model Design Pattern & OOPS Concept",
        level: "Advanced",
        description:
          "Engineer a maintainable Playwright framework with OOPS, utilities, and config control.",
        topics: [
          "Import & export modules",
          "OOPS -> class, Constructor, Encapsulation, Inheritance, Polymorphism, Abstraction, this Keyword, Readonly",
          "Access Modifiers -> public, private, protected",
          "Test data management",
          "Environment variables -> .env file usage",
          "Reusable utility functions",
          "Playwright Test Framework from scratch"
        ]
      }
    ]
  },
  {
    id: "api-testing",
    title: "API Testing",
    modules: [
      {
        id: "api-playwright",
        title: "API Testing with Playwright",
        level: "Advanced",
        description:
          "Validate APIs directly and combine API + UI checks for stronger end-to-end coverage.",
        topics: [
          "Introduction to API Testing",
          "GET, POST, PUT, DELETE requests",
          "Headers, Params, Body",
          "API Authentication - Basic Auth, Bearer token, API key",
          "API Assertions",
          "UI + API integration testing",
          "Mocking API Responses"
        ]
      }
    ]
  },
  {
    id: "database-testing",
    title: "Database Testing",
    modules: [
      {
        id: "database-playwright",
        title: "Data BaseTesting with Playwright",
        level: "Intermediate",
        description:
          "Connect to databases and verify stored data integrity against application behavior.",
        topics: [
          "Database connection (MySQL / Postgres)",
          "Basic Queries",
          "Running SQL queries",
          "Validating stored data"
        ]
      }
    ]
  },
  {
    id: "reporting-execution",
    title: "Reporting & Execution",
    modules: [
      {
        id: "reporting-execution-module",
        title: "Reporting & Execution",
        level: "Intermediate",
        description:
          "Run tests at scale with retries, parallelization, and useful reporting outputs.",
        topics: [
          "Playwright HTML Reports",
          "Allure Reporting",
          "Screenshots & videos",
          "Test retries",
          "Parallel execution",
          "Tagging tests"
        ]
      }
    ]
  },
  {
    id: "git-github-actions",
    title: "Git & GitHub Actions",
    modules: [
      {
        id: "git-github",
        title: "Git & Github",
        level: "Intermediate",
        description:
          "Version, collaborate, and run Playwright pipelines through GitHub Actions CI.",
        topics: [
          "Git installation & configuration",
          "Git basics",
          "Clone, Branch, Merge",
          "Pull Requests & Code Reviews",
          "Playwright with GitHub Actions",
          "Running tests in CI",
          "Headless execution",
          "Cross Browser Testing"
        ]
      }
    ]
  },
  {
    id: "azure-ci-pipeline",
    title: "Azure CI Pipeline",
    modules: [
      {
        id: "azure-pipeline",
        title: "Azure CI PIpeline",
        level: "Advanced",
        description:
          "Build enterprise-grade Azure pipelines for multi-environment Playwright execution.",
        topics: [
          "Introduction to CI/CD",
          "Azure Repos & Branching",
          "Build Pipeline Basics",
          "Environment Variables",
          "Running Playwright Tests in CI",
          "Reporting & Artifacts",
          "Advanced Pipeline Topics",
          "How to Configure & run Multiple Environments"
        ]
      }
    ]
  },
  {
    id: "ai-tools-copilot-mcp",
    title: "AI Tools (Copilot + MCP + CODEX)",
    modules: [
      {
        id: "copilot-mcp",
        title: "Github Co-Pilot, Playwright MCP & CODEX",
        level: "Advanced",
        description:
          "Accelerate test development using Copilot prompts, MCP integration, and CODEX-powered intelligent workflows.",
        topics: [
          "Introduction",
          "Setting Up Your Environment",
          "Using GitHub Copilot with Playwright",
          "MCP Server Integration",
          "Copilot + CODEX Assisted Test Creation on MCP",
          "Debugging & Optimization"
        ]
      }
    ]
  },
  {
    id: "career-placement",
    title: "Career & Placement",
    modules: [
      {
        id: "career-placement-module",
        title: "Career & Placement",
        level: "Advanced",
        description:
          "Prepare for interviews, freelance execution, and profile optimization for faster hiring.",
        topics: [
          "All Interview QA for Playwright, JS, TS, POM, BDD, CICD & AI Tools",
          "Live Freelance Projects Exposure & Hands On",
          "Naukri & Linkedin Profile Optimization",
          "Mock Interview"
        ]
      }
    ]
  }
];

const reveal = {
  initial: { opacity: 0.92, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const sectionClass =
  "relative overflow-hidden rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-6 shadow-[0_22px_48px_-30px_rgba(11,42,74,0.45)] sm:p-8";

function withDelay(delay) {
  return {
    initial: { opacity: 0.92, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: "easeOut", delay }
  };
}

function ModuleCard({ module, isOpen, onToggle, delay = 0 }) {
  const contentId = `${module.id}-content`;
  const buttonId = `${module.id}-button`;

  return (
    <motion.article
      {...withDelay(delay)}
      className="rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-5 shadow-[0_16px_36px_-26px_rgba(11,42,74,0.42)] transition-[border-color,transform,box-shadow] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB] md:hover:shadow-[0_20px_42px_-24px_rgba(37,99,235,0.32)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[#0F172A]">{module.title}</h3>
        <span className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
          {module.level}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#475569]">{module.description}</p>

      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F5F9_100%)] px-3 py-2 text-left text-sm font-semibold text-[#0F172A] transition-colors duration-200 hover:border-[#2563EB] hover:text-[#2563EB]"
      >
        <span>View Topics ({module.topics.length})</span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#475569]">
              {module.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

export default function CurriculumPage() {
  const allModuleIds = useMemo(
    () => curriculumSections.flatMap((section) => section.modules.map((module) => module.id)),
    []
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMap, setOpenMap] = useState(() =>
    allModuleIds.reduce((acc, id, index) => {
      acc[id] = index === 0;
      return acc;
    }, {})
  );

  const jumpToSection = (event) => {
    const value = event.target.value;
    if (!value) return;
    const target = document.getElementById(value);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${value}`);
    }
  };

  const toggleModule = (id) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
              <ul className="flex flex-nowrap items-center gap-1.5 rounded-xl border border-[#DBEAFE] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(241,245,249,0.9)_100%)] p-1.5 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_-20px_rgba(11,42,74,0.45)]">
                <li>
                  <Link href="/" className="block whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#F8FAFC] hover:text-[#2563EB]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/curriculum" className="block whitespace-nowrap rounded-lg bg-[linear-gradient(180deg,#EFF6FF_0%,#DBEAFE_100%)] px-3 py-2 text-center text-sm font-semibold text-[#1D4ED8] shadow-[0_8px_18px_-14px_rgba(37,99,235,0.8)]">
                    Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="block whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#F8FAFC] hover:text-[#2563EB]">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="block whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#F8FAFC] hover:text-[#2563EB]">
                    Practice
                  </Link>
                </li>
              </ul>

              <Link
                href="/enroll"
                className="inline-flex w-auto items-center justify-center whitespace-nowrap rounded-lg border border-[#1D4ED8]/70 bg-[linear-gradient(135deg,#2563EB_0%,#1D4ED8_55%,#1E40AF_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_-16px_rgba(37,99,235,0.9)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_20px_36px_-16px_rgba(37,99,235,0.92)] sm:w-[9rem]"
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
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[transform,color] duration-200 hover:-translate-y-px hover:text-[#2563EB]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/curriculum"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg border border-[#BFDBFE] bg-[linear-gradient(180deg,#EFF6FF_0%,#DBEAFE_100%)] px-3 py-2 text-center text-sm font-semibold text-[#1D4ED8]"
                >
                  Curriculum
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[transform,color] duration-200 hover:-translate-y-px hover:text-[#2563EB]"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/practice"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[transform,color] duration-200 hover:-translate-y-px hover:text-[#2563EB]"
                >
                  Practice
                </Link>
              </li>
            </ul>
            <Link
              href="/enroll"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-[#1D4ED8]/70 bg-[linear-gradient(135deg,#2563EB_0%,#1D4ED8_55%,#1E40AF_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_-18px_rgba(37,99,235,0.88)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_18px_34px_-18px_rgba(37,99,235,0.92)]"
            >
              Enroll Now
            </Link>
            </div>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-[#0b2a4a]/40 bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_100%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-4 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.24),transparent_68%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_72%)]"
        />

        <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
          <div className="rounded-2xl border border-white/20 bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)] p-6 shadow-[0_24px_50px_-24px_rgba(11,42,74,0.82)] backdrop-blur-md sm:p-8">
            <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#DBEAFE]">
              Program Roadmap
            </span>
            <motion.h1 {...reveal} className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Curriculum
            </motion.h1>
            <motion.p
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.05 }}
              className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg"
            >
              A step-by-step roadmap from JavaScript & TypeScript fundamentals to Playwright frameworks, CI/CD,
              BDD, and AI-assisted automation.
            </motion.p>

            <motion.div
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.1 }}
              className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5"
            >
              {statChips.map((chip, index) => (
                <motion.span
                  key={chip}
                  {...withDelay(index * 0.05)}
                  className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white sm:text-sm"
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8">
        <div className="mb-6 lg:hidden">
          <label htmlFor="jump-to-section" className="mb-2 block text-sm font-semibold text-[#0F172A]">
            Jump to section
          </label>
          <select
            id="jump-to-section"
            onChange={jumpToSection}
            defaultValue=""
            className="w-full rounded-xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-3 py-2.5 text-sm text-[#0F172A] shadow-[0_12px_24px_-20px_rgba(11,42,74,0.45)] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE]"
          >
            <option value="" disabled>
              Select a section
            </option>
            {curriculumSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-4 shadow-[0_20px_42px_-28px_rgba(11,42,74,0.45)]">
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#2563EB]">
                Curriculum Sections
              </p>
              <ul className="space-y-2">
                {curriculumSections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#0F172A] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-8">
            {curriculumSections.map((section, sectionIndex) => (
              <motion.section
                id={section.id}
                key={section.id}
                className={`scroll-mt-28 ${sectionClass}`}
                {...withDelay(sectionIndex * 0.03)}
              >
                <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.modules.map((module, moduleIndex) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isOpen={!!openMap[module.id]}
                      onToggle={() => toggleModule(module.id)}
                      delay={moduleIndex * 0.08}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>

      <section className="pb-10">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
          <motion.div
            {...reveal}
            className="rounded-2xl border border-[#0b2a4a]/40 bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_100%)] p-8 text-white shadow-[0_22px_48px_-24px_rgba(11,42,74,0.85)] sm:p-10"
          >
            <p className="text-center text-sm font-bold tracking-[0.18em] text-[#DBEAFE]">
              -- GET READY FOR PLACEMENTS --
            </p>
            <h3 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Build Skills That Hiring Teams Actually Need
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
              Move from fundamentals to advanced implementation with frameworks, CI/CD, BDD, and
              intelligent automation workflows.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/enroll"
                className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
              >
                Enroll Now
              </Link>
              <Link
                href="/practice"
                className="rounded-lg border border-white px-5 py-3 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-white/10 hover:shadow-md"
              >
                Practice Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


