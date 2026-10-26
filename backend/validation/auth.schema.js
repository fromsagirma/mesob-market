/**
 * Request validation schemas for authentication routes.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = {
  body: {
    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 60
    },
    email: {
      type: 'string',
      required: true,
      pattern: EMAIL_REGEX,
      patternMessage: 'Please provide a valid email address'
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 128
    }
  }
};

export const loginSchema = {
  body: {
    email: {
      type: 'string',
      required: true,
      pattern: EMAIL_REGEX,
      patternMessage: 'Please provide a valid email address'
    },
    password: {
      type: 'string',
      required: true
    }
  }
};

export const passwordResetRequestSchema = {
  body: {
    email: {
      type: 'string',
      required: true,
      pattern: EMAIL_REGEX,
      patternMessage: 'Please provide a valid email address'
    }
  }
};

export const passwordResetConfirmSchema = {
  body: {
    token: {
      type: 'string',
      required: true,
      minLength: 10
    },
    newPassword: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 128
    }
  }
};

export const changePasswordSchema = {
  body: {
    oldPassword: {
      type: 'string',
      required: true
    },
    newPassword: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 128
    }
  }
};

export default {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  changePasswordSchema
};
