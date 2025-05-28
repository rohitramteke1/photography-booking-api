const userService = require('../models/user.model'); // Now using service functions!
const { ADMIN_EMAILS, ADMIN_CONFIG } = require('../config/admin.config');
const { sendAdminAccessEmail } = require('../utils/emailSender');
const jwt = require('jsonwebtoken'); // Assuming you use this for JWT
const { v4: uuidv4 } = require("uuid");

// @desc    Process Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res, next) => {
  try {
    console.log('Google callback received:', req.user);

    // The user info will be available in req.user from passport
    const { id: googleId, displayName, emails, photos } = req.user;

    if (!emails || emails.length === 0) {
      console.error('No email found in Google profile');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=No email found`);
    }

    const email = emails[0].value;
    console.log('Processing Google login for email:', email);

    // Check if email is in admin whitelist
    const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());

    // Check if user already exists by googleId (custom logic, since no googleId-index in DynamoDB by default)
    let user = await userService.findUserByEmail(email);

    if (!user) {
      // Create new user (we'll use only name and email for now)
      user = {
        id: uuidv4(),
        name: displayName,
        email,
        googleId,
        profilePicture: (photos && photos.length > 0) ? photos[0].value : 'default-profile.jpg',
        role: isAdminEmail ? 'admin' : 'user',
      };
      await userService.createUser(user);
      console.log('Created new user');
    } else {
      // If user exists but no googleId, update with googleId and profilePicture
      const updates = {};
      if (!user.googleId) updates.googleId = googleId;
      if (photos && photos.length > 0 && user.profilePicture !== photos[0].value) {
        updates.profilePicture = photos[0].value;
      }
      if (isAdminEmail && user.role !== 'admin') {
        updates.role = 'admin';
      }
      if (Object.keys(updates).length > 0) {
        user = await userService.updateUserProfile(user.id, updates);
        console.log('Updated user with Google info');
      }
    }

    // JWT Token creation
    // If you don't store password, sign JWT with user.id and user.email only
    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
    console.log('Generated JWT token');

    // Cookie options
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days (or use JWT_EXPIRE)
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };

    // Determine redirect URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    let redirectUrl = `${frontendUrl}/dashboard`;
    if (user.role === 'admin') {
      const adminConfig = ADMIN_CONFIG.find(admin => 
        admin.email.toLowerCase() === email.toLowerCase()
      );
      if (adminConfig) {
        redirectUrl = `${frontendUrl}/admin/verify`;
        console.log('Redirecting admin to verify page');
      }
    }
    console.log('Final redirect URL:', redirectUrl);

    // Set token in cookie and redirect
    res
      .cookie('token', token, options)
      .redirect(redirectUrl);

  } catch (err) {
    console.error('Google OAuth error:', err);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=Authentication failed`);
  }
};
