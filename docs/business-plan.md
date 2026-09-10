# EthioVuln Business Plan

## Executive Summary

EthioVuln is an affordable web vulnerability assessment platform for Ethiopian
small and medium-sized businesses, developers, consultants, and security teams.
It combines automated discovery, common web vulnerability checks, live scan
monitoring, and readable reports in one self-hostable product.

## Problem

Many organizations cannot afford enterprise DAST products or do not have a
dedicated application security team. Existing tools can also be difficult to
operate, fragmented across multiple interfaces, or unsuitable for local
consultants who need repeatable client reports.

## Solution

EthioVuln provides a guided scan workflow with SSRF-safe target validation,
Nuclei and ZAP integrations, a custom fuzzer, severity prioritization, evidence,
remediation guidance, real-time status, and PDF reporting.

## Target Market

- Small and medium-sized organizations building public web applications.
- Ethiopian software companies and digital service providers.
- Independent penetration testers and security consultants.
- Universities and security training programs.

## Competition and Differentiation

Commercial DAST platforms offer broad coverage but are expensive for small teams.
Open-source scanners are powerful but often require specialist setup and do not
provide a unified workflow. EthioVuln differentiates through a self-hosted,
local-first workflow, understandable reports, modular scanning engines, and a
low barrier to adoption.

## Business Model

- Community edition: self-hosted and free for learning and small assessments.
- Professional edition: hosted scans, team access, scheduled scans, and report
  branding on a monthly subscription.
- Consultant plan: multiple client workspaces and exportable branded reports.
- Training and deployment services for organizations that need onboarding.

## Technical Architecture

See [architecture.md](architecture.md). The initial product uses Next.js,
FastAPI, PostgreSQL, Redis, Celery, Nuclei, OWASP ZAP, and a Python custom
fuzzer.

## Development Roadmap

### Near term

- Improve authenticated scanning and endpoint discovery.
- Add finding deduplication and scan comparison.
- Add scheduled scans and organization workspaces.

### Medium term

- Add remediation tracking and ticket integrations.
- Add cloud deployment and usage metering.
- Add API security and OpenAPI-aware testing.

### Long term

- Add analyst-assisted triage and safe remediation suggestions.
- Add regional partner and consultant programs.