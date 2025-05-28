const {
    createAdditionalService,
    findAllAdditionalServices,
    findAdditionalServiceById,
    updateAdditionalService,
    deleteAdditionalService,
} = require('../models/additionalService.model');

// GET /api/admin/additional-services
exports.getAllAdditionalServices = async (req, res, next) => {
    try {
        const services = await findAllAdditionalServices();
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/additional-services/:id
exports.getAdditionalService = async (req, res, next) => {
    try {
        const service = await findAdditionalServiceById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Additional service not found" });
        }
        res.status(200).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};

// POST /api/admin/additional-services
exports.createAdditionalService = async (req, res, next) => {
    try {
        const service = await createAdditionalService(req.body);
        res.status(201).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};

// PUT /api/admin/additional-services/:id
exports.updateAdditionalService = async (req, res, next) => {
    try {
        const updated = await updateAdditionalService(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Additional service not found" });
        }
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/admin/additional-services/:id
exports.deleteAdditionalService = async (req, res, next) => {
    try {
        const deleted = await deleteAdditionalService(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Additional service not found" });
        }
        res.status(200).json({ success: true, message: "Additional service deleted" });
    } catch (err) {
        next(err);
    }
};
