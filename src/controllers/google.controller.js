const { generateToken } = require('../utils/jwt');

const googleAuthRedirect = (req, res) => {
    try {
        console.log('🔁 Google callback received:', req.user);

        // Check if user or email is missing
        if (!req.user || !req.user.email) {
            console.error('❌ Missing email in Google profile:', req.user);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=No email found`);
        }

        // Everything's fine → Generate token
        const token = generateToken(req.user);
        const redirectUrl = `${process.env.FRONTEND_GOOGLE_SUCCESS_URL}?token=${token}`;
        return res.redirect(redirectUrl);
    } catch (err) {
        console.error('❌ Google login error:', err.message);
        return res.status(500).json({ error: 'Failed to process Google login' });
    }
};

module.exports = { googleAuthRedirect };
