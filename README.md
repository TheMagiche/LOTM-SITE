# Lord of the Mysteries — download site

Marketing site for desktop builds of the [LOTM-GAME](https://github.com/TheMagiche/LOTM-GAME) Electron app. No gameplay. Hosted on Vercel.

This repository is independent of the game repo. Keep it in a sibling folder named `lotm-site` if you develop next to the game; the game gitignores that path.

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

## Environment

Copy `.env.example` to `.env.local` as needed:

| Variable | Purpose |
|---|---|
| `GITHUB_REPO` | Game repo to poll (`owner/name`). Default `TheMagiche/LOTM-GAME`. |
| `GITHUB_TOKEN` | Optional GitHub token so Vercel is not limited to 60 unauthenticated API requests/hour. |
| `NEXT_PUBLIC_GAME_REPO_URL` | Override the game GitHub URL. |
| `NEXT_PUBLIC_DEMO_URL` | Hosted web demo. Default `https://lotmdnd.work.gd`. |
| `NEXT_PUBLIC_DISCORD_URL` | Community Discord invite. |

Download buttons read `GET /repos/{GITHUB_REPO}/releases/latest` every 5 minutes (ISR). Windows maps `.exe`, macOS `.dmg` (zip fallback), Linux `.AppImage` then `.deb`. If the latest release has none of those assets, the page shows **Coming soon**.

## GitHub + Vercel

1. Create an empty GitHub repository (for example `TheMagiche/lotm-site`).
2. From this folder:

   ```bash
   git remote add origin git@github.com:TheMagiche/lotm-site.git
   git push -u origin main
   ```

3. In Vercel: **Add New Project** → import that GitHub repo. Framework preset: Next.js.
4. Set `GITHUB_TOKEN` (recommended) and any `NEXT_PUBLIC_*` overrides in the Vercel project settings.
5. Deploy. Attach a custom domain when you have one.

Do not import this app as part of the LOTM-GAME monorepo on Vercel.
