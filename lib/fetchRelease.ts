import { RELEASES_REPO, RELEASES_REPO_URL } from './site';
import { mapGithubRelease, type DesktopRelease, type PlatformId } from './releases';

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
  draft?: boolean;
  assets?: GithubAsset[];
}

const PLATFORM_LABELS: Record<PlatformId, { label: string; name: string }> = {
  windows: { label: 'Windows', name: 'Windows installer' },
  macos: { label: 'macOS', name: 'macOS installer' },
  linux: { label: 'Linux', name: 'Linux installer' },
};

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'lotm-site',
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** Shown when GitHub's API is rate-limited (common on Vercel without GITHUB_TOKEN). */
export function fallbackDesktopRelease(): DesktopRelease {
  const htmlUrl = `${RELEASES_REPO_URL}/releases/latest`;
  return {
    tag: 'latest',
    name: 'GitHub Release',
    htmlUrl,
    hasArtifacts: true,
    platforms: {
      windows: {
        id: 'windows',
        label: PLATFORM_LABELS.windows.label,
        primary: { name: PLATFORM_LABELS.windows.name, url: htmlUrl, size: 0 },
      },
      macos: {
        id: 'macos',
        label: PLATFORM_LABELS.macos.label,
        primary: { name: PLATFORM_LABELS.macos.name, url: htmlUrl, size: 0 },
      },
      linux: {
        id: 'linux',
        label: PLATFORM_LABELS.linux.label,
        primary: { name: PLATFORM_LABELS.linux.name, url: htmlUrl, size: 0 },
      },
    },
  };
}

async function githubJson(path: string): Promise<unknown | null> {
  const res = await fetch(`https://api.github.com/repos/${RELEASES_REPO}${path}`, {
    headers: githubHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error(`[lotm-site] GitHub ${path} failed: ${res.status} ${res.statusText}`);
    return null;
  }
  return res.json();
}

export async function fetchLatestDesktopRelease(): Promise<DesktopRelease> {
  try {
    const latest = (await githubJson('/releases/latest')) as GithubRelease | null;
    if (latest) {
      const mapped = mapGithubRelease(latest);
      return mapped.hasArtifacts ? mapped : fallbackDesktopRelease();
    }

    const list = (await githubJson('/releases?per_page=5')) as GithubRelease[] | null;
    const published = list?.find((release) => !release.draft);
    if (published) {
      const mapped = mapGithubRelease(published);
      if (mapped.hasArtifacts) return mapped;
    }
  } catch (error) {
    console.error('[lotm-site] GitHub release fetch failed', error);
  }

  return fallbackDesktopRelease();
}
