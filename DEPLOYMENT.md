# Uniteacademy — cPanel Deployment Guide

Target: **IT Host BD (Regular-Pro)** cPanel with Node.js App + MySQL.

Two artifacts:
- **Frontend** (TanStack Start SPA build) → `public_html/`
- **API** (Node.js/Express + Prisma) → `~/apps/uniteacademy-api/` via cPanel "Setup Node.js App"

---

## 1. Prerequisites (one-time in cPanel)

1. **Subdomain for API** — cPanel → Subdomains → create `api.uniteacademy.com` (docroot: `~/api.uniteacademy.com`, we won't put files there; Node app will proxy).
2. **MySQL Database** — cPanel → MySQL Databases:
   - Create DB: `cpanelusr_unitedb`
   - Create user: `cpanelusr_uniteapi` with a strong password
   - Add user to DB with **ALL PRIVILEGES**
3. **Uploads folder** — File Manager → create `~/uniteacademy-uploads/` (outside `public_html`).
4. **Node.js version** — cPanel → Setup Node.js App → confirm Node **≥ 18.18** available.
5. **SSH access** — cPanel → SSH Access → enable + add your public key.
6. **Gmail App Password** — https://myaccount.google.com/apppasswords (2FA required).

---

## 2. Local build & package

From the project root:

```bash
# 1. Fill env files
cp .env.production.example .env.production      # set VITE_API_URL
cp apps/api/.env.example apps/api/.env          # set DATABASE_URL, JWT_SECRET, SMTP, ...

# 2. Build both & create zips
bash scripts/deploy-package.sh
```

Output in `dist-deploy/`:
- `uniteacademy-frontend.zip`
- `uniteacademy-api.zip`

---

## 3. Deploy the **frontend**

1. cPanel → File Manager → `public_html/`
2. Upload `uniteacademy-frontend.zip` → **Extract**
3. Verify `.htaccess` is present (SPA fallback + HTTPS + caching).
4. Visit `https://uniteacademy.com` — page loads, routes like `/courses` work on refresh.

---

## 4. Deploy the **API**

### 4a. Upload

1. SSH: `mkdir -p ~/apps/uniteacademy-api && cd ~/apps/uniteacademy-api`
2. Upload `uniteacademy-api.zip` here → `unzip uniteacademy-api.zip`
3. `cp .env.example .env` → edit with your real values (DB URL, JWT_SECRET, SMTP, `CORS_ORIGIN=https://uniteacademy.com`).

### 4b. Install dependencies

```bash
cd ~/apps/uniteacademy-api
npm install --omit=dev
npx prisma generate
```

### 4c. Run migrations + seed

```bash
npx prisma migrate deploy
npm run seed        # creates admin user + 11 courses
```

### 4d. Register with cPanel "Setup Node.js App"

cPanel → **Setup Node.js App** → **Create Application**:
- Node.js version: **18.x** (or latest LTS available)
- Application mode: **Production**
- Application root: `apps/uniteacademy-api`
- Application URL: `api.uniteacademy.com`
- Application startup file: `passenger.js`
- Save → click **Run NPM Install** (idempotent) → **Restart**.

Passenger reads `apps/uniteacademy-api/passenger.js`, which boots `dist/index.js`.

### 4e. Verify

```
curl https://api.uniteacademy.com/api/health
# → {"ok":true,"ts":...}
```

---

## 5. Post-deploy checklist

- [ ] `/api/health` returns 200
- [ ] Login works with admin credentials from `.env`
- [ ] `/courses` lists all 11 seeded courses
- [ ] Enroll flow works from student dashboard
- [ ] Admin can create/edit courses; changes appear on public site
- [ ] Uploaded files served from `https://api.uniteacademy.com/uploads/...`
- [ ] Password-reset email arrives via Gmail SMTP
- [ ] SSL green padlock on both `uniteacademy.com` and `api.uniteacademy.com` (cPanel → SSL/TLS Status → **Run AutoSSL**)

---

## 6. Updating later

**Frontend only:**
```bash
npm run build
# zip dist/ → upload → extract into public_html (overwrite)
```

**API only:**
```bash
cd apps/api && npm run build
# rsync dist/ + prisma/ up to ~/apps/uniteacademy-api/
ssh: cd ~/apps/uniteacademy-api && npx prisma migrate deploy
# cPanel → Setup Node.js App → Restart
```

---

## 7. Troubleshooting

| Symptom | Fix |
|---|---|
| `502 Bad Gateway` on api subdomain | Setup Node.js App → **Restart**. Check `stderr.log` in the app root. |
| `PrismaClientInitializationError: Can't reach DB` | Verify `DATABASE_URL`. On cPanel MySQL, host is `localhost`, port `3306`, user/db are prefixed. |
| CORS error in browser console | Add the exact frontend origin (with scheme, no trailing slash) to `CORS_ORIGIN` in `.env`, then Restart. |
| Uploads 404 | Confirm `UPLOAD_DIR` is an absolute path the Node user can read/write. |
| SPA route 404 on refresh | `.htaccess` missing from `public_html`. Re-upload. |
| `EACCES` on migrate | Run `chmod -R u+rw ~/apps/uniteacademy-api`. |
