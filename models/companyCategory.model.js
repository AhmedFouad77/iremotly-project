const mongoose=require("mongoose");
const Schema=mongoose.Schema;

let companyCategory=new Schema({
    categoryTitle:{type:String},
    companies:{
        type:Schema.Types.ObjectId,
        ref:'company'
    },
    
  
},{timestamps:true})


module.exports=mongoose.model('companyCategory',companyCategory);
