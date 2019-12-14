const PostModel = require('../models/post.Model.js');
const CompModel = require('../models/company.model');
const mettingModel = require('../models/meettings.model');
const userApplication = require('../models/application.model');
const users = require('../models/user.model');
const JWT = require('jsonwebtoken');
const publicKey = 'This Is Any Secret Key To Encrypt Mu Data';
const Swal = require('sweetalert2');
const country =require("../models/country.model");
const Countries=country.country_list;
const multer = require("multer");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const axios = require('axios');
var moment = require('moment-timezone');// const Calendar = require('@fullcalendar/core');
// const dayGridPlugin = require('@fullcalendar/daygrid');



// This Is Post Page
exports.postPage = (req, res) => {
try{
   const cookiesToken = req.cookies.MYtoken;
   var decode = JWT.verify(cookiesToken, publicKey);
   var email = decode.user;
   
   CompModel.findOne({email:email}).then(
    (data)=>{
        if(data){
             try {
            res.render('postPage', {
            title: "Create New Post",
           user: data
        })
    
} catch (error) {
    res.status(404).json({ Message: "Authentication Failed", "e": error });
}
  }else{
      res.send('sorry Yau Are not a company')
  }
  })
} catch(e){ res.status(404).json({ Message1 : "Authentication Failed", Message2 :'Sorry You Are Not Acompany :( !!'});}
};



// Company Create New Post
exports.createPost = (req, res) => {
    const cookiesToken = req.cookies.MYtoken;
    var decode = JWT.verify(cookiesToken, publicKey);
    var email = decode.user;
    CompModel.findOne({email:email}).then(
        (data)=>{
            if(data){
                 try {
                     if(req.body.ageFrom<req.body.ageTo){
                         let ageRequired ='('+ req.body.ageFrom+'-'+req.body.ageTo +')';
                        let post = new PostModel({
                            creatorCompany:data._id ,
                            emailCompany:decode.user,
                            nameCompany:data.Name,
                            title: req.body.jobTitle,
                            content: req.body.content,
                            serviceLevel: req.body.serviceLevel,
                            jobType: req.body.jobType,
                            jobDuration: req.body.jobDuration,
                            skills:req.body.Skills,
                            ageRequired:ageRequired,
                            yearsOfExperience:req.body.yearsOfExperience,
                            // sexRequired:req.body.sexRequired,
                            english:req.body.english,
                            qualificationRequired:req.body.qualificationRequired,
                            Salary:req.body.Salary,
                        });
                        post.save((err) => {
                            if (err) {
                                res.status(200).json({ success: false, 'msg': err })
                            } else {
                            //    res.redirect("/companyPost/");
                            res.render('true',{title:'OK',p:'Post Created Successfully :)'})
                              
                            }
                        })
                     }else{
                         res.send('You must Age To Greater Than Age From')
                     }
        
    } catch (error) {
        res.status(404).json({ Message: "Authentication Failed", "e": error });
    }

            }
        }
    )    
};

//  // function get The Data of Post
exports.getData = (req, res) => {
    PostModel.findOne({ _id: req.body.postID }).populate('applyedUser').populate('creatorCompany').exec().then(post => {
        if (post) {
            return res.status(200).json({
                message: "fetcheedt",
                post: post
            })
        }
        res.status(404).json({
            message: "not found"
        })

    }).catch(err => {
        res.status(500).json({
            message: "failed",
            err
        })
    })
};


//  page Commint
exports.pageCommint =(req,res) => {
    res.render('commintPage',{
        id:req.params.id
    })
};



exports.apply = (req ,res) => {
    try{
    const cookiesToken = req.cookies.MYtoken;
    var decode = JWT.verify(cookiesToken, publicKey);
    var email = decode.user;
    if(req.files){
    // Start Storg
    users.findOne({ email: email }).then(
    (data) => {
    let USER = data;
    if (USER) {
        var UserID = USER._id
        // console.log(UserID);
        // console.log(req.body.PostID);
        // //////////////
        PostModel.findOne({_id:req.body.PostID}).then(
            post=>{
                // console.log(post);
                if(post.status == 'contonie'){
                    userApplication.findOne({ userApplication: UserID , postID:req.body.PostID}).then(
                        (Data) => {
                        if (Data && Data.postID == req.body.PostID) {
                            res.render('error',{title:"Soory :( " ,p :"You Can't Apply Again :(  !!"})
                            // return res.status(404).json({ success: false, 'msg': "Sorry You Can't Apply Again :(  !!" })
                        } else {
                            // Start Upload pdf
                            var UploedFile = req.files.atta;
                             if( UploedFile.mimetype  ==  'image/jpg'
                              || UploedFile.mimetype ==  'image/png'
                              ||UploedFile.mimetype  ==  'image/jpeg' 
                              ||UploedFile.mimetype  ==  'application/pdf'
                              ||UploedFile.mimetype  ==  'application/vnd.ms-excel'
                               ){
                
                            let fileExtension=UploedFile.name.split('.')[1];
                            //  To Save File In Server :)
                            // console.log(fileExtension);
                            var x  = Date.now();
                            UploedFile.mv("public/assets/attachment/"+UserID + x +"."+fileExtension,(err)=>{
                                if(err){
                                    res.json({Error:err});
                                }else{
                                    //res.redirect('/company/companySetting');
                
                                    // Start Apply
                                    
                                    const post = new userApplication({
                                        userApplication: UserID,
                                        postID: req.body.PostID,
                                        comment :req.body.comment,
                                        attachment :UploedFile.name,
                                        company :req.body.creatorCompany,
                                        fileExtention:fileExtension,
                                        Date: x,
                                        });
                                        post.save().then(createdPost => {
                                            res.render('true',{title:"OK",p: "You Applied Successfully :)",});
                                            // res.status(200).json({message: "You Applied Successfully :)",});
                                        }).catch(e =>{res.send('Error :( '+ e)});
                                        // End Apply
                                }
                            });
                                }else{
                                //    res.status(404).json({ success: false, msg: 'Sorry You must Chose attachment Pdf :) !!'})
                                res.render('error',{title:'Sorry :(',p:'You must Chose attachment Pdf :) !!'})
                                }
                                }
                        }).catch(e =>{res.send('Error :( '+ e)})
                }else{
                    res.render('error',{title:'Soory',p:' The Company not Allowd To Any one To Apply Now :('})
                }
            }).catch(e=>{res.render('erorr',{title:'Soory',p:' The Company not Allowd To Any one To Apply Now :('+e})})
  
       // ////////    //
             }else{res.status(404).json({ success: false, msg: 'You are not a user :))) !!'})}
            }).catch(e =>{res.send('Error :( '+ e)});
        }else{
        //    res.status(404).json({ success: false, msg: 'You must Chose attachment Pdf or any thing :) !!'})
        res.render('error',{title:'Sorry :(',p:'You must Choose attachment Pdf or any thing :) !! '})
        }
}catch(e){}
};


// function get The Users That Applied In Only Post
exports.usersApplied = (req, res) => {
    try{
        const cookiesToken = req.cookies.MYtoken;
        var decode = JWT.verify(cookiesToken, publicKey);
        var email = decode.user;
        // console.log(decode.Id);
     
        CompModel.findOne({email:email},(err,result)=>{
            if(!result){
                return res.render('error',{title:'Sorry ! ', p:'There are a proplem :( !!'})
            }else{
                  //  res.send('msg : Sorry you are not a company :( !!');
                    var user = result;
                    PostModel.findOne({_id: req.params.id ,creatorCompany:result._id}).then(
                    comp=>{
                        if(!comp){
                            res.render('error',{title:'Sorry !',p:"You Are Not Authorized To Show This Post Detailes :(((!"})
                        }else{
                     userApplication.find({ postID: req.params.id ,company : result._id}).populate('userApplication').populate('meeting').then( //.populate('postID')
                    (data) => {
                        if (data){
                            // console.log(data);
                            ///Start LOOP
                             res.render('usersApplied', //usersApplied  appliedUsers
                            {
                                  title:"Users Applied",
                                  user:user,
                                  data:data,
                                 // urlCompJoin :  'http://vcrs.tk/api/attendees/35f40267-0925-4253-9b54-fbca2845d31b/join'//  
                             })
                             ///END LOOP
                    }else{ 
                            // res.render('usersApplied', //usersApplied  appliedUsers
                            // {
                            //       title:"Users Applied",
                            //       user:user,
                            //       data:data
                            //  })
                            res.render('error',{title:'Sorry !',p:'No User Apply Untill Now :('})
                            }
                    }
                ).catch((e) => { res.status(404).json({ success: false, 'ERROR': e }); }) 
            }  }).catch(e=>{ res.render('error',{title:'Sorry !',p:"You Are Not Authorized To Show This Post Detailes :(((!  "+e})})
            }
        })
}catch(e){ 
    res.render('error',{title:'ERROR :)',p:'Sorry You Are Not A Company :(' })
    // res.status(404).json({ success: false, 'ERROR': e });
};
};

// page get the Dashbord  posts tp comany
exports.dashbordPost = (req,res) => {
    try{
    const cookiesToken = req.cookies.MYtoken;
    var decode = JWT.verify(cookiesToken, publicKey);
    var email = decode.user;
    var idUser = decode.Id;
    CompModel.findOne({email:email},(err,data) => {
        if(err){
            return res.status(404).json({msg : 'Sorry there are a proplem :( !!'})
        }else{
            if(!data){
                //res.send('msg : Sorry you are not acopmany :( !!')
                users.findOne({_id:idUser}).then(
                     user=>{
                        userApplication.find({userApplication:idUser}).populate('postID').populate('meeting').then(
                            posts=>{
                                    res.render('dashboardOngoingjob',
                                    {
                                        title:"dashboardOngoingjob",
                                        user:user ,
                                        result:posts,
                                       role:'user', 
                                    })
                         }).catch(e=>{res.render('error',{title:'Error',p:'This User Not Applied To Any job Before  :('});})
                     }).catch(e=>{res.render('error',{title:'Error',p:'This User Not Found :('})})
            }else{
                    var id = data._id;
                    console.log('This is The ID :(  '+ id);
                    PostModel.find({creatorCompany:id}).then(
                        result => {
                            console.log('This Is Posts :)  '+ result);
                            res.render('dashboardOngoingjob'
                            ,{
                                title:"dashboardOngoingjob",
                                user:data ,
                                result:result,
                                role:'company' 
                            });
                        }
                    )
                    }
        }
    })
    } catch(e){res.status(404).json({msg : 'Sorry there are a proplem :( !!'})}
};

// function To Git All Posts in I Remotly

exports.allDataPosts = (req,res) => {
    const cookiesToken = req.cookies.MYtoken;
    if(!cookiesToken){
        // user is Annonomas
        PostModel.find().exec().then(  //.select('title content _id creatorCompany nameCompany')
        result => {
        if(!result){
            return  res.status(404).json({
                message: "not found"
                })
        }else{
            res.render('joblisting',
                            {title:'Find Job',
                            user : null, // you must validate the user if company or user or null (you con know that from token);
                            posts: result,
                            Countries:Countries,
                            // userId:  userId
                        });
                        console.log(posts);
               
            }
        }).catch((e)=>{res.send('Error'+ e)})
    }else{
        //search in Company Model
        var decode = JWT.verify(cookiesToken, publicKey);
        //req.userData = { email: decode.user,Id:decode.Id };
        let userId=decode.Id;
        CompModel.findOne({_id:userId},(err,data)=>{
            if(err){



                //res.redirect("/companyPost/allDataPosts");
                return res.render('error',{title:'Sorry',p:err})
            }else if(!data){
            //    search in users
            var decode = JWT.verify(cookiesToken, publicKey);
            let userId=decode.Id;
            users.findOne({_id:userId},(err,data)=>{
                if(err){}else{
                    if(data){
                        PostModel.find().exec().then( //.select('title content _id creatorCompany nameCompany')
                        result => {
                        if(!result){
                            return  res.status(404).json({
                                message: "not found"
                                })
                        }else{
                            res.render('joblisting',
                                            {
                                           title:'Find Job',
                                            user :data , // you must validate the user if company or user or null (you con know that from token);
                                            posts: result,
                                            Countries:Countries,
                                            userId:  userId
                                        });
                                        console.log(posts);
                               
                            }
                        }).catch((e)=>{res.send('Error'+ e)})
                    }
                }
            })
            // end search in user
             }else{
                PostModel.find().exec().then( //.select('title content _id creatorCompany nameCompany')
                result => {
                if(!result){
                    return  res.status(404).json({
                        message: "not found"
                        })
                }else{
                    res.render('joblisting',
                                    {title:'Find Job',
                                    user : data, // you must validate the user if company or user or null (you con know that from token);
                                    posts: result,
                                    Countries:Countries,
                                    userId:  userId
                                });
                                console.log(posts);
                       
                    }
                }).catch((e)=>{res.send('Error'+ e)})
             }//search in users Model
          })
     }
};
//more Detail About Job
// exports.jobSingle=(req,res)=>{
//     var id = req.params.id;
//     res.render("jobsingle",{
//         title:"Job Details",
//         user: null
//     });
// };

// //to aplly on Job
// exports.applyJob=(req,res)=>{
//     res.render("applyJob",{
//         title:"Apply Job",
//         user:null
//     });
// }
// get the page of company that created post
exports.companyCreate=(req,res)=>{
    CompModel.findOne({_id:req.params._id}).then(
(company)=>{
    console.log(company);
    if(!company){
        // res.redirect('/');
        res.status(404).json({'success': false , 'msg':"This Company Deleted From Website :( !!"});
    }else{
        res.render("companysingle",{
            title: company.Name,
            user:company
            });    
        // res.status(404).json({'success': false});
    }
}
).catch((err)=>{
    if(err){
        res.status(404).json({'success': false , 'msg':"This Company Deleted From Website :( !!"});
    }
});
};

// Hire NowPage
exports.HireNowPage = (req,res) =>{
    try{
        const cookies = req.cookies.MYtoken;
        const decode = JWT.verify(cookies,publicKey);
        var idCompany = decode.user;
        console.log(idCompany);
        CompModel.findOne({ email : idCompany }).then(
            result =>{
                if(!result){
                    res.status(404).json({'success': false , 'msg':"SORRY You ARE NOT A COMOANY :( !!"});
                }else{
                    users.findOne({ _id : req.params.idUser}).then(
                        user =>{
                            if(!user){
                                res.status(404).json({'success': false , 'msg':"SORRY THIS USER NOT FOUND :(!!"});
                            }else{
                                res.render('hireNowPage',{
                                    title:'Hire Now ;)',
                                    user : result, // you must validate the user if company or user or null (you con know that from token);
                                    uApply: user,
                                    Countries:Countries,
                                    userId:  idCompany,
                                    idPost : req.params.idPost
                                })
                            }

                        }).catch(e =>{res.status(404).json({'success': false , 'msg':" SORRY THIS USER NOT FOUND :( !!"});})
                }

            }).catch(e =>{}); // compModel.then

    } catch(e){ res.status(404).json({'success': false , 'msg':"Sorry There are a Proplem :( !!"});}
};

// Post Hire Now And Send Email To User Theat He Applied In Job
exports.hireUserNow = (req,res) => {
 try{
    const cookies = req.cookies.MYtoken;
    const decode = JWT.verify(cookies,publicKey);
    var idCompany = decode.user;
    CompModel.findOne({ email : idCompany }).then(
    result =>{
        if(!result){
            res.status(404).json({'success': false , 'msg':"SORRY You ARE NOT A COMOANY :( !!"});
        }else{
            users.findOne({ _id : req.body.idUser}).then(
            user =>{
                if(!user){
                    res.status(404).json({'success': false , 'msg':"SORRY THIS USER NOT FOUND :(!!"});
                }else{
                    userApplication.findOne({userApplication:user._id, postID :req.body.idPost , company:result._id}).then(
                        post=>{
                            if(!post){
                                res.render('error',{title:'Sorry :(',p:'You Can Not Accept This User Because He Not Apply On Your Job !!'})
                            }else{
                    //check if This User Apply in Post That Have This Company
                    const emailUser =  user.email;
                    // console.log(emailUser);
                    userApplication.findOneAndUpdate({postID:  req.body.idPost , userApplication:  req.body.idUser},{$set:{Status:'ACCEPTED'}},
                        (err,data)=>{
                            if(data){
                                var application = data._id;
                            mettingModel.findOne({User:req.body.idUser , Application : application,Company:result._id ,company:result._id}).then(
                                    (data) => {
                                        // if(!data){
                                // Start FindOne And Update
                                // Get GMT
                                var r = req.body.dateInterview +':'+req.body.startTime;
                                var d = new Date(r)
                                // console.log(req.body.dateInterview +':'+req.body.startTime);
                                //Date.now();
                                // var R = moment(e).tz('America/Los_Angeles')
                                var t = moment(d).tz(moment.tz.guess());
                                // moment.tz.guess()
                                // console.log(t);
                                // End GMT
                           let metting = new mettingModel({
                                    Company:result._id,
                                    User:req.body.idUser,
                                    Application : application,
                                    DateInterView: t , 
                                    // StartTime:req.body.startTime,
                                    // EndTime:req.body.EndTime,
                           });
                           metting.save().then(
                            (err)=>{
                                if(!err){
 
                                }else{
                                    mettingModel.findOne({User:req.body.idUser , Application : application,Company:result._id}).then(
                                        met=>{
                                            userApplication.findOneAndUpdate({postID:  req.body.idPost , userApplication:  req.body.idUser},{$set:{meeting:met._id}},
                                                (err,RES)=>{
                                                    if(err){}else{
                                                                       // START SEND EMAIL TO USER
                                var client = nodemailer.createTransport({
                                    service: 'SendGrid',
                                    auth: {
                                        user: 'AhmedFouad77',
                                        pass: '123456@Aa'
                                    }
                                    });
                                    let id = result._id;
                            
                                var email = {
                                    from: 'I-Remotly@bar.com',
                                    to: emailUser,
                                    subject: 'Congratulation :)',
                                    text: 'Hello world',
                                    html: `<h1>
                                    Congratulation :) You are Applied in New Job 
                                    </h1>
                                    <p>To Show Your meetin To InterView <a href="http://192.168.1.137:8080/companyPost/userApproveToInterView/${req.body.idPost}/${result._id}">please click here :)!</a></p>
                                    `
                                };
                                client.sendMail(email, function(err, info){
                                    if (err ){
                                        console.log(err);
                                    }
                                    else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });
                            // END  SEND EMAIL TO USER
                               res.render('true',{title:'OK',p:'User Accepted Successully :)'})
                                //  res.send('User Approved')
                                                    }
                                                })
                                        }
                                    )
                                }
                            }
                           )
                     // End FindOne And Update
                // }else{ res.status(404).json({'success': false , 'msg':"SORRY You Can not Hire This User Agin On The Same Job :(!!"});}
            }).catch (e => { });   //here
                            }
                        })
                //end Of Check
            }
        }
    ).catch(e=>{ res.render('error',{title:'Sorry :(',p:'You Can Not Accept This User Because He Not Apply On Your Job !!'})})
    }
}).catch(e =>{res.status(404).json({'success': false , 'msg':" SORRY THIS USER NOT FOUND :( !!"});})
}
}).catch(e =>{res.status(404).json({'success': false , 'msg':" SORRY THIS USER NOT FOUND :( !!"});}); // compModel.then
} catch (e) {res.status(404).json({'success': false , 'msg':" SORRY THIS USER NOT FOUND :( !!" , "E":e});}   
}

// user Approve Page To InterView
exports.userApproveToInterView = (req,res) => {
 try {
    var cookies = req.cookies.MYtoken;
    var decode = JWT.verify(cookies,publicKey);
    var id = decode.Id;
    
    users.findOne({_id:id}).then(
     user=>{
         if(!user){
            res.status(404).json({'success': false , 'msg':" SORRY THIS USER NOT FOUND :( !!" , "Error User":e});
         }else{
            PostModel.findOne({_id:req.params.idPost}).then(
                post =>{
                    if(!post){
                        res.status(400).json({"You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again ":'No Post'});
                    }else{
                        CompModel.findOne({_id:req.params.idCompany}).then(
                            company =>{
                                if(!company){
                                    res.status(400).json({"You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again ":"No Company"});
                                }else{
                                    userApplication.findOne({postID:req.params.idPost ,userApplication: id ,company:company._id}).then(
                                        application =>{
                                            var ApplicationID = application._id;
                                            //console.log(ApplicationID);
                                                if(!application){
                                                    res.render('error',{title:'Sorry :(',p:'You Not Authorized To Do Tthis :(('})
                                                }else{
                                            mettingModel.findOne({User:id , Company:req.params.idCompany ,Application:ApplicationID}).then(
                                                metingData => {
                                                    if(!metingData){
                                                        {res.render('error',{title:'ERROR',p:'Sorry You Not Apply To This Job :('})}
                                                    }else{
                                                        //Start moment 
                                                        // var r = metingData.DateInterView +'T'+ metingData.StartTime+':00';
                                                        var r = metingData.DateInterView;
                                                        var e =  r;//Date.now();
                                                        // var R = moment(e).tz('America/Los_Angeles')
                                                        var t = moment(e).tz(moment.tz.guess());
                                                        // moment.tz.guess()
                                                        console.log(t);
                                                        //  console.log(R); 
                                                        //  console.log(r)
                                                        //End moment
                                                res.render('userApproveToInterView',{
                                                    title: "user Approve To InterView",
                                                    user: user,
                                                    Countries:Countries,
                                                    post:post,
                                                     application:metingData,
                                                    company:company,
                                                    userId:  id,
                                                   // applicationID:ApplicationID,
                                                    companyID:company._id,
                                                    postID:post._id,
                                                    t:t,

                                                    });
                                            }
                                                }
                                            ).catch(e => { res.render('error',{title:'Sorry :(',p:'You Not Authorized To Do Tthis :(('+e});})
                                        }
                                        }
                                    ).catch(e=>{ res.render('error',{title:'Sorry :(',p:'You Not Authorized To Do Tthis :(('})})
                                }
                            }
                        ).catch(e=>{res.render('error',{title:'ERROR',p:'Sorry Not Find This Company  :('})})
                    }
                }
            ).catch(e=>{ {res.render('error',{title:'ERROR',p:'Sorry This Post Deleted :('})}})
         }
     }
    ).catch(e=>{  res.render('error',{title:'Sorry :(',p:'You Not Authorized To Do Tthis :(('});}) // End The find
  } catch(e){ res.render('error',{title:'Sorry :(',p:'You Must Login And To This :(('+e})}
};




// User Canceled The Job
exports.userCancelJob = (req,res)=>{
    try{
    var cookies = req.cookies.MYtoken;
    var decode = JWT.verify(cookies,publicKey);
    var id = decode.Id;
    
    users.findOne({_id:id}).then(
        user=>{
        if(!user){
            res.render('error',{title:'Sorry :(',p:'This User Not Found :((('})
        }else{
        var companyID = req.params.companyID;
        var userID = req.params.userID;
        var postID = req.params.postID;
        userApplication.findOne({company:companyID,userApplication:id,postID:postID}).then(
            result=>{
                if(!result){
                    res.render('error',{title:'Sorry :(',p:'You Not Authorized To Do Tthis :(('})
                }else{
                    if(!result.StatusUser){
                userApplication.findOneAndUpdate({company:companyID,userApplication:id,postID:postID},{$set:{StatusUser:"Canceled By User"}}).then(
                    metting => {
                        res.send("Canceled successfully :)");
                    }).catch(e =>res.render('error',{title:'Sorry :(',p:'Not Found This Meeting '}))
                }else{
                    res.render('error',{title:'Sorry :(',p:'You Already Send Your Action !'})
                }
            
        }
        }).catch(e=>{res.render('error',{title:'Sorry :(',p:'You Cant Not Do This Becouse You Already Sent You Action '})})
    }
    }).catch(e=>{ res.send("You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again");}) // End The fin};
} catch(e){res.send("You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again");}
};


// User Approve The Job
// exports.userApproveJob = (req,res) =>{
// try{
// var cookies = req.cookies.MYtoken;
// var decode = JWT.verify(cookies,publicKey);
// var id = decode.Id;

// users.findOne({_id:id}).then(
// user=>{
//     if(!user){
//         res.status(404).json({'success': false , 'msg':" SORRY THIS USER NOT FOUND :( !!" , "Error User":e});
//     }else{
//         var companyID = req.params.companyID;
//         var userID = req.params.userID;
//         var postID = req.params.postID;
//     userApplication.findOne({company:companyID,userApplication:id,postID:postID}).populate('Company').populate('User').then(
//         result=>{
//             if(!result){
//                 res.render('error',{title:'Sorry :(',p:"You Are Not Authorized To This  :("})
//             }else{
//         if(!result.StatusUser){
//             if(result.Status == 'Canceld By Company'){
//           res.render('error',{title:'Sorry :(',p:"You Can Not Approve Because The Company Add You To Cacel List :("})
//             }else{
//             userApplication.findOneAndUpdate({company:companyID,userApplication:id,postID:postID},{$set:{StatusUser:"Approved By User"}}).populate('meeting').then(
//             metting => {
//                 // res.send("Approved successfully :)");
//                 // Start Create VCR
// console.log(metting);
// // Start Get The Token

//     axios.post('http://vcrs.tk/api/oauth/token', {
//         "client_id": "37eb8577-5223-44d8-a796-90de285c7c7f",
//         "client_secret": "IGQZ8xkCeKDAV8pArQpKwTpmcbYWfP8Wv9c5zK3t",
//         "grant_type": "client_credentials"
//       })
//       .then(function (response) {
//         // console.log(response.data.access_token);
//       var   g = response.data.access_token;
//     //   console.log(' \"start_at : " metting.DateInterView+\'T'+ metting.StartTime+'00:00');
//     //   console.log('  StartTime = '+ metting.meeting.StartTime);
//     //   console.log( '  Company = '+ metting.meeting.Company);
//     //   console.log( '  User = '+ metting.meeting.User);
//     //   console.log(  '  EndTime = '+ metting.meeting.EndTime );
//     //   console.log( metting.Company);
//          var c  = {
//             headers: {
//                 'Authorization': 'Bearer ' + g,
//                 // Authorization:{'Access Token': g },
//                 'Content-Type':'application/json',
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json;charset=UTF-8' ,
                
//              },
//            }
//         //    Start The Data
//         var data = {
//             "start_at": metting.meeting.DateInterView+'T'+ metting.meeting.StartTime+':00+00:00' , //"2019-12-18T01:53:54+00:00"+
//             "attendees": [
//                 {
//                     "type": "TRAINER",
//                     "full_name": "MAXLAX",
//                     "avatar_url": "",
//                     "meta": metting.meeting.Company   // "945394853089203234958A"
//                 },
//                 {
//                     "type": "TRAINEE",
//                     "full_name": " Saied",
//                     "avatar_url": "",
//                     "meta": metting.meeting.User //"945394853089203234958B"
//                 }
//             ],
//             "duration_in_minutes": 40 // "40" +
//           }
//     //    End The Data
//           axios.post('http://vcrs.tk/api/vcrs' , data , c)
//           .then(function (response) {
//               console.log(response.data.data);
//             //console.log(' TJIS IS RESPONSE :)))'+response.body);
//             //console.log(g)
//             for(let i of response.data.data.attendees ){
//                 console.log('type =  '+ i.type);
//                 console.log('name =  '+i.full_name);
//                 console.log('photo =  '+i.avatar_url);
//                 console.log('url =  '+i.join_url);
//                 console.log('meta =  '+i.meta);
//                 console.log('-----------------------------');
//                 console.log(companyID);
//                 console.log(id);
//                 console.log(result._id);
//                 mettingModel.findOneAndUpdate({company:companyID , User:id , Application:result._id},
//                     {$set:{
//                         urlCompJoin:i.join_url,
//                         urlUserJoin:i.join_url
//                     }}).then(
//                         met=>{
//                             if(!met){
//                                 return res.send("Soory NoT Found Meeting :(("+met);
//                             }else{
//                                 res.render('true',{title:'OK :)' ,p:'Approved successfully :)'})
//                             }
//                         }
//                     ).catch(e=>{ res.render('true',{title:'OK :)' ,p:'Approved successfully :)'+e})})
//               }
             
//           })
//           .catch(function (error) {
//             console.log(error);
//           })
//       })
//       .catch(function (error) {
//         // console.log(error);
//       });
//     // End VCR
// // res.render('true',{title:'OK :)' ,p:'Approved successfully :)'})
//                 }).catch(e =>{res.send("Soory NoT Found Meeting :(( "+e);})
//             }
//         }else{res.render('error',{title:'Sorry :(',p:'You Cant Not Do This Becouse Your Already Sent You Action '})}
//     }
//         }).catch(e=>{res.render('error',{title:'Sorry :(',p:'You Cant Not Do This Becouse Your Already Sent You Action '+e})})
//         // userApplication.findOneAndUpdate({_id:req.params.applicationID},{$set:{StatusUser:"Approved By User"}}).then(
//         //     metting => {
//         //         res.send("Approved successfully :)");
//         //     }).catch(e =>{res.send("Soory NoT Found Meeting :((");})
//     }
// }).catch(e=>{ res.send("You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again");}) // End The find
// } catch(e){res.send("You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again");};
// };

// User Chang Meething The Job
exports.userChangeMettingJob = (req,res)=>{
    try{
        var cookies = req.cookies.MYtoken;
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        users.findOne({_id:id}).then(
            user=>{
                if(!user){
                   res.status(404).json({'success': false , 'msg':" SORRY THIS USER NOT FOUND :( !!" , "Error User":e});
                }else{
                var companyID = req.params.companyID;
                var userID = req.params.userID;
                var postID = req.params.postID;
                    userApplication.findOne({company:companyID,userApplication:id,postID:postID}).then(
                        result=>{
                            if(!result.StatusUser){
                                userApplication.findOneAndUpdate({company:companyID,userApplication:id,postID:postID},{$set:{StatusUser:"User Want Change Metting "}}).then(
                                    metting => {
                                        res.send("We Send This Requst To The Company :)");
                                    }).catch(e =>{res.send("Soory NoT Found Meeting :((");})
                            }else{res.render('error',{title:'ERROR :)',p:'You Cant Not Do This Becouse You Already Sent You Action :('})}
                        }).catch(e=>{ res.render('error',{title:'ERROR :)',p:'Sorry You Are Not A Applied To This Job :('})})
                    // userApplication.findOneAndUpdate({_id:req.params.applicationID},{$set:{StatusUser:"User Want Change Metting "}}).then(
                    //     metting => {
                    //         res.send("We Send This Requst To The Company :)");
                    //     }).catch(e =>{res.send("Soory NoT Found Meeting :((");})
                }
            }).catch(e=>{ res.send("You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again");}) // End The find
    } catch(e){ res.render('error',{title:'ERROR :)',p:'Sorry You Are Not A User :('})}
};

// compAddToCancelList
exports.compAddToCancelList = (req,res) =>{
    try{
        var cookies = req.cookies.MYtoken;
        
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        var idUser = req.params.idUser;
        var idPost = req.params.idPost;
       
        CompModel.findOne({_id:id}).then(
            comp=>{
                userApplication.findOne({userApplication:idUser, postID:idPost}).then(
                    result =>{
                        if(result.Status == 'ACCEPTED'){
                            res.render('error',{title:'ERROR :)',p:'Sorry This User Is Hired By You  :)'})

                        }else{
                            userApplication.findOneAndUpdate({userApplication:idUser, postID:idPost},{$set:{Status:'Canceld By Company'}}).then(
                                result =>{ if(result){
                                    userApplication.find({ postID:idPost }).populate('userApplication').then( //.populate('postID')
                                    (app) => {
                                        if (app){
                                        console.log(app);
                                    //   res.send(' Add To Cancel List Successfully :) ;)')
                                        // res.redirect('/companyPost/usersApplied/'+idPost)
                                        res.render('true',{title:"OK ;)",p:'Added To Cencel List Successfully :)'})
                                    }else{  res.send('msg : Sorry This Post Deleted:( !!');}
                                    }
                                    ).catch((e) => { res.status(404).json({ success: false, 'ERROR': e }); })
                                }
                                }).catch(e =>{ res.render('error',{title:'ERROR :)',p:'Sorry You Are Not A Company :('})})//End Update Application
                        }
                    }
                ).catch(e=>{})
                // userApplication.findOneAndUpdate({userApplication:idUser, postID:idPost},{$set:{Status:'Canceld By Company'}}).then(
                //   result =>{ if(result){
                      
                //     userApplication.find({ postID:idPost }).populate('userApplication').then( //.populate('postID')
                //     (app) => {
                //         if (app){
                //         console.log(app);
                //     //   res.send(' Add To Cancel List Successfully :) ;)')
                //         res.redirect('/companyPost/usersApplied/'+idPost)
                //     }else{  res.send('msg : Sorry This Post Deleted:( !!');}
                //     }
                //     ).catch((e) => { res.status(404).json({ success: false, 'ERROR': e }); })
                //   }
                // }).catch(e =>{ res.render('error',{title:'ERROR :)',p:'Sorry You Are Not A Company :('})})//End Update Application
            }).catch(e=>{ res.render('error',{title:'ERROR :)',p:'Sorry You Are Not A Company :('})})// End Find Company

    } catch(e){ res.render('error',{title:'ERROR :)',p:'Sorry You Are Not A Company :('+e}) , console.log(cookies);
    console.log(decode);
    console.log(id);}
};

// compAddToShortlList
exports.compAddToShortlList =(req,res) =>{
    try{
        var cookies = req.cookies.MYtoken;
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        var idUser = req.params.idUser;
        var idPost = req.params.idPost;
        CompModel.findOne({_id:id}).then(
            comp=>{
                userApplication.findOne({userApplication:idUser, postID:idPost}).then(
                    Result =>{
                        if(Result.Status == 'ACCEPTED'){
                            res.render('error',{title:'ERROR :)',p:'Sorry This User Is Hired By You  :)'})
                            
                        }else{
                            userApplication.findOneAndUpdate({userApplication:idUser, postID:idPost},{$set:{Status:'Add To Short Least'}}).then(
                                result =>{ if(result){
                                    userApplication.find({ postID:idPost }).populate('userApplication').then( //.populate('postID')
                                    (app) => {
                                        if (app){
                                        console.log(app);
                                    //   res.send(' Add To Cancel List Successfully :) ;)')
                                        // res.redirect('/companyPost/usersApplied/'+idPost)
                                        res.render('true',{title:"OK ;)",p:'Added To Shoort List Successfully :)'})
                                    }else{  res.send('msg : Sorry This Post Deleted:( !!');}
                                    }
                                    ).catch((e) => { res.status(404).json({ success: false, 'ERROR': e }); })
                                }
                                }).catch(e =>{ res.render('error',{title:'ERROR :)',p:'Sorry You Are Not A Company :('})})//End Update Application
                        }
                    }).catch(e=>{ res.send(e)})
                //End Update Application
            }).catch(e=>{
                res.render('error',{title:"false",p:'Sorry'})
                // res.status(404).json({ success: false, 'ERROR': e , "msg":"Not Find This Company"});
            })// End Find Company

    } catch(e){res.render('error'),{title:"false",p:'Sorry'}}
}


//User Can Cancel ApplicationJob
exports.userCancelApplicationJob = (req,res) =>{
    try{
        var cookies = req.cookies.MYtoken;
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        // var idUser = req.params.idUser;
        var postID = req.params.postID;
        users.findOne({_id:id}).then(
            user=>{
                userApplication.findOneAndUpdate({postID:postID, userApplication:id},{$set:{Status:'Canceled By User'}}).then(
                  result =>{ if(result){
                    res.send('All Is Oky Ya Sah ;)')
                  }
                }).catch(e =>{
                    res.render('error')
                    // res.status(404).json({ success: false, 'ERROR': e , "msg":"No canceld"});
                })//End Update Application
            }).catch(e=>{
                res.render('error')
                // res.status(404).json({ success: false, 'ERROR': e , "msg":"Not Find This Company"});
            })// End Find Company

    } catch(e){res.render('error')}
}


// Company  stop This Job 
exports.stopThisJob = (req,res) => {
try{
    var cookies = req.cookies.MYtoken;
    var decode = JWT.verify(cookies,publicKey);
    var id = decode.Id;
    var postID = req.params.postID;
    PostModel.findOneAndUpdate({_id:postID , creatorCompany:id},{$set:{status:'Stoped'}}).then(
        result=>{
            res.render('true',{title:'OK ;)',p:"This Job Stoped Successfuylly :)"})
        }).catch(e=>{res.render('error',{title:'Sorry',p:'This Post Not Found :('})});

} catch(e){res.render('error',{title:'Sorry',p:'There Are A Proplem Pleas try Agin :('})}
};
// stopThisJobPage
exports.stopThisJobPage =(req,res)=>{
    try{
        var cookies = req.cookies.MYtoken;
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        CompModel.findOne({_id:id}).then(
            company=>{
                if(!company){
                    res.render('error',{title:'Sorry :( !' ,p:"You Are Not A Company :(!!!!!!"})
                }else{
                    PostModel.find({creatorCompany:id, status:'Stoped'}).then(
                        result=>{
                            res.render('dashboardStopedJob',{
                                title:'Dashboard Stoped Job',
                                user:company ,
                                result:result,
                                role:'company'
                            })
                        }).catch(e=>{res.render('error',{title:'There Are Error :(' ,p:':(  !!'})})
                }
               
            }).catch(e=>{res.render('error',{title:'There Are Error :(' ,p:e+':('})})

    } catch(e){}
};
//RepostJob
exports.RepostJob =(req,res) =>{
    try{
        var cookies = req.cookies.MYtoken;
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        var postID = req.params.postID;
        PostModel.findOneAndUpdate({_id:postID , creatorCompany:id},{$set:{status:'contonie'}}).then(
            result=>{
                res.render('true',{title:'OK ;)',p:"This Job Reposted Successfuylly :)"})
            }).catch(e=>{res.render('error',{title:'Sorry',p:'This Post Not Found :('})});
    
    } catch(e){res.render('error',{title:'Sorry',p:'There Are A Proplem Pleas try Agin :('})}
};

// DeleteJob
exports.DeleteJob = (req,res) => {
    try{
        var cookies = req.cookies.MYtoken;
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        var postID = req.params.postID;
        PostModel.findOneAndUpdate({_id:postID , creatorCompany:id},{$set:{status:'Deleted'}}).then(
            result=>{
                res.render('true',{title:'OK ;)',p:"This Job Deleted Successfuylly :)"})
            }).catch(e=>{res.render('error',{title:'Sorry',p:'This Post Not Found :('})});
    
    } catch(e){res.render('error',{title:'Sorry',p:'There Are A Proplem Pleas try Agin :('})}
};


// completedJob
exports.completedJob = (req,res) =>{
    try{
        var cookies = req.cookies.MYtoken;
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        var postID = req.params.postID;
        PostModel.findOneAndUpdate({_id:postID , creatorCompany:id},{$set:{status:'Completed'}}).then(
            result=>{
                res.render('true',{title:'OK ;)',p:"This Job Completed Successfuylly :)"})
            }).catch(e=>{res.render('error',{title:'Sorry',p:'This Post Not Found :('})});
    
    } catch(e){res.render('error',{title:'Sorry',p:'There Are A Proplem Pleas try Agin :('})}
};

exports.completedThisJobPage = (req,res) =>{
    try{
        var cookies = req.cookies.MYtoken;
        var decode = JWT.verify(cookies,publicKey);
        var id = decode.Id;
        CompModel.findOne({_id:id}).then(
            company=>{
                if(!company){
                    res.render('error',{title:'Sorry :( !' ,p:"You Are Not A Company :(!!!!!!"})
                }else{
                    PostModel.find({creatorCompany:id, status:'Completed'}).then(
                        result=>{
                            res.render('dashboardCompletedjob',{
                                title:'Dashboard Completed Job',
                                user:company ,
                                result:result,
                                role:'company'
                            })
                        }).catch(e=>{res.render('error',{title:'There Are Error :(' ,p:':(  !!'})})
                }
               
            }).catch(e=>{res.render('error',{title:'There Are Error :(' ,p:e+':('})})

    } catch(e){}
}





exports.userApproveJob = (req,res) =>{
    try{
    var cookies = req.cookies.MYtoken;
    var decode = JWT.verify(cookies,publicKey);
    var id = decode.Id;
    
    users.findOne({_id:id}).then(
    user=>{
        if(!user){
            res.render('error',{title:"Sorry !!",p:'THIS USER NOT FOUND :( !!'})
            // res.status(404).json({'success': false , 'msg':" SORRY THIS USER NOT FOUND :( !!" , "Error User":e});
        }else{
            var companyID = req.params.companyID;
            // var userID = req.params.userID;
            var postID = req.params.postID;
        userApplication.findOne({company:companyID,userApplication:id,postID:postID}).populate('Company').populate('User').then(
            result=>{
                if(!result){
                    res.render('error',{title:'Sorry :(',p:"You Are Not Authorized To This  :("})
                }else{
            if(!result.StatusUser){
                if(result.Status == 'Canceld By Company'){
              res.render('error',{title:'Sorry :(',p:"You Can Not Approve Because The Company Add You To Cacel List :("})
                }else{
                    // console.log('companyID '+companyID);
                    // console.log('User ID'+id);
                    // console.log('Post ID'+postID);
                userApplication.findOneAndUpdate({company:companyID,userApplication:id,postID:postID},{$set:{StatusUser:"Approved By User"}}).populate('meeting').then(
                Application => {
                    // console.log(Application);
                    // console.log('This Is Application.meeting.DateInterView = ----' +Application.meeting.DateInterView)
        axios.post('http://vcrs.tk/api/oauth/token', {
            "client_id": "37eb8577-5223-44d8-a796-90de285c7c7f",
            "client_secret": "IGQZ8xkCeKDAV8pArQpKwTpmcbYWfP8Wv9c5zK3t",
            "grant_type": "client_credentials"
          })
          .then(function (response) {
            // console.log(response.data.access_token);
          var   g = response.data.access_token;
             var c  = {
                headers: {
                    'Authorization': 'Bearer ' + g,
                    // Authorization:{'Access Token': g },
                    'Content-Type':'application/json',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8' ,
                    
                 },
               }
            // Start Change The Form Of Date From Wed, 11 Dec 2019 2:40:29 GMT To Another
            var rrr=   moment(Application.meeting.DateInterView);
            console.log(rrr.format())
            //  console.log(Application.meeting.DateInterView);
            // console.log(rrr);
            var data = {
                "start_at":rrr.format(), //Application.meeting.DateInterView,//t ,// Application.meeting.DateInterView+'T'+ Application.meeting.StartTime , //"2019-12-18T01:53:54+00:00"+
                "attendees": [
                    {
                        "type": "TRAINER",
                        "full_name": "MAXLAX",
                        "avatar_url": "",
                        "meta": Application.meeting.Company   // "945394853089203234958A"
                    },
                    {
                        "type": "TRAINEE",
                        "full_name": " Saied",
                        "avatar_url": "",
                        "meta": Application.meeting.User //"945394853089203234958B"
                    }
                ],
                "duration_in_minutes": 40//Application.meeting.EndTime //40 // "40" +
              }
              axios.post('http://vcrs.tk/api/vcrs' , data , c)
              .then(function (response) {
                //   console.log(response.data.data);

                  //   Start
                // for(let i of response.data.data.attendees[0].join_url ){
                //     console.log('type =  '+ i.type);
                //     console.log('name =  '+i.full_name);
                //     console.log('photo =  '+i.avatar_url);
                //     console.log('url =  '+i.join_url);
                //     console.log('meta =  '+i.meta);
                //     console.log('-----------------------------');
                //     console.log(companyID);
                //     console.log(id);
                //     console.log(result._id);
                 

                //   }
                
                  var urlc = response.data.data.attendees[0].join_url
                  var urlu =response.data.data.attendees[1].join_url
                  console.log(urlc);
                console.log(urlu);
                  mettingModel.findOneAndUpdate({Company:companyID , User:id , Application:result._id},
                    {$set:{
                        urlCompJoin:urlc,
                        urlUserJoin:urlu
                    }},(err,doc)=>{
                        if(doc){
                            // conssole.log(' tHIS IS dOC = ---------   ' +doc);
                           // res.send('aLL iS oK' + doc);
                           res.render('true',{title:'OK',p:'Approved'})
                        }else{
                            // console.log('tHIS iS eRROR = ----------  '+ err);
                            res.send('Not oK' + err);
                        }
                    })
                    // .then(
                    //     met=>{
                    //         if(!met){
                    //             return res.send("Soory NoT Found Meeting :(("+met);
                    //         }else{
                    //             res.render('true',{title:'OK :)' ,p:'Approved successfully :)'})
                    //         }
                    //     }
                    // ).catch(e=>{ res.render('true',{title:'OK :)' ,p:'Approved successfully :)'+e})})
                //   End
              })
              .catch(error =>{
                // console.log(error);
                res.render('error',{title:'Sorry There Error',p:error})
            })
          })
          .catch(function (error) {
            // console.log(error);
            res.render('error',{title:'Sorry There Error',p:error})
          });
                    }).catch(e =>{res.send("Soory NoT Found Meeting :(( "+e);})
                }
            }else{res.render('error',{title:'Sorry :(',p:'You Cant Not Do This Becouse Your Already Sent You Action '})}
        }
            }).catch(e=>{res.render('error',{title:'Sorry :(',p:'You Cant Not Do This Becouse Your Already Sent You Action '+e})})
        }
    }).catch(e=>{ res.send("You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again");}) // End The find
    } catch(e){res.send("You are Not a User And You Not  Alowed To see The Page :(( Pleas Go To Login And come again");};
    };
















































































// Start VCR
function VCR(){
axios.post('http://vcrs.tk/api/oauth/token', {
    "client_id": "37eb8577-5223-44d8-a796-90de285c7c7f",
    "client_secret": "IGQZ8xkCeKDAV8pArQpKwTpmcbYWfP8Wv9c5zK3t",
    "grant_type": "client_credentials"
  })
  .then(function (response) {
    // console.log(response.data.access_token);
  var   g = response.data.access_token;
//   console.log(g);
     var c  = {
        headers: {
            'Authorization': 'Bearer ' + g,
            // Authorization:{'Access Token': g },
            'Content-Type':'application/json',
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8' ,
            
         },
       }
    //    Start The Data
    var data = {
        "start_at": "2019-12-18T01:53:54+00:00",
        "attendees": [
            {
                "type": "TRAINER",
                "full_name": "MAXLAX",
                "avatar_url": "",
                "meta": "945394853089203234958A"
            },
            {
                "type": "TRAINEE",
                "full_name": " Saied",
                "avatar_url": "",
                "meta": "945394853089203234958B"
            }
        ],
        "duration_in_minutes": "40"
      }
//    End The Data
      axios.post('http://vcrs.tk/api/vcrs',data ,c)
      .then(function (response) {
        console.log(response);
        console.log(g)
      })
      .catch(function (error) {
        // console.log(error);
      })
  })
  .catch(function (error) {
    // console.log(error);
  });
}
// VCR()

// End VCR
// const Postmodel   = require('../models/post.Model.js');
// const Compmodel   = require('../models/company.model');



// // This Is Post Page
// exports.postPage  = (req,res) => {
//     res.status(200).json({success:true , 'msg':'This Is Post Page'});
// };
// // Company Create New Post
// exports.createPost =(req,res) =>{
//     var Token = req.header('Authorization');
//     Compmodel.findOne({email:req.body.email}).then(
//         data => {
//             if(data&&data.token == Token){
//                 let post = new Postmodel({
//                     creatorCompany :req.body.creatorCompany,
//                     title   :req.body.title,
//                     content :req.body.content,

//                 });
//                 post.save((err)=>{
//                     if(err){
//                         res.status(200).json({success:false , 'msg':err})
//                     }else{
//                         res.status(200).json({success:true , 'msg':'Your Post Created Successfully :)'})
//                     }

//                 })
//             }else{res.status(200).json({success:false , 'msg':'You Must Login To Do This :)'})}
//         }
//         ).catch(err=>{
//             {res.status(200).json({success:false , 'msg':err})}
//         })
//     }

// // User Want to Apply For New Jop
// exports.apply = (req, res) => {
//    Postmodel.updateOne({_id: req.body.id}, {$push: {applyedUser: req.body.userId}}).then(
//        result => {
//            if(result) {
//               return res.status(201).json({
//                    message: "updated",
//                    result
//                })
//            }
//            res.status(404).json({
//                message: "not found"
//            })
//        }
//    ).catch(err => {
//        res.status(500).json({
//            message: "update failed"
//        })
//    })
// }

// //  get Data of Post
// exports.getdata = (req, res) => {
//     Postmodel.findOne({_id: req.body.id}).populate('applyedUser').populate('creatorCompany').exec().then(post => {
//         if(post) {
//           return res.status(200).json({
//                 message: "fetcheedt",
//                 post: post
//             })
//         }
//         res.status(404).json({
//             message: "not found"
//         })

//     }).catch(err => {
//         res.status(500).json({
//             message: "failed",
//             err
//         })
//     })
// }





//

 function VCR2() {
axios.post('http://vcrs.tk/api/oauth/token', {
    "client_id": "37eb8577-5223-44d8-a796-90de285c7c7f",
    "client_secret": "IGQZ8xkCeKDAV8pArQpKwTpmcbYWfP8Wv9c5zK3t",
    "grant_type": "client_credentials"
  })
  .then(function (response) {
  var   g = response.data.access_token;
     var c  = {
        headers: {
            'Authorization': 'Bearer ' + g,
            'Content-Type':'application/json',
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8' ,
            
         },
       }
    //    Start The Data
    var data = {
        "start_at" :   "2019-12-18T01:53:54+00:00",// metting.meeting.DateInterView+'T'+ metting.meeting.StartTime+':00+00:00' , 
        "attendees": [
            {
                "type": "TRAINER",
                "full_name": "MAXLAX",
                "avatar_url": "",
                "meta":"945394853089203234958A"// metting.meeting.Company   // 
            },
            {
                "type": "TRAINEE",
                "full_name": " Saied",
                "avatar_url": "",
                "meta":"945394853089203234958B" ,// metting.meeting.User //
            }
        ],
        "duration_in_minutes": 40 // "40" +
      }
//    End The Data
      axios.post('http://vcrs.tk/api/vcrs' , data , c)
      .then(function (response) {
          //console.log(response.data.data);
          for(let i of response.data.data.attendees ){
            console.log('type =  '+ i.type);
            console.log('name =  '+i.full_name);
            console.log('photo =  '+i.avatar_url);
            console.log('url =  '+i.join_url);
            console.log('meta =  '+i.meta);
            console.log('-----------------------------');
          }
        //console.log(' TJIS IS RESPONSE :)))'+response.body);
        //console.log(g)
      })
      .catch(function (error) {
        console.log(error);
      })
  })
  .catch(function (error) {
    // console.log(error);
  });

};
// VCR2();
//

function x(){
 const event = new Date();
//   const y  = n
console.log(event);
console.log(event.toGMTString());
}
// x()

function n(){
    var r=   moment('Wed, 11 Dec 2019 11:40:29 GMT');
    var x= new Date('Wed, 11 Dec 2019 11:40:29 GMT');
    console.log(r)
};
// n()