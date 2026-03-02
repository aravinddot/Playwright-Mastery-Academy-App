export const PRACTICE_PROGRESS_STORAGE_KEY = "practice_module_task_progress_v1";

function parseStoredProgress(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function readPracticeProgress() {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(PRACTICE_PROGRESS_STORAGE_KEY);
  if (!raw) return {};
  return parseStoredProgress(raw);
}

export function writePracticeProgress(progressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(progressMap));
}

export function savePracticeModuleProgress(modulePath, completedTasks, totalTasks) {
  if (typeof window === "undefined") return;

  const current = readPracticeProgress();
  const existing = current[modulePath] || {};
  const safeTotal = Math.max(1, Number(totalTasks) || 1);
  const safeCompleted = Math.max(0, Math.min(safeTotal, Number(completedTasks) || 0));
  const existingCompleted = Math.max(
    0,
    Math.min(safeTotal, Number(existing.completedTasks) || 0)
  );

  // Keep progress monotonic: once completed, it should not drop
  // unless reset is explicitly triggered.
  const effectiveCompleted = Math.max(existingCompleted, safeCompleted);
  const percent = Math.round((effectiveCompleted / safeTotal) * 100);
  const next = {
    ...current,
    [modulePath]: {
      completedTasks: effectiveCompleted,
      totalTasks: safeTotal,
      percent,
      updatedAt: new Date().toISOString()
    }
  };

  writePracticeProgress(next);
}

export function clearPracticeProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PRACTICE_PROGRESS_STORAGE_KEY);
}
