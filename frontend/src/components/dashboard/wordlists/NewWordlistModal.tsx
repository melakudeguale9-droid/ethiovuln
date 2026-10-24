'use client';

import React, { useState } from 'react';
import { WordlistEntry, WordlistCategory } from '@/types/wordlist';
import { parseWordlistText } from '@/lib/wordlistsStorage';
import styles from './Wordlists.module.css';

interface NewWordlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (wordlist: WordlistEntry) => void;
}

export function NewWordlistModal({
  isOpen,
  onClose,
  onCreate,
}: NewWordlistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WordlistCategory>('custom');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const parsedWords = parseWordlistText(content);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text || '');
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEntry: WordlistEntry = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      description: description.trim() || 'Custom user wordlist',
      category,
      wordsCount: parsedWords.length,
      isSystem: false,
      content: parsedWords,
      sizeBytes: new Blob([content]).size,
      updatedAt: new Date().toISOString(),
    };

    onCreate(newEntry);
    onClose();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create New Wordlist</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name *</label>
            <input
              type="text"
              required
              className={styles.inputField}
              placeholder="e.g. Sensitive API Endpoints"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="e.g. Targeted endpoints for internal auth fuzzing"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.inputField}
              value={category}
              onChange={(e) => setCategory(e.target.value as WordlistCategory)}
            >
              <option value="custom">Custom</option>
              <option value="fuzzer">URL / Path Fuzzer</option>
              <option value="subdomains">Subdomains / DNS</option>
              <option value="usernames">Usernames</option>
              <option value="passwords">Passwords</option>
              <option value="config">Configuration Files</option>
              <option value="api">API Endpoints</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.label}>
                Words Content (one per line) — {parsedWords.length} words
              </label>
              <label
                style={{
                  fontSize: 12.5,
                  color: '#00E5FF',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                📁 Import from File (.txt)
                <input
                  type="file"
                  accept=".txt,.csv,.list"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <textarea
              className={styles.contentsTextarea}
              style={{ height: 180, border: '1px solid rgba(148, 163, 184, 0.2)' }}
              placeholder="admin&#10;api/v1&#10;debug&#10;secrets"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={!name.trim()}
            >
              Save Wordlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
