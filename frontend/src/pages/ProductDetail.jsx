import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, proxyImage } from '../api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem 0' }}>Loading…</div>;
  if (!product) return <div className="container" style={{ padding: '4rem 0' }}>Product not found.</div>;

  /* Sheet fields rendered in this order:
     Category · Name · Colour · Design Pattern · Price · Available */
  const fields = [
    { label: 'Name',           value: product.name },
    { label: 'Colour',         value: product.colour },
    { label: 'Design Pattern', value: product.design_pattern },
    { label: 'Category',       value: product.category },
  ].filter(f => f.value);

  return (
    <div className="container" style={styles.page}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back to Collection</button>

      <div className="detail-grid" style={styles.grid}>
        {/* Left — image from sheet Photo column */}
        <div style={styles.imgCol}>
          {product.image_url ? (
            <img src={proxyImage(product.image_url)} alt={product.name} style={styles.img} />
          ) : (
            <div style={styles.noPhoto}>
              <span style={{ fontSize: '3rem', opacity: 0.4 }}>🪡</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Photo not added yet
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--gray)', marginTop: '0.25rem' }}>
                Add a photo URL to the sheet and sync
              </span>
            </div>
          )}
          <div style={{
            ...styles.availStrip,
            background: product.available ? 'var(--maroon)' : '#555',
          }}>
            {product.available ? '✓ Available' : 'Currently Unavailable'}
          </div>
        </div>

        {/* Right — sheet data */}
        <div style={styles.infoCol}>
          {product.category && <span className="badge" style={styles.catBadge}>{product.category}</span>}

          <h1 style={styles.name}>{product.name}</h1>
          <div className="gold-divider" />

          <div style={styles.price}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </div>

          {/* All remaining sheet columns as a clean info block */}
          <div style={styles.infoBlock}>
            {fields.filter(f => !['Name', 'Category'].includes(f.label)).map(f => (
              <div key={f.label} style={styles.infoRow}>
                <span style={styles.infoLabel}>{f.label}</span>
                <span style={styles.infoValue}>{f.value}</span>
              </div>
            ))}
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Article No.</span>
              <span style={styles.infoValue}>{product.article_id || '—'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Availability</span>
              <span style={{ ...styles.infoValue, color: product.available ? 'green' : '#c0392b', fontWeight: 700 }}>
                {product.available ? 'Yes — In Stock' : 'Sold Out'}
              </span>
            </div>
          </div>

          <button className="btn btn-primary" style={styles.cta}>Enquire Now</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { paddingTop: '2rem', paddingBottom: '4rem' },
  back: { background: 'transparent', color: 'rgba(201,168,76,0.55)', fontSize: '0.85rem', marginBottom: '2rem', display: 'inline-block' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' },
  imgCol: { position: 'relative' },
  img: { width: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', display: 'block' },
  noPhoto: {
    width: '100%', aspectRatio: '3/4',
    background: 'rgba(201,168,76,0.06)',
    borderRadius: 'var(--radius)', border: '1px solid rgba(201,168,76,0.2)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
  },
  availStrip: {
    color: 'var(--gold-light)', fontSize: '0.72rem', fontWeight: '700',
    textAlign: 'center', padding: '8px', letterSpacing: '1.5px',
    textTransform: 'uppercase', borderRadius: '0 0 var(--radius) var(--radius)',
  },
  infoCol: { display: 'flex', flexDirection: 'column', gap: '0' },
  catBadge: { alignSelf: 'flex-start', marginBottom: '0.75rem' },
  name: { fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--gold-light)', lineHeight: '1.2', marginBottom: '0.5rem' },
  price: { fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: '700', color: 'var(--gold)', margin: '1rem 0 1.5rem' },
  infoBlock: {
    border: '1px solid rgba(201,168,76,0.2)', borderRadius: 'var(--radius)',
    overflow: 'hidden', marginBottom: '2rem',
    background: 'rgba(22,6,14,0.6)', backdropFilter: 'blur(8px)',
  },
  infoRow: {
    display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.12)',
  },
  infoLabel: {
    width: '140px', padding: '12px 16px', background: 'rgba(201,168,76,0.08)',
    fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: '1px', color: 'rgba(201,168,76,0.55)', flexShrink: 0,
  },
  infoValue: {
    padding: '12px 16px', fontSize: '0.95rem', color: 'rgba(253,248,239,0.82)', fontWeight: '500',
  },
  cta: { width: '100%', padding: '15px', fontSize: '1rem', letterSpacing: '1px', textAlign: 'center' },
};

export default ProductDetail;
