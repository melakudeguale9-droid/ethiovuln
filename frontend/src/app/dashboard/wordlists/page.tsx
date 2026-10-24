'use client';

import React from 'react';
import { PageNav } from '@/components/navigation/PageNav';
import { WordlistsManager } from '@/components/dashboard/wordlists';

export default function WordlistsPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <PageNav
        backHref="/dashboard/settings"
        backLabel="Settings"
        nextHref="/dashboard/scans/new"
        nextLabel="New Scan"
      />
      <WordlistsManager />
    </div>
  );
}
