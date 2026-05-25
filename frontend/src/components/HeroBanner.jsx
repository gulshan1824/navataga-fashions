import React from 'react';

const HeroBanner = () => (
  <div style={styles.hero}>
    <div style={styles.glow} />
    <div className="container" style={styles.inner}>

      {/* Left — story text */}
      <div style={styles.left}>
        <div style={styles.eyebrow}>
          <span style={styles.rune}>✦</span>
          <span style={styles.eyebrowText}>Woven in Varanasi · Est. 7th Century CE</span>
          <span style={styles.rune}>✦</span>
        </div>
        <h1 style={styles.headline}>
          The Soul of&nbsp;<em style={styles.em}>Banaras</em>
        </h1>
        <p style={styles.para}>
          Six centuries of silk, zari, and the loom — each saree a living heirloom
          from the hands of Varanasi's master weavers.
        </p>
      </div>

      {/* Right — craft stats */}
      <div style={styles.right}>
        <div style={styles.statGrid}>
          {[
            { num: '600+', label: 'Years of Tradition' },
            { num: '72 hrs', label: 'Per Masterpiece' },
            { num: '5,000+', label: 'Silk Threads' },
            { num: '100%', label: 'Handcrafted' },
          ].map(s => (
            <div key={s.label} style={styles.stat}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

const styles = {
  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(201,168,76,0.18)',
  },
  glow: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 55% 80% at 35% 50%, rgba(201,168,76,0.07) 0%, transparent 65%)',
  },
  inner: {
    position: 'relative', zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3rem',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
  left: { flex: '1 1 0', minWidth: 0 },
  eyebrow: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  rune: { color: 'rgba(201,168,76,0.5)', fontSize: '0.65rem' },
  eyebrowText: {
    fontSize: '0.58rem', color: 'rgba(232,213,163,0.55)',
    letterSpacing: '2.5px', textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  },
  headline: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
    fontWeight: '700', lineHeight: '1.15',
    color: 'var(--gold-light)',
    marginBottom: '0.7rem',
    textShadow: '0 3px 20px rgba(0,0,0,0.4)',
  },
  em: { color: 'var(--gold)', fontStyle: 'italic' },
  para: {
    fontSize: '0.85rem', lineHeight: '1.7',
    color: 'rgba(253,248,239,0.55)',
    fontFamily: 'var(--font-body)',
    maxWidth: '440px',
  },
  right: {
    flexShrink: 0,
    borderLeft: '1px solid rgba(201,168,76,0.2)',
    paddingLeft: '3rem',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.2rem 2.5rem',
  },
  stat: { textAlign: 'center' },
  statNum: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.45rem', fontWeight: '700',
    color: 'var(--gold)',
  },
  statLabel: {
    fontSize: '0.54rem', textTransform: 'uppercase',
    letterSpacing: '1.2px', color: 'rgba(232,213,163,0.5)',
    marginTop: '2px',
  },
};

export default HeroBanner;
