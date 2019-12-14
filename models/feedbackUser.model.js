const mongoose=require("mongoose");
const Schema = mongoose.Schema;

let userFeedback=new Schema({
    feededUser: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    feddedCompany: {
        type: Schema.Types.ObjectId,
        ref: "company"
    },
    companyName:String,
    degree:{type:Number},
    feedDescrption:{type:String,maxlength:200}
})

module.exports=mongoose.model('feedback',userFeedback);