import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mesob_market";
        const options = {};
        
        // Enforce TLS for MongoDB Atlas and remote clusters
        if (uri.includes("mongodb+srv") || (!uri.includes("localhost") && !uri.includes("127.0.0.1"))) {
            options.tls = true;
            // Only allow insecure TLS if explicitly requested in non-production environments
            if (process.env.ALLOW_INSECURE_TLS === "true" && process.env.NODE_ENV !== "production") {
                options.tlsInsecure = true;
            }
        }

        await mongoose.connect(uri, options);
        console.log("MongoDB connected to:", uri.includes("@") ? "Remote DB" : uri);

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;
