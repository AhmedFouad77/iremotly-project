const Model = require('../../models/user.model');
const CompModel           = require('../../models/company.model');
const  JWT                = require('jsonwebtoken');
const publicKey           = 'This Is Any Secret Key To Encrypt Mu Data';


exports.isSignUp   = (req,res,next) =>{
    Model.findOne({email:req.body.email},(err,data)=>{
        if(data &&data.email){
            // res.redirect('/login');
            res.status(200).json('Email Is used !!')
        }else{
            //next();
            CompModel.findOne({email:req.body.email},(err,data)=>{
                if(data &&data.email){
                    res.status(200).json('Email Is used !!')
                }else{
                    next();
                }
            })
        }
    })
};

exports.IsLogin = (req,res,next)=>{
    var Token =  req.header('Authorization');
    let  cheek =  JWT.verify(Token,publicKey);
     Model.findOne({email:req.params.email},
         (err,data)=>{
             let user = data
            //  console.log(user.token);
             if(user.token == 'a'){
                 res.redirect('/')
             }else{
                //  next();
                CompModel.findOne({email:req.params.email},
                    (err,data)=>{
                        let user = data
                       //  console.log(user.token);
                        if(user.token == 'a'){
                            res.redirect('/')
                        }else{
                            next();
                        }
                    }
                )
             }
         }
     )
}
// Medal Waire To Delete
exports.ToDelete = (req,res,next) => {
    try{
    var Token =  req.header('Authorization');
    let  cheek =  JWT.verify(Token,publicKey);
    if(cheek){
        next();
    }
    } catch(err){res.status(200).json({'msg':'You Must Login Agin To Do This :( !!'})}
}

exports.verifyToken=(req,res,next)=>{

}
/*
exports.validLogin=(req,res,next)=>{
    const bearerHeader=req.headers['authorizations'];
    if(typeof bearerHeader !==undefined){
        console.log(bearerHeader)
        const bearer=bearerHeader.split(' ');
        const token=bearer[1];
        //const decodeToken=JWT.verify(token,publicKey);
        //req.userData={email:decodeToken.email};
        req.token=token;
        next();
    }else{
         res.json({
             message:"you are not authenticated"
         });
    }

}
*/
