import express from "express";
import { getProductReviews, getReviewEligibility, upsertProductReview } from "../controllers/review.controller.js";
import { authenticate } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { submitReviewSchema, reviewEligibilitySchema } from "../validation/review.schema.js";

const router = express.Router({ mergeParams: true });

router.get("/", getProductReviews);
router.get("/eligibility", authenticate, validate(reviewEligibilitySchema), getReviewEligibility);
router.post("/", authenticate, validate(submitReviewSchema), upsertProductReview);

export default router;
