# Production deployment walkthrough

This repository is a monorepo. Deploy the React/Vite client as a Vercel project and the Express API as a Render web service. Use MongoDB Atlas for persistent data. The included `render.yaml` is a Render Blueprint; `client/vercel.json` supports client-side routes such as `/case/:id` when refreshed directly.

## 1. Check the repository before pushing

From the VS Code terminal, confirm the terminal is in the repository root (`AI Mistery Room`) and run:

```powershell
git status --short
git check-ignore server/.env client/.env
```

The second command should print both local `.env` paths. Do not commit `.env` files, API keys, passwords, `node_modules`, or build output. The tracked `.env.example` files contain placeholders only. If a real key or password was ever committed, rotate it before deploying; deleting it from the latest commit does not revoke it.

Commit and push the source to a GitHub repository using VS Code's Source Control panel or GitHub Desktop. Vercel and Render will deploy from that repository.

## 2. Create the production database

1. Create a MongoDB Atlas project and cluster.
2. Create a **database user** with a strong unique password. This database user is separate from the Atlas website login.
3. In **Network Access**, allow the outbound IP ranges shown in the Render service's **Connect → Outbound** panel. Add all ranges for the Render service's region. This is safer than allowing every IP.
4. In **Database → Connect → Drivers**, copy the Node.js connection string. Replace the username, password, and database name as instructed. URL-encode reserved characters in the password.
5. Keep the connection string private. You will put it in Render's environment settings, never in the frontend or repository.

## 3. Create the client project on Vercel

1. Sign in to Vercel and import your GitHub repository.
2. Set **Root Directory** to `client` and keep the **Vite** framework preset. Enable **Include source files outside of the Root Directory in the Build Step** so Vercel can see the repository's root npm workspace lockfile.
3. Keep the detected build command (`npm run build`) and output directory (`dist`).
4. Deploy once. Copy the resulting production domain, such as `https://your-project.vercel.app`.

The first deployment may show API errors until the API is configured. That's expected during setup.

## 4. Deploy the API to Render

1. In Render, select **New → Blueprint** and connect the same GitHub repository. Render reads the root `render.yaml` file and prepares the API web service on its Free compute plan for a public demo.
2. Add the required secret values when prompted, or open the service's **Environment** page and set:

   - `MONGODB_URI`: the Atlas application connection string from step 2.
   - `CLIENT_ORIGIN`: the exact Vercel production origin from step 3, with no trailing slash. Multiple origins can be separated by commas.
   - `GEMINI_API_KEY`: your Gemini API key. This is optional; without it, the API uses the built-in demo case generator.

3. Keep `GEMINI_MODEL` set to `gemini-3.8-flash` or choose a currently supported model available to your API key. Google currently recommends its newer Flash models for new projects; model availability can change.
4. Deploy. The Blueprint runs `npm ci && npm run build -w server`, then `npm run start -w server`. It uses `/api/v1/health` as the health check.
5. Open the Render service URL and check `https://YOUR-API.onrender.com/api/v1/health`. A healthy service returns JSON with `status: "ok"`.

## 5. Connect the frontend to the API

1. In Vercel, open the client project's **Settings → Environment Variables**.
2. Add `VITE_API_BASE_URL` with the value `https://YOUR-API.onrender.com/api/v1` (replace it with your real Render service URL).
3. Apply it to **Production** and save.
4. Redeploy the latest client deployment so Vite includes the new build-time variable.

`VITE_` variables are embedded in the browser bundle. Only the public API URL belongs there. Never put `GEMINI_API_KEY`, `MONGODB_URI`, or any password in a `VITE_` variable.

## 6. Verify the full deployment

1. Open the Vercel production URL and refresh a nested page to confirm SPA routing works.
2. Create a mystery and wait for generation to finish.
3. Open suspect profiles and evidence, select a suspect, submit an accusation, and confirm that the reveal appears afterward.
4. If the browser reports a CORS error, confirm Render's `CLIENT_ORIGIN` matches the Vercel domain exactly (scheme included and no path), then redeploy the API.
5. If MongoDB reports an IP access error, compare Atlas's IP access list with every outbound range shown for the Render service and region.

## Production notes

- Render sets `PORT` for web services; the server binds to `0.0.0.0` and handles `SIGTERM` for deploy shutdowns.
- Keep only one API instance while using the current in-process case-generation task runner. Moving to multiple instances should include a durable job queue/worker lock to prevent duplicate generation.
- Add custom domains only after the default domains work. If you change the frontend domain, update `CLIENT_ORIGIN`; if you change the API domain, update and redeploy `VITE_API_BASE_URL`.
- The Render Blueprint currently selects the Free compute plan for a public demo. Free web services sleep after 15 minutes without inbound traffic and may take about a minute to wake; Render documents this tier for hobby projects and previews, not production applications. For an always-on production deployment, switch to a paid plan only when you're ready. The API is configured for one instance; high availability across multiple instances would require adding a durable generation queue and coordinating Atlas backup/availability settings.
