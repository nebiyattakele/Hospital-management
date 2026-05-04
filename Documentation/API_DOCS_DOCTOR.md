# API Documentation - Doctor Role

This document outlines the API endpoints available for the **Doctor** role.

## 1. Profile Management

### Get Profile
- **Endpoint**: `GET /api/auth/profile`
- **Access**: Private (Doctor Token Required)
- **Response (200 OK)**:
```json
{
  "_id": "80d5ecb3",
  "name": "Dr. Smith",
  "email": "smith@hospital.com",
  "role": "Doctor",
  "specialty": "Cardiology",
  "contactNumber": "+123456789",
  "availability": [
    { "day": "Monday", "slots": ["09:00 AM", "10:00 AM"] }
  ]
}
```

### Update Professional Profile
- **Endpoint**: `PUT /api/auth/profile`
- **Access**: Private (Doctor Token Required)
- **Request Body**:
```json
{
  "specialty": "Advanced Cardiology",
  "availability": [
    { "day": "Tuesday", "slots": ["02:00 PM", "03:00 PM"] }
  ]
}
```
- **Response (200 OK)**:
```json
{
  "_id": "80d5ecb3",
  "name": "Dr. Smith",
  "role": "Doctor",
  "specialty": "Advanced Cardiology",
  "availability": [...]
}
```

## 2. Doctor Dashboard

### Get Dashboard Stats
- **Endpoint**: `GET /api/dashboard/doctor`
- **Access**: Private (Doctor Token Required)
- **Response (200 OK)**:
```json
{
  "totalAppointments": 45,
  "upcomingAppointmentsCount": 8,
  "recentAppointments": [
    {
      "_id": "90d5ecb3",
      "date": "2024-05-15T...",
      "patientId": { "name": "John Doe", "email": "john@example.com" }
    }
  ]
}
```

## 3. Appointment Management

### Fetch Assigned Appointments
- **Endpoint**: `GET /api/appointments`
- **Query Params**: `?filter=today` | `?filter=upcoming`
- **Response (200 OK)**:
```json
[
  {
    "_id": "90d5ecb3",
    "date": "2024-05-15T...",
    "status": "Booked",
    "patientId": { "name": "John Doe" }
  }
]
```

### Update Appointment Status (Accept/Reject)
- **Endpoint**: `PUT /api/appointments/:id/status`
- **Request Body**:
```json
{
  "status": "Accepted",
  "notes": "Please bring your previous medical reports."
}
```
- **Response (200 OK)**:
```json
{
  "_id": "90d5ecb3",
  "status": "Accepted",
  "notes": "Please bring your previous medical reports.",
  "patientId": "60d5ecb3"
}
```

## 4. Notifications

### Get System Alerts
- **Endpoint**: `GET /api/notifications`
- **Response (200 OK)**:
```json
[
  {
    "_id": "20d5ecb3",
    "message": "New appointment booked by John Doe",
    "isRead": false
  }
]
```
