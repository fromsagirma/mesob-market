import express from "express";
import {
	login,
	register,
	verifyEmail,
	refreshToken,
	logout,
	requestPasswordReset,
	confirmPasswordReset,
	changePassword,
} from "../controllers/user.controller.js";
import { upload } from "../config/cloudinaryConfig.js";
import { authenticate } from "../middleware/role.middleware.js";
import { authRateLimiter, passwordResetRateLimiter } from "../middleware/rateLimiter.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
	registerSchema,
	loginSchema,
	passwordResetRequestSchema,
	passwordResetConfirmSchema,
	changePasswordSchema
} from "../validation/auth.schema.js";

const router = express.Router();

router.post("/register", authRateLimiter, upload.single('profilePic'), validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/password-reset/request", passwordResetRateLimiter, validate(passwordResetRequestSchema), requestPasswordReset);
router.post("/password-reset/confirm", validate(passwordResetConfirmSchema), confirmPasswordReset);
router.post("/change-password", authenticate, validate(changePasswordSchema), changePassword);
router.get("/verify", verifyEmail);

export default router;