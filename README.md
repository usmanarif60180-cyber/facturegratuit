# IVOXA — The AI Business Platform

IVOXA is an AI-powered business platform for freelancers, contractors, consultants,
agencies and startups. Version 1 ships professional invoicing and quotation tools on
an architecture designed to grow into a full business suite (CRM, inventory, projects,
payments, and more) without a rewrite.

> This repository also contains the legacy static "facturegratuit" invoice-generator
> site (the HTML files at the repo root). The IVOXA app below is a separate, new
> Next.js codebase living alongside it — nothing in the legacy site was modified.

## Tech stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Firebase Authentication, Firestore, Firebase Storage
- **Charts:** Recharts

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Firebase project credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required environment variables

See `.env.example` for the full list. At minimum you need a Firebase project with
**Authentication** (Email/Password + Google providers), **Firestore**, and
**Storage** enabled, and its client config copied into `NEXT_PUBLIC_FIREBASE_*`.

### Deploying Firestore & Storage rules

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Project structure

```
app/                    Next.js App Router routes
  (marketing)/           Public marketing site (landing, pricing, features, legal…)
  (auth)/                 Login, register, password reset, email verification
  (app)/                  Authenticated workspace (dashboard, invoices, quotes, …)
src/
  components/
    ui/                   Design system primitives (Button, Card, Table, Dialog, …)
    layout/                App shell: sidebar, topbar, marketing header/footer
    invoices/ quotes/ clients/ products/ expenses/ dashboard/ ai/
    shared/                Cross-module building blocks (line items editor, status badges)
  lib/
    firebase/              Firebase app init, auth helpers, generic Firestore CRUD
    services/               Domain services (invoices, quotes, clients, products, …)
    constants/              Countries, currencies, languages, tax rate presets
    utils/                  Formatting, totals calculation, class-name helper
  hooks/                  Realtime data hooks (useInvoices, useClients, …)
  context/                Auth and theme providers
  types/                  Shared domain types (Firestore schema)
  config/                 Navigation and subscription plan definitions
```

## Data model

Every business document lives under `organizations/{organizationId}/{collection}`,
scoped to the requesting user via their `users/{uid}.organizationId` profile field.
See `firestore.rules` for the full access model and `src/types/` for the schema.

Version 1 is free for everyone; every user is provisioned with a `subscriptions`
document defaulting to the Free plan (`src/types/subscription.ts`) so upgrading to
paid tiers later is a data change, not a schema migration.

## AI Assistant

The AI Assistant module (`src/lib/services/aiService.ts`) defines a provider-agnostic
interface (`AIAssistant`) covering invoice/quote drafting, email and reminder
writing, business/tax assistance, and contract/proposal generation. Version 1 ships
a placeholder implementation with the UI fully wired up — connecting a real model
provider later means implementing that interface, not rebuilding the feature.

## Scripts

| Command           | Description                     |
| ------------------ | -------------------------------- |
| `npm run dev`       | Start the local dev server        |
| `npm run build`     | Production build                  |
| `npm run start`     | Serve the production build        |
| `npm run lint`      | Lint the codebase                 |
| `npm run typecheck` | Type-check without emitting       |
