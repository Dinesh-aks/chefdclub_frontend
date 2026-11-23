# ChefdClub Frontend

Frontend foundation for ChefdClub, built with Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

**Product context (Laravel migration, admin + website scope):** see [`docs/PROJECT_BRIEF.md`](./docs/PROJECT_BRIEF.md).

## Tech stack

- [Next.js](https://nextjs.org/) — App Router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://motion.dev/)

## Getting started

```bash
cp .env.example .env   # Windows: copy .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project structure

```
src/
├── app/
│   ├── (website)/     # Public website route group
│   ├── admin/         # Admin route group
│   ├── layout.tsx     # Root layout
│   └── globals.css    # Global styles / Tailwind entry
├── components/
│   ├── ui/            # shadcn/ui primitives
│   ├── shared/        # Shared cross-cutting components
│   ├── website/       # Website-specific components
│   └── admin/         # Admin-specific components
├── features/          # Feature modules
├── lib/
│   ├── api/           # API client code
│   ├── utils/         # Utility functions
│   └── constants/     # Shared constants
├── hooks/             # Shared React hooks
├── types/             # Shared TypeScript types
└── config/            # App configuration
```

## Environment variables

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_API_URL` (see `.env.example`). Production values are set on the host at deploy time.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run start` — run the production build
- `npm run lint` — run ESLint
