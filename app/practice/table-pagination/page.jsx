"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { savePracticeModuleProgress } from "../../../lib/practiceProgress";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Practice", href: "/practice" }
];

const roles = [
  "Manual Tester",
  "QA Engineer",
  "SDET",
  "Automation Engineer",
  "QA Analyst",
  "Test Lead"
];

const tracks = [
  "Playwright Core",
  "API + UI Automation",
  "POM + OOPS",
  "CI/CD Integration",
  "BDD Framework",
  "Copilot + MCP + CODEX"
];

const statuses = ["Active", "In Progress", "Needs Review", "Completed", "Placed"];

const companies = [
  "Accenture",
  "Cognizant",
  "Infosys",
  "TCS",
  "Wipro",
  "Deloitte",
  "Capgemini",
  "Tech Mahindra"
];

const cities = [
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Coimbatore",
  "Mumbai",
  "Noida",
  "Kochi"
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

const sectionClass =
  "relative overflow-hidden rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-6 shadow-[0_22px_48px_-30px_rgba(11,42,74,0.45)] sm:p-8";

const totalTableLabTasks = 3;

function buildRows(total = 3200) {
  return Array.from({ length: total }, (_, index) => {
    const rowNo = index + 1;
    const role = roles[rowNo % roles.length];
    const track = tracks[(rowNo * 2) % tracks.length];
    const status = statuses[(rowNo * 3) % statuses.length];
    const company = companies[(rowNo * 5) % companies.length];
    const city = cities[(rowNo * 7) % cities.length];
    const expYears = (rowNo % 9) + 1;
    const score = 60 + (rowNo % 41);
    const salary = (4.5 + ((rowNo * 9) % 120) / 10).toFixed(1);

    return {
      id: `LRN-${String(rowNo).padStart(4, "0")}`,
      name: `Learner ${String(rowNo).padStart(4, "0")}`,
      role,
      track,
      status,
      company,
      city,
      expYears,
      batch: `Batch-${2024 + (rowNo % 3)}-${String((rowNo % 12) + 1).padStart(2, "0")}`,
      score,
      salaryLpa: salary
    };
  });
}

function getExpLabel(value) {
  if (value === "0-2") return "0-2 Years";
  if (value === "3-5") return "3-5 Years";
  if (value === "6+") return "6+ Years";
  return "All Experience";
}

export default function TablePaginationPracticePage() {
  const data = useMemo(() => buildRows(3200), []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [trackFilter, setTrackFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("id-asc");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter, trackFilter, experienceFilter, sortBy, pageSize]);

  const filteredRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return data.filter((row) => {
      const roleMatch = roleFilter === "All" || row.role === roleFilter;
      const statusMatch = statusFilter === "All" || row.status === statusFilter;
      const trackMatch = trackFilter === "All" || row.track === trackFilter;

      let experienceMatch = true;
      if (experienceFilter === "0-2") experienceMatch = row.expYears <= 2;
      if (experienceFilter === "3-5") experienceMatch = row.expYears >= 3 && row.expYears <= 5;
      if (experienceFilter === "6+") experienceMatch = row.expYears >= 6;

      const searchMatch =
        !normalized ||
        row.id.toLowerCase().includes(normalized) ||
        row.name.toLowerCase().includes(normalized) ||
        row.role.toLowerCase().includes(normalized) ||
        row.track.toLowerCase().includes(normalized) ||
        row.company.toLowerCase().includes(normalized) ||
        row.city.toLowerCase().includes(normalized) ||
        row.batch.toLowerCase().includes(normalized);

      return roleMatch && statusMatch && trackMatch && experienceMatch && searchMatch;
    });
  }, [data, experienceFilter, roleFilter, search, statusFilter, trackFilter]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];

    if (sortBy === "id-asc") rows.sort((a, b) => a.id.localeCompare(b.id));
    if (sortBy === "id-desc") rows.sort((a, b) => b.id.localeCompare(a.id));
    if (sortBy === "exp-asc") rows.sort((a, b) => a.expYears - b.expYears);
    if (sortBy === "exp-desc") rows.sort((a, b) => b.expYears - a.expYears);
    if (sortBy === "score-desc") rows.sort((a, b) => b.score - a.score);
    if (sortBy === "salary-desc") rows.sort((a, b) => Number(b.salaryLpa) - Number(a.salaryLpa));

    return rows;
  }, [filteredRows, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    const filterTaskDone =
      search.trim().length > 0 ||
      roleFilter !== "All" ||
      statusFilter !== "All" ||
      trackFilter !== "All" ||
      experienceFilter !== "All";
    const sortTaskDone = sortBy !== "id-asc";
    const paginationTaskDone = currentPage > 1 || pageSize !== 25;
    const completedTasks = [filterTaskDone, sortTaskDone, paginationTaskDone].filter(Boolean).length;

    savePracticeModuleProgress("/practice/table-pagination", completedTasks, totalTableLabTasks);
  }, [
    search,
    roleFilter,
    statusFilter,
    trackFilter,
    experienceFilter,
    sortBy,
    currentPage,
    pageSize
  ]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedRows.length);
  const pageRows = sortedRows.slice(startIndex, endIndex);

  const visiblePageNumbers = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    const pages = [];
    for (let page = start; page <= end; page += 1) pages.push(page);
    return pages;
  }, [currentPage, totalPages]);

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
    setTrackFilter("All");
    setExperienceFilter("All");
    setSortBy("id-asc");
    setPageSize(25);
    setCurrentPage(1);
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
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm font-semibold transition-[background-color,color,transform] duration-200 ${
                        link.label === "Practice"
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
                className="rounded-lg border border-[#1D4ED8]/70 bg-[linear-gradient(135deg,#2563EB_0%,#1D4ED8_55%,#1E40AF_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_-16px_rgba(37,99,235,0.9)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_20px_36px_-16px_rgba(37,99,235,0.92)]"
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
                      link.label === "Practice"
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
              Advanced Table Pagination and Filtering Lab
            </motion.h1>
            <motion.p
              {...revealProps}
              transition={{ ...revealProps.transition, delay: 0.05 }}
              className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg"
            >
              Practice table automation with thousands of rows, multi-filter logic, sort controls,
              and page navigation patterns used in real automation projects.
            </motion.p>
            <motion.div
              {...revealProps}
              transition={{ ...revealProps.transition, delay: 0.1 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <span
                data-testid="dataset-total"
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm"
              >
                {data.length} Total Rows Loaded
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                Multi Filter
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                Pagination Controls
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                Playwright Ready Test IDs
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 lg:px-8 lg:py-12">
        <motion.section {...revealProps} className={sectionClass}>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Filter Controls
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
            Use combined filters to simulate enterprise table automation scenarios.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-semibold text-[#334155]">
              Search Learner / Role / Track
              <input
                type="text"
                data-testid="table-search-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by id, learner, role, track, city..."
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              />
            </label>

            <label className="text-sm font-semibold text-[#334155]">
              Role
              <select
                data-testid="filter-role"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              >
                <option value="All">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-[#334155]">
              Status
              <select
                data-testid="filter-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              >
                <option value="All">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-[#334155]">
              Track
              <select
                data-testid="filter-track"
                value={trackFilter}
                onChange={(event) => setTrackFilter(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              >
                <option value="All">All Tracks</option>
                {tracks.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-[#334155]">
              Experience
              <select
                data-testid="filter-experience"
                value={experienceFilter}
                onChange={(event) => setExperienceFilter(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              >
                <option value="All">All Experience</option>
                <option value="0-2">0-2 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="6+">6+ Years</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-[#334155]">
              Sort
              <select
                data-testid="filter-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              >
                <option value="id-asc">ID Asc</option>
                <option value="id-desc">ID Desc</option>
                <option value="exp-asc">Experience Asc</option>
                <option value="exp-desc">Experience Desc</option>
                <option value="score-desc">Score Desc</option>
                <option value="salary-desc">Salary Desc</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span
                data-testid="filtered-count"
                className="inline-flex rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1D4ED8]"
              >
                {sortedRows.length} Filtered Rows
              </span>
              <span className="inline-flex rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-semibold text-[#334155]">
                Experience: {getExpLabel(experienceFilter)}
              </span>
            </div>
            <button
              type="button"
              data-testid="filter-reset-btn"
              onClick={resetFilters}
              className="rounded-lg border border-[#BFDBFE] bg-white px-4 py-2 text-sm font-semibold text-[#1D4ED8] transition-colors duration-200 hover:bg-[#EFF6FF]"
            >
              Reset Filters
            </button>
          </div>
        </motion.section>

        <motion.section {...revealProps} className={sectionClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Large Data Table
            </h2>
            <label className="text-sm font-semibold text-[#334155]">
              Rows Per Page
              <select
                data-testid="page-size-select"
                value={String(pageSize)}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="ml-2 rounded-lg border border-[#CBD5E1] bg-white px-2 py-1 text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
          </div>

          <p className="mt-2 text-sm text-[#64748B]">
            Showing rows {sortedRows.length === 0 ? 0 : startIndex + 1} to {endIndex} of{" "}
            {sortedRows.length}.
          </p>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] shadow-[0_14px_30px_-24px_rgba(11,42,74,0.42)]">
            <table data-testid="advanced-table" className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-white text-[#334155]">
                  <th className="px-3 py-3 font-semibold">ID</th>
                  <th className="px-3 py-3 font-semibold">Learner</th>
                  <th className="px-3 py-3 font-semibold">Role</th>
                  <th className="px-3 py-3 font-semibold">Track</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Experience</th>
                  <th className="px-3 py-3 font-semibold">Company</th>
                  <th className="px-3 py-3 font-semibold">City</th>
                  <th className="px-3 py-3 font-semibold">Batch</th>
                  <th className="px-3 py-3 font-semibold">Score</th>
                  <th className="px-3 py-3 font-semibold">Salary LPA</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length ? (
                  pageRows.map((row, index) => (
                    <tr
                      key={row.id}
                      data-testid={`table-row-${row.id}`}
                      className={`border-b border-[#E2E8F0] text-[#475569] ${
                        index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"
                      }`}
                    >
                      <td className="px-3 py-2">{row.id}</td>
                      <td className="px-3 py-2 font-semibold text-[#0F172A]">{row.name}</td>
                      <td className="px-3 py-2">{row.role}</td>
                      <td className="px-3 py-2">{row.track}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2 py-0.5 text-xs font-semibold text-[#1D4ED8]">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">{row.expYears} yrs</td>
                      <td className="px-3 py-2">{row.company}</td>
                      <td className="px-3 py-2">{row.city}</td>
                      <td className="px-3 py-2">{row.batch}</td>
                      <td className="px-3 py-2">{row.score}</td>
                      <td className="px-3 py-2">{row.salaryLpa}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-sm font-semibold text-[#64748B]">
                      No data matched the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p data-testid="pagination-current" className="text-sm font-semibold text-[#334155]">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                data-testid="pagination-first"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                First
              </button>
              <button
                type="button"
                data-testid="pagination-prev"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Prev
              </button>

              {visiblePageNumbers.map((pageNo) => (
                <button
                  key={pageNo}
                  type="button"
                  data-testid={`pagination-page-${pageNo}`}
                  onClick={() => setCurrentPage(pageNo)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    pageNo === currentPage
                      ? "bg-[#2563EB] text-white"
                      : "border border-[#BFDBFE] bg-white text-[#1D4ED8]"
                  }`}
                >
                  {pageNo}
                </button>
              ))}

              <button
                type="button"
                data-testid="pagination-next"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
              </button>
              <button
                type="button"
                data-testid="pagination-last"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Last
              </button>
            </div>
          </div>
        </motion.section>

        <motion.section {...revealProps} className={sectionClass}>
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Dedicated Practice Modules
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
              Open each practice module in its own page for focused learning and cleaner navigation.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Link
              href="/practice/locator-arena"
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-[#93C5FD] hover:shadow-sm"
            >
              Open Locator Lab
            </Link>
            <Link
              href="/practice/sandbox-basic"
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-[#93C5FD] hover:shadow-sm"
            >
              Open Sandbox Basic
            </Link>
            <Link
              href="/practice/sandbox-advanced"
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-[#93C5FD] hover:shadow-sm"
            >
              Open Sandbox Advanced
            </Link>
            <Link
              href="/practice/network-mocking"
              data-testid="network-mocking-link"
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-[#93C5FD] hover:shadow-sm"
            >
              Open Network Lab
            </Link>
            <Link
              href="/practice/table-pagination"
              data-testid="table-pagination-link"
              className="rounded-lg border border-[#93C5FD] bg-[#EFF6FF] px-3 py-2 text-center text-sm font-semibold text-[#1D4ED8] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-[#93C5FD] hover:shadow-sm"
            >
              Open Table Lab
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

