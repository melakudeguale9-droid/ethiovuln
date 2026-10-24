export interface FaqItem {
  id: string;
  question: string;
  paragraphs: string[];
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is-scanner',
    question: 'What is a web vulnerability scanner?',
    paragraphs: [
      'A web vulnerability scanner is a specialized software tool designed to automatically identify security flaws within web applications. A reliable, robust website security scanner should be able to mimic real attacker tactics and identify realistic, exploitable security issues.',
      'Our Website Vulnerability Scanner is a robust example of this type of tool, offering a comprehensive scan that identifies threats and also validates them to reduce false positives.',
      'It works by interacting with the target application, sending a series of HTTP requests with specific payloads, and analyzing the responses to detect potential vulnerabilities such as Cross-Site Scripting (XSS), SQL injection, OWASP Top10, and other pressing security issues and misconfigurations.',
    ],
  },
  {
    id: 'types-detected',
    question: 'What types of web vulnerabilities can the Website Vulnerability Scanner detect?',
    paragraphs: [
      'The scanner evaluates your application across multiple security layers, covering server software vulnerabilities, misconfigurations, client-side flaws, and critical injection vulnerabilities.',
      'Common detected vectors include SQL Injection, Cross-Site Scripting (Reflected & Stored XSS), Server-Side Request Forgery (SSRF), OS Command Injection, XML External Entity (XXE) injection, Insecure Direct Object References (IDOR), sensitive data exposure, and outdated software components with known CVEs.',
      'It also audits security headers (CSP, HSTS, X-Frame-Options), CORS policies, and SSL/TLS cipher configurations.',
    ],
  },
  {
    id: 'scan-duration',
    question: 'How long does a website security scan take?',
    paragraphs: [
      'Scan duration depends on the scan mode (Light vs. Deep) and the complexity of the target application.',
      'Light scans run passively with zero attack payloads and typically finish in 2 to 5 minutes, making them ideal for quick perimeter checks. Deep scans perform active crawling, JavaScript execution, and thousands of payload injections, usually taking between 15 and 45 minutes depending on the number of endpoints and server response latency.',
    ],
  },
  {
    id: 'light-vs-deep',
    question: "What's the difference between a Light Scan and a Deep Scan with the Website Vulnerability Scanner?",
    paragraphs: [
      'A Light Scan is passive and non-intrusive. It analyzes HTTP headers, SSL/TLS certificates, software versions, and public endpoints without sending hostile attack vectors or injecting payloads.',
      'A Deep Scan actively injects test payloads for critical flaws like SQLi, XSS, SSRF, and Command Injection. It uses an automated browser crawler to discover dynamic routes, handles authentication sessions, and validates exploitability to provide proof-backed results.',
    ],
  },
  {
    id: 'spa-support',
    question: 'Can I use it to scan Single Page Applications (SPAs) and JavaScript-heavy websites?',
    paragraphs: [
      'Yes. The Website Vulnerability Scanner incorporates a headless Chromium browser crawler that executes client-side JavaScript, handles client-side routing (pushState), triggers DOM events, and uncovers hidden endpoints in applications built with React, Angular, Vue, and Next.js.',
      'This ensures that dynamic DOM-based vulnerabilities such as DOM XSS and client-side access control issues are thoroughly discovered.',
    ],
  },
  {
    id: 'third-party-components',
    question: 'How does the Website Vulnerability Scanner detect vulnerabilities in third-party components?',
    paragraphs: [
      'The scanner fingerprints third-party software, CMS engines (WordPress, Drupal, Joomla), web servers (Nginx, Apache), and client-side JavaScript libraries (jQuery, Bootstrap, React).',
      'It extracts exact version numbers from headers, meta tags, and script comments, then cross-references them against an updated vulnerability database containing over 100,000 CVEs to identify known exploits and unpatched security advisories.',
    ],
  },
  {
    id: 'password-protected',
    question: 'How do I scan a password-protected site for vulnerabilities?',
    paragraphs: [
      'You can perform authenticated scans using several authentication mechanisms: automatic form login by supplying credentials, custom session cookies, Bearer tokens, or recorded login workflows.',
      'The scanner maintains your authenticated session state throughout the scan, enabling it to map and audit authenticated user dashboards, administrative panels, and internal APIs.',
    ],
  },
  {
    id: 'minimize-false-positives',
    question: 'How does the Website Vulnerability Scanner minimize false positives?',
    paragraphs: [
      'Rather than relying on basic string matching or generic HTTP response codes, our scanner verifies findings using proof-based validation and Out-of-Band (OOB) listeners.',
      'When a vulnerability is flagged, the tool captures payload execution results, server response diffs, and exact parameter traces. If the scanner confirms that arbitrary payload execution occurred, it marks the finding with a CONFIRMED badge.',
    ],
  },
  {
    id: 'recurring-scans',
    question: 'Can I schedule recurring website vulnerability scans?',
    paragraphs: [
      'Yes. You can schedule automated scans on a daily, weekly, or monthly cadence to continuously monitor your perimeter for new vulnerabilities or deployment regressions.',
      'You can also configure notifications to alert your team via Slack, Microsoft Teams, or Webhooks only when new high or critical vulnerabilities are discovered.',
    ],
  },
  {
    id: 'integrations',
    question: 'Does the Website Vulnerability Scanner support integrations with other security tools?',
    paragraphs: [
      'Yes. The scanner integrates with Jira and GitLab for issue tracking, Slack and Discord for real-time alerting, GitHub Actions for CI/CD pipeline gating, and offers a comprehensive REST API and CLI tool for custom DevSecOps workflows.',
    ],
  },
  {
    id: 'reports-generated',
    question: 'What kind of reports does the Website Vulnerability Scanner generate?',
    paragraphs: [
      'The scanner produces audit-ready executive PDF reports, technical developer remediation documents, and raw export files in JSON and CSV formats.',
      'Reports include risk summaries, CVSS v3.1 score calculations, OWASP Top 10 classifications, step-by-step reproduction instructions, and actionable fix recommendations.',
    ],
  },
  {
    id: 'tool-comparison',
    question: 'How does the Website Vulnerability Scanner compare to other tools in the industry?',
    paragraphs: [
      'Unlike traditional heavyweight scanners that produce thousands of unverified alerts, EthioVuln emphasizes high-accuracy, proof-validated findings with minimal false positives.',
      'With fast setup, out-of-band detection, seamless single-page application crawling, and an operator-friendly web interface and CLI, teams can start scanning in seconds without complex infrastructure overhead.',
    ],
  },
  {
    id: 'pentest-effectiveness',
    question: 'How effective is the Website Vulnerability Scanner for penetration testing?',
    paragraphs: [
      'Security professionals and penetration testers use the scanner to accelerate the reconnaissance and vulnerability discovery phases of web app assessments.',
      'Because it provides raw HTTP requests, responses, and reproducible curl commands for each verified finding, pentesting teams save hours of manual verification time while building evidence-backed client deliverables.',
    ],
  },
  {
    id: 'best-free-scanner',
    question: 'What is the best free web application vulnerability scanner?',
    paragraphs: [
      'EthioVuln provides daily free scans allowing anyone to run light scans and essential security audits against their web assets without requiring credit cards or complex installations.',
      'Combined with industry-standard open source engines like Nuclei and OWASP ZAP, it offers one of the most accessible and powerful free web vulnerability assessment experiences available.',
    ],
  },
];
