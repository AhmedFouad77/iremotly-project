const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let chat=new Schema({

    users:[{
        type:Schema.Types.ObjectId,
        ref:'users'
    }],
   
    
})

module.exports=mongoose.model("chat",chat);