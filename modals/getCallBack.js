const mongoose = require('mongoose');

const CallBackSchema = new mongoose.Schema({
    YourName: {
        type: String,
        required: true,
    },
    ConactNumber: {
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

const CallBack = mongoose.model("CallBack", CallBackSchema);

module.exports = CallBack;
