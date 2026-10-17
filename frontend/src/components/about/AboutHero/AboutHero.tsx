'use client';

import React, { useEffect, useState } from 'react';
import styles from './AboutHero.module.css';

export function AboutHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={styles.heroWrapper}>
      {/* Background Image */}
      <div className={styles.bgImage} />

      {/* Gradient Overlay */}
      <div className={styles.gradientOverlay} />

      {/* Floating Particles */}
      <div className={styles.particlesContainer}>
        {mounted &&
          Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                width: (i % 3) + 2,
                height: (i % 3) + 2,
                background: ['#00ff88', '#0088ff', '#00d4ff', '#8b5cf6'][i % 4],
                opacity: 0.2 + (i % 5) * 0.06,
                left: `${(i * 19 + 7) % 100}%`,
                top: `${(i * 11 + 8) % 100}%`,
                animation: `aboutFloat${i % 3} ${8 + (i % 4) * 3}s ease-in-out infinite`,
                animationDelay: `${(i % 5) * 1}s`,
              }}
            />
          ))}
      </div>

      {/* Hero Content */}
      <div
        className={styles.heroContent}
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {/* Shield Icon */}
        <div className={styles.shieldContainer}>
          <img src="/shield-icon.png" alt="DAST Shield" className={styles.shieldImage} />
        </div>

        <div className={styles.roleBadge}>
          <span className={styles.pulseDot} />
          About the Developer
        </div>

        <h1 className={styles.headline}>
          <span className={styles.whiteGradient}>Meet the </span>
          <span className={styles.cyanGradient}>Security Researcher</span>
        </h1>
        <p className={styles.subtitle}>
          Building the next generation of automated vulnerability detection tools.
        </p>
      </div>
    </section>
  );
}
