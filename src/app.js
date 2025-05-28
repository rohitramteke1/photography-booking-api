// src/app.js
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const errorHandler = require('./middleware/error.middleware');


// Route imports (descriptive names)
const authRoutes = require('./routes/auth.route');
const serviceRoutes = require('./routes/services.route');
const additionalServiceRoutes = require('./routes/additionalServices');
const bookingRoutes = require('./routes/bookings.route');
const adminRoutes = require('./routes/admin.route');
// const photographerRoutes = require('./routes/photographers');
const photographyServiceRoutes = require('./routes/admin/photographyService.route');

const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs', 'swagger.json'), 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Middleware
app.use(express.json());
app.use(cookieParser());
require('./config/google.strategy');
app.use(passport.initialize());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// app.use(passport.initialize()); // Uncomment if using Passport

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/additional-services', additionalServiceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/photographers', photographerRoutes);

app.use('/api/photography-services', photographyServiceRoutes);

// Basic API status route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
