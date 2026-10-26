import { ValidationError } from '../errors/AppError.js';

/**
 * Lightweight, zero-dependency schema validation middleware.
 * Validates request body, query, and params against structured validation rule sets.
 */

export const validateField = (value, rule, fieldName) => {
  if (rule.required && (value === undefined || value === null || value === '')) {
    return `${fieldName} is required`;
  }

  if (value === undefined || value === null || value === '') {
    return null; // Optional and omitted
  }

  if (rule.type === 'string') {
    if (typeof value !== 'string') return `${fieldName} must be a string`;
    if (rule.minLength != null && value.length < rule.minLength) {
      return `${fieldName} must be at least ${rule.minLength} characters`;
    }
    if (rule.maxLength != null && value.length > rule.maxLength) {
      return `${fieldName} cannot exceed ${rule.maxLength} characters`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.patternMessage || `${fieldName} is in an invalid format`;
    }
  }

  if (rule.type === 'number') {
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a valid number`;
    if (rule.min != null && num < rule.min) {
      return `${fieldName} must be at least ${rule.min}`;
    }
    if (rule.max != null && num > rule.max) {
      return `${fieldName} cannot exceed ${rule.max}`;
    }
  }

  if (rule.type === 'array') {
    if (!Array.isArray(value)) return `${fieldName} must be an array`;
    if (rule.minItems != null && value.length < rule.minItems) {
      return `${fieldName} must contain at least ${rule.minItems} items`;
    }
  }

  if (rule.enum && !rule.enum.includes(value)) {
    return `${fieldName} must be one of: ${rule.enum.join(', ')}`;
  }

  if (typeof rule.custom === 'function') {
    const customResult = rule.custom(value);
    if (customResult && typeof customResult === 'string') {
      return customResult;
    }
    if (customResult === false) {
      return `${fieldName} failed custom validation`;
    }
  }

  return null;
};

export const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const location of ['body', 'query', 'params']) {
    if (schema[location]) {
      const target = req[location] || {};
      for (const [field, rule] of Object.entries(schema[location])) {
        const error = validateField(target[field], rule, field);
        if (error) {
          errors.push({ field: `${location}.${field}`, message: error });
        }
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export default validate;
