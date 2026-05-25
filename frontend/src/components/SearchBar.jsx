import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="dark-input"
        style={styles.input}
      />
      <span style={styles.icon}>🔍</span>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    marginBottom: '2rem',
  },
  input: {
    width: '100%',
    padding: '12px 15px 12px 40px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid rgba(201,168,76,0.25)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    background: 'rgba(22,6,14,0.7)',
    color: 'rgba(253,248,239,0.82)',
    backdropFilter: 'blur(6px)',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(201,168,76,0.45)',
  }
};

export default SearchBar;
