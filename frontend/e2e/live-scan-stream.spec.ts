import { test, expect } from '@playwright/test';

const MOCK_SCAN_ID = 'test-scan-e2e-001';

const MOCK_SCAN_DATA = {
  id: MOCK_SCAN_ID,
  target_url: 'https://demo.ethiovuln.sec',
  target_domain: 'demo.ethiovuln.sec',
  status: 'running',
  progress: 65,
  current_stage: 'vulnerability_scanning',
  vulnerabilities: [
    {
      id: 'vuln-e2e-1',
      scan_id: MOCK_SCAN_ID,
      title: 'SQL Injection in User Authentication',
      description: 'Critical authentication bypass vulnerability allowing arbitrary SQL execution.',
      severity: 'critical',
      cvss_score: 9.8,
      cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      cwe_id: 'CWE-89',
      cwe_name: 'SQL Injection',
      url: 'https://demo.ethiovuln.sec/api/v1/auth/login',
      evidence: "SELECT * FROM users WHERE email='' OR '1'='1' --",
      request_data: 'POST /api/v1/auth/login HTTP/1.1\nHost: demo.ethiovuln.sec',
      response_data: 'HTTP/1.1 200 OK\n{"authenticated": true, "role": "admin"}',
      remediation: 'Implement parameterized SQL queries and input validation.',
      reference_urls: 'https://owasp.org/www-community/attacks/SQL_Injection',
      source: 'zap',
      template_id: 'zap-auth-sqli',
      found_at: new Date().toISOString(),
    },
    {
      id: 'vuln-e2e-2',
      scan_id: MOCK_SCAN_ID,
      title: 'Cross-Site Scripting (Reflected)',
      description: 'Reflected cross-site scripting flaw in search query parameter.',
      severity: 'high',
      cvss_score: 7.5,
      cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
      cwe_id: 'CWE-79',
      cwe_name: 'Cross-site Scripting',
      url: 'https://demo.ethiovuln.sec/search?q=<script>',
      evidence: '<script>alert(1)</script>',
      request_data: 'GET /search?q=<script> HTTP/1.1\nHost: demo.ethiovuln.sec',
      response_data: 'HTTP/1.1 200 OK\n<div><script>alert(1)</script></div>',
      remediation: 'Sanitize and encode all untrusted user inputs before rendering into the DOM.',
      reference_urls: 'https://owasp.org/www-community/attacks/xss/',
      source: 'nuclei',
      template_id: 'nuclei-reflected-xss',
      found_at: new Date().toISOString(),
    },
  ],
};

test.describe('Live Scan Stream & Findings E2E Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject auth token before any script execution
    await page.addInitScript(() => {
      window.localStorage.setItem('access_token', 'mock-token-e2e');
      window.localStorage.setItem('refresh_token', 'mock-refresh-e2e');
    });

    // Mock auth profile API
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-e2e',
          email: 'tester@ethiovuln.sec',
          username: 'tester',
          full_name: 'E2E Tester',
          role: 'admin',
          tos_accepted: true,
        }),
      });
    });

    // Mock scan telemetry polling API
    await page.route(`**/api/scans/${MOCK_SCAN_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_SCAN_DATA),
      });
    });

    // Mock scan vulnerabilities endpoint
    await page.route(`**/api/scans/${MOCK_SCAN_ID}/vulnerabilities*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_SCAN_DATA.vulnerabilities),
      });
    });
  });

  test('should render 2-column layout with Console Stream and Findings UI', async ({ page }) => {
    await page.goto(`/dashboard/scans/${MOCK_SCAN_ID}`);

    // Wait for the scan header target domain to appear
    await expect(page.locator(`text=${MOCK_SCAN_DATA.target_domain}`).first()).toBeVisible({ timeout: 10000 });

    // Verify Console Stream card header is rendered
    await expect(page.locator('text=Console Stream').first()).toBeVisible();

    // Verify Vulnerabilities Findings stream header is rendered with count
    await expect(page.locator('text=Vulnerability Findings (2)').first()).toBeVisible();

    // Verify Live Stream indicator badge
    await expect(page.locator('text=● LIVE STREAM').first()).toBeVisible();
  });

  test('should display findings and expand accordion to reveal vulnerability details', async ({ page }) => {
    await page.goto(`/dashboard/scans/${MOCK_SCAN_ID}`);

    // Verify finding title is present in the Findings Accordion
    const sqlTitle = page.locator('text=SQL Injection in User Authentication');
    await expect(sqlTitle.first()).toBeVisible({ timeout: 10000 });

    // Click the vulnerability accordion row to expand it
    await sqlTitle.first().click();

    // Verify detailed sections inside expanded accordion
    await expect(page.locator('text=Detailed Vulnerability Definition').first()).toBeVisible();
    await expect(page.locator('text=Severity Impact & Threat Analysis').first()).toBeVisible();
    await expect(page.locator('text=Actionable Remediation Steps').first()).toBeVisible();

    // Verify evidence content is present
    await expect(page.locator("text=SELECT * FROM users WHERE email='' OR '1'='1' --").first()).toBeVisible();
  });

  test('should filter findings by severity and clear filter', async ({ page }) => {
    await page.goto(`/dashboard/scans/${MOCK_SCAN_ID}`);

    // Ensure both findings are initially visible
    await expect(page.locator('text=SQL Injection in User Authentication').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Cross-Site Scripting (Reflected)').first()).toBeVisible();

    // Click on Critical severity counter pill
    const criticalButton = page.locator('button:has-text("Critical")').or(page.locator('[data-severity="critical"]'));
    if (await criticalButton.count() > 0) {
      await criticalButton.first().click();

      // Only SQL Injection should remain visible, XSS should be filtered out
      await expect(page.locator('text=SQL Injection in User Authentication').first()).toBeVisible();
      await expect(page.locator('text=Cross-Site Scripting (Reflected)')).not.toBeVisible();

      // Click clear filter button to restore all findings
      const clearBtn = page.locator('button:has-text("(Clear filter)")').or(page.locator('text=Show all findings'));
      if (await clearBtn.count() > 0) {
        await clearBtn.first().click();
        await expect(page.locator('text=Cross-Site Scripting (Reflected)')).toBeVisible();
      }
    }
  });

  test('should interact with Console Stream controls (auto-scroll checkbox)', async ({ page }) => {
    await page.goto(`/dashboard/scans/${MOCK_SCAN_ID}`);

    // Verify Auto-scroll toggle exists in Console Stream
    const autoScrollLabels = page.locator('label:has-text("Auto-scroll")');
    await expect(autoScrollLabels.first()).toBeVisible({ timeout: 10000 });

    // Verify checkbox is checked by default and can be toggled
    const checkbox = autoScrollLabels.first().locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });
});
