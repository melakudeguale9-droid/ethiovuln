'use client';

import React from 'react';
import type { ScanCategoryData } from './scanCategoriesData';
import styles from './ScanMatrixModal.module.css';

export interface CategoryGrid2x4Props {
  categories: ScanCategoryData[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryGrid2x4({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryGrid2x4Props) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
          <span className="text-xl">🎯</span>
          <span>8 Core Security Vectors (2×4 Architecture)</span>
        </h3>
        <span className="text-base font-medium text-slate-400">
          Click any vector to focus matrix
        </span>
      </div>

      {/* 2x4 Grid: 4 columns on large screens, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              className={`${styles.categoryCard} ${
                isSelected ? styles.categoryCardActive : ''
              } text-left focus:outline-none`}
              style={{
                borderColor: isSelected ? cat.color : undefined,
              }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span
                    className="font-mono font-bold text-base"
                    style={{ color: cat.color }}
                  >
                    0{cat.number}.
                  </span>
                </div>

                <span
                  className="text-base font-semibold px-2.5 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: cat.accentBg,
                    color: cat.color,
                    borderColor: `${cat.color}40`,
                  }}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Title & Summary */}
              <div>
                <h4
                  className="font-bold text-lg mb-1.5 transition-colors"
                  style={{ color: isSelected ? cat.color : '#F1F5F9' }}
                >
                  {cat.title}
                </h4>
                <p className="text-base text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.summary}
                </p>
              </div>

              {/* Card Footer: Sub-checks count */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                <span className="text-base text-slate-300 font-medium">
                  {cat.items.length} {cat.items.length === 1 ? 'Check' : 'Checks'}
                </span>
                <span
                  className="font-semibold text-base transition-colors"
                  style={{ color: isSelected ? cat.color : '#94A3B8' }}
                >
                  {isSelected ? 'Focused ✓' : 'View Details →'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
