"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Practice", href: "/practice" }
];

const placementLogos = [
  { name: "Accenture", src: "/company-logos/ACN_BIG.png" },
  { name: "Capgemini", src: "/company-logos/CAP.PA_BIG.png" },
  { name: "Cognizant", src: "/company-logos/CTSH_BIG.png" },
  { name: "Delhivery", src: "/company-logos/DELHIVERY.NS_BIG.png" },
  { name: "Deloitte", src: "/company-logos/deloitte_BIG.png" },
  { name: "GIB", src: "/company-logos/GIB.png" },
  { name: "HCL", src: "/company-logos/HCLTECH.NS_BIG.png" },
  { name: "Hexaware", src: "/company-logos/HEXAWARE.NS_BIG.png" },
  { name: "Infosys", src: "/company-logos/INFY.png" },
  { name: "L&T", src: "/company-logos/LT.NS_BIG.png" },
  { name: "LTI Mindtree", src: "/company-logos/LTIM.NS_BIG.png" },
  { name: "Mphasis", src: "/company-logos/MPHASIS.NS_BIG.png" },
  { name: "Persistent", src: "/company-logos/PERSISTENT.NS_BIG.png" },
  { name: "TCS", src: "/company-logos/TCS.NS.png" },
  { name: "Tech Mahindra", src: "/company-logos/TECHM.NS_BIG.png" },
  { name: "UST Global", src: "/company-logos/UST.png" },
  { name: "Wipro", src: "/company-logos/WIT.png" }
];

const testimonials = [
  {
    name: "Raman",
    role: "QA Engineer - 4 Years Experience",
    rating: 5,
    photo: "/testimonials/profile-1.jpeg",
    avatarBg: "#DBEAFE",
    avatarFg: "#1E3A8A",
    tags: ["Playwright Core", "POM + OOPS", "Career & Placement"],
    lines: [
      "I joined the program to modernize my automation approach.",
      "Playwright framework concepts were explained with clear real examples.",
      "Hands-on assignments improved coding quality and debugging confidence.",
      "Mock interviews helped me communicate projects professionally."
    ],
    outcome: "Got offer from LTI Mindtree with 12 LPA salary."
  },
  {
    name: "Arivazhagan",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-2.jpeg",
    avatarBg: "#E0F2FE",
    avatarFg: "#0C4A6E",
    tags: ["JavaScript", "TypeScript", "Playwright Core", "CI/CD"],
    lines: [
      "I started as a fresher with limited automation understanding.",
      "JavaScript and Playwright basics were taught in simple steps.",
      "Real-time framework practice gave me practical project confidence.",
      "Interview sessions improved my communication and technical clarity."
    ],
    outcome: "Got offer from TCS with 4 LPA salary."
  },
  {
    name: "Faizal",
    role: "Automation Engineer - 3 Years Experience",
    rating: 5,
    photo: "/testimonials/profile-3.jpeg",
    avatarBg: "#E2E8F0",
    avatarFg: "#1E293B",
    tags: ["API Testing", "POM + OOPS", "Git & GitHub Actions"],
    lines: [
      "I wanted to move beyond basic Selenium script maintenance.",
      "The academy clarified robust framework architecture and reusable design.",
      "HR support improved resume quality and interview storytelling.",
      "Practice sessions helped me answer scenario-based questions confidently."
    ],
    outcome: "Got offer from Accenture with 8 LPA salary."
  },
  {
    name: "Ramesh",
    role: "Manual Tester - 3 Years Experience",
    rating: 5,
    photo: "/testimonials/profile-4.jpeg",
    avatarBg: "#FEF3C7",
    avatarFg: "#92400E",
    tags: ["JavaScript", "Playwright Locators", "Test Hooks"],
    lines: [
      "I was working only on manual testing before joining.",
      "The course built my JavaScript and Playwright fundamentals clearly.",
      "POM implementation practice improved my automation structure skills.",
      "Interview preparation helped me transition confidently into automation."
    ],
    outcome: "Got offer from Cognizant with 10.5 LPA salary."
  },
  {
    name: "Sathish",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-5.jpeg",
    avatarBg: "#DCFCE7",
    avatarFg: "#166534",
    tags: ["Career & Placement", "Mock Interview", "Profile Optimization"],
    lines: [
      "As a fresher, I needed clarity on interview expectations.",
      "The HR Bonus module improved introduction and communication confidence.",
      "Project explanation practice helped me present work effectively.",
      "Technical sessions strengthened my testing fundamentals quickly."
    ],
    outcome: "Got offer from Wipro with 4.8 LPA salary."
  },
  {
    name: "Rohit",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-6.jpeg",
    avatarBg: "#FCE7F3",
    avatarFg: "#9D174D",
    tags: ["Copilot + MCP + CODEX", "Git & GitHub Actions", "CI/CD"],
    lines: [
      "I needed complete guidance from resume to automation delivery.",
      "Playwright concepts were explained with practical coding assignments.",
      "LinkedIn and resume mentoring improved my profile visibility.",
      "Mock interviews helped me handle HR and technical rounds."
    ],
    outcome: "Got offer from Accenture with 5.5 LPA salary."
  },
  {
    name: "Vignesh",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-7.jpeg",
    avatarBg: "#EDE9FE",
    avatarFg: "#4C1D95",
    tags: ["API Testing", "Playwright Core", "Reporting & Execution"],
    lines: [
      "I focused on building strong framework design fundamentals.",
      "The POM and Git workflows were taught with real scenarios.",
      "Hands-on practice improved my execution and debugging speed.",
      "Interview drills helped me explain decisions with confidence."
    ],
    outcome: "Got offer from Hexaware with 5.2 LPA salary."
  },
  {
    name: "Anu",
    role: "Manual Tester - 3 Years Experience",
    rating: 5,
    photo: "/testimonials/profile-8.jpeg",
    avatarBg: "#F1F5F9",
    avatarFg: "#334155",
    tags: ["TypeScript", "POM + OOPS", "Reporting & Execution"],
    lines: [
      "Coming from manual testing, I needed a structured roadmap.",
      "The program covered JavaScript, Playwright, reporting, and POM clearly.",
      "Assignments converted theory into practical implementation confidence.",
      "Interview coaching helped me shift into modern automation."
    ],
    outcome: "Got offer from Wipro with 9.2 LPA salary."
  },
  {
    name: "Deepa",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-9.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["Azure CI Pipeline", "Career & Placement", "CI/CD"],
    lines: [
      "I joined as a fresher seeking complete placement support.",
      "HR Bonus sessions improved confidence and interview communication.",
      "Technical practice helped me build stable Playwright workflows.",
      "Career guidance made my transition into QA much easier."
    ],
    outcome: "Got offer from UST Global with 5.7 LPA salary."
  },
  {
    name: "Nishanthi",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-10.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["POM + OOPS", "API Testing", "Azure CI Pipeline", "Playwright Core"],
    lines: [
      "Hands-on training made complex automation topics easier to apply.",
      "POM, API testing, BDD, and Azure topics were practical.",
      "Real project scenarios improved my confidence for interviews.",
      "Mentoring support helped me present skills professionally."
    ],
    outcome: "Got offer from Deloitte with 6 LPA salary."
  },
  {
    name: "Abirami",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-11.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["Azure CI Pipeline", "Git & GitHub Actions", "Reporting & Execution"],
    lines: [
      "I wanted market-aligned skills with modern automation practices.",
      "Real-time scenarios and Azure pipelines were covered thoroughly.",
      "Interview-focused sessions improved my confidence in discussions.",
      "Practical tasks helped me build job-ready experience."
    ],
    outcome: "Got offer from Persistent Systems with 5 LPA salary."
  },
  {
    name: "Kokila",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-12.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["Playwright Locators", "Element Handling", "Parallel Execution"],
    lines: [
      "The academy gave me complete job-oriented automation guidance.",
      "Mock interviews and resume reviews were highly valuable.",
      "Real-time framework coding improved my technical confidence.",
      "The structured approach made interview preparation much easier."
    ],
    outcome: "Got offer from HCL with 5 LPA salary."
  },
  {
    name: "Grace",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-13.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["Advanced Assertions", "Reporting & Execution", "Playwright Core"],
    lines: [
      "Trainer industry experience reflected in every practical session.",
      "Framework design and debugging practices were extremely useful.",
      "Best practices helped me write cleaner, stable automation.",
      "Interview guidance improved my confidence under pressure."
    ],
    outcome: "Got offer from Tech Mahindra with 4.5 LPA salary."
  },
  {
    name: "Balaji",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-14.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["POM + OOPS", "CI/CD", "Mock Interview"],
    lines: [
      "I benefited from interview-oriented and project-based preparation.",
      "The framework implementation modules were highly practical.",
      "Practice exercises improved both speed and code quality.",
      "Mentoring support helped me crack multiple interview rounds."
    ],
    outcome: "Got offer from Mphasis with 5.5 LPA salary."
  },
  {
    name: "Divya",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-15.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["JavaScript", "TypeScript", "Profile Optimization"],
    lines: [
      "Step-by-step teaching made Playwright learning very clear.",
      "JavaScript and framework basics were explained from scratch.",
      "Mock interviews improved confidence and answer structure.",
      "Hands-on projects prepared me for real testing tasks."
    ],
    outcome: "Got offer from Wipro with 4.8 LPA salary."
  },
  {
    name: "Suresh",
    role: "Automation Engineer - 4 Years Experience",
    rating: 5,
    photo: "/testimonials/profile-16.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["Playwright Core", "CI/CD", "Allure Reporting", "Git & GitHub Actions"],
    lines: [
      "I joined to improve confidence after difficult interview attempts.",
      "Playwright and CI/CD sessions clarified modern automation expectations.",
      "Scenario practice improved my troubleshooting and communication.",
      "The coaching helped me perform better in final rounds."
    ],
    outcome: "Got offer from Infosys with 12 LPA salary."
  },
  {
    name: "Keerthana",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-17.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["Career & Placement", "Mock Interview", "Playwright Core"],
    lines: [
      "Technical sessions were clear and easy to follow.",
      "HR mock interviews improved my communication quality significantly.",
      "Practice exercises strengthened my framework implementation skills.",
      "Guidance helped me approach interviews with confidence."
    ],
    outcome: "Got offer from Cognizant with 5 LPA salary."
  },
  {
    name: "Pavithra",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-18.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["Git & GitHub Actions", "Azure CI Pipeline", "Copilot + MCP + CODEX"],
    lines: [
      "The program provided complete automation and placement support.",
      "Playwright practice improved coding confidence and speed.",
      "Resume and LinkedIn optimization improved profile reach.",
      "Interview mentoring helped me answer real project questions."
    ],
    outcome: "Got offer from Capgemini with 4.6 LPA salary."
  },
  {
    name: "Meena",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-19.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["JavaScript", "Playwright Core", "Database Testing"],
    lines: [
      "I started with zero automation knowledge before joining.",
      "The trainer explained concepts from basics to advanced clearly.",
      "Hands-on sessions improved my confidence in implementation.",
      "Interview preparation helped me transition into testing roles."
    ],
    outcome: "Got offer from Capgemini with 4.5 LPA salary."
  },
  {
    name: "Karthik",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-20.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["POM + OOPS", "API Testing", "Career & Placement", "Parallel Execution"],
    lines: [
      "As a fresher, I needed clear direction to start.",
      "The academy built strong fundamentals with real project exposure.",
      "Practical sessions improved confidence in automation workflows.",
      "Mentoring helped me handle interviews with better clarity."
    ],
    outcome: "Got offer from Accenture with 5.5 LPA salary."
  },
  {
    name: "Praveen",
    role: "Fresher",
    rating: 5,
    photo: "/testimonials/profile-21.jpeg",
    avatarBg: "#D1FAE5",
    avatarFg: "#065F46",
    tags: ["CI/CD", "Git & GitHub Actions", "Career & Placement", "Profile Optimization"],
    lines: [
      "The course focused on what companies actually expect.",
      "Real-time scenarios and CI/CD basics were very useful.",
      "Practice tasks improved my technical confidence significantly.",
      "Interview sessions helped me present solutions effectively."
    ],
    outcome: "Got offer from Cognizant with 5 LPA salary."
  }
];

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

const unifiedTagClass =
  "inline-flex items-center rounded-lg border border-[#BFDBFE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F5F9_100%)] px-2.5 py-1 text-xs font-semibold leading-none text-[#1E3A8A] shadow-[0_1px_0_rgba(37,99,235,0.08)] transition-colors duration-200 hover:border-[#93C5FD] hover:bg-[#EFF6FF]";

function getAvatarDataUri(name, bg, fg) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
    <rect width='96' height='96' rx='48' fill='${bg}' />
    <text x='50%' y='54%' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif' font-size='32' font-weight='700' fill='${fg}'>${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function PlacementLogoTile({ logo }) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="flex h-20 w-[190px] shrink-0 items-center justify-center rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-4 shadow-[0_16px_30px_-22px_rgba(11,42,74,0.42)]">
      <img
        src={logo.src}
        alt={`${logo.name} logo`}
        loading="lazy"
        onError={() => setHidden(true)}
        className="max-h-10 w-auto max-w-[150px] object-contain"
      />
    </div>
  );
}

function TestimonialCard({ item, delay = 0 }) {
  const [imageError, setImageError] = useState(false);
  const avatarSrc = !imageError && item.photo
    ? item.photo
    : getAvatarDataUri(item.name, item.avatarBg, item.avatarFg);

  return (
    <motion.article
      {...withDelay(delay)}
      className="flex h-full flex-col rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-5 shadow-[0_16px_36px_-26px_rgba(11,42,74,0.42)] transition-[transform,box-shadow,border-color] duration-200 md:hover:-translate-y-0.5 md:hover:border-[#2563EB] md:hover:shadow-[0_20px_42px_-24px_rgba(37,99,235,0.32)]"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={avatarSrc}
          alt={`${item.name} profile photo`}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-24 w-24 rounded-full border border-[#DBEAFE] object-cover shadow-sm md:h-28 md:w-28"
        />
        <p className="mt-3 text-sm font-medium text-[#64748B]">{item.role}</p>
        <p className="mt-1 text-sm tracking-wide text-[#F59E0B]" aria-label={`Rating ${item.rating} out of 5`}>
          {"\u2605".repeat(item.rating)}
        </p>
        <h2 className="mt-2 text-lg font-bold text-[#0F172A]">{item.name}</h2>
      </div>

      <div className="mt-4 space-y-2 text-left text-sm leading-6 text-[#475569]">
        {item.lines.map((line, index) => (
          <p key={`${item.name}-${index}-${line}`}>{line}</p>
        ))}
      </div>

      <p className="mt-4 rounded-lg border border-[#93C5FD]/60 bg-[linear-gradient(90deg,rgba(37,99,235,0.12),rgba(37,99,235,0.02))] px-3 py-2.5 text-sm font-semibold leading-6 text-[#0B2A4A] shadow-[inset_3px_0_0_0_#2563EB]">
        Outcome: {item.outcome}
      </p>

      <div className="mt-auto flex min-h-[64px] flex-wrap content-start items-start justify-start gap-2 pt-4">
        {item.tags.map((tag) => (
          <span
            key={`${item.name}-${tag}`}
            className={unifiedTagClass}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default function TestimonialsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [testimonialPage, setTestimonialPage] = useState(1);
  const cardsPerPage = 3;

  const totalTestimonialPages = Math.max(1, Math.ceil(testimonials.length / cardsPerPage));

  const visibleTestimonials = useMemo(() => {
    const start = (testimonialPage - 1) * cardsPerPage;
    return testimonials.slice(start, start + cardsPerPage);
  }, [testimonialPage, cardsPerPage]);

  const visibleStart = (testimonialPage - 1) * cardsPerPage + 1;
  const visibleEnd = Math.min(testimonialPage * cardsPerPage, testimonials.length);

  const visiblePageNumbers = useMemo(() => {
    const start = Math.max(1, testimonialPage - 2);
    const end = Math.min(totalTestimonialPages, testimonialPage + 2);
    const pages = [];
    for (let page = start; page <= end; page += 1) pages.push(page);
    return pages;
  }, [testimonialPage, totalTestimonialPages]);

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
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm font-semibold transition-[background-color,color,transform] duration-200 ${
                        link.label === "Testimonials"
                          ? "bg-[linear-gradient(180deg,#EFF6FF_0%,#DBEAFE_100%)] text-[#1D4ED8] shadow-[0_8px_18px_-14px_rgba(37,99,235,0.8)]"
                          : "text-[#0F172A] hover:-translate-y-px hover:bg-[#F8FAFC] hover:text-[#2563EB]"
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
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-lg border px-3 py-2 text-center text-sm font-semibold transition-[transform,color] duration-200 ${
                      link.label === "Testimonials"
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

        <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8 lg:py-14">
          <div className="rounded-2xl border border-white/20 bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)] p-6 shadow-[0_24px_50px_-24px_rgba(11,42,74,0.82)] backdrop-blur-md sm:p-8">
            <motion.h1 {...revealProps} className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              What Our Learners Say
            </motion.h1>
            <motion.p
              {...revealProps}
              transition={{ ...revealProps.transition, delay: 0.05 }}
              className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg"
            >
              Real success stories from learners who transitioned from traditional testing to modern
              Playwright engineering with AI-assisted automation.
            </motion.p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
        <motion.section
          {...revealProps}
          className="mb-8 rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-6 shadow-[0_22px_46px_-30px_rgba(11,42,74,0.45)] sm:p-8"
        >
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Our Learners Are Placed At
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
            Trusted by top companies where our learners have successfully secured QA and automation
            roles.
          </p>

          <div className="relative mt-5 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(90deg,#FFFFFF_15%,transparent)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(270deg,#FFFFFF_15%,transparent)]" />

            <motion.div
              className="flex w-max gap-3 py-1"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            >
              {[...placementLogos, ...placementLogos].map((logo, index) => (
                <PlacementLogoTile key={`${logo.name}-${index}`} logo={logo} />
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          {...revealProps}
          className="rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-6 shadow-[0_22px_46px_-30px_rgba(11,42,74,0.45)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTestimonials.map((item, index) => (
              <TestimonialCard key={item.photo || item.name} item={item} delay={index * 0.08} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#334155]">
              Showing {visibleStart} to {visibleEnd} of {testimonials.length} testimonials
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTestimonialPage(1)}
                disabled={testimonialPage === 1}
                className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                First
              </button>
              <button
                type="button"
                onClick={() => setTestimonialPage((prev) => Math.max(1, prev - 1))}
                disabled={testimonialPage === 1}
                className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Prev
              </button>

              {visiblePageNumbers.map((pageNo) => (
                <button
                  key={pageNo}
                  type="button"
                  onClick={() => setTestimonialPage(pageNo)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    pageNo === testimonialPage
                      ? "bg-[#2563EB] text-white"
                      : "border border-[#BFDBFE] bg-white text-[#1D4ED8]"
                  }`}
                >
                  {pageNo}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setTestimonialPage((prev) => Math.min(totalTestimonialPages, prev + 1))
                }
                disabled={testimonialPage === totalTestimonialPages}
                className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setTestimonialPage(totalTestimonialPages)}
                disabled={testimonialPage === totalTestimonialPages}
                className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Last
              </button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}


