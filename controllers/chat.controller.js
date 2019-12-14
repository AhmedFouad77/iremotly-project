const chatModel=require("../models/chat.model");
const UserModel=require("../models/user.model");
const companyModel=require("../models/company.model");
const msgMoel=require("../models/messages.model");
const groupChat=require("../models/groupChat.model");

//create Chat
exports.createChat=async (req,res)=>{
    
   let accountOwner=req.body.accountOwner;
   let signedUser=req.body.signedUser
   let sUserRole=  req.role;
   let userId=req.userData.Id;
   
    let chat=new chatModel({
        
        users:[accountOwner,signedUser]
      
        
    })
    let docs= await chat.save();
  
    //signed User
    if(sUserRole=="Company"){
        await companyModel.updateOne({_id:signedUser},{$push:{
            contact:{
                chatId:docs._id
            }
        }})
    }else if(sUserRole=="User"){
        await UserModel.updateOne({_id:signedUser},{$push:{
            contact:{
                chatId:docs._id
            }
        }})
    }


    //viewed User
    UserModel.findOne({_id:accountOwner},(err,user)=>{
        if(err){
             res.json(err);
        }else if(user){
            UserModel.updateOne({_id:accountOwner},{
                $push:{
                    contact:{
                        chatId:docs._id
                    }
                }
            },(err,data)=>{
                if(err){
                     res.json(err);
                }
                res.redirect('/chat/'+docs._id);
              
            })
        }else{
            companyModel.updateOne({_id:accountOwner},{
                $push:{
                    contact:{
                        chatId:docs._id
                    }
                }
            },(err,data)=>{
                if(err){
                     res.json(err);
                }
                 res.redirect('/chat/'+docs._id);
                })
        }
    })


  
}


//Get Chat
exports.getChat=async (req,res)=>{
    let user=req.UserRole;
    let Id=req.params.id;
    let userId=req.userData.Id;

   
    let messages= await msgMoel.find({chatId:Id});
   
    for(var x=0;x<messages.length;x++){
        if(messages[x].sender==userId){
            console.log("The Same at message = "+x +" .... "+messages[x].content);
        }
    }
   
    await chatModel.find({_id:req.params.id},(err,data)=>{
        if(err){
             res.json(err);
        }else{
           
        res.render("messages",{
            title:"Chat Page",
            user:user,
            chatId:Id,
            messages:messages,
            userId:userId,
            
        });
    }
    })
    // .populate({
    //     path:'users',
    //     model:'company',
    //     select:'firstName lastName contact'
    // })
}

//Create Message
exports.createMsg=async msg=>{
  
     try{
         msg.timestamp=Date.now();
         let newMsg=new msgMoel(msg);
         await newMsg.save();
         return;
     }catch(err){
         throw new Error(err);
     }

}

//Create group Chat
exports.createGroupChat=async (req,res)=>{
    let user= req.UserRole;
    let userId=user._id;
    let sUserRole=  req.role;

    let groupChat=new groupChat({
        users:[userId],
        title:req.body.title,
        image:String,
        Admin:[userId],
    })

   let docs= await groupChat.save();
     //signed User
     if(sUserRole=="Company"){
        await companyModel.updateOne({_id:userId},{$push:{
            contact:{
                chatId:docs._id
            }
        }})
    }else if(sUserRole=="User"){
        await UserModel.updateOne({_id:userId},{$push:{
            contact:{
                chatId:docs._id
            }
        }})

    }
}




// async function getContacts(userId){
//     let chat= await  chatModel.find({});
//     let belongChats=new Array();

//     for(var x=0;x<chat.length;x++){
//         let users=chat[x].users;
//         for(var i=0;i<users.length;i++){
//             if(userId==users[i]){
//                 belongChats.push(chat[x]);
//                 console.log(JSON.stringify(belongChats));
//             }
//         }
//     }

//     return belongChats;

// }

// //get All Contacts
// exports.getallContacts=async (req,res)=>{
//     let userId=req.userData.Id;
//     getContacts(userId);
//     res.render("messages",{
//         title:"Chat Page",
//         user:null,
//         // belongChats:getContacts
//     });

// }