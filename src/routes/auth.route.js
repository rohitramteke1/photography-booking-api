const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  logout,
  getMe,
  changePassword,
  updateProfile,
  deleteAccount
} = require('../controllers/auth.controller');

const { googleAuthRedirect } = require('../controllers/google.controller'); // ✅ new controller
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// 🔐 Regular auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/profile', protect, updateProfile);
router.delete('/delete', protect, deleteAccount);

// 🌐 Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    accessType: 'offline',
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=Google authentication failed`,
    session: false,
  }),
  googleAuthRedirect
);

module.exports = router;
