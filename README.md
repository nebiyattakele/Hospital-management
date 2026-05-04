# 🏥 Hospital Appointment Booking System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

A full-stack hospital management platform that enables patients to book appointments, doctors to manage their schedules, and admins to oversee the entire system — including an **emergency blood request** module with location-aware donor notifications.

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Run with Docker](#run-with-docker)
  - [Run Locally](#run-locally)
- [API Overview](#-api-overview)
  - [Authentication](#authentication)
  - [Patient Endpoints](#patient-endpoints)
  - [Doctor Endpoints](#doctor-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [Roles & Access Control](#-roles--access-control)
- [Blood Bank Module](#-blood-bank-module)
- [Contributing](#-contributing)

---

## ✨ Features

### 👤 Patient
- Register, login, and manage personal profile
- Browse and filter doctors by specialty
- Book, view, and cancel appointments
- Real-time notifications (appointment accepted/rejected)
- Password recovery via email

### 🩺 Doctor
- Manage professional profile and availability slots
- View assigned appointments (today / upcoming)
- Accept or reject appointments with notes
- Dashboard with appointment statistics

### 🛡️ Admin
- Full CRUD management of doctor accounts
- System-wide dashboard (total doctors, patients, appointments)
- Blood bank inventory management
- Emergency blood request creation and fulfillment
- Location-aware donor notifications

### 🩸 Blood Bank
- Create and manage emergency blood requests
- Automatic inventory deduction on fulfillment
- Donor matching by blood type and location
- Status lifecycle: `Pending → Fulfilled / Rejected`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express.js v5 |
| **Database** | MongoDB + Mongoose |
| **Frontend** | React 19, React Router v7, Vite |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **Containerization** | Docker, Docker Compose |
| **Architecture** | Clean Architecture (Domain → Use Case → Repository → Controller) |

---

## 🏗 Architecture

The backend follows **Clean Architecture** principles, separating concerns into distinct layers:

```
┌──────────────────────────────────────┐
│            Routes / Controllers       │  ← HTTP layer
├──────────────────────────────────────┤
│               Use Cases               │  ← Business logic
├──────────────────────────────────────┤
│              Repositories             │  ← Data access abstraction
├──────────────────────────────────────┤
│         Domain Models (Entities)      │  ← Core business objects
├──────────────────────────────────────┤
│         Infrastructure (MongoDB)      │  ← DB implementation
└──────────────────────────────────────┘
```

---

## 📁 Project Structure

```
task-management/
├── Backend/
│   ├── src/
│   │   ├── config/          # DB connection & environment config
│   │   ├── domain/          # Core entities (User, Appointment, etc.)
│   │   ├── usecase/         # Business logic (book appointment, create doctor...)
│   │   ├── repository/      # Data access layer (Mongoose implementations)
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── routes/          # Express route definitions
│   │   ├── middlewares/     # Auth middleware, error handlers
│   │   └── infrastructure/  # External service integrations
│   ├── seedAdmin.js         # Script to seed initial admin user
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── Frontend/
    ├── src/                 # React components, pages, hooks
    ├── public/
    ├── index.html
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose (for containerized setup)
- [MongoDB](https://www.mongodb.com/) (if running locally without Docker)

### Environment Variables

Create a `.env` file inside `Backend/`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/hospital-appointments
JWT_SECRET=your_super_secret_key
```

### Run with Docker

The easiest way to get the backend and MongoDB running together:

```bash
cd Backend
docker-compose up --build
```

The API will be available at `http://localhost:5001`.

### Run Locally

#### Backend

```bash
cd Backend
npm install
node seedAdmin.js      # Seed the initial admin account
npm run dev            # Starts with nodemon on port 5001
```

#### Frontend

```bash
cd Frontend
npm install
npm run dev            # Starts Vite dev server
```

---

## 📡 API Overview

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new patient |
| `POST` | `/api/auth/login` | Public | Login (all roles) |
| `GET` | `/api/auth/profile` | Private | Get logged-in user profile |
| `PUT` | `/api/auth/profile` | Private | Update profile |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset link |
| `POST` | `/api/auth/reset-password` | Public | Reset password with token |

---

### Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/patient` | Get patient dashboard data |
| `GET` | `/api/doctors` | List all doctors (`?specialty=cardiology`) |
| `GET` | `/api/doctors/:id` | Get doctor details & availability |
| `POST` | `/api/appointments` | Book a new appointment |
| `GET` | `/api/appointments` | Fetch appointments (`?filter=upcoming\|past`) |
| `PUT` | `/api/appointments/:id/cancel` | Cancel an appointment |
| `GET` | `/api/notifications` | Get notifications |

<details>
<summary><b>📄 Example: Book Appointment</b></summary>

**Request**
```json
POST /api/appointments
{
  "doctorId": "80d5ecb3",
  "date": "2024-05-15",
  "time": "11:00 AM"
}
```
**Response `201 Created`**
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
</details>

---

### Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/doctor` | Get doctor dashboard stats |
| `GET` | `/api/appointments` | Fetch assigned appointments (`?filter=today\|upcoming`) |
| `PUT` | `/api/appointments/:id/status` | Accept or reject an appointment |
| `GET` | `/api/notifications` | Get system alerts |

<details>
<summary><b>📄 Example: Accept/Reject Appointment</b></summary>

**Request**
```json
PUT /api/appointments/:id/status
{
  "status": "Accepted",
  "notes": "Please bring your previous medical reports."
}
```
**Response `200 OK`**
```json
{
  "_id": "90d5ecb3",
  "status": "Accepted",
  "notes": "Please bring your previous medical reports.",
  "patientId": "60d5ecb3"
}
```
</details>

---

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/admin` | System-wide stats (doctors, patients, appointments) |
| `POST` | `/api/doctors` | Create a new doctor account |
| `PUT` | `/api/doctors/:id` | Edit doctor details |
| `DELETE` | `/api/doctors/:id` | Remove a doctor |

<details>
<summary><b>📄 Example: Create Doctor</b></summary>

**Request**
```json
POST /api/doctors
{
  "name": "Dr. Bob",
  "email": "bob@hospital.com",
  "password": "doctorpassword123",
  "specialty": "Pediatrics",
  "contactNumber": "+1987654321"
}
```
**Response `201 Created`**
```json
{
  "_id": "30d5ecb3",
  "name": "Dr. Bob",
  "email": "bob@hospital.com",
  "role": "Doctor",
  "specialty": "Pediatrics"
}
```
</details>

---

## 🔐 Roles & Access Control

| Role | Token Required | Capabilities |
|------|---------------|--------------|
| **Patient** | ✅ | Book appointments, view doctors, manage own profile |
| **Doctor** | ✅ | View & respond to assigned appointments, update availability |
| **Admin** | ✅ | Manage doctors, view system metrics, manage blood bank |

---

## 🩸 Blood Bank Module

The system includes a dedicated blood bank module that enables hospitals to manage emergency blood requests with intelligent donor matching.

**Key behaviors:**
- ✅ Blood inventory is **automatically deducted** when a request is fulfilled
- ✅ Admins **cannot fulfill** a request if stock is insufficient
- ✅ Once a request is `Fulfilled`, its status **cannot be changed**
- ✅ Donors are matched by **blood type + location** for targeted emergency notifications

**Request Status Flow:**
```
Pending ──► Fulfilled
   │
   └──────► Rejected  (only if still Pending)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

<div align="center">
  Built with ❤️ by the AASTU STSE Team · 2026
</div>
