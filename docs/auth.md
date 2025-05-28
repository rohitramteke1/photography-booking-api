# 🔐 Auth Routes

Base Path: `/api/auth`

## Endpoints

### POST `/register`
Registers a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
- 201 Created with user info and token

---

### POST `/login`
Logs in a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
- 200 OK with token and user info

---

### GET `/logout`
Logs out the user (if using sessions or token invalidation).

---

### GET `/me` *(Protected)*
Returns logged-in user info.

---

### PUT `/change-password` *(Protected)*
Change user password.

**Request Body:**
```json
{
  "currentPassword": "old",
  "newPassword": "new"
}
```

---

### PUT `/profile` *(Protected)*
Update profile info (name, etc).

---

### DELETE `/delete` *(Protected)*
Delete user account.

---

### GET `/google` and `/google/callback`
Handles Google OAuth login.
