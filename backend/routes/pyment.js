const express = require("express");
const router = express.Router();
const razorpay = require("../utils/razorpay");
const Order = require("../models/Order");

// Create Razorpay order
router.post("/create", async (req, res) => {
    try {
        const { amount, currency, receipt, orderId } = req.body;
        const options = {
            amount: amount * 100, // amount in paise
            currency: currency || "INR",
            receipt: receipt,
            payment_capture: 1
        };
        const response = await razorpay.orders.create(options);

        // Save Razorpay order ID in Order model
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, { razorpayOrderId: response.id });
        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating Razorpay order" });
    }
});

// Verify payment
router.post("/verify", async (req, res) => {
    try {
        const { razorpayPaymentId, razorpayOrderId, orderId } = req.body;

        // Update order as completed
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "Completed",
            razorpayPaymentId
        });

        res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Payment verification failed" });
    }
});

module.exports = router;
