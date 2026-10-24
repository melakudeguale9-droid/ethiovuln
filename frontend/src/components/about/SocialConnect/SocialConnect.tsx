import React from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';
import styles from './SocialConnect.module.css';

export function SocialConnect() {
  return (
    <div className={styles.wrapper}>
      {/* Featured Photo Card */}
      <div className={styles.featuredCard}>
        <img
          src="/profile.png?v=2"
          alt="Melaku Deguale - Security Researcher"
          className={styles.featuredImage}
        />
        <div className={styles.featuredOverlay} />
        <div className={styles.featuredDetails}>
          <p className={styles.featuredName}>Melaku Deguale</p>
          <p className={styles.featuredRole}>Cyber Security Student &amp; Security Researcher</p>
        </div>
      </div>

      {/* Shield / Platform Badge */}
      <div className={styles.platformBadge}>
        <div className={styles.shieldIcon}>
          <img src="/shield-icon.png" alt="DAST Shield" className={styles.shieldImg} />
        </div>
        <div>
          <p className={styles.badgeTitle}>EthioVuln Creator</p>
          <p className={styles.badgeDesc}>
            Enterprise-grade vulnerability scanner built with Next.js &amp; FastAPI
          </p>
        </div>
      </div>

      {/* Socials & Contact Box */}
      <div className={styles.socialBox}>
        <h3 className={styles.socialHeading}>Contact &amp; Social Media</h3>
        <div className={styles.socialList}>
          <a
            href={SOCIAL_LINKS.github.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub Repository</span>
          </a>

          <a
            href={SOCIAL_LINKS.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.222-.524.222l.213-3.05 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            <span>Telegram (@{SOCIAL_LINKS.telegram.username})</span>
          </a>

          <a
            href={SOCIAL_LINKS.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn (Melaku Deguale)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
