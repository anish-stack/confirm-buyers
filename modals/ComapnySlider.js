const mongoose = require('mongoose');

const CompanySliderSchema = new mongoose.Schema({
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

const CompanySlider = mongoose.model("CompanySlider", CompanySliderSchema);

module.exports = CompanySlider;
