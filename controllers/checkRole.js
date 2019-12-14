const userModel=require("../models/user.model");
const companyModel=require("../models/company.model");
const jwt=require("jsonwebtoken");
const publicKey = 'This Is Any Secret Key To Encrypt Mu Data';


exports.checkUserRole=(req,res,next)=>{
    if(req.cookies.MYtoken){
        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);
        //req.userData = { email: decode.user,Id:decode.Id };
        userModel.findOne({_id:decode.Id},(err,data)=>{
            if(err){
                res.json(err)
            }else if(data){
                req.UserRole=data;
                req.role=data.role;
                next();
            }else{
                companyModel.findOne({_id:decode.Id},(err,company)=>{
                    if(err){
                        res.json(err);
                    }else{
                        req.UserRole=company;
                        req.role=company.role;
                        next();
                    }
                })
            }
        })
    }
    else{
        req.UserRole=null;
        next();
    }
}

// exports.checkUserRole=(req,res,next)=>{
//     if(req.cookies.MYtoken){
//         const cookiesToken = req.cookies.MYtoken;
//         var decode = jwt.verify(cookiesToken, publicKey);
//         //req.userData = { email: decode.user,Id:decode.Id };
//         userModel.findOne({_id:decode.Id},(err,data)=>{
//             if(!data){
//                 companyModel.findOne({_id:decode.Id},(err,company)=>{
//                             if(err){
//                                 res.json(err);
//                             }else{
//                                 req.UserRole=company;
//                                 req.role=company.role;
//                                 next();
//                             }
//                         })
//                     }else{
//                         req.UserRole=data;
//                             req.role=data.role;
//                             next();
//                     }

//         })
//     }
//     else{
//         req.UserRole=null;
//         next();
//     }
// }