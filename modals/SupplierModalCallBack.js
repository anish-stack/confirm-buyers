const mongoose = require('mongoose');

const SupplierModalSchema = new mongoose.Schema({
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

const SupplierModal = mongoose.model("Supplier-Schema", SupplierModalSchema);

module.exports = SupplierModal;
