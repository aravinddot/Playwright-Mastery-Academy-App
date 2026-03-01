"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Practice", href: "/practice" }
];

const tableColumns = [
  { key: "timestamp", label: "Timestamp" },
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "experience", label: "Experience" },
  { key: "currentRole", label: "Current Role" },
  { key: "goal", label: "Goal" }
];

const sectionClass =
  "relative overflow-hidden rounded-2xl border border-[#D7E4F8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FBFF_100%)] p-6 shadow-[0_22px_48px_-30px_rgba(11,42,74,0.45)] sm:p-8";

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

function StatusChip({ label, value, isPositive }) {
  return (
    <div className="rounded-xl border border-[#DBEAFE] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</p>
      <p
        className={`mt-1 text-sm font-bold ${
          isPositive ? "text-[#1D4ED8]" : "text-[#B91C1C]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function toCsvValue(value) {
  const raw = String(value ?? "");
  if (raw.includes(",") || raw.includes("\"") || raw.includes("\n")) {
    return `"${raw.replace(/"/g, "\"\"")}"`;
  }
  return raw;
}

export default function AdminPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [statusError, setStatusError] = useState("");
  const [statusLoading, setStatusLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [leadsError, setLeadsError] = useState("");
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const loadStatus = async () => {
    setStatusError("");
    setStatusLoading(true);

    try {
      const response = await fetch("/api/admin/webhook-status", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to load database status.");
      setStatusData(data);
    } catch (error) {
      setStatusError(error.message || "Failed to load database status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const loadLeads = async () => {
    setLeadsError("");
    setLeadsLoading(true);

    try {
      const response = await fetch("/api/admin/leads", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to load leads.");
      setLeads(Array.isArray(data?.rows) ? data.rows : []);
    } catch (error) {
      setLeadsError(error.message || "Failed to load leads.");
      setLeads([]);
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return leads;

    return leads.filter((row) =>
      [row.fullName, row.email, row.phone, row.currentRole, row.goal, row.experience]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [leads, searchText]);

  const exportCsv = () => {
    const rows = filteredLeads;
    if (!rows.length) return;

    const csvHeaders = tableColumns.map((column) => column.label).join(",");
    const csvRows = rows.map((row) =>
      tableColumns.map((column) => toCsvValue(row[column.key])).join(",")
    );

    const csvContent = [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "enroll-leads.csv";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
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
                        className="block whitespace-nowrap rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/enroll"
                  aria-label="Open Enroll Page"
                  className="rounded-lg border border-[#1D4ED8]/70 bg-[linear-gradient(135deg,#2563EB_0%,#1D4ED8_55%,#1E40AF_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_-16px_rgba(37,99,235,0.9)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_20px_36px_-16px_rgba(37,99,235,0.92)]"
                >
                  Open Enroll
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
                      className="block rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A] transition-[transform,color] duration-200 hover:-translate-y-px hover:text-[#2563EB]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/enroll"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Open Enroll Page"
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-[#1D4ED8]/70 bg-[linear-gradient(135deg,#2563EB_0%,#1D4ED8_55%,#1E40AF_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_-18px_rgba(37,99,235,0.88)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_18px_34px_-18px_rgba(37,99,235,0.92)]"
              >
                Open Enroll
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
              Admin Dashboard
            </motion.h1>
            <motion.p
              {...revealProps}
              transition={{ ...revealProps.transition, delay: 0.06 }}
              className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg"
            >
              Access enroll audience data, verify PostgreSQL status, and export leads for
              follow-up.
            </motion.p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 lg:px-8 lg:py-12">
        <motion.section {...revealProps} className={sectionClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Database Health
            </h2>
            <button
              type="button"
              onClick={() => {
                loadStatus();
                loadLeads();
              }}
              className="rounded-lg border border-[#93C5FD] bg-white px-4 py-2 text-sm font-semibold text-[#1D4ED8] transition-colors duration-200 hover:bg-[#EFF6FF]"
            >
              Refresh Data
            </button>
          </div>

          {statusLoading ? (
            <p className="mt-4 text-sm text-[#64748B]">Loading database status...</p>
          ) : statusError ? (
            <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
              {statusError}
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatusChip
                label="Environment"
                value={statusData?.environment || "unknown"}
                isPositive
              />
              <StatusChip
                label="Postgres"
                value={statusData?.databaseConfigured ? "Connected" : "Not Configured"}
                isPositive={Boolean(statusData?.databaseConfigured)}
              />
              <StatusChip
                label="Database Host"
                value={statusData?.databaseHost || "not-available"}
                isPositive={Boolean(statusData?.databaseHost) && statusData?.databaseHost !== "not-configured"}
              />
              <StatusChip
                label="Total Leads"
                value={String(statusData?.totalLeads ?? 0)}
                isPositive={Number(statusData?.totalLeads ?? 0) > 0}
              />
            </div>
          )}
        </motion.section>

        <motion.section {...revealProps} className={sectionClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Enroll Audience Data
            </h2>
            <button
              type="button"
              onClick={exportCsv}
              disabled={!filteredLeads.length}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#93C5FD]"
            >
              Export CSV
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#475569]">
              Total Leads: <span className="font-bold text-[#1D4ED8]">{filteredLeads.length}</span>
            </p>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by name, email, phone, role..."
              className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none ring-[#93C5FD] focus:ring-2 sm:max-w-sm"
            />
          </div>

          {leadsLoading ? (
            <p className="mt-4 text-sm text-[#64748B]">Loading leads...</p>
          ) : leadsError ? (
            <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
              {leadsError}
            </p>
          ) : filteredLeads.length === 0 ? (
            <p className="mt-4 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#475569]">
              No leads found yet. Submit from the enroll page and refresh.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-[#D7E4F8] bg-white">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[#EFF6FF]">
                  <tr>
                    {tableColumns.map((column) => (
                      <th key={column.key} className="whitespace-nowrap border-b border-[#DBEAFE] px-3 py-2 font-bold text-[#0F172A]">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      {...withDelay(Math.min(index * 0.03, 0.2))}
                      key={`${lead.timestamp || "row"}-${lead.email || index}`}
                      className="odd:bg-white even:bg-[#F8FAFC]"
                    >
                      {tableColumns.map((column) => (
                        <td key={column.key} className="whitespace-nowrap border-b border-[#EEF2F7] px-3 py-2 text-[#334155]">
                          {lead[column.key] || "-"}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        <motion.section {...revealProps} className={sectionClass}>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Setup Notes
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[#475569] sm:text-base">
            <li>
              1. Leads are stored in PostgreSQL when users submit the enroll form.
            </li>
            <li>
              2. Open <code>/admin</code> to view, search, and export lead records.
            </li>
            <li>
              3. Set <code>DATABASE_URL</code> in your deployment environment.
            </li>
            <li>
              4. Refresh this page after updating env vars to validate DB connectivity.
            </li>
          </ul>
        </motion.section>
      </main>
    </div>
  );
}
