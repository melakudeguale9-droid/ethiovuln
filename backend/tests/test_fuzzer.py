from unittest.mock import MagicMock, PropertyMock, patch

from app.workers.fuzzer import DirectoryFuzzer


def mocked_response(body: str):
    response = MagicMock()
    response.text = body
    response.headers = {}
    return response


def test_csrf_finds_post_form_without_token():
    session = MagicMock()
    session.get.return_value = mocked_response(
        '<form action="/profile" method="post">'
        '<input name="email"><button>Save</button></form>'
    )
    scanner = DirectoryFuzzer(threads=1, timeout=1)

    with patch.object(DirectoryFuzzer, "session", new_callable=PropertyMock, return_value=session):
        findings = scanner._check_csrf("https://example.com/account")

    assert len(findings) == 1
    assert findings[0]["cwe_id"] == "CWE-352"
    assert findings[0]["template_id"] == "csrf-form-token"


def test_csrf_ignores_post_form_with_token():
    session = MagicMock()
    session.get.return_value = mocked_response(
        '<form action="/profile" method="post">'
        '<input type="hidden" name="csrf_token" value="secret">'
        '<input name="email"></form>'
    )
    scanner = DirectoryFuzzer(threads=1, timeout=1)

    with patch.object(DirectoryFuzzer, "session", new_callable=PropertyMock, return_value=session):
        findings = scanner._check_csrf("https://example.com/account")

    assert findings == []