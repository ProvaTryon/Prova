# Project Guidelines

## Code Style
- Keep changes type-safe and minimal in all projects (`backend`, `frontend`, `tryon`).
- Use existing path aliases instead of deep relative imports:
  - Backend: `@/*` -> `backend/src/*`
  - Frontend: `@/*` -> `frontend/*`
- Backend formatting is enforced by Prettier with LF line endings (`backend/.prettierrc` has `"endOfLine": "lf"`). If you see `Delete ␍` lint noise, run Prettier on the touched file.
- For Next.js API routes that import `frontend/lib/cloudinary.ts`, keep `export const runtime = "nodejs"`.

## Architecture
- Backend uses layered Express architecture:
  - Routes in `backend/src/routes/*`
  - Request validation in `backend/src/schemas/*` + `backend/src/middleware/validate.middleware.ts`
  - Controllers in `backend/src/controller/*`
  - Business logic in `backend/src/services/*`
  - Persistence in `backend/src/models/*`
- Backend error flow is centralized through `AppError` and `errorHandler` middleware (`backend/src/utils/appError.util.ts`, `backend/src/middleware/error.middleware.ts`).
- Frontend is Next.js App Router with locale segmenting (`frontend/app/[locale]`) and API/transport helpers in `frontend/lib/*-service.ts`.
- Try-on service is FastAPI-based (`tryon/main.py`, `tryon/app/*`) with routers/services split for try-on, VTON360, and measurements.

## Build and Test
- Prefer direct project commands over root Makefile targets (Makefile references `backend-web`, while this workspace uses `backend`).

Backend (`backend`):
- Install: `pnpm -C backend install`
- Dev server: `pnpm -C backend run dev`
- Build: `pnpm -C backend run build`
- Type-check: `pnpm -C backend exec tsc --noEmit`
- Lint: `pnpm -C backend run lint`
- Format: `pnpm -C backend run format`

Frontend (`frontend`):
- Install: `pnpm -C frontend install`
- Dev server: `pnpm -C frontend run dev`
- Build: `pnpm -C frontend run build`
- Lint: `pnpm -C frontend run lint`
- Type-check: `pnpm -C frontend exec tsc --noEmit`

Try-on service (`tryon`):
- Install: `pip install -r tryon/requirements.txt`
- Run API: `python tryon/main.py`
- Test: `pytest tryon/tests/`

## Conventions
- Backend request validation pattern:
  1. Add/extend a Zod schema in `backend/src/schemas/*`.
  2. Attach `validate(schema)` in the route.
  3. Keep controller logic focused on orchestration and response handling.
- Backend startup depends on valid env and DB connectivity:
  - Environment is validated at startup (`backend/src/config/env.validation.ts`) and exits on invalid config.
  - DB connection failure exits process (`backend/src/config/connection.db.ts`).
- API error responses follow a consistent shape from middleware (`success`, `msg`, optional `details`, optional `stack` in development).
- In frontend builds, `next.config.mjs` sets `ignoreBuildErrors` and `ignoreDuringBuilds`; always run lint/type-check manually when changing frontend code.
- AI service URL fallback in backend config: `MEASUREMENTS_SERVICE_URL ?? AI_SERVICE_URL ?? SHAPY_SERVICE_URL` (`backend/src/config/base.ts`).

## Reference Docs
- Try-on service overview: `tryon/README.md`
- Backend integration details: `tryon/docs/INTEGRATION_GUIDE.md`
- Try-on architecture and maintenance notes: `tryon/docs/DEVELOPER_NOTES.md`
- Try-on performance/evaluation notes: `tryon/docs/EVALUATION_NOTES.md`
- Team planning context: `TODO.md`
