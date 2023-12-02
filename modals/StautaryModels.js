const mongoose = require("mongoose")


const StautartoryModal = mongoose.Schema({

    PanNo:{
        type:String,
        trim:true

    },
    TanNo:{
        type:String

    },
    CinNo:{
        type:String
    },
    BankName:{
        type:String,
        trim:true

    },
    BranchName:{
        type:String
    },
    AccountNumber:{
        type:Number,
        trim:true
    },
    BankIfsc:{
        type:String,
        trim:true

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Registration"
    }

},{timestamp:true})


const Statutory = mongoose.model("StatutoryDetail",StautartoryModal)
module.exports=Statutory;