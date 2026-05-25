import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <>
      <div style={styles.topBar}>
        Authentic Indian Ethnic Wear &nbsp;·&nbsp; Navataga Fashions &nbsp;·&nbsp; Sarees · Suits · Exclusive Collections
      </div>
      <nav style={styles.nav}>
        <div className="container" style={styles.inner}>
          <div style={styles.brand}>
            <Link to="/" className="nav-logo" style={styles.logo}>NAVATAGA FASHIONS</Link>
            <span className="nav-tagline" style={styles.tagline}>Premium Indian Ethnic Wear · Sarees & Suits</span>
          </div>
          <div className="nav-links" style={styles.links}>
            <Link to="/" style={{ ...styles.link, ...(pathname === '/' ? styles.active : {}) }}>
              Collection
            </Link>
            <Link to="/admin" style={{ ...styles.link, ...(pathname === '/admin' ? styles.active : {}) }}>
              Admin
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

const styles = {
  topBar: {
    backgroundColor: 'var(--maroon-dark)',
    color: 'var(--gold-light)',
    fontSize: '0.72rem',
    textAlign: 'center',
    padding: '7px 0',
    letterSpacing: '0.8px',
    fontFamily: 'var(--font-body)',
  },
  nav: {
    backgroundColor: 'var(--maroon)',
    color: 'white',
    padding: '1.1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '2px solid var(--gold)',
    boxShadow: '0 3px 16px rgba(0,0,0,0.25)',
  },
  inner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { display: 'flex', flexDirection: 'column', gap: '2px' },
  logo: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.55rem',
    fontWeight: '700',
    letterSpacing: '3px',
    color: 'var(--gold)',
  },
  tagline: {
    fontSize: '0.65rem',
    color: 'rgba(232,213,163,0.7)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body)',
  },
  links: { display: 'flex', gap: '2.5rem', alignItems: 'center' },
  link: {
    fontWeight: '500',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: 'rgba(253,248,239,0.75)',
    transition: 'color 0.2s',
    fontFamily: 'var(--font-body)',
  },
  active: { color: 'var(--gold)' },
};

export default Navbar;
