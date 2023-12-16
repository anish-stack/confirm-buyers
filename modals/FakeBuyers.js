const mongoose = require('mongoose');

const BuyerfakeSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    companyCity: {
        type: String,
        required: true,
    },
    Date: {
        type: String,
    },
    Product:{
        type: String,

    }  ,
    contactNumber:{
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ByuerFake = mongoose.model('buyerfake', BuyerfakeSchema);

module.exports = ByuerFake;
