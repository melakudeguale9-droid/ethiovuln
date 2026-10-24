'use client';

import React, { useState, useEffect } from 'react';
import { WordlistEntry, WordlistCategory } from '@/types/wordlist';
import { parseWordlistText } from '@/lib/wordlistsStorage';
import styles from './Wordlists.module.css';

interface WordlistEditorProps {
  wordlist: WordlistEntry | null;
  onSave: (updated: WordlistEntry) => void;
  onClone: (source: WordlistEntry) => void;
  onDelete: (id: string) => void;
}

export function WordlistEditor({
  wordlist,
  onSave,
  onClone,
  onDelete,
}: WordlistEditorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WordlistCategory>('custom');
  const [rawText, setRawText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (wordlist) {
      setName(wordlist.name);
      setDescription(wordlist.description);
      setCategory(wordlist.category);
      setRawText(wordlist.content.join('\n'));
      setIsDirty(false);
    }
  }, [wordlist]);

  if (!wordlist) {
    return (
      <div className={styles.editorCard} style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
        Select a wordlist from the left table to inspect or edit its contents.
      </div>
    );
  }

  // Calculate live word count
  const parsedWords = parseWordlistText(rawText);
  const currentCount = wordlist.isSystem && !isDirty ? wordlist.wordsCount : parsedWords.length;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
    setIsDirty(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsDirty(true);
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    setIsDirty(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard write failed */
    }
  };

  const handleExport = () => {
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const updated: WordlistEntry = {
      ...wordlist,
      name,
      description,
      category,
      wordsCount: currentCount,
      content: parsedWords,
      isSystem: false, // saving edits makes it custom
    };
    onSave(updated);
    setIsDirty(false);
  };

  return (
    <div className={styles.editorCard}>
      {/* Editor Header */}
      <div className={styles.editorHeader}>
        <div className={styles.editorTitle}>
          <span>Wordlist contents</span>
          <span className={styles.countBadge}>
            {currentCount.toLocaleString()} {currentCount === 1 ? 'word' : 'words'}
          </span>
        </div>

        <div className={styles.editorActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleCopy}
            title="Copy wordlist to clipboard"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleExport}
            title="Download wordlist as text file"
          >
            💾 Export
          </button>
          {!wordlist.isSystem && (
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              onClick={() => onDelete(wordlist.id)}
              title="Delete custom wordlist"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {/* Notice if system built-in */}
      {wordlist.isSystem && (
        <div className={styles.systemNotice}>
          <span>ℹ️</span>
          <span>
            This is a <strong>Default System Wordlist</strong>. You can view or export it freely. To customize and edit, click <strong>Clone & Edit</strong> below.
          </span>
        </div>
      )}

      {/* Wordlist Content Area */}
      <div className={styles.contentsWrapper}>
        <div className={styles.contentsHeader}>
          <span>One entry per line</span>
          <span>
            {wordlist.isSystem && !isDirty ? `Showing top ${wordlist.content.length} of ${wordlist.wordsCount.toLocaleString()} items` : `${parsedWords.length} items`}
          </span>
        </div>
        <textarea
          className={styles.contentsTextarea}
          value={rawText}
          onChange={handleTextChange}
          readOnly={wordlist.isSystem && !isDirty}
          placeholder="Enter words, paths, or patterns (one per line)..."
          spellCheck={false}
        />
      </div>

      {/* Name Input */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          className={styles.inputField}
          value={name}
          onChange={handleNameChange}
          readOnly={wordlist.isSystem && !isDirty}
          placeholder="Wordlist Name"
        />
      </div>

      {/* Description Input */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <input
          type="text"
          className={styles.inputField}
          value={description}
          onChange={handleDescChange}
          readOnly={wordlist.isSystem && !isDirty}
          placeholder="Short description of this wordlist..."
        />
      </div>

      {/* Footer Actions */}
      <div className={styles.editorFooter}>
        {wordlist.isSystem && !isDirty ? (
          <button
            type="button"
            className={styles.cloneBtn}
            onClick={() => onClone(wordlist)}
          >
            ⚡ Clone & Customize
          </button>
        ) : (
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!isDirty && wordlist.isSystem}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
