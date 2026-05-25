import React from 'react';

const pillars = [
  {
    icon: '🧵',
    title: 'Pure Silk & Zari',
    body: 'Real Banarasi sarees are born of pure mulberry silk and genuine gold or silver zari — a tradition of shimmer untouched by shortcuts.',
  },
  {
    icon: '🏛️',
    title: 'A Royal Legacy',
    body: 'Gifted to Mughal empresses and Rajput queens for centuries, the Banarasi saree has graced royalty and now finds its way to you.',
  },
  {
    icon: '🤲',
    title: 'Master Handloom Craft',
    body: 'Every buta, kalga, and jangla motif is woven stitch by stitch on pit looms by families who have kept this art alive for generations.',
  },
];

const HeritagePillars = () => (
  <div style={styles.strip}>
    <div className="container heritage-pillars">
      {pillars.map((p, i) => (
        <div
          key={p.title}
          className="heritage-pillar"
          style={{
            ...styles.pillar,
            borderRight: i < pillars.length - 1
              ? '1px solid rgba(201,168,76,0.18)'
              : 'none',
          }}
        >
          <span style={styles.icon}>{p.icon}</span>
          <h3 style={styles.title}>{p.title}</h3>
          <p style={styles.body}>{p.body}</p>
        </div>
      ))}
    </div>
  </div>
);

const styles = {
  strip: {
    background: '#1A0512',
    borderTop: '2px solid rgba(201,168,76,0.22)',
    borderBottom: '2px solid rgba(201,168,76,0.22)',
    marginTop: '4rem',
  },
  pillar: {
    padding: '2.8rem 2.2rem',
    textAlign: 'center',
  },
  icon: { fontSize: '2rem', display: 'block', marginBottom: '1.1rem' },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.05rem', fontWeight: '600',
    color: 'var(--gold-light)', marginBottom: '0.85rem',
    letterSpacing: '0.5px',
  },
  body: {
    fontSize: '0.82rem', lineHeight: '1.85',
    color: 'rgba(232,213,163,0.5)',
    fontFamily: 'var(--font-body)',
  },
};

export default HeritagePillars;
