"""
EthioVuln — PDF Report Generator
Generates PDF reports using ReportLab (Windows compatible).
"""

import io
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


class PDFGenerator:
    def generate_report(self, scan_data: dict, vulnerabilities: list[dict]) -> bytes:
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import cm
            from reportlab.lib import colors
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
            from reportlab.lib.enums import TA_CENTER, TA_LEFT

            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4,
                                    rightMargin=2*cm, leftMargin=2*cm,
                                    topMargin=2*cm, bottomMargin=2*cm)

            styles = getSampleStyleSheet()
            story = []

            # Title
            title_style = ParagraphStyle('Title', parent=styles['Title'],
                                         fontSize=20, textColor=colors.HexColor('#0a0e1a'),
                                         spaceAfter=12, alignment=TA_CENTER)
            story.append(Paragraph("EthioVuln — Vulnerability Report", title_style))
            story.append(Spacer(1, 0.5*cm))

            # Scan info
            info_style = ParagraphStyle('Info', parent=styles['Normal'], fontSize=10)
            story.append(Paragraph(f"<b>Target:</b> {scan_data.get('target_url', 'N/A')}", info_style))
            story.append(Paragraph(f"<b>Scan Type:</b> {scan_data.get('scan_type', 'N/A')}", info_style))
            story.append(Paragraph(f"<b>Generated:</b> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}", info_style))
            story.append(Spacer(1, 0.5*cm))

            # Summary
            heading_style = ParagraphStyle('Heading', parent=styles['Heading1'],
                                           fontSize=14, textColor=colors.HexColor('#0a0e1a'))
            story.append(Paragraph("Executive Summary", heading_style))

            summary_data = [
                ['Severity', 'Count'],
                ['Critical', str(scan_data.get('critical_count', 0))],
                ['High', str(scan_data.get('high_count', 0))],
                ['Medium', str(scan_data.get('medium_count', 0))],
                ['Low', str(scan_data.get('low_count', 0))],
                ['Info', str(scan_data.get('info_count', 0))],
                ['Total', str(scan_data.get('total_vulnerabilities', 0))],
            ]

            severity_colors = {
                'Critical': colors.HexColor('#FF0040'),
                'High': colors.HexColor('#FF4444'),
                'Medium': colors.HexColor('#FFB020'),
                'Low': colors.HexColor('#44BB44'),
                'Info': colors.HexColor('#4488FF'),
                'Total': colors.HexColor('#0a0e1a'),
            }

            t = Table(summary_data, colWidths=[8*cm, 4*cm])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0a0e1a')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
                ('PADDING', (0, 0), (-1, -1), 8),
            ]))
            story.append(t)
            story.append(Spacer(1, 0.5*cm))

            # Vulnerabilities
            if vulnerabilities:
                story.append(Paragraph("Findings", heading_style))
                severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}
                sorted_vulns = sorted(vulnerabilities,
                                      key=lambda v: severity_order.get(v.get("severity", "info"), 5))

                vuln_data = [['#', 'Title', 'Severity', 'CVSS', 'URL']]
                for i, v in enumerate(sorted_vulns, 1):
                    vuln_data.append([
                        str(i),
                        v.get('title', 'N/A')[:50],
                        v.get('severity', 'info').upper(),
                        f"{v.get('cvss_score', 0):.1f}",
                        v.get('url', 'N/A')[:40],
                    ])

                vt = Table(vuln_data, colWidths=[1*cm, 6*cm, 2.5*cm, 1.5*cm, 5*cm])
                vt.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0a0e1a')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 8),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
                    ('PADDING', (0, 0), (-1, -1), 6),
                    ('WORDWRAP', (0, 0), (-1, -1), True),
                ]))
                story.append(vt)

            doc.build(story)
            return buffer.getvalue()

        except Exception as e:
            logger.error(f"PDF generation error: {e}")
            raise


pdf_generator = PDFGenerator()
