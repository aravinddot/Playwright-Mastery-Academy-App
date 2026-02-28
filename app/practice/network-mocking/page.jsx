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
  "rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_14px_34px_-24px_rgba(11,42,74,0.35)] sm:p-8";

const initialStatus = {
  profile: "Pending live profile request.",
  continueMode: "Pending route.continue practice.",
  flags: "Pending route.fulfill practice.",
  orders: "Pending orders request."
};

const formatJson = (value) => JSON.stringify(value, null, 2);

function StatusLine({ label, value, testId, done = false }) {
  return (
    <div
      data-testid={testId}
      className={`mt-3 flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
        done
          ? "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]"
          : "border-[#E2E8F0] bg-white text-[#475569]"
      }`}
    >
      <span className="font-semibold text-[#0B2A4A]">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

export default function NetworkMockingPage() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [profileStatus, setProfileStatus] = useState(initialStatus.profile);
  const [continueStatus, setContinueStatus] = useState(initialStatus.continueMode);
  const [flagsStatus, setFlagsStatus] = useState(initialStatus.flags);
  const [ordersStatus, setOrdersStatus] = useState(initialStatus.orders);
  const [profileData, setProfileData] = useState(null);
  const [continueData, setContinueData] = useState(null);
  const [flagsData, setFlagsData] = useState(null);
  const [ordersData, setOrdersData] = useState(null);

  const loadLiveProfile = async () => {
    setProfileStatus("Loading profile endpoint...");

    try {
      const response = await fetch("/api/practice/network/profile", {
        cache: "no-store",
        headers: {
          "x-intercept-source": "ui-live-button"
        }
      });
      const data = await response.json();
      setProfileData(data);
      setProfileStatus(`Profile loaded from ${data.source}.`);
    } catch {
      setProfileStatus("Profile request failed.");
    }
  };

  const runContinuePractice = async () => {
    setContinueStatus("Sending request with default header...");

    try {
      const response = await fetch("/api/practice/network/profile", {
        cache: "no-store",
        headers: {
          "x-intercept-source": "browser-default"
        }
      });
      const data = await response.json();
      setContinueData(data);
      setContinueStatus(`Intercept source received: ${data.interceptSource}.`);
    } catch {
      setContinueStatus("route.continue practice request failed.");
    }
  };

  const loadFlags = async () => {
    setFlagsStatus("Loading flags endpoint...");

    try {
      const response = await fetch("/api/practice/network/flags", { cache: "no-store" });
      const data = await response.json();
      setFlagsData(data);
      setFlagsStatus(`Flags loaded from ${data.source}.`);
    } catch {
      setFlagsStatus("Flags request failed.");
    }
  };

  const loadOrders = async (forceError = false) => {
    setOrdersStatus(forceError ? "Loading forced-error response..." : "Loading orders endpoint...");

    try {
      const response = await fetch("/api/practice/network/orders", {
        cache: "no-store",
        headers: forceError
          ? {
              "x-intercept-mode": "live",
              "x-force-error": "true"
            }
          : {
              "x-intercept-mode": "live"
            }
      });
      const data = await response.json();
      setOrdersData(data);

      if (!response.ok) {
        setOrdersStatus(`Orders request failed with status ${response.status}.`);
        return;
      }

      setOrdersStatus(`Orders loaded: ${(data.orders || []).length} records.`);
    } catch {
      setOrdersStatus("Orders request failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_9%,rgba(37,99,235,0.08),transparent_36%),radial-gradient(circle_at_88%_26%,rgba(59,130,246,0.07),transparent_34%),#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#F8FAFC]/95 shadow-sm backdrop-blur-sm">
        <nav
          className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-8"
          aria-label="Primary navigation"
        >
          <Link href="/" className="inline-flex items-center py-1" aria-label="Playwright Mastery Academy Home">
            <Image
              src="/company-logo.png"
              alt="Playwright Mastery Academy"
              width={290}
              height={96}
              className="h-16 w-auto sm:h-20"
              priority
              unoptimized
            />
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <ul className="flex flex-wrap items-center gap-3 text-sm sm:gap-5 sm:text-base">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-semibold transition-colors duration-200 ${
                      link.label === "Practice"
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
              aria-label="Enroll Now"
              className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
            >
              Enroll Now
            </Link>
          </div>
        </nav>
      </header>

      <section className="border-b border-[#0b2a4a]/40 bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_100%)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8 lg:py-14">
          <motion.h1 {...revealProps} className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Network Interception and Mocking Lab
          </motion.h1>
          <motion.p
            {...revealProps}
            transition={{ ...revealProps.transition, delay: 0.05 }}
            className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg"
          >
            Practice <code>page.route()</code>, <code>route.continue()</code>,{" "}
            <code>route.fulfill()</code>, <code>route.abort()</code>, and{" "}
            <code>waitForResponse()</code> with dedicated API targets.
          </motion.p>
          <motion.div
            {...revealProps}
            transition={{ ...revealProps.transition, delay: 0.1 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
              Route Continue
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
              Route Fulfill
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
              Route Abort
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
              Response Assertions
            </span>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 lg:px-8 lg:py-12">
        <motion.section {...revealProps} className={sectionClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Quick Network Mapping
            </h2>
            <button
              type="button"
              data-testid="toggle-network-answers"
              aria-expanded={showAnswers}
              aria-controls="network-answer-panel"
              onClick={() => setShowAnswers((prev) => !prev)}
              className="rounded-lg border border-[#BFDBFE] bg-white px-3 py-2 text-xs font-semibold text-[#1D4ED8] transition-colors duration-200 hover:bg-[#EFF6FF]"
            >
              {showAnswers ? "Hide Network Answers" : "Show Network Answers"}
            </button>
          </div>

          {showAnswers ? (
            <div
              id="network-answer-panel"
              className="mt-4 rounded-xl border border-[#1E3A8A] bg-[#0F172A] p-4"
            >
              <pre className="overflow-x-auto text-xs leading-6 text-[#E2E8F0]">
                <code>{`// Navigate from Interactive Sandbox
await page.getByTestId('network-mocking-link').click();
await expect(page).toHaveURL(/\\/practice\\/network-mocking/);

// route.continue() header override
await page.route('**/api/practice/network/profile', async (route) => {
  const headers = { ...route.request().headers(), 'x-intercept-source': 'route-continue' };
  await route.continue({ headers });
});
await page.getByTestId('net-continue-btn').click();
await expect(page.getByTestId('net-continue-source')).toContainText('route-continue');

// route.fulfill() mock flags
await page.route('**/api/practice/network/flags', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      source: 'mocked-route',
      flags: { betaDashboard: true, aiInsights: true, mcpAssist: true }
    })
  });
});
await page.getByTestId('net-flags-btn').click();
await expect(page.getByTestId('net-flags-source')).toContainText('mocked-route');

// route.abort() for orders
await page.route('**/api/practice/network/orders', (route) => route.abort());
await page.getByTestId('net-orders-btn').click();
await expect(page.getByTestId('net-orders-status')).toContainText('failed');

// waitForResponse()
await Promise.all([
  page.waitForResponse((res) => res.url().includes('/api/practice/network/orders')),
  page.getByTestId('net-orders-btn').click()
]);`}</code>
              </pre>
            </div>
          ) : null}
        </motion.section>

        <motion.section {...revealProps} className={sectionClass}>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Interactive Network Playground
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
            Use these controls as live targets for interception and mocking scenarios.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <motion.article
              {...withDelay(0.04)}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
            >
              <h3 className="text-lg font-bold text-[#0F172A]">Live Profile Endpoint</h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Base endpoint for <code>waitForResponse()</code> and payload assertions.
              </p>
              <button
                type="button"
                data-testid="net-live-profile-btn"
                onClick={loadLiveProfile}
                className="mt-3 rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white"
              >
                Load Live Profile
              </button>
              <StatusLine
                label="Profile"
                value={profileStatus}
                testId="net-profile-status"
                done={profileStatus !== initialStatus.profile && !profileStatus.includes("Loading")}
              />
              <pre
                data-testid="net-profile-json"
                className="mt-3 overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white p-3 text-xs text-[#334155]"
              >
                <code>{formatJson(profileData || { profile: "No response yet" })}</code>
              </pre>
            </motion.article>

            <motion.article
              {...withDelay(0.08)}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
            >
              <h3 className="text-lg font-bold text-[#0F172A]">route.continue() Challenge</h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Override header <code>x-intercept-source</code> and validate UI output.
              </p>
              <button
                type="button"
                data-testid="net-continue-btn"
                onClick={runContinuePractice}
                className="mt-3 rounded-lg bg-[#0B2A4A] px-3 py-2 text-sm font-semibold text-white"
              >
                Send Continue Request
              </button>
              <StatusLine
                label="Continue"
                value={continueStatus}
                testId="net-continue-status"
                done={
                  continueStatus !== initialStatus.continueMode &&
                  !continueStatus.includes("Sending")
                }
              />
              <div
                data-testid="net-continue-source"
                className="mt-3 inline-flex rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-xs font-semibold text-[#1D4ED8]"
              >
                interceptSource: {continueData?.interceptSource || "not-set"}
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white p-3 text-xs text-[#334155]">
                <code>{formatJson(continueData || { interceptSource: "No response yet" })}</code>
              </pre>
            </motion.article>

            <motion.article
              {...withDelay(0.12)}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
            >
              <h3 className="text-lg font-bold text-[#0F172A]">route.fulfill() Mocking Challenge</h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Mock flags endpoint and drive conditional UI with controlled payloads.
              </p>
              <button
                type="button"
                data-testid="net-flags-btn"
                onClick={loadFlags}
                className="mt-3 rounded-lg border border-[#93C5FD] bg-white px-3 py-2 text-sm font-semibold text-[#1D4ED8]"
              >
                Load Flags
              </button>
              <StatusLine
                label="Flags"
                value={flagsStatus}
                testId="net-flags-status"
                done={flagsStatus !== initialStatus.flags && !flagsStatus.includes("Loading")}
              />
              <p
                data-testid="net-flags-source"
                className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#2563EB]"
              >
                source: {flagsData?.source || "not-set"}
              </p>
              <ul
                data-testid="net-flag-list"
                className="mt-2 space-y-1 rounded-lg border border-[#E2E8F0] bg-white p-3 text-sm text-[#334155]"
              >
                {flagsData?.flags ? (
                  Object.entries(flagsData.flags).map(([key, value]) => (
                    <li key={key} data-testid="net-flag-item">
                      {key}: {value ? "true" : "false"}
                    </li>
                  ))
                ) : (
                  <li data-testid="net-flag-placeholder">No flags loaded.</li>
                )}
              </ul>
            </motion.article>

            <motion.article
              {...withDelay(0.16)}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
            >
              <h3 className="text-lg font-bold text-[#0F172A]">Orders Endpoint (Success + Error)</h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Use this endpoint for <code>route.abort()</code>, <code>route.fulfill()</code>, and
                error assertions.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  data-testid="net-orders-btn"
                  onClick={() => loadOrders(false)}
                  className="rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white"
                >
                  Load Orders
                </button>
                <button
                  type="button"
                  data-testid="net-orders-error-btn"
                  onClick={() => loadOrders(true)}
                  className="rounded-lg border border-[#93C5FD] bg-white px-3 py-2 text-sm font-semibold text-[#1D4ED8]"
                >
                  Force Error
                </button>
              </div>
              <StatusLine
                label="Orders"
                value={ordersStatus}
                testId="net-orders-status"
                done={ordersStatus !== initialStatus.orders && !ordersStatus.includes("Loading")}
              />
              <pre
                data-testid="net-orders-json"
                className="mt-3 overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white p-3 text-xs text-[#334155]"
              >
                <code>{formatJson(ordersData || { orders: "No response yet" })}</code>
              </pre>
            </motion.article>
          </div>
        </motion.section>

        <motion.section {...revealProps} className={sectionClass}>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
            Test Targets List
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "net-live-profile-btn",
              "net-continue-btn",
              "net-continue-source",
              "net-flags-btn",
              "net-flag-list",
              "net-orders-btn",
              "net-orders-error-btn",
              "net-orders-status",
              "net-orders-json"
            ].map((id) => (
              <div
                key={id}
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-[#334155]"
              >
                <code>{id}</code>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...revealProps}
          className="rounded-xl border border-[#0b2a4a]/40 bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_100%)] p-6 text-white shadow-[0_18px_42px_-24px_rgba(11,42,74,0.55)] sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
            Advanced Network Practice
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Connect This Lab with Interactive Sandbox
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90 sm:text-base">
            Run end-to-end practice by starting in Interactive Sandbox, then continue interception
            drills in this dedicated network page.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/practice#interactive-playground"
              className="inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[#1D4ED8] hover:shadow-md"
            >
              Back to Interactive Sandbox
            </Link>
            <Link
              href="/practice/table-pagination"
              className="inline-flex items-center rounded-lg border border-white/50 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              Open Table Labs
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
