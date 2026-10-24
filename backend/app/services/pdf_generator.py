"""
EthioVuln — Executive PDF Report Generator
Generates publication-grade vulnerability assessment reports using ReportLab.
Handles edge cases (missing attributes, None values, long text) safely.
"""

import io
import logging
from datetime import datetime, timezone
from xml.sax.saxutils import escape as xml_escape

logger = logging.getLogger(__name__)


def _safe_str(val, default: str = "N/A") -> str:
    if val is None:
        return default
    s = str(val).strip()
    return s if s else default


def _safe_escape(val, default: str = "N/A") -> str:
    text = _safe_str(val, default)
    return xml_escape(text)


def _safe_float(val, default: float = 0.0) -> float:
    if val is None:
        return default
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


def _safe_int(val, default: int = 0) -> int:
    if val is None:
        return default
    try:
        return int(val)
    except (ValueError, TypeError):
        return default


class PDFGenerator:
    """Enterprise-grade PDF report compiler with CVSS matrices and remediation blueprints."""

    def generate_report(self, scan_data: dict, vulnerabilities: list[dict]) -> bytes:
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import cm
            from reportlab.lib import colors
            from reportlab.platypus import (
                SimpleDocTemplate,
                Paragraph,
                Spacer,
                Table,
                TableStyle,
                KeepTogether,
                HRFlowable,
            )
            from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
            from reportlab.pdfgen import canvas

            class NumberedCanvas(canvas.Canvas):
                """Two-pass canvas to dynamically compute and draw total page numbers and running footer."""

                def __init__(self, *args, **kwargs):
                    super().__init__(*args, **kwargs)
                    self._saved_page_states = []

                def showPage(self):
                    self._saved_page_states.append(dict(self.__dict__))
                    self._startPage()

                def save(self):
                    num_pages = len(self._saved_page_states)
                    for state in self._saved_page_states:
                        self.__dict__.update(state)
                        self.draw_page_decorations(num_pages)
                        super().showPage()
                    super().save()

                def draw_page_decorations(self, page_count):
                    self.saveState()
                    self.setFont("Helvetica", 8)
                    self.setFillColor(colors.HexColor("#64748B"))
                    # Top running header on later pages
                    if self._pageNumber > 1:
                        self.drawString(54, A4[1] - 36, "EthioVuln — Automated Security Assessment Report")
                        self.drawRightString(A4[0] - 54, A4[1] - 36, "CONFIDENTIAL")
                        self.setStrokeColor(colors.HexColor("#E2E8F0"))
                        self.setLineWidth(0.5)
                        self.line(54, A4[1] - 42, A4[0] - 54, A4[1] - 42)

                    # Running footer on all pages
                    footer_text = "EthioVuln Dynamic Application Security Testing (DAST) | INSA Cyber Security Platform"
                    self.drawString(54, 30, footer_text)
                    page_text = f"Page {self._pageNumber} of {page_count}"
                    self.drawRightString(A4[0] - 54, 30, page_text)
                    self.setStrokeColor(colors.HexColor("#E2E8F0"))
                    self.setLineWidth(0.5)
                    self.line(54, 42, A4[0] - 54, 42)
                    self.restoreState()

            buffer = io.BytesIO()
            doc = SimpleDocTemplate(
                buffer,
                pagesize=A4,
                rightMargin=1.8 * cm,
                leftMargin=1.8 * cm,
                topMargin=2.0 * cm,
                bottomMargin=2.0 * cm,
            )

            styles = getSampleStyleSheet()

            # Custom typography styles
            title_style = ParagraphStyle(
                "DocTitle",
                parent=styles["Title"],
                fontName="Helvetica-Bold",
                fontSize=20,
                leading=24,
                textColor=colors.HexColor("#0B1120"),
                alignment=TA_LEFT,
                spaceAfter=4,
            )
            subtitle_style = ParagraphStyle(
                "DocSubTitle",
                parent=styles["Normal"],
                fontName="Helvetica",
                fontSize=10,
                leading=14,
                textColor=colors.HexColor("#64748B"),
                alignment=TA_LEFT,
                spaceAfter=14,
            )
            section_heading = ParagraphStyle(
                "SectionHeading",
                parent=styles["Heading1"],
                fontName="Helvetica-Bold",
                fontSize=13,
                leading=17,
                textColor=colors.HexColor("#0F172A"),
                spaceBefore=12,
                spaceAfter=8,
            )
            finding_title_style = ParagraphStyle(
                "FindingTitle",
                parent=styles["Heading2"],
                fontName="Helvetica-Bold",
                fontSize=11,
                leading=15,
                textColor=colors.HexColor("#0F172A"),
                spaceBefore=4,
                spaceAfter=4,
            )
            body_style = ParagraphStyle(
                "BodyDark",
                parent=styles["Normal"],
                fontName="Helvetica",
                fontSize=9,
                leading=13,
                textColor=colors.HexColor("#334155"),
            )
            code_block_style = ParagraphStyle(
                "CodeBlock",
                parent=styles["Code"],
                fontName="Courier",
                fontSize=8,
                leading=11,
                textColor=colors.HexColor("#0F172A"),
                backColor=colors.HexColor("#F1F5F9"),
                borderColor=colors.HexColor("#CBD5E1"),
                borderWidth=0.5,
                borderPadding=6,
                spaceBefore=4,
                spaceAfter=6,
            )
            remediation_style = ParagraphStyle(
                "RemediationText",
                parent=styles["Normal"],
                fontName="Helvetica",
                fontSize=9,
                leading=13,
                textColor=colors.HexColor("#047857"),
            )

            story = []

            # ── 1. Document Header ──────────────────────────────────────────
            story.append(Paragraph("🛡️ EthioVuln Security Assessment Report", title_style))
            story.append(
                Paragraph(
                    "Dynamic Application Security Testing (DAST) &amp; Automated Vulnerability Audit",
                    subtitle_style,
                )
            )
            story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284C7"), spaceAfter=12))

            # ── 2. Scan Metadata Table ──────────────────────────────────────
            target_url = _safe_escape(scan_data.get("target_url"), "N/A")
            scan_type = _safe_escape(scan_data.get("scan_type"), "full").upper()
            started_at = _safe_escape(scan_data.get("started_at"), "N/A")
            completed_at = _safe_escape(scan_data.get("completed_at"), "N/A")
            gen_time = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

            meta_data = [
                [
                    Paragraph("<b>Target URL:</b>", body_style),
                    Paragraph(f"<font color='#0284C7'>{target_url}</font>", body_style),
                    Paragraph("<b>Scan Profile:</b>", body_style),
                    Paragraph(scan_type, body_style),
                ],
                [
                    Paragraph("<b>Assessment Date:</b>", body_style),
                    Paragraph(started_at, body_style),
                    Paragraph("<b>Report Generated:</b>", body_style),
                    Paragraph(gen_time, body_style),
                ],
                [
                    Paragraph("<b>Status:</b>", body_style),
                    Paragraph("<font color='#16A34A'><b>COMPLETED</b></font>", body_style),
                    Paragraph("<b>Scanners:</b>", body_style),
                    Paragraph("OWASP ZAP, Nuclei, Smart Fuzzer", body_style),
                ],
            ]

            meta_table = Table(meta_data, colWidths=[3.2 * cm, 5.5 * cm, 3.2 * cm, 5.5 * cm])
            meta_table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                        ("PADDING", (0, 0), (-1, -1), 5),
                        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ]
                )
            )
            story.append(meta_table)
            story.append(Spacer(1, 0.4 * cm))

            # ── 3. Executive Summary & Severity Matrix ──────────────────────
            story.append(Paragraph("1. Executive Summary &amp; Risk Metrics", section_heading))

            crit_count = _safe_int(scan_data.get("critical_count"), 0)
            high_count = _safe_int(scan_data.get("high_count"), 0)
            med_count = _safe_int(scan_data.get("medium_count"), 0)
            low_count = _safe_int(scan_data.get("low_count"), 0)
            info_count = _safe_int(scan_data.get("info_count"), 0)
            total_vulns = _safe_int(scan_data.get("total_vulnerabilities"), crit_count + high_count + med_count + low_count + info_count)

            # Determine overall risk posture
            if crit_count > 0:
                posture_label = "<font color='#DC2626'><b>CRITICAL RISK</b></font>"
            elif high_count > 0:
                posture_label = "<font color='#EA580C'><b>HIGH RISK</b></font>"
            elif med_count > 0:
                posture_label = "<font color='#D97706'><b>MEDIUM RISK</b></font>"
            elif low_count > 0 or info_count > 0:
                posture_label = "<font color='#16A34A'><b>LOW RISK</b></font>"
            else:
                posture_label = "<font color='#16A34A'><b>CLEAN / MINIMAL RISK</b></font>"

            summary_rows = [
                ["Severity Level", "Vulnerability Count", "CVSS v3.1 Range", "Action Urgency"],
                ["CRITICAL", str(crit_count), "9.0 – 10.0", "Immediate (Within 24 Hours)"],
                ["HIGH", str(high_count), "7.0 – 8.9", "Urgent (Within 7 Days)"],
                ["MEDIUM", str(med_count), "4.0 – 6.9", "Prioritized (Next Release Sprint)"],
                ["LOW", str(low_count), "0.1 – 3.9", "Scheduled Maintenance"],
                ["INFORMATIONAL", str(info_count), "0.0", "Hardening / Best Practice"],
                ["TOTAL FINDINGS", str(total_vulns), "—", posture_label],
            ]

            sum_table = Table(summary_rows, colWidths=[4.2 * cm, 3.8 * cm, 3.8 * cm, 5.6 * cm])
            sum_table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0B1120")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, 0), 9),
                        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                        ("ALIGN", (1, 1), (2, -1), "CENTER"),
                        ("ROWBACKGROUNDS", (0, 1), (-1, -2), [colors.white, colors.HexColor("#F8FAFC")]),
                        ("BACKGROUND", (0, 1), (0, 1), colors.HexColor("#FEE2E2")),  # Critical red tint
                        ("TEXTCOLOR", (0, 1), (0, 1), colors.HexColor("#991B1B")),
                        ("BACKGROUND", (0, 2), (0, 2), colors.HexColor("#FFEDD5")),  # High orange tint
                        ("TEXTCOLOR", (0, 2), (0, 2), colors.HexColor("#C2410C")),
                        ("BACKGROUND", (0, 3), (0, 3), colors.HexColor("#FEF3C7")),  # Medium amber tint
                        ("TEXTCOLOR", (0, 3), (0, 3), colors.HexColor("#B45309")),
                        ("BACKGROUND", (0, 4), (0, 4), colors.HexColor("#DCFCE7")),  # Low green tint
                        ("TEXTCOLOR", (0, 4), (0, 4), colors.HexColor("#15803D")),
                        ("BACKGROUND", (0, 5), (0, 5), colors.HexColor("#DBEAFE")),  # Info blue tint
                        ("TEXTCOLOR", (0, 5), (0, 5), colors.HexColor("#1D4ED8")),
                        ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#E2E8F0")),
                        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                        ("PADDING", (0, 0), (-1, -1), 5),
                    ]
                )
            )
            story.append(sum_table)
            story.append(Spacer(1, 0.4 * cm))

            # ── 4. Findings Catalog Overview ────────────────────────────────
            story.append(Paragraph("2. Discovered Vulnerabilities Catalog", section_heading))

            if not vulnerabilities:
                clean_p = Paragraph(
                    "<b>Assessment Result:</b> No security vulnerabilities were detected on the submitted target within the configured scan parameters.",
                    body_style,
                )
                story.append(clean_p)
            else:
                severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}
                sorted_vulns = sorted(
                    vulnerabilities,
                    key=lambda v: severity_order.get(_safe_str(v.get("severity")).lower(), 5),
                )

                catalog_data = [["#", "Vulnerability Title", "Severity", "CVSS", "CWE", "Source Engine"]]
                for i, v in enumerate(sorted_vulns, 1):
                    sev = _safe_str(v.get("severity"), "info").upper()
                    cvss = f"{_safe_float(v.get('cvss_score')):0.1f}"
                    cwe = _safe_str(v.get("cwe_id"), "—")
                    title = _safe_escape(v.get("title"), "Untitled Vulnerability")
                    engine = _safe_str(v.get("source"), "Scanner").upper()

                    catalog_data.append(
                        [
                            str(i),
                            Paragraph(f"<b>{title}</b>", body_style),
                            sev,
                            cvss,
                            cwe,
                            engine,
                        ]
                    )

                catalog_table = Table(catalog_data, colWidths=[0.8 * cm, 7.8 * cm, 2.4 * cm, 1.6 * cm, 2.4 * cm, 2.4 * cm])
                catalog_table.setStyle(
                    TableStyle(
                        [
                            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0B1120")),
                            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                            ("FONTSIZE", (0, 0), (-1, 0), 8),
                            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                            ("ALIGN", (0, 1), (0, -1), "CENTER"),
                            ("ALIGN", (2, 1), (5, -1), "CENTER"),
                            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
                            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                            ("PADDING", (0, 0), (-1, -1), 5),
                            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                        ]
                    )
                )
                story.append(catalog_table)
                story.append(Spacer(1, 0.4 * cm))

                # ── 5. Detailed Technical Findings & Remediation Blueprints ─
                story.append(Paragraph("3. Technical Findings &amp; Developer Remediation Blueprints", section_heading))

                for i, v in enumerate(sorted_vulns, 1):
                    title = _safe_escape(v.get("title"), "Untitled Vulnerability")
                    sev = _safe_str(v.get("severity"), "info").upper()
                    cvss = f"{_safe_float(v.get('cvss_score')):0.1f}"
                    vector = _safe_escape(v.get("cvss_vector"), "N/A")
                    cwe_id = _safe_escape(v.get("cwe_id"), "N/A")
                    cwe_name = _safe_escape(v.get("cwe_name"), "N/A")
                    vuln_url = _safe_escape(v.get("url"), target_url)
                    desc = _safe_escape(v.get("description"), "No description provided.")
                    evidence = _safe_str(v.get("evidence"), "").strip()
                    remediation = _safe_escape(v.get("remediation"), "Follow OWASP secure coding guidelines.")
                    source = _safe_str(v.get("source"), "Scanner").upper()

                    # Color mapping for card header
                    sev_color = {
                        "CRITICAL": "#DC2626",
                        "HIGH": "#EA580C",
                        "MEDIUM": "#D97706",
                        "LOW": "#16A34A",
                        "INFO": "#2563EB",
                    }.get(sev, "#0B1120")

                    finding_elements = []

                    # Card title header
                    header_p = Paragraph(
                        f"<b>Finding #{i}: {title}</b> &nbsp;|&nbsp; <font color='{sev_color}'><b>[{sev} — CVSS {cvss}]</b></font>",
                        finding_title_style,
                    )
                    finding_elements.append(header_p)

                    # Meta grid for the finding
                    detail_rows = [
                        [
                            Paragraph("<b>Affected Endpoint:</b>", body_style),
                            Paragraph(f"<font color='#0284C7'>{vuln_url}</font>", body_style),
                        ],
                        [
                            Paragraph("<b>CWE Classification:</b>", body_style),
                            Paragraph(f"{cwe_id}: {cwe_name}", body_style),
                        ],
                        [
                            Paragraph("<b>CVSS Vector:</b>", body_style),
                            Paragraph(f"<font face='Courier' size='7'>{vector}</font>", body_style),
                        ],
                        [
                            Paragraph("<b>Detection Source:</b>", body_style),
                            Paragraph(source, body_style),
                        ],
                    ]

                    detail_table = Table(detail_rows, colWidths=[3.8 * cm, 13.6 * cm])
                    detail_table.setStyle(
                        TableStyle(
                            [
                                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
                                ("PADDING", (0, 0), (-1, -1), 4),
                                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ]
                        )
                    )
                    finding_elements.append(detail_table)
                    finding_elements.append(Spacer(1, 0.2 * cm))

                    # Description
                    finding_elements.append(Paragraph(f"<b>Vulnerability Description:</b> {desc}", body_style))
                    finding_elements.append(Spacer(1, 0.2 * cm))

                    # Proof of concept / Evidence (if available)
                    if evidence:
                        finding_elements.append(Paragraph("<b>Proof of Concept / Raw Evidence:</b>", body_style))
                        clean_ev = xml_escape(evidence[:400])
                        finding_elements.append(Paragraph(clean_ev, code_block_style))
                        finding_elements.append(Spacer(1, 0.2 * cm))

                    # Remediation
                    finding_elements.append(
                        Paragraph(
                            f"<b>Recommended Remediation:</b> <font color='#047857'>{remediation}</font>",
                            remediation_style,
                        )
                    )
                    finding_elements.append(Spacer(1, 0.3 * cm))
                    finding_elements.append(
                        HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceAfter=8)
                    )

                    # Wrap in KeepTogether so findings don't split awkwardly across pages
                    story.append(KeepTogether(finding_elements))

            doc.build(story, canvasmaker=NumberedCanvas)
            return buffer.getvalue()

        except Exception as e:
            logger.error(f"PDF generation error: {e}", exc_info=True)
            raise


pdf_generator = PDFGenerator()
