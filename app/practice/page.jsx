"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { clearPracticeProgress, readPracticeProgress } from "../../lib/practiceProgress";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Practice", href: "/practice" }
];

const practiceItems = [
  {
    id: "loc-role",
    fn: "getByRole()",
    category: "Locators",
    level: "Beginner",
    description: "Use semantic role-based locators for stable and accessible automation.",
    syntax: "const loginBtn = page.getByRole('button', { name: 'Login' });",
    exercise: "Locate the Login button and click after visibility assertion.",
    verify: "await expect(loginBtn).toBeVisible(); await loginBtn.click();"
  },
  {
    id: "loc-text",
    fn: "getByText()",
    category: "Locators",
    level: "Beginner",
    description: "Find visible content quickly with text-based targeting.",
    syntax: "const heading = page.getByText('Dashboard');",
    exercise: "Assert Dashboard heading appears after login.",
    verify: "await expect(heading).toBeVisible();"
  },
  {
    id: "loc-label",
    fn: "getByLabel()",
    category: "Locators",
    level: "Beginner",
    description: "Target inputs using their associated labels.",
    syntax: "await page.getByLabel('Email').fill('user@site.com');",
    exercise: "Fill email and password fields using labels only.",
    verify: "await page.getByLabel('Password').fill('Pass@123');"
  },
  {
    id: "loc-testid",
    fn: "getByTestId()",
    category: "Locators",
    level: "Intermediate",
    description: "Use testing ids for robust selectors in dynamic interfaces.",
    syntax: "const saveBtn = page.getByTestId('save-profile');",
    exercise: "Click save and verify success toast appears.",
    verify: "await saveBtn.click(); await expect(page.getByText('Saved')).toBeVisible();"
  },
  {
    id: "loc-chain",
    fn: "locator().filter()",
    category: "Locators",
    level: "Intermediate",
    description: "Narrow list items with composed selector logic.",
    syntax: "const row = page.locator('tr').filter({ hasText: 'Arun' });",
    exercise: "Select a user row and click its Edit button.",
    verify: "await row.getByRole('button', { name: 'Edit' }).click();"
  },
  {
    id: "loc-index",
    fn: "first() / last() / nth()",
    category: "Locators",
    level: "Intermediate",
    description: "Operate safely on repeated elements using index helpers.",
    syntax: "await page.locator('.card').nth(2).click();",
    exercise: "Open third card and assert detail panel appears.",
    verify: "await expect(page.getByText('Details')).toBeVisible();"
  },
  {
    id: "act-click",
    fn: "click() / dblclick() / hover()",
    category: "Actions",
    level: "Beginner",
    description: "Perform common mouse interactions on UI controls.",
    syntax: "await page.getByRole('button', { name: 'Submit' }).click();",
    exercise: "Hover menu item, then click submenu action.",
    verify: "await page.getByText('Reports').hover(); await page.getByText('Daily').click();"
  },
  {
    id: "act-fill",
    fn: "fill() / type() / press()",
    category: "Actions",
    level: "Beginner",
    description: "Enter text inputs with keyboard interactions.",
    syntax: "await page.getByPlaceholder('Search').fill('playwright');",
    exercise: "Search product and submit using Enter key.",
    verify: "await page.getByPlaceholder('Search').press('Enter');"
  },
  {
    id: "act-check",
    fn: "check() / uncheck()",
    category: "Actions",
    level: "Beginner",
    description: "Control checkbox state directly and assert behavior.",
    syntax: "await page.getByLabel('Remember me').check();",
    exercise: "Toggle remember me and verify saved preference.",
    verify: "await expect(page.getByLabel('Remember me')).toBeChecked();"
  },
  {
    id: "act-select",
    fn: "selectOption()",
    category: "Actions",
    level: "Intermediate",
    description: "Handle dropdowns by value, label, or index.",
    syntax: "await page.locator('#country').selectOption({ label: 'India' });",
    exercise: "Set country and verify dependent state list updates.",
    verify: "await expect(page.locator('#state')).toBeEnabled();"
  },
  {
    id: "act-drag",
    fn: "dragTo()",
    category: "Actions",
    level: "Advanced",
    description: "Practice drag-and-drop flows for Kanban or sortable lists.",
    syntax: "await page.locator('#task-1').dragTo(page.locator('#done-column'));",
    exercise: "Move task to Done and validate status badge.",
    verify: "await expect(page.getByText('Done')).toBeVisible();"
  },
  {
    id: "ass-visible",
    fn: "toBeVisible()",
    category: "Assertions",
    level: "Beginner",
    description: "Validate user-visible state before interactions.",
    syntax: "await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();",
    exercise: "Assert key widgets render on dashboard load.",
    verify: "await expect(page.getByText('Revenue')).toBeVisible();"
  },
  {
    id: "ass-text",
    fn: "toHaveText() / toContainText()",
    category: "Assertions",
    level: "Beginner",
    description: "Verify exact and partial textual content.",
    syntax: "await expect(page.locator('.status')).toHaveText('Active');",
    exercise: "Check badge updates after profile activation.",
    verify: "await expect(page.locator('.status')).toContainText('Active');"
  },
  {
    id: "ass-value",
    fn: "toHaveValue()",
    category: "Assertions",
    level: "Intermediate",
    description: "Ensure input fields hold expected values after actions.",
    syntax: "await expect(page.getByLabel('Email')).toHaveValue('user@site.com');",
    exercise: "Populate form and assert persisted values.",
    verify: "await expect(page.getByLabel('City')).toHaveValue('Chennai');"
  },
  {
    id: "ass-url",
    fn: "toHaveURL()",
    category: "Assertions",
    level: "Intermediate",
    description: "Confirm route transitions are correct.",
    syntax: "await expect(page).toHaveURL(/dashboard/);",
    exercise: "Login and verify redirect to dashboard.",
    verify: "await expect(page).toHaveURL(/\\/dashboard$/);"
  },
  {
    id: "ass-count",
    fn: "toHaveCount()",
    category: "Assertions",
    level: "Intermediate",
    description: "Validate list/card counts in dynamic pages.",
    syntax: "await expect(page.locator('.todo-item')).toHaveCount(5);",
    exercise: "Add item and verify total count increases.",
    verify: "await expect(page.locator('.todo-item')).toHaveCount(6);"
  },
  {
    id: "wait-load",
    fn: "waitForLoadState()",
    category: "Waits",
    level: "Beginner",
    description: "Wait for page readiness before assertions.",
    syntax: "await page.waitForLoadState('networkidle');",
    exercise: "Navigate heavy page and assert chart after load idle.",
    verify: "await expect(page.getByText('Sales Trend')).toBeVisible();"
  },
  {
    id: "wait-url",
    fn: "waitForURL()",
    category: "Waits",
    level: "Intermediate",
    description: "Synchronize test flow with route navigation.",
    syntax: "await page.waitForURL('**/orders/**');",
    exercise: "Click order tab and wait for route completion.",
    verify: "await expect(page).toHaveURL(/orders/);"
  },
  {
    id: "wait-response",
    fn: "waitForResponse()",
    category: "Waits",
    level: "Advanced",
    description: "Track specific API responses used by the UI.",
    syntax: "await page.waitForResponse((r) => r.url().includes('/api/orders') && r.ok());",
    exercise: "Wait orders API and assert first row appears.",
    verify: "await expect(page.locator('table tbody tr').first()).toBeVisible();"
  },
  {
    id: "wait-locator",
    fn: "locator.waitFor()",
    category: "Waits",
    level: "Intermediate",
    description: "Wait for locator states like visible or hidden.",
    syntax: "await page.locator('.spinner').waitFor({ state: 'hidden' });",
    exercise: "Wait spinner hides before reading results grid.",
    verify: "await expect(page.locator('.result-grid')).toBeVisible();"
  },
  {
    id: "ui-frame",
    fn: "frameLocator()",
    category: "Advanced UI",
    level: "Advanced",
    description: "Interact with nested iframe content reliably.",
    syntax: "await page.frameLocator('#payment-frame').getByLabel('Card number').fill('4242');",
    exercise: "Fill payment iframe fields and submit transaction.",
    verify: "await expect(page.getByText('Payment success')).toBeVisible();"
  },
  {
    id: "ui-popup",
    fn: "waitForEvent('popup')",
    category: "Advanced UI",
    level: "Advanced",
    description: "Control and assert content in new windows/tabs.",
    syntax: "const popupPromise = page.waitForEvent('popup'); await page.getByText('Open').click();",
    exercise: "Capture popup and verify title text.",
    verify: "const popup = await popupPromise; await expect(popup).toHaveTitle(/Support/);"
  },
  {
    id: "ui-upload",
    fn: "setInputFiles()",
    category: "Advanced UI",
    level: "Intermediate",
    description: "Automate file upload workflows.",
    syntax: "await page.locator('input[type=file]').setInputFiles('fixtures/profile.png');",
    exercise: "Upload profile image and assert preview renders.",
    verify: "await expect(page.locator('.profile-preview')).toBeVisible();"
  },
  {
    id: "ui-dialog",
    fn: "page.on('dialog')",
    category: "Advanced UI",
    level: "Advanced",
    description: "Handle alert, confirm, and prompt dialogs.",
    syntax: "page.on('dialog', async (d) => await d.accept());",
    exercise: "Trigger delete action and accept confirmation dialog.",
    verify: "await expect(page.getByText('Deleted')).toBeVisible();"
  },
  {
    id: "ui-keyboard",
    fn: "keyboard.press()",
    category: "Advanced UI",
    level: "Intermediate",
    description: "Automate keyboard shortcuts and navigation.",
    syntax: "await page.keyboard.press('Control+K');",
    exercise: "Open command palette and run quick action.",
    verify: "await expect(page.getByPlaceholder('Type a command')).toBeVisible();"
  },
  {
    id: "net-route",
    fn: "page.route()",
    category: "API + Network",
    level: "Advanced",
    description: "Intercept and modify network requests.",
    syntax: "await page.route('**/api/practice/network/profile', (route) => route.continue());",
    exercise: "Intercept profile request and validate response source in Network Lab.",
    verify: "await expect(page.getByTestId('net-profile-status')).toContainText('loaded');"
  },
  {
    id: "net-fulfill",
    fn: "route.fulfill()",
    category: "API + Network",
    level: "Advanced",
    description: "Mock API responses for deterministic tests.",
    syntax: "await page.route('**/api/practice/network/flags', (route) => route.fulfill({ json: { source: 'mocked-route', flags: { betaDashboard: true } } }));",
    exercise: "Mock feature flags in Network Lab and verify mocked source renders.",
    verify: "await expect(page.getByTestId('net-flags-source')).toContainText('mocked-route');"
  },
  {
    id: "net-continue",
    fn: "route.continue()",
    category: "API + Network",
    level: "Advanced",
    description: "Continue intercepted requests with header overrides.",
    syntax: "await page.route('**/api/practice/network/profile', (route) => route.continue({ headers: { ...route.request().headers(), 'x-intercept-source': 'route-continue' } }));",
    exercise: "Inject intercept header and verify it in Network Lab response.",
    verify: "await expect(page.getByTestId('net-continue-source')).toContainText('route-continue');"
  },
  {
    id: "runner-describe",
    fn: "test.describe()",
    category: "Test Runner",
    level: "Beginner",
    description: "Organize test scenarios into clear suites.",
    syntax: "test.describe('Checkout', () => { /* tests */ });",
    exercise: "Group login, cart, and payment tests under checkout suite.",
    verify: "Expect grouped tests in HTML report."
  },
  {
    id: "runner-hooks",
    fn: "beforeEach() / afterEach()",
    category: "Test Runner",
    level: "Intermediate",
    description: "Set up reusable preconditions and cleanup logic.",
    syntax: "test.beforeEach(async ({ page }) => { await page.goto('/login'); });",
    exercise: "Reuse login step in every account module test.",
    verify: "No duplicated login steps in test bodies."
  },
  {
    id: "runner-step",
    fn: "test.step()",
    category: "Test Runner",
    level: "Intermediate",
    description: "Make reports readable with named execution steps.",
    syntax: "await test.step('Add product to cart', async () => { /* action */ });",
    exercise: "Wrap checkout flow using named steps.",
    verify: "Step names should appear in report."
  },
  {
    id: "runner-fixme",
    fn: "test.skip() / test.fixme()",
    category: "Test Runner",
    level: "Advanced",
    description: "Control unstable or environment-specific tests safely.",
    syntax: "test.fixme(process.env.CI, 'Flaky in CI network');",
    exercise: "Skip browser-specific flaky case conditionally.",
    verify: "Suite completes without unstable test failures."
  },
  {
    id: "util-screenshot",
    fn: "page.screenshot()",
    category: "Utilities",
    level: "Beginner",
    description: "Capture visual evidence for debugging and reporting.",
    syntax: "await page.screenshot({ path: 'artifacts/home.png', fullPage: true });",
    exercise: "Capture full-page screenshot after dashboard load.",
    verify: "Screenshot file exists in artifacts."
  },
  {
    id: "util-pause",
    fn: "page.pause()",
    category: "Utilities",
    level: "Intermediate",
    description: "Pause execution and inspect selectors interactively.",
    syntax: "await page.pause();",
    exercise: "Pause on flaky step and validate locator strategy.",
    verify: "Resolve flaky step and remove pause."
  },
  {
    id: "util-trace",
    fn: "trace viewer",
    category: "Utilities",
    level: "Advanced",
    description: "Use trace artifacts to diagnose failures quickly.",
    syntax: "npx playwright show-trace trace.zip",
    exercise: "Open failing test trace and find root cause.",
    verify: "Document issue with evidence from trace."
  },
  {
    id: "util-parallel",
    fn: "parallel execution",
    category: "Utilities",
    level: "Advanced",
    description: "Run tests faster with workers and isolated data.",
    syntax: "export default defineConfig({ workers: 4 });",
    exercise: "Enable parallel run and fix shared-data conflicts.",
    verify: "Stable pass rate with reduced execution time."
  }
];

const elementScenarios = [
  {
    id: "locator-easy-pack",
    source: "Locator Practice Arena",
    title: "Easy Locator Pack (6 elements)",
    target:
      "easy-btn-start, easy-link-guide, easy-input-name, easy-input-search, easy-logo-image, easy-status",
    steps: [
      "Use getByRole/getByText to click Start Practice and Read Locator Guide.",
      "Use getByLabel and getByPlaceholder to fill easy input fields.",
      "Use getByAltText/getByTitle or getByTestId to validate logo and status chip."
    ],
    assertion: "All easy targets should be interactable/visible with stable locators."
  },
  {
    id: "locator-medium-pack",
    source: "Locator Practice Arena",
    title: "Medium Locator Pack (6 elements)",
    target:
      "medium-browser-select, medium-notes-input, medium-refresh-btn, medium-company-logo, medium-topic-list, medium-card",
    steps: [
      "Select browser with getByLabel and fill notes field.",
      "Click refresh button using getByTitle.",
      "Validate logo, topic list item, and medium card using getByAltText/getByText/locator."
    ],
    assertion: "Medium controls should pass with semantic and chained locator strategies."
  },
  {
    id: "locator-hard-pack",
    source: "Locator Practice Arena",
    title: "Hard Locator Pack (6 elements)",
    target:
      "hard-table, hard-row-action, hard-approve-btn, hard-token-input, hard-panel-active, hard-final-btn",
    steps: [
      "Filter the hard table row by text and click row action.",
      "Use getByTitle/getByLabel to interact with approve button and secret token input.",
      "Validate hard panel text and click final button with getByRole/getByTestId."
    ],
    assertion: "Hard flow should complete with combined locator + filter + chaining usage."
  },
  {
    id: "locator-filter-chaining",
    source: "Locator Practice Arena",
    title: "Filter and Chaining Locators",
    target: "filter-list, filter-open-btn, chain-card-auth, chain-card-payments, chain-card-grid, locator-chain-status",
    steps: [
      "Use locator('[data-testid=\"filter-list\"] li').filter({ hasText }) to open each challenge item.",
      "Use parent-to-child chaining on chain-card-* containers to click Run Scenario.",
      "Assert final locator-chain-status updates after filter/chaining actions."
    ],
    assertion: "Status should reflect selected filter and chaining actions."
  },
  {
    id: "sandbox-click-hover",
    source: "Interactive Playwright Sandbox",
    title: "Click, Double Click, Hover, Tooltip, Static Dropdown",
    target:
      "single-click-btn, double-click-btn, hover-btn, tooltip-trigger-btn, static-practice-select, single-click-status, double-click-status, hover-status, hover-tooltip-status, static-dropdown-status",
    steps: [
      "Click and double-click corresponding targets.",
      "Hover on hover target element and verify tooltip trigger.",
      "Select static dropdown option and assert related status cards."
    ],
    assertion:
      "Single/Double/Hover/Tooltip/Static dropdown statuses should change from pending to completed."
  },
  {
    id: "sandbox-form-controls",
    source: "Interactive Playwright Sandbox",
    title: "Form Controls",
    target: "name-input, email-input, track-select, remember-checkbox, mode-ui-radio, mode-api-radio, form-status",
    steps: [
      "Fill form fields and toggle checkbox/radio controls.",
      "Submit form and verify form-status card."
    ],
    assertion: "Form result card should show Completed state."
  },
  {
    id: "sandbox-wait-commands",
    source: "Interactive Playwright Sandbox",
    title: "Wait Commands + Keyboard + Dynamic Dropdown",
    target:
      "wait-navigation-link, wait-response-btn, wait-url-btn, wait-loadstate-link, wait-locator-target, wait-selector-target, keyboard-input, keyboard-status, dynamic-group-select, dynamic-option-select, dynamic-dropdown-status, waitops-status",
    steps: [
      "Use waitForNavigation for Navigation Link and waitForResponse for API trigger.",
      "Use waitForURL and waitForLoadState on URL and reload actions.",
      "Use locator.waitFor and waitForSelector on delayed reveal targets.",
      "Type command and press Enter, then select dynamic dropdown group and option."
    ],
    assertion: "Wait Ops, Keyboard, and Dynamic Dropdown statuses should move to completed."
  },
  {
    id: "sandbox-drag-upload-download",
    source: "Interactive Playwright Sandbox",
    title: "Drag, Upload, Download",
    target: "drag-source, drop-target, drop-status, file-upload-input, upload-status, download-pdf-btn, download-csv-btn, download-xml-btn, download-txt-btn, download-status",
    steps: [
      "Drag source element to drop target and validate drop-status.",
      "Upload valid PDF/CSV/XML/TXT file and verify upload-status.",
      "Trigger each download button and validate download-status."
    ],
    assertion: "Drop, Upload, and Download cards should show Completed state."
  },
  {
    id: "sandbox-dialog-popup",
    source: "Interactive Playwright Sandbox",
    title: "Dialogs and Popup",
    target: "alert-btn, confirm-btn, prompt-btn, dialog-status, popup-link, popup-title, popup-message",
    steps: [
      "Handle alert/confirm/prompt by listening to page dialog events.",
      "Validate dialog-status after each action.",
      "Open popup tab and verify popup heading/message."
    ],
    assertion: "Dialog status should update and popup page should render expected text."
  },
  {
    id: "sandbox-table-readops",
    source: "Interactive Playwright Sandbox",
    title: "Hidden/Bootstrap Dropdown + Text/Attribute Extraction",
    target:
      "hidden-dropdown-toggle-btn, hidden-dropdown-select, bootstrap-dropdown-trigger, bootstrap-dropdown-menu, bootstrap-dropdown-item-weekday, table-status, extract-textcontent-target, extract-inputvalue-target, extract-attribute-target, extract-list-item, readops-status",
    steps: [
      "Reveal hidden dropdown, select an option, and validate dropdown-status result.",
      "Open bootstrap dropdown menu and select batch option.",
      "Run textContent/inputValue/getAttribute extraction commands.",
      "Collect allTextContents/allInnerTexts from repeated list items and mark read ops complete."
    ],
    assertion: "Dropdown and Read Ops statuses should both show Completed state."
  },
  {
    id: "sandbox-iframe-shadow",
    source: "Interactive Playwright Sandbox",
    title: "iFrame and Shadow DOM",
    target: "practice-iframe, frame-input, frame-save, frame-result, shadow-host, shadow-input, shadow-save, shadow-result",
    steps: [
      "Use frameLocator to interact with iframe input/button and verify frame result.",
      "Locate shadow host and chain into shadow root elements.",
      "Fill and save inside shadow root, then assert shadow result text."
    ],
    assertion: "Both iframe and shadow DOM workflows should pass with visible result updates."
  },
  {
    id: "sandbox-network-mocking",
    source: "Interactive Playwright Sandbox",
    title: "Network Interception and Mocking Lab (Dedicated Page)",
    target: "network-mocking-link, net-live-profile-btn, net-continue-btn, net-flags-btn, net-orders-btn, net-orders-error-btn",
    steps: [
      "Use the network lab link to open the dedicated interception and mocking page.",
      "Practice page.route + route.continue by overriding request headers and validating intercept source.",
      "Practice route.fulfill and route.abort using flags and orders endpoints with status assertions."
    ],
    assertion: "Network lab should allow reliable route.continue, route.fulfill, and route.abort practice."
  },
  {
    id: "sandbox-table-pagination",
    source: "Interactive Playwright Sandbox",
    title: "Advanced Table Pagination and Filtering Lab (Dedicated Page)",
    target: "table-pagination-link, table-search-input, filter-role, filter-status, filter-track, filter-experience, page-size-select, pagination-next",
    steps: [
      "Open the dedicated table lab from Interactive Sandbox and validate dataset count in thousands.",
      "Apply combined filters and search, then assert filtered totals and table row contents.",
      "Change page size and navigate pagination controls to validate stable table behavior."
    ],
    assertion: "Table lab should support reliable filtering and pagination across large data sets."
  }
];

const iframeDoc = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 14px;
        background: #f8fafc;
        color: #0f172a;
      }
      .wrap {
        border: 1px solid #cbd5e1;
        background: #ffffff;
        border-radius: 10px;
        padding: 12px;
      }
      label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 6px;
      }
      input {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 8px;
        font-size: 13px;
        box-sizing: border-box;
      }
      button {
        margin-top: 10px;
        border: 0;
        border-radius: 8px;
        background: #2563eb;
        color: white;
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }
      p {
        font-size: 13px;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h3 id="frame-title">Iframe Practice Area</h3>
      <label for="frame-input">Batch Name</label>
      <input id="frame-input" placeholder="Enter batch name" />
      <button id="frame-save">Save Batch</button>
      <p id="frame-result">Result: Pending</p>
    </div>
    <script>
      document.getElementById("frame-save").addEventListener("click", function () {
        var value = document.getElementById("frame-input").value || "Empty";
        document.getElementById("frame-result").textContent = "Result: " + value + " saved";
      });
    </script>
  </body>
</html>`;

const initialSandboxStatus = {
  singleClick: "Waiting for single click.",
  doubleClick: "Waiting for double click.",
  hover: "Hover target not triggered.",
  hoverTooltip: "Tooltip not verified.",
  form: "Form not submitted.",
  staticDropdown: "Static dropdown not selected.",
  dynamicDropdown: "Dynamic dropdown not selected.",
  keyboard: "Press Enter in the command input.",
  async: "Async action not started.",
  drop: "Drop target is waiting.",
  upload: "No file selected.",
  download: "No download triggered.",
  readOps: "Read operation checks not executed.",
  waitCmd: "Wait command checks not started.",
  dialog: "No dialog interaction yet.",
  table: "No dropdown action executed."
};

const supportedUploadExtensions = [".pdf", ".csv", ".xml", ".txt"];

const downloadFileMap = {
  pdf: {
    fileName: "practice-report.pdf",
    mimeType: "application/pdf",
    content: `%PDF-1.1
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 300] /Contents 4 0 R /Resources << >> >>
endobj
4 0 obj
<< /Length 66 >>
stream
BT /F1 16 Tf 60 180 Td (Playwright Practice PDF Download Sample) Tj ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000010 00000 n
0000000065 00000 n
0000000123 00000 n
0000000238 00000 n
trailer
<< /Root 1 0 R /Size 5 >>
startxref
356
%%EOF`
  },
  csv: {
    fileName: "practice-data.csv",
    mimeType: "text/csv",
    content: "id,name,track\n1,Arun,Playwright Core\n2,Meera,API + UI\n3,Vikram,CI/CD + Framework\n"
  },
  xml: {
    fileName: "practice-data.xml",
    mimeType: "application/xml",
    content:
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<learners>\n  <learner id=\"1\" name=\"Arun\" track=\"Playwright Core\" />\n  <learner id=\"2\" name=\"Meera\" track=\"API + UI\" />\n</learners>\n"
  },
  txt: {
    fileName: "practice-notes.txt",
    mimeType: "text/plain",
    content:
      "Playwright practice notes:\n- Use waitForEvent('download') for file downloads.\n- Validate suggested filename and saved path.\n"
  }
};

const sectionClass =
  "relative overflow-hidden rounded-2xl border border-[#D9E6FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-6 shadow-[0_24px_52px_-38px_rgba(11,42,74,0.42)] sm:p-8";

const practiceMoodTips = [
  "Start with Easy locators, then finish one hard challenge before moving to waits.",
  "Run one scenario twice using different locator strategies to build selector confidence.",
  "Use slow practice first, then optimize with waits and stable assertions.",
  "After each completed action, assert the status card so your flow stays deterministic."
];

const staticDropdownOptions = [
  { value: "", label: "Select practice level" },
  { value: "Easy", label: "Easy - Basic locator targeting" },
  { value: "Medium", label: "Medium - Filter and chaining" },
  { value: "Hard", label: "Hard - Dynamic waits and assertions" }
];

const dynamicDropdownOptions = {
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
    { value: "selector", label: "waitForSelector and locator.waitFor" }
  ]
};

const practiceModuleCards = [
  {
    title: "Locator Practice Arena",
    href: "/practice/locator-arena",
    description: "Practice robust selectors from easy to hard with filter and chaining drills.",
    badge: "Locators",
    cardClass:
      "border-[#D7E6FF] bg-[linear-gradient(155deg,#FFFFFF_0%,#F3F8FF_100%)] hover:border-[#93C5FD] hover:shadow-[0_20px_40px_-30px_rgba(37,99,235,0.45)]"
  },
  {
    title: "Sandbox Basic",
    href: "/practice/sandbox-basic",
    description: "Master clicks, form controls, dynamic waits, keyboard actions, and extraction basics.",
    badge: "Core UI",
    cardClass:
      "border-[#D6EAFE] bg-[linear-gradient(155deg,#FFFFFF_0%,#F0F9FF_100%)] hover:border-[#93C5FD] hover:shadow-[0_20px_40px_-30px_rgba(14,116,144,0.4)]"
  },
  {
    title: "Sandbox Advanced",
    href: "/practice/sandbox-advanced",
    description: "Train on dropdown patterns, dialogs, uploads, iFrame, Shadow DOM, and wait commands.",
    badge: "Advanced UI",
    cardClass:
      "border-[#DDE4FF] bg-[linear-gradient(155deg,#FFFFFF_0%,#EEF2FF_100%)] hover:border-[#A5B4FC] hover:shadow-[0_20px_40px_-30px_rgba(79,70,229,0.4)]"
  },
  {
    title: "Network Interception Lab",
    href: "/practice/network-mocking",
    description: "Practice route.continue, route.fulfill, and abort workflows with live endpoint controls.",
    badge: "Network",
    testId: "network-mocking-link",
    cardClass:
      "border-[#D7E6FF] bg-[linear-gradient(155deg,#FFFFFF_0%,#EFF6FF_100%)] hover:border-[#93C5FD] hover:shadow-[0_20px_40px_-30px_rgba(37,99,235,0.45)]"
  },
  {
    title: "Tables & Filtering Lab",
    href: "/practice/table-pagination",
    description: "Validate high-volume rows, multi-filter flows, sorting logic, and stable pagination.",
    badge: "Data Grid",
    testId: "table-pagination-link",
    cardClass:
      "border-[#D7E6FF] bg-[linear-gradient(155deg,#FFFFFF_0%,#EFF6FF_100%)] hover:border-[#93C5FD] hover:shadow-[0_20px_40px_-30px_rgba(37,99,235,0.45)]"
  }
];

const practiceModulePaths = practiceModuleCards.map((module) => module.href);
const moduleTaskPlan = {
  "/practice/locator-arena": 4,
  "/practice/sandbox-basic": 9,
  "/practice/sandbox-advanced": 7,
  "/practice/network-mocking": 4,
  "/practice/table-pagination": 3
};

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

function PracticeCard({ item, delay = 0, copied, onCopy }) {
  return (
    <motion.article
      {...withDelay(delay)}
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#D7E5FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F9FF_100%)] p-5 shadow-[0_18px_36px_-26px_rgba(11,42,74,0.4)] transition-[transform,box-shadow,border-color] duration-200 md:hover:-translate-y-1 md:hover:border-[#93C5FD] md:hover:shadow-[0_24px_42px_-26px_rgba(37,99,235,0.34)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),transparent_68%)]"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
          {item.category}
        </span>
        <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#475569]">
          {item.level}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-[#0F172A]">{item.fn}</h3>
      <p className="mt-1 text-sm leading-6 text-[#475569]">{item.description}</p>

      <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#0F172A] p-3">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#93C5FD]">Syntax</p>
        <pre className="overflow-x-auto text-xs leading-5 text-[#E2E8F0]">
          <code>{item.syntax}</code>
        </pre>
      </div>

      <div className="mt-4 space-y-2 text-sm leading-6 text-[#334155]">
        <p>
          <span className="font-semibold text-[#0B2A4A]">Practice: </span>
          {item.exercise}
        </p>
        <p>
          <span className="font-semibold text-[#0B2A4A]">Verify: </span>
          {item.verify}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onCopy(item)}
        className="mt-auto rounded-lg border border-[#BFDBFE] bg-[linear-gradient(180deg,#FFFFFF_0%,#EFF6FF_100%)] px-3 py-2 text-xs font-semibold text-[#1D4ED8] transition-[transform,box-shadow,border-color,filter] duration-200 hover:-translate-y-px hover:border-[#93C5FD] hover:shadow-sm hover:brightness-105"
      >
        {copied ? "Snippet copied" : "Copy snippet"}
      </button>
    </motion.article>
  );
}

function SandboxResult({ label, value, dataTestId, state = "idle", className = "" }) {
  const stateClasses = {
    idle: "border-[#E2E8F0] bg-white text-[#64748B]",
    loading: "border-[#BFDBFE] bg-[linear-gradient(120deg,#EFF6FF_0%,#DBEAFE_100%)] text-[#1D4ED8] animate-pulse",
    done: "border-[#93C5FD] bg-[linear-gradient(120deg,#F8FBFF_0%,#E8F1FF_100%)] text-[#0B2A4A] shadow-[inset_3px_0_0_0_#2563EB]"
  };

  const chipClasses = {
    idle: "border-[#E2E8F0] bg-white text-[#64748B]",
    loading: "border-[#BFDBFE] bg-white text-[#1D4ED8]",
    done: "border-[#93C5FD] bg-white text-[#1D4ED8]"
  };

  return (
    <div
      data-testid={dataTestId}
      className={`mt-2 flex flex-col items-start gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 sm:flex-row sm:items-center ${stateClasses[state]} ${className}`}
    >
      <span className="font-semibold text-[#0B2A4A]">{label}:</span>
      <span>{value}</span>
      <span
        className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide sm:ml-auto ${chipClasses[state]}`}
      >
        {state === "done" ? "Completed" : state === "loading" ? "In Progress" : "Pending"}
      </span>
    </div>
  );
}

export default function PracticePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [copiedId, setCopiedId] = useState("");
  const [singleClickStatus, setSingleClickStatus] = useState(initialSandboxStatus.singleClick);
  const [doubleClickStatus, setDoubleClickStatus] = useState(initialSandboxStatus.doubleClick);
  const [hoverStatus, setHoverStatus] = useState(initialSandboxStatus.hover);
  const [hoverTooltipStatus, setHoverTooltipStatus] = useState(initialSandboxStatus.hoverTooltip);
  const [isHoverTooltipVisible, setIsHoverTooltipVisible] = useState(false);
  const [formStatus, setFormStatus] = useState(initialSandboxStatus.form);
  const [staticDropdownValue, setStaticDropdownValue] = useState("");
  const [dynamicGroupValue, setDynamicGroupValue] = useState("");
  const [dynamicOptionValue, setDynamicOptionValue] = useState("");
  const [staticDropdownStatus, setStaticDropdownStatus] = useState(initialSandboxStatus.staticDropdown);
  const [dynamicDropdownStatus, setDynamicDropdownStatus] = useState(initialSandboxStatus.dynamicDropdown);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [learningMode, setLearningMode] = useState("ui");
  const [practiceForm, setPracticeForm] = useState({
    name: "",
    email: "",
    track: "",
    practiceDate: "",
    interviewDate: ""
  });
  const [keyboardValue, setKeyboardValue] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState(initialSandboxStatus.keyboard);
  const [isAsyncLoading, setIsAsyncLoading] = useState(false);
  const [asyncStatus, setAsyncStatus] = useState(initialSandboxStatus.async);
  const [dropStatus, setDropStatus] = useState(initialSandboxStatus.drop);
  const [uploadedFileName, setUploadedFileName] = useState(initialSandboxStatus.upload);
  const [downloadStatus, setDownloadStatus] = useState(initialSandboxStatus.download);
  const [readOpsStatus, setReadOpsStatus] = useState(initialSandboxStatus.readOps);
  const [waitOpsStatus, setWaitOpsStatus] = useState(initialSandboxStatus.waitCmd);
  const [locatorWaitVisible, setLocatorWaitVisible] = useState(false);
  const [selectorWaitVisible, setSelectorWaitVisible] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(initialSandboxStatus.dialog);
  const [tableStatus, setTableStatus] = useState(initialSandboxStatus.table);
  const [isHiddenDropdownVisible, setIsHiddenDropdownVisible] = useState(false);
  const [hiddenDropdownValue, setHiddenDropdownValue] = useState("");
  const [isBootstrapDropdownOpen, setIsBootstrapDropdownOpen] = useState(false);
  const [bootstrapDropdownValue, setBootstrapDropdownValue] = useState("");
  const [locatorChainStatus, setLocatorChainStatus] = useState("No filter/chaining action executed.");
  const [showLocatorAnswers, setShowLocatorAnswers] = useState(false);
  const [showSandboxAnswers, setShowSandboxAnswers] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [moduleProgressMap, setModuleProgressMap] = useState({});
  const [openScenarioId, setOpenScenarioId] = useState(elementScenarios[0]?.id ?? "");
  const asyncTimerRef = useRef(null);
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
          root.innerHTML = `
            <style>
              .box {
                border: 1px solid #cbd5e1;
                border-radius: 12px;
                padding: 12px;
                background: #ffffff;
                font-family: Arial, sans-serif;
                color: #0f172a;
              }
              .title {
                margin: 0 0 10px 0;
                font-size: 14px;
                font-weight: 700;
              }
              label {
                display: block;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 6px;
              }
              input {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 8px;
                font-size: 12px;
              }
              button {
                margin-top: 10px;
                background: #2563eb;
                color: #ffffff;
                border: none;
                border-radius: 8px;
                padding: 8px 10px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
              }
              p {
                margin: 10px 0 0 0;
                font-size: 12px;
              }
            </style>
            <div class="box">
              <p class="title">Shadow DOM Practice Area</p>
              <label for="shadow-input">Shadow Input</label>
              <input id="shadow-input" placeholder="Type inside shadow root" />
              <button id="shadow-save" type="button">Save Shadow Value</button>
              <p id="shadow-result">Result: Pending</p>
            </div>
          `;

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
      if (asyncTimerRef.current) clearTimeout(asyncTimerRef.current);
      if (locatorWaitTimerRef.current) clearTimeout(locatorWaitTimerRef.current);
      if (selectorWaitTimerRef.current) clearTimeout(selectorWaitTimerRef.current);
      if (waitNavigationTimerRef.current) clearTimeout(waitNavigationTimerRef.current);
      if (waitUrlTimerRef.current) clearTimeout(waitUrlTimerRef.current);
      if (waitReloadTimerRef.current) clearTimeout(waitReloadTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % practiceMoodTips.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setModuleProgressMap(readPracticeProgress());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncProgress = () => setModuleProgressMap(readPracticeProgress());
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncProgress();
    };

    window.addEventListener("focus", syncProgress);
    window.addEventListener("storage", syncProgress);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", syncProgress);
      window.removeEventListener("storage", syncProgress);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const resetModuleProgress = () => {
    setModuleProgressMap({});
    clearPracticeProgress();
  };

  const updateForm = (key, value) => {
    setPracticeForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleStaticDropdownChange = (value) => {
    setStaticDropdownValue(value);
    setStaticDropdownStatus(value ? `Static dropdown selected: ${value}.` : initialSandboxStatus.staticDropdown);
  };

  const handleDynamicGroupChange = (value) => {
    setDynamicGroupValue(value);
    setDynamicOptionValue("");
    setDynamicDropdownStatus(
      value ? `Dynamic group selected: ${value}. Choose a dependent option.` : initialSandboxStatus.dynamicDropdown
    );
  };

  const handleDynamicOptionChange = (value) => {
    setDynamicOptionValue(value);
    if (!value || !dynamicGroupValue) {
      setDynamicDropdownStatus(initialSandboxStatus.dynamicDropdown);
      return;
    }
    const optionLabel =
      dynamicDropdownOptions[dynamicGroupValue]?.find((item) => item.value === value)?.label || value;
    setDynamicDropdownStatus(`Dynamic dropdown selected: ${optionLabel}.`);
  };

  const handleHiddenDropdownChange = (value) => {
    setHiddenDropdownValue(value);
    setTableStatus(value ? `Hidden dropdown selected: ${value}.` : initialSandboxStatus.table);
  };

  const handleBootstrapDropdownSelect = (value) => {
    setBootstrapDropdownValue(value);
    setIsBootstrapDropdownOpen(false);
    setTableStatus(`Bootstrap dropdown selected: ${value}.`);
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

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", "playwright-drag-item");
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    if (data === "playwright-drag-item") {
      setDropStatus("Drop completed successfully.");
      return;
    }
    setDropStatus("Dropped item did not match expected payload.");
  };

  const handleKeyboardSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = keyboardValue.trim() || "Empty command";
      setKeyboardStatus(`Command submitted: ${value}`);
    }
  };

  const triggerAlert = () => {
    window.alert("Playwright alert practice.");
    setDialogStatus("Alert handled.");
  };

  const triggerConfirm = () => {
    const accepted = window.confirm("Do you want to confirm this action?");
    setDialogStatus(accepted ? "Confirm accepted." : "Confirm dismissed.");
  };

  const triggerPrompt = () => {
    const value = window.prompt("Enter learner batch name", "Batch-01");
    setDialogStatus(value ? `Prompt value: ${value}` : "Prompt cancelled.");
  };

  const isSupportedUpload = (fileName = "") =>
    supportedUploadExtensions.some((extension) => fileName.toLowerCase().endsWith(extension));

  const getRandomWaitDelayMs = () => 5000 + Math.floor(Math.random() * 5001);

  const toSeconds = (ms) => (ms / 1000).toFixed(1);

  const handleDownloadFile = (type) => {
    const file = downloadFileMap[type];
    if (!file) {
      setDownloadStatus("Download failed. Unsupported file type.");
      return;
    }

    const blob = new Blob([file.content], { type: file.mimeType });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = file.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
    setDownloadStatus(`${file.fileName} download started.`);
  };

  const triggerWaitResponse = async () => {
    setWaitOpsStatus("Request in progress... (5-10s)");

    try {
      const response = await fetch("/api/practice/waits-status", { cache: "no-store" });
      const data = await response.json();
      setWaitOpsStatus(
        `API responded with ${response.status}: ${data.status} after ${toSeconds(data.delayMs || 0)}s.`
      );
    } catch {
      setWaitOpsStatus("API request failed.");
    }
  };

  const triggerWaitUrlChange = () => {
    if (waitUrlTimerRef.current) clearTimeout(waitUrlTimerRef.current);
    const delayMs = getRandomWaitDelayMs();
    setWaitOpsStatus(`URL update scheduled (${toSeconds(delayMs)}s)...`);

    waitUrlTimerRef.current = setTimeout(() => {
      router.push("/practice?wait=ready#interactive-playground");
      setWaitOpsStatus(`URL changed to ?wait=ready after ${toSeconds(delayMs)}s.`);
      waitUrlTimerRef.current = null;
    }, delayMs);
  };

  const triggerLocatorWaitTarget = () => {
    if (locatorWaitTimerRef.current) clearTimeout(locatorWaitTimerRef.current);
    setLocatorWaitVisible(false);
    setWaitOpsStatus("Triggering locator wait target...");

    locatorWaitTimerRef.current = setTimeout(() => {
      setLocatorWaitVisible(true);
      setWaitOpsStatus("Locator wait target is now visible.");
      locatorWaitTimerRef.current = null;
    }, 1200);
  };

  const triggerSelectorWaitTarget = () => {
    if (selectorWaitTimerRef.current) clearTimeout(selectorWaitTimerRef.current);
    setSelectorWaitVisible(false);
    setWaitOpsStatus("Triggering selector wait target...");

    selectorWaitTimerRef.current = setTimeout(() => {
      setSelectorWaitVisible(true);
      setWaitOpsStatus("Selector wait target is now visible.");
      selectorWaitTimerRef.current = null;
    }, 1400);
  };

  const handleDelayedNavigation = (event) => {
    event.preventDefault();
    if (waitNavigationTimerRef.current) clearTimeout(waitNavigationTimerRef.current);

    const href = event.currentTarget.getAttribute("href");
    if (!href) return;

    const delayMs = getRandomWaitDelayMs();
    setWaitOpsStatus(`Navigation scheduled (${toSeconds(delayMs)}s)...`);

    waitNavigationTimerRef.current = setTimeout(() => {
      window.location.assign(href);
      waitNavigationTimerRef.current = null;
    }, delayMs);
  };

  const triggerWaitLoadState = () => {
    if (waitReloadTimerRef.current) clearTimeout(waitReloadTimerRef.current);
    const delayMs = getRandomWaitDelayMs();
    setWaitOpsStatus(`Reload scheduled (${toSeconds(delayMs)}s)...`);

    waitReloadTimerRef.current = setTimeout(() => {
      window.location.assign("/practice?loadstate=ready#interactive-playground");
      waitReloadTimerRef.current = null;
    }, delayMs);
  };

  const toggleScenario = (scenarioId) => {
    setOpenScenarioId((prev) => (prev === scenarioId ? "" : scenarioId));
  };

  const categories = useMemo(
    () => ["All", ...new Set(practiceItems.map((item) => item.category))],
    []
  );
  const levels = useMemo(() => ["All", ...new Set(practiceItems.map((item) => item.level))], []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return practiceItems.filter((item) => {
      const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
      const levelMatch = selectedLevel === "All" || item.level === selectedLevel;
      const textMatch =
        !normalized ||
        item.fn.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        item.exercise.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized);

      return categoryMatch && levelMatch && textMatch;
    });
  }, [query, selectedCategory, selectedLevel]);

  const normalizedModuleProgress = useMemo(
    () =>
      practiceModulePaths.reduce((acc, path) => {
        const stored = moduleProgressMap[path] || {};
        const totalTasks = moduleTaskPlan[path] || 1;
        const completedTasks = Math.max(
          0,
          Math.min(totalTasks, Number(stored.completedTasks) || 0)
        );
        const percent = Math.round((completedTasks / totalTasks) * 100);

        acc[path] = {
          totalTasks,
          completedTasks,
          percent
        };

        return acc;
      }, {}),
    [moduleProgressMap]
  );

  const completedCheckpointCount = useMemo(
    () =>
      Object.values(normalizedModuleProgress).filter((module) => module.percent === 100).length,
    [normalizedModuleProgress]
  );

  const totalCheckpointCount = practiceModulePaths.length;
  const totalTaskCount = useMemo(
    () =>
      Object.values(normalizedModuleProgress).reduce(
        (sum, module) => sum + module.totalTasks,
        0
      ),
    [normalizedModuleProgress]
  );
  const completedTaskCount = useMemo(
    () =>
      Object.values(normalizedModuleProgress).reduce(
        (sum, module) => sum + module.completedTasks,
        0
      ),
    [normalizedModuleProgress]
  );

  const sessionProgress =
    totalTaskCount > 0 ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0;

  const activeChallengeLabel =
    sessionProgress === 100
      ? "Mission Complete"
      : sessionProgress >= 60
        ? "Momentum Mode"
        : sessionProgress > 0
          ? "Warm-up Mode"
          : "Not Started";

  const copySnippet = async (item) => {
    const text = `${item.fn}\n${item.syntax}\nPractice: ${item.exercise}\nVerify: ${item.verify}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(""), 1400);
    } catch {
      setCopiedId("");
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_12%_9%,rgba(37,99,235,0.08),transparent_36%),radial-gradient(circle_at_88%_26%,rgba(59,130,246,0.07),transparent_34%),#F8FAFC] text-[#0F172A]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_8%_15%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_92%_12%,rgba(29,78,216,0.12),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(147,197,253,0.18),transparent_34%)]"
      />
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
          className="pointer-events-none absolute -left-16 top-4 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.22),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-48 w-56 bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_72%)]"
        />
        <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8 lg:py-14">
          <div className="rounded-2xl border border-white/20 bg-[linear-gradient(165deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)] p-6 shadow-[0_24px_50px_-24px_rgba(11,42,74,0.82)] backdrop-blur-md sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <motion.h1 {...revealProps} className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Playwright Practice Lab
                </motion.h1>
                <motion.p
                  {...revealProps}
                  transition={{ ...revealProps.transition, delay: 0.05 }}
                  className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg"
                >
                  Practice Playwright end-to-end with dedicated locator drills, sandbox workflows,
                  network interception, and high-volume table filtering labs.
                </motion.p>

                <motion.div
                  {...revealProps}
                  transition={{ ...revealProps.transition, delay: 0.1 }}
                  className="mt-6 flex flex-wrap gap-3"
                >
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                    Core Function Drills
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                    Basic + Advanced Sandbox
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                    Network + Table Labs
                  </span>
                </motion.div>

              </div>

              <motion.aside
                {...revealProps}
                transition={{ ...revealProps.transition, delay: 0.08 }}
                className="rounded-2xl border border-white/25 bg-[linear-gradient(170deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.08)_100%)] p-5 shadow-[0_18px_36px_-24px_rgba(11,42,74,0.72)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DBEAFE]">
                  Practice Tracks
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">
                    Locator Fundamentals
                  </div>
                  <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">
                    Interactive Sandbox Flows
                  </div>
                  <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">
                    Network + Data Grid Challenges
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-white/85">
                  Recommended path: Locator Arena -&gt; Sandbox Basic -&gt; Sandbox Advanced -&gt; Network -&gt; Tables.
                </p>
              </motion.aside>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 lg:px-8 lg:py-12">
        <motion.section {...revealProps} className={sectionClass}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-xl border border-[#D9E6FF] bg-[linear-gradient(135deg,#0B2A4A_0%,#1E3A8A_100%)] p-5 text-white shadow-[0_18px_34px_-22px_rgba(11,42,74,0.55)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BFDBFE]">
                  Practice Momentum
                </p>
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  {activeChallengeLabel}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/85">
                Complete dedicated modules to build steady automation confidence without burnout.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#DBEAFE]">
                  Drill Library: {practiceItems.length}
                </span>
                <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#DBEAFE]">
                  Filtered View: {filteredItems.length}
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#DBEAFE]">
                  <span>
                    Progress: {completedTaskCount}/{totalTaskCount} tasks
                  </span>
                  <span>{sessionProgress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/15">
                  <motion.div
                    initial={false}
                    animate={{ width: `${sessionProgress}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="h-full rounded-full bg-[linear-gradient(90deg,#60A5FA_0%,#DBEAFE_100%)]"
                  />
                </div>
              </div>
              <p className="mt-4 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-[#E2E8F0]">
                {practiceMoodTips[tipIndex]}
              </p>
            </article>

            <article className="rounded-xl border border-[#D9E6FF] bg-white p-5 shadow-[0_16px_30px_-24px_rgba(11,42,74,0.36)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Module Progress
              </p>
              <p className="mt-2 text-sm text-[#475569]">
                Quick Jump navigation is not required here. Use module cards below and track completion here.
              </p>
              <div className="mt-4 grid gap-2">
                {practiceModuleCards.map((module) => (
                  <div
                    key={module.href}
                    className="inline-flex items-center justify-between rounded-lg border border-[#DBEAFE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-3 py-2 text-sm"
                  >
                    <span className="font-semibold text-[#0F172A]">{module.title}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        normalizedModuleProgress[module.href]?.percent === 100
                          ? "border-[#93C5FD] bg-[#EFF6FF] text-[#1D4ED8]"
                          : "border-[#E2E8F0] bg-white text-[#64748B]"
                      }`}
                    >
                      {normalizedModuleProgress[module.href]?.completedTasks}/
                      {normalizedModuleProgress[module.href]?.totalTasks} tasks
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={resetModuleProgress}
                  className="inline-flex items-center rounded-lg border border-[#BFDBFE] bg-[linear-gradient(180deg,#FFFFFF_0%,#EFF6FF_100%)] px-3 py-2 text-xs font-semibold text-[#1D4ED8] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-[#93C5FD] hover:shadow-sm"
                >
                  Reset Module Progress
                </button>
              </div>
            </article>
          </div>
        </motion.section>

                <motion.section id="practice-modules" {...revealProps} className={sectionClass}>
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
              Dedicated Practice Modules
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
              Open each practice module in its own page for focused learning and cleaner navigation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {practiceModuleCards.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                data-testid={module.testId}
                className={`group rounded-2xl border p-4 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 ${module.cardClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full border border-[#DBEAFE] bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB]">
                    {module.badge}
                  </span>
                  <span className="text-sm font-bold text-[#1D4ED8] transition-transform duration-200 group-hover:translate-x-0.5">
                    &gt;
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold text-[#0F172A]">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#475569]">{module.description}</p>
              </Link>
            ))}
          </div>
        </motion.section>

      </main>
    </div>
  );
}



