# API reference

Base URL: `http://localhost:5000/api/v1`. All responses use `{ "success": true, "data": ... }` or `{ "success": false, "error": ... }`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | API health |
| POST | `/mysteries` | Create a case. Body: `scenario` (30–3000 chars), optional `title`, `genre`, `difficulty`, `tone`, `language`, `suspectCount`, `evidenceTypes`. Returns `mysteryId` and `status`. |
| GET | `/mysteries/:id/status` | Poll generation status |
| GET | `/mysteries/:id` | Public case summary and counts |
| GET | `/mysteries/:id/suspects` | Public suspect profiles |
| GET | `/mysteries/:id/evidence` | Evidence metadata; optional `type` and `suspect` filters |
| GET | `/mysteries/:id/evidence/:evidenceId` | Validated evidence detail |
| POST | `/mysteries/:id/accusations` | Submit `{ selectedSuspectKey, sessionId }`; one final answer per case/session |
| GET | `/mysteries/:id/verdict?sessionId=...` | Reveal the solution after that session submits an accusation |

The API server owns answer evaluation. Do not add culprit or correctness fields to public case responses. Session IDs are browser-generated lookup identifiers for this MVP, not authentication credentials.

## Local development

Run `npm install`, configure `server/.env`, then run `npm run dev` at the repository root. MongoDB is required. Gemini is optional: without `GEMINI_API_KEY`, the deterministic built-in fictional scenario generator is used. The frontend defaults to `http://localhost:5000/api/v1`; override with `VITE_API_BASE_URL`.
