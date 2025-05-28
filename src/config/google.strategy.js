const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { findOrCreateUserByGoogle } = require('../services/user.service');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Log full profile to check what's returned
    console.log('🔍 Full Google profile:', profile);

    const email = profile?.emails?.[0]?.value;

    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }

    const name = profile.displayName;
    const googleId = profile.id;

    const user = await findOrCreateUserByGoogle({ email, name, googleId });
    done(null, user);
  } catch (error) {
    console.error('❌ Google strategy error:', error);
    done(error, false);
  }
}));
