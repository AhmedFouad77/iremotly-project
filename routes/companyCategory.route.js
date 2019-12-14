const express = require('express');
const router = express.Router();
const verify=require("../controllers/validToken");
const companyCategory=require("../controllers/companyCategory.controller");

router.get("/addPage",verify.valid,companyCategory.getAddPage);
router.post("/addPage",verify.valid,companyCategory.addCategory);
// router.post("/addPage/subCategory",verify.valid,companyCategory.addSubCategory);



module.exports=router;