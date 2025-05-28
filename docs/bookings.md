# 📅 Booking Routes

Base Path: `/api/bookings`

## User Routes

### POST `/calculate` *(Protected)*
Calculate booking price based on service type, duration, and extras.

---

### POST `/` *(Protected)*
Create a new booking.

**Request Body:**
```json
{
  "serviceId": "123",
  "photographerId": "456",
  "date": "2025-06-01T10:00:00Z"
}
```

---

### GET `/` *(Protected)*
Get all bookings of the logged-in user.

---

### GET `/:id` *(Protected)*
Get a specific booking.

---

### PUT `/:id` *(Protected)*
Update an existing booking.

---

### PUT `/:id/cancel` *(Protected)*
Cancel a booking.

---

## Admin Routes

### GET `/admin/all` *(Admin only)*
Get all bookings in the system.

---

### PUT `/:id/status` *(Admin only)*
Update booking status (e.g., confirmed, completed).
