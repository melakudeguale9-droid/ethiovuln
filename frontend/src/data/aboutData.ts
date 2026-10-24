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
    title: 'Security Telemetry & UI',
    desc: 'Engineering intuitive threat visualization interfaces, CVSS scoring dashboards, and live scanner consoles.',
    icon: '◧',
    color: '#00d4ff',
  },
];

export const DEVELOPER_BIO = {
  name: 'Melaku Deguale',
  title: 'Cyber Security Student ',
  subtitle: 'INSA Cyber Talent Center Participant & Security Researcher',
  availabilityStatus: 'Available for Security Research',
  bio: 'I am a dedicated Cyber Security Student and Security Researcher specializing in offensive security, vulnerability assessment, and threat mitigation. My work focuses on identifying critical security flaws and architecting robust defense mechanisms to protect digital assets. As the creator of EthioVuln, I engineer automated web application vulnerability scanning solutions designed to provide real-time security insights and protect digital infrastructures.',
};

export interface TechDocSection {
  title: string;
  code: string;
  summary: string;
  specs: string[];
}

export const PROJECT_MISSION_DOCS = {
  projectName: 'EthioVuln Security Suite',
  subtitle: 'Automated Cyber Security Assessment & Threat Intelligence Platform',
  description:
    'EthioVuln is a modern, high-performance web vulnerability assessment and penetration testing suite built for enterprise environments. It unifies signature-based DAST matching (Nuclei), crawler-driven attack injection (OWASP ZAP), and concurrent endpoint reconnaissance into a single, coordinated scanning engine.',
  mission:
    'To democratize proactive cybersecurity intelligence by delivering automated, transparent, and non-destructive vulnerability assessments that protect vital digital infrastructures before threat actors exploit them.',
  technicalDocs: [
    {
      title: 'Anti-SSRF Validation Gateway',
      code: 'GATE-01',
      summary: 'Strict input sanitization resolving target DNS to ensure private subnets (RFC 1918), AWS/cloud metadata (169.254.169.254), and local loopbacks cannot be weaponized.',
      specs: ['DNS Rebinding Protection', 'Cloud Metadata Blacklist', 'IPv4/IPv6 Dual Stack Filter'],
    },
    {
      title: 'Tri-Engine Orchestration Engine',
      code: 'ORCH-02',
      summary: 'Asynchronous scan dispatching via Celery & Redis. Executes Nuclei templates, ZAP spidering/active scans, and concurrent HTTP fuzzing.',
      specs: ['Non-blocking Job Queues', 'Real-time WebSocket Console', 'Automated Fallback Handling'],
    },
    {
      title: 'Standardized Severity Normalization',
      code: 'NORM-03',
      summary: 'All raw findings are deduplicated, enriched with CVSS v3.1 vector calculations, and mapped directly to MITRE CWE taxonomies and OWASP Top 10 classifications.',
      specs: ['CVSS v3.1 Scoring Matrix', 'MITRE CWE Correlation', 'PoC Evidence Capture'],
    },
    {
      title: 'Enterprise PDF Compliance Reporting',
      code: 'REPT-04',
      summary: 'Automated executive and technical PDF generation featuring severity distribution charts, attack vector summaries, and actionable developer remediation.',
      specs: ['Executive Summary Cards', 'Developer Fix Guidance', 'Cryptographic Timestamping'],
    },
  ] as TechDocSection[],
};

