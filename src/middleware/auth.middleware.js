const jwt = require("jsonwebtoken");
const { findUserById } = require("../models/user.model");

// Admin emails from .env (case-insensitive)
const adminEmails = [
    process.env.ADMIN_EMAIL_1?.toLowerCase(),
    process.env.ADMIN_EMAIL_2?.toLowerCase(),
    process.env.ADMIN_EMAIL_3?.toLowerCase(),
].filter(Boolean);

// Protect routes (JWT required)
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in headers or cookies
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // DEBUG: Show decoded token
        console.log("Decoded JWT:", decoded);

        // Attach user to request object (DynamoDB version)
        const user = await findUserById(decoded.id);

        // DEBUG: Show user result
        console.log("User from DB:", user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }
};

// Grant access to specific roles (supports admin email whitelist)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // 1. Allow if user has required role
        if (roles.includes(req.user.role)) {
            return next();
        }
        // 2. Special case for 'admin': allow if user email is in whitelist
        if (
            roles.includes('admin') &&
            req.user.email &&
            adminEmails.includes(req.user.email.toLowerCase())
        ) {
            return next();
        }
        // 3. Otherwise, forbidden
        return res.status(403).json({
            success: false,
            message: `User role ${req.user.role} or email is not authorized to access this route`,
        });
    };
};
