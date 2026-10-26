import express from "express";
import { getCart, createCart, updateCartById, deleteCartById } from "../../controllers/user/cart.controller.js";
import { authenticate } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { syncCartSchema, cartIdParamSchema } from "../../validation/cart.schema.js";

const router = express.Router();

router.get("/", authenticate, getCart);
router.post("/", authenticate, validate(syncCartSchema), createCart);
router.put("/:id", authenticate, validate(cartIdParamSchema), updateCartById);
router.delete("/:id", authenticate, validate(cartIdParamSchema), deleteCartById);

export default router;
