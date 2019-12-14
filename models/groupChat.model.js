const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let groupChat=new Schema({

    users:[String],
    title:String,
    image:String,
    Admin:[String],
    
})

module.exports=mongoose.model("groupChat",groupChat);