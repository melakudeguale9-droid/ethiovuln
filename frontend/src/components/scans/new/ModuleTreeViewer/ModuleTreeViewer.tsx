'use client';

import React, { useState } from 'react';
import type { AssessmentCategory } from '@/data/scanTaxonomy';
import styles from './ModuleTreeViewer.module.css';

export interface ModuleTreeViewerProps {
  category: AssessmentCategory;
}

export function ModuleTreeViewer({ category }: ModuleTreeViewerProps) {
  // Store which subcategories are expanded
  const [collapsedSubs, setCollapsedSubs] = useState<Record<string, boolean>>({});

  const toggleSub = (id: string) => {
    setCollapsedSubs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (category.subCategories.length === 0) return null;

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>🌳</span>
          <span>Inspection Tree: {category.title}</span>
        </div>
        <span className={styles.engineBadge}>
          ENGINE: {category.backendEngine.toUpperCase()}
        </span>
      </div>

      <div className={styles.subCategoryList}>
        {category.subCategories.map((sub) => {
          const isCollapsed = collapsedSubs[sub.id];

          return (
            <div key={sub.id} className={styles.subCategoryBox}>
              <div
                onClick={() => toggleSub(sub.id)}
                className={styles.subCategoryHeader}
              >
                <div className={styles.subCategoryTitle}>
                  <span className={styles.codePrefix}>{sub.code}</span>
                  <span>{sub.title}</span>
                </div>
                <span className={styles.toggleIcon}>
                  {isCollapsed ? '▼ Expand' : '▲ Collapse'}
                </span>
              </div>

              {!isCollapsed && (
                <div className={styles.checksList}>
                  {sub.checks.map((check) => (
                    <div key={check.id} className={styles.checkItem}>
                      <span className={styles.checkBullet} />
                      <span className={styles.checkCode}>{check.code}</span>
                      <span className={styles.checkName}>{check.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
