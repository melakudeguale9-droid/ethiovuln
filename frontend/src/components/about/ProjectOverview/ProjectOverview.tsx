import React from 'react';
import { PROJECT_MISSION_DOCS } from '@/data/aboutData';
import styles from './ProjectOverview.module.css';

export function ProjectOverview() {
  const { projectName, subtitle, description, mission, technicalDocs } = PROJECT_MISSION_DOCS;

  return (
    <div className={styles.container}>
      {/* ─── Project Description & Core Mission Card ─── */}
      <div className={styles.missionCard}>
        <div className={styles.badge}>
          <span className={styles.pulseDot} />
          <span>Platform Blueprint & Purpose</span>
        </div>

        <h2 className={styles.projectTitle}>
          {projectName} — <span className={styles.highlight}>{subtitle}</span>
        </h2>

        <p className={styles.description}>{description}</p>

        <div className={styles.missionBox}>
          <div className={styles.missionHeader}>
            <span>🛡️</span>
            <span>Core Mission Statement</span>
          </div>
          <p className={styles.missionText}>"{mission}"</p>
        </div>
      </div>

      {/* ─── Technical Documentation Overview ─── */}
      <div>
        <div className={styles.docsSectionHeader}>
          <h3 className={styles.docsTitle}>
            <span>⚙️</span> Technical Documentation & System Specifications
          </h3>
          <p className={styles.docsSubtitle}>
            Architectural standards, non-blocking execution pipelines, and security mechanisms powering the suite.
          </p>
        </div>

        <div className={styles.docsGrid}>
          {technicalDocs.map((doc, idx) => (
            <div key={idx} className={styles.docCard}>
              <div>
                <div className={styles.docHeader}>
                  <span className={styles.docCardTitle}>{doc.title}</span>
                  <span className={styles.docCode}>{doc.code}</span>
                </div>
                <p className={styles.docSummary}>{doc.summary}</p>
              </div>

              <div className={styles.specsList}>
                {doc.specs.map((spec, sIdx) => (
                  <div key={sIdx} className={styles.specItem}>
                    <span className={styles.specBullet} />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
