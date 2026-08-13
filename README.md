This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Portfolio Assistant

The portfolio includes a multilingual AI assistant available on every page. It answers questions in English, French, Modern Standard Arabic, and Moroccan Darija using only the documented portfolio content.

### Setup

Copy `.env.example` to `.env.local` and add a server-side Groq API key:

```env
GROQ_API_KEY=your_key_here
```

Never prefix this key with `NEXT_PUBLIC_`. Install and start the project normally:

```bash
npm install
npm run dev
```

### Architecture

- `components/chatbot/` contains the floating widget, messages, input, and resource cards.
- `app/api/chat/route.ts` validates requests and calls Groq from the server using the open-source `llama-3.1-8b-instant` model.
- `lib/chatbot/` builds the controlled context, prompt, resource catalog, types, and validation.
- `data/profile.ts` contains profile facts that are not already represented elsewhere.
- Existing projects, certifications, skills, and journey entries are read directly from `data/` as the source of truth.

To update the assistant's knowledge, edit the relevant file in `data/`. New project and certification resources are derived automatically from their existing URLs and public assets. Add other verified resources to `lib/chatbot/resources.ts`.

The current rate limiter is deliberately lightweight and process-local. Replace it with a shared store such as Redis before deploying across multiple production instances at scale.

The model uses Groq JSON Object Mode. The server validates the returned shape, retries once when JSON is invalid, and resolves resource IDs through the controlled local catalog. Groq free-tier limits may change; consult the Limits page in your Groq Console for the quota attached to your account.

### Fast path and language preference

`lib/chatbot/intent-resolver.ts` handles greetings, CV, projects, certifications, skills, GitHub, LinkedIn, contact, and explicit language switches locally. These requests do not call Groq or consume the local LLM-request quota. Other questions receive a topic-filtered portfolio context before the Groq call.

An explicit request to continue in English, French, Arabic, or Moroccan Darija is kept in the widget state for the current page session. Darija detection supports Arabic script, Latin Arabizi, and common mixed French/Darija phrasing.

### V3 knowledge and reasoning

The controlled knowledge base now includes verified facts from the public CV, domain metadata for projects, and relevance metadata for certifications. `portfolio-context.ts` selects the relevant domain and content for Backend, Data Science, education, project, certification, and comparison questions. Complex requests containing words such as projects or certifications bypass the simple-list fast path when they ask for a comparison, ranking, candidacy assessment, or explanation.

`grounded-reasoning.ts` guarantees evidence-based answers for key recruiter comparisons and selections when the small Groq model omits requested reasoning or returns invalid JSON. It never introduces facts outside the structured portfolio data.

### V4 intent safety

V4 analyzes response constraints and resolves named projects/certifications before the legacy list fast paths. Trusted deterministic responses protect against false premises, preserve the distinction between “not documented” and “false,” and support recruiter comparisons and conversational follow-ups without unnecessary Groq calls. Run `npm run test:chatbot-v4` to build the application and exercise the 20 regression scenarios plus the conversational test through `/api/chat`.

### V4.2 semantic routing

Unknown formulations now pass through a small Groq semantic router before any portfolio generation. The router receives no full portfolio context and can select a deterministic local response, request a necessary clarification, or authorize grounded generation with a filtered context. Exact local commands and trusted anti-hallucination responses remain available during a Groq outage. Run `npm run test:chatbot-v4-2` for semantic, clarification, multilingual, grounding, and provider-outage regression coverage.
