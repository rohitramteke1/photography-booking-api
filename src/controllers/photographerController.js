const Photographer = require('../models/Photographer');

// @desc    Get all photographers
// @route   GET /api/photographers
// @access  Public
exports.getPhotographers = async (req, res, next) => {
  try {
    const photographers = await Photographer.find();

    res.status(200).json({
      success: true,
      count: photographers.length,
      data: photographers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get active photographers for the website
// @route   GET /api/photographers/active
// @access  Public
exports.getActivePhotographers = async (req, res, next) => {
  try {
    const photographers = await Photographer.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: photographers.length,
      data: photographers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single photographer
// @route   GET /api/photographers/:id
// @access  Public
exports.getPhotographer = async (req, res, next) => {
  try {
    const photographer = await Photographer.findById(req.params.id);

    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: photographer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new photographer
// @route   POST /api/photographers
// @access  Private/Admin
exports.createPhotographer = async (req, res, next) => {
  try {
    const photographer = await Photographer.create(req.body);

    res.status(201).json({
      success: true,
      data: photographer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update photographer
// @route   PUT /api/photographers/:id
// @access  Private/Admin
exports.updatePhotographer = async (req, res, next) => {
  try {
    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: photographer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete photographer
// @route   DELETE /api/photographers/:id
// @access  Private/Admin
exports.deletePhotographer = async (req, res, next) => {
  try {
    const photographer = await Photographer.findByIdAndDelete(req.params.id);

    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 