export const metadata = {
  title: "Practice Popup"
};

export default function PracticePopupPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-8 text-[#0F172A]">
      <section className="mx-auto w-full max-w-2xl rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_14px_34px_-24px_rgba(11,42,74,0.35)]">
        <h1 id="popup-title" className="text-3xl font-extrabold tracking-tight text-[#0B2A4A]">
          Popup Opened Successfully
        </h1>
        <p id="popup-message" className="mt-3 text-base leading-7 text-[#475569]">
          This is a practice popup tab for Playwright automation.
        </p>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">
          Use Playwright to validate heading text, message content, and page title.
        </p>
        <span className="mt-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1D4ED8]">
          Popup Practice Ready
        </span>
      </section>
    </main>
  );
}

