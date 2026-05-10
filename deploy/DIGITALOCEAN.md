# DigitalOcean App Platform

Two apps (backend + frontend) from the same GitHub repo.

## Backend (Web Service)

### Option A — Dockerfile (recommended)

1. **Source directory:** `backend`
2. **Build strategy:** **Dockerfile** → `backend/Dockerfile`
3. **HTTP port:** `8000` (Gunicorn in `docker-entrypoint.sh`).

### Option B — Python buildpack (autodetect)

1. **Source directory:** `backend`
2. App Platform runs **`web`** from **`Procfile`**: Gunicorn binds to **`$PORT`** (usually **8080** on DO). Set the component **HTTP port** to **8080** unless you override `PORT`.
3. If deploy says **“No application module specified”**, the platform had no start command — the committed **`backend/Procfile`** fixes that.

4. **Either path:** add **Managed MySQL** (or bind DB credentials). Set runtime env vars: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `ALLOWED_HOSTS`, `MYSQL_*`, `CORS_ALLOWED_ORIGINS` (your frontend URL).

**Note:** The Python buildpack used to fail if `venv/` was committed; it is now gitignored. Docker avoids buildpack quirks entirely.

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
