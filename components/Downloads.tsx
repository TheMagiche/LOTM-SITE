'use client';

import { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';
import { LANDING_DOWNLOADS, LANDING_RELEASES_URL } from '@/lib/copy';
import { detectMacArch, detectOs } from '@/lib/os';
import {
  formatBytes,
  formatDigest,
  macAssetForArch,
  macDownloadLabel,
  type CpuArch,
  type DesktopRelease,
  type PlatformId,
  type ReleaseAsset,
} from '@/lib/releases';

type DisplayPlatform = {
  id: string;
  label: string;
  asset?: ReleaseAsset;
  secondary?: ReleaseAsset;
};

function formatPublished(iso?: string): string {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return '';
  }
}

function fileKind(name: string): string {
  const ext = name.split('.').pop();
  if (!ext || ext === name || ext.length > 8) return 'installer';
  return ext.toUpperCase();
}

function displayPlatforms(release: DesktopRelease): DisplayPlatform[] {
  const windows = release.platforms.windows;
  const linux = release.platforms.linux;
  const macos = release.platforms.macos;
  const macCards: DisplayPlatform[] = macos.variants
    ? [
        { id: 'macos-arm64', label: 'macOS (Apple Silicon)', asset: macos.variants.arm64 },
        { id: 'macos-x64', label: 'macOS (Intel)', asset: macos.variants.x64 },
      ]
    : [{ id: 'macos', label: macos.label, asset: macos.primary, secondary: macos.secondary }];

  return [
    { id: 'windows', label: windows.label, asset: windows.primary, secondary: windows.secondary },
    ...macCards,
    { id: 'linux', label: linux.label, asset: linux.primary, secondary: linux.secondary },
  ];
}

export function Downloads({ release }: { release: DesktopRelease }) {
  const [os, setOs] = useState<PlatformId | 'unknown'>('unknown');
  const [macArch, setMacArch] = useState<CpuArch | 'unknown' | 'pending'>('pending');

  useEffect(() => {
    const detected = detectOs();
    setOs(detected);
    if (detected === 'macos') {
      void detectMacArch().then(setMacArch);
    } else {
      setMacArch('unknown');
    }
  }, []);

  const macosBuild = release.platforms.macos;
  const nativeBuild = os !== 'unknown' && os !== 'macos' ? release.platforms[os] : undefined;
  const nativeAsset =
    os === 'macos'
      ? macArch === 'pending'
        ? undefined
        : macAssetForArch(macosBuild, macArch)
      : nativeBuild?.primary;
  const nativeLabel = os === 'macos' ? macDownloadLabel(macArch === 'pending' ? 'unknown' : macArch) : nativeBuild?.label;
  const showPrimary = Boolean(nativeAsset);
  const releasePage = release.htmlUrl || LANDING_RELEASES_URL;
  const platforms = displayPlatforms(release);

  const published = formatPublished(release.publishedAt);
  const missingPlatforms = (['windows', 'macos', 'linux'] as PlatformId[]).filter(
    (id) => !release.platforms[id].primary,
  );
  const lead = !release.hasArtifacts
    ? LANDING_DOWNLOADS.leadSoon
    : missingPlatforms.length > 0
      ? LANDING_DOWNLOADS.leadMacFirst
      : LANDING_DOWNLOADS.leadReady;

  return (
    <section className="lotm-landing-section" id="downloads" aria-labelledby="section-downloads-title">
      <div className="lotm-landing-well-card lotm-landing-downloads-plate">
        <div className="lotm-landing-downloads-header">
          <div className="lotm-landing-card-header-row">
            <Monitor className="w-5 h-5 text-amber-400" />
            <h3 id="section-downloads-title" className="lotm-landing-card-title">
              {LANDING_DOWNLOADS.heading}
            </h3>
          </div>
          <span className="lotm-landing-badge">
            {release.hasArtifacts ? release.tag || release.name : LANDING_DOWNLOADS.badge}
          </span>
        </div>
        <p className="lotm-landing-card-body">
          {lead}
          {release.hasArtifacts && published ? ` Latest release published ${published}.` : ''}
        </p>

        {showPrimary && nativeAsset && (
          <div className="lotm-landing-download-primary">
            <a
              className="lotm-title-hub-primary"
              href={nativeAsset.url || releasePage}
              target="_blank"
              rel="noreferrer"
            >
              Download for {nativeLabel}
            </a>
          </div>
        )}

        {release.hasArtifacts ? (
          <div className="lotm-landing-platform-cards">
            {platforms.map((platform) => {
              const asset = platform.asset;
              return (
                <div
                  key={platform.id}
                  className={`lotm-landing-platform-card${asset ? ' is-ready' : ''}`}
                >
                  <p className="lotm-landing-platform-label">{platform.label}</p>
                  {asset ? (
                    <>
                      <p className="lotm-landing-download-meta">
                        {asset.name}
                        {asset.size ? ` · ${formatBytes(asset.size)}` : ''}
                        {asset.digest ? ` · ${formatDigest(asset.digest)}` : ''}
                      </p>
                      <a
                        className="lotm-landing-platform-link"
                        href={asset.url || releasePage}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download {fileKind(asset.name)}
                      </a>
                      {platform.secondary && (
                        <a
                          className="lotm-landing-platform-link"
                          href={platform.secondary.url || releasePage}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Also {fileKind(platform.secondary.name)}
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="lotm-landing-download-meta">Not in this release yet.</p>
                      <span className="lotm-landing-platform-link is-muted">Coming soon</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="lotm-landing-platforms-row">
            {LANDING_DOWNLOADS.platforms.map((p) => (
              <div key={p.id} className="lotm-landing-platform-pill">
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        )}

        <ul className="lotm-landing-notes">
          {LANDING_DOWNLOADS.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <div className="lotm-landing-card-action lotm-landing-releases-link">
          <a
            href={releasePage}
            target="_blank"
            rel="noreferrer"
            className="lotm-landing-link"
          >
            GitHub Release
          </a>
        </div>
      </div>
    </section>
  );
}
