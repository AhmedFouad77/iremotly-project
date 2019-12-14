const userModel=require("../models/user.model");
const compModel=require("../models/company.model");
const chatModel=require("../models/chat.model");
const publicKey = 'This Is Any Secret Key To Encrypt Mu Data';
// const cookiesToken = req.cookies.MYtoken;
// var decode = jwt.verify(cookiesToken, publicKey);
// req.userData = { email: decode.user,Id:decode.Id,Role:decode.Role };

exports.checkChat=(req,res)=>{
    if( req.cookies.MYtoken){
        var decode = jwt.verify(cookiesToken, publicKey);
        let signeduserId=decode.Id;
        let showedUser=req.params.id;
        let userRole=decode.Role;
        if(userRole=="User");
    }
}