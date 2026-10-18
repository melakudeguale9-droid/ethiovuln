import React from 'react';
import Link from 'next/link';
import { SCAN_TAXONOMY } from '@/data/scanTaxonomy';
import styles from './FeatureGrid.module.css';

export function FeatureGrid() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.header}>
        <div className={styles.badge}>Core Scanning Capabilities</div>
        <h2 className={styles.title}>Multi-Tier Enterprise Scanning Suite</h2>
        <p className={styles.subtitle}>
          Systematic active injection, passive telemetry audits, container inspection, and API security organized into 8 assessment vectors.
        </p>
      </div>

      <div className={styles.grid}>
        {SCAN_TAXONOMY.map((cat) => {
          const totalChecks = cat.subCategories.reduce(
            (acc, sub) => acc + sub.checks.length,
            0
          );

          return (
            <Link
              key={cat.id}
              href={`/dashboard/scans/new?mode=${cat.id}`}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <div
                  className={styles.iconWrapper}
                  style={{
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}35`,
                  }}
                >
                  <span>{cat.icon}</span>
                </div>
                <span
                  className={styles.tierTag}
                  style={{
                    background: `${cat.color}15`,
                    color: cat.color,
                    border: `1px solid ${cat.color}35`,
                  }}
                >
                  {cat.tag}
                </span>
              </div>

              <h3 className={styles.cardTitle}>
                0{cat.number}. {cat.title}
              </h3>

              <p className={styles.cardDesc}>{cat.description}</p>

              <div className={styles.cardFooter}>
                <span className={styles.checksCount}>
                  {cat.id === 'custom_config'
                    ? '14 Custom Modules'
                    : `${cat.subCategories.length} Modules · ${totalChecks} Checks`}
                </span>
                <span className={styles.arrowLink}>
                  Launch <span>→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
