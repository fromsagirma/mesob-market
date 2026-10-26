import express from "express";
import { getAllOrder, updateOrderStatus } from "../../controllers/admin/order.controller.js";
import { authenticate, authorize } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { orderStatusTransitionSchema } from "../../validation/order.schema.js";

const router = express.Router();

router.get("/", authenticate, authorize(["admin"]), getAllOrder);
router.put("/:id", authenticate, authorize(["admin"]), validate(orderStatusTransitionSchema), updateOrderStatus);

export default router;