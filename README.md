# Tasks

A minimal personal task management app built with Next.js and Convex.

## Features

- ✅ Create, edit, and delete tasks
- 📁 Organize tasks with color-coded projects
- 📅 Schedule tasks with date and time
- ⏱️ Track time spent on tasks with built-in timer
- 🔄 Task statuses: Open → In Progress → Closed
- 🌙 Clean dark UI

## Self-Hosting Guide

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- A [Convex](https://convex.dev) account (free tier available)

### Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd checklist
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up Convex**

Create a free account at [convex.dev](https://convex.dev) and run:

```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex
- Create a new project (or link to existing)
- Generate `.env.local` with your `CONVEX_DEPLOYMENT` URL
- Start the Convex dev server

4. **Run the development server**

In a new terminal:

```bash
pnpm dev
```

5. **Open the app**

Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

The only required environment variable is automatically created by Convex:

```bash
# .env.local
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Production Deployment

#### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `CONVEX_DEPLOYMENT` - Your production Convex deployment
   - `NEXT_PUBLIC_CONVEX_URL` - Your Convex URL

4. Deploy Convex to production:

```bash
npx convex deploy
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org)
- **Database**: [Convex](https://convex.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com)
- **Icons**: [Lucide](https://lucide.dev)

