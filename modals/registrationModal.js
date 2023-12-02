const mongoose = require('mongoose')

const Jwt = require('jsonwebtoken')

const RegistrationSchema = mongoose.Schema(({

    YourName: {
        type: String,
        required: true
    },
    CompanyName: {
        type: String,
        required: true,
        trim: true
    },

    Mobilenumber: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },

    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    CompanyCity: {
        type: String,
    },
    Password:{
        type: String,
    },
    otp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Otp",
    },
    isEmailVerifed:{
        type : Boolean ,
        default:false
    },
    CompanyDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyDetails",
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      }
      
}))


  
RegistrationSchema.methods.getJwtToken = function () {
    const token = Jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
      expiresIn: '4d',
    });
    return token;
  };


const Registration = mongoose.model('Registration', RegistrationSchema);
module.exports = Registration;