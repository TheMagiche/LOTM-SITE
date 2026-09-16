# Lord of the Mysteries — download site

Marketing site for desktop builds of Lord of the Mysteries. No gameplay. Hosted on Vercel.

This repository is independent of the private game source. It also hosts **GitHub Releases** (the `.exe` / `.dmg` / `.AppImage` / `.deb` files). Keep the folder named `lotm-site` next to the game if you develop locally; the game gitignores that path.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Desktop installers

Packaging still uses the LOTM-GAME tree (Electron, natives, `gamedata`). This repo’s workflow clones that tree, packs on Windows / macOS / Linux runners, and uploads into **this** repo’s Releases.

1. GitHub → **LOTM-SITE** → Actions → **Electron installers** → Run workflow.
2. Tag defaults to `v2.0.0`. `game_ref` is the LOTM-GAME branch or SHA to pack (`main` by default).
3. If LOTM-GAME is private, add a repo secret **`LOTM_GAME_TOKEN`** (classic PAT with `repo`) on LOTM-SITE so the workflow can clone it.

Download buttons poll `GET /repos/TheMagiche/LOTM-SITE/releases/latest`. Every CTA opens that release page.

## Environment (Vercel)

Demo, Discord, and source URLs are hardcoded. Do **not** add `NEXT_PUBLIC_*` variables.

| Variable | Vercel type | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | **Sensitive** (no `NEXT_PUBLIC_` prefix) | Lets the Next server read this repo’s releases. Without it, GitHub often rate-limits Vercel. |

Create a classic token at [GitHub tokens](https://github.com/settings/tokens) with `public_repo`. Vercel → Project → Settings → Environment Variables → Sensitive → Production (and Preview). Redeploy.

## GitHub + Vercel

1. This folder is `TheMagiche/LOTM-SITE` and must stay **public** so visitors can download Release assets.
2. Vercel: import that repo (not the LOTM-GAME monorepo). Framework: Next.js.
3. Add `GITHUB_TOKEN`. Deploy.

LOTM-GAME can be private once installers live on this repo’s Releases.
