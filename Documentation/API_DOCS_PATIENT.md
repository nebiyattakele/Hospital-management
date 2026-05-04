# API Documentation - Patient Role

This document outlines the API endpoints available for the **Patient** role.

## 1. Authentication & Profile

### Register Patient
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
- **Response (201 Created)**:
```json
{
  "_id": "60d5ecb3",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Patient",
  "token": "eyJhbGciOiJIUzI1..."
}
```

### Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
- **Response (200 OK)**:
```json
{
  "_id": "60d5ecb3",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Patient",
  "token": "eyJhbGciOiJIUzI1..."
}
```

### Get Profile
- **Endpoint**: `GET /api/auth/profile`
- **Access**: Private (Patient Token Required)
- **Response (200 OK)**:
```json
{
  "_id": "60d5ecb3",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Patient",
  "age": 30,
  "gender": "Male",
  "address": "123 Main St",
  "profilePicture": "url_to_image"
}
```

### Update Profile
- **Endpoint**: `PUT /api/auth/profile`
- **Access**: Private (Patient Token Required)
- **Request Body**:
```json
{
  "name": "John Updated",
  "age": 31,
  "address": "456 New St"
}
```
- **Response (200 OK)**:
```json
{
  "_id": "60d5ecb3",
  "name": "John Updated",
  "email": "john@example.com",
  "role": "Patient",
  "age": 31,
  "gender": "Male",
  "address": "456 New St",
  "token": "eyJhbGciOiJIUzI1..."
}
```

### Password Recovery
- **Forgot Password**: `POST /api/auth/forgot-password`
  - **Body**: `{ "email": "john@example.com" }`
  - **Response**: `{ "message": "Password reset link sent to your email" }`
- **Reset Password**: `POST /api/auth/reset-password`
  - **Body**: `{ "email": "john@example.com", "newPassword": "newsecurepassword123" }`
  - **Response**: `{ "message": "Password reset successfully" }`

## 2. Patient Dashboard

### Get Dashboard Data
- **Endpoint**: `GET /api/dashboard/patient`
- **Access**: Private (Patient Token Required)
- **Response (200 OK)**:
```json
{
  "latestAppointment": {
    "_id": "70d5ecb3",
    "date": "2024-05-10T00:00:00Z",
    "time": "10:00 AM",
    "doctorId": {
      "name": "Dr. Smith",
      "specialty": "Cardiology"
    }
  },
  "recentAppointments": [...],
  "topSpecialists": [...]
}
```

## 3. Finding Doctors

### List All Doctors
- **Endpoint**: `GET /api/doctors`
- **Query Params**: `?specialty=cardiology` (Optional)
- **Response (200 OK)**:
```json
[
  {
    "_id": "80d5ecb3",
    "name": "Dr. Smith",
    "specialty": "Cardiology",
    "rating": 4.8
  }
]
```

### Get Doctor Details
- **Endpoint**: `GET /api/doctors/:id`
- **Response (200 OK)**:
```json
{
  "_id": "80d5ecb3",
  "name": "Dr. Smith",
  "specialty": "Cardiology",
  "availability": [
    { "day": "Monday", "slots": ["09:00 AM", "10:00 AM"] }
  ],
  "contactNumber": "+123456789"
}
```

## 4. Appointment Management

### Book Appointment
- **Endpoint**: `POST /api/appointments`
- **Request Body**:
```json
{
  "doctorId": "80d5ecb3",
  "date": "2024-05-15",
  "time": "11:00 AM"
}
```
- **Response (201 Created)**:
```json
{
  "_id": "90d5ecb3",
  "patientId": "60d5ecb3",
  "doctorId": "80d5ecb3",
  "date": "2024-05-15T00:00:00Z",
  "time": "11:00 AM",
  "status": "Booked"
}
```

### Fetch My Appointments
- **Endpoint**: `GET /api/appointments`
- **Query Params**: `?filter=upcoming` | `?filter=past`
- **Response (200 OK)**:
```json
[
  {
    "_id": "90d5ecb3",
    "date": "2024-05-15T00:00:00Z",
    "status": "Booked",
    "doctorId": { "name": "Dr. Smith" }
  }
]
```

### Cancel Appointment
- **Endpoint**: `PUT /api/appointments/:id/cancel`
- **Response**: `{ "_id": "...", "status": "Cancelled" }`

## 5. Notifications

### Get Notifications
- **Endpoint**: `GET /api/notifications`
- **Response (200 OK)**:
```json
[
  {
    "_id": "10d5ecb3",
    "message": "Your appointment on May 10 was accepted",
    "isRead": false,
    "createdAt": "2024-05-01T..."
  }
]

