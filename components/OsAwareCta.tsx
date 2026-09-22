'use client';

import { useEffect, useState } from 'react';
import { LANDING_HERO } from '@/lib/copy';
import { detectMacArch, detectOs } from '@/lib/os';
import {
  macAssetForArch,
  macDownloadLabel,
  type CpuArch,
  type DesktopRelease,
  type PlatformId,
} from '@/lib/releases';

export function OsAwareCta({
  release,
  variant = 'hero',
}: {
  release: DesktopRelease;
  variant?: 'hero' | 'banner';
}) {
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

  const native = os !== 'unknown' && os !== 'macos' ? release.platforms[os] : undefined;
  const asset =
    os === 'macos'
      ? macArch === 'pending'
        ? undefined
        : macAssetForArch(release.platforms.macos, macArch)
      : native?.primary;
  const label = os === 'macos' ? macDownloadLabel(macArch === 'pending' ? 'unknown' : macArch) : native?.label;

  return (
    <div className={variant === 'banner' ? 'lotm-landing-cta-actions' : 'lotm-landing-actions'}>
      {asset ? (
        <a
          className="lotm-title-hub-primary"
          href={asset.url || release.htmlUrl}
          target="_blank"
          rel="noreferrer"
        >
          Download for {label}
        </a>
      ) : (
        <a href="#downloads" className="lotm-title-hub-primary">
          {release.hasArtifacts ? 'See desktop downloads' : LANDING_HERO.cta}
        </a>
      )}
    </div>
  );
}
