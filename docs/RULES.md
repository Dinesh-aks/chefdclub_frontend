# Project rules

Working rules for this repo. UI and folder conventions live in [`ARCHITECTURE.md`](./ARCHITECTURE.md); product intent lives in [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md).

## Fetch only the data that is needed

- Never fetch or return more data than the screen needs.
- **List endpoints** return only the fields the table shows (use `select`/projection on the backend). Heavy fields (HTML bodies, descriptions, messages) go on the by-id endpoint only. Give list rows their own type, e.g. `FaqListItem`, `BlogPostListItem`, `ContactMessageListItem`.
- **Edit / detail pages** use the by-id endpoint. Never load a page of the list and `.find()` the record.
- Filter, search, sort and paginate on the server, not in the browser.
- Before writing frontend fetch code, check which endpoints already exist in `../chefdclub_backend`.

## API layer (`src/lib/api`)

```
src/lib/api/
  core/        shared infra: client, adminClient, adminList, types, adminAuth
  <domain>/    types.ts, website.ts (public, apiFetch), admin.ts (adminApiFetch), index.ts (barrel)
```

- Public calls go in `website.ts`, admin calls in `admin.ts`, shared types in `types.ts`.
- Import a domain through its barrel (`@/lib/api/faq`); import shared infra from `@/lib/api/core/...`.

## Admin CMS conventions

- Add and edit forms are dedicated pages (`/new`, `/[id]/edit`), not dialogs, for content with long fields (see FAQs, Menu Cards, Blog posts).
- Rich text uses `RichTextEditor` (CKEditor). Tailwind's preflight strips list markers, heading sizes and link styling, so the editor's own CSS restores them in `src/components/admin/rich-text-editor.css`.

## Database safety

- Never delete anything from the database (rows, columns, tables) and never write a migration or query that does. The database lives in `../chefdclub_backend` and is the legacy Laravel one with real data.
- To stop showing or asking for a field, remove it from the form, table and API calls only. The backend keeps the column and fills a default for `NOT NULL` ones. See `../chefdclub_backend/docs/RULES.md`.
