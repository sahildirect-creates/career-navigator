# Career Navigator by Novare Talent

## Overview
A top-of-funnel career intelligence platform. Users sign in with Google, choose between Ikigai Mode (describe passions → get 5 role suggestions) or Title Mode (enter a job title directly), then get an AI-generated career roadmap with a React Flow diagram and curated resources grouped by roadmap step.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Auth**: NextAuth.js with Google OAuth (sign-in mandatory)
- **AI**: Google Gemini API (gemini-2.5-flash for both ikigai and roadmap — free tier)
- **Database**: Supabase (Postgres) — `users` and `navigators` tables
- **Visualization**: React Flow (@xyflow/react) for career roadmap diagrams
- **Styling**: Tailwind CSS, dark luxury aesthetic (#0a0a0a bg, #D4A843 gold accent)
- **Fonts**: Playfair Display (headings), DM Sans (body)
- **Deployment**: Vercel-ready (vercel.json included)

## Project Structure
```
src/
├── app/
│   ├── page.tsx                          # Landing page (unauthenticated)
│   ├── layout.tsx                        # Root layout with Providers
│   ├── dashboard/page.tsx                # Mode selection (Ikigai / Title)
│   ├── navigator/[id]/page.tsx           # Navigator view (roadmap + resources)
│   ├── share/[slug]/page.tsx             # Public shared navigator view
│   ├── profile/page.tsx                  # My Navigators list
│   └── api/
│       ├── auth/[...nextauth]/route.ts   # NextAuth Google OAuth
│       ├── gemini/ikigai/route.ts        # Ikigai role alignment (Gemini Flash)
│       ├── gemini/navigator/route.ts     # Roadmap generation (Gemini Flash)
│       ├── navigator/save/route.ts       # Save navigator to Supabase
│       ├── navigator/[slug]/route.ts     # Fetch/update public share
│       └── profile/navigators/route.ts   # List user's saved navigators
├── components/
│   ├── AuthGuard.tsx                     # Auth gate wrapper
│   ├── Header.tsx / Footer.tsx           # Layout components
│   ├── RoadmapFlow.tsx                   # React Flow diagram wrapper
│   ├── NodeDrawer.tsx                    # Side drawer for node details
│   ├── RoleCard.tsx                      # Ikigai role suggestion card
│   ├── ResourceCard.tsx                  # Learning resource card
│   ├── LoadingSkeleton.tsx               # Loading states
│   └── Providers.tsx                     # SessionProvider wrapper
├── lib/
│   ├── auth.ts                           # NextAuth config
│   ├── gemini.ts                         # Gemini client (gemini-2.5-flash)
│   └── supabase.ts                       # Supabase client
└── types/
    └── next-auth.d.ts                    # Session type extensions
```

## Key Design Decisions

### Gemini Models
- Originally spec'd gemini-1.5-flash + gemini-1.5-pro, but those models are retired
- gemini-2.5-pro has 0 quota on free tier
- **Both routes use gemini-2.5-flash** — works on free tier

### Roadmap Consistency
- Role input is normalized (trim, lowercase, title-case, collapse whitespace) before hitting Gemini
- Temperature set to 0.2 for deterministic output
- Prompt enforces exact structure: 10 nodes, 10 resources, no type prefixes in labels
- Node structure: 2 foundation → 4 skill → 2 milestone → 1 skill → 1 goal

### Resources Grouped by Step
- Each resource has a `forNodes` array linking it to roadmap step IDs
- UI groups resources under their corresponding roadmap step with color-coded borders
- Every step must have at least one free resource

## Database (Supabase)
- **Project**: ivepmediniycgnjqzoms.supabase.co
- **Tables**: `users` (auto-populated on sign-in), `navigators` (saved roadmaps)
- Navigators store `roadmap_json` (nodes+edges) and `resources_json` separately
- Public sharing via `public_slug` + `is_public` flag

## Environment Variables
All in `.env.local`:
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — NextAuth config
- `GEMINI_API_KEY` — Google Gemini API
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — Supabase

## Running Locally
```bash
npm run dev  # starts on localhost:3000
```
Google OAuth callback must be configured: `http://localhost:3000/api/auth/callback/google`

## Common Issues
- If Gemini returns 404: model name changed, check available models via ListModels API
- If roadmap fails: check server logs for Gemini error, usually rate limiting or malformed JSON
- Auth redirect issues: ensure NEXTAUTH_URL matches the actual running port
