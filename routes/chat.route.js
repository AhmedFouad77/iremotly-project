const express = require('express');
const router = express.Router();
const chatCont=require("../controllers/chat.controller");
const userloged=require("../controllers/checkRole");
const verify=require("../controllers/validToken");

router.post('/createChat',verify.valid,userloged.checkUserRole,chatCont.createChat);
router.get('/:id',verify.valid,userloged.checkUserRole,chatCont.getChat);
router.post('/createGroupChat',verify.valid,userloged.checkUserRole,chatCont.createGroupChat);

// router.get('/getcontacts', verify.valid,chatCont.getallContacts);
// router.post('/createMsg',verify.valid,chatCont.createMsg);

module.exports=router;