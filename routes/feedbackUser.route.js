const express = require('express');
const router = express.Router();
const userFedCont=require("../controllers/feedbackUser.controller");

router.post("/createFeedUserBack",userFedCont.createfedUser);
// router.post("/createFeedUserBack/delete",userFedCont.editfedUser);
router.post("/createFeedUserBack/delete/:id",userFedCont.deletefedUser);

module.exports=router;