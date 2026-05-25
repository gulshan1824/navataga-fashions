import React from 'react';

const FilterSidebar = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Categories</h3>
      <div className="filter-chips">
        <button
          onClick={() => onSelect('All')}
          style={{
            ...styles.chip,
            ...(selectedCategory === 'All' ? styles.activeChip : {})
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              ...styles.chip,
              ...(selectedCategory === cat ? styles.activeChip : {})
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1rem 0',
  },
  title: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    fontWeight: '600',
    color: 'var(--gold-light)',
  },
  chip: {
    padding: '8px 14px',
    borderRadius: 'var(--radius)',
    backgroundColor: 'rgba(22,6,14,0.7)',
    color: 'rgba(232,213,163,0.7)',
    textAlign: 'left',
    fontSize: '0.88rem',
    border: '1px solid rgba(201,168,76,0.22)',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(6px)',
  },
  activeChip: {
    backgroundColor: 'var(--gold)',
    color: 'var(--maroon-dark)',
    borderColor: 'var(--gold)',
    fontWeight: '700',
  }
};

export default FilterSidebar;
