"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PracticePageShell, { revealProps, sectionClass, withDelay } from "../_components/PracticePageShell";
import { savePracticeModuleProgress } from "../../../lib/practiceProgress";

const initialLocatorChainStatus = "No filter/chaining action executed.";
const totalLocatorTasks = 4;

export default function LocatorArenaPage() {
  const [locatorChainStatus, setLocatorChainStatus] = useState(initialLocatorChainStatus);
  const [easyTaskDone, setEasyTaskDone] = useState(false);
  const [mediumTaskDone, setMediumTaskDone] = useState(false);
  const [hardTaskDone, setHardTaskDone] = useState(false);
  const [filterChainTaskDone, setFilterChainTaskDone] = useState(false);

  useEffect(() => {
    const completedTasks = [easyTaskDone, mediumTaskDone, hardTaskDone, filterChainTaskDone].filter(Boolean).length;
    savePracticeModuleProgress("/practice/locator-arena", completedTasks, totalLocatorTasks);
  }, [easyTaskDone, mediumTaskDone, hardTaskDone, filterChainTaskDone]);

  return (
    <PracticePageShell
      title="Locator Practice Arena"
      subtitle="Practice all core Playwright locator strategies with easy, medium, hard targets, plus filter and chaining drills."
      chips={[
        "getByRole + getByText",
        "getByLabel + getByPlaceholder",
        "getByAltText + getByTitle",
        "getByTestId + filter + chaining"
      ]}
    >
      <motion.section {...revealProps} className={sectionClass}>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">Locator Targets</h2>
        <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
          Use semantic and robust selectors against real practice controls.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <motion.article
            {...withDelay(0.04)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(160deg,#FFFFFF_0%,#EFF6FF_100%)] p-5 shadow-[0_16px_32px_-26px_rgba(37,99,235,0.4)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Easy</h3>
              <span className="rounded-full border border-[#DBEAFE] bg-white px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                6 Elements
              </span>
            </div>
            <div
              className="mt-4 space-y-3"
              onClickCapture={() => setEasyTaskDone(true)}
              onInputCapture={() => setEasyTaskDone(true)}
              onChangeCapture={() => setEasyTaskDone(true)}
            >
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <button
                  type="button"
                  data-testid="easy-btn-start"
                  onClick={() => setEasyTaskDone(true)}
                  className="locator-easy-btn rounded-md bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white"
                >
                  Start Practice
                </button>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <a
                  href="#locator-arena"
                  data-testid="easy-link-guide"
                  className="locator-easy-link text-sm font-semibold text-[#1D4ED8] underline underline-offset-4"
                >
                  Read Locator Guide
                </a>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <label htmlFor="easy-name" className="mb-1 block text-xs font-semibold text-[#334155]">
                  Learner Name
                </label>
                <input
                  id="easy-name"
                  data-testid="easy-input-name"
                  placeholder="Type learner name"
                  className="w-full rounded-md border border-[#CBD5E1] px-2.5 py-2 text-sm"
                />
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <input
                  data-testid="easy-input-search"
                  placeholder="Search by batch"
                  className="locator-easy-search w-full rounded-md border border-[#CBD5E1] px-2.5 py-2 text-sm"
                />
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <img
                  src="/company-logo.png"
                  alt="Practice section logo"
                  title="Logo for locator practice"
                  data-testid="easy-logo-image"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <span
                  title="Ready status"
                  data-testid="easy-status"
                  className="inline-flex rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]"
                >
                  Ready
                </span>
              </div>
            </div>
          </motion.article>

          <motion.article
            {...withDelay(0.08)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(160deg,#FFFFFF_0%,#F0F9FF_100%)] p-5 shadow-[0_16px_32px_-26px_rgba(14,116,144,0.36)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Medium</h3>
              <span className="rounded-full border border-[#DBEAFE] bg-white px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                6 Elements
              </span>
            </div>
            <div
              className="mt-4 space-y-3"
              onClickCapture={() => setMediumTaskDone(true)}
              onInputCapture={() => setMediumTaskDone(true)}
              onChangeCapture={() => setMediumTaskDone(true)}
            >
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <label htmlFor="medium-browser" className="mb-1 block text-xs font-semibold text-[#334155]">
                  Preferred Browser
                </label>
                <select
                  id="medium-browser"
                  data-testid="medium-browser-select"
                  className="w-full rounded-md border border-[#CBD5E1] px-2.5 py-2 text-sm"
                >
                  <option>Chromium</option>
                  <option>Firefox</option>
                  <option>WebKit</option>
                </select>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <label htmlFor="medium-notes" className="mb-1 block text-xs font-semibold text-[#334155]">
                  Scenario Notes
                </label>
                <textarea
                  id="medium-notes"
                  data-testid="medium-notes-input"
                  placeholder="Write your scenario steps here"
                  className="w-full rounded-md border border-[#CBD5E1] px-2.5 py-2 text-sm"
                  rows={3}
                />
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <button
                  type="button"
                  title="Refresh scenarios list"
                  data-testid="medium-refresh-btn"
                  onClick={() => setMediumTaskDone(true)}
                  className="rounded-md border border-[#BFDBFE] px-3 py-2 text-sm font-semibold text-[#1D4ED8]"
                >
                  Refresh Scenarios
                </button>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <img
                  src="/company-logos/TCS.NS.png"
                  alt="Partner company mark"
                  title="Partner logo"
                  data-testid="medium-company-logo"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <ul data-testid="medium-topic-list" className="locator-medium-list text-sm text-[#334155]">
                  <li>Login workflow</li>
                  <li>Checkout workflow</li>
                  <li>API validation workflow</li>
                </ul>
              </div>
              <div
                title="Medium challenge card"
                data-testid="medium-card"
                className="locator-medium-card rounded-lg border border-dashed border-[#93C5FD] bg-white p-3 text-sm font-semibold text-[#334155]"
              >
                Medium locator challenge card
              </div>
            </div>
          </motion.article>

          <motion.article
            {...withDelay(0.12)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(160deg,#FFFFFF_0%,#EEF2FF_100%)] p-5 shadow-[0_16px_32px_-26px_rgba(30,58,138,0.36)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Hard</h3>
              <span className="rounded-full border border-[#DBEAFE] bg-white px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                6 Elements
              </span>
            </div>
            <div
              className="mt-4 space-y-3"
              onClickCapture={() => setHardTaskDone(true)}
              onInputCapture={() => setHardTaskDone(true)}
              onChangeCapture={() => setHardTaskDone(true)}
            >
              <div className="overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white p-3">
                <table data-testid="hard-table" className="w-full min-w-[300px] text-left text-xs">
                  <thead>
                    <tr className="text-[#334155]">
                      <th className="py-1">ID</th>
                      <th className="py-1">Scenario</th>
                      <th className="py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-[#475569]">
                      <td className="py-1">01</td>
                      <td className="py-1">Payment Retry</td>
                      <td className="py-1">
                        <button
                          type="button"
                          data-testid="hard-row-action"
                          className="rounded border border-[#BFDBFE] px-2 py-0.5 font-semibold text-[#1D4ED8]"
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <button
                  type="button"
                  title="Approve candidate profile"
                  data-testid="hard-approve-btn"
                  className="rounded-md border border-[#BFDBFE] px-3 py-2 text-sm font-semibold text-[#1D4ED8]"
                >
                  Approve Candidate
                </button>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <label htmlFor="hard-token" className="mb-1 block text-xs font-semibold text-[#334155]">
                  Secret Token
                </label>
                <input
                  id="hard-token"
                  aria-label="Secret token input"
                  data-testid="hard-token-input"
                  placeholder="Enter secure token"
                  className="hard-input locator-target-hard w-full rounded-md border border-[#CBD5E1] px-2.5 py-2 text-sm"
                />
              </div>
              <div
                title="Active hard panel"
                data-state="active"
                data-testid="hard-panel-active"
                className="hard-panel rounded-lg border border-dashed border-[#93C5FD] bg-white p-3 text-sm font-semibold text-[#334155]"
              >
                Panel status: Active
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <img
                  src="/company-logos/INFY.png"
                  alt="Hard challenge visual"
                  title="Hard challenge image"
                  data-testid="hard-image"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                <button
                  type="button"
                  aria-label="Launch final check"
                  data-testid="hard-final-btn"
                  onClick={() => setHardTaskDone(true)}
                  className="rounded-md bg-[#0B2A4A] px-3 py-2 text-sm font-semibold text-white"
                >
                  Launch Final Check
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <motion.article
            {...withDelay(0.02)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(165deg,#FFFFFF_0%,#F8FAFC_100%)] p-5 shadow-[0_14px_28px_-24px_rgba(11,42,74,0.35)]"
          >
            <h3 className="text-lg font-bold text-[#0F172A]">Filter Locator Challenges</h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Practice <code>locator().filter({"{ hasText }"})</code> with repeated items.
            </p>
            <ul data-testid="filter-list" className="mt-3 space-y-2">
              {[
                { level: "Easy", module: "Form Inputs" },
                { level: "Medium", module: "Table Actions" },
                { level: "Hard", module: "Nested Module Cards" }
              ].map((item) => (
                <li
                  key={`${item.level}-${item.module}`}
                  data-testid="filter-item"
                  className="rounded-lg border border-[#E2E8F0] bg-white p-3"
                >
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">{item.level}</p>
                      <p className="text-sm font-semibold text-[#0F172A]">{item.module}</p>
                    </div>
                    <button
                      type="button"
                      data-testid="filter-open-btn"
                      onClick={() => {
                        setLocatorChainStatus(`Filter open clicked: ${item.level} - ${item.module}`);
                        setFilterChainTaskDone(true);
                      }}
                      className="rounded-md border border-[#BFDBFE] px-2.5 py-1.5 text-xs font-semibold text-[#1D4ED8]"
                    >
                      Open Challenge
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            {...withDelay(0.06)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(165deg,#FFFFFF_0%,#F8FAFC_100%)] p-5 shadow-[0_14px_28px_-24px_rgba(11,42,74,0.35)]"
          >
            <h3 className="text-lg font-bold text-[#0F172A]">Chaining Locator Challenges</h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Chain from parent container to child button/input using scoped locators.
            </p>
            <div className="mt-3 space-y-2" data-testid="chain-card-list">
              {[
                { id: "auth", title: "Auth Module", action: "Run Login Suite" },
                { id: "payments", title: "Payments Module", action: "Run Payment Suite" },
                { id: "grid", title: "Grid Module", action: "Run Grid Suite" }
              ].map((card) => (
                <div
                  key={card.id}
                  data-testid={`chain-card-${card.id}`}
                  className="rounded-lg border border-[#E2E8F0] bg-white p-3"
                >
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{card.title}</p>
                      <p className="text-xs text-[#64748B]">{card.action}</p>
                    </div>
                    <button
                      type="button"
                      data-testid="chain-run-btn"
                      onClick={() => {
                        setLocatorChainStatus(`Chaining run clicked: ${card.title}`);
                        setFilterChainTaskDone(true);
                      }}
                      className="rounded-md bg-[#0B2A4A] px-2.5 py-1.5 text-xs font-semibold text-white"
                    >
                      Run Scenario
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>
        </div>

        <p
          className="mt-4 rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1D4ED8]"
          data-testid="locator-chain-status"
        >
          {locatorChainStatus}
        </p>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">Navigate Practice Modules</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Link
            href="/practice/locator-arena"
            className="rounded-lg border border-[#93C5FD] bg-[#EFF6FF] px-3 py-2 text-center text-sm font-semibold text-[#1D4ED8]"
          >
            Locator Arena
          </Link>
          <Link
            href="/practice/sandbox-basic"
            className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]"
          >
            Sandbox Basic
          </Link>
          <Link
            href="/practice/sandbox-advanced"
            className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]"
          >
            Sandbox Advanced
          </Link>
          <Link
            href="/practice/network-mocking"
            className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]"
          >
            Network Labs
          </Link>
          <Link
            href="/practice/table-pagination"
            className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]"
          >
            Table Labs
          </Link>
        </div>
      </motion.section>
    </PracticePageShell>
  );
}
