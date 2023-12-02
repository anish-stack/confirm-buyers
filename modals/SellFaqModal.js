const mongoose = require('mongoose');

const SellerfaqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: [String],
        required: true,
    },
    category: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SellerFAQ = mongoose.model('SellerfaqSchema', SellerfaqSchema);

module.exports = SellerFAQ;
