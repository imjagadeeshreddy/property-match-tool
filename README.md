# Plot Match

A phone-first tool for a single land broker: plots, buyer enquiries, automatic
matching between them, and a daily "follow up today" call list.

## Running it locally

```bash
npm install
npm run db:push     # creates data/plot-match.db from the schema
npm run db:seed     # optional: realistic sample plots and buyers
npm run dev         # http://localhost:3000
```

`npm run db:reset` wipes the database and re-seeds it from scratch.

## The three screens

| Screen | What it is for |
| --- | --- |
| **Home** | Stats at a glance, then the buyers to call today. First thing you see. |
| **Plots** | Everything on the books, filtered by Available / Talking / Sold. |
| **Buyers** | Every enquiry, filtered by New / Active / Closed / Lost. |

Nothing is ever deleted — sold plots and closed or lost buyers stay under their
own filter tab as a record.

## How matching works

A plot is shown as a match for a buyer when **both** are true:

1. The asking price sits inside the buyer's budget range.
2. The plot's place name loosely matches the area the buyer wants —
   case-insensitive, matched in both directions, so "Shankarpally" finds
   "Near Shankarpally". A buyer can list several areas separated by commas.

Only **available** plots are matched, and only against **new** or **active**
buyers. The rules live in [`src/lib/matching.ts`](src/lib/matching.ts) — that
one file is the whole matching engine.

## Follow-ups

A buyer appears under "Follow up today" when they are new or active and have
not been contacted for more than 5 days (never-contacted buyers come first).
Change `FOLLOW_UP_AFTER_DAYS` in [`src/lib/followups.ts`](src/lib/followups.ts)
to make it stricter or looser.

## Money is entered in lakhs

Every price field takes lakhs — type `45`, not `4500000` — and shows a live
preview (`= ₹45 L`) so what got typed is confirmed before saving. Values are
stored in rupees.

## Database

Drizzle ORM over libSQL. Locally that is a plain SQLite file at
`data/plot-match.db` with no service to run, set by `DATABASE_URL` in
`.env.local`.

**Deploying to Vercel:** Vercel's filesystem is read-only and thrown away on
each deploy, so the local file cannot travel with it. The one-line fix is to
point the same `DATABASE_URL` at a hosted libSQL database (Turso has a free
tier) and add `DATABASE_AUTH_TOKEN` — no code changes, the driver is already
the right one. See `.env.example`.

## Not in this phase

WhatsApp or any messaging, login/multi-user, commission tracking, photos,
public listings.
