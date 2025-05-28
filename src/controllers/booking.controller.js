const {
    createBooking,
    findAllBookings,
    findBookingById,
    updateBooking,
    deleteBooking,
    findBookingsByUserId
} = require('../models/booking.model');

const { findPhotographyServiceById } = require('../models/photographyService.model');
const { findMultipleAdditionalServices } = require('../models/additionalService.model');

// @desc    Calculate total price for a booking
// @route   POST /api/bookings/calculate
// @access  Private
exports.calculateBookingPrice = async (req, res, next) => {
    try {
        const { photographyServiceId, additionalServices } = req.body;

        if (!photographyServiceId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a photography service'
            });
        }

        const photographyService = await findPhotographyServiceById(photographyServiceId);
        if (!photographyService) {
            return res.status(404).json({
                success: false,
                message: 'Photography service not found'
            });
        }

        let totalAmount = photographyService.basePrice || 0;
        let calculationDetails = {
            baseService: {
                name: photographyService.name,
                price: photographyService.basePrice
            },
            additionalServicesCalculation: []
        };

        if (additionalServices && additionalServices.length > 0) {
            const ids = additionalServices.map(item => item.serviceId);
            const services = await findMultipleAdditionalServices(ids);

            additionalServices.forEach(item => {
                const service = services.find(s => s.id === item.serviceId);
                if (service) {
                    const quantity = item.quantity || 1;
                    const total = service.price * quantity;
                    totalAmount += total;
                    calculationDetails.additionalServicesCalculation.push({
                        name: service.name,
                        unitPrice: service.price,
                        quantity,
                        total,
                    });
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                basePrice: photographyService.basePrice,
                totalAmount,
                photographyService,
                calculationDetails,
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const {
            photographyServiceId,
            additionalServices,
            eventDate,
            eventLocation,
            contactDetails,
            specialRequirements
        } = req.body;

        if (!photographyServiceId || !eventDate || !eventLocation || !contactDetails) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const photographyService = await findPhotographyServiceById(photographyServiceId);
        if (!photographyService) {
            return res.status(404).json({
                success: false,
                message: 'Photography service not found'
            });
        }

        let totalAmount = photographyService.basePrice || 0;
        const processedAdditionalServices = [];

        if (additionalServices && additionalServices.length > 0) {
            const ids = additionalServices.map(item => item.serviceId);
            const services = await findMultipleAdditionalServices(ids);

            additionalServices.forEach(item => {
                const service = services.find(s => s.id === item.serviceId);
                if (service) {
                    const quantity = item.quantity || 1;
                    totalAmount += service.price * quantity;
                    processedAdditionalServices.push({
                        service: item.serviceId,
                        quantity
                    });
                }
            });
        }

        const bookingData = {
            user: req.user.id,
            photographyService: photographyServiceId,
            additionalServices: processedAdditionalServices,
            eventDate,
            eventLocation,
            contactDetails,
            specialRequirements,
            totalAmount,
            paymentStatus: 'pending',
            bookingStatus: 'pending'
        };

        const booking = await createBooking(bookingData);

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
    try {
        // Assumes GSI or filter by user
        const bookings = await findBookingsByUserId(req.user.id);
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await findBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Make sure user owns the booking or is admin
        if (booking.user !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
    try {
        const booking = await findBookingById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Make sure user owns the booking or is admin
        if (booking.user !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking'
            });
        }

        // Only allow updating specific fields
        const allowedUpdates = ['eventDate', 'eventLocation', 'contactDetails', 'specialRequirements'];
        const updateData = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        const updated = await updateBooking(req.params.id, updateData);

        res.status(200).json({
            success: true,
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await findBookingById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.user !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        const updated = await updateBooking(req.params.id, { bookingStatus: 'canceled' });

        res.status(200).json({
            success: true,
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await findAllBookings();
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update booking status (admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { bookingStatus, paymentStatus } = req.body;

        if (!bookingStatus && !paymentStatus) {
            return res.status(400).json({
                success: false,
                message: 'Please provide booking or payment status to update'
            });
        }

        const updateData = {};
        if (bookingStatus) updateData.bookingStatus = bookingStatus;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const updated = await updateBooking(req.params.id, updateData);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
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

// @desc    Delete booking (admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res, next) => {
    try {
        const deleted = await deleteBooking(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Booking deleted"
        });
    } catch (err) {
        next(err);
    }
};
