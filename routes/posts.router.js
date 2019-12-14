const router = require('express').Router();
const postCont = require('../controllers/post.controller');
var moment = require('moment-timezone');

// My Route
router.get('/', postCont.postPage);
router.post('/save', postCont.createPost);
//, valid.valid
router.get('/getPostData', postCont.getData);

// function Made The Usr Can Apply in Any Post
router.post('/apply',postCont.apply);

// function get The Users That Applied In Only Post
router.get('/usersApplied/:id', postCont.usersApplied); // /:id about post
router.get('/dashbordPost', postCont.dashbordPost); // dashbord For Posts

// Get All Posts In Collecton
router.get('/allDataPosts', postCont.allDataPosts);// Page Find Jobs

// Get The Company who created This Post
router.get('/companyCreate/:_id', postCont.companyCreate);

//Get Page Hire Now 
router.get('/hireUser/:idUser/:idPost', postCont.HireNowPage);

// Post Hire Now And Send Email To User Theat He Applied In Job
router.post('/hireUserNow' 
, (req,res,next)=>{
    var r = req.body.dateInterview +'T'+req.body.startTime;
    var x = moment(r).tz(moment.tz.guess());
    var y = Date.now();
    var t= moment(y).tz(moment.tz.guess());
    console.log(x.format());
    console.log(t.format());
    var xx = x.format();
    var yy = t.format();
    if(xx < yy){
       return  res.render('error',{title:'Sorry You Must Chose Date Greater Than Now And  Chose Time Greater Than 10 Minutes From Now',p:''});
        
        // if(xx < yy){
        //     res.render('error',{title:'Sorry You Must Chose Time Greater Than 10 Minutes From Now',p:''});
        // }else{res.render('error',{title:'Sorry You Must Chose Time Greater Than 10 Minutes From Now',p:''});}
    }else{
       return  next()
    }
}
, postCont.hireUserNow); 

// User Will Show The Page Thet Get Him To  Approve Or Cancel or Chang Meetting To InterView
router.get('/userApproveToInterView/:idPost/:idCompany' , postCont.userApproveToInterView);
// User Canceled To The Job
router.get('/userCancelJob/:companyID/:userID/:postID', postCont.userCancelJob);
// User Approved To The Job
router.get('/userApproveJob/:companyID/:userID/:postID', postCont.userApproveJob);
// user Change Metting Job
router.get('/userChangeMettingJob/:companyID/:userID/:postID', postCont.userChangeMettingJob);


// Company Add User To Cancel List
router.post('/compAddToCancelList/:idUser/:idPost',postCont.compAddToCancelList);

// compAddToShortlList
router.post('/compAddToShortlList/:idUser/:idPost',postCont.compAddToShortlList);
//userCancelapplicationJob
router.get('/userCancelApplicationJob/:postID',postCont.userCancelApplicationJob);

// stop This Job
router.get('/stopThisJob/:postID',postCont.stopThisJob);
// Get page Posts Stoped
router.get('/stopThisJobPage',postCont.stopThisJobPage);
// Repost Job
router.get('/RepostJob/:postID',postCont.RepostJob);

// DeleteJob
router.get('/DeleteJob/:postID',postCont.DeleteJob);

// completedJob
router.get('/completedJob/:postID',postCont.completedJob);
// completed This Job Page
router.get('/completedThisJobPage',postCont.completedThisJobPage)
module.exports = router;
