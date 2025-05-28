// config/admin.config.js

// Always use environment variables for admin config in production!
// Never commit real passwords to your repository.

// Admin emails and passwords loaded from .env or fallback to defaults (for local/dev only)
const ADMIN_CONFIG = [
    {
        email: process.env.ADMIN_EMAIL_1 || '20220801046@dypiu.ac.in',
        password: process.env.ADMIN_PASSWORD_1 || 'Pravin!@1046'
    },
    {
        email: process.env.ADMIN_EMAIL_2 || '20220801082@dypiu.ac.in',
        password: process.env.ADMIN_PASSWORD_2 || 'Nikhil!@1082'
    },
    {
        email: process.env.ADMIN_EMAIL_3 || '20220801110@dypiu.ac.in',
        password: process.env.ADMIN_PASSWORD_3 || 'Shiv!@1110'
    }
];

// Lowercase for quick lookup
const ADMIN_EMAILS = ADMIN_CONFIG.map(admin => admin.email.toLowerCase());

// Validate credentials
const validateAdminCredentials = (email, password) => {
    const admin = ADMIN_CONFIG.find(
        admin => admin.email.toLowerCase() === email.toLowerCase()
    );
    return admin && admin.password === password;
};

module.exports = {
    ADMIN_CONFIG,
    ADMIN_EMAILS,
    validateAdminCredentials
};
