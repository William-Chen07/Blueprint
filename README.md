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

## Gemini project planner

The workspace planner uses Gemini to turn an idea into a recommended tech
stack, a language-learning order, and a milestone-based build guide. Its API
key is used only by the server-side `/api/plan` route.

1. Copy `.env.example` to `.env.local`.
2. Set `GEMINI_API_KEY` to your key from Google AI Studio. Keep it private; do
   not add a `NEXT_PUBLIC_` prefix or commit `.env.local`.
   On macOS/Linux, restrict the local file to your user with
   `chmod 600 .env.local`.
3. Optionally set `GEMINI_MODEL` to a model available to your API key. The
   default is `gemini-3.8-flash`.
4. Restart the development server and open **My Workspace**.

The optional `node test.mjs` smoke test also reads `.env.local` and uses
`GEMINI_MODEL` or the same default model. It sends a short test prompt to
Gemini, so running it makes an API request.

For deployment, set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) using
your hosting provider's encrypted server-side secret/environment-variable
settings. Never put the key in client-side code, a `NEXT_PUBLIC_` variable,
source control, screenshots, or prompts. Restrict the key in Google Cloud to
the Generative Language API, set a quota/budget alert, and rotate the key if it
may have been shared. For a server-side app, use an IP restriction only when
your host provides a stable outbound IP; browser referrer restrictions are not
the right restriction for a server-side key.

The `/api/plan` route sends the user's idea and learning preferences to Google
Gemini over HTTPS so it can generate a plan. The key remains on the server, but
it is necessarily shared with Google's API for authentication; do not send
secret or sensitive personal information in project ideas. The route limits
input size and output tokens, rejects cross-origin browser requests, and does
not cache responses. These checks do not authenticate users or provide
persistent rate limiting: before opening the app to the public, add sign-in
and a durable per-user/IP rate limit at the app or hosting layer to prevent
others from spending your API quota.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
