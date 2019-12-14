const express = require('express');
const router = express.Router();
const howitworksController=require("../controllers/howitworks.controller");

router.get('/getpage',howitworksController.gethowitworks);

module.exports=router;