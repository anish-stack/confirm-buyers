const mongoose = require('mongoose');

// Define the subCategory schema
const subCategorySchema = new mongoose.Schema({
    text: {
        type : String
    },
  img: { type: String, required: true },
  keywords: { type: [String], required: true }
});

// Define the MainCategory schema
const mainCategorySchema = new mongoose.Schema({
  Category: { type: String, required: true },
  subCategory: { type: [subCategorySchema], required: true }
});

// Create the MainCategory model
const MainCategory = mongoose.model('MainCategory', mainCategorySchema);

module.exports = MainCategory;
