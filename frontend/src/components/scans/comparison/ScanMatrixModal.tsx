'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  SCAN_CATEGORIES_DATA,
  TOTAL_CHECKS_COUNT,
  type ScanCategoryData,
} from './scanCategoriesData';
import { MatrixHeader } from './MatrixHeader';
import { CategoryGrid2x4 } from './CategoryGrid2x4';
import { MatrixFilters } from './MatrixFilters';
import { MatrixComparisonTable } from './MatrixComparisonTable';
import { MatrixFooter } from './MatrixFooter';
import styles from './ScanMatrixModal.module.css';

export interface ScanMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryId?: string;
  onSelectMode?: (modeId: string) => void;
}

export function ScanMatrixModal({
  isOpen,
  onClose,
  initialCategoryId = 'all',
  onSelectMode,
}: ScanMatrixModalProps) {
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyDeepExclusive, setOnlyDeepExclusive] = useState<boolean>(false);

  // Sync initialCategoryId when modal opens with a specific category
  useEffect(() => {
    if (isOpen && initialCategoryId) {
      setSelectedCatId(initialCategoryId);
    }
  }, [isOpen, initialCategoryId]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Filtered categories based on selected category, search query, and deep exclusive flag
  const filteredCategories = useMemo(() => {
    return SCAN_CATEGORIES_DATA.map((cat) => {
      if (selectedCatId !== 'all' && cat.id !== selectedCatId) {
        return null;
      }

      const q = searchQuery.trim().toLowerCase();

      const matchedItems = cat.items.filter((item) => {
        // Deep exclusive filter
        if (onlyDeepExclusive && item.lightSupported) {
          return false;
        }

        // Query filter
        if (!q) return true;

        return (
          item.title.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.deepNote.toLowerCase().includes(q) ||
          item.engine.toLowerCase().includes(q) ||
          (item.cwe && item.cwe.toLowerCase().includes(q)) ||
          cat.title.toLowerCase().includes(q)
        );
      });

      if (matchedItems.length === 0) return null;

      return {
        ...cat,
        items: matchedItems,
      };
    }).filter(Boolean) as ScanCategoryData[];
  }, [selectedCatId, searchQuery, onlyDeepExclusive]);

  const filteredChecksCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enable Deep Scans: Light vs Deep comparison matrix"
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <MatrixHeader onClose={onClose} />

        {/* 2x4 Category Grid Overview */}
        <div className="px-7 py-5 bg-[#090D16] border-b border-slate-800">
          <CategoryGrid2x4
            categories={SCAN_CATEGORIES_DATA}
            selectedCategoryId={selectedCatId}
            onSelectCategory={setSelectedCatId}
          />
        </div>

        {/* Search & Filter Controls */}
        <MatrixFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategoryId={selectedCatId}
          onSelectCategory={setSelectedCatId}
          onlyDeepExclusive={onlyDeepExclusive}
          onToggleDeepExclusive={setOnlyDeepExclusive}
          totalChecks={TOTAL_CHECKS_COUNT}
          filteredChecksCount={filteredChecksCount}
        />

        {/* Scrollable Table Content */}
        <div className={styles.scrollArea}>
          <MatrixComparisonTable categories={filteredCategories} />
        </div>

        {/* Action Footer */}
        <MatrixFooter onClose={onClose} onSelectMode={onSelectMode} />
      </div>
    </div>
  );
}

export default ScanMatrixModal;
