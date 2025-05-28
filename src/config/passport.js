const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

const setupPassport = () => {
  console.log('Setting up Google OAuth with:');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Google OAuth callback received profile:', {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
        });
        return done(null, profile);
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user.id);
    done(null, user);
  });
};

module.exports = setupPassport; 