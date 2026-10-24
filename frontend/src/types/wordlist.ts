// EthioVuln — Wordlists Data Types
export type WordlistCategory =
  | 'all'
  | 'config'
  | 'usernames'
  | 'passwords'
  | 'subdomains'
  | 'fuzzer'
  | 'api'
  | 'custom';

export interface WordlistEntry {
  id: string;
  name: string;
  description: string;
  wordsCount: number;
  category: WordlistCategory;
  isSystem: boolean;
  content: string[];
  updatedAt?: string;
  sizeBytes?: number;
}
