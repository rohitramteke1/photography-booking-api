const { 
    findAllUsers, 
    findUserById, 
    updateUserProfile 
} = require('../models/user.model');
const { 
    findAllBookings 
} = require('../models/booking.model');
const { 
    findAllPhotographyServices 
} = require('../models/photographyService.model');
const { 
    findAllAdditionalServices 
} = require('../models/additionalService.model');
const { ADMIN_CONFIG, ADMIN_EMAILS } = require('../config/admin.config');

// ------------------- ADMIN PASSWORD MIDDLEWARE -------------------
const verifyAdminPassword = async (req, res, next) => {
    if (
        req.user &&
        req.user.role === 'admin' &&
        ADMIN_EMAILS.includes(req.user.email.toLowerCase())
    ) {
        return next();
    }
    if (!req.user || !req.user.googleId) {
        return res.status(403).json({
            success: false,
            message: 'Admin must authenticate using Google'
        });
    }
    const { adminPassword } = req.headers;
    const adminConfig = ADMIN_CONFIG.find(
        admin => admin.email.toLowerCase() === req.user.email.toLowerCase()
    );
    if (!adminConfig) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized as admin',
            requiresPassword: true
        });
    }
    if (!adminPassword || adminPassword !== adminConfig.password) {
        return res.status(403).json({
            success: false,
            message: 'Admin password verification required',
            requiresPassword: true
        });
    }
    req.adminPasswordVerified = true;
    next();
};

// ------------------- DASHBOARD OVERVIEW -------------------
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Fetch all users, bookings, services for counting
        const [users, bookings, services, additionalServices] = await Promise.all([
            findAllUsers(),
            findAllBookings(),
            findAllPhotographyServices(),
            findAllAdditionalServices()
        ]);
        const userCount = users.length;
        const bookingCount = bookings.length;
        const photographyServiceCount = services.length;
        const additionalServiceCount = additionalServices.length;

        // Analytics
        const sortedBookings = bookings
            .slice() // shallow copy
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const recentBookings = sortedBookings.slice(0, 5);

        // Financials
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;
        const paidBookings = bookings.filter(b => b.paymentStatus === 'paid').length;

        // Booking status analytics
        const pendingBookings = bookings.filter(b => b.bookingStatus === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed').length;
        const canceledBookings = bookings.filter(b => b.bookingStatus === 'canceled').length;
        const completedBookings = bookings.filter(b => b.bookingStatus === 'completed').length;

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    users: userCount,
                    bookings: bookingCount,
                    photographyServices: photographyServiceCount,
                    additionalServices: additionalServiceCount
                },
                recentBookings,
                financials: {
                    totalRevenue,
                    pendingPayments,
                    paidBookings
                },
                bookingStatuses: {
                    pending: pendingBookings,
                    confirmed: confirmedBookings,
                    canceled: canceledBookings,
                    completed: completedBookings
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- USERS -------------------
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await findAllUsers();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({
            success: true,
            data: userWithoutPassword
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid role (user or admin)'
            });
        }
        const updated = await updateUserProfile(req.params.id, { role });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

// ------------------- ANALYTICS (BOOKINGS/REVENUE) -------------------
exports.getBookingAnalytics = async (req, res, next) => {
    try {
        const bookings = await findAllBookings();
        // Bookings by month (last 12 months)
        const bookingsByMonth = {};
        bookings.forEach(booking => {
            const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;
        });
        // Bookings by service
        const bookingsByService = {};
        bookings.forEach(booking => {
            const serviceId = booking.photographyService;
            bookingsByService[serviceId] = (bookingsByService[serviceId] || 0) + 1;
        });
        res.status(200).json({
            success: true,
            data: { bookingsByMonth, bookingsByService }
        });
    } catch (err) {
        next(err);
    }
};

exports.getRevenueAnalytics = async (req, res, next) => {
    try {
        const bookings = await findAllBookings();
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        // By payment status
        const revenueByPaymentStatus = bookings.reduce((obj, b) => {
            const status = b.paymentStatus || 'unknown';
            obj[status] = (obj[status] || 0) + (b.totalAmount || 0);
            return obj;
        }, {});
        // By booking status
        const revenueByBookingStatus = bookings.reduce((obj, b) => {
            const status = b.bookingStatus || 'unknown';
            obj[status] = (obj[status] || 0) + (b.totalAmount || 0);
            return obj;
        }, {});
        res.status(200).json({
            success: true,
            data: { totalRevenue, revenueByPaymentStatus, revenueByBookingStatus }
        });
    } catch (err) {
        next(err);
    }
};

// Export middleware as well for use in routes
exports.verifyAdminPassword = verifyAdminPassword;
