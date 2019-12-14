const userFeedMod=require("../models/feedbackUser.model");

//create User Feedback
exports.createfedUser=(req,res)=>{
    let feed=new userFeedMod({
        feededUser:req.body.feededUser,
        feddedCompany:req.body.feddedCompany,
        degree:req.body.feedbackValue,
        feedDescrption:req.body.feedDescrption,
        companyName:req.body.companyName
    })
    let id=req.body.feededUser;
    feed.save((err,result)=>{
        if(err){
             res.json(err);
        }
         res.redirect('/userPage/'+id);
    })
}

//edit User Feedback
// exports.editfedUser=(req,res)=>{
//     let id=req.body.feededUser;
// userFeedMod.updateOne({feededUser:req.body.feededUser,feddedCompany:req.body.feddedCompany},{
//     $set:{
//         feededUser:req.body.feededUser,
//         feddedCompany:req.body.feddedCompany,
//         degree:req.body.degree,
//         feedDescrption:req.body.feedDescrption,
//         companyName:req.body.companyName  
//     }
// },(err)=>{
//     if(err){
//          res.json(err);
//     }
//      res.redirect('/userPage/'+id);
// }
//     )
// }

//Delete FeedBack 
exports.deletefedUser=(req,res)=>{
    let id=req.body.feededUser;
    userFeedMod.deleteOne({_id:req.params.id},(err)=>{
        if(err){
             res.json(err);
        }
        else{
            res.redirect('/userPage/'+id);
        }
    })
}
