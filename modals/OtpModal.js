const mongoose = require('mongoose')
const OtpSchema = mongoose.Schema({
    Otp: {
      type: String,
      required: true,
    },
    OtpExpire: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });


  const OtpModal = mongoose.model('Otp', OtpSchema);

module.exports = OtpModal ;