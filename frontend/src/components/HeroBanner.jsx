import React from 'react';

const HeroBanner = () => (
  <div className="hero-banner">
    <div className="hero-glow" />
    <div className="container hero-inner">

      <div className="hero-left">
        <div className="hero-eyebrow">
          <span className="hero-rune">✦</span>
          <span className="hero-eyebrow-text">Woven in Varanasi · Est. 7th Century CE</span>
          <span className="hero-rune">✦</span>
        </div>
        <h1 className="hero-headline">
          The Soul of&nbsp;<em className="hero-em">Banaras</em>
        </h1>
        <p className="hero-para">
          Six centuries of silk, zari, and the loom — each saree a living heirloom
          from the hands of Varanasi's master weavers.
        </p>
      </div>

      <div className="hero-right">
        <div className="hero-stat-grid">
          {[
            { num: '600+', label: 'Years of Tradition' },
            { num: '72 hrs', label: 'Per Masterpiece' },
            { num: '5,000+', label: 'Silk Threads' },
            { num: '100%', label: 'Handcrafted' },
          ].map(s => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

export default HeroBanner;
