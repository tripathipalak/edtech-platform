const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    
    email: {
       type:String,
       required:true,
    },
    otp: {
       type:String,
       required:true,
    },
    createdAt: {
       type:Date,
       default:Date.now(),
       expires: 5*60,
    },

});


// function to send emails
async function sendVerificationEmail(email, otp){
   try{
      const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
      console.log("Email send Successfully: ", mailResponse);
   }
   catch(error) {
      console.log("error occured while sending mails: ", error);   // yha pr humne apne aap se ek string likha hai then error print krne ko kha hai.. isse jo insaan ise use kr rha hoh=ga use clarity aayegi ki kha pr error ho rha .. sirf error msg hi show nhi hoga use ye line bhi show hogi
      throw error;
   }
}

OTPSchema.pre("save", async function(next){    // document DB me save krne se phle middleware lgana hai isilie pre use kiya hai
   await sendVerificationEmail(this.email, this.otp);
   next();
})

  

module.exports = mongoose.model("OTP", OTPSchema);


// jb koi user signup krne aaya -> usne details fill ki -> uske email pr otp gya -> abhi tk uss user ki entry DB me create nhi hui hai -> woh user otp enter krega -> then signup button ko click krega -> ab signup button ko click krne ke baad uss user ki entry DB me create hogi
// iska mtlb hai DB me entry create hone se phle mtlb DB me document bn'ne se phle OTP bhejna pdega mail pr

// iska mtlb hai entry create krne se phle email send krna pdega -> that means yha pr pre-middleware ka use krna hai
// mtlb jo OTP hum send krenge mail pr uska code hum as a pre middleware likhenge --> aur woh pre middleware OTP ke schema ke niche aur OTP ke model ke upr likha jayega 
// pre middleware me humko mail send krne ka code likhna hai

// Mongoose Pre/Post Middleware (inside Schema file) -->
// These are written directly in the model/schema file before creating the model