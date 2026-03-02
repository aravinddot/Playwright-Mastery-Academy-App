"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PracticePageShell, { revealProps, sectionClass, withDelay } from "../_components/PracticePageShell";
import { savePracticeModuleProgress } from "../../../lib/practiceProgress";

const cardClass =
  "rounded-xl border border-[#D9E6FF] bg-[linear-gradient(165deg,#FFFFFF_0%,#F8FAFC_100%)] p-5 shadow-[0_14px_28px_-24px_rgba(11,42,74,0.35)]";

const iframeDoc = `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:12px"><h3 id="frame-title" style="margin:0 0 8px;font-size:14px">Iframe Practice Area</h3><label for="frame-input" style="display:block;font-size:12px;font-weight:700;margin-bottom:4px">Batch Name</label><input id="frame-input" style="width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font-size:12px" placeholder="Enter batch name"/><button id="frame-save" style="margin-top:8px;border:0;border-radius:8px;background:#2563eb;color:#fff;padding:8px 10px;font-size:12px;font-weight:700;cursor:pointer">Save Batch</button><p id="frame-result" style="margin:10px 0 0;font-size:12px">Result: Pending</p><script>document.getElementById("frame-save").addEventListener("click",function(){var v=document.getElementById("frame-input").value||"Empty";document.getElementById("frame-result").textContent="Result: "+v+" saved";});</script></body></html>`;

const dynamicOptions = {
  Locators: [
    { value: "role", label: "getByRole + name" },
    { value: "text", label: "getByText + exact" },
    { value: "testid", label: "getByTestId + filter" }
  ],
  Actions: [
    { value: "click", label: "click and dblclick flow" },
    { value: "form", label: "fill + radio + checkbox" },
    { value: "dragdrop", label: "drag and drop verification" }
  ],
  Waits: [
    { value: "navigation", label: "waitForNavigation + URL" },
    { value: "response", label: "waitForResponse + route" },
    { value: "selector", label: "waitForSelector + locator.waitFor" }
  ]
};

const initialStatus = {
  dynamic: "Dynamic dropdown not selected.",
  dropdown: "No dropdown action executed.",
  dialog: "No dialog interaction yet.",
  drop: "Drop target is waiting.",
  upload: "No file selected.",
  download: "No download triggered.",
  wait: "Wait command checks not started."
};

const totalSandboxAdvancedTasks = 7;

function StatusLine({ label, value, testId, state = "idle" }) {
  const stateClass = {
    idle: "border-[#E2E8F0] bg-white text-[#64748B]",
    loading: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] animate-pulse",
    done: "border-[#93C5FD] bg-[#F8FBFF] text-[#0B2A4A] shadow-[inset_3px_0_0_0_#2563EB]"
  };
  return (
    <div
      data-testid={testId}
      className={`mt-2 flex flex-col gap-2 rounded-lg border px-3 py-2 text-sm font-medium sm:flex-row sm:items-center ${stateClass[state]}`}
    >
      <span className="font-semibold text-[#0B2A4A]">{label}:</span>
      <span>{value}</span>
      <span className="rounded-full border border-[#DBEAFE] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#1D4ED8] sm:ml-auto">
        {state === "done" ? "Completed" : state === "loading" ? "In Progress" : "Pending"}
      </span>
    </div>
  );
}

export default function SandboxAdvancedPage() {
  const [dynamicGroupValue, setDynamicGroupValue] = useState("");
  const [dynamicOptionValue, setDynamicOptionValue] = useState("");
  const [practiceDate, setPracticeDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [dynamicStatus, setDynamicStatus] = useState(initialStatus.dynamic);
  const [dropdownStatus, setDropdownStatus] = useState(initialStatus.dropdown);
  const [isHiddenDropdownVisible, setIsHiddenDropdownVisible] = useState(false);
  const [hiddenDropdownValue, setHiddenDropdownValue] = useState("");
  const [isBootstrapDropdownOpen, setIsBootstrapDropdownOpen] = useState(false);
  const [bootstrapDropdownValue, setBootstrapDropdownValue] = useState("");

  const [dialogStatus, setDialogStatus] = useState(initialStatus.dialog);
  const [dropStatus, setDropStatus] = useState(initialStatus.drop);
  const [uploadStatus, setUploadStatus] = useState(initialStatus.upload);
  const [downloadStatus, setDownloadStatus] = useState(initialStatus.download);

  const [waitStatus, setWaitStatus] = useState(initialStatus.wait);
  const [locatorWaitVisible, setLocatorWaitVisible] = useState(false);
  const [selectorWaitVisible, setSelectorWaitVisible] = useState(false);

  const locatorWaitTimerRef = useRef(null);
  const selectorWaitTimerRef = useRef(null);
  const waitNavigationTimerRef = useRef(null);
  const waitUrlTimerRef = useRef(null);
  const waitReloadTimerRef = useRef(null);

  useEffect(() => {
    if (!customElements.get("pw-shadow-lab")) {
      class PwShadowLab extends HTMLElement {
        connectedCallback() {
          if (this.shadowRoot) return;
          const root = this.attachShadow({ mode: "open" });
          root.innerHTML = `<div style="border:1px solid #cbd5e1;border-radius:12px;padding:12px;font-family:Arial,sans-serif;color:#0f172a"><p style="margin:0 0 10px;font-size:14px;font-weight:700">Shadow DOM Practice Area</p><label for="shadow-input" style="display:block;font-size:12px;font-weight:700;margin-bottom:6px">Shadow Input</label><input id="shadow-input" style="width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font-size:12px" placeholder="Type inside shadow root"/><button id="shadow-save" type="button" style="margin-top:10px;background:#2563eb;color:#fff;border:none;border-radius:8px;padding:8px 10px;font-size:12px;font-weight:700;cursor:pointer">Save Shadow Value</button><p id="shadow-result" style="margin:10px 0 0;font-size:12px">Result: Pending</p></div>`;
          const input = root.getElementById("shadow-input");
          const button = root.getElementById("shadow-save");
          const result = root.getElementById("shadow-result");
          button?.addEventListener("click", () => {
            const value = input?.value?.trim() || "Empty";
            if (result) result.textContent = `Result: ${value} saved`;
          });
        }
      }
      customElements.define("pw-shadow-lab", PwShadowLab);
    }
    return () => {
      [locatorWaitTimerRef, selectorWaitTimerRef, waitNavigationTimerRef, waitUrlTimerRef, waitReloadTimerRef].forEach((timer) => {
        if (timer.current) clearTimeout(timer.current);
      });
    };
  }, []);

  useEffect(() => {
    const waitText = waitStatus.toLowerCase();
    const waitPending =
      waitStatus === initialStatus.wait ||
      waitText.includes("in progress") ||
      waitText.includes("scheduled") ||
      waitStatus === "Triggering locator wait target..." ||
      waitStatus === "Triggering selector wait target...";

    const completedTasks = [
      dynamicStatus !== initialStatus.dynamic,
      dropdownStatus !== initialStatus.dropdown,
      dialogStatus !== initialStatus.dialog,
      dropStatus !== initialStatus.drop,
      uploadStatus !== initialStatus.upload,
      downloadStatus !== initialStatus.download,
      !waitPending
    ].filter(Boolean).length;

    savePracticeModuleProgress(
      "/practice/sandbox-advanced",
      completedTasks,
      totalSandboxAdvancedTasks
    );
  }, [
    dynamicStatus,
    dropdownStatus,
    dialogStatus,
    dropStatus,
    uploadStatus,
    downloadStatus,
    waitStatus
  ]);

  const getDelay = () => 5000 + Math.floor(Math.random() * 5001);
  const toSeconds = (ms) => (ms / 1000).toFixed(1);

  const onDynamicGroupChange = (value) => {
    setDynamicGroupValue(value);
    setDynamicOptionValue("");
    setDynamicStatus(value ? `Dynamic group selected: ${value}. Choose a dependent option.` : initialStatus.dynamic);
  };

  const onDynamicOptionChange = (value) => {
    setDynamicOptionValue(value);
    if (!value || !dynamicGroupValue) {
      setDynamicStatus(initialStatus.dynamic);
      return;
    }
    const optionLabel = dynamicOptions[dynamicGroupValue]?.find((item) => item.value === value)?.label || value;
    setDynamicStatus(`Dynamic dropdown selected: ${optionLabel}.`);
  };

  const onDragStart = (event) => event.dataTransfer.setData("text/plain", "playwright-drag-item");

  const onDrop = (event) => {
    event.preventDefault();
    setDropStatus(
      event.dataTransfer.getData("text/plain") === "playwright-drag-item"
        ? "Drop completed successfully."
        : "Dropped item did not match expected payload."
    );
  };

  const handleDownload = (type) => {
    const files = {
      pdf: { name: "practice-report.pdf", mime: "application/pdf", content: "Playwright practice PDF content" },
      csv: { name: "practice-data.csv", mime: "text/csv", content: "id,name\n1,Arun\n2,Meera\n" },
      xml: { name: "practice-data.xml", mime: "application/xml", content: "<items><item>Playwright</item></items>" },
      txt: { name: "practice-notes.txt", mime: "text/plain", content: "Playwright advanced practice notes." }
    };
    const file = files[type];
    if (!file) return;
    const blob = new Blob([file.content], { type: file.mime });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
    setDownloadStatus(`${file.name} download started.`);
  };

  const triggerWaitResponse = async () => {
    setWaitStatus("Request in progress... (5-10s)");
    try {
      const response = await fetch("/api/practice/waits-status", { cache: "no-store" });
      const data = await response.json();
      setWaitStatus(`API responded with ${response.status}: ${data.status} after ${toSeconds(data.delayMs || 0)}s.`);
    } catch {
      setWaitStatus("API request failed.");
    }
  };

  const triggerWaitUrl = () => {
    if (waitUrlTimerRef.current) clearTimeout(waitUrlTimerRef.current);
    const delay = getDelay();
    setWaitStatus(`URL update scheduled (${toSeconds(delay)}s)...`);
    waitUrlTimerRef.current = setTimeout(() => {
      window.history.replaceState({}, "", "/practice/sandbox-advanced?wait=ready#sandbox-advanced");
      setWaitStatus(`URL changed to ?wait=ready after ${toSeconds(delay)}s.`);
      waitUrlTimerRef.current = null;
    }, delay);
  };

  const triggerWaitLoadState = () => {
    if (waitReloadTimerRef.current) clearTimeout(waitReloadTimerRef.current);
    const delay = getDelay();
    setWaitStatus(`Reload scheduled (${toSeconds(delay)}s)...`);
    waitReloadTimerRef.current = setTimeout(() => {
      window.location.assign("/practice/sandbox-advanced?loadstate=ready#sandbox-advanced");
      waitReloadTimerRef.current = null;
    }, delay);
  };

  const delayedNavigation = (event) => {
    event.preventDefault();
    if (waitNavigationTimerRef.current) clearTimeout(waitNavigationTimerRef.current);
    const href = event.currentTarget.getAttribute("href");
    if (!href) return;
    const delay = getDelay();
    setWaitStatus(`Navigation scheduled (${toSeconds(delay)}s)...`);
    waitNavigationTimerRef.current = setTimeout(() => {
      window.location.assign(href);
      waitNavigationTimerRef.current = null;
    }, delay);
  };

  const revealLocatorTarget = () => {
    if (locatorWaitTimerRef.current) clearTimeout(locatorWaitTimerRef.current);
    setLocatorWaitVisible(false);
    setWaitStatus("Triggering locator wait target...");
    locatorWaitTimerRef.current = setTimeout(() => {
      setLocatorWaitVisible(true);
      setWaitStatus("Locator wait target is now visible.");
      locatorWaitTimerRef.current = null;
    }, 1200);
  };

  const revealSelectorTarget = () => {
    if (selectorWaitTimerRef.current) clearTimeout(selectorWaitTimerRef.current);
    setSelectorWaitVisible(false);
    setWaitStatus("Triggering selector wait target...");
    selectorWaitTimerRef.current = setTimeout(() => {
      setSelectorWaitVisible(true);
      setWaitStatus("Selector wait target is now visible.");
      selectorWaitTimerRef.current = null;
    }, 1400);
  };

  return (
    <PracticePageShell
      title="Interactive Playwright Sandbox Advanced"
      subtitle="Practice advanced dropdown strategies, dialogs, uploads, iFrame and Shadow DOM automation, and wait command workflows."
      chips={["Dropdown Patterns", "Dialog + Popup", "Upload + Download", "Wait Commands"]}
    >
      <motion.section {...revealProps} className={sectionClass}>
        <motion.article {...withDelay(0.02)} className={cardClass}>
          <h3 className="text-lg font-bold text-[#0F172A]">Dynamic Dropdown, Hidden Dropdown and Bootstrap Dropdown</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#334155]">
              Dynamic Dropdown Group
              <select data-testid="dynamic-group-select" value={dynamicGroupValue} onChange={(event) => onDynamicGroupChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm">
                <option value="">Select group</option>
                <option value="Locators">Locators</option>
                <option value="Actions">Actions</option>
                <option value="Waits">Waits</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-[#334155]">
              Dynamic Dropdown Option
              <select data-testid="dynamic-option-select" value={dynamicOptionValue} onChange={(event) => onDynamicOptionChange(event.target.value)} disabled={!dynamicGroupValue} className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100">
                <option value="">{dynamicGroupValue ? "Select option" : "Select group first"}</option>
                {(dynamicOptions[dynamicGroupValue] || []).map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
              <p className="text-sm font-semibold text-[#334155]">Hidden Dropdown Practice</p>
              <button type="button" data-testid="hidden-dropdown-toggle-btn" onClick={() => setIsHiddenDropdownVisible((prev) => !prev)} className="mt-2 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#1D4ED8]">
                {isHiddenDropdownVisible ? "Hide Hidden Dropdown" : "Reveal Hidden Dropdown"}
              </button>
              <div data-testid="hidden-dropdown-container" className={`mt-2 ${isHiddenDropdownVisible ? "block" : "hidden"}`}>
                <label className="block text-xs font-semibold text-[#475569]">
                  Hidden Dropdown Menu
                  <select data-testid="hidden-dropdown-select" value={hiddenDropdownValue} onChange={(event) => { setHiddenDropdownValue(event.target.value); setDropdownStatus(event.target.value ? `Hidden dropdown selected: ${event.target.value}.` : initialStatus.dropdown); }} className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-2.5 py-2 text-sm">
                    <option value="">Select hidden option</option>
                    <option value="Hidden - Core">Hidden - Core</option>
                    <option value="Hidden - Advanced">Hidden - Advanced</option>
                    <option value="Hidden - Interview">Hidden - Interview</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="relative rounded-lg border border-[#E2E8F0] bg-white p-3">
              <p className="text-sm font-semibold text-[#334155]">Bootstrap Dropdown Practice</p>
              <button type="button" data-testid="bootstrap-dropdown-trigger" aria-expanded={isBootstrapDropdownOpen} aria-controls="bootstrap-dropdown-menu" onClick={() => setIsBootstrapDropdownOpen((prev) => !prev)} className="mt-2 inline-flex w-full items-center justify-between rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-semibold text-[#334155]">
                <span>{bootstrapDropdownValue || "Select batch slot"}</span>
                <span className="text-xs text-[#64748B]">Menu</span>
              </button>
              {isBootstrapDropdownOpen ? (
                <div id="bootstrap-dropdown-menu" data-testid="bootstrap-dropdown-menu" className="absolute left-3 right-3 top-[calc(100%-2px)] z-20 rounded-md border border-[#CBD5E1] bg-white p-1 shadow-lg">
                  <button type="button" data-testid="bootstrap-dropdown-item-weekday" onClick={() => { setBootstrapDropdownValue("Weekday Batch"); setIsBootstrapDropdownOpen(false); setDropdownStatus("Bootstrap dropdown selected: Weekday Batch."); }} className="block w-full rounded px-2 py-1.5 text-left text-sm text-[#334155] hover:bg-[#EFF6FF]">Weekday Batch</button>
                  <button type="button" data-testid="bootstrap-dropdown-item-weekend" onClick={() => { setBootstrapDropdownValue("Weekend Batch"); setIsBootstrapDropdownOpen(false); setDropdownStatus("Bootstrap dropdown selected: Weekend Batch."); }} className="block w-full rounded px-2 py-1.5 text-left text-sm text-[#334155] hover:bg-[#EFF6FF]">Weekend Batch</button>
                  <button type="button" data-testid="bootstrap-dropdown-item-fasttrack" onClick={() => { setBootstrapDropdownValue("Fast Track Batch"); setIsBootstrapDropdownOpen(false); setDropdownStatus("Bootstrap dropdown selected: Fast Track Batch."); }} className="block w-full rounded px-2 py-1.5 text-left text-sm text-[#334155] hover:bg-[#EFF6FF]">Fast Track Batch</button>
                </div>
              ) : null}
              <p data-testid="bootstrap-dropdown-value" className="mt-2 text-xs font-medium text-[#64748B]">{bootstrapDropdownValue ? `Selected: ${bootstrapDropdownValue}` : "No bootstrap option selected."}</p>
            </div>
          </div>
          <StatusLine label="Dynamic Dropdown" value={dynamicStatus} testId="dynamic-dropdown-status" state={dynamicStatus !== initialStatus.dynamic ? "done" : "idle"} />
          <StatusLine label="Dropdown" value={dropdownStatus} testId="table-status" state={dropdownStatus !== initialStatus.dropdown ? "done" : "idle"} />
        </motion.article>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <motion.article {...withDelay(0.05)} className={cardClass}>
          <h3 className="text-lg font-bold text-[#0F172A]">Dialogs and Popup</h3>
          <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
            <button type="button" data-testid="alert-btn" onClick={() => { window.alert("Playwright alert practice."); setDialogStatus("Alert handled."); }} className="w-full rounded-lg border border-[#93C5FD] bg-white px-3 py-2 text-left text-sm font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Trigger Alert</button>
            <button type="button" data-testid="confirm-btn" onClick={() => setDialogStatus(window.confirm("Do you want to confirm this action?") ? "Confirm accepted." : "Confirm dismissed.")} className="w-full rounded-lg border border-[#93C5FD] bg-white px-3 py-2 text-left text-sm font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Trigger Confirm</button>
            <button type="button" data-testid="prompt-btn" onClick={() => { const value = window.prompt("Enter learner batch name", "Batch-01"); setDialogStatus(value ? `Prompt value: ${value}` : "Prompt cancelled."); }} className="w-full rounded-lg border border-[#93C5FD] bg-white px-3 py-2 text-left text-sm font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Trigger Prompt</button>
          </div>
          <StatusLine label="Dialog" value={dialogStatus} testId="dialog-status" state={dialogStatus !== initialStatus.dialog ? "done" : "idle"} />
          <a href="/practice/popup" target="_blank" rel="noopener noreferrer" data-testid="popup-link" className="mt-3 inline-flex text-sm font-semibold text-[#2563EB] underline underline-offset-4">Open popup tab</a>
        </motion.article>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <motion.article {...withDelay(0.08)} className={cardClass}>
          <h3 className="text-lg font-bold text-[#0F172A]">Drag and Drop + File Upload/Download</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div draggable data-testid="drag-source" onDragStart={onDragStart} className="cursor-move rounded-lg border border-dashed border-[#93C5FD] bg-white px-3 py-4 text-center text-sm font-semibold text-[#1D4ED8]">Drag this card</div>
            <div data-testid="drop-target" onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className="rounded-lg border border-dashed border-[#CBD5E1] bg-white px-3 py-4 text-center text-sm font-semibold text-[#334155]">Drop target</div>
          </div>
          <StatusLine label="Drop" value={dropStatus} testId="drop-status" state={dropStatus !== initialStatus.drop ? "done" : "idle"} />
          <label className="mt-4 block text-sm font-semibold text-[#334155]">Upload file
            <input data-testid="file-upload-input" type="file" accept=".pdf,.csv,.xml,.txt,text/plain,application/pdf,text/csv,application/xml,text/xml" onChange={(event) => { const file = event.target.files?.[0]; if (!file) { setUploadStatus(initialStatus.upload); return; } const valid = [".pdf", ".csv", ".xml", ".txt"].some((ext) => file.name.toLowerCase().endsWith(ext)); if (!valid) { setUploadStatus("Invalid file type. Upload PDF, CSV, XML, or TXT only."); event.target.value = ""; return; } setUploadStatus(`${file.name} uploaded successfully.`); }} className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm" />
          </label>
          <StatusLine label="Upload" value={uploadStatus} testId="upload-status" state={uploadStatus !== initialStatus.upload ? "done" : "idle"} />
          <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
            <button type="button" data-testid="download-pdf-btn" onClick={() => handleDownload("pdf")} className="w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Download PDF</button>
            <button type="button" data-testid="download-csv-btn" onClick={() => handleDownload("csv")} className="w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Download CSV</button>
            <button type="button" data-testid="download-xml-btn" onClick={() => handleDownload("xml")} className="w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Download XML</button>
            <button type="button" data-testid="download-txt-btn" onClick={() => handleDownload("txt")} className="w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Download TXT</button>
          </div>
          <StatusLine label="Download" value={downloadStatus} testId="download-status" state={downloadStatus !== initialStatus.download ? "done" : "idle"} />
        </motion.article>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <motion.article {...withDelay(0.11)} className={cardClass}>
          <h3 className="text-lg font-bold text-[#0F172A]">iFrame and Shadow DOM Practice Targets</h3>
          <iframe id="practice-iframe" data-testid="practice-iframe" title="Playwright iframe practice" srcDoc={iframeDoc} className="mt-3 h-56 w-full rounded-lg border border-[#CBD5E1] bg-white" />
          <div className="mt-3 rounded-lg border border-[#CBD5E1] bg-white p-3"><pw-shadow-lab data-testid="shadow-host" className="block w-full" /></div>
        </motion.article>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <motion.article {...withDelay(0.125)} className={cardClass}>
          <h3 className="text-lg font-bold text-[#0F172A]">Practice and Interview Dates</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#334155]">
              Practice Date
              <input
                data-testid="practice-date-picker"
                type="date"
                value={practiceDate}
                onChange={(event) => setPracticeDate(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-semibold text-[#334155]">
              Interview Date
              <input
                data-testid="interview-date-picker"
                type="date"
                value={interviewDate}
                onChange={(event) => setInterviewDate(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
        </motion.article>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <motion.article {...withDelay(0.14)} className={cardClass}>
          <h3 className="text-lg font-bold text-[#0F172A]">Wait Commands</h3>
          <p className="mt-1 text-sm text-[#64748B]">Practice: <code>waitForNavigation</code>, <code>waitForResponse</code>, <code>waitForURL</code>, <code>waitForLoadState</code>, <code>locator.waitFor</code>, and <code>waitForSelector</code>.</p>
          <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
            <a href="/practice/popup?source=waitfornavigation" data-testid="wait-navigation-link" onClick={delayedNavigation} className="block w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Navigation Link</a>
            <button type="button" data-testid="wait-response-btn" onClick={triggerWaitResponse} className="w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Trigger API Response</button>
            <button type="button" data-testid="wait-url-btn" onClick={triggerWaitUrl} className="w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Update URL</button>
            <button type="button" data-testid="wait-loadstate-link" onClick={triggerWaitLoadState} className="w-full rounded-md border border-[#BFDBFE] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#1D4ED8] sm:w-auto sm:text-center">Reload for LoadState</button>
          </div>
          <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
            <button type="button" data-testid="wait-locator-btn" onClick={revealLocatorTarget} className="w-full rounded-md bg-[#0B2A4A] px-3 py-1.5 text-left text-xs font-semibold text-white sm:w-auto sm:text-center">Reveal Locator Target</button>
            <button type="button" data-testid="wait-selector-btn" onClick={revealSelectorTarget} className="w-full rounded-md bg-[#0B2A4A] px-3 py-1.5 text-left text-xs font-semibold text-white sm:w-auto sm:text-center">Reveal Selector Target</button>
          </div>
          <div className="mt-3 space-y-2">
            {locatorWaitVisible ? (
              <div data-testid="wait-locator-target" className="rounded-lg border border-[#93C5FD] bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1D4ED8]">Locator wait target is visible.</div>
            ) : (
              <div data-testid="wait-locator-placeholder" className="rounded-lg border border-dashed border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#64748B]">Locator target hidden. Click reveal button.</div>
            )}
            {selectorWaitVisible ? (
              <div data-testid="wait-selector-target" className="rounded-lg border border-[#93C5FD] bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1D4ED8]">Selector wait target is visible.</div>
            ) : (
              <div data-testid="wait-selector-placeholder" className="rounded-lg border border-dashed border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#64748B]">Selector target hidden. Click reveal button.</div>
            )}
          </div>
          <StatusLine label="Wait Ops" value={waitStatus} testId="waitops-status" state={waitStatus === initialStatus.wait ? "idle" : waitStatus.toLowerCase().includes("in progress") || waitStatus.toLowerCase().includes("scheduled") || waitStatus === "Triggering locator wait target..." || waitStatus === "Triggering selector wait target..." ? "loading" : "done"} />
        </motion.article>
      </motion.section>

      <motion.section {...revealProps} className={sectionClass}>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">Navigate Practice Modules</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Link href="/practice/locator-arena" className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]">Locator Arena</Link>
          <Link href="/practice/sandbox-basic" className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]">Sandbox Basic</Link>
          <Link href="/practice/sandbox-advanced" className="rounded-lg border border-[#93C5FD] bg-[#EFF6FF] px-3 py-2 text-center text-sm font-semibold text-[#1D4ED8]">Sandbox Advanced</Link>
          <Link href="/practice/network-mocking" className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]">Network Labs</Link>
          <Link href="/practice/table-pagination" className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-semibold text-[#0F172A]">Table Labs</Link>
        </div>
      </motion.section>
    </PracticePageShell>
  );
}
