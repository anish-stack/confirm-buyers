const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
    },
    ProductCategory: {
        type: String,
        required: true,
    },
    ProductImage: {
        type: [String],
        default: [],
    },
    ProductPrice: {
        type: String,
        required: true,
    },
    BusinessType: {
        type: String,
        required: true,
    },
    ProductStatus: {
        type: Boolean,
        default: false,
    },
    Description: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref:"Registration"
    }
});



const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;