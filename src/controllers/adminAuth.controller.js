const { v4: uuidv4 } = require('uuid');
const { findUserByEmail, createUser, updateUserProfile } = require('../models/user.model');
const { validateAdminCredentials } = require('../config/admin.config');
const jwt = require('jsonwebtoken');

// ----------------------------------
// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
// ----------------------------------
exports.adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // 2. Validate against .env admin credentials
        const isValidAdmin = validateAdminCredentials(email, password);
        if (!isValidAdmin) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }

        // 3. Ensure admin user exists in DB with correct role
        let user = await findUserByEmail(email);

        if (!user) {
            user = await createUser({
                firstName: 'Admin',
                lastName: '',
                email,
                password, // NOTE: Hash in production!
                role: 'admin',
            });
        } else if (user.role !== 'admin') {
            await updateUserProfile(user.id, { role: 'admin' });
            user.role = 'admin';
        }

        req.adminPasswordVerified = true;
        sendTokenResponse(user, 200, res, true);
    } catch (err) {
        next(err);
    }
};

// ----------------------------------
// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private/Admin
// ----------------------------------
exports.getAdminProfile = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized as admin' });
        }
        res.status(200).json({ success: true, data: req.user });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------
// @desc    Change admin password (in DB only)
// @route   PUT /api/admin/change-password
// @access  Private/Admin
// ----------------------------------
exports.changeAdminPassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const adminEmail = req.user.email;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide current and new password' });
        }

        // Get user from DB
        const user = await findUserByEmail(adminEmail);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Admin user not found' });
        }

        // For now: plain text check (hash in prod!)
        if (user.password !== currentPassword) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update password in DB
        await updateUserProfile(user.id, { password: newPassword });

        res.status(200).json({ success: true, message: 'Admin password changed successfully' });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------
// Helper: Create JWT, cookie, and send response
// ----------------------------------
const sendTokenResponse = (user, statusCode, res, passwordVerified = false) => {
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const options = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRE.replace(/\D/g, '')) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') options.secure = true;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            passwordVerified,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};
