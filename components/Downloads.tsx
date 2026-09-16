'use client';

import { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';
import {
  LANDING_DOWNLOADS,
  LANDING_GAME_REPO_URL,
} from '@/lib/copy';
import {
  formatBytes,
  formatDigest,
  type DesktopRelease,
  type PlatformId,
} from '@/lib/releases';

const PLATFORM_ORDER: PlatformId[] = ['windows', 'macos', 'linux'];

function detectOs(): PlatformId | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macos';
  if (/Linux|X11/i.test(ua)) return 'linux';
  return 'unknown';
}

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
  return ext ? ext.toUpperCase() : 'installer';
}

export function Downloads({ release }: { release: DesktopRelease }) {
  const [os, setOs] = useState<PlatformId | 'unknown'>('unknown');

  useEffect(() => {
    setOs(detectOs());
  }, []);

  const preferred =
    (os !== 'unknown' && release.platforms[os].primary
      ? release.platforms[os]
      : PLATFORM_ORDER.map((id) => release.platforms[id]).find((p) => p.primary)) || undefined;

  const published = formatPublished(release.publishedAt);

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
          {release.hasArtifacts ? LANDING_DOWNLOADS.leadReady : LANDING_DOWNLOADS.leadSoon}
          {release.hasArtifacts && published ? ` Latest release published ${published}.` : ''}
        </p>

        {release.hasArtifacts && preferred?.primary && (
          <div className="lotm-landing-download-primary">
            <a
              className="lotm-title-hub-primary"
              href={preferred.primary.url}
              download
            >
              Download for {preferred.label}
            </a>
          </div>
        )}

        {release.hasArtifacts ? (
          <div className="lotm-landing-platform-cards">
            {PLATFORM_ORDER.map((id) => {
              const platform = release.platforms[id];
              const asset = platform.primary;
              return (
                <div
                  key={id}
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
                      <a className="lotm-landing-platform-link" href={asset.url} download>
                        Download {fileKind(asset.name)}
                      </a>
                      {platform.secondary && (
                        <a className="lotm-landing-platform-link" href={platform.secondary.url} download>
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
            href={release.htmlUrl || `${LANDING_GAME_REPO_URL}/releases`}
            target="_blank"
            rel="noreferrer"
            className="lotm-landing-link"
          >
            All GitHub Releases
          </a>
        </div>
      </div>
    </section>
  );
}
