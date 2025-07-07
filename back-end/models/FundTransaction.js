const mongoose = require("mongoose");

const fundTransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["house", "sponsor", "donor", "balance", "aarti"],
        required: true
    },
    houseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House",
        required: function () {
            return this.type === "house";
        }
    },
    name: String, // For sponsor or donor
    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ["Cash", "GPay"]
    },
    reference: String,     // Optional payment reference number
    date: { type: Date, default: Date.now },
    festivalYear: { type: Number, required: true },
    alternativePhone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("FundTransaction", fundTransactionSchema);
