import type { Vulnerability } from '@/types/vulnerability';

export function extractParameter(vuln: Vulnerability): string | null {
  if (vuln.affected_parameter) return vuln.affected_parameter;
  if (vuln.request_data) {
    const m = vuln.request_data.match(/Param(?:eter)?:\s*([^\r\n]+)/i);
    if (m) return m[1].trim();
  }
  if (vuln.evidence) {
    const m = vuln.evidence.match(/Affected Item:\s*([^\r\n|]+)/i);
    if (m) return m[1].trim();
  }
  return null;
}

export function extractPayload(vuln: Vulnerability): string | null {
  if (vuln.request_data) {
    const m = vuln.request_data.match(/Payload:\s*([^\r\n]+)/i);
    if (m) return m[1].trim();
  }
  if (vuln.evidence) {
    const m = vuln.evidence.match(/Tested Payload:\s*([^\r\n|]+)/i);
    if (m) return m[1].trim();
  }
  return null;
}
