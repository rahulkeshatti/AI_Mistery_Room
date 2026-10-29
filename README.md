# AI Mystery Room

A fictional detective game built with React, Express, MongoDB, and Gemini. Players create a scenario, inspect independently accessible evidence, accuse a suspect, and receive the server-calculated reveal.

## Start

1. Install Node.js 20+ and MongoDB (local or hosted).
2. Run `npm install` at the repository root.
3. Copy `server/.env.example` to `server/.env`; set `MONGODB_URI` and optionally `GEMINI_API_KEY`. Copy `client/.env.example` to `client/.env` if your API is not at the default URL.
4. Run `npm run dev`. The API is at `http://localhost:5000`; Vite is at `http://localhost:5173`.

Without a Gemini key, the server uses a deterministic, fictional built-in case generator so the complete MVP flow remains playable. This fallback is for local development and demonstration. For live AI generation, set `GEMINI_API_KEY`; generation uses the configured model and validates the resulting case before saving it.

## Configuration

See [server/.env.example](server/.env.example) and [client/.env.example](client/.env.example). Never put provider keys in frontend environment variables.

## API

The API is versioned at `/api/v1`; the health route is `/api/v1/health`. Mystery creation returns an ID immediately; poll the status endpoint, load the overview/suspects/evidence, and post an accusation to unlock that session's reveal.

All content is fictional and intended for a game. No real person, records, messaging account, or surveillance feed is involved.

## Production deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the GitHub → Vercel + Render + MongoDB Atlas walkthrough. The repository includes `render.yaml` and the Vercel SPA rewrite configuration.
