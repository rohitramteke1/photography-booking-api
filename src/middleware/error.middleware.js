// src/middlewares/error.middleware.js

const errorHandler = (err, req, res, next) => {
    // Log error for development
    console.error(err);

    // Set default error fields
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    // AWS DynamoDB Resource Not Found
    if (err.name === 'ResourceNotFoundException' || err.code === 'ResourceNotFoundException') {
        statusCode = 404;
        message = 'Resource not found (DynamoDB)';
    }

    // AWS DynamoDB ConditionalCheckFailedException
    if (err.name === 'ConditionalCheckFailedException' || err.code === 'ConditionalCheckFailedException') {
        statusCode = 409;
        message = 'Conflict or precondition failed (DynamoDB)';
    }

    // AWS DynamoDB ValidationException
    if (err.name === 'ValidationException' || err.code === 'ValidationException') {
        statusCode = 400;
        message = 'Validation error (DynamoDB): ' + (err.message || '');
    }

    // Handle duplicate email (custom)
    if (err.message && err.message.toLowerCase().includes('duplicate')) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Fallback for generic errors
    res.status(statusCode).json({
        success: false,
        error: message,
        // Only add stack in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
