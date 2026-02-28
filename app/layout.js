import "./globals.css";

export const metadata = {
  title: "Playwright Mastery Academy",
  description:
    "Playwright Mastery Academy helps QA engineers become job-ready with modern automation skills."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
