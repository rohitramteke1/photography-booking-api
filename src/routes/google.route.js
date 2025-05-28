const express = require('express');
const passport = require('passport');
const { googleAuthRedirect } = require('../controllers/google.controller');

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleAuthRedirect
);

module.exports = router;
