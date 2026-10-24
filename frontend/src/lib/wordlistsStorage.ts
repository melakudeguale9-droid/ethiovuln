// EthioVuln — Wordlists Storage & Helper Utility
import { DEFAULT_WORDLISTS } from '@/data/defaultWordlists';
import { WordlistEntry } from '@/types/wordlist';

const STORAGE_KEY = 'ethiovuln_custom_wordlists_v1';

export function getAllWordlists(): WordlistEntry[] {
  if (typeof window === 'undefined') {
    return DEFAULT_WORDLISTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_WORDLISTS;
    }
    const custom: WordlistEntry[] = JSON.parse(raw);
    return [...DEFAULT_WORDLISTS, ...custom];
  } catch {
    return DEFAULT_WORDLISTS;
  }
}

export function saveCustomWordlist(entry: WordlistEntry): WordlistEntry[] {
  if (typeof window === 'undefined') return DEFAULT_WORDLISTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const custom: WordlistEntry[] = raw ? JSON.parse(raw) : [];

    const existingIndex = custom.findIndex((w) => w.id === entry.id);
    if (existingIndex >= 0) {
      custom[existingIndex] = {
        ...entry,
        updatedAt: new Date().toISOString(),
      };
    } else {
      custom.push({
        ...entry,
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    return [...DEFAULT_WORDLISTS, ...custom];
  } catch (err) {
    console.error('Failed to save custom wordlist:', err);
    return DEFAULT_WORDLISTS;
  }
}

export function deleteCustomWordlist(id: string): WordlistEntry[] {
  if (typeof window === 'undefined') return DEFAULT_WORDLISTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WORDLISTS;
    let custom: WordlistEntry[] = JSON.parse(raw);
    custom = custom.filter((w) => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    return [...DEFAULT_WORDLISTS, ...custom];
  } catch (err) {
    console.error('Failed to delete wordlist:', err);
    return DEFAULT_WORDLISTS;
  }
}

export function resetWordlistsToDefaults(): WordlistEntry[] {
  if (typeof window === 'undefined') return DEFAULT_WORDLISTS;
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_WORDLISTS;
}

export function parseWordlistText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}
