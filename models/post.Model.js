const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let post = new Schema({
    creatorCompany: {
        type: Schema.Types.ObjectId,
        ref: "company"
    },
    nameCompany: String,
    emailCompany : String,
    title: String,
    content: String,
    serviceLevel:String,
    jobType:String,
    jobDuration:String,
    skills:[],
    ageRequired:String,
    yearsOfExperience:String,
    sexRequired:String,
    english:String,
    qualificationRequired:String,
    Salary:String,
    status:{type:String, default:'contonie'},

});
module.exports = mongoose.model('post', post);