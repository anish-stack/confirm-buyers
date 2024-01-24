const mongoose = require('mongoose');

const PostBuySchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
    },
    Qunatity: {
        type: String,
    },
     Category: {
        type: String,
    },
    TypeOfPacking: {
        type: String,
        
    },
    Message: {
        type: String,
    },
    user:{
        type:"String"
    }
});

const PostBuy = mongoose.model("PostBuy", PostBuySchema);

module.exports = PostBuy;
