# Chefdclub — Project brief (migration)

This document is the **source of truth for product intent**. Read it before major frontend or cross-repo work. UI and folder conventions live in `ARCHITECTURE.md`.

## What we are building

The client is moving off **Laravel 5.8** to this repo: **Next.js** public site (new design) plus a **modern admin panel**, backed by **`chefdclub_backend`** (Node REST APIs). **Same features and existing data** as Laravel; **new UI only**.

| Layer | Location |
|-------|----------|
| Legacy Laravel (reference + data) | `E:\chefdclub\laravel_code` |
| Frontend (this repo) | `E:\chefdclub\code\chefdclub_frontend` |
| Backend APIs | `E:\chefdclub\code\chefdclub_backend` |

## Frontend scope

- **`src/app/(website)/`** — public marketing site (client design).
- **`src/app/admin/`** — admin panel (professional UI; feature parity with Laravel `/Admin/...`).
- **`src/features/`** — feature-based modules; replace static `data.ts` with `src/lib/api/` as backend endpoints ship.

## Delivery

Work in **vertical slices** with the backend (e.g. reservations: form → API → admin list). Do not leave forms disconnected from the API once that module exists on the backend.

Full cross-stack brief: `../../chefdclub_backend/docs/PROJECT_BRIEF.md`

**Env:** use `.env` (from `.env.example`) only — same convention as the backend.
