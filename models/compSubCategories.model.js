const mongoose=require("mongoose");
const Schema=mongoose.Schema;

let compSubCategories=new Schema({
    catTitle:String,
    parentCategory:{
        type:Schema.Types.ObjectId,
        ref:'companyCategory'
    }
},{timestamps:true})
module.exports=mongoose.model("compSubategory",compSubCategories);