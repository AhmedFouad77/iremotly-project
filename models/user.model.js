const mongoose = require('mongoose');
// const userFeedback = require('../models/feedbackUser.model')
const schema = mongoose.Schema;
let user = new schema({
              firstName      :{type:String,required:true},//{type:String,minlength:3,maxlength:10,required:true} ,
              lastName       :{type:String,required:true},//{type:String,minlength:3,maxlength:10,required:true} ,
              email          :{type: String, require: true, index:true, unique:true,sparse:true},
              password       :{type:String,required:true},
              country        :String ,
              jopTitle       :String ,
              Description    :String,
              profilePhoto          :{type:String,default:"null"},
              coverPhoto          :{type:String,default:"null"},
              gender         :String,
              address        :String,//{type:String,minlength:20,maxlength:100},
             
              birthDate      :String,
             
              skills         :[{
                          skillName:String,
                          progress:Number
                             }],
               experience:[{
                  companyTitle:String,
                  startDate:String,
                  endDate:{type:String,default:"Till Now"},
                  jobtitle:String,
                  jopDesription:String
               }] ,
               
              englishLevel   :Number,
              motherLanguage :String,
              workedYears    :Number,
              phone          :String,
              
              education:[{
               certificateTitle:String,
               certStartDate:String,
               certEndDate:String,
            certificateDesription:String
            }] ,
              token           :String,
              //   Settings
             role             :{type:String,default:"User"},
              //Table
              resetToken     :String ,
              resetTokenExpiration  :String,
              //Table
              token           :String,
              contact:[{
               chatId:{
                type: schema.Types.ObjectId,
                ref: "chat"
               }
            }]
            //   feedBack: [userFeedback]
 },{timestamps:true});

//  user.pre('save', () => {})
//  user.post('delete', () => {
//     user.fin
//  })
module.exports= mongoose.model("users" , user);