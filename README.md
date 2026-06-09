# JobLens

A job application tracker with AI-powered tools to help you organize your search, prepare for interviews, and optimize your resume and cover letters.

---

## Features

### Application Tracking
- Add and manage job applications across five stages: **Wishlist → Applied → Interview → Offer → Rejected**
- Set priority levels (Low, Medium, High) for each application
- Store company name, job title, location, salary range, job URL, and notes
- Kanban board with drag-and-drop to move applications between stages
- Table view with filtering and sorting

### Interview & Contact Management
- Schedule and track interviews (Phone Screen, Technical, Behavioral, System Design, Final Round, Other)
- Log interview outcomes and notes
- Store recruiter and hiring manager contacts per application (name, role, email, LinkedIn)

### AI Tools (powered by Groq / Llama 3.3 70B)
- **Interview Prep** — generates 8 tailored interview questions with tips for a specific role
- **Cover Letter** — writes a professional, job-specific cover letter
- **Resume Tips** — produces 6 actionable resume improvements based on the job description

### Analytics Dashboard
- Total applications, response rate, and offer rate at a glance
- Status breakdown chart
- Priority breakdown chart
- Applications-over-time trend line
- Top companies applied to
- Pipeline funnel (Applied → Interview → Offer conversion rates)

### Authentication
- Email / password sign-up and login
- GitHub OAuth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Charts | Recharts |
| Drag & Drop | Hello Pangea DND |
| Auth | NextAuth v5 (JWT) |
| ORM | Prisma 7 |
| Database | PostgreSQL (Neon serverless) |
| AI | Groq SDK — Llama 3.3 70B |
| Validation | Zod |
| Toasts | Sonner |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech) free tier)
- A [Groq](https://console.groq.com) API key (free)
- A GitHub OAuth app (optional, for GitHub login)

### 1. Clone and install

```bash
git clone <repo-url>
cd joblens
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

# NextAuth — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-here

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Groq AI
GROQ_API_KEY=your-groq-api-key
```

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  (auth)/
    login/              Login page
    register/           Registration page
  (dashboard)/
    dashboard/          Kanban board + pipeline stats
    applications/       Applications table
    applications/[id]/  Application detail with AI tools
    ai/                 AI tools hub
    analytics/          Charts and insights
    profile/            User profile
  api/
    applications/       CRUD API for applications
    ai/                 Interview prep, cover letter, resume tips
    analytics/          Analytics data
    auth/               NextAuth handlers + registration

lib/
  auth.ts               Auth config (NextAuth, credentials + GitHub)
  auth.edge.ts          Edge-safe auth config for middleware
  prisma.ts             Prisma client
  require-user.ts       Server-side auth guard helper
  actions/              Server actions (contacts, interviews)

prisma/
  schema.prisma         Database schema
```

---

## Data Model

```
User
 └── Application (status, priority, company, role, salary, notes)
      ├── Interview (type, scheduled date, outcome)
      └── Contact  (name, role, email, linkedin)
```

---

## Auth Notes

Two auth config files exist by design: `auth.ts` runs on Node.js (handles sign-in and DB access), `auth.edge.ts` runs on the Edge runtime (used only in middleware for route protection). This split is required by Next.js because middleware cannot use Node.js-only modules like `bcrypt` or `prisma`.
