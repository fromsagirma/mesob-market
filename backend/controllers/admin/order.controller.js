import mongoose from "mongoose";
import Order from "../../models/order.model.js";
import { transitionOrderStatus } from "../../services/order.service.js";

const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const updatedOrder = await transitionOrderStatus(id, status);
        return res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(400).json({ message: error.message || "Failed to update order status" });
    }
};

export { getAllOrder, updateOrderStatus };