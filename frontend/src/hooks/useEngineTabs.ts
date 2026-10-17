'use client';

import { useState } from 'react';
import { PIPELINE_ENGINES, type PipelineEngine } from '@/data/landingData';

export type EngineKey = 'nuclei' | 'zap' | 'fuzzer';

export function useEngineTabs(initialTab: EngineKey = 'nuclei') {
  const [activeTab, setActiveTab] = useState<EngineKey>(initialTab);

  const currentEngine: PipelineEngine = PIPELINE_ENGINES[activeTab];

  return {
    activeTab,
    setActiveTab,
    currentEngine,
    availableEngines: (['nuclei', 'zap', 'fuzzer'] as const).map((key) => ({
      key,
      ...PIPELINE_ENGINES[key],
    })),
  };
}
