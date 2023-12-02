const mongoose = require('mongoose');

const BuyerfaqSchema = new mongoose.Schema({
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

const BuyerFAQ = mongoose.model('buyerFAQ', BuyerfaqSchema);

module.exports = BuyerFAQ;
