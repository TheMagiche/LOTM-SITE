'use client';

import { useEffect, useState } from 'react';
import { LANDING_DEMO_URL, LANDING_HERO } from '@/lib/copy';
import { detectOs } from '@/lib/os';
import type { DesktopRelease, PlatformId } from '@/lib/releases';

export function OsAwareCta({
  release,
  variant = 'hero',
}: {
  release: DesktopRelease;
  variant?: 'hero' | 'banner';
}) {
  const [os, setOs] = useState<PlatformId | 'unknown'>('unknown');

  useEffect(() => {
    setOs(detectOs());
  }, []);

  const native = os !== 'unknown' ? release.platforms[os] : undefined;
  const asset = native?.primary;

  return (
    <div className={variant === 'banner' ? 'lotm-landing-cta-actions' : 'lotm-landing-actions'}>
      {asset ? (
        <a className="lotm-title-hub-primary" href={asset.url} download>
          Download for {native.label}
        </a>
      ) : (
        <a href="#downloads" className="lotm-title-hub-primary">
          {release.hasArtifacts ? 'See desktop downloads' : LANDING_HERO.cta}
        </a>
      )}
      <a
        href={LANDING_DEMO_URL}
        target="_blank"
        rel="noreferrer"
        className="lotm-title-hub-ghost"
      >
        {LANDING_HERO.demoCta}
      </a>
    </div>
  );
}
