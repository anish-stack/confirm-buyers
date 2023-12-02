const mongoose = require('mongoose');

const CounterySchema = new mongoose.Schema({
  name:{
    type: String,
  },
  image:{
    type:String,
  }
});

const Countery = mongoose.model("Countery", CounterySchema);

module.exports = Countery;
