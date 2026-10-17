import React from 'react';
import styles from './SettingsTabs.module.css';

export interface TabItem {
  id: string;
  label: string;
}

export interface SettingsTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export function SettingsTabs({ tabs, activeTab, onSelectTab }: SettingsTabsProps) {
  return (
    <div className={styles.tabBar}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelectTab(t.id)}
          className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ''}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
