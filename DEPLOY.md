# Loo Locator Frontend — Deploy Guide

## Step 1 — Get your Google Maps API key

1. Go to https://console.cloud.google.com
2. Create a new project called "loo-locator"
3. Go to APIs & Services → Enable APIs → enable:
   - Maps JavaScript API
   - Places API
4. Go to APIs & Services → Credentials → Create Credentials → API Key
5. Copy the key

---

## Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
```

Create a new repo at https://github.com/new called `loo-locator-frontend`, then:

```bash
git remote add origin https://github.com/clean-ctrl/loo-locator-frontend.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy on Railway

1. Go to https://railway.app → your existing project (the one with your backend)
2. Click **+ New → GitHub Repo**
3. Select `loo-locator-frontend`
4. Railway will detect it as a React app

---

## Step 4 — Add Environment Variables

In Railway, click on your frontend service → **Variables** tab → add:

| Variable | Value |
|----------|-------|
| `REACT_APP_GOOGLE_MAPS_KEY` | your Google Maps API key |
| `REACT_APP_API_URL` | `https://web-production-a8a22.up.railway.app` |

Then click **Deploy**.

---

## Step 5 — Generate a domain

Settings → Networking → Generate Domain

Your app will be live at something like:
`https://loo-locator-frontend-production.up.railway.app`

---

## Running locally (optional)

```bash
cp .env.example .env
# Edit .env with your actual keys

npm install
npm start
```

Opens at http://localhost:3000
