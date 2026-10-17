'use client';

import React from 'react';
import type { CustomModuleOption } from '@/data/scanTaxonomy';
import styles from './CustomConfigurator.module.css';

export interface CustomConfiguratorProps {
  options: CustomModuleOption[];
  selectedModules: Record<string, boolean>;
  onToggleModule: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  selectedCount: number;
}

export function CustomConfigurator({
  options,
  selectedModules,
  onToggleModule,
  onSelectAll,
  onDeselectAll,
  selectedCount,
}: CustomConfiguratorProps) {
  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.topBar}>
        <div className={styles.titleGroup}>
          <span className={styles.title}>⚙️ Module Checklist (8.1 – 8.14)</span>
          <span className={styles.counter}>
            {selectedCount} of {options.length} Selected
          </span>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onSelectAll}
            className={styles.textBtn}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className={styles.textBtn}
          >
            Deselect All
          </button>
        </div>
      </div>

      <div className={styles.optionsGrid}>
        {options.map((opt) => {
          const isChecked = !!selectedModules[opt.id];

          return (
            <div
              key={opt.id}
              onClick={() => onToggleModule(opt.id)}
              className={`${styles.optionItem} ${isChecked ? styles.optionItemSelected : ''}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}} // Handled by container onClick
                className={styles.checkbox}
              />
              <div className={styles.optionContent}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionCode}>{opt.code}</span>
                  <span className={styles.optionTitle}>{opt.title}</span>
                </div>
                <p className={styles.optionDesc}>{opt.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
