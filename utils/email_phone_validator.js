const User = require("../models/User")



//phone number check 
exports.checkPhoneNumber = async (phone) => {
    try {
      if (phone.toString().length > 10) {
        return {
          sucess : false  , 
          message : "Phone number must be exactly 10 digits"
        }
      }
      const existingUser = await User.findOne({phone}) 
      return {
        sucess : true , 
        exists : existingUser ? true : false  
      }
    } catch(error) { 
      throw error ; 
    }

}

