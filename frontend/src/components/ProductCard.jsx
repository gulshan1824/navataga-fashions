import React from 'react';
import { Link } from 'react-router-dom';
import { proxyImage } from '../api';

const ProductCard = ({ product }) => (
  <div className="product-card" style={styles.card}>

    {/* Image — sourced directly from the Photo column in the sheet */}
    <div style={styles.imgWrap}>
      {product.image_url ? (
        <>
          <img
            src={proxyImage(product.image_url)}
            alt={product.name}
            style={styles.img}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div style={{ ...styles.noPhoto, display: 'none' }}>
            <span style={styles.noPhotoIcon}>🔒</span>
            <span style={styles.noPhotoText}>Make photo public in Drive</span>
          </div>
        </>
      ) : (
        <div style={styles.noPhoto}>
          <span style={styles.noPhotoIcon}>🪡</span>
          <span style={styles.noPhotoText}>Photo not added yet</span>
        </div>
      )}
      <div style={{
        ...styles.availBadge,
        background: product.available ? 'rgba(109,26,54,0.85)' : 'rgba(50,50,50,0.85)',
      }}>
        {product.available ? 'Available' : 'Sold Out'}
      </div>
    </div>

    {/* Content — exactly the sheet columns */}
    <div style={styles.body}>

      {product.category && (
        <span className="badge" style={styles.catBadge}>{product.category}</span>
      )}

      <h3 style={styles.name}>{product.name}</h3>

      {product.colour && (
        <div style={styles.row}>
          <span style={styles.label}>Colour</span>
          <span style={styles.value}>{product.colour}</span>
        </div>
      )}

      {product.design_pattern && (
        <div style={styles.row}>
          <span style={styles.label}>Design</span>
          <span style={styles.value}>{product.design_pattern}</span>
        </div>
      )}

      <div style={styles.divider} />

      <div style={styles.footer}>
        <div>
          <div style={styles.priceLabel}>Price</div>
          <div style={styles.price}>₹{Number(product.price).toLocaleString('en-IN')}</div>
        </div>
        <Link to={`/product/${product.id}`} className="btn btn-primary" style={styles.cta}>
          View Details
        </Link>
      </div>

      {product.article_id && (
        <div style={styles.articleId}>Art. No: {product.article_id}</div>
      )}
    </div>
  </div>
);

const styles = {
  card: {
    background: 'rgba(22,6,14,0.82)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    border: '1px solid rgba(201,168,76,0.2)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  imgWrap: { position: 'relative', background: 'rgba(201,168,76,0.05)', aspectRatio: '3/4', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'contain', display: 'block' },
  noPhoto: {
    width: '100%', height: '100%',
    background: 'rgba(201,168,76,0.06)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
  },
  noPhotoIcon: { fontSize: '2.5rem', opacity: 0.4 },
  noPhotoText: {
    fontSize: '0.72rem', color: 'rgba(232,213,163,0.45)', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '1px',
  },
  availBadge: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    color: 'var(--gold-light)', fontSize: '0.7rem', fontWeight: '700',
    textAlign: 'center', padding: '6px 0', letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  body: {
    padding: '1.2rem 1.3rem 1.3rem',
    display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1,
    background: 'rgba(10,2,7,0.3)',
  },
  catBadge: { alignSelf: 'flex-start', marginBottom: '0.15rem' },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem', fontWeight: '600',
    color: 'var(--gold-light)', lineHeight: '1.3',
  },
  row: { display: 'flex', alignItems: 'baseline', gap: '0.5rem' },
  label: {
    fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: '1px', color: 'rgba(201,168,76,0.5)', minWidth: '48px',
  },
  value: { fontSize: '0.88rem', color: 'rgba(253,248,239,0.8)', fontWeight: '500' },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)',
    margin: '0.4rem 0',
  },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.25rem' },
  priceLabel: { fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(201,168,76,0.5)', fontWeight: '700' },
  price: { fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '700', color: 'var(--gold)' },
  cta: { fontSize: '0.78rem', padding: '8px 16px', textDecoration: 'none', whiteSpace: 'nowrap' },
  articleId: { fontSize: '0.65rem', color: 'rgba(201,168,76,0.35)', marginTop: '0.4rem', letterSpacing: '0.5px' },
};

export default ProductCard;
