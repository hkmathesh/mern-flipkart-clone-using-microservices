const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for Address Service");
    } catch (error) {
        console.error("MongoDB Connection Failed for Address Service:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
