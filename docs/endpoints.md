# API Endpoints

## Auth
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user

## Photographers
- `GET /api/photographers` - List all photographers
- `GET /api/photographers/:id` - Get photographer by ID
- `POST /api/photographers` - Create photographer
- `PUT /api/photographers/:id` - Update photographer
- `DELETE /api/photographers/:id` - Delete photographer

## Photography Services
- `GET /api/services` - List all photography services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## Additional Services
- `GET /api/additional-services` - List all additional services
- `GET /api/additional-services/:id` - Get service by ID
- `POST /api/additional-services` - Create new additional service
- `PUT /api/additional-services/:id` - Update additional service
- `DELETE /api/additional-services/:id` - Delete additional service

## Bookings
- `GET /api/bookings` - Get logged-in user's bookings
- `POST /api/bookings/calculate` - Calculate price before booking
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/status` - Admin: update booking status

## Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/analytics/bookings` - Booking analytics
- `GET /api/admin/analytics/revenue` - Revenue analytics