/**
 * Mesob Market - Client-Side Authentication Validation Schemas & Pure Helpers
 * Zero-dependency robust validation for customer and merchant credentials.
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  return { valid: true, value: trimmed };
};

export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Name must be at least 3 characters.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 3) {
    return { valid: false, message: 'Name must be at least 3 characters.' };
  }
  if (!/^[A-Za-z\s'-]+$/.test(trimmed)) {
    return { valid: false, message: 'Name should only contain letters.' };
  }
  return { valid: true, value: trimmed };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password must be at least 8 characters.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must include at least one number.' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must include at least one special character.' };
  }
  return { valid: true, value: password };
};

export const validateSignupData = ({ name, email, password, confirmPassword } = {}) => {
  const nameRes = validateName(name);
  if (!nameRes.valid) return nameRes;

  const emailRes = validateEmail(email);
  if (!emailRes.valid) return emailRes;

  const passRes = validatePassword(password);
  if (!passRes.valid) return passRes;

  if (password !== confirmPassword) {
    return { valid: false, message: 'Password and confirm password must match.' };
  }
  return { valid: true };
};

export const validateLoginData = ({ email, password } = {}) => {
  const emailRes = validateEmail(email);
  if (!emailRes.valid) return emailRes;

  if (!password || typeof password !== 'string' || password.length < 1) {
    return { valid: false, message: 'Please enter your password.' };
  }
  return { valid: true };
};

export const signupSchema = {
  parse(data) {
    const res = validateSignupData(data);
    if (!res.valid) {
      const err = new Error(res.message);
      err.issues = [{ message: res.message }];
      throw err;
    }
    return data;
  },
  safeParse(data) {
    const res = validateSignupData(data);
    return res.valid
      ? { success: true, data }
      : { success: false, error: { issues: [{ message: res.message }] } };
  }
};

export const loginSchema = {
  parse(data) {
    const res = validateLoginData(data);
    if (!res.valid) {
      const err = new Error(res.message);
      err.issues = [{ message: res.message }];
      throw err;
    }
    return data;
  },
  safeParse(data) {
    const res = validateLoginData(data);
    return res.valid
      ? { success: true, data }
      : { success: false, error: { issues: [{ message: res.message }] } };
  }
};

export default {
  validateEmail,
  validateName,
  validatePassword,
  validateSignupData,
  validateLoginData,
  signupSchema,
  loginSchema
};
