const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let messages=new Schema({
    chatId:{
        type:Schema.Types.ObjectId,
        ref:"chat"
    },
    content:String,
    sender:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    timestamp:Number,
    image:String
        
})

module.exports=mongoose.model("message",messages);

