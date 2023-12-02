const mongoose = require('mongoose');

const leadsSchema = new mongoose.Schema({
  productName: {
    type: String,
  },
  Date: {
    type: String,
  },
  DealMoney: {
    type: Number,
    default: "Depend upon the price",
  },
  CountryImageimage: {
    type: String,
  },
});

const leadsSchemas = mongoose.model("leadsSchema", leadsSchema);

module.exports = leadsSchemas;
