import { useState, useMemo, useEffect } from 'react';
import {
  SCAN_TAXONOMY,
  CUSTOM_CONFIG_OPTIONS,
  type AssessmentCategory,
  type CustomModuleOption,
} from '@/data/scanTaxonomy';

export function useScanConfigurator(initialCategoryId: string = 'full_enterprise') {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId);

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CUSTOM_CONFIG_OPTIONS.forEach((opt) => {
      initial[opt.id] = opt.defaultChecked;
    });
    return initial;
  });
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  const activeCategory: AssessmentCategory = useMemo(() => {
    return (
      SCAN_TAXONOMY.find((cat) => cat.id === selectedCategoryId) ||
      SCAN_TAXONOMY[6] // fallback to full_enterprise
    );
  }, [selectedCategoryId]);

  const toggleModule = (id: string) => {
    setSelectedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectAllModules = () => {
    const next: Record<string, boolean> = {};
    CUSTOM_CONFIG_OPTIONS.forEach((opt) => {
      next[opt.id] = true;
    });
    setSelectedModules(next);
  };

  const deselectAllModules = () => {
    const next: Record<string, boolean> = {};
    CUSTOM_CONFIG_OPTIONS.forEach((opt) => {
      next[opt.id] = false;
    });
    setSelectedModules(next);
  };

  const selectedModulesCount = useMemo(() => {
    return Object.values(selectedModules).filter(Boolean).length;
  }, [selectedModules]);

  // Resolve backend scan_type
  const resolvedBackendEngine = useMemo(() => {
    if (selectedCategoryId === 'custom_config') {
      // Determine based on what's selected
      const hasZap = selectedModules['mod_8_3'] || selectedModules['mod_8_10'] || selectedModules['mod_8_12'] || selectedModules['mod_8_13'];
      const hasNuclei = selectedModules['mod_8_1'] || selectedModules['mod_8_2'] || selectedModules['mod_8_4'] || selectedModules['mod_8_14'];
      const hasFuzz = selectedModules['mod_8_6'] || selectedModules['mod_8_7'] || selectedModules['mod_8_8'] || selectedModules['mod_8_9'];

      if (hasZap && hasNuclei) return 'nuclei_zap';
      if (hasZap) return 'zap_only';
      if (hasFuzz) return 'fuzz_only';
      return 'nuclei_only';
    }
    return activeCategory.backendEngine;
  }, [selectedCategoryId, selectedModules, activeCategory]);

  return {
    categories: SCAN_TAXONOMY,
    activeCategory,
    selectedCategoryId,
    setSelectedCategoryId,
    customOptions: CUSTOM_CONFIG_OPTIONS,
    selectedModules,
    toggleModule,
    selectAllModules,
    deselectAllModules,
    selectedModulesCount,
    expandedSubCategory,
    setExpandedSubCategory,
    resolvedBackendEngine,
  };
}
