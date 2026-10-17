import React from 'react';
import styles from './ProgressStageCard.module.css';

export interface ProgressStageCardProps {
  stage?: string;
  isCompleted: boolean;
  isRunning: boolean;
  progress: number;
}

export function ProgressStageCard({
  stage,
  isCompleted,
  isRunning,
  progress,
}: ProgressStageCardProps) {
  const displayStage = isCompleted
    ? 'Assessment Completed'
    : stage || (isRunning ? 'Initializing Engine Execution' : 'Assessment Completed');

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.stageRow}>
        <div className={styles.stageInfo}>
          <span className={styles.stageLabel}>Current Stage:</span>
          <span className={styles.stageValue}>{displayStage}</span>
        </div>
        <span className={styles.percentage}>{progress}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
