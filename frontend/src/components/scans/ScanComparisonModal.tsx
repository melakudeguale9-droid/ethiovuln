'use client';

/**
 * EthioVuln — Scan Comparison Matrix Modal
 * Modular Architecture & Accessibility Compliance
 * Re-exports the modular ScanMatrixModal and dataset for backward compatibility.
 */

export {
  ScanMatrixModal as ScanComparisonModal,
  ScanMatrixModal as default,
  type ScanMatrixModalProps,
  type ScanMatrixModalProps as ScanComparisonModalProps,
} from './comparison/ScanMatrixModal';

export {
  SCAN_CATEGORIES_DATA,
  SCAN_CATEGORIES_DATA as PENTEST_COMPARISON_CATEGORIES,
  TOTAL_CHECKS_COUNT,
  LIGHT_SUPPORTED_CHECKS_COUNT,
  DEEP_EXCLUSIVE_CHECKS_COUNT,
  type ScanCategoryData,
  type ScanCategoryData as ComparisonCategory,
  type ComparisonCheckItem,
  type ComparisonCheckItem as ComparisonItem,
  type SeverityLevel,
} from './comparison/scanCategoriesData';
