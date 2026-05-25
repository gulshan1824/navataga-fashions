import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, syncSheet } from '../api';

const emptyForm = {
  article_id: '', name: '', colour: '', design_pattern: '',
  price: '', category: 'Saree', available: true, image_url: '',
};

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [formData, setFormData] = useState(emptyForm);

  const loadProducts = async () => {
    try { setProducts(await getProducts()); }
    catch (err) { console.error(err); }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: parseFloat(formData.price) };
      editingId ? await updateProduct(editingId, payload) : await createProduct(payload);
      setFormData(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch { alert('Error saving item'); }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      article_id: p.article_id || '',
      name: p.name || '',
      colour: p.colour || '',
      design_pattern: p.design_pattern || '',
      price: p.price || '',
      category: p.category || '',
      available: p.available ?? true,
      image_url: p.image_url || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this item from the catalog?')) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await syncSheet();
      setSyncMsg(res.message);
      loadProducts();
    } catch { setSyncMsg('Sync failed — check that the sheet is publicly accessible.'); }
    finally { setSyncing(false); }
  };

  return (
    <div className="container" style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Catalog Admin</h1>
          <p style={styles.subtitle}>{products.length} items · source: Google Sheet</p>
        </div>
        <button className="btn btn-gold" onClick={handleSync} disabled={syncing} style={styles.syncBtn}>
          {syncing ? 'Syncing…' : '↻ Sync from Google Sheet'}
        </button>
      </div>
      {syncMsg && <div style={styles.syncMsg}>{syncMsg}</div>}

      <div className="admin-layout" style={styles.layout}>
        {/* Table */}
        <div style={styles.listSection}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Art. ID', 'Name', 'Colour', 'Design Pattern', 'Category', 'Price', 'Avail.', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={styles.td}>{p.article_id || '—'}</td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.colour || '—'}</td>
                  <td style={styles.td}>{p.design_pattern || '—'}</td>
                  <td style={styles.td}>{p.category || '—'}</td>
                  <td style={styles.td}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td style={styles.td}>
                    <span style={{ color: p.available ? 'green' : '#c0392b', fontWeight: 600 }}>
                      {p.available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleEdit(p)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={styles.delBtn}>Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={8} style={{ ...styles.td, textAlign: 'center', color: 'var(--gray)', padding: '2rem' }}>
                  No items — click "Sync from Google Sheet" to load your catalog.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Form — mirrors sheet columns exactly */}
        <div className="admin-form-section" style={styles.formSection}>
          <h3 style={styles.formTitle}>{editingId ? 'Edit Item' : 'Add Item'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>

            <label style={styles.fieldLabel}>Article ID</label>
            <input name="article_id" placeholder="e.g. 1" value={formData.article_id} onChange={handleChange} style={styles.input} />

            <label style={styles.fieldLabel}>Name *</label>
            <input name="name" placeholder="e.g. Banarsi Silk" value={formData.name} onChange={handleChange} required style={styles.input} />

            <label style={styles.fieldLabel}>Colour</label>
            <input name="colour" placeholder="e.g. Red" value={formData.colour} onChange={handleChange} style={styles.input} />

            <label style={styles.fieldLabel}>Design Pattern</label>
            <input name="design_pattern" placeholder="e.g. Bandhni" value={formData.design_pattern} onChange={handleChange} style={styles.input} />

            <label style={styles.fieldLabel}>Price (₹) *</label>
            <input name="price" type="number" step="1" min="0" placeholder="e.g. 2000" value={formData.price} onChange={handleChange} required style={styles.input} />

            <label style={styles.fieldLabel}>Category</label>
            <input name="category" placeholder="e.g. Saree" value={formData.category} onChange={handleChange} style={styles.input} />

            <label style={styles.fieldLabel}>Photo URL</label>
            <input name="image_url" placeholder="https://..." value={formData.image_url} onChange={handleChange} style={styles.input} />

            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
              Available (Yes)
            </label>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              {editingId ? 'Update Item' : 'Add to Catalog'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData(emptyForm); }} style={styles.cancelBtn}>
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2.5rem 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  title: { fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.8rem' },
  subtitle: { color: 'var(--gray)', fontSize: '0.82rem', marginTop: '4px' },
  syncBtn: { whiteSpace: 'nowrap', marginTop: '4px' },
  syncMsg: { background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', color: 'var(--maroon)', padding: '10px 16px', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.88rem' },
  layout: { display: 'flex', gap: '2.5rem', alignItems: 'flex-start', marginTop: '1.5rem' },
  listSection: { flex: 1, overflowX: 'auto' },
  formSection: { flex: '0 0 300px', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--cream)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' },
  th: { textAlign: 'left', padding: '9px 12px', borderBottom: '2px solid var(--cream)', color: 'var(--gray)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' },
  td: { padding: '9px 12px', borderBottom: '1px solid var(--cream)', verticalAlign: 'middle' },
  editBtn: { color: 'var(--maroon)', marginRight: '0.6rem', background: 'transparent', fontWeight: '600', fontSize: '0.82rem' },
  delBtn: { color: '#c0392b', background: 'transparent', fontSize: '0.82rem' },
  formTitle: { fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.15rem', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  fieldLabel: { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray)', marginTop: '0.4rem' },
  input: { padding: '8px 11px', borderRadius: 'var(--radius)', border: '1.5px solid var(--cream)', fontSize: '0.86rem', fontFamily: 'inherit', outline: 'none', width: '100%' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', marginTop: '0.4rem' },
  cancelBtn: { background: 'transparent', color: 'var(--gray)', textDecoration: 'underline', fontSize: '0.82rem', marginTop: '0.25rem' },
};

export default Admin;
