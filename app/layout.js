import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Playwright Mastery Academy",
  description:
    "Playwright Mastery Academy helps QA engineers become job-ready with modern automation skills."
};

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/share/1Sq8nXtEBQ/", hoverClass: "hover:bg-[#1877F2] hover:border-[#60A5FA]" },
  { label: "Instagram", href: "https://www.instagram.com/playwright_mastery_academy?igsh=MWJtOW5pYnQ4YnFjag==", hoverClass: "hover:bg-[#E1306C] hover:border-[#F9A8D4]" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/playwright-mastery-academy/?viewAsMember=true", hoverClass: "hover:bg-[#0A66C2] hover:border-[#93C5FD]" }
];

function SocialIcon({ label }) {
  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M14.5 8H16V5h-1.8C11.9 5 10.5 6.4 10.5 8.7V10H8v3h2.5v6h3v-6h2.1l.3-3h-2.4V9.1c0-.7.3-1.1 1-1.1z"
        />
      </svg>
    );
  }

  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="7.1" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8.1" cy="8.2" r="1.1" fill="currentColor" />
      <path d="M7.1 11.1V16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M11.1 16v-2.7c0-1.3.8-2.2 2-2.2s1.9.9 1.9 2.2V16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased">
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>

          <footer className="relative overflow-hidden border-t border-[#1E3A8A]/35 bg-[linear-gradient(135deg,#0B2A4A_0%,#0F315B_45%,#1E3A8A_100%)] text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 top-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.3),transparent_70%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 h-56 w-56 bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_72%)]"
            />

            <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_24px_48px_-28px_rgba(11,42,74,0.9)] backdrop-blur-md sm:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <p className="text-lg font-bold tracking-tight">Playwright Mastery Academy</p>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      Learn modern Playwright automation with AI-assisted workflows, real project practice,
                      and hiring-focused outcomes.
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <nav
                      aria-label="Footer navigation"
                      className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-white/85"
                    >
                      <Link href="/" className="transition-colors duration-200 hover:text-[#93C5FD]">
                        Home
                      </Link>
                      <Link href="/curriculum" className="transition-colors duration-200 hover:text-[#93C5FD]">
                        Curriculum
                      </Link>
                      <Link href="/testimonials" className="transition-colors duration-200 hover:text-[#93C5FD]">
                        Testimonials
                      </Link>
                      <Link href="/practice" className="transition-colors duration-200 hover:text-[#93C5FD]">
                        Practice
                      </Link>
                      <Link href="/enroll" className="transition-colors duration-200 hover:text-[#93C5FD]">
                        Enroll
                      </Link>
                      <Link href="/admin" className="transition-colors duration-200 hover:text-[#93C5FD]">
                        Admin
                      </Link>
                    </nav>

                    <div className="flex items-center gap-2.5">
                      {socialLinks.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${item.label}`}
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white transition-[transform,background-color,border-color] duration-200 hover:-translate-y-px ${item.hoverClass}`}
                        >
                          <SocialIcon label={item.label} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/20 pt-4 text-xs text-white/70">
                  (c) {new Date().getFullYear()} Playwright Mastery Academy. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
