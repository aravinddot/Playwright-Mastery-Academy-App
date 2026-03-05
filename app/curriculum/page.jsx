"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const statChips = [
  "JS Foundations",
  "TS for Testing",
  "Framework Build",
  "CI/CD Ready",
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
        description: "Start with core automation concepts and JavaScript fundamentals.",
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
        description: "Build reusable logic with loops and functions.",
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
          "Master modern JavaScript patterns used in scalable automation frameworks.",
        topics: [
          "Array methods - push(), pop(), shift(), unshift(), includes(), indexOf(), slice(), splice(), map(), filter(), find(), forEach(), sort(), reduce()",
          "Object Methods - object.keys(), object.values(), object.entries(), object.assign(), object.freeze(), object.seal(), object.is()",
          "ES6 Concepts - array destructuring, object destructuring, spread operators, rest parameters",
          "Call Back Function",
          "Exception Handling",
          "Promises, async & await"
        ]
      }
    ]
  },
  {
    id: "typescript-for-automation",
    title: "TypeScript for Automation",
    modules: [
      {
        id: "ts-for-automation",
        title: "TypeScript for Automation",
        level: "Advanced",
        description: "Learn TypeScript essentials to build safer and maintainable Playwright frameworks.",
        topics: [
          "Introduction to Typescript",
          "JS VS TS",
          "Basic Types",
          "Tuples",
          "Types with union & Intersection types",
          "Interfaces",
          "Enum"
        ]
      }
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
          "Set up Playwright and execute tests with modern runner features.",
        topics: [
          "What is Playwright",
          "Playwright Architecture",
          "Playwright Installation",
          "Playwright Test Runner",
          "Writing a simple test case",
          "Page fixture Basics",
          "Async/Await",
          "Run specific Tests and Multiple Tests",
          "Generating HTML Test Reports",
          "UI Mode Overview"
        ]
      },
      {
        id: "pw-locators",
        title: "Playwright Locators",
        level: "Beginner",
        description:
          "Build stable locator strategies for real-world applications.",
        topics: [
          "Playwright Locators - getByRole(), getByText(), getByLabel(), getByPlaceholder(), getByAltText(), getByTitle(), getByTestId()",
          "Chaining Locators, Filtering Locators, first(), last(), nth()"
        ]
      },
      {
        id: "basic-element-handling",
        title: "Basics Element Handling",
        level: "Beginner",
        description:
          "Practice essential actions, data extraction, and assertions.",
        topics: [
          "Handling Basic elements -> Click Actions -> click(), dblclick(), hover()",
          "Input Handling -> fill('text'), type('text'), clear()",
          "Keyboard Handling -> keyboard.press()",
          "Checkbox & Radio Buttons -> element.check(), uncheck()",
          "Handling Static Dropdown -> selectOption()",
          "Get Element Data -> textContent(), innerText(), inputValue(), getAttribute(), innerHtml()",
          "Element State Checks - isVisible(), isHidden(), isEnabled(), isChecked(), isEditable()",
          "Assertions - toBeVisible(), toContain(), toHaveText(), toBeHidden(), toBeEnabled(), toBeDisabled(), toBeChecked(), toHaveText(), toContainText(), toHaveValue(), toHaveAttribute(), toHaveCount(), toHaveURL()"
        ]
      },
      {
        id: "advanced-element-handling",
        title: "Advanced Element Handling",
        level: "Advanced",
        description:
          "Handle advanced UI workflows, browser contexts, waits, and diagnostics.",
        topics: [
          "Dynamic, Hidden, and Bootstrap Dropdown Strategies",
          "Element Collections with first(), last(), nth(), and count()",
          "Browser Dialog Handling: Alert, Confirm, Prompt",
          "Browser Lifecycle with chromium.launch(), newContext(), and newPage()",
          "Isolated Context Management",
          "Multi-Tab and Window Handling (including blocked direct-click flows)",
          "Drag-and-Drop Workflows",
          "Single and Multiple File Upload Automation",
          "File Download Handling and Validation",
          "iFrame and Shadow DOM Automation",
          "Date Picker Automation Patterns",
          "Advanced Wait and Synchronization Commands",
          "Mouse Interactions and Scroll Control",
          "Force Actions for Non-Interactable Elements",
          "Element Screenshot Capture",
          "Advanced Table and Pagination Handling",
          "Advanced Assertion Strategies: Retrying, Non-Retrying, Negative, Hard vs Soft",
          "Rapid Test Recording with Codegen",
          "Locator Discovery Using Codegen",
          "Trace Viewer Analysis and Debugging"
        ]
      },
      {
        id: "test-hooks",
        title: "Test Hooks",
        level: "Advanced",
        description:
          "Manage suite lifecycle with setup and teardown hooks.",
        topics: ["beforeEach, afterEach, beforeAll, afterAll"]
      },
      {
        id: "configuration",
        title: "Configuration",
        level: "Advanced",
        description: "Tune runtime and timeout controls for robust execution.",
        topics: [
          "Configure Timeouts - test timeout, expect timeout, actionTimeout, navigationTimeout, globalTimeout",
          "Understand Playwright configuration file"
        ]
      },
      {
        id: "auth-skip-login",
        title: "Authentication Handling",
        level: "Advanced",
        description: "Avoid repeated login and keep tests faster.",
        topics: ["Handle Authentication and Skip login Multiple Times"]
      },
      {
        id: "annotations-tagging",
        title: "Annotations & Tagging Test",
        level: "Advanced",
        description: "Control test execution with annotations and tags.",
        topics: [
          "Annotations - only, skip, slow, fail, fixme",
          "Tagging Tests"
        ]
      },
      {
        id: "parallel-execution",
        title: "Parallel Test Execution",
        level: "Advanced",
        description: "Configure workers and run suites in parallel safely.",
        topics: [
          "Setting parallelism in config file",
          "Limit workers"
        ]
      },
      {
        id: "multi-input-runs",
        title: "Run Single Tests with Multiple Inputs",
        level: "Advanced",
        description: "Execute one test scenario against multiple datasets.",
        topics: ["Run Single Tests with Multiple Inputs"]
      },
      {
        id: "data-driven-testing",
        title: "Data Driven Testing",
        level: "Advanced",
        description: "Drive scenarios from external test data sources.",
        topics: ["Data Driven Testing (JSON, CSV, Excel)"]
      }
    ]
  },
  {
    id: "framework-engineering-pom-oops",
    title: "Framework Engineering",
    modules: [
      {
        id: "pom-oops",
        title: "POM + OOPS Framework Design",
        level: "Advanced",
        description:
          "Engineer a reusable framework with POM, OOPS, and utilities.",
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
          "Validate endpoints and combine API + UI validations.",
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
        title: "Database Testing with Playwright",
        level: "Advanced",
        description:
          "Query databases and validate end-to-end data integrity.",
        topics: [
          "Database connection (MySQL / Postgres)",
          "Basic Queries",
          "Running SQL queries"
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
        level: "Advanced",
        description:
          "Execute at scale with retries, parallel runs, and reports.",
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
        level: "Advanced",
        description:
          "Version control, collaboration, and CI with GitHub Actions.",
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
          "Run Playwright in Azure pipelines across environments.",
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
    title: "AI Tooling",
    modules: [
      {
        id: "copilot-mcp",
        title: "Github Co-Pilot, CODEX & Playwright MCP Server",
        level: "Advanced",
        description:
          "Integrate Copilot + CODEX + MCP to accelerate test development and debugging.",
        topics: [
          "Introduction",
          "Setting Up Your Environment",
          "Using GitHub Copilot with Playwright",
          "Using CODEX for automation workflows",
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
        title: "Career Readiness",
        level: "Advanced",
        description:
          "Get interview-ready and placement-focused with practical career support.",
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
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
            {module.level}
          </span>
          <span className="rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-semibold text-[#475569]">
            {module.topics.length} topics
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm leading-5 text-[#475569]">{module.description}</p>

      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F5F9_100%)] px-3 py-2 text-left text-sm font-semibold text-[#0F172A] transition-colors duration-200 hover:border-[#2563EB] hover:text-[#2563EB]"
      >
        <span>{isOpen ? "Hide Topics" : `Open Topics (${module.topics.length})`}</span>
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
            <ul className="mt-3 space-y-2">
              {module.topics.map((topic) => (
                <li
                  key={topic}
                  className="relative overflow-hidden flex items-start gap-2 rounded-lg border border-[#DCE7F8] bg-[linear-gradient(135deg,#FFFFFF_0%,#F6FAFF_100%)] px-3 py-2.5 text-sm leading-5 text-[#475569] shadow-[0_10px_22px_-20px_rgba(11,42,74,0.45)] transition-[transform,border-color,box-shadow] duration-200 md:hover:-translate-y-px md:hover:border-[#BFDBFE] md:hover:shadow-[0_16px_28px_-20px_rgba(37,99,235,0.35)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[linear-gradient(180deg,#2563EB_0%,#1D4ED8_100%)]" />
                  <span>{topic}</span>
                </li>
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
  const curriculumSnapshot = useMemo(() => {
    const totalModules = curriculumSections.reduce((sum, section) => sum + section.modules.length, 0);
    const totalTopics = curriculumSections.reduce(
      (sum, section) =>
        sum + section.modules.reduce((moduleSum, module) => moduleSum + module.topics.length, 0),
      0
    );
    return {
      totalModules,
      totalTopics,
      totalSections: curriculumSections.length
    };
  }, []);
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
              Curriculum Snapshot
            </span>
            <motion.h1 {...reveal} className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Curriculum
            </motion.h1>
            <motion.p
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.05 }}
              className="mt-4 max-w-5xl text-left text-base leading-7 text-white/90 sm:text-lg"
            >
              A focused roadmap from JavaScript and TypeScript fundamentals to Playwright framework
              engineering, CI/CD pipelines, and AI-assisted automation with Copilot, MCP, and CODEX.
            </motion.p>
            <motion.div
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.08 }}
              className="mt-5 grid gap-2.5 sm:grid-cols-3"
            >
              <span className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white sm:text-sm">
                {curriculumSnapshot.totalSections} learning tracks
              </span>
              <span className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white sm:text-sm">
                {curriculumSnapshot.totalModules} modules
              </span>
              <span className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white sm:text-sm">
                {curriculumSnapshot.totalTopics}+ core topics
              </span>
            </motion.div>

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
            <div className="sticky top-32 relative overflow-hidden rounded-2xl border border-[#4B7CC9] bg-[radial-gradient(circle_at_12%_10%,rgba(96,165,250,0.26),transparent_38%),radial-gradient(circle_at_90%_88%,rgba(186,230,253,0.2),transparent_42%),linear-gradient(165deg,#0F2F57_0%,#1E3A8A_58%,#234BA3_100%)] p-4 shadow-[0_26px_50px_-28px_rgba(11,42,74,0.88)]">
              <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.35),transparent_72%)]" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.28),transparent_72%)]" />
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#DBEAFE]">
                Curriculum Map
              </p>
              <ul className="space-y-2">
                {curriculumSections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/95 transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-white/12 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(191,219,254,0.35)]"
                    >
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/12 text-[11px] font-bold text-[#DBEAFE]">
                        {index + 1}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-8">
            {curriculumSections.map((section, sectionIndex) => {
              const sectionTopicCount = section.modules.reduce(
                (sum, module) => sum + module.topics.length,
                0
              );
              return (
                <motion.section
                  id={section.id}
                  key={section.id}
                  className={`scroll-mt-28 ${sectionClass}`}
                  {...withDelay(sectionIndex * 0.03)}
                >
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
                    {section.title}
                  </h2>
                  <p className="mb-5 mt-1 text-sm font-medium text-[#64748B]">
                    {section.modules.length} module{section.modules.length > 1 ? "s" : ""} |{" "}
                    {sectionTopicCount} topics
                  </p>
                  <div className="relative overflow-hidden rounded-2xl border border-[#4E78BB] bg-[radial-gradient(circle_at_8%_10%,rgba(59,130,246,0.34),transparent_36%),radial-gradient(circle_at_92%_88%,rgba(147,197,253,0.26),transparent_38%),linear-gradient(165deg,#0E2C53_0%,#173E75_55%,#1B4A8B_100%)] p-4 shadow-[0_24px_46px_-28px_rgba(11,42,74,0.92)] sm:p-5">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-8 top-4 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.42),transparent_72%)]" />
                    <div aria-hidden="true" className="pointer-events-none absolute -left-8 bottom-2 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.32),transparent_72%)]" />
                    <div className="relative space-y-4">
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
                  </div>
                </motion.section>
              );
            })}
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
              Move from fundamentals to advanced implementation with frameworks, CI/CD, and
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
