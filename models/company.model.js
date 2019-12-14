const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let companySchema  = new Schema({
    firstName:String,//{type:String,required:true,minlength:3},
    lastName:String,//{type:String,required:false},
    Description:String,
    departement:{
        type:Schema.Types.ObjectId,
        ref:'companyCategory'
    },
    contact:[{
        chatId:{
         type: Schema.Types.ObjectId,
         ref: "chat"
        }
     }],
    email:{type:String,require:true,unique:true,index:true,sparse:true},
    password:String,
    Name:{type:String,default:"Company"},
    profilePhoto:{type:String,default:"null"},
    coverPhoto:{type:String,default:"null"},
    country:String,
    phone:String,
    token:String,
    dateOfOrigin:{type:String},
    state:String,
    companySize:String,
    resetToken     :String ,
    resetTokenExpiration  :String,
    address:String,
    role:{type:String,default:"Company"},
});

module.exports = mongoose.model("company", companySchema);