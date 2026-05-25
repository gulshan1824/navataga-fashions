import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.weave} />
    <div className="container" style={styles.inner}>

      <div className="footer-top">
        <div style={styles.brand}>
          <div style={styles.logo}>NAVATAGA FASHIONS</div>
          <div style={styles.tagline}>Premium Indian Ethnic Wear · Varanasi</div>
          <div style={styles.goldLine} />
          <p style={styles.about}>
            Navataga Fashions brings you an authentic curation of Banarasi silk sarees
            and fine cotton suits — each piece sourced directly from the master weavers
            of Varanasi, the eternal city of thread and light.
          </p>
        </div>

        <div className="footer-quote" style={styles.quote}>
          <span style={styles.quoteOpen}>"</span>
          <p style={styles.quoteText}>
            In every Banarasi saree lives a story — of silk kissed by gold, of looms
            that have sung since the Mughal age, of a craft that time cannot silence.
          </p>
          <span style={styles.quoteClose}>"</span>
          <div style={styles.quoteAttr}>— The Weavers of Banaras</div>
        </div>

        <div style={styles.links}>
          <div style={styles.linksTitle}>Navigate</div>
          <Link to="/" style={styles.link}>Collection</Link>
        </div>
      </div>

      <div style={styles.bottom}>
        <div style={styles.divider} />
        <div style={styles.copy}>
          © 2025 Navataga Fashions · Curated from the looms of Banaras &nbsp;·&nbsp;
          <span style={{ color: 'rgba(201,168,76,0.45)' }}>✦</span>
          &nbsp; All pieces are handwoven & authentic
        </div>
      </div>
    </div>
  </footer>
);

const styles = {
  footer: {
    position: 'relative',
    background: 'linear-gradient(180deg, #100208 0%, #1A0512 100%)',
    marginTop: '5rem',
    overflow: 'hidden',
  },
  weave: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      repeating-linear-gradient(0deg,  rgba(201,168,76,0.04) 0, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 24px),
      repeating-linear-gradient(90deg, rgba(201,168,76,0.04) 0, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 24px)
    `,
    backgroundSize: '24px 24px',
  },
  inner: { position: 'relative', zIndex: 1, paddingTop: '4rem', paddingBottom: '2rem' },
  brand: {},
  logo: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.3rem', fontWeight: '700',
    letterSpacing: '2px', color: 'var(--gold)',
    marginBottom: '0.35rem',
  },
  tagline: {
    fontSize: '0.62rem', textTransform: 'uppercase',
    letterSpacing: '2px', color: 'rgba(232,213,163,0.45)',
    marginBottom: '1.5rem',
  },
  goldLine: {
    width: '40px', height: '2px',
    background: 'linear-gradient(90deg, var(--gold), transparent)',
    marginBottom: '1.2rem',
  },
  about: {
    fontSize: '0.82rem', lineHeight: '1.9',
    color: 'rgba(253,248,239,0.45)',
  },
  quote: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    borderLeft: '1px solid rgba(201,168,76,0.15)',
    borderRight: '1px solid rgba(201,168,76,0.15)',
    padding: '0 3rem', textAlign: 'center',
  },
  quoteOpen: {
    fontFamily: 'var(--font-heading)',
    fontSize: '4rem', lineHeight: '1',
    color: 'rgba(201,168,76,0.25)', marginBottom: '-1rem',
  },
  quoteText: {
    fontSize: '0.9rem', lineHeight: '1.9', fontStyle: 'italic',
    color: 'rgba(253,248,239,0.55)',
    fontFamily: 'var(--font-heading)',
  },
  quoteClose: {
    fontFamily: 'var(--font-heading)',
    fontSize: '4rem', lineHeight: '1',
    color: 'rgba(201,168,76,0.25)', marginTop: '-1rem', alignSelf: 'flex-end',
  },
  quoteAttr: {
    fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase',
    color: 'rgba(201,168,76,0.4)', marginTop: '1rem',
  },
  links: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  linksTitle: {
    fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px',
    color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem',
    fontWeight: '700',
  },
  link: {
    fontSize: '0.85rem', color: 'rgba(253,248,239,0.5)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  bottom: {},
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)',
    marginBottom: '1.5rem',
  },
  copy: {
    textAlign: 'center', fontSize: '0.72rem',
    color: 'rgba(253,248,239,0.28)',
    letterSpacing: '0.5px',
  },
};

export default Footer;
