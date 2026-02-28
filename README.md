# Playwright Mastery Academy App

A Next.js + Tailwind CSS web application for the Playwright Mastery Academy website.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion

## Prerequisites

- Node.js 18+ (recommended: Node.js 20 LTS)
- npm

## Clone and Run

```bash
git clone https://github.com/aravinddot/Playwright-Mastery-Academy-App.git
cd Playwright-Mastery-Academy-App
npm install
```

## Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_SHEETS_WEBHOOK_TOKEN=
NEXT_PUBLIC_ADVISOR_PHONE=+919000000000
```

Notes:
- `GOOGLE_SHEETS_WEBHOOK_URL` and `GOOGLE_SHEETS_WEBHOOK_TOKEN` are needed for the enroll callback form integration.
- `NEXT_PUBLIC_ADVISOR_PHONE` is used by the “Talk to Advisor” flow.

## Start Development Server

```bash
npm run dev
```

Open:

`http://localhost:3000`

## Production Build

```bash
npm run build
npm run start
```

## Project Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run lint` - Run lint command (if configured)
