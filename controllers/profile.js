const User = require("../models/User.js")  ;  
const {checkPhoneNumber} = require("../utils/email_phone_validator")


exports.updateProfile = async (req , res) => {

    try {
        //field eg : "name" , "email" , "phone" 
        
        const  {field , value1 , value2} = req.body ;
        const userId = req.user.id ; 
        let updateData = {} 

        switch(field) {

            case "name" :
                updateData = {firstName : value1 , lastName : value2} ; 
                break ;

            case "email" :
                updateData = {email : value1} ;
                break ; 

            case "phone" :
                const phonecheck = await checkPhoneNumber(value1) 
                if(!phonecheck.sucess) {
                    return res.status(400).json(phonecheck)
                } 
                if(phonecheck.exists) {
                    return res.status(400).json({
                        sucess : false , 
                        message : "Phone number already exists"
                    })
                }
                updateData = {phone : value1}
                break ; 
                                             
            default:
                return res.status(400).json({sucess : false , message : "Invalid Field"});
           }

        const updatedUser = await User.findByIdAndUpdate(
            userId , 
            updateData , 
            { new : true , runValidators : true}
          ); 

          res.json({sucess : true , message : updatedUser})
 
    }catch(error) {
        res.status(400).json({sucess : false , message : error.message})
    }


}



