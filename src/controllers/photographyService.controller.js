const {
    createPhotographyService,
    findAllPhotographyServices,
    findPhotographyServiceById,
    updatePhotographyService,
    deletePhotographyService,
} = require('../models/photographyService.model');

// GET /api/admin/services
exports.getAllPhotographyServices = async (req, res, next) => {
    try {
        const services = await findAllPhotographyServices();
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/services/:id
exports.getPhotographyService = async (req, res, next) => {
    try {
        const service = await findPhotographyServiceById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Photography service not found" });
        }
        res.status(200).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};

// POST /api/admin/services
exports.createPhotographyService = async (req, res, next) => {
    try {
        const service = await createPhotographyService(req.body);
        res.status(201).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};

// PUT /api/admin/services/:id
exports.updatePhotographyService = async (req, res, next) => {
    try {
        const updated = await updatePhotographyService(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Photography service not found" });
        }
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/admin/services/:id
exports.deletePhotographyService = async (req, res, next) => {
    try {
        const deleted = await deletePhotographyService(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Photography service not found" });
        }
        res.status(200).json({ success: true, message: "Photography service deleted" });
    } catch (err) {
        next(err);
    }
};
