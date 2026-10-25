/**
 * Standardized JSON API response utility for Mesob Market.
 * Ensures consistent response envelopes across all endpoints.
 */

export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const payload = {
    success: true,
    message,
    data
  };

  if (meta && typeof meta === 'object') {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendCreated = (res, data = null, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

export const sendPaginated = (res, items = [], { page = 1, limit = 10, total = 0 }, message = 'Success') => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const totalNum = Number(total) || 0;
  const totalPages = Math.ceil(totalNum / limitNum) || 1;

  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  });
};

export const sendError = (res, message = 'An unexpected error occurred', statusCode = 500, errors = null, code = 'INTERNAL_ERROR') => {
  const payload = {
    success: false,
    message,
    code
  };

  if (errors && (Array.isArray(errors) ? errors.length > 0 : Object.keys(errors).length > 0)) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

export default {
  sendSuccess,
  sendCreated,
  sendPaginated,
  sendError
};
