# DigitalOcean App Platform

Two apps (backend + frontend) from the same GitHub repo.

## Backend (Web Service)

1. **Source directory:** `backend`
2. **Build strategy:** **Dockerfile** (not autodetect). Set Dockerfile path to `backend/Dockerfile` (or repo-relative `Dockerfile` if the UI resolves from `backend/`).
3. **HTTP port:** `8000` (matches Gunicorn in `docker-entrypoint.sh`).
4. Add **Managed MySQL** (or bind DB credentials). Set runtime env vars: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `ALLOWED_HOSTS`, `MYSQL_*`, `CORS_ALLOWED_ORIGINS` (your frontend URL).

**Why Dockerfile:** The Python buildpack fails if a committed `venv/` exists. The repo ignores `backend/venv/`; Docker builds use `.dockerignore` and never install from that folder.

## Frontend (choose one)

### Option A — Static Site (recommended)

1. Create a **Static Site** (not Web Service).
2. **Source directory:** `frontend`
3. **Build command:** `npm ci && npm run build`
4. **Output directory:** `dist`
5. **Build-time environment:** `VITE_API_URL` = your backend public URL, e.g. `https://your-api.ondigitalocean.app/api`

Set **`CORS_ALLOWED_ORIGINS`** on the backend to the static site origin (e.g. `https://your-frontend.ondigitalocean.app`).

### Option B — Web Service + Node buildpack

1. **Source directory:** `frontend`
2. Let DO use the **Node** buildpack (autodetect).
3. **Run command:** leave default so `npm start` runs after build. This repo defines `start` as `vite preview` on `PORT` (default 8080). Set the component **HTTP port** to **8080** if DO does not inject `PORT` as 8080.

Option A is cheaper and simpler for a SPA; Option B is a fallback if you must use a Web Service.
