import requests
import json

# 1. Login to get token (using a dummy admin user or registering one)
resp = requests.post("http://localhost:8000/api/auth/register", json={
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
})

login_resp = requests.post("http://localhost:8000/api/auth/login", data={
    "username": "test@example.com",
    "password": "password123"
})
token = login_resp.json().get("access_token")

# 2. Accept TOS
requests.put("http://localhost:8000/api/settings/profile", 
    headers={"Authorization": f"Bearer {token}"},
    json={"tos_accepted": True}
)

# 3. Post to create scan
res = requests.post("http://localhost:8000/api/scans", 
    headers={"Authorization": f"Bearer {token}"},
    json={
        "target_url": "http://testphp.vulnweb.com",
        "scan_type": "full",
        "tos_accepted": True
    }
)
print("STATUS CODE:", res.status_code)
print("RESPONSE:", res.text)
