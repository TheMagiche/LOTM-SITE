export const GAME_REPO = process.env.GITHUB_REPO ?? 'TheMagiche/LOTM-GAME';
export const GAME_REPO_URL =
  process.env.NEXT_PUBLIC_GAME_REPO_URL ?? `https://github.com/${GAME_REPO}`;
export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL ?? 'https://lotmdnd.work.gd';
export const DISCORD_URL =
  process.env.NEXT_PUBLIC_DISCORD_URL ?? 'https://discord.gg/gf3Ntw6pUY';
export const RELEASES_URL = `${GAME_REPO_URL}/releases`;
export const RELEASE_REVALIDATE_SECONDS = 300;
