const mongoose = require('mongoose');

const FetureProductSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  MinimumQuantity: {
    type: String,
  },
  Portofdispatch: {
    type: String,
  },
  Type: {
    type: String,
  },
  ProcessingTime: {
    type: String,
  },
  EstimatePricing: {
    type: String,
  },
  Packaging: {
    type: String,
  },
  PRODUCTS_DESCRIPTION: {
    type: String,
  },
  keyword:{
    type : [String] ,
  },
  PRODUCTS_SPECIFICATION: [
    {
      ProductName: {
        type: String,
      },
      Volume: {
        type: String,
      },
      ContainerType: {
        type: String,
      },
      Color: {
        type: String,
      },
    },
  ],
 userName:{
  type:String
 },
 userPlace:{
  type:String
 },
 userMember:{
  type:String
 }

});

const FetureProduct = mongoose.model("FetureProduct", FetureProductSchema);

module.exports = FetureProduct;
