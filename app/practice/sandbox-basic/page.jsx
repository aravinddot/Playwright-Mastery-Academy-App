"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PracticePageShell, { revealProps, sectionClass, withDelay } from "../_components/PracticePageShell";
import { savePracticeModuleProgress } from "../../../lib/practiceProgress";

const initialStatus = {
  singleClick: "Waiting for single click.",
  doubleClick: "Waiting for double click.",
  hover: "Hover target not triggered.",
  hoverTooltip: "Tooltip not verified.",
  staticDropdown: "Static dropdown not selected.",
  form: "Form not submitted.",
  async: "Async action not started.",
  keyboard: "Press Enter in the command input.",
  readOps: "Read operation checks not executed."
};

const staticDropdownOptions = [
  { value: "", label: "Select practice level" },
  { value: "Easy", label: "Easy - Basic locator targeting" },
  { value: "Medium", label: "Medium - Filter and chaining" },
  { value: "Hard", label: "Hard - Dynamic waits and assertions" }
];

const totalSandboxBasicTasks = 9;

function SandboxResult({ label, value, dataTestId, done = false, loading = false }) {
  const stateClass = loading
    ? "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] animate-pulse"
    : done
      ? "border-[#93C5FD] bg-[linear-gradient(120deg,#F8FBFF_0%,#E8F1FF_100%)] text-[#0B2A4A] shadow-[inset_3px_0_0_0_#2563EB]"
      : "border-[#E2E8F0] bg-white text-[#64748B]";

  return (
    <div
      data-testid={dataTestId}
      className={`mt-2 flex flex-col items-start gap-2 rounded-lg border px-3 py-2 text-sm font-medium sm:flex-row sm:items-center ${stateClass}`}
    >
      <span className="font-semibold text-[#0B2A4A]">{label}:</span>
      <span>{value}</span>
      <span
        className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide sm:ml-auto ${
          done || loading ? "border-[#93C5FD] bg-white text-[#1D4ED8]" : "border-[#E2E8F0] bg-white text-[#64748B]"
        }`}
      >
        {loading ? "In Progress" : done ? "Completed" : "Pending"}
      </span>
    </div>
  );
}

export default function SandboxBasicPage() {
  const [singleClickStatus, setSingleClickStatus] = useState(initialStatus.singleClick);
  const [doubleClickStatus, setDoubleClickStatus] = useState(initialStatus.doubleClick);
  const [hoverStatus, setHoverStatus] = useState(initialStatus.hover);
  const [hoverTooltipStatus, setHoverTooltipStatus] = useState(initialStatus.hoverTooltip);
  const [isHoverTooltipVisible, setIsHoverTooltipVisible] = useState(false);
  const [staticDropdownValue, setStaticDropdownValue] = useState("");
  const [staticDropdownStatus, setStaticDropdownStatus] = useState(initialStatus.staticDropdown);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [learningMode, setLearningMode] = useState("ui");
  const [formStatus, setFormStatus] = useState(initialStatus.form);
  const [practiceForm, setPracticeForm] = useState({
    name: "",
    email: "",
    track: "",
    practiceDate: "",
    interviewDate: ""
  });

  const [isAsyncLoading, setIsAsyncLoading] = useState(false);
  const [asyncStatus, setAsyncStatus] = useState(initialStatus.async);
  const [keyboardValue, setKeyboardValue] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState(initialStatus.keyboard);
  const [readOpsStatus, setReadOpsStatus] = useState(initialStatus.readOps);
  const asyncTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (asyncTimerRef.current) clearTimeout(asyncTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const completedTasks = [
      singleClickStatus !== initialStatus.singleClick,
      doubleClickStatus !== initialStatus.doubleClick,
      hoverStatus !== initialStatus.hover,
      hoverTooltipStatus !== initialStatus.hoverTooltip,
      staticDropdownStatus !== initialStatus.staticDropdown,
      formStatus !== initialStatus.form,
      asyncStatus !== initialStatus.async && !isAsyncLoading,
      keyboardStatus !== initialStatus.keyboard,
      readOpsStatus !== initialStatus.readOps
    ].filter(Boolean).length;

    savePracticeModuleProgress("/practice/sandbox-basic", completedTasks, totalSandboxBasicTasks);
  }, [
    singleClickStatus,
    doubleClickStatus,
    hoverStatus,
    hoverTooltipStatus,
    staticDropdownStatus,
    formStatus,
    asyncStatus,
    isAsyncLoading,
    keyboardStatus,
    readOpsStatus
  ]);

  const updateForm = (key, value) => {
    setPracticeForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleStaticDropdownChange = (value) => {
    setStaticDropdownValue(value);
    setStaticDropdownStatus(value ? `Static dropdown selected: ${value}.` : initialStatus.staticDropdown);
  };

  const submitPracticeForm = (event) => {
    event.preventDefault();
    const submittedName = practiceForm.name.trim() || "Learner";
    const submittedEmail = practiceForm.email.trim() || "no-email";
    const submittedTrack = practiceForm.track || "Not selected";
    setFormStatus(`${submittedName} submitted (${submittedEmail}) for ${submittedTrack}.`);
  };

  const triggerAsyncMessage = () => {
    if (asyncTimerRef.current) clearTimeout(asyncTimerRef.current);
    setIsAsyncLoading(true);
    setAsyncStatus("Loading async result...");

    asyncTimerRef.current = setTimeout(() => {
      setIsAsyncLoading(false);
      setAsyncStatus("Async result loaded successfully.");
      asyncTimerRef.current = null;
    }, 20000);
  };

  const handleKeyboardSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = keyboardValue.trim() || "Empty command";
      setKeyboardStatus(`Command submitted: ${value}`);
    }
  };

  return (
    <PracticePageShell
      title="Interactive Playwright Sandbox Basic"
      subtitle="Practice fundamental user interactions, form controls, dynamic waits, keyboard actions, and text extraction in a basic sandbox."
      chips={["Clicks + Hover", "Inputs + Form", "Dynamic Waits + Keyboard", "Text Extraction"]}
    >
      <motion.section {...revealProps} className={sectionClass}>
        <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0 lg:grid-cols-2">
          <motion.article
            {...withDelay(0.02)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(165deg,#FFFFFF_0%,#F8FAFC_100%)] p-5 shadow-[0_14px_28px_-24px_rgba(11,42,74,0.35)]"
          >
            <h3 className="text-lg font-bold text-[#0F172A]">
              Click, Double Click, Hover, Tooltip, Static Dropdown
            </h3>
            <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
              <button
                type="button"
                data-testid="single-click-btn"
                onClick={() => setSingleClickStatus("Single click completed.")}
                className="w-full rounded-lg bg-[#2563EB] px-3 py-2 text-left text-sm font-semibold text-white sm:w-auto sm:text-center"
              >
                Single Click
              </button>
              <button
                type="button"
                data-testid="double-click-btn"
                onDoubleClick={() => setDoubleClickStatus("Double click completed.")}
                className="w-full rounded-lg border border-[#93C5FD] bg-white px-3 py-2 text-left text-sm font-semibold text-[#1D4ED8] sm:w-auto sm:text-center"
              >
                Double Click
              </button>
              <div className="relative inline-flex w-full items-center sm:w-auto">
                <button
                  type="button"
                  data-testid="hover-btn"
                  onMouseEnter={() => setHoverStatus("Hover triggered successfully.")}
                  onFocus={() => setHoverStatus("Hover triggered successfully.")}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-left text-sm font-semibold text-[#0F172A] sm:w-auto sm:text-center"
                >
                  Hover Target
                </button>
              </div>

              <div className="relative inline-flex w-full items-center sm:w-auto">
                <button
                  type="button"
                  data-testid="tooltip-trigger-btn"
                  aria-label="Tooltip target"
                  onMouseEnter={() => {
                    setHoverTooltipStatus("Tooltip verified successfully.");
                    setIsHoverTooltipVisible(true);
                  }}
                  onMouseLeave={() => setIsHoverTooltipVisible(false)}
                  onFocus={() => {
                    setHoverTooltipStatus("Tooltip verified successfully.");
                    setIsHoverTooltipVisible(true);
                  }}
                  onBlur={() => setIsHoverTooltipVisible(false)}
                  className="inline-flex h-9 w-full items-center justify-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 text-xs font-bold text-[#1D4ED8] transition-colors duration-200 hover:bg-[#DBEAFE] sm:w-auto"
                >
                  Tooltip
                </button>
                <span
                  role="tooltip"
                  data-testid="hover-tooltip"
                  className={`pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-1 text-xs font-semibold text-[#1D4ED8] shadow-[0_8px_18px_-14px_rgba(37,99,235,0.9)] transition-opacity duration-200 sm:left-[calc(100%+8px)] sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 ${
                    isHoverTooltipVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Tooltip verified
                </span>
              </div>
            </div>
            <label className="mt-3 block text-sm font-semibold text-[#334155]">
              Static Dropdown Practice
              <select
                data-testid="static-practice-select"
                value={staticDropdownValue}
                onChange={(event) => handleStaticDropdownChange(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              >
                {staticDropdownOptions.map((option) => (
                  <option key={option.value || "empty"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-3 space-y-1">
              <SandboxResult
                label="Single"
                value={singleClickStatus}
                dataTestId="single-click-status"
                done={singleClickStatus !== initialStatus.singleClick}
              />
              <SandboxResult
                label="Double"
                value={doubleClickStatus}
                dataTestId="double-click-status"
                done={doubleClickStatus !== initialStatus.doubleClick}
              />
              <SandboxResult
                label="Hover"
                value={hoverStatus}
                dataTestId="hover-status"
                done={hoverStatus !== initialStatus.hover}
              />
              <SandboxResult
                label="Tooltip"
                value={hoverTooltipStatus}
                dataTestId="hover-tooltip-status"
                done={hoverTooltipStatus !== initialStatus.hoverTooltip}
              />
              <SandboxResult
                label="Static Dropdown"
                value={staticDropdownStatus}
                dataTestId="static-dropdown-status"
                done={staticDropdownStatus !== initialStatus.staticDropdown}
              />
            </div>
          </motion.article>

          <motion.article
            {...withDelay(0.05)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(165deg,#FFFFFF_0%,#F8FAFC_100%)] p-5 shadow-[0_14px_28px_-24px_rgba(11,42,74,0.35)]"
          >
            <h3 className="text-lg font-bold text-[#0F172A]">Inputs, Checkbox, Radio, Dropdown</h3>
            <form className="mt-3 space-y-3" onSubmit={submitPracticeForm}>
              <label className="block text-sm font-semibold text-[#334155]">
                Learner Name
                <input
                  data-testid="name-input"
                  value={practiceForm.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
                  placeholder="Enter your name"
                />
              </label>
              <label className="block text-sm font-semibold text-[#334155]">
                Email
                <input
                  data-testid="email-input"
                  type="email"
                  value={practiceForm.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
                  placeholder="student@academy.com"
                />
              </label>
              <label className="block text-sm font-semibold text-[#334155]">
                Track
                <select
                  data-testid="track-select"
                  value={practiceForm.track}
                  onChange={(event) => updateForm("track", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select track</option>
                  <option value="Playwright Core">Playwright Core</option>
                  <option value="API + UI">API + UI</option>
                  <option value="CI/CD + Framework">CI/CD + Framework</option>
                </select>
              </label>
              <div className="grid gap-2 text-sm text-[#334155] sm:flex sm:flex-wrap sm:gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    data-testid="remember-checkbox"
                    type="checkbox"
                    checked={rememberChoice}
                    onChange={(event) => setRememberChoice(event.target.checked)}
                  />
                  Remember preference
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    data-testid="mode-ui-radio"
                    type="radio"
                    name="learning-mode"
                    value="ui"
                    checked={learningMode === "ui"}
                    onChange={(event) => setLearningMode(event.target.value)}
                  />
                  UI Mode
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    data-testid="mode-api-radio"
                    type="radio"
                    name="learning-mode"
                    value="api"
                    checked={learningMode === "api"}
                    onChange={(event) => setLearningMode(event.target.value)}
                  />
                  API Mode
                </label>
              </div>

              <button
                type="submit"
                data-testid="submit-form-btn"
                className="rounded-lg bg-[#0B2A4A] px-3 py-2 text-sm font-semibold text-white"
              >
                Submit Practice Form
              </button>
            </form>
            <SandboxResult
              label="Form"
              value={formStatus}
              dataTestId="form-status"
              done={formStatus !== initialStatus.form}
            />
          </motion.article>
        </div>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0 lg:grid-cols-2">
          <motion.article
            {...withDelay(0.08)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(165deg,#FFFFFF_0%,#F8FAFC_100%)] p-5 shadow-[0_14px_28px_-24px_rgba(11,42,74,0.35)]"
          >
            <h3 className="text-lg font-bold text-[#0F172A]">Dynamic Waits, Keyboard</h3>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                data-testid="async-load-btn"
                onClick={triggerAsyncMessage}
                className="rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white"
              >
                Load Async Result
              </button>
              {isAsyncLoading ? (
                <div
                  data-testid="async-spinner"
                  className="spinner animate-spin rounded-full border-2 border-[#BFDBFE] border-t-[#2563EB] p-2"
                  aria-label="Loading"
                />
              ) : null}
            </div>
            <SandboxResult
              label="Async"
              value={asyncStatus}
              dataTestId="async-status"
              done={asyncStatus !== initialStatus.async}
              loading={isAsyncLoading}
            />

            <label className="mt-4 block text-sm font-semibold text-[#334155]">
              Command Input (press Enter)
              <input
                data-testid="keyboard-input"
                value={keyboardValue}
                onChange={(event) => setKeyboardValue(event.target.value)}
                onKeyDown={handleKeyboardSubmit}
                placeholder="Type and press Enter"
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              />
            </label>
            <SandboxResult
              label="Keyboard"
              value={keyboardStatus}
              dataTestId="keyboard-status"
              done={keyboardStatus !== initialStatus.keyboard}
            />
          </motion.article>

          <motion.article
            {...withDelay(0.11)}
            className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(165deg,#FFFFFF_0%,#F8FAFC_100%)] p-5 shadow-[0_14px_28px_-24px_rgba(11,42,74,0.35)]"
          >
            <h3 className="text-lg font-bold text-[#0F172A]">Text and Attribute Extraction</h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Practice read commands: <code>textContent</code>, <code>inputValue</code>, <code>getAttribute</code>, <code>allTextContents</code>, and <code>allInnerTexts</code>.
            </p>

            <div className="mt-3 grid gap-2">
              <div
                data-testid="extract-textcontent-target"
                className="flex min-h-[42px] items-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#334155]"
              >
                TextContent target visible text
                <span className="hidden"> hidden text for textContent check</span>
              </div>

              <input
                data-testid="extract-inputvalue-target"
                defaultValue="Batch-2026-Playwright"
                className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              />

              <button
                type="button"
                title="Extraction attribute target"
                data-testid="extract-attribute-target"
                data-track="advanced-playwright"
                className="w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-2 text-left text-sm font-semibold text-[#1D4ED8]"
              >
                Attribute Target
              </button>

              <ul data-testid="extract-list" className="space-y-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#334155]">
                <li data-testid="extract-list-item">
                  API module item
                  <span className="hidden"> hidden-api</span>
                </li>
                <li data-testid="extract-list-item">
                  UI module item
                  <span className="hidden"> hidden-ui</span>
                </li>
                <li data-testid="extract-list-item">
                  CI module item
                  <span className="hidden"> hidden-ci</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              data-testid="mark-readops-btn"
              onClick={() => setReadOpsStatus("Read operation checks completed.")}
              className="mt-3 rounded-lg bg-[#0B2A4A] px-3 py-2 text-sm font-semibold text-white"
            >
              Mark Read Ops Complete
            </button>

            <SandboxResult
              label="Read Ops"
              value={readOpsStatus}
              dataTestId="readops-status"
              done={readOpsStatus !== initialStatus.readOps}
            />
          </motion.article>
        </div>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">Navigate Practice Modules</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Link
            href="/practice/locator-arena"
            className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]"
          >
            Locator Arena
          </Link>
          <Link
            href="/practice/sandbox-basic"
            className="rounded-lg border border-[#93C5FD] bg-[#EFF6FF] px-3 py-2 text-center text-sm font-semibold text-[#1D4ED8]"
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
