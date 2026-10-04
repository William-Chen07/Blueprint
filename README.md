# Blueprint

**Find a project. Make a plan. Learn by making.**

Blueprint helps beginners go from "I want to build something" to a finished project. Pick a project or describe your own idea, get a step-by-step plan matched to your level, and ask an AI mentor when you get stuck.

Built for RowdyHacks in 24 hours.

**Live demo:** https://149-28-248-246.sslip.io

---

## The problem

Most beginners don't fail because they can't code. They fail before they start: they don't know what to build, how big it should be, or what the first step is. Tutorials teach syntax but not how to finish a project, and getting stuck with nobody to ask is where most people quit.

## The solution

Blueprint turns a vague interest into a concrete, finishable project:

1. **Choose a starting point.** Browse real beginner-friendly projects, or bring your own idea.
2. **Get a plan.** Gemini turns the idea and your experience level into milestones and small tasks, each one teaching a specific skill.
3. **Track your progress.** Check off tasks as you go.
4. **Ask a mentor.** A patient AI mentor explains the next step, in text, and out loud when you want it.

## Features

- Landing page and project board with beginner projects
- Idea-to-plan generation powered by Gemini
- Workspace page for your plan
- Floating mentor chat panel
- Sign in with GitHub
- Voice replies from the mentor via ElevenLabs *(in progress)*

<!-- Team: update this list so it only describes what is actually merged and working before submitting. -->

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| AI | Gemini API (plans and mentor chat) |
| Voice | ElevenLabs (text to speech) |
| Projects | GitHub REST API |
| Auth | Auth.js (`next-auth`) with GitHub OAuth, JWT sessions, no database |
| Hosting | Vultr Cloud Compute (Ubuntu 24.04), Caddy for HTTPS, pm2 for process management |

There is no separate backend and no database. Server logic lives in Next.js API routes, and user progress is kept in the browser.

## Architecture

```
Browser
   |
   |  HTTPS
   v
Caddy (ports 80/443, automatic certificate)
   |
   |  reverse proxy
   v
Next.js app on port 3000 (managed by pm2)
   |-- Pages: landing, projects, dashboard, ...
   |-- /api/plan          -> Gemini (generate a plan)
   |-- /api/chat          -> Gemini (mentor replies)
   |-- /api/auth/*        -> Auth.js -> GitHub OAuth
   '-- (voice route)      -> ElevenLabs
```

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm
- A Gemini API key
- A GitHub OAuth app (for sign-in)

### 1. Clone and install

```bash
git clone https://github.com/William-Chen07/Blueprint.git
cd Blueprint
npm install
```

### 2. Create your environment file

Copy the template and fill in your own values. Never commit `.env.local`.

```bash
cp .env.example .env.local
```

| Variable | What it is |
|---|---|
| `GEMINI_API_KEY` | Gemini API key |
| `GEMINI_MODEL` | Gemini model name (see `.env.example`) |
| `ELEVENLABS_API_KEY` | ElevenLabs key for voice replies |
| `GITHUB_TOKEN` | GitHub token (no extra permissions) for the projects API |
| `AUTH_SECRET` | Random secret for signing sessions. Generate with `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | Client ID of your GitHub OAuth app |
| `AUTH_GITHUB_SECRET` | Client secret of your GitHub OAuth app |
| `AUTH_TRUST_HOST` | Production only (behind a proxy). Set to `true` |
| `AUTH_URL` | Production only. The public site URL, for example `https://149-28-248-246.sslip.io` |

### 3. Set up GitHub sign-in

1. Go to **GitHub Settings, Developer settings, OAuth Apps, New OAuth App**.
2. Add this redirect URI for local development: `http://localhost:3000/api/auth/callback/github`
3. For production, also add: `https://<your-domain>/api/auth/callback/github`
4. Copy the Client ID and a new client secret into `.env.local`.

### 4. Run it

```bash
npm run dev
```

Open http://localhost:3000.

## Deployment

The app runs on a Vultr Cloud Compute instance (Ubuntu 24.04). Caddy terminates HTTPS and proxies to the Next.js app, which pm2 keeps running and restarts after a reboot.

### First-time server setup (summary)

1. Create the instance and add your SSH key.
2. Install Node.js, git, and pm2. Clone the repo into `/opt/Blueprint`.
3. Create `/opt/Blueprint/.env.local` on the server with the production values above, including `AUTH_TRUST_HOST=true` and `AUTH_URL`.
4. Build and start: `npm ci && npm run build && pm2 start npm --name blueprint -- start`
5. Run `pm2 startup` and `pm2 save` so the app survives reboots.
6. Install Caddy and proxy the site to `localhost:3000`.
7. Open only SSH, 80, and 443 in the firewall.

### Redeploying

After changes are merged to `main`, on the server:

```bash
bash /opt/Blueprint/deploy.sh
```

This pulls `main`, installs dependencies from the lockfile, rebuilds, and restarts the app.

### Production notes

- The live URL uses an `sslip.io` hostname, which encodes the server's IP address. If the server's IP changes, update `AUTH_URL` and the OAuth app's redirect URI.
- After editing `.env.local` on the server, restart with `pm2 restart blueprint --update-env`.
- Secrets live only in `.env.local` files. They are never committed.

## Future improvements

- Profile page with GitHub avatar, bio, and recent activity
- AI-generated portfolio built from a user's repositories
- Streaks and daily activity tracking
- Friends and community tabs with shared projects
- A real database so progress syncs across devices
- Difficulty ratings for projects and smarter recommendations
- A mentor that reads the user's actual repo and gives code-aware feedback

## Team

Built at RowdyHacks by:

- **[Name]** - infrastructure, Vultr deployment, GitHub sign-in, mentor chat UI
- **[Name]** - AI and backend
- **[Name]** - dashboard
- **[Name]** - frontend and onboarding

<!-- Replace the [Name] placeholders with real names and GitHub handles. -->
