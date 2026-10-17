// EthioVuln — About Page Data & Definitions

export interface ExpertiseItem {
  title: string;
  desc: string;
  icon: string;
  color: string;
}

export const TECHNICAL_EXPERTISE: ExpertiseItem[] = [
  {
    title: 'Offensive Security',
    desc: 'Specialized in vulnerability assessment, penetration testing, and exploit research.',
    icon: '⬡',
    color: '#00ff88',
  },
  {
    title: 'Security Automation',
    desc: 'Building custom tools using Python (FastAPI/Flask) to automate threat detection.',
    icon: '◉',
    color: '#0088ff',
  },
  {
    title: 'Web Vulnerabilities',
    desc: 'Deep expertise in the OWASP Top 10, with a focus on SQL Injection, XSS, and broken access control.',
    icon: '◈',
    color: '#8b5cf6',
  },
  {
    title: 'Modern Web Stack',
    desc: 'Architecting secure, high-performance dashboards with Next.js, React, and TypeScript.',
    icon: '◧',
    color: '#00d4ff',
  },
];

export const DEVELOPER_BIO = {
  name: 'Melaku Deguale',
  title: 'Ethical Hacker & Security Researcher',
  subtitle: 'Certified Security Researcher & Consultant',
  availabilityStatus: 'Available for Consultation',
  bio: 'I am a professional Ethical Hacker and Software Developer specializing in offensive security and vulnerability research. My work focuses on identifying critical security flaws and building robust applications to mitigate digital threats. I am currently developing an automated Web Application Vulnerability Scanner designed to provide real-time security insights and protect web infrastructures from sophisticated attacks.',
};
