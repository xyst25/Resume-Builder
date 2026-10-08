# AI Resume Builder — Backend

Express + PostgreSQL API for the AI Resume Builder app: auth, resume CRUD,
version history, AI writing assistance, job-match analysis, ATS scoring,
and PDF resume import.

## Stack
- Node.js + Express
- PostgreSQL (`pg`) — works with a local Postgres instance or Supabase's
  Postgres connection string
- JWT auth (`jsonwebtoken` + `bcryptjs`)
- OpenAI-compatible chat completions API for AI features
- `multer` + `pdf-parse` for resume import

## Setup

```bash
cd resume-builder-backend
npm install
cp .env.example .env
# then fill in DATABASE_URL, JWT_SECRET, OPENAI_API_KEY in .env
```

Create the database tables:

```bash
npm run db:init
```

This runs `db/schema.sql` against `DATABASE_URL`. You can also run that
file directly with `psql` or paste it into the Supabase SQL editor.

Start the server:

```bash
npm run dev     # with nodemon
# or
npm start
```

The API listens on `http://localhost:5000` by default. Health check:
`GET /api/health`.

## Environment variables

See `.env.example`. Notably:
- `JWT_SECRET` — long random string, required
- `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` — used **server-side
  only**; the key is never sent to the frontend
- `AI_RATE_LIMIT_MAX` / `AI_RATE_LIMIT_WINDOW_MS` — throttles the `/api/ai/*`
  routes per user

## API overview

### Auth (`/api/auth`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/register` | — | `{ name, email, password }` |
| POST | `/login` | — | `{ email, password }` → `{ token, user }` |
| POST | `/forgot-password` | — | `{ email }` — generates a reset token (wire up an email provider to actually send it) |
| POST | `/reset-password` | — | `{ token, newPassword }` |
| GET | `/me` | ✅ | current user |

### Resumes (`/api/resumes`) — all require `Authorization: Bearer <token>`
| Method | Path | Notes |
|---|---|---|
| GET | `/` | list the current user's resumes |
| POST | `/` | create a resume |
| GET | `/:id` | fetch one (404 if not owned by the caller) |
| PUT | `/:id` | update; also snapshots a new version row |
| DELETE | `/:id` | delete |
| POST | `/:id/duplicate` | clone a resume |
| GET | `/:id/versions` | list version history |
| POST | `/:id/versions/:versionId/restore` | restore an old version |
| POST | `/import` | multipart upload, field `file` (PDF) → draft fields for user confirmation |

### AI (`/api/ai`) — auth required, rate-limited
| Method | Path | Body |
|---|---|---|
| POST | `/improve-summary` | `{ text, mode }` — mode: `improve`\|`grammar`\|`ats`\|`professional`\|`generate` |
| POST | `/improve-experience` | `{ text, mode }` |
| POST | `/improve-project` | `{ text, mode }` |
| POST | `/suggest-skills` | `{ experienceText, projectsText }` |
| POST | `/analyze-job` | `{ resumeData, jobDescription }` → ATS match score + keywords |
| POST | `/score-resume` | `{ resumeData }` → category scores + suggestions |

Every AI prompt explicitly forbids inventing jobs, degrees, skills, dates
or employers — the model may only rewrite/reorganize what the user supplied.

## Security notes
- Passwords hashed with bcrypt (12 rounds)
- JWT-based auth; every resume/version lookup re-checks `user_id` ownership
  server-side (never trusts the frontend)
- `helmet` for basic security headers, `cors` scoped to `CLIENT_URL`
- Separate, tighter rate limits on auth and AI endpoints
- AI API key only ever used server-side, never exposed to the client
- PDF import results are returned as an unsaved "draft" requiring explicit
  user confirmation before anything is written to the database

## Folder structure
```
src/
  app.js              Express app (middleware + route mounting)
  server.js            Entry point
  config/db.js         pg Pool + query helper
  config/initDb.js      Runs db/schema.sql
  middleware/           auth, error handling, rate limiting
  controllers/          auth, resumes, ai, import
  routes/                route definitions per resource
  services/aiService.js  OpenAI-compatible API wrapper + prompts
  utils/                 ApiError, asyncHandler, completion calculator
db/schema.sql           users / resumes / resume_versions tables
```

## Connecting the frontend
Point the frontend's API base URL at this server (e.g. `http://localhost:5000/api`)
and store the JWT returned from `/auth/login` or `/auth/register` (e.g. in
memory + httpOnly-cookie-backed refresh, or at minimum `localStorage` for a
prototype) and send it as `Authorization: Bearer <token>` on every
`/resumes` and `/ai` request.
