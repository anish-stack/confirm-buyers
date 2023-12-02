const mongoose = require("mongoose");

const companyDetailsSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  companyAddress: {
    type: String,
  },
  companyWebsite: {
    type: String,
  },
  companyState: {
    type: String,
  },
  companyCity: {
    type: String,
  },
  companyPincode: {
    type: String,
  },
  primaryBusiness: {
    type: String,
  },
  products: {
    type: [String],
  },
  Gst: {
    type: String,
    trim: true,
  },
  Desigination: {
    type: String,
  },
  BranchDetails: {
    type: [
      {
        Division: {
          type: String,
        },
        Contactperson: {
          type: String,
        },
        Country: {
          type: String,
        },
        city: {
          type: String,
        },
        Address: {
          type: String,
        },
        pincode: {
          type: String,
        },
        conatcno: {
          type: String,
        },
      },
    ],
  },
  user: {
    type: mongoose.Types.ObjectId,
  },
});

const CompanyDetails = mongoose.model("CompanyDetails", companyDetailsSchema);

module.exports = CompanyDetails;
