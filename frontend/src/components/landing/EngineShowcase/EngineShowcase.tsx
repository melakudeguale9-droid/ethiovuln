'use client';

import React from 'react';
import { useEngineTabs, type EngineKey } from '@/hooks/useEngineTabs';
import styles from './EngineShowcase.module.css';

export function EngineShowcase() {
  const { activeTab, setActiveTab, currentEngine, availableEngines } = useEngineTabs('nuclei');

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.badge}>Architecture Pipeline</div>
        <h2 className={styles.title}>Multi-Engine Scanning Pipeline</h2>
        <p className={styles.subtitle}>
          Combines signature scanning, crawler-based attack injection, and directory brute forcing into a single coordinated stream.
        </p>
      </div>

      {/* Engine Selection Tabs */}
      <div className={styles.tabsContainer}>
        {availableEngines.map((engine) => {
          const isSelected = activeTab === engine.key;
          return (
            <button
              key={engine.key}
              onClick={() => setActiveTab(engine.key as EngineKey)}
              className={`${styles.tabButton} ${isSelected ? styles.tabButtonActive : ''}`}
              style={{
                borderColor: isSelected ? engine.color : undefined,
                backgroundColor: isSelected ? `${engine.color}15` : undefined,
                color: isSelected ? engine.color : undefined,
              }}
            >
              {engine.name}
            </button>
          );
        })}
      </div>

      {/* Selected Engine Display Card */}
      <div
        className={`glass-card ${styles.displayCard}`}
        style={{
          border: `1px solid ${currentEngine.color}35`,
          boxShadow: `0 8px 30px ${currentEngine.color}10`,
        }}
      >
        <div className={styles.displayCardHeader}>
          <div>
            <span className={styles.engineTag} style={{ color: currentEngine.color }}>
              {currentEngine.tag}
            </span>
            <h3 className={styles.engineName}>{currentEngine.name}</h3>
          </div>
          <div className={styles.statusIndicator}>
            ENGINE STATUS: <span className={styles.statusGreen}>AVAILABLE</span>
          </div>
        </div>

        <p className={styles.description}>{currentEngine.description}</p>

        {/* Specs Grid */}
        <div className={styles.specsGrid}>
          {currentEngine.specs.map((item, i) => (
            <div key={i} className={styles.specCard}>
              <div className={styles.specLabel}>{item.label}</div>
              <div className={styles.specVal}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
