import React from 'react';
import type { AssessmentCategory } from '@/data/scanTaxonomy';
import styles from './AssessmentModes.module.css';

export interface AssessmentModesProps {
  categories: AssessmentCategory[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function AssessmentModes({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: AssessmentModesProps) {
  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h2 className={styles.heading}>
          <span>🎯</span> Select Assessment Mode
        </h2>
        <p className={styles.subheading}>
          Choose between 8 automated assessment pipelines or configure custom modular scopes
        </p>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          const totalSubChecks = cat.subCategories.reduce(
            (acc, sub) => acc + sub.checks.length,
            0
          );

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={styles.modeCard}
              style={{
                borderColor: isSelected ? cat.color : undefined,
                background: isSelected ? `${cat.color}0D` : undefined,
                boxShadow: isSelected ? `0 0 20px ${cat.color}15` : undefined,
              }}
            >
              <div className={styles.cardTop}>
                <div className={styles.leftGroup}>
                  <span className={styles.icon}>{cat.icon}</span>
                  <div>
                    <span className={styles.numberBadge} style={{ color: cat.color }}>
                      0{cat.number}.
                    </span>{' '}
                    <span
                      className={styles.title}
                      style={{ color: isSelected ? cat.color : '#F8FAFC' }}
                    >
                      {cat.title}
                    </span>
                  </div>
                </div>

                <span
                  className={styles.tagPill}
                  style={{
                    background: `${cat.color}15`,
                    color: cat.color,
                    border: `1px solid ${cat.color}30`,
                  }}
                >
                  {cat.tag}
                </span>
              </div>

              <p className={styles.description}>{cat.description}</p>

              <div className={styles.footer}>
                <span className={styles.modulesCount}>
                  {cat.id === 'custom_config'
                    ? '14 Granular Modules'
                    : `${cat.subCategories.length} Modules · ${totalSubChecks} Checks`}
                </span>

                <div
                  className={styles.radioCircle}
                  style={{
                    borderColor: isSelected ? cat.color : undefined,
                  }}
                >
                  {isSelected && (
                    <div
                      className={styles.radioDot}
                      style={{ backgroundColor: cat.color }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
