'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { WordlistEntry, WordlistCategory } from '@/types/wordlist';
import {
  getAllWordlists,
  saveCustomWordlist,
  deleteCustomWordlist,
  resetWordlistsToDefaults,
} from '@/lib/wordlistsStorage';
import { WordlistsTable } from './WordlistsTable';
import { WordlistEditor } from './WordlistEditor';
import { NewWordlistModal } from './NewWordlistModal';
import styles from './Wordlists.module.css';

export function WordlistsManager() {
  const [wordlists, setWordlists] = useState<WordlistEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string>('common-config-files');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<WordlistCategory>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load wordlists on mount
  useEffect(() => {
    const lists = getAllWordlists();
    setWordlists(lists);
    if (lists.length > 0) {
      setSelectedId(lists[0].id);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter wordlists based on search and category
  const filteredWordlists = useMemo(() => {
    return wordlists.filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'custom' ? !w.isSystem : w.category === activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [wordlists, searchQuery, activeCategory]);

  // Selected wordlist
  const selectedWordlist = useMemo(() => {
    return wordlists.find((w) => w.id === selectedId) || filteredWordlists[0] || null;
  }, [wordlists, selectedId, filteredWordlists]);

  // Actions
  const handleSelect = (w: WordlistEntry) => {
    setSelectedId(w.id);
  };

  const handleSave = (updated: WordlistEntry) => {
    const updatedLists = saveCustomWordlist(updated);
    setWordlists(updatedLists);
    setSelectedId(updated.id);
    showToast(`Saved "${updated.name}" successfully.`);
  };

  const handleClone = (source: WordlistEntry) => {
    const cloned: WordlistEntry = {
      id: `custom-clone-${Date.now()}`,
      name: `${source.name} (Custom Copy)`,
      description: `Cloned from ${source.name}`,
      category: source.category,
      wordsCount: source.content.length,
      isSystem: false,
      content: [...source.content],
      sizeBytes: source.sizeBytes,
      updatedAt: new Date().toISOString(),
    };
    const updatedLists = saveCustomWordlist(cloned);
    setWordlists(updatedLists);
    setSelectedId(cloned.id);
    showToast(`Created custom copy of "${source.name}".`);
  };

  const handleDelete = (id: string) => {
    const w = wordlists.find((item) => item.id === id);
    if (confirm(`Are you sure you want to delete "${w?.name || 'this wordlist'}"?`)) {
      const updatedLists = deleteCustomWordlist(id);
      setWordlists(updatedLists);
      if (updatedLists.length > 0) {
        setSelectedId(updatedLists[0].id);
      }
      showToast('Wordlist deleted.');
    }
  };

  const handleCreate = (newEntry: WordlistEntry) => {
    const updatedLists = saveCustomWordlist(newEntry);
    setWordlists(updatedLists);
    setSelectedId(newEntry.id);
    showToast(`Created new wordlist "${newEntry.name}".`);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset custom wordlists back to default factory settings?')) {
      const defaults = resetWordlistsToDefaults();
      setWordlists(defaults);
      setSelectedId(defaults[0].id);
      showToast('Wordlists reset to defaults.');
    }
  };

  // Stats calculation
  const totalWords = useMemo(() => {
    return wordlists.reduce((acc, curr) => acc + curr.wordsCount, 0);
  }, [wordlists]);

  const customCount = useMemo(() => {
    return wordlists.filter((w) => !w.isSystem).length;
  }, [wordlists]);

  return (
    <div className={styles.container}>
      {/* Toast alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #00E5FF',
            color: '#F8FAFC',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0, 229, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>
            <span>🗂️ Wordlists</span>
          </h1>
          <p className={styles.subtitle}>
            Wordlists allow you to store and manage lists of words for directory fuzzing, DNS enumeration, and credential auditing.
            <a
              href="https://github.com/danielmiessler/SecLists"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readMoreLink}
            >
              Read more ↗
            </a>
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setIsModalOpen(true)}
          >
            ＋ New Wordlist
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleResetDefaults}
            title="Reset to factory default lists"
          >
            🔄 Reset Defaults
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div>
            <div className={styles.statValue}>{wordlists.length}</div>
            <div className={styles.statLabel}>Available Wordlists</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#EAB308' }}>
            ⚡
          </div>
          <div>
            <div className={styles.statValue}>{totalWords.toLocaleString()}</div>
            <div className={styles.statLabel}>Total Words & Patterns</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            🛠️
          </div>
          <div>
            <div className={styles.statValue}>{customCount}</div>
            <div className={styles.statLabel}>Custom User Lists</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#A855F7' }}>
            🎯
          </div>
          <div>
            <div className={styles.statValue}>Active</div>
            <div className={styles.statLabel}>Fuzzer & Scanner Bound</div>
          </div>
        </div>
      </div>

      {/* Two-Column Split Workspace */}
      <div className={styles.workspaceLayout}>
        <WordlistsTable
          wordlists={filteredWordlists}
          selectedId={selectedId}
          onSelect={handleSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <WordlistEditor
          wordlist={selectedWordlist}
          onSave={handleSave}
          onClone={handleClone}
          onDelete={handleDelete}
        />
      </div>

      {/* New Wordlist Modal */}
      <NewWordlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
