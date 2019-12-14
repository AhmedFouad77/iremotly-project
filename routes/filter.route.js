const express = require('express');
const router = express.Router();
const filterController=require("../controllers/filter.controller");
const UserType=require("../controllers/checkRole");

router.get('/heaerSearch',UserType.checkUserRole,filterController.headerFilter);
router.get('/filterUser',UserType.checkUserRole,filterController.filterUser);
router.get('/filterCompany',UserType.checkUserRole,filterController.filterCompany);
router.get('/filterUserName',UserType.checkUserRole,filterController.filterUserName);
router.get('/filterCompanyName',UserType.checkUserRole,filterController.searchCompanyName);


module.exports=router;