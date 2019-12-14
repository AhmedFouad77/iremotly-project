const express = require('express');
const router =express.Router();
const UserCont = require("../controllers/user.controller");
const valid   =require("../controllers/validToken"); 
const {body} = require('express-validator')


// user Routes
router.get('/signUp', UserCont.getSignUp);

router.post('/signUp', 
[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9\s-\s+\/\=!@#$%^&*]{8,16}$/).withMessage('password is invalid'),
//    // body('accountType').isBoolean().withMessage('accountType is invalid'),
//     body('userName').isAlpha().withMessage('please provide a valid user name'),
//    // body('address').isLength({min: 4}).withMessage('please enter a valid address'),
//    // body('phone').isMobilePhone().withMessage('please enter a valid phone')
],
UserCont.signUp);

router.post('/login' , UserCont.login);
router.get('/usersingle', valid.valid,UserCont.getUserProfile);
router.get('/profileSetting',valid.valid, UserCont.getProfileSetting);
router.get('/dashboard',valid.valid,UserCont.getUserdashboard);
router.post('/profileSetting/uploadProfilePhoto',valid.valid, UserCont.uploadProfilePhoto);
router.post('/profileSetting/uploadCoverPhoto',valid.valid, UserCont.uploadCoverPhoto);
// router.get('/getUsersList', UserCont.getUsersList);

//Update General Data
router.post('/updateData',valid.valid,  UserCont.updatePersonalData);

//Employee Skills
router.post('/profileSetting/addSkills',valid.valid, UserCont.addSkills);
router.post('/profileSetting/editSkills',valid.valid, UserCont.editSkills);
router.post('/profileSetting/deleteSkills',valid.valid, UserCont.deleteSkills);


//Employee Experience
router.post('/profileSetting/addExperience',valid.valid, UserCont.addExperience);
router.post('/profileSetting/editExperience',valid.valid, UserCont.editExperience);
router.post('/profileSetting/deleteExperience',valid.valid, UserCont.deleteExperience);


//Employee education 
router.post('/profileSetting/addEducation',valid.valid, UserCont.addEducation);
router.post('/profileSetting/editEducation',valid.valid, UserCont.editEducation);
router.post('/profileSetting/deleteEducation',valid.valid, UserCont.deleteEducation);

router.get('/myAccount',valid.valid,UserCont.getProfile);
router.delete('/deleteUser/:email',UserCont.delete_user);
router.post('/logout',UserCont.logout);
router.post('/changePassword',valid.valid,UserCont.changePassword);
router.post('/deleteAccount',valid.valid,UserCont.deleteAccount);


router.post('/reset',UserCont.resetPassword);
router.get('/getnewPassword/:token',UserCont.getNewPasswordPage);
router.post('/getnewPassword/:token',UserCont.getNewPassword);
// router.post('/VerifaiToken' , UserCont.VerifaiToken);
module.exports = router;