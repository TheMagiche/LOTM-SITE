import { GAME_REPO, RELEASE_REVALIDATE_SECONDS, RELEASES_URL } from './site';

export type PlatformId = 'windows' | 'macos' | 'linux';

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
  digest?: string;
}

export interface PlatformBuild {
  id: PlatformId;
  label: string;
  primary?: ReleaseAsset;
  secondary?: ReleaseAsset;
}

export interface DesktopRelease {
  tag?: string;
  name?: string;
  publishedAt?: string;
  htmlUrl: string;
  platforms: Record<PlatformId, PlatformBuild>;
  hasArtifacts: boolean;
}

interface GithubAsset {
  name?: string;
  browser_download_url?: string;
  size?: number;
  digest?: string;
}

interface GithubRelease {
  tag_name?: string;
  name?: string;
  html_url?: string;
  published_at?: string;
  assets?: GithubAsset[];
}

const PLATFORM_LABELS: Record<PlatformId, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
};

const IGNORE_NAME = /\.(blockmap|yml|yaml)$/i;

function emptyPlatforms(): Record<PlatformId, PlatformBuild> {
  return {
    windows: { id: 'windows', label: PLATFORM_LABELS.windows },
    macos: { id: 'macos', label: PLATFORM_LABELS.macos },
    linux: { id: 'linux', label: PLATFORM_LABELS.linux },
  };
}

function toAsset(raw: GithubAsset): ReleaseAsset | undefined {
  if (!raw.name || !raw.browser_download_url) return undefined;
  if (IGNORE_NAME.test(raw.name)) return undefined;
  return {
    name: raw.name,
    url: raw.browser_download_url,
    size: typeof raw.size === 'number' ? raw.size : 0,
    digest: raw.digest || undefined,
  };
}

function classify(name: string): { platform: PlatformId; rank: number } | undefined {
  const lower = name.toLowerCase();
  if (lower.endsWith('.exe') || lower.endsWith('.msi')) return { platform: 'windows', rank: 0 };
  if (lower.endsWith('.dmg')) return { platform: 'macos', rank: 0 };
  if (lower.endsWith('.appimage')) return { platform: 'linux', rank: 0 };
  if (lower.endsWith('.deb')) return { platform: 'linux', rank: 1 };
  if (lower.endsWith('.rpm')) return { platform: 'linux', rank: 2 };
  if (lower.endsWith('.zip') && /mac|darwin|osx/i.test(lower)) return { platform: 'macos', rank: 1 };
  return undefined;
}

export function mapGithubRelease(release: GithubRelease | null): DesktopRelease {
  const platforms = emptyPlatforms();
  const ranked: Record<PlatformId, { rank: number; asset: ReleaseAsset }[]> = {
    windows: [],
    macos: [],
    linux: [],
  };

  for (const raw of release?.assets ?? []) {
    const asset = toAsset(raw);
    if (!asset) continue;
    const hit = classify(asset.name);
    if (!hit) continue;
    ranked[hit.platform].push({ rank: hit.rank, asset });
  }

  for (const id of Object.keys(ranked) as PlatformId[]) {
    const sorted = ranked[id].sort((a, b) => a.rank - b.rank);
    platforms[id].primary = sorted[0]?.asset;
    platforms[id].secondary = sorted[1]?.asset;
  }

  const hasArtifacts = Object.values(platforms).some((p) => Boolean(p.primary));

  return {
    tag: release?.tag_name,
    name: release?.name || release?.tag_name,
    publishedAt: release?.published_at,
    htmlUrl: release?.html_url || RELEASES_URL,
    platforms,
    hasArtifacts,
  };
}

export function formatBytes(size: number): string {
  if (!size || size < 0) return '';
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

export function formatDigest(digest?: string): string {
  if (!digest) return '';
  const value = digest.replace(/^sha256:/i, '');
  if (value.length <= 16) return digest;
  return `sha256:${value.slice(0, 12)}…`;
}

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'lotm-site',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchLatestDesktopRelease(): Promise<DesktopRelease> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GAME_REPO}/releases/latest`, {
      headers: githubHeaders(),
      cache: 'force-cache',
      next: { revalidate: RELEASE_REVALIDATE_SECONDS },
    });
    if (res.status === 404) return mapGithubRelease(null);
    if (!res.ok) return mapGithubRelease(null);
    const json = (await res.json()) as GithubRelease;
    return mapGithubRelease(json);
  } catch {
    return mapGithubRelease(null);
  }
}
