const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    festivalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Festival",
        required: true
    },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ["Cash", "GPay"]
    },
    description: String,
    note: String,
    date: { type: Date, default: Date.now },
    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
        required: false
    },
    isSettled: { type: Boolean, default: false },
    isSettledAt: { type: Date },
    settledOn: Date,
    festivalYear: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
