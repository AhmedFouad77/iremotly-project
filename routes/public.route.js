const express = require('express');
const router = express.Router();
const publicController=require("../controllers/public.controller");
const UserType=require("../controllers/checkRole");

router.get("",publicController.getHome);
router.get('/howitworks',UserType.checkUserRole,UserType.checkUserRole, publicController.getHowitworks);
router.get('/joblisting',publicController.getJobListing);
router.get('/jobSingle/:id',publicController.jobSingle);//more Detail About Job
router.get('/userlisting',publicController.getuserlisting);
router.get('/userlisting/:skill',publicController.getuserlistingSkill);
router.get('/companyGrid',publicController.getCompanyList);
router.get('/userPage/:id',publicController.userPage);
router.get('/companyProfile/:id',publicController.companyProfile);
// router.get('/postPage',publicController.postPage);
router.get('/applyJob/:id',publicController.applyJob);//to aplly on Job

router.get('/about', publicController.getAboutPage);
router.get('/privacyPolicy', publicController.getprivacyPolicy);
module.exports=router;
