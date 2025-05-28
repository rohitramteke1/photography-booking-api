# 📸 Photographers Routes

Base Path: `/api/photographers`

## Endpoints

### GET `/`
Fetch all photographers available for bookings.

---

### GET `/:id`
Get details of a specific photographer.

---

### POST `/` *(Admin only)*
Add a new photographer to the system.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "experience": "5 years",
  "specialties": ["wedding", "portrait"]
}
```

---

### PUT `/:id` *(Admin only)*
Update photographer information.

---

### DELETE `/:id` *(Admin only)*
Remove photographer from the system.
