# BayouWatch API Contract

**Base URL:** `http://localhost:8000`

---

## Authentication

**Public endpoints:** No auth required  
**Protected endpoints:** Include header: `Authorization: Bearer {token}`

Get token from login endpoint. Token expires after 30 minutes.

---

## Public Endpoints

### POST /api/auth/register
Create new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "created_at": "2024-11-01T14:30:00Z"
}
```

---

### POST /api/auth/login
Login and receive access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Save the access_token for authenticated requests.**

---

### GET /api/reports
Get all approved flood reports (public for safety).

**Query params:** `skip` (default: 0), `limit` (default: 100)

**Response (200):**
```json
{
  "reports": [
    {
      "id": 1,
      "user_id": 1,
      "latitude": 30.4515,
      "longitude": -91.1871,
      "severity": "moderate",
      "description": "Water rising on Highland Road near LSU",
      "photo_url": "https://example.com/photos/report1.jpg",
      "status": "approved",
      "created_at": "2024-11-01T14:30:00Z"
    }
  ]
}
```

**Use lat/lng for map markers. Severity determines color: minor=green, moderate=orange, severe=red.**

---

### GET /api/alerts
Get official flood alerts from authorities.

**Query params:** `skip`, `limit`

**Response (200):**
```json
{
  "alerts": [
    {
      "id": 1,
      "title": "Flash Flood Warning",
      "description": "Heavy rainfall expected in East Baton Rouge Parish.",
      "severity": "severe",
      "area_affected": "East Baton Rouge Parish",
      "issued_at": "2024-11-01T12:00:00Z",
      "expires_at": "2024-11-01T20:00:00Z",
      "is_active": 1
    }
  ]
}
```

---

## Protected Endpoints

**All require:** `Authorization: Bearer {token}` header

---

### POST /api/reports
Submit new flood report (requires login to prevent spam).

**Request:**
```json
{
  "latitude": 30.4515,
  "longitude": -91.1871,
  "severity": "moderate",
  "description": "Water rising on Highland Road",
  "photo_url": null
}
```

**Note:** `photo_url` optional. File upload coming in Sprint 2.

**Response (201):**
```json
{
  "id": 3,
  "user_id": 1,
  "latitude": 30.4515,
  "longitude": -91.1871,
  "severity": "moderate",
  "description": "Water rising on Highland Road",
  "photo_url": null,
  "status": "pending",
  "created_at": "2024-11-01T16:00:00Z"
}
```

**New reports start as "pending" - not visible until approved.**

---

### GET /api/users/me
Get current user's profile.

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "created_at": "2024-10-15T10:00:00Z"
}
```

---

### PUT /api/users/me
Update current user's profile.

**Request (both fields optional):**
```json
{
  "username": "johnsmith",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "username": "johnsmith",
  "created_at": "2024-10-15T10:00:00Z"
}
```

---

## Data Types

**Severity:** `"minor"`, `"moderate"`, `"severe"`  
**Status:** `"pending"`, `"approved"`, `"rejected"`

---

## Common Errors

**401 Unauthorized** - Missing/invalid/expired token. Login again.  
**400 Bad Request** - Check request format matches examples. Read error `detail` message.  
**404 Not Found** - Resource doesn't exist.

---

## Quick Start

**Test the API:**
- Auto-docs: http://localhost:8000/docs
- Health check: http://localhost:8000

**Auth flow:**
1. Login → get token
2. Save token (localStorage)
3. Include in headers: `Authorization: Bearer {token}`

**Questions?** Message in Discord or ask Adam