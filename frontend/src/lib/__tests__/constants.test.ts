import { describe, it, expect } from 'vitest';
import { APP_NAME, APP_VERSION, APP_TAGLINE, SOCIAL_LINKS } from '../constants';

describe('Application Constants', () => {
  it('defines the core application metadata', () => {
    expect(APP_NAME).toBe('EthioVuln');
    expect(APP_VERSION).toBe('1.0.0');
    expect(APP_TAGLINE).toContain('Automated Web Vulnerability Assessment Platform');
  });

  it('contains expected social links', () => {
    expect(SOCIAL_LINKS.github.username).toBe('melakudeguale9-droid');
    expect(SOCIAL_LINKS.telegram.username).toBe('melakucyber');
    expect(SOCIAL_LINKS.linkedin.url).toContain('linkedin.com/in/melaku-deguale');
  });
});
