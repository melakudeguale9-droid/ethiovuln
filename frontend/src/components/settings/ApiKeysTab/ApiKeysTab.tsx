import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { settingsApi } from '@/lib/settingsApi';
import styles from './ApiKeysTab.module.css';

export function ApiKeysTab() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyResult, setNewKeyResult] = useState<string | null>(null);
  const [apiKeyMsg, setApiKeyMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const loadApiKeys = async () => {
    try {
      const keys = (await settingsApi.listApiKeys()) as any[];
      setApiKeys(keys);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const createApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiKeyMsg(null);
    setNewKeyResult(null);
    if (!newKeyName.trim()) return;
    try {
      const result = (await settingsApi.createApiKey(newKeyName)) as any;
      setNewKeyResult(result.raw_key);
      setNewKeyName('');
      loadApiKeys();
    } catch (err: any) {
      setApiKeyMsg({ type: 'error', msg: err.message || 'Failed to create API key' });
    }
  };

  const revokeApiKey = async (id: string) => {
    try {
      await settingsApi.revokeApiKey(id);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
    } catch (err: any) {
      setApiKeyMsg({ type: 'error', msg: err.message || 'Failed to revoke key' });
    }
  };

  return (
    <div className={styles.wrapper}>
      <Card>
        <SectionHeader
          icon="🌐"
          title="API Keys"
          subtitle="Generate keys for programmatic access to the EthioVuln API"
        />
        {apiKeyMsg && <Alert type={apiKeyMsg.type} msg={apiKeyMsg.msg} />}

        {newKeyResult && (
          <div className={styles.newKeyBox}>
            <p className={styles.newKeyWarning}>
              ⚠️ Copy this key now — it will not be shown again
            </p>
            <code className={styles.keyCode}>{newKeyResult}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newKeyResult);
              }}
              className={styles.copyBtn}
            >
              📋 Copy to Clipboard
            </button>
          </div>
        )}

        <form onSubmit={createApiKey} className={styles.form}>
          <input
            className={`input-field ${styles.formInput}`}
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. CI Pipeline)"
            required
          />
          <button
            type="submit"
            className={`btn-glow btn-glow-green ${styles.generateBtn}`}
          >
            + Generate
          </button>
        </form>

        {apiKeys.length === 0 ? (
          <p style={{ fontSize: 13, color: '#64748b' }}>No API keys yet</p>
        ) : (
          <div className={styles.keyList}>
            {apiKeys.map((k) => (
              <div key={k.id} className={styles.keyItem}>
                <div>
                  <div className={styles.keyName}>{k.name}</div>
                  <div className={styles.keyMeta}>
                    {k.key_prefix}•••• · Created {new Date(k.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => revokeApiKey(k.id)}
                  className={styles.revokeBtn}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionHeader icon="ℹ️" title="Platform Info" subtitle="EthioVuln system details" />
        <div className={styles.platformGrid}>
          {[
            { label: 'Platform', value: 'EthioVuln' },
            { label: 'Version', value: 'v1.1.0' },
            { label: 'Scan Engines', value: 'Nuclei, ZAP, Fuzzer' },
            { label: 'API Docs', value: 'localhost:8000/api/docs' },
          ].map(({ label, value }) => (
            <div key={label} className={styles.platformItem}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
