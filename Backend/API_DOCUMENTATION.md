# Hospital Appointment Booking System - API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Routes

### Register a Patient
*   **Endpoint:** `POST /auth/register`
*   **Access:** Public
*   **Description:** Registers a new patient. The role is automatically set to `Patient`.
*   **Body Request (JSON):**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response (201 Created):** Returns user details along with a JWT Token.

### Login User
*   **Endpoint:** `POST /auth/login`
*   **Access:** Public
*   **Description:** Authenticates a user (Patient, Doctor, or Admin) and returns a JWT token.
*   **Body Request (JSON):**
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response (200 OK):** Returns user details and `token`.

---

## 2. Doctor Routes

### Create a Doctor
*   **Endpoint:** `POST /doctors`
*   **Access:** Private (Admin Only)
*   **Headers:** `Authorization: Bearer <Admin_JWT_Token>`
*   **Description:** Creates a new doctor profile.
*   **Body Request (JSON):**
    ```json
    {
      "name": "Dr. Smith",
      "email": "smith@hospital.com",
      "password": "password123",
      "specialty": "Cardiology",
      "contactNumber": "123-456-7890"
    }
    ```
*   **Response (201 Created):** Returns the doctor details.

### Get All Doctors
*   **Endpoint:** `GET /doctors`
*   **Access:** Public
*   **Description:** Retrieves a list of all doctors. Can optionally filter by specialty.
*   **Query Parameters:**
    *   `specialty` (optional): Filter doctors by specialty (e.g., `GET /doctors?specialty=Cardiology`).
*   **Response (200 OK):** Array of doctor objects (passwords excluded).

---

## 3. Appointment Routes

### Book an Appointment
*   **Endpoint:** `POST /appointments`
*   **Access:** Private (Patient Only)
*   **Headers:** `Authorization: Bearer <Patient_JWT_Token>`
*   **Description:** Books a new appointment with a specific doctor.
*   **Body Request (JSON):**
    ```json
    {
      "doctorId": "60d0fe4f5311236168a109ca",
      "date": "2024-12-01",
      "time": "10:00 AM"
    }
    ```
*   **Validation Rules:**
    *   Cannot book past dates.
    *   System checks for existing appointments to prevent double-booking for the same doctor, date, and time.
*   **Response (201 Created):** Returns the booked appointment details.

### Get Appointments
*   **Endpoint:** `GET /appointments`
*   **Access:** Private (Logged-in Patient or Doctor)
*   **Headers:** `Authorization: Bearer <JWT_Token>`
*   **Description:** 
    *   If accessed by a **Patient**, returns all their booked appointments.
    *   If accessed by a **Doctor**, returns all appointments assigned to them.
*   **Query Parameters:**
    *   `filter` (optional): Filter history. Values: `upcoming` or `past`. (e.g., `GET /appointments?filter=upcoming`)
*   **Response (200 OK):** Array of populated appointment objects.

### Cancel Appointment
*   **Endpoint:** `PUT /appointments/:id/cancel`
*   **Access:** Private (Patient Only)
*   **Headers:** `Authorization: Bearer <Patient_JWT_Token>`
*   **Description:** Updates the status of a specific appointment to `Cancelled`.
*   **Security:** Patients can only cancel their *own* appointments.
*   **Response (200 OK):** Returns the updated appointment object.

### Update Appointment Status / Add Notes
*   **Endpoint:** `PUT /appointments/:id/status`
*   **Access:** Private (Doctor Only)
*   **Headers:** `Authorization: Bearer <Doctor_JWT_Token>`
*   **Description:** Updates the status (`Booked`, `Completed`, `Cancelled`) and/or adds medical notes to an appointment.
*   **Security:** Doctors can only update appointments assigned to them.
*   **Body Request (JSON):**
    ```json
    {
      "status": "Completed",
      "notes": "Patient is healthy. Recommended daily exercise."
    }
    ```
*   **Response (200 OK):** Returns the updated appointment object.
