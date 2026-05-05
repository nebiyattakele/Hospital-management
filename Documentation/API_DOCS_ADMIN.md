# API Documentation - Admin Role

This document outlines the API endpoints available for the **Hospital Admin** role.

## 1. Admin Dashboard

### Get System Overview
- **Endpoint**: `GET /api/dashboard/admin`
- **Access**: Private (Admin Token Required)
- **Response (200 OK)**:
```json
{
  "recentDoctors": [
    {
      "name": "Dr. Alice",
      "email": "alice@hospital.com",
      "specialty": "Neurology",
      "createdAt": "2024-05-01T..."
    }
  ],
  "totalDoctors": 15,
  "totalPatients": 120,
  "totalAppointments": 450
}
```

## 2. Doctor Management (CRUD)

### Create New Doctor
- **Endpoint**: `POST /api/doctors`
- **Access**: Private (Admin Token Required)
- **Request Body**:
```json
{
  "name": "Dr. Bob",
  "email": "bob@hospital.com",
  "password": "doctorpassword123",
  "specialty": "Pediatrics",
  "contactNumber": "+1987654321"
}
```
- **Response (201 Created)**:
```json
{
  "_id": "30d5ecb3",
  "name": "Dr. Bob",
  "email": "bob@hospital.com",
  "role": "Doctor",
  "specialty": "Pediatrics"
}
```

### Edit Doctor
- **Endpoint**: `PUT /api/doctors/:id`
- **Access**: Private (Admin Token Required)
- **Request Body**:
```json
{
  "specialty": "Senior Pediatrics",
  "contactNumber": "+1122334455"
}
```
- **Response (200 OK)**:
```json
{
  "_id": "30d5ecb3",
  "name": "Dr. Bob",
  "specialty": "Senior Pediatrics",
  "contactNumber": "+1122334455"
}
```

### Delete Doctor
- **Endpoint**: `DELETE /api/doctors/:id`
- **Access**: Private (Admin Token Required)
- **Response (200 OK)**:
```json
{
  "message": "Doctor removed"
}
```

## 3. General Management

### System Metrics
Admins can monitor system usage through the `GET /api/dashboard/admin` endpoint which provides real-time counts of users and appointments.
