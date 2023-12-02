const mongoose = require('mongoose');

const PostBuySchema = new mongoose.Schema({
    ProductAndService: {
        type: String,
        required: true,
    },
    Qunatity: {
        type: String,
    },
    SupplierPreference: {
        type: Array,
        
    },
    MultipleStates: {
        type: [String],
    },
    user:{
        type:"String"
    }
});

const PostBuy = mongoose.model("PostBuy", PostBuySchema);

module.exports = PostBuy;
