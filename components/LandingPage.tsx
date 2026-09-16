'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Flame,
  Dices,
  Package,
  Sparkles,
  Users,
  KeyRound,
  Terminal,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Shield,
  Heart,
  Globe,
  Award,
  Compass,
  Eye,
} from 'lucide-react';
import {
  LANDING_HERO,
  LANDING_PILLARS,
  LANDING_HOW_IT_PLAYS,
  LANDING_BYOK,
  LANDING_SELF_HOST,
  LANDING_SPONSOR,
  LANDING_SPECIAL_THANKS,
  LANDING_COLLAGE_CARDS,
  LANDING_FOOTER,
  LANDING_CREATOR_URL,
  LANDING_SPONSOR_URL,
  LANDING_DEMO_URL,
  LANDING_DISCORD_URL,
  LANDING_GAME_REPO_URL,
  type CollageCardItem,
} from '@/lib/copy';
import { SITE_PATHWAYS, type SitePathway } from '@/lib/pathways';
import type { DesktopRelease } from '@/lib/releases';
import { Downloads } from './Downloads';
import { LandingLoader } from './LandingLoader';

const PILLAR_ICONS: Record<string, ReactNode> = {
  'acting-method': <Flame className="w-5 h-5 text-amber-400" />,
  'spiritual-actions': <Dices className="w-5 h-5 text-amber-400" />,
  'mystical-harvest': <Package className="w-5 h-5 text-amber-400" />,
  memory: <Sparkles className="w-5 h-5 text-amber-400" />,
  'living-world': <Users className="w-5 h-5 text-amber-400" />,
};

const ASSET_TIMEOUT_MS = 12_000;

function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function preloadLandingAssets(
  urls: string[],
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const unique = [...new Set(urls.filter(Boolean))];
  const total = unique.length;
  if (total === 0) {
    onProgress?.(0, 0);
    return;
  }
  let loaded = 0;
  onProgress?.(0, total);
  const work = Promise.all(
    unique.map((src) =>
      preloadImage(src).then(() => {
        loaded += 1;
        onProgress?.(loaded, total);
      }),
    ),
  );
  await Promise.race([
    work,
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, ASSET_TIMEOUT_MS);
    }),
  ]);
}

export function LandingPage({ release }: { release: DesktopRelease }) {
  const heroImageUrls = useMemo(
    () => LANDING_COLLAGE_CARDS.map((card) => card.image),
    [],
  );
  const [assetsReady, setAssetsReady] = useState(heroImageUrls.length === 0);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(0);

  useEffect(() => {
    if (assetsReady) return;
    let cancelled = false;
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;

    preloadLandingAssets(heroImageUrls, (loaded) => {
      if (!cancelled) setAssetsLoaded(loaded);
    }).then(() => {
      if (cancelled) return;
      setLoaderLeaving(true);
      leaveTimer = setTimeout(() => {
        if (!cancelled) setAssetsReady(true);
      }, 420);
    });

    return () => {
      cancelled = true;
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [assetsReady, heroImageUrls]);

  const [activeCard, setActiveCard] = useState<CollageCardItem | null>(LANDING_COLLAGE_CARDS[0]);
  const [selectedPathway, setSelectedPathway] = useState<SitePathway | null>(null);
  const [collageTab, setCollageTab] = useState<'characters' | 'pathways'>('characters');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x: normX, y: normY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const showLoader = !assetsReady;

  return (
    <div className={`lotm-landing-wrapper${showLoader ? ' is-booting' : ''}`}>
      {showLoader && (
        <LandingLoader
          loaded={assetsLoaded}
          total={heroImageUrls.length}
          fadingOut={loaderLeaving}
        />
      )}

      <header
        ref={heroRef}
        className="lotm-landing-hero"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="lotm-landing-collage-backdrop"
          aria-hidden="true"
          style={{
            transform: `translate3d(${mousePos.x * -14}px, ${mousePos.y * -14}px, 0)`,
          }}
        >
          <div className="lotm-landing-collage-mesh">
            {LANDING_COLLAGE_CARDS.map((card, idx) => {
              const isFocused = activeCard?.id === card.id;
              return (
                <div
                  key={card.id}
                  className={`lotm-collage-floating-card card-pos-${idx} ${isFocused ? 'is-highlighted' : ''}`}
                  style={{
                    transform: `translate3d(${mousePos.x * (idx % 3 === 0 ? 8 : -8)}px, ${mousePos.y * (idx % 2 === 0 ? 8 : -8)}px, 0)`,
                  }}
                  onClick={() => {
                    setActiveCard(card);
                    setSelectedPathway(null);
                  }}
                >
                  <div className="lotm-collage-card-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image} alt="" className="lotm-collage-card-img" />
                    <div className="lotm-collage-card-overlay">
                      <span className="lotm-collage-card-arcana">{card.tarotNumber}</span>
                      <span className="lotm-collage-card-name">{card.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lotm-landing-hero-scrim" aria-hidden="true" />

        <div className="lotm-landing-hero-content">
          <p className="lotm-landing-kicker">{LANDING_HERO.kicker}</p>
          <h1 className="lotm-landing-title">{LANDING_HERO.brand}</h1>
          <p className="lotm-landing-sub">{LANDING_HERO.sub}</p>

          <div className="lotm-landing-actions">
            <a href="#downloads" className="lotm-title-hub-primary">
              {LANDING_HERO.cta}
            </a>
            <a
              href={LANDING_DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="lotm-title-hub-ghost"
            >
              {LANDING_HERO.demoCta}
            </a>
          </div>

          <div className="lotm-hero-showcase-bar">
            <div className="lotm-showcase-tabs">
              <button
                type="button"
                className={`lotm-showcase-tab ${collageTab === 'characters' ? 'is-active' : ''}`}
                onClick={() => setCollageTab('characters')}
              >
                <Eye className="w-3.5 h-3.5 mr-1.5 inline" />
                <span>Tarot Club &amp; Beyonders</span>
              </button>
              <button
                type="button"
                className={`lotm-showcase-tab ${collageTab === 'pathways' ? 'is-active' : ''}`}
                onClick={() => setCollageTab('pathways')}
              >
                <Compass className="w-3.5 h-3.5 mr-1.5 inline" />
                <span>22 Divine Pathways</span>
              </button>
            </div>

            {collageTab === 'characters' ? (
              <div className="lotm-showcase-cards-scroll">
                {LANDING_COLLAGE_CARDS.map((card) => {
                  const isSelected = activeCard?.id === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      className={`lotm-showcase-item ${isSelected ? 'is-active' : ''}`}
                      onClick={() => {
                        setActiveCard(card);
                        setSelectedPathway(null);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.image} alt={card.name} className="lotm-showcase-avatar" />
                      <div className="lotm-showcase-text">
                        <span className="lotm-showcase-name">{card.name}</span>
                        <span className="lotm-showcase-title">{card.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="lotm-showcase-cards-scroll">
                {SITE_PATHWAYS.map((p) => {
                  const isSelected = selectedPathway?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`lotm-showcase-item ${isSelected ? 'is-active' : ''}`}
                      onClick={() => {
                        setSelectedPathway(p);
                        setActiveCard(null);
                      }}
                    >
                      {p.emblemSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.emblemSrc} alt={p.name} className="lotm-showcase-emblem" />
                      ) : (
                        <div className="lotm-showcase-emblem-placeholder">
                          {p.tarotNumber || p.name[0]}
                        </div>
                      )}
                      <div className="lotm-showcase-text">
                        <span className="lotm-showcase-name">{p.name}</span>
                        <span className="lotm-showcase-title">
                          Card {p.tarotNumber || p.tarotCard}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeCard && !selectedPathway && (
              <div className="lotm-showcase-preview-plate">
                <span className="lotm-preview-kicker">
                  {activeCard.pathway}{' '}
                  {activeCard.tarotNumber ? `· Arcanum ${activeCard.tarotNumber}` : ''}
                </span>
                <p className="lotm-preview-quote">&ldquo;{activeCard.quote}&rdquo;</p>
              </div>
            )}
            {selectedPathway && (
              <div className="lotm-showcase-preview-plate">
                <span className="lotm-preview-kicker">
                  {selectedPathway.name} · {selectedPathway.tarotCard} ({selectedPathway.tarotNumber})
                </span>
                <p className="lotm-preview-quote">
                  Sequence 9: {selectedPathway.sequenceNine} → Sequence 0: {selectedPathway.sequenceZero}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="lotm-landing-main">
        <section className="lotm-landing-section" aria-labelledby="section-pillars-title">
          <div className="lotm-landing-section-header">
            <p className="lotm-landing-section-kicker">Occult Mechanics</p>
            <h2 id="section-pillars-title" className="lotm-landing-section-heading">
              The Rules of Beyonder Reality
            </h2>
          </div>

          <div className="lotm-landing-pillars-grid">
            {LANDING_PILLARS.map((pillar) => (
              <article key={pillar.id} className="lotm-landing-card lotm-landing-pillar-card">
                <div className="lotm-landing-card-icon">
                  {PILLAR_ICONS[pillar.id] ?? <BookOpen className="w-5 h-5 text-amber-400" />}
                </div>
                <h3 className="lotm-landing-card-title">{pillar.title}</h3>
                <p className="lotm-landing-card-body">{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lotm-landing-section" aria-labelledby="section-play-title">
          <div className="lotm-landing-section-header">
            <p className="lotm-landing-section-kicker">Turn Lifecycle</p>
            <h2 id="section-play-title" className="lotm-landing-section-heading">
              {LANDING_HOW_IT_PLAYS.heading}
            </h2>
            <p className="lotm-landing-section-lead">{LANDING_HOW_IT_PLAYS.lead}</p>
          </div>

          <div className="lotm-landing-steps-grid">
            {LANDING_HOW_IT_PLAYS.steps.map((step, idx) => (
              <div key={step.title} className="lotm-landing-card lotm-landing-step-card">
                <span className="lotm-landing-step-number" aria-hidden="true">
                  0{idx + 1}
                </span>
                <h3 className="lotm-landing-card-title">{step.title}</h3>
                <p className="lotm-landing-card-body">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lotm-landing-section" aria-labelledby="section-architecture-title">
          <div className="lotm-landing-section-header">
            <p className="lotm-landing-section-kicker">Privacy &amp; Sovereignty</p>
            <h2 id="section-architecture-title" className="lotm-landing-section-heading">
              Your Keys. Your Machine.
            </h2>
          </div>

          <div className="lotm-landing-dual-grid">
            <div className="lotm-landing-well-card">
              <div className="lotm-landing-card-header-row">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="lotm-landing-card-title">{LANDING_BYOK.heading}</h3>
              </div>
              <p className="lotm-landing-card-body">{LANDING_BYOK.body}</p>
            </div>

            <div className="lotm-landing-well-card">
              <div className="lotm-landing-card-header-row">
                <Terminal className="w-5 h-5 text-amber-400" />
                <h3 className="lotm-landing-card-title">{LANDING_SELF_HOST.heading}</h3>
              </div>
              <p className="lotm-landing-card-body">{LANDING_SELF_HOST.body}</p>
              <div className="lotm-landing-card-action">
                <a
                  href={LANDING_GAME_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="lotm-landing-link"
                >
                  <span>{LANDING_SELF_HOST.cta}</span>
                  <ArrowRight className="w-4 h-4 ml-1 inline-block" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="lotm-landing-section" aria-labelledby="section-sponsor-title">
          <div className="lotm-landing-well-card lotm-landing-sponsor-card">
            <div className="lotm-landing-sponsor-header">
              <div className="lotm-landing-card-header-row">
                <Heart className="w-5 h-5 text-rose-400" />
                <h2 id="section-sponsor-title" className="lotm-landing-card-title">
                  {LANDING_SPONSOR.heading}
                </h2>
              </div>
              <span className="lotm-landing-badge">Ko-fi</span>
            </div>
            <p className="lotm-landing-card-body">{LANDING_SPONSOR.lead}</p>
            <p className="lotm-landing-sponsor-note">{LANDING_SPONSOR.note}</p>

            <div className="lotm-landing-sponsor-action">
              <a
                href={LANDING_SPONSOR_URL}
                target="_blank"
                rel="noreferrer"
                className="lotm-title-hub-primary lotm-sponsor-btn"
              >
                <Heart className="w-4 h-4 mr-2 inline" fill="currentColor" />
                {LANDING_SPONSOR.cta}
              </a>
            </div>
          </div>
        </section>

        <section className="lotm-landing-section" aria-labelledby="section-thanks-title">
          <div className="lotm-landing-section-header">
            <p className="lotm-landing-section-kicker">{LANDING_SPECIAL_THANKS.kicker}</p>
            <h2 id="section-thanks-title" className="lotm-landing-section-heading">
              {LANDING_SPECIAL_THANKS.heading}
            </h2>
            <p className="lotm-landing-section-lead">{LANDING_SPECIAL_THANKS.lead}</p>
          </div>

          <div className="lotm-landing-thanks-grid">
            {LANDING_SPECIAL_THANKS.credits.map((credit) => (
              <div key={credit.id} className="lotm-landing-card lotm-landing-thanks-card">
                <div className="lotm-thanks-header">
                  <Award className="w-5 h-5 text-amber-400" />
                  {credit.badge && <span className="lotm-landing-badge">{credit.badge}</span>}
                </div>
                <h3 className="lotm-landing-card-title">{credit.name}</h3>
                <span className="lotm-thanks-role">{credit.role}</span>
                <p className="lotm-landing-card-body">{credit.description}</p>
                {credit.url && (
                  <div className="lotm-landing-card-action">
                    <a
                      href={credit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="lotm-landing-link"
                    >
                      <span>Visit Resource</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <Downloads release={release} />

        <section className="lotm-landing-cta-banner">
          <div className="lotm-landing-card lotm-landing-cta-card">
            <h2 className="lotm-landing-cta-heading">Ready to Drink the Potion?</h2>
            <p className="lotm-landing-cta-sub">
              Explore the Fifth Epoch, commune with the fog, and protect your sanity.
            </p>
            <div className="lotm-landing-cta-actions">
              <a href="#downloads" className="lotm-title-hub-primary">
                {LANDING_HERO.cta}
              </a>
              <a
                href={LANDING_DEMO_URL}
                target="_blank"
                rel="noreferrer"
                className="lotm-title-hub-ghost"
              >
                {LANDING_HERO.demoCta}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="lotm-landing-footer">
        <div className="lotm-landing-footer-top">
          <div className="lotm-landing-footer-brand">
            <Shield className="w-4 h-4 text-amber-500 inline mr-2" />
            <span>{LANDING_HERO.brand}</span>
          </div>
          <div className="lotm-landing-footer-links">
            <a
              href={LANDING_CREATOR_URL}
              target="_blank"
              rel="noreferrer"
              className="lotm-landing-footer-link"
            >
              <Globe className="w-3.5 h-3.5 mr-1 inline" />
              <span>{LANDING_FOOTER.creatorLabel}</span>
            </a>
            <a
              href={LANDING_SPONSOR_URL}
              target="_blank"
              rel="noreferrer"
              className="lotm-landing-footer-link"
            >
              <Heart className="w-3.5 h-3.5 mr-1 inline text-rose-400" />
              <span>{LANDING_FOOTER.sponsorLabel}</span>
            </a>
            <a
              href={LANDING_DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="lotm-landing-footer-link"
            >
              Discord
            </a>
            <a
              href={LANDING_DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="lotm-landing-footer-link"
            >
              Web demo
            </a>
            <a href="#downloads" className="lotm-landing-footer-link">
              Downloads
            </a>
          </div>
        </div>

        <div className="lotm-landing-footer-bottom">
          <p className="lotm-landing-license">{LANDING_FOOTER.license}</p>
          <p className="lotm-landing-disclaimer">{LANDING_FOOTER.disclaimer}</p>
        </div>
      </footer>
    </div>
  );
}
