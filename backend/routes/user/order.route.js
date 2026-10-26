import express from 'express';
import { createOrder, getMyOrder, getOrderById } from "../../controllers/user/order.controller.js";
import { authenticate } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { createOrderSchema, orderIdParamSchema } from "../../validation/order.schema.js";

const router = express.Router();

router.post('/', authenticate, validate(createOrderSchema), createOrder);
router.get('/my', authenticate, getMyOrder);
router.get('/:id', authenticate, validate(orderIdParamSchema), getOrderById);

export default router;
