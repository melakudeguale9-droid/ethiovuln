# EthioVuln — Uptime & Health Monitoring Guide

This guide details how to monitor the health and uptime of the EthioVuln platform across **Render.com** and **VPS** deployments using the `/api/health` endpoint and free external uptime monitoring tools like [UptimeRobot](https://uptimerobot.com).

---

## 1. The `/api/health` Endpoint

The backend provides a deep system health check endpoint at `/api/health`. Unlike standard static ping endpoints, this endpoint performs live verification of critical downstream dependencies:

1. **PostgreSQL Database**: Executes a `SELECT 1` query to verify active connection pooling, authentication, and query responsiveness.
2. **Redis Message Queue & Cache**: Issues an async `PING` command to verify Redis socket availability and round-trip responsiveness.

### Response Specifications

- **Healthy Status (`200 OK`)**:
  Returned when both PostgreSQL and Redis are responsive:
  ```json
  {
    "status": "healthy",
    "service": "EthioVuln API",
    "version": "1.0.0",
    "environment": "production",
    "timestamp": "2026-10-24T16:10:00.000000Z",
    "components": {
      "database": {
        "status": "connected",
        "latency_ms": 1.45
      },
      "redis": {
        "status": "connected",
        "latency_ms": 0.82
      }
    }
  }
  ```

- **Unhealthy / Degraded Status (`503 Service Unavailable`)**:
  Returned automatically if either the database or Redis connection times out or fails:
  ```json
  {
    "status": "unhealthy",
    "service": "EthioVuln API",
    "version": "1.0.0",
    "environment": "production",
    "timestamp": "2026-10-24T16:10:00.000000Z",
    "components": {
      "database": {
        "status": "connected",
        "latency_ms": 1.20
      },
      "redis": {
        "status": "error",
        "error": "Error connecting to Redis: Connection refused"
      }
    }
  }
  ```

---

## 2. Monitor Targets

| Target Environment | Service | Monitor URL |
|---|---|---|
| **Render Cloud** | Backend API | `https://ethiovuln-backend.onrender.com/api/health` |
| **Render Cloud** | Frontend Web | `https://ethiovuln-frontend.onrender.com/` |
| **VPS (Docker)** | Backend API | `https://<YOUR_VPS_DOMAIN>/api/health` *(or `http://<VPS_IP>:8000/api/health`)* |
| **VPS (Docker)** | Frontend Web | `https://<YOUR_VPS_DOMAIN>/` *(or `http://<VPS_IP>:3000/`)* |

---

## 3. Setting Up UptimeRobot (Free Tier)

UptimeRobot provides 50 free monitors with 5-minute check intervals and instant email/webhook alerts.

### Step 1: Create an Account
1. Visit [https://uptimerobot.com](https://uptimerobot.com) and create a free account.
2. Verify your email address.

### Step 2: Add Backend Monitor
1. On your UptimeRobot Dashboard, click **+ Add New Monitor**.
2. Configure the monitor fields:
   - **Monitor Type**: Select `HTTP(s)`.
   - **Friendly Name**: `EthioVuln Backend Health (Render)` (or `EthioVuln Backend (VPS)`).
   - **URL (or IP)**: `https://ethiovuln-backend.onrender.com/api/health` (or your VPS endpoint).
   - **Monitoring Interval**: `5 minutes` (1 minute on Pro plans).
   - **Monitor Timeout**: `30 seconds`.
3. *(Optional - Keyword Verification)*:
   - If using **Keyword** monitor type instead of standard HTTP:
     - Set **Keyword**: `"status": "healthy"`.
     - Set **Alert when**: `Keyword Not Exists`.
4. Under **"Select Alert Contacts To Notify"**, check your email address.
5. Click **Create Monitor**.

### Step 3: Add Frontend Monitor
1. Click **+ Add New Monitor**.
2. Select **Monitor Type**: `HTTP(s)`.
3. **Friendly Name**: `EthioVuln Frontend Dashboard`.
4. **URL**: `https://ethiovuln-frontend.onrender.com/` (or your VPS URL).
5. **Monitoring Interval**: `5 minutes`.
6. Click **Create Monitor**.

---

## 4. Configuring Alert Channels

To ensure your team is notified immediately when an incident occurs:

- **Discord**:
  1. In Discord, navigate to your server channel settings -> **Integrations** -> **Webhooks** -> **New Webhook**. Copy the Webhook URL.
  2. In UptimeRobot, go to **My Settings** -> **Alert Contacts** -> **Add Alert Contact**.
  3. Select **Discord** and paste the Webhook URL.
- **Telegram / Slack / Microsoft Teams**:
  - Add via **Alert Contacts** in UptimeRobot settings.
- **Mobile Push Notifications**:
  - Download the official **UptimeRobot Mobile App** (iOS / Android) and log in to receive instant push alerts.

---

## 5. Render Free-Tier Sleeping Prevention

> [!NOTE]
> Render free web services spin down after 15 minutes of inactivity. Pinging `/api/health` every 5 or 10 minutes via UptimeRobot keeps the backend active and eliminates cold starts for users.

---

## 6. How to Test and Simulate Downtime

To verify your alerting pipeline is working:

1. **Simulate 503 Service Unavailable**:
   On your VPS, temporarily pause the Redis container:
   ```bash
   docker stop dast_redis
   ```
2. Query `/api/health`:
   ```bash
   curl -i https://<YOUR_ENDPOINT>/api/health
   ```
   Observe that it returns `HTTP/1.1 503 Service Unavailable`.
3. Within 5 minutes, UptimeRobot will trigger a **"Down"** notification to your configured channels.
4. Restore the service:
   ```bash
   docker start dast_redis
   ```
5. Confirm UptimeRobot detects recovery and sends a **"Service Restored (UP)"** alert.
