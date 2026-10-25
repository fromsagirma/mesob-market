import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { queryProducts, withDiscountedPrice } from "../services/product.service.js";

const getProducts = async (req, res) => {
    try {
        const result = await queryProducts(req.query);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ product: withDiscountedPrice(product) });

    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export { getProducts, getProductById, withDiscountedPrice };