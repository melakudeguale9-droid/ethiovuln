'use client';

import React from 'react';
import { WordlistEntry, WordlistCategory } from '@/types/wordlist';
import styles from './Wordlists.module.css';

interface WordlistsTableProps {
  wordlists: WordlistEntry[];
  selectedId: string;
  onSelect: (wordlist: WordlistEntry) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: WordlistCategory;
  onCategoryChange: (category: WordlistCategory) => void;
}

const CATEGORIES: { id: WordlistCategory; label: string }[] = [
  { id: 'all', label: 'All Wordlists' },
  { id: 'config', label: 'Config Files' },
  { id: 'usernames', label: 'Usernames' },
  { id: 'passwords', label: 'Passwords' },
  { id: 'subdomains', label: 'Subdomains' },
  { id: 'fuzzer', label: 'Fuzzer' },
  { id: 'custom', label: 'Custom' },
];

export function WordlistsTable({
  wordlists,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: WordlistsTableProps) {
  return (
    <div className={styles.tableCard}>
      {/* Search & Filter Toolbar */}
      <div className={styles.tableToolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search wordlists by name or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className={styles.filterChips}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`${styles.chip} ${activeCategory === cat.id ? styles.chipActive : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Words count</th>
            </tr>
          </thead>
          <tbody>
            {wordlists.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                  No wordlists found matching your search.
                </td>
              </tr>
            ) : (
              wordlists.map((w) => {
                const isSelected = w.id === selectedId;
                return (
                  <tr
                    key={w.id}
                    onClick={() => onSelect(w)}
                    className={`${styles.tableRow} ${isSelected ? styles.tableRowSelected : ''}`}
                  >
                    <td>
                      <div className={styles.wordlistName}>
                        <span>{w.name}</span>
                        {w.isSystem ? (
                          <span className={styles.systemBadge}>Default</span>
                        ) : (
                          <span className={styles.customBadge}>Custom</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.wordlistDesc}>{w.description}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.countBadge}>
                        {w.wordsCount.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
