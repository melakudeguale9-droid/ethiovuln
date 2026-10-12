import asyncio
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

response = client.post(
    "/api/auth/login",
    data={"username": "melaku@gmail.com", "password": "password123"}
)
print("Status:", response.status_code)
if response.status_code == 500:
    print("Response:", response.text)
