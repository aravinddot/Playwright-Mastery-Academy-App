"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const adminNavLinks = [
  { label: "Meta Ads Analysis", href: "/admin" },
  { label: "Lead Flow Graph", href: "/admin/flow" },
  { label: "Leads Table", href: "/admin/table" }
];
const ADMIN_AUTH_CACHE_KEY = "pma_admin_auth_ok";

const callStatusOptions = ["Not Called", "Attempted", "Connected", "Follow-up Needed", "Not Reachable"];
const interestStatusOptions = ["Not Assessed", "Not Interested", "Interested", "Highly Interested"];
const joinStatusOptions = ["Pending", "Joined", "Lost"];
const joinTimelineOptions = ["", "Within 3 Days", "Within 1 Week", "Within 2 Weeks", "Within 1 Month", "Not Sure"];
const COURSE_FEE_INR = 14999;

const tableColumns = [
  { key: "timestamp", label: "Timestamp" },
  { key: "fullName", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "callStatus", label: "Call Status" },
  { key: "interestStatus", label: "Interest" },
  { key: "joinTimeline", label: "Join Timeline" },
  { key: "joinStatus", label: "Join Status" },
  { key: "nextFollowUp", label: "Next Follow-up" },
  { key: "callNotes", label: "Call Notes" }
];

function formatTableTimestamp(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
    .format(date)
    .replace("AM", "am")
    .replace("PM", "pm");
}

function toDateInputValue(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isInterestedStatus(value) {
  const text = String(value || "");
  return text === "Interested" || text === "Highly Interested";
}

function getOverdueDays(nextFollowUp, joinStatus, todayStart) {
  const status = String(joinStatus || "");
  if (status === "Joined" || status === "Lost") return 0;
  const key = toDateInputValue(nextFollowUp);
  if (!key) return 0;

  const followDate = new Date(`${key}T00:00:00`);
  if (Number.isNaN(followDate.getTime())) return 0;

  const diffMs = todayStart.getTime() - followDate.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  return diffDays > 0 ? diffDays : 0;
}

function formatPercent(part, total) {
  if (!total) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

function formatInr(value) {
  const num = Number(value || 0);
  const safe = Number.isFinite(num) ? Math.max(0, Math.round(num)) : 0;
  return `INR ${new Intl.NumberFormat("en-IN").format(safe)}`;
}

function hasFeePaid(callNotes, joinStatus) {
  if (String(joinStatus || "") === "Joined") return true;
  const notes = String(callNotes || "").toLowerCase();
  if (!notes) return false;
  if (/\b(not paid|payment pending|pending payment)\b/i.test(notes)) return false;
  return /\b(paid|payment done|fee paid|fees paid|advance paid|full payment)\b/i.test(notes);
}

function toSafePercent(value, total) {
  if (!total) return 0;
  const percent = (Number(value || 0) / Number(total || 0)) * 100;
  if (!Number.isFinite(percent)) return 0;
  return Math.max(0, Math.min(100, percent));
}

function buildSparklineData(values, width = 320, height = 110, padding = 12) {
  const source = Array.isArray(values) && values.length > 0 ? values : [0];
  const safeValues = source.map((v) => (Number.isFinite(Number(v)) ? Number(v) : 0));
  const max = Math.max(1, ...safeValues);
  const step = safeValues.length > 1 ? (width - padding * 2) / (safeValues.length - 1) : 0;

  const points = safeValues.map((value, index) => {
    const x = padding + index * step;
    const y = height - padding - (value / max) * (height - padding * 2);
    return { x, y, value };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const linePath = points.length ? `M ${points[0].x} ${points[0].y} ${points.slice(1).map((point) => `L ${point.x} ${point.y}`).join(" ")}` : "";
  const areaPath = points.length
    ? `M ${points[0].x} ${height - padding} ${points.map((point) => `L ${point.x} ${point.y}`).join(" ")} L ${points[points.length - 1].x} ${height - padding} Z`
    : "";

  return {
    width,
    height,
    points,
    linePoints,
    linePath,
    areaPath
  };
}

function toCsvValue(value) {
  const raw = String(value ?? "");
  if (raw.includes(",") || raw.includes("\"") || raw.includes("\n")) {
    return `"${raw.replace(/"/g, "\"\"")}"`;
  }
  return raw;
}

function badgeClass(type, value) {
  const text = String(value || "");
  if (type === "callStatus") {
    if (text === "Connected") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (text === "Follow-up Needed") return "border-blue-200 bg-blue-50 text-blue-700";
    if (text === "Attempted") return "border-amber-200 bg-amber-50 text-amber-700";
    if (text === "Not Reachable") return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (type === "interestStatus") {
    if (text === "Highly Interested") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (text === "Interested") return "border-blue-200 bg-blue-50 text-blue-700";
    if (text === "Not Interested") return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (type === "joinStatus") {
    if (text === "Joined") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (text === "Lost") return "border-rose-200 bg-rose-50 text-rose-700";
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function Icon({ type }) {
  if (type === "view") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
        <path d="M1.7 10s2.8-5 8.3-5 8.3 5 8.3 5-2.8 5-8.3 5-8.3-5-8.3-5Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path d="M3 14.8V17h2.2l8.1-8.1-2.2-2.2L3 14.8Zm11.7-6.4 1-1a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0l-1 1 2.8 2.8Z" fill="currentColor" />
    </svg>
  );
}

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDateValue(value) {
  const raw = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [year, month, day] = raw.split("-").map((part) => Number(part));
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function toDateValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDateDisplay(value) {
  const date = parseDateValue(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function AdvancedDatePicker({ value, onChange, min, max, placeholder }) {
  const wrapperRef = useRef(null);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const minDate = useMemo(() => parseDateValue(min), [min]);
  const maxDate = useMemo(() => parseDateValue(max), [max]);
  const [isOpen, setIsOpen] = useState(false);

  const initialDate = selectedDate || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    const baseDate = selectedDate || new Date();
    setViewYear(baseDate.getFullYear());
    setViewMonth(baseDate.getMonth());
  }, [value, isOpen, selectedDate]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = 42;

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const minYear = minDate ? minDate.getFullYear() : currentYear - 15;
    const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 15;
    const safeStart = Math.min(minYear, currentYear - 5);
    const safeEnd = Math.max(maxYear, currentYear + 8);
    return Array.from({ length: safeEnd - safeStart + 1 }, (_, index) => safeStart + index);
  }, [minDate, maxDate]);

  const isDateDisabled = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const setMonthView = (year, month) => {
    const normalized = new Date(year, month, 1);
    setViewYear(normalized.getFullYear());
    setViewMonth(normalized.getMonth());
  };

  const goToPreviousMonth = () => {
    setMonthView(viewYear, viewMonth - 1);
  };

  const goToNextMonth = () => {
    setMonthView(viewYear, viewMonth + 1);
  };

  const applyDate = (date) => {
    if (isDateDisabled(date)) return;
    onChange(toDateValue(date));
    setIsOpen(false);
  };

  const clearDate = () => {
    onChange("");
    setIsOpen(false);
  };

  const dayCells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - firstDayOfWeek + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;
    return new Date(viewYear, viewMonth, dayNumber);
  });

  return (
    <div ref={wrapperRef} className="relative mt-1.5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-left text-sm shadow-inner outline-none transition-all duration-200 hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
      >
        <span className={value ? "text-[#0F172A]" : "text-slate-500"}>{value ? formatDateDisplay(value) : placeholder}</span>
        <span className="absolute inset-y-1 right-1 inline-flex w-9 items-center justify-center rounded-lg border border-blue-200/70 bg-blue-50 text-blue-700">
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path d="M6 2v2M14 2v2M3 7h14M5 4h10a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[312px] rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.6)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100"
              aria-label="Previous month"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path d="M12.5 15 7.5 10l5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-blue-300"
            >
              {monthLabels.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-blue-300"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={goToNextMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100"
              aria-label="Next month"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path d="m7.5 15 5-5-5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {weekdayLabels.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {dayCells.map((date, index) => {
              if (!date) {
                return <span key={`empty-${index}`} className="h-8 rounded-md" />;
              }
              const disabled = isDateDisabled(date);
              const selected = selectedDate && toDateValue(date) === toDateValue(selectedDate);
              return (
                <button
                  key={toDateValue(date)}
                  type="button"
                  disabled={disabled}
                  onClick={() => applyDate(date)}
                  className={`h-8 rounded-md text-xs font-semibold transition-all ${
                    selected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_20px_-14px_rgba(37,99,235,0.95)]"
                      : disabled
                        ? "cursor-not-allowed bg-slate-100 text-slate-300"
                        : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={clearDate}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => applyDate(new Date())}
              className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
            >
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const [leads, setLeads] = useState([]);
  const [leadsError, setLeadsError] = useState("");
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [callStatusFilter, setCallStatusFilter] = useState("All");
  const [interestFilter, setInterestFilter] = useState("All");
  const [joinStatusFilter, setJoinStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [callbacksPage, setCallbacksPage] = useState(1);
  const [overduePage, setOverduePage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [leadPreview, setLeadPreview] = useState(null);
  const [leadEditor, setLeadEditor] = useState(null);

  const checkAdminSession = async ({ showLoader = true } = {}) => {
    setAuthError("");
    if (showLoader) setAuthLoading(true);
    try {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      const data = await response.json();
      const ok = Boolean(data?.authenticated);
      setIsAuthenticated(ok);
      if (typeof window !== "undefined") {
        if (ok) {
          window.sessionStorage.setItem(ADMIN_AUTH_CACHE_KEY, "1");
        } else {
          window.sessionStorage.removeItem(ADMIN_AUTH_CACHE_KEY);
        }
      }
      return ok;
    } catch {
      setIsAuthenticated(false);
      setAuthError("Failed to validate admin session.");
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(ADMIN_AUTH_CACHE_KEY);
      }
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const loadLeads = async () => {
    setLeadsError("");
    setLeadsLoading(true);
    try {
      const response = await fetch(`/api/admin/leads?ts=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-store" }
      });
      const data = await response.json();
      if (response.status === 401) {
        setIsAuthenticated(false);
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(ADMIN_AUTH_CACHE_KEY);
        }
        throw new Error("Session expired. Please login again.");
      }
      if (!response.ok) throw new Error(data?.error || "Failed to load leads.");
      setLeads(Array.isArray(data?.rows) ? data.rows : []);
    } catch (error) {
      setLeads([]);
      setLeadsError(error.message || "Failed to load leads.");
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const hasCachedAuth = typeof window !== "undefined" && window.sessionStorage.getItem(ADMIN_AUTH_CACHE_KEY) === "1";
      if (hasCachedAuth) {
        setIsAuthenticated(true);
        setAuthLoading(false);
      }
      const ok = await checkAdminSession({ showLoader: !hasCachedAuth });
      if (ok) await loadLeads();
      else setLeadsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, isAuthenticated]);

  const submitLogin = async (event) => {
    event.preventDefault();
    setAuthError("");
    setIsLoginSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Admin login failed.");
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(ADMIN_AUTH_CACHE_KEY, "1");
      }
      setLoginForm({ username: "", password: "" });
      await loadLeads();
    } catch (error) {
      setAuthError(error.message || "Admin login failed.");
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const logoutAdmin = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(ADMIN_AUTH_CACHE_KEY);
    }
    setLeads([]);
    setLeadPreview(null);
    setLeadEditor(null);
    router.push("/admin");
  };

  const refreshAdminData = async () => {
    if (isRefreshing || leadsLoading) return;
    setIsRefreshing(true);
    setSaveError("");
    setSaveMessage("");
    try {
      await loadLeads();
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const dateFilteredLeads = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59.999`) : null;

    return leads.filter((row) => {
      const createdAt = new Date(row.timestamp);
      if (Number.isNaN(createdAt.getTime())) return false;
      if (from && createdAt < from) return false;
      if (to && createdAt > to) return false;
      return true;
    });
  }, [leads, fromDate, toDate]);

  const filteredLeads = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return dateFilteredLeads.filter((row) => {
      const queryOk =
        !query ||
        [row.fullName, row.phone, row.email, row.callStatus, row.interestStatus, row.joinStatus, row.callNotes, row.campaignName]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const callOk = callStatusFilter === "All" || String(row.callStatus || "") === callStatusFilter;
      const interestOk = interestFilter === "All" || String(row.interestStatus || "") === interestFilter;
      const joinOk = joinStatusFilter === "All" || String(row.joinStatus || "") === joinStatusFilter;
      return queryOk && callOk && interestOk && joinOk;
    });
  }, [dateFilteredLeads, searchText, callStatusFilter, interestFilter, joinStatusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, callStatusFilter, interestFilter, joinStatusFilter, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLeads.slice(start, start + rowsPerPage);
  }, [filteredLeads, currentPage, rowsPerPage]);

  const paginationInfo = useMemo(() => {
    if (!filteredLeads.length) return { start: 0, end: 0 };
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, filteredLeads.length);
    return { start, end };
  }, [filteredLeads.length, currentPage, rowsPerPage]);

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const total = dateFilteredLeads.length;
    const notCalled = dateFilteredLeads.filter((x) => String(x.callStatus || "") === "Not Called").length;
    const interested = dateFilteredLeads.filter((x) => ["Interested", "Highly Interested"].includes(String(x.interestStatus || ""))).length;
    const joinSoon = dateFilteredLeads.filter((x) => ["Within 3 Days", "Within 1 Week"].includes(String(x.joinTimeline || ""))).length;
    const joined = dateFilteredLeads.filter((x) => String(x.joinStatus || "") === "Joined").length;
    return { total, notCalled, interested, joinSoon, joined };
  }, [dateFilteredLeads]);

  const chartMetrics = useMemo(() => {
    const totalLeads = dateFilteredLeads.length;
    const interested = dateFilteredLeads.filter((lead) => isInterestedStatus(lead.interestStatus)).length;
    const notInterested = dateFilteredLeads.filter((lead) => String(lead.interestStatus || "") === "Not Interested").length;
    const joined = dateFilteredLeads.filter((lead) => String(lead.joinStatus || "") === "Joined").length;
    const feesPaidCount = dateFilteredLeads.filter((lead) => hasFeePaid(lead.callNotes, lead.joinStatus)).length;
    const incomeGenerated = feesPaidCount * COURSE_FEE_INR;
    const potentialIncome = totalLeads * COURSE_FEE_INR;

    return {
      totalLeads,
      interested,
      notInterested,
      joined,
      feesPaidCount,
      incomeGenerated,
      potentialIncome
    };
  }, [dateFilteredLeads]);

  const chartTrend = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const buckets = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return {
        key: getDateKey(date),
        label: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        newLeads: 0,
        joined: 0,
        feesPaid: 0,
        income: 0
      };
    });

    const map = new Map(buckets.map((bucket) => [bucket.key, bucket]));
    dateFilteredLeads.forEach((lead) => {
      const createdAt = new Date(lead.timestamp);
      const key = getDateKey(createdAt);
      const bucket = map.get(key);
      if (!bucket) return;

      bucket.newLeads += 1;
      if (String(lead.joinStatus || "") === "Joined") bucket.joined += 1;
      if (hasFeePaid(lead.callNotes, lead.joinStatus)) bucket.feesPaid += 1;
    });

    return buckets.map((bucket) => ({
      ...bucket,
      income: bucket.feesPaid * COURSE_FEE_INR
    }));
  }, [dateFilteredLeads]);

  const leadTrendGraph = useMemo(
    () => buildSparklineData(chartTrend.map((item) => item.newLeads)),
    [chartTrend]
  );

  const incomeTrendGraph = useMemo(
    () => buildSparklineData(chartTrend.map((item) => item.income)),
    [chartTrend]
  );

  const marketingFlow = useMemo(() => {
    const total = dateFilteredLeads.length;
    const contacted = dateFilteredLeads.filter((lead) => {
      const status = String(lead.callStatus || "");
      return status === "Connected" || status === "Follow-up Needed" || status === "Attempted";
    }).length;
    const interested = dateFilteredLeads.filter((lead) => isInterestedStatus(lead.interestStatus)).length;
    const joined = dateFilteredLeads.filter((lead) => String(lead.joinStatus || "") === "Joined").length;

    const baseStages = [
      { id: "leads", label: "New Leads", count: total, tone: "from-slate-500 to-slate-700" },
      { id: "contacted", label: "Contacted", count: contacted, tone: "from-blue-500 to-blue-700" },
      { id: "interested", label: "Interested", count: interested, tone: "from-indigo-500 to-indigo-700" },
      { id: "joined", label: "Joined", count: joined, tone: "from-emerald-500 to-emerald-700" }
    ];

    return baseStages.map((stage, index) => {
      const percent = total > 0 ? (stage.count / total) * 100 : 0;
      const previousCount = index === 0 ? stage.count : baseStages[index - 1].count;
      const dropOff = Math.max(previousCount - stage.count, 0);
      const widthPercent = stage.count > 0 ? Math.max(percent, 10) : 0;

      return {
        ...stage,
        percentLabel: `${percent.toFixed(1)}%`,
        dropOff,
        widthPercent
      };
    });
  }, [dateFilteredLeads]);

  const conversionMetrics = useMemo(() => {
    const now = new Date();
    const todayKey = getDateKey(now);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    const dayLeads = dateFilteredLeads.filter((lead) => getDateKey(new Date(lead.timestamp)) === todayKey);
    const weekLeads = dateFilteredLeads.filter((lead) => {
      const createdAt = new Date(lead.timestamp);
      return !Number.isNaN(createdAt.getTime()) && createdAt >= weekStart && createdAt <= now;
    });

    const dayInterested = dayLeads.filter((lead) => isInterestedStatus(lead.interestStatus)).length;
    const dayJoined = dayLeads.filter((lead) => String(lead.joinStatus || "") === "Joined").length;

    const weekInterested = weekLeads.filter((lead) => isInterestedStatus(lead.interestStatus)).length;
    const weekJoined = weekLeads.filter((lead) => String(lead.joinStatus || "") === "Joined").length;

    return {
      dayTotal: dayLeads.length,
      weekTotal: weekLeads.length,
      dayInterestedPct: formatPercent(dayInterested, dayLeads.length),
      dayJoinedPct: formatPercent(dayJoined, dayLeads.length),
      weekInterestedPct: formatPercent(weekInterested, weekLeads.length),
      weekJoinedPct: formatPercent(weekJoined, weekLeads.length)
    };
  }, [dateFilteredLeads]);

  const todayCallbacks = useMemo(() => {
    const todayKey = getDateKey(new Date());
    return dateFilteredLeads
      .filter((lead) => {
        const status = String(lead.joinStatus || "");
        if (status === "Joined" || status === "Lost") return false;
        return toDateInputValue(lead.nextFollowUp) === todayKey;
      })
      .sort((a, b) => {
        const aInt = isInterestedStatus(a.interestStatus) ? 1 : 0;
        const bInt = isInterestedStatus(b.interestStatus) ? 1 : 0;
        return bInt - aInt;
      });
  }, [dateFilteredLeads]);

  const slaSummary = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let warning = 0;
    let critical = 0;

    const overdueLeads = dateFilteredLeads
      .map((lead) => {
        const overdueDays = getOverdueDays(lead.nextFollowUp, lead.joinStatus, todayStart);
        return { ...lead, overdueDays };
      })
      .filter((lead) => lead.overdueDays > 0)
      .sort((a, b) => b.overdueDays - a.overdueDays);

    overdueLeads.forEach((lead) => {
      if (lead.overdueDays >= 3) critical += 1;
      else warning += 1;
    });

    return {
      total: overdueLeads.length,
      warning,
      critical,
      overdueLeads
    };
  }, [dateFilteredLeads]);

  const queuePageSize = 8;
  const callbacksTotalPages = Math.max(1, Math.ceil(todayCallbacks.length / queuePageSize));
  const overdueTotalPages = Math.max(1, Math.ceil(slaSummary.overdueLeads.length / queuePageSize));

  useEffect(() => {
    setCallbacksPage((prev) => Math.min(prev, callbacksTotalPages));
  }, [callbacksTotalPages]);

  useEffect(() => {
    setOverduePage((prev) => Math.min(prev, overdueTotalPages));
  }, [overdueTotalPages]);

  const paginatedCallbacks = useMemo(() => {
    const start = (callbacksPage - 1) * queuePageSize;
    return todayCallbacks.slice(start, start + queuePageSize);
  }, [todayCallbacks, callbacksPage]);

  const paginatedOverdue = useMemo(() => {
    const start = (overduePage - 1) * queuePageSize;
    return slaSummary.overdueLeads.slice(start, start + queuePageSize);
  }, [slaSummary.overdueLeads, overduePage]);

  const exportCsv = () => {
    const exportRows = currentAdminView === "table" ? paginatedLeads : dateFilteredLeads;
    if (!exportRows.length) return;
    const headers = ["Timestamp", "Name", "Phone", "Email", "Call Status", "Interest", "Join Timeline", "Join Status", "Next Follow-up", "Call Notes", "Lead Source", "Campaign"];
    const rows = exportRows.map((row) => [
      formatTableTimestamp(row.timestamp),
      row.fullName,
      row.phone,
      row.email,
      row.callStatus,
      row.interestStatus,
      row.joinTimeline,
      row.joinStatus,
      row.nextFollowUp,
      row.callNotes,
      row.leadSource,
      row.campaignName
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map(toCsvValue).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "digital-marketing-leads.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openLeadEditor = (lead) => {
    setSaveError("");
    setSaveMessage("");
    setLeadEditor({
      id: String(lead.id || ""),
      fullName: String(lead.fullName || ""),
      phone: String(lead.phone || ""),
      callStatus: String(lead.callStatus || "Not Called"),
      interestStatus: String(lead.interestStatus || "Not Assessed"),
      joinTimeline: String(lead.joinTimeline || ""),
      joinStatus: String(lead.joinStatus || "Pending"),
      nextFollowUp: toDateInputValue(lead.nextFollowUp),
      callNotes: String(lead.callNotes || ""),
      leadSource: String(lead.leadSource || "Meta Ads"),
      campaignName: String(lead.campaignName || "")
    });
  };

  const onEditorChange = (key, value) => {
    setLeadEditor((prev) => (prev ? { ...prev, [key]: key === "callNotes" ? String(value || "").slice(0, 1000) : value } : prev));
  };

  const saveLeadUpdate = async () => {
    if (!leadEditor?.id || saveBusy) return;
    setSaveBusy(true);
    setSaveError("");
    setSaveMessage("");
    try {
      const payload = {
        callStatus: leadEditor.callStatus,
        interestStatus: leadEditor.interestStatus,
        joinTimeline: leadEditor.joinTimeline,
        joinStatus: leadEditor.joinStatus,
        nextFollowUp: leadEditor.nextFollowUp,
        callNotes: leadEditor.callNotes,
        leadSource: leadEditor.leadSource,
        campaignName: leadEditor.campaignName,
        lastContactedAt: leadEditor.callStatus !== "Not Called" ? new Date().toISOString() : null,
        action: "call_followup_updated"
      };
      const response = await fetch(`/api/admin/leads/${encodeURIComponent(leadEditor.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to save update.");
      if (data?.row?.id) {
        const rowId = String(data.row.id);
        setLeads((prev) => prev.map((lead) => (String(lead.id) === rowId ? data.row : lead)));
      } else {
        await loadLeads();
      }
      setLeadEditor(null);
      setSaveMessage("Lead follow-up updated successfully.");
    } catch (error) {
      setSaveError(error.message || "Failed to save update.");
    } finally {
      setSaveBusy(false);
    }
  };

  const leadMixInterestedPct = toSafePercent(chartMetrics.interested, chartMetrics.totalLeads);
  const leadMixNotInterestedPct = toSafePercent(chartMetrics.notInterested, chartMetrics.totalLeads);
  const leadMixNeutralCount = Math.max(chartMetrics.totalLeads - chartMetrics.interested - chartMetrics.notInterested, 0);
  const leadMixNeutralPct = toSafePercent(leadMixNeutralCount, chartMetrics.totalLeads);
  const joinedPct = toSafePercent(chartMetrics.joined, chartMetrics.totalLeads);
  const feesPaidPct = toSafePercent(chartMetrics.feesPaidCount, chartMetrics.totalLeads);
  const incomeRealizationPct = toSafePercent(chartMetrics.incomeGenerated, chartMetrics.potentialIncome);
  const currentAdminView = pathname?.startsWith("/admin/flow")
    ? "flow"
    : pathname?.startsWith("/admin/table")
      ? "table"
      : "analysis";
  const effectiveAdminView = isAuthenticated ? currentAdminView : "analysis";
  const showAnalysisSection = currentAdminView === "analysis";
  const showFlowSection = currentAdminView === "flow";
  const showTableSection = currentAdminView === "table";
  const hasDateFilter = Boolean(fromDate || toDate);
  const sectionTitle =
    currentAdminView === "flow"
      ? "Lead Flow Graph"
      : currentAdminView === "table"
        ? "Leads Table"
        : "Meta Ads Lead Analysis";
  const isUnauthenticatedView = !authLoading && !isAuthenticated;
  const bannerTitle =
    effectiveAdminView === "flow"
      ? "Lead Flow & Follow-up Tracker"
      : effectiveAdminView === "table"
        ? "Lead Table & Conversion Records"
        : isAuthenticated
          ? "Meta Ads Lead Intelligence Dashboard"
          : "Admin Secure Access";
  const bannerSubtitle =
    effectiveAdminView === "flow"
      ? "Track lead movement, callbacks, and overdue follow-ups to improve day-to-day conversion outcomes."
      : effectiveAdminView === "table"
        ? "Review paginated lead data, update call outcomes, and export the current page for reporting."
        : isAuthenticated
          ? "Monitor campaign lead inflow, quality signals, and conversion momentum to prioritize follow-ups and close enrollments faster."
          : "Login to access campaign analytics, lead flow insights, callback queue, and conversion tracking.";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_right,#dbeafe_0%,#eef4ff_22%,#f8fafc_52%,#f8fafc_100%)] text-[#0F172A]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-16 top-24 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[-48px] h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/3 h-80 w-80 rounded-full bg-cyan-200/25 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 shadow-[0_12px_34px_-22px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center" aria-label="Playwright Mastery Academy Home">
            <Image src="/company-logo.png" alt="Playwright Mastery Academy" width={260} height={88} className="h-12 w-auto sm:h-16" priority unoptimized />
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:min-w-[620px] sm:justify-end">
              <nav className="hidden items-center gap-2 sm:flex">
                {adminNavLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex min-w-[152px] items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      pathname === item.href
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_20px_-14px_rgba(37,99,235,0.95)]"
                        : "text-[#0F172A] hover:-translate-y-px hover:bg-slate-100 hover:text-[#2563EB]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <button
                onClick={logoutAdmin}
                className="hidden w-[112px] rounded-lg border border-rose-200/80 bg-white/90 px-3 py-2 text-center text-xs font-semibold text-rose-700 shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md sm:inline-flex sm:items-center sm:justify-center sm:text-sm"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle admin menu"
                aria-expanded={isMobileMenuOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm sm:hidden"
              >
                {isMobileMenuOpen ? (
                  <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
                    <path d="M5 5 15 15M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
                    <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          ) : null}
        </div>
        {isAuthenticated && isMobileMenuOpen ? (
          <div className="border-t border-white/70 px-4 py-2 sm:hidden">
            <div className="mx-auto grid w-full max-w-7xl gap-2">
              {adminNavLinks.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_18px_-14px_rgba(37,99,235,0.95)]"
                      : "bg-white/80 text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={logoutAdmin}
                className="rounded-lg border border-rose-200/80 bg-white/90 px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <section className="relative border-b border-[#0b2a4a]/25 bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_55%,#1E40AF_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,219,254,0.24)_0%,transparent_38%),radial-gradient(circle_at_78%_32%,rgba(186,230,253,0.2)_0%,transparent_36%)]" />
        <div className={`mx-auto w-full max-w-7xl px-6 lg:px-8 ${isUnauthenticatedView ? "py-6" : "py-10"}`}>
          <div className={`relative flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/25 bg-white/10 shadow-[0_28px_55px_-36px_rgba(15,23,42,0.85)] backdrop-blur ${isUnauthenticatedView ? "p-5" : "p-6"}`}>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{bannerTitle}</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/90 sm:text-base">
                {bannerSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className={isAuthenticated ? "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" : "mx-auto grid w-full max-w-7xl min-h-[calc(100vh-280px)] place-items-center px-4 py-6 sm:px-6 lg:px-8"}>
        {authLoading ? (
          <div className="rounded-2xl border border-white/70 bg-white/85 p-6 text-sm text-slate-700 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.55)] backdrop-blur">Checking admin session...</div>
        ) : !isAuthenticated ? (
          <form onSubmit={submitLogin} className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[0_32px_64px_-36px_rgba(15,23,42,0.65)] backdrop-blur md:grid-cols-[1.05fr_1fr]">
            <div className="hidden border-r border-white/25 bg-[linear-gradient(145deg,#0B2A4A_0%,#1E3A8A_65%,#2563EB_100%)] p-7 text-white md:block">
              <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100">
                Secure Access
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight">Welcome Back, Admin</h2>
              <p className="mt-3 text-sm leading-relaxed text-blue-100/95">
                Sign in to review Meta leads, update follow-ups, and track conversion performance with real-time visibility.
              </p>
              <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/90">Command Center</p>
                <p className="mt-2 text-sm text-white/90">Analysis, flow tracking, callbacks, overdue queue, and lead table in one place.</p>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <h2 className="text-3xl font-black tracking-tight text-[#0F172A]">Admin Login</h2>
              <p className="mt-1 text-sm text-slate-600">Sign in to manage lead calls and conversion tracking.</p>
              <label className="mt-5 block text-sm font-semibold text-[#0F172A]">
                Username
                <input className="mt-1.5 w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2.5 text-sm shadow-inner outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200" value={loginForm.username} onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))} required />
              </label>
              <label className="mt-3 block text-sm font-semibold text-[#0F172A]">
                Password
                <input type="password" className="mt-1.5 w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2.5 text-sm shadow-inner outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} required />
              </label>
              {authError ? <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{authError}</p> : null}
              <button type="submit" disabled={isLoginSubmitting} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-16px_rgba(37,99,235,0.95)] transition-all duration-200 hover:-translate-y-px hover:brightness-110 disabled:opacity-60">
                {isLoginSubmitting ? "Logging in..." : "Login to Dashboard"}
              </button>
            </div>
          </form>
        ) : (
          <section className="rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_28px_56px_-34px_rgba(15,23,42,0.6)] backdrop-blur sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl font-black text-[#0F172A]">{sectionTitle}</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={refreshAdminData}
                  disabled={isRefreshing || leadsLoading}
                  className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRefreshing || leadsLoading ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  onClick={exportCsv}
                  disabled={showTableSection ? !paginatedLeads.length : !dateFilteredLeads.length}
                  className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-3 py-2 text-sm font-semibold text-white shadow-[0_14px_26px_-16px_rgba(37,99,235,0.95)] transition-all duration-200 hover:-translate-y-px hover:brightness-110 disabled:opacity-60"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/65 p-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                From Date
                <AdvancedDatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  max={toDate || ""}
                  placeholder="Select start date"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                To Date
                <AdvancedDatePicker
                  value={toDate}
                  onChange={setToDate}
                  min={fromDate || ""}
                  placeholder="Select end date"
                />
              </label>
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                disabled={!hasDateFilter}
                className="self-end rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear Dates
              </button>
              <div className="self-end rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Date-wise Leads</p>
                <p className="text-sm font-black text-[#1D4ED8]">{dateFilteredLeads.length}</p>
              </div>
            </div>

            {showAnalysisSection ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 shadow-sm"><p className="text-xs font-semibold uppercase text-slate-600">Total Leads</p><p className="mt-1 text-2xl font-black text-blue-700">{stats.total}</p></div>
                <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 shadow-sm"><p className="text-xs font-semibold uppercase text-slate-600">Not Called</p><p className="mt-1 text-2xl font-black text-blue-700">{stats.notCalled}</p></div>
                <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 shadow-sm"><p className="text-xs font-semibold uppercase text-slate-600">Interested</p><p className="mt-1 text-2xl font-black text-blue-700">{stats.interested}</p></div>
                <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 shadow-sm"><p className="text-xs font-semibold uppercase text-slate-600">Joining Soon</p><p className="mt-1 text-2xl font-black text-blue-700">{stats.joinSoon}</p></div>
                <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 shadow-sm"><p className="text-xs font-semibold uppercase text-slate-600">Joined</p><p className="mt-1 text-2xl font-black text-blue-700">{stats.joined}</p></div>
              </div>
            ) : null}

            {showAnalysisSection ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="relative overflow-hidden rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-white via-[#F8FBFF] to-[#EAF2FF] p-5 shadow-[0_24px_50px_-34px_rgba(37,99,235,0.5)]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-200/40 blur-2xl" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#1E3A8A]">Lead Quality Overview</h3>
                  <span className="rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-xs font-bold text-blue-700">
                    Total Leads: {chartMetrics.totalLeads}
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-blue-100 bg-white/95 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#0F172A]">Interest Segmentation</p>
                    <p className="text-xs font-semibold text-slate-600">Industry-style stacked mix</p>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="flex h-full w-full">
                      <div style={{ width: `${leadMixInterestedPct}%` }} className="h-full bg-gradient-to-r from-blue-500 to-blue-700" />
                      <div style={{ width: `${leadMixNotInterestedPct}%` }} className="h-full bg-gradient-to-r from-rose-500 to-rose-600" />
                      <div style={{ width: `${leadMixNeutralPct}%` }} className="h-full bg-gradient-to-r from-slate-400 to-slate-500" />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {[
                      { key: "int", label: "Interested", value: chartMetrics.interested, pct: leadMixInterestedPct, tone: "text-blue-700" },
                      { key: "not", label: "Not Interested", value: chartMetrics.notInterested, pct: leadMixNotInterestedPct, tone: "text-rose-700" },
                      { key: "na", label: "Not Assessed", value: leadMixNeutralCount, pct: leadMixNeutralPct, tone: "text-slate-700" }
                    ].map((item) => (
                      <div key={item.key} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                        <p className={`mt-1 text-base font-black ${item.tone}`}>{item.value}</p>
                        <p className="text-[11px] font-semibold text-slate-500">{item.pct.toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-blue-100 bg-white/95 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#0F172A]">7-Day New Leads Trend</p>
                    <p className="text-xs font-semibold text-slate-600">Daily acquisition velocity</p>
                  </div>
                  <svg viewBox={`0 0 ${leadTrendGraph.width} ${leadTrendGraph.height}`} className="mt-3 h-28 w-full" preserveAspectRatio="none" role="img" aria-label="New leads trend for last seven days">
                    <defs>
                      <linearGradient id="leadAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={leadTrendGraph.areaPath} fill="url(#leadAreaGradient)" />
                    <path d={leadTrendGraph.linePath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {leadTrendGraph.points.map((point, index) => (
                      <circle key={`lead-point-${index}`} cx={point.x} cy={point.y} r="3" fill="#1D4ED8" />
                    ))}
                  </svg>
                  <div className="mt-2 grid grid-cols-7 text-[10px] font-semibold text-slate-500">
                    {chartTrend.map((item) => (
                      <span key={`lead-day-${item.key}`} className="text-center">{item.label}</span>
                    ))}
                  </div>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-[#BBF7D0] bg-gradient-to-br from-white via-[#F2FFF7] to-[#E8FFF2] p-5 shadow-[0_24px_50px_-34px_rgba(5,150,105,0.48)]">
                <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-emerald-200/45 blur-2xl" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-emerald-900">Revenue Performance</h3>
                  <span className="rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700">
                    Potential: {formatInr(chartMetrics.potentialIncome)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { key: "joined", label: "Joined", value: chartMetrics.joined, percent: joinedPct, color: "from-emerald-500 to-emerald-700" },
                    { key: "fees", label: "Fees Paid", value: chartMetrics.feesPaidCount, percent: feesPaidPct, color: "from-cyan-500 to-cyan-700" },
                    { key: "income", label: "Income Generated", value: formatInr(chartMetrics.incomeGenerated), percent: incomeRealizationPct, color: "from-indigo-500 to-indigo-700" }
                  ].map((metric) => (
                    <div key={metric.key} className="rounded-xl border border-emerald-100 bg-white p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                      <p className="mt-1 text-base font-black text-[#0F172A]">{metric.value}</p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full bg-gradient-to-r ${metric.color}`} style={{ width: `${Math.max(metric.percent, metric.percent > 0 ? 6 : 0)}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-slate-500">{metric.percent.toFixed(1)}%</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-emerald-100 bg-white/95 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#0F172A]">7-Day Income Trend</p>
                    <p className="text-xs font-semibold text-slate-600">Realized revenue (fees paid)</p>
                  </div>
                  <svg viewBox={`0 0 ${incomeTrendGraph.width} ${incomeTrendGraph.height}`} className="mt-3 h-28 w-full" preserveAspectRatio="none" role="img" aria-label="Income trend for last seven days">
                    <defs>
                      <linearGradient id="incomeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.36" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={incomeTrendGraph.areaPath} fill="url(#incomeAreaGradient)" />
                    <path d={incomeTrendGraph.linePath} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {incomeTrendGraph.points.map((point, index) => (
                      <circle key={`income-point-${index}`} cx={point.x} cy={point.y} r="3" fill="#047857" />
                    ))}
                  </svg>
                  <div className="mt-2 grid grid-cols-7 text-[10px] font-semibold text-slate-500">
                    {chartTrend.map((item) => (
                      <span key={`income-day-${item.key}`} className="text-center">{item.label}</span>
                    ))}
                  </div>
                </div>
              </article>
              </div>
            ) : null}

            {showAnalysisSection ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <article className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-600">Day Conversion (Today)</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">Leads: {conversionMetrics.dayTotal}</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="rounded-full border border-blue-200 bg-white px-2.5 py-1 font-semibold text-blue-700">
                    Interested: {conversionMetrics.dayInterestedPct}
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold text-emerald-700">
                    Joined: {conversionMetrics.dayJoinedPct}
                  </span>
                </div>
              </article>

              <article className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-600">Week Conversion (7 Days)</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">Leads: {conversionMetrics.weekTotal}</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="rounded-full border border-blue-200 bg-white px-2.5 py-1 font-semibold text-blue-700">
                    Interested: {conversionMetrics.weekInterestedPct}
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold text-emerald-700">
                    Joined: {conversionMetrics.weekJoinedPct}
                  </span>
                </div>
              </article>

              <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-600">SLA Overdue Alerts</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  Total Overdue: <span className="font-black text-amber-700">{slaSummary.total}</span>
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 font-semibold text-amber-700">
                    1-2 days: {slaSummary.warning}
                  </span>
                  <span className="rounded-full border border-rose-200 bg-white px-2.5 py-1 font-semibold text-rose-700">
                    3+ days: {slaSummary.critical}
                  </span>
                </div>
              </article>
              </div>
            ) : null}

            {showFlowSection ? (
              <article className="mt-4 rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE] p-4 shadow-[0_22px_44px_-30px_rgba(37,99,235,0.5)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#1E3A8A]">Lead Flow Graph</h3>
                <p className="text-xs font-semibold text-slate-600">Ad Lead {"->"} Contact {"->"} Interest {"->"} Enrollment</p>
              </div>
              <div className="mt-3 space-y-2.5">
                {marketingFlow.map((stage, index) => (
                  <div key={stage.id} className="rounded-xl border border-blue-100 bg-white/90 px-3 py-2.5 shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800">
                        {index + 1}. {stage.label}
                      </p>
                      <p className="text-sm font-black text-[#1D4ED8]">
                        {stage.count} <span className="text-xs font-semibold text-slate-600">({stage.percentLabel})</span>
                      </p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full bg-gradient-to-r ${stage.tone}`} style={{ width: `${stage.widthPercent}%` }} />
                    </div>
                    {index > 0 ? (
                      <p className="mt-1 text-[11px] font-medium text-slate-600">
                        Drop-off from previous stage: <span className="font-bold text-slate-800">{stage.dropOff}</span>
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              </article>
            ) : null}

            {showFlowSection ? (
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <article className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-[0_20px_44px_-30px_rgba(37,99,235,0.55)]">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-blue-900">Today's Callbacks</h3>
                    <span className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-blue-700">
                      {todayCallbacks.length}
                    </span>
                  </div>
                  {todayCallbacks.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-600">No callbacks scheduled for today.</p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {paginatedCallbacks.map((lead) => (
                        <div key={`callback-${lead.id}`} className="flex items-center justify-between gap-2 rounded-xl border border-blue-200/80 bg-white px-3 py-2 shadow-sm">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{lead.fullName || "-"}</p>
                            <p className="text-xs text-slate-600">{lead.phone || "-"} | {lead.joinTimeline || "No timeline"}</p>
                          </div>
                          <button
                            onClick={() => openLeadEditor(lead)}
                            className="rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 transition-colors duration-200 hover:bg-blue-50"
                          >
                            Update
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <p className="text-[11px] font-semibold text-slate-600">
                          Page {callbacksPage} of {callbacksTotalPages}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCallbacksPage((prev) => Math.max(1, prev - 1))}
                            disabled={callbacksPage === 1}
                            className="rounded-lg border border-blue-200 bg-white px-2 py-1 text-[11px] font-semibold text-blue-700 disabled:opacity-50"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() => setCallbacksPage((prev) => Math.min(callbacksTotalPages, prev + 1))}
                            disabled={callbacksPage === callbacksTotalPages}
                            className="rounded-lg border border-blue-200 bg-white px-2 py-1 text-[11px] font-semibold text-blue-700 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>

                <article className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-amber-50 p-4 shadow-[0_20px_44px_-30px_rgba(244,63,94,0.45)]">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-rose-900">Overdue Follow-up Queue</h3>
                    <span className="rounded-full border border-rose-200 bg-white px-2.5 py-1 text-xs font-bold text-rose-700">
                      {slaSummary.total}
                    </span>
                  </div>
                  {slaSummary.total === 0 ? (
                    <p className="mt-3 text-sm text-slate-600">No overdue follow-ups. SLA is healthy.</p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {paginatedOverdue.map((lead) => (
                        <div key={`sla-${lead.id}`} className="flex items-center justify-between gap-2 rounded-xl border border-rose-200/80 bg-white px-3 py-2 shadow-sm">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{lead.fullName || "-"}</p>
                            <p className="text-xs text-slate-600">
                              {lead.phone || "-"} | Follow-up: {toDateInputValue(lead.nextFollowUp) || "-"}
                            </p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${lead.overdueDays >= 3 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                            {lead.overdueDays}d overdue
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <p className="text-[11px] font-semibold text-slate-600">
                          Page {overduePage} of {overdueTotalPages}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setOverduePage((prev) => Math.max(1, prev - 1))}
                            disabled={overduePage === 1}
                            className="rounded-lg border border-rose-200 bg-white px-2 py-1 text-[11px] font-semibold text-rose-700 disabled:opacity-50"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() => setOverduePage((prev) => Math.min(overdueTotalPages, prev + 1))}
                            disabled={overduePage === overdueTotalPages}
                            className="rounded-lg border border-rose-200 bg-white px-2 py-1 text-[11px] font-semibold text-rose-700 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              </div>
            ) : null}

            {showTableSection ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search name, phone, campaign..." className="rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm shadow-inner outline-none transition-colors focus:border-blue-400" />
              <select value={callStatusFilter} onChange={(e) => setCallStatusFilter(e.target.value)} className="rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm shadow-inner outline-none transition-colors focus:border-blue-400"><option value="All">All Call Status</option>{callStatusOptions.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              <select value={interestFilter} onChange={(e) => setInterestFilter(e.target.value)} className="rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm shadow-inner outline-none transition-colors focus:border-blue-400"><option value="All">All Interest</option>{interestStatusOptions.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              <select value={joinStatusFilter} onChange={(e) => setJoinStatusFilter(e.target.value)} className="rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm shadow-inner outline-none transition-colors focus:border-blue-400"><option value="All">All Join Status</option>{joinStatusOptions.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              </div>
            ) : null}

            {showTableSection || showFlowSection ? (
              <>
                {saveError ? <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{saveError}</p> : null}
                {saveMessage ? <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{saveMessage}</p> : null}
              </>
            ) : null}

            {showTableSection ? (
              leadsLoading ? (
              <p className="mt-4 text-sm text-slate-600">Loading leads...</p>
            ) : leadsError ? (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{leadsError}</p>
            ) : filteredLeads.length === 0 ? (
              <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">No leads found.</p>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                    Showing <span className="font-black text-[#1D4ED8]">{paginationInfo.start}</span> to{" "}
                    <span className="font-black text-[#1D4ED8]">{paginationInfo.end}</span> of{" "}
                    <span className="font-black text-[#1D4ED8]">{filteredLeads.length}</span> leads
                  </p>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 sm:text-sm">
                    Rows per page
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 sm:text-sm"
                    >
                      {[10, 15, 25, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-3 overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_45px_-34px_rgba(15,23,42,0.5)]">
                  <table className="min-w-[1240px] w-full table-fixed border-collapse text-left text-xs sm:text-sm">
                    <thead className="bg-gradient-to-r from-slate-100 to-blue-50">
                      <tr>
                        {tableColumns.map((column) => (
                          <th key={column.key} className={`border-b border-slate-200 px-2 py-3 font-extrabold text-[#0F172A] ${column.key === "timestamp" ? "w-[170px]" : ""}`}>
                            {column.label}
                          </th>
                        ))}
                        <th className="border-b border-slate-200 px-2 py-3 font-extrabold text-[#0F172A]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLeads.map((lead, index) => (
                        <tr key={lead.id || `row-${currentPage}-${index}`} className="h-[64px] odd:bg-white even:bg-slate-50/70 transition-colors duration-200 hover:bg-blue-50/70">
                        {tableColumns.map((column) => {
                          const value = lead[column.key];
                          if (column.key === "timestamp") {
                            return (
                              <td key={column.key} className="w-[170px] border-b border-slate-200 px-2 py-2">
                                <span className="inline-flex whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                                  {formatTableTimestamp(value)}
                                </span>
                              </td>
                            );
                          }
                          if (column.key === "callStatus" || column.key === "interestStatus" || column.key === "joinStatus") {
                            return (
                              <td key={column.key} className="max-w-0 border-b border-slate-200 px-2 py-2">
                                <span className={`inline-flex max-w-full truncate whitespace-nowrap rounded-full border px-2 py-1 text-[11px] font-semibold ${badgeClass(column.key, value)}`}>
                                  {value || "-"}
                                </span>
                              </td>
                            );
                          }
                          if (column.key === "nextFollowUp") {
                            const now = new Date();
                            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                            const overdueDays = getOverdueDays(value, lead.joinStatus, todayStart);
                            return (
                              <td key={column.key} className="max-w-0 border-b border-slate-200 px-2 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="truncate text-sm">{toDateInputValue(value) || "-"}</span>
                                  {overdueDays > 0 ? (
                                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${overdueDays >= 3 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                                      {overdueDays}d
                                    </span>
                                  ) : null}
                                </div>
                              </td>
                            );
                          }
                          return <td key={column.key} className="max-w-0 truncate border-b border-slate-200 px-2 py-2" title={value || "-"}>{value || "-"}</td>;
                        })}
                        <td className="border-b border-slate-200 px-2 py-2">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setLeadPreview(lead)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-700 shadow-sm transition-colors duration-200 hover:bg-blue-50"><Icon type="view" /></button>
                            <button onClick={() => openLeadEditor(lead)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-700 shadow-sm transition-colors duration-200 hover:bg-blue-50"><Icon type="update" /></button>
                          </div>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-600 sm:text-sm">
                    Page <span className="font-black text-[#1D4ED8]">{currentPage}</span> of{" "}
                    <span className="font-black text-[#1D4ED8]">{totalPages}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                      Prev
                    </button>
                    {pageNumbers.map((page) => (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-200 sm:text-sm ${
                          page === currentPage
                            ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_10px_20px_-14px_rgba(37,99,235,0.95)]"
                            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </>
            )
            ) : null}
          </section>
        )}
      </main>

      {leadPreview ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_30px_60px_-36px_rgba(15,23,42,0.85)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-[#0F172A]">Lead Details</h3>
              <button onClick={() => setLeadPreview(null)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50">Close</button>
            </div>
            <div className="mt-3 grid max-h-[60vh] gap-2 overflow-y-auto sm:grid-cols-2">
              {[
                "timestamp",
                "fullName",
                "phone",
                "email",
                "experience",
                "currentRole",
                "goal",
                "leadSource",
                "campaignName",
                "callStatus",
                "interestStatus",
                "joinTimeline",
                "joinStatus",
                "nextFollowUp",
                "lastContactedAt",
                "callNotes",
                "utmSummary"
              ].map((key) => (
                <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase text-slate-500">{key}</p>
                  <p className="mt-1 break-words text-sm text-slate-700">
                    {key === "timestamp" || key === "lastContactedAt"
                      ? formatTableTimestamp(leadPreview[key])
                      : leadPreview[key] || "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {leadEditor ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_30px_60px_-36px_rgba(15,23,42,0.85)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-[#0F172A]">Update Call Follow-up</h3>
              <button onClick={() => setLeadEditor(null)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50">Close</button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[#0F172A]">Call Status
                <select value={leadEditor.callStatus} onChange={(e) => onEditorChange("callStatus", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">{callStatusOptions.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              </label>
              <label className="text-sm font-semibold text-[#0F172A]">Interest Status
                <select value={leadEditor.interestStatus} onChange={(e) => onEditorChange("interestStatus", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">{interestStatusOptions.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              </label>
              <label className="text-sm font-semibold text-[#0F172A]">Join Timeline
                <select value={leadEditor.joinTimeline} onChange={(e) => onEditorChange("joinTimeline", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">{joinTimelineOptions.map((x) => <option key={x || "none"} value={x}>{x || "Select timeline"}</option>)}</select>
              </label>
              <label className="text-sm font-semibold text-[#0F172A]">Join Status
                <select value={leadEditor.joinStatus} onChange={(e) => onEditorChange("joinStatus", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">{joinStatusOptions.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              </label>
              <label className="text-sm font-semibold text-[#0F172A]">Next Follow-up Date
                <input type="date" value={leadEditor.nextFollowUp} onChange={(e) => onEditorChange("nextFollowUp", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="text-sm font-semibold text-[#0F172A]">Lead Source
                <input value={leadEditor.leadSource} onChange={(e) => onEditorChange("leadSource", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="sm:col-span-2 text-sm font-semibold text-[#0F172A]">Campaign Name
                <input value={leadEditor.campaignName} onChange={(e) => onEditorChange("campaignName", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="sm:col-span-2 text-sm font-semibold text-[#0F172A]">Call Notes
                <textarea rows={4} value={leadEditor.callNotes} onChange={(e) => onEditorChange("callNotes", e.target.value)} maxLength={1000} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <p className="mt-1 text-right text-[11px] font-medium text-slate-500">{leadEditor.callNotes.length}/1000</p>
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setLeadEditor(null)} disabled={saveBusy} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
              <button onClick={saveLeadUpdate} disabled={saveBusy} className="rounded-lg bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_22px_-16px_rgba(37,99,235,0.95)] transition-all duration-200 hover:-translate-y-px hover:brightness-110 disabled:opacity-60">{saveBusy ? "Saving..." : "Save Follow-up"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
