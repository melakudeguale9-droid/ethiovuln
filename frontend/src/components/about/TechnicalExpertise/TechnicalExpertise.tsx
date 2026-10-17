import React from 'react';
import { TECHNICAL_EXPERTISE, DEVELOPER_BIO, type ExpertiseItem } from '@/data/aboutData';
import styles from './TechnicalExpertise.module.css';

export interface TechnicalExpertiseProps {
  items?: ExpertiseItem[];
}

export function TechnicalExpertise({ items = TECHNICAL_EXPERTISE }: TechnicalExpertiseProps) {
  return (
    <div>
      <h3 className={styles.sectionHeading}>About Me</h3>
      <p className={styles.bioText}>{DEVELOPER_BIO.bio}</p>

      <h3 className={styles.sectionHeading}>Technical Expertise</h3>
      <div className={styles.expertiseList}>
        {items.map((item, i) => (
          <div key={i} className={styles.expertiseCard}>
            <div
              className={styles.iconBox}
              style={{
                background: `${item.color}12`,
                border: `1px solid ${item.color}30`,
                color: item.color,
              }}
            >
              {item.icon}
            </div>
            <div>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
