import { AppError } from '../errors/AppError.js';

/**
 * Enhanced centralized error handling middleware.
 * Classifies operational vs unexpected programmer errors,
 * standardizes database and JWT exceptions, and sanitizes production traces.
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new AppError(`A resource with this ${field} already exists.`, 409, 'DUPLICATE_ENTRY');
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'INVALID_IDENTIFIER');
  }

  // Handle Mongoose schema validation error
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message
    }));
    error = new AppError('Validation failed on one or more fields', 422, 'VALIDATION_ERROR');
    error.errors = validationErrors;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token', 401, 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED');
  }

  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational || false;
  const message = isOperational ? error.message : (process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message);
  const code = error.code || (statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');

  const response = {
    success: false,
    message,
    code,
    requestId: req.id || req.headers['x-request-id'] || undefined
  };

  if (error.errors) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV !== 'production' && !isOperational) {
    response.stack = err.stack;
  }

  // Log 500-level internal errors
  if (statusCode >= 500 && process.env.NODE_ENV !== 'test') {
    console.error(`[UnhandledError] ${req.method} ${req.url}:`, err);
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
