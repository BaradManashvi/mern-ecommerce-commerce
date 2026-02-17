const mongoose=require("mongoose")
const {Schema}=mongoose

const otpSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
})

const Otp = mongoose.model("Otp", otpSchema);

// ✅ OTP generator
const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

module.exports = { Otp, generateOTP };

//module.exports=mongoose.model("OTP",otpSchema)