import React from 'react';
import { SCAN_PROFILES, type ScanProfile } from '@/data/scanProfiles';
import styles from './ProfileSelector.module.css';

export interface ProfileSelectorProps {
  scanType: string;
  onSelectScanType: (key: string) => void;
  onProceed: () => void;
}

export function ProfileSelector({
  scanType,
  onSelectScanType,
  onProceed,
}: ProfileSelectorProps) {
  const selectedProfile = SCAN_PROFILES.find((p) => p.key === scanType) || SCAN_PROFILES[0];

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.headingWrapper}>
        <h2 className={styles.heading}>Select Assessment Profile</h2>
        <p className={styles.subheading}>
          Choose the scanning depth appropriate for your target environment and maintenance window
        </p>
      </div>

      <div className={styles.profileList}>
        {SCAN_PROFILES.map((profile) => {
          const isSelected = scanType === profile.key;
          return (
            <div
              key={profile.key}
              onClick={() => onSelectScanType(profile.key)}
              className={styles.profileItem}
              style={{
                border: isSelected
                  ? `1px solid ${profile.badgeColor}`
                  : '1px solid rgba(148, 163, 184, 0.12)',
                background: isSelected ? `${profile.badgeColor}0A` : 'rgba(5, 8, 17, 0.4)',
              }}
            >
              <div className={styles.itemHeader}>
                <div className={styles.radioRow}>
                  <input
                    type="radio"
                    name="scanType"
                    value={profile.key}
                    checked={isSelected}
                    onChange={() => onSelectScanType(profile.key)}
                    style={{ accentColor: profile.badgeColor, cursor: 'pointer' }}
                  />
                  <span
                    className={styles.itemTitle}
                    style={{ color: isSelected ? profile.badgeColor : '#F8FAFC' }}
                  >
                    {profile.title}
                  </span>
                </div>
                <span
                  className={styles.tagPill}
                  style={{
                    background: `${profile.badgeColor}15`,
                    color: profile.badgeColor,
                    border: `1px solid ${profile.badgeColor}30`,
                  }}
                >
                  {profile.tag}
                </span>
              </div>

              <p className={styles.itemDesc}>{profile.description}</p>

              <div className={styles.enginesRow}>
                {profile.engines.map((eng, idx) => (
                  <span key={idx} className="mono-tag" style={{ fontSize: 10 }}>
                    {eng}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.launchBtnWrapper}>
        <button
          className={`btn-glow btn-glow-cyan ${styles.launchBtn}`}
          onClick={onProceed}
        >
          Proceed to Launch {selectedProfile.title} →
        </button>
      </div>
    </div>
  );
}
