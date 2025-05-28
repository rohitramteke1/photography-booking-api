# 👤 User Roles & Access Control

## Roles
- `user`: Can book services and view personal history
- `admin`: Can manage users, bookings, services, analytics

## Middleware
- `protect`: Validates JWT
- `authorize("admin")`: Allows only admins