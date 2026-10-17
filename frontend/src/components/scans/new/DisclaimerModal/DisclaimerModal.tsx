import React from 'react';
import styles from './DisclaimerModal.module.css';

export interface DisclaimerModalProps {
  isOpen: boolean;
  targetUrl: string;
  tosAccepted: boolean;
  loading: boolean;
  onChangeTosAccepted: (accepted: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DisclaimerModal({
  isOpen,
  targetUrl,
  tosAccepted,
  loading,
  onChangeTosAccepted,
  onCancel,
  onConfirm,
}: DisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className={`modal-content ${styles.modalContent}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <span className={styles.warningIcon}>⚠</span>
          <h2 className={styles.modalTitle}>Legal Authorization & Responsibility</h2>
        </div>
        <p className={styles.modalSubtitle}>
          Please verify your authorization before executing automated security assessments
        </p>

        <div className={styles.warningBox}>
          <ul className={styles.warningList}>
            <li className={styles.warningItem}>
              You certify that you are the <strong style={{ color: '#F8FAFC' }}>owner</strong> or
              have <strong style={{ color: '#F8FAFC' }}>explicit written authorization</strong> to
              assess <span className={styles.targetHighlight}>{targetUrl}</span>.
            </li>
            <li className={styles.warningItem}>
              Scanning unauthorized web systems is{' '}
              <strong style={{ color: '#EF4444' }}>strictly prohibited by law</strong>.
            </li>
            <li>
              Active testing may generate HTTP traffic that could alert target firewalls or monitoring systems.
            </li>
          </ul>
        </div>

        <label
          className={styles.tosLabel}
          style={{
            border: tosAccepted
              ? '1px solid rgba(0, 229, 255, 0.3)'
              : '1px solid rgba(148, 163, 184, 0.12)',
            background: tosAccepted ? 'rgba(0, 229, 255, 0.05)' : 'transparent',
          }}
        >
          <input
            type="checkbox"
            checked={tosAccepted}
            onChange={(e) => onChangeTosAccepted(e.target.checked)}
            className={styles.tosCheckbox}
          />
          <span className={styles.tosText}>
            I confirm explicit authorization to test this target and accept the EthioVuln Terms of Service.
          </span>
        </label>

        <div className={styles.btnRow}>
          <button
            className={`btn-outline ${styles.cancelBtn}`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`btn-glow btn-glow-cyan ${styles.launchBtn}`}
            onClick={onConfirm}
            disabled={!tosAccepted || loading}
            style={{ opacity: tosAccepted ? 1 : 0.5 }}
          >
            {loading ? 'Initializing Engine...' : 'Launch Assessment →'}
          </button>
        </div>
      </div>
    </div>
  );
}
