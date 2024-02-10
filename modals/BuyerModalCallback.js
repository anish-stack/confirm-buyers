const mongoose = require('mongoose');

const BuyerModalSchema = new mongoose.Schema({
    YourName: {
        type: String,
        required: true,
    },
    Number: {
        type: Number,
    },
    YourProduct: {
        type: String,
    },
    YourSuitableTime: {
        type: [String],
    },
    Email: {
        type: String,
    },
});

const BuyerModal = mongoose.model("Buyer-callback", BuyerModalSchema);

module.exports = BuyerModal;
