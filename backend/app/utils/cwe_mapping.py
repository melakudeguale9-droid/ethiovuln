"""
EthioVuln — CWE (Common Weakness Enumeration) Mapping
Top 100 CWE IDs with names, descriptions, and categories.
"""


CWE_DATABASE = {
    "CWE-20": {
        "name": "Improper Input Validation",
        "description": "The product receives input but does not validate or incorrectly validates that input.",
        "category": "Input Validation",
    },
    "CWE-22": {
        "name": "Path Traversal",
        "description": "The product uses external input to construct a pathname without restricting it, allowing access to files outside the intended directory.",
        "category": "Input Validation",
    },
    "CWE-77": {
        "name": "Command Injection",
        "description": "The product constructs a command using externally-influenced input without neutralizing special elements.",
        "category": "Injection",
    },
    "CWE-78": {
        "name": "OS Command Injection",
        "description": "The product constructs OS commands using externally-influenced input without proper neutralization.",
        "category": "Injection",
    },
    "CWE-79": {
        "name": "Cross-site Scripting (XSS)",
        "description": "The product does not neutralize user-controllable input before placing it in output used as a web page.",
        "category": "Injection",
    },
    "CWE-89": {
        "name": "SQL Injection",
        "description": "The product constructs SQL commands using externally-influenced input without proper neutralization.",
        "category": "Injection",
    },
    "CWE-90": {
        "name": "LDAP Injection",
        "description": "The product constructs LDAP queries using externally-influenced input without proper neutralization.",
        "category": "Injection",
    },
    "CWE-94": {
        "name": "Code Injection",
        "description": "The product constructs code segments using externally-influenced input without proper neutralization.",
        "category": "Injection",
    },
    "CWE-119": {
        "name": "Buffer Overflow",
        "description": "The product performs operations on a buffer without proper bounds checking.",
        "category": "Memory Safety",
    },
    "CWE-125": {
        "name": "Out-of-bounds Read",
        "description": "The product reads data past the end of the intended buffer.",
        "category": "Memory Safety",
    },
    "CWE-200": {
        "name": "Information Exposure",
        "description": "The product exposes sensitive information to an actor that is not explicitly authorized to have access.",
        "category": "Information Disclosure",
    },
    "CWE-209": {
        "name": "Error Message Information Leak",
        "description": "The product generates an error message that includes sensitive information.",
        "category": "Information Disclosure",
    },
    "CWE-250": {
        "name": "Execution with Unnecessary Privileges",
        "description": "The product performs an operation at a privilege level higher than needed.",
        "category": "Privilege Management",
    },
    "CWE-255": {
        "name": "Credentials Management Errors",
        "description": "Weaknesses in credential management and handling.",
        "category": "Authentication",
    },
    "CWE-259": {
        "name": "Hard-coded Password",
        "description": "The product contains a hard-coded password used for authentication.",
        "category": "Authentication",
    },
    "CWE-264": {
        "name": "Permissions, Privileges, and Access Controls",
        "description": "Weaknesses related to management of permissions, privileges, and access controls.",
        "category": "Authorization",
    },
    "CWE-269": {
        "name": "Improper Privilege Management",
        "description": "The product does not properly assign, modify, track, or check privileges.",
        "category": "Authorization",
    },
    "CWE-276": {
        "name": "Incorrect Default Permissions",
        "description": "The product sets insecure default permissions during installation.",
        "category": "Authorization",
    },
    "CWE-284": {
        "name": "Improper Access Control",
        "description": "The product does not restrict access to a resource properly.",
        "category": "Authorization",
    },
    "CWE-287": {
        "name": "Improper Authentication",
        "description": "The product does not sufficiently verify that a claim of identity is correct.",
        "category": "Authentication",
    },
    "CWE-295": {
        "name": "Improper Certificate Validation",
        "description": "The product does not validate or incorrectly validates a certificate.",
        "category": "Cryptography",
    },
    "CWE-306": {
        "name": "Missing Authentication for Critical Function",
        "description": "The product does not perform authentication for critical functions.",
        "category": "Authentication",
    },
    "CWE-307": {
        "name": "Improper Restriction of Excessive Authentication Attempts",
        "description": "The product does not limit authentication attempts properly.",
        "category": "Authentication",
    },
    "CWE-311": {
        "name": "Missing Encryption of Sensitive Data",
        "description": "The product does not encrypt sensitive data.",
        "category": "Cryptography",
    },
    "CWE-312": {
        "name": "Cleartext Storage of Sensitive Information",
        "description": "The product stores sensitive information in cleartext.",
        "category": "Cryptography",
    },
    "CWE-319": {
        "name": "Cleartext Transmission of Sensitive Information",
        "description": "The product transmits sensitive information in cleartext.",
        "category": "Cryptography",
    },
    "CWE-326": {
        "name": "Inadequate Encryption Strength",
        "description": "The product uses an encryption scheme that is not strong enough for its purpose.",
        "category": "Cryptography",
    },
    "CWE-327": {
        "name": "Use of a Broken or Risky Cryptographic Algorithm",
        "description": "The product uses a broken or risky cryptographic algorithm.",
        "category": "Cryptography",
    },
    "CWE-330": {
        "name": "Use of Insufficiently Random Values",
        "description": "The product uses insufficiently random values in a security context.",
        "category": "Cryptography",
    },
    "CWE-346": {
        "name": "Origin Validation Error",
        "description": "The product does not properly verify the origin of a request.",
        "category": "Input Validation",
    },
    "CWE-352": {
        "name": "Cross-Site Request Forgery (CSRF)",
        "description": "The web application does not sufficiently verify that a request was intentionally made by the user.",
        "category": "Session Management",
    },
    "CWE-362": {
        "name": "Race Condition",
        "description": "The product uses a resource concurrently without proper synchronization.",
        "category": "Concurrency",
    },
    "CWE-369": {
        "name": "Divide By Zero",
        "description": "The product divides a value by zero.",
        "category": "Numeric Errors",
    },
    "CWE-400": {
        "name": "Uncontrolled Resource Consumption",
        "description": "The product does not control resource consumption, leading to denial of service.",
        "category": "Resource Management",
    },
    "CWE-401": {
        "name": "Memory Leak",
        "description": "The product does not release memory after use.",
        "category": "Memory Safety",
    },
    "CWE-416": {
        "name": "Use After Free",
        "description": "The product references memory after it has been freed.",
        "category": "Memory Safety",
    },
    "CWE-425": {
        "name": "Direct Request (Forced Browsing)",
        "description": "The application does not adequately enforce access controls on URLs.",
        "category": "Authorization",
    },
    "CWE-434": {
        "name": "Unrestricted Upload of File with Dangerous Type",
        "description": "The product allows uploading files of dangerous types.",
        "category": "Input Validation",
    },
    "CWE-436": {
        "name": "Interpretation Conflict",
        "description": "Products integrate different parsing interpretations, creating exploitable inconsistencies.",
        "category": "Input Validation",
    },
    "CWE-476": {
        "name": "NULL Pointer Dereference",
        "description": "The product dereferences a NULL pointer.",
        "category": "Memory Safety",
    },
    "CWE-502": {
        "name": "Deserialization of Untrusted Data",
        "description": "The product deserializes untrusted data without sufficiently verifying it.",
        "category": "Input Validation",
    },
    "CWE-522": {
        "name": "Insufficiently Protected Credentials",
        "description": "The product transmits or stores credentials insecurely.",
        "category": "Authentication",
    },
    "CWE-532": {
        "name": "Information Exposure Through Log Files",
        "description": "Sensitive information is inserted into log files.",
        "category": "Information Disclosure",
    },
    "CWE-538": {
        "name": "Insertion of Sensitive Information into Externally-Accessible File or Directory",
        "description": "The product places sensitive information into externally-accessible files.",
        "category": "Information Disclosure",
    },
    "CWE-548": {
        "name": "Exposure of Information Through Directory Listing",
        "description": "A directory listing is improperly exposed, revealing file names and paths.",
        "category": "Information Disclosure",
    },
    "CWE-601": {
        "name": "Open Redirect",
        "description": "The product redirects users to an untrusted URL specified in user input.",
        "category": "Input Validation",
    },
    "CWE-611": {
        "name": "XML External Entity (XXE) Injection",
        "description": "The product processes XML input containing external entity references.",
        "category": "Injection",
    },
    "CWE-613": {
        "name": "Insufficient Session Expiration",
        "description": "The product does not sufficiently expire sessions.",
        "category": "Session Management",
    },
    "CWE-614": {
        "name": "Sensitive Cookie in HTTPS Session Without Secure Attribute",
        "description": "A sensitive cookie is sent without the Secure attribute.",
        "category": "Session Management",
    },
    "CWE-617": {
        "name": "Reachable Assertion",
        "description": "The product contains an assert() that can be triggered by an attacker.",
        "category": "Error Handling",
    },
    "CWE-639": {
        "name": "Insecure Direct Object Reference (IDOR)",
        "description": "The system's authorization relies on user-supplied identifiers.",
        "category": "Authorization",
    },
    "CWE-640": {
        "name": "Weak Password Recovery Mechanism for Forgotten Password",
        "description": "The product has a weak password recovery mechanism.",
        "category": "Authentication",
    },
    "CWE-693": {
        "name": "Protection Mechanism Failure",
        "description": "The product does not use or incorrectly uses a protection mechanism.",
        "category": "Security Features",
    },
    "CWE-732": {
        "name": "Incorrect Permission Assignment for Critical Resource",
        "description": "The product specifies incorrect permissions for critical resources.",
        "category": "Authorization",
    },
    "CWE-754": {
        "name": "Improper Check for Unusual or Exceptional Conditions",
        "description": "The product does not check for unusual conditions.",
        "category": "Error Handling",
    },
    "CWE-770": {
        "name": "Allocation of Resources Without Limits or Throttling",
        "description": "The product allocates resources without limits.",
        "category": "Resource Management",
    },
    "CWE-776": {
        "name": "XML Entity Expansion (Billion Laughs Attack)",
        "description": "The product uses XML parsers that are vulnerable to entity expansion attacks.",
        "category": "Injection",
    },
    "CWE-787": {
        "name": "Out-of-bounds Write",
        "description": "The product writes data past the end of the intended buffer.",
        "category": "Memory Safety",
    },
    "CWE-798": {
        "name": "Hard-coded Credentials",
        "description": "The product contains hard-coded credentials.",
        "category": "Authentication",
    },
    "CWE-862": {
        "name": "Missing Authorization",
        "description": "The product does not perform authorization checks.",
        "category": "Authorization",
    },
    "CWE-863": {
        "name": "Incorrect Authorization",
        "description": "The product performs incorrect authorization checks.",
        "category": "Authorization",
    },
    "CWE-918": {
        "name": "Server-Side Request Forgery (SSRF)",
        "description": "The server sends a request to a user-specified URL without validation.",
        "category": "Input Validation",
    },
    "CWE-922": {
        "name": "Insecure Storage of Sensitive Information",
        "description": "The product stores sensitive information insecurely.",
        "category": "Information Disclosure",
    },
    "CWE-943": {
        "name": "Improper Neutralization of Special Elements in Data Query Logic",
        "description": "The product does not properly neutralize special elements in queries.",
        "category": "Injection",
    },
    "CWE-1021": {
        "name": "Improper Restriction of Rendered UI Layers (Clickjacking)",
        "description": "The product does not restrict UI rendering in iframes.",
        "category": "UI Security",
    },
    "CWE-1035": {
        "name": "OWASP Top Ten 2017 Category A1 - Injection",
        "description": "OWASP Top Ten injection vulnerabilities.",
        "category": "OWASP",
    },
}


def get_cwe_info(cwe_id: str | None) -> dict:
    """
    Look up CWE information by ID.
    
    Args:
        cwe_id: CWE identifier (e.g., "CWE-79" or "79")
        
    Returns:
        Dictionary with 'name', 'description', 'category' keys
    """
    if not cwe_id:
        return {}

    # Normalize the CWE ID format
    cwe_id = cwe_id.strip().upper()
    if not cwe_id.startswith("CWE-"):
        cwe_id = f"CWE-{cwe_id}"

    return CWE_DATABASE.get(cwe_id, {
        "name": f"Unknown ({cwe_id})",
        "description": f"CWE entry {cwe_id} not in local database. See https://cwe.mitre.org/data/definitions/{cwe_id.split('-')[1]}.html",
        "category": "Unknown",
    })


def get_cwe_url(cwe_id: str) -> str:
    """Get the MITRE CWE URL for a given CWE ID."""
    if not cwe_id:
        return ""
    numeric = cwe_id.replace("CWE-", "").strip()
    return f"https://cwe.mitre.org/data/definitions/{numeric}.html"
