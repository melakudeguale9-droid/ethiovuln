import React from 'react';
import { METRIC_CARDS, type MetricCardData } from '@/data/landingData';
import styles from './MetricsGrid.module.css';

export interface MetricsGridProps {
  cards?: MetricCardData[];
}

export function MetricsGrid({ cards = METRIC_CARDS }: MetricsGridProps) {
  return (
    <div className={styles.grid}>
      {cards.map((card, i) => (
        <div key={i} className={`glass-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>{card.label}</span>
            <span className={`mono-tag ${styles.tag}`}>{card.tag}</span>
          </div>
          <div className={styles.value}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
