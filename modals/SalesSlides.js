const mongoose = require('mongoose');

const SalesSliderSchema = new mongoose.Schema({
  title:{
    type: String,
  },
  para:{
    type: String,

  },
  DealMoney:{
    type: Number,
  },
  image:{
    type:String,
  }
});

const SalesSlider = mongoose.model("SalesSlider", SalesSliderSchema);

module.exports = SalesSlider;
