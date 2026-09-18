import { RELEASES_URL } from './site';

export type PlatformId = 'windows' | 'macos' | 'linux';
export type CpuArch = 'arm64' | 'x64';

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
  variants?: Partial<Record<CpuArch, ReleaseAsset>>;
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

export function archFromAssetName(name: string): CpuArch | undefined {
  const lower = name.toLowerCase();
  if (/\b(arm64|aarch64)\b/.test(lower)) return 'arm64';
  if (/\b(x64|x86_64|amd64|intel)\b/.test(lower)) return 'x64';
  return undefined;
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

    if (id === 'macos') {
      const variants: Partial<Record<CpuArch, ReleaseAsset>> = {};
      for (const entry of sorted.filter((item) => item.rank === 0)) {
        const arch = archFromAssetName(entry.asset.name);
        if (arch && !variants[arch]) variants[arch] = entry.asset;
      }
      if (variants.arm64 || variants.x64) platforms[id].variants = variants;
    }
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

export function macAssetForArch(
  platform: PlatformBuild,
  arch: CpuArch | 'unknown',
): ReleaseAsset | undefined {
  if (arch !== 'unknown' && platform.variants?.[arch]) return platform.variants[arch];
  if (arch === 'x64' && platform.variants && !platform.variants.x64) return undefined;
  if (arch === 'arm64' && platform.variants && !platform.variants.arm64) return undefined;
  return platform.primary;
}

export function macDownloadLabel(arch: CpuArch | 'unknown'): string {
  if (arch === 'x64') return 'macOS (Intel)';
  if (arch === 'arm64') return 'macOS (Apple Silicon)';
  return 'macOS';
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
