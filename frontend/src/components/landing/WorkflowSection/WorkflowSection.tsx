import React from 'react';
import { WORKFLOW_STEPS, type WorkflowStep } from '@/data/landingData';
import styles from './WorkflowSection.module.css';

export interface WorkflowSectionProps {
  steps?: WorkflowStep[];
}

export function WorkflowSection({ steps = WORKFLOW_STEPS }: WorkflowSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.badge}>End-To-End Execution</div>
        <h2 className={styles.title}>Four-Phase Assessment Flow</h2>
        <p className={styles.subtitle}>
          Structured pipeline ensuring safe ingestion, deep inspection, standardized severity scoring, and executive reporting.
        </p>
      </div>

      <div className={styles.grid}>
        {steps.map((wf, i) => (
          <div key={i} className={`glass-card ${styles.card}`}>
            <div>
              <div className={styles.cardHeader}>
                <span className={styles.stepNumber} style={{ color: wf.color }}>
                  {wf.step}
                </span>
                <span
                  className={styles.stepBadge}
                  style={{
                    background: `${wf.color}15`,
                    color: wf.color,
                    border: `1px solid ${wf.color}30`,
                  }}
                >
                  {wf.badge}
                </span>
              </div>
              <h3 className={styles.stepTitle}>{wf.title}</h3>
              <p className={styles.stepDesc}>{wf.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
