<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Pomodoro Timer

Live site: https://umutc.github.io/pomodoro/

React + Vite Pomodoro timer with GitHub Pages deployment.

## Quick Start

**Prerequisite:** Node.js 20+

1) Install deps: `npm install`
2) (Optional) Set `GEMINI_API_KEY` in a `.env.local` file if you want the Gemini features used in the app.
3) Run dev server: `npm run dev` (served at `http://localhost:3000`)

## Build

`npm run build` outputs static files to `dist/` with the base path set to `/pomodoro/` for GitHub Pages.

## Deploy (GitHub Pages)

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`):
- Push to `main` → build + deploy to Pages.
- Manual trigger: `gh workflow run deploy.yml` or rerun the latest run: `gh run rerun --latest`.

The published site lives at `https://umutc.github.io/pomodoro/`.
