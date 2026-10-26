import express from "express";
import { getProducts, getProductById } from "../controllers/product.controller.js";
import reviewRoutes from "./review.route.js";
import validate from "../middleware/validate.middleware.js";
import { queryProductsSchema, productIdParamSchema } from "../validation/product.schema.js";

const router = express.Router();

router.use("/:id/reviews", reviewRoutes);
router.get("/", validate(queryProductsSchema), getProducts);
router.get("/:id", validate(productIdParamSchema), getProductById);

export default router;
