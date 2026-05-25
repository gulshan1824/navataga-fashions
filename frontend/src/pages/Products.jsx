import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../api';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import HeritagePillars from '../components/HeritagePillars';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(search, selectedCategory);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  return (
    <>
    <HeroBanner />
    <div style={collectionHeadingStyles.wrap}>
      <div style={collectionHeadingStyles.line} />
      <div style={collectionHeadingStyles.center}>
        <div style={collectionHeadingStyles.label}>Our Collection</div>
        <div style={collectionHeadingStyles.sub}>
          Discover the finest Banarasi silk &amp; cotton weaves, curated from master looms of Varanasi
        </div>
      </div>
      <div style={collectionHeadingStyles.line} />
    </div>
    <div className="container products-page">
      <aside className="products-sidebar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </aside>
      <main className="products-main">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </main>
    </div>
    <HeritagePillars />
    </>
  );
};

const collectionHeadingStyles = {
  wrap: {
    display: 'flex', alignItems: 'center', gap: '2rem',
    padding: '1.5rem 2rem 0',
    maxWidth: '1240px', margin: '0 auto',
  },
  line: {
    flex: 1, height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)',
  },
  center: { textAlign: 'center', flexShrink: 0 },
  label: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5rem', fontWeight: '700',
    color: 'var(--gold-light)', letterSpacing: '1px',
  },
  sub: {
    fontSize: '0.72rem', color: 'rgba(201,168,76,0.5)',
    letterSpacing: '1px', marginTop: '0.4rem',
    textTransform: 'uppercase',
  },
};


export default Products;
