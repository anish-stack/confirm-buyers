const mongoose = require('mongoose');

const mainSliderSchema = new mongoose.Schema({
  title:{
    type: String,
  },
  para:{
    type: String,

  },
  image:{
    type:String,
  }
});

const mainSlider = mongoose.model("mainSlider", mainSliderSchema);

module.exports = mainSlider;
