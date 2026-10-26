import nodemailer from 'nodemailer';

/**
 * Transactional email service.
 * Manages email templates and SMTP transmission for account verification
 * and password recovery workflows.
 */

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const getVerificationEmailTemplate = ({ verificationLink, appName = 'Mesob Market' }) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Welcome to ${appName}!</h1>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Thank you for registering. Please confirm your email address to activate your account and start shopping:</p>
      <div style="margin: 24px 0;">
        <a href="${verificationLink}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If the button above does not work, copy and paste this URL into your browser:</p>
      <p style="color: #2563eb; font-size: 13px; word-break: break-all;">${verificationLink}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">If you did not create an account with ${appName}, you can safely ignore this email.</p>
    </div>
  `;
};

export const getPasswordResetTemplate = ({ resetLink, appName = 'Mesob Market' }) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Password Reset Request</h1>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">We received a request to reset your ${appName} password. Click the button below to choose a new password:</p>
      <div style="margin: 24px 0;">
        <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">This link will expire in 60 minutes. If the button does not work, copy and paste this URL:</p>
      <p style="color: #2563eb; font-size: 13px; word-break: break-all;">${resetLink}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">If you did not request this password reset, please secure your account immediately.</p>
    </div>
  `;
};

export const sendVerificationEmail = async (email, token) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[EmailService] EMAIL_USER or EMAIL_PASS not configured. Skipping verification email dispatch.');
    return;
  }

  const transporter = createTransporter();
  const serverUrl = process.env.SERVER_URL || 'https://e-commerce-he4h.onrender.com';
  const verificationLink = `${serverUrl}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"Mesob Market" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your Mesob Market account',
    html: getVerificationEmailTemplate({ verificationLink })
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, token) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[EmailService] EMAIL_USER or EMAIL_PASS not configured. Skipping password reset email dispatch.');
    return;
  }

  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.FRONTEND_PORT || 5173}`;
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Mesob Market" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your Mesob Market password',
    html: getPasswordResetTemplate({ resetLink })
  };

  await transporter.sendMail(mailOptions);
};

export default {
  createTransporter,
  getVerificationEmailTemplate,
  getPasswordResetTemplate,
  sendVerificationEmail,
  sendPasswordResetEmail
};
