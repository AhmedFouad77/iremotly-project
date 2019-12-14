const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let meetting = new Schema ({
    Company :{
        type : Schema.Types.ObjectId,
        ref:'company'
    },
    User : {
        type : Schema.Types.ObjectId,
        ref  : 'users'
    },
    Application : {
        type : Schema.Types.ObjectId,
        ref  : 'application'
    }, 
    DateInterView: String,
    StartTime:String,
    EndTime:String,
    Status : String,
    urlCompJoin:String,
    urlUserJoin:String,
});


module.exports = mongoose.model('meetting', meetting);