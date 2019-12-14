const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let application = new Schema({
    userApplication: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    postID: {
        type: Schema.Types.ObjectId,
        ref: "post"
    },
    comment:String,
    attachment: {type:String,default:"null"},
    fileExtention: {type:String,default:"null"},
    Date:       {type:String,default:"null"},
    company:{
        type:Schema.Types.ObjectId,
        ref: "company"
    },
    meeting:{
        type:Schema.Types.ObjectId,
        ref:'meetting'
    },
    Status:String,
    StatusUser:String,
    
});
module.exports = mongoose.model('application', application);