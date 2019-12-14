let newMsg=require("../chat.controller").createMsg;
let msgModel=require("../../models/messages.model");

 
module.exports=io=>{
    io.on('connection',socket=>{
        socket.on("joinChat",chatId=>{
            socket.join(chatId);
        
        })
        socket.on('sendMsg',(msg,cb)=>{
          
            newMsg(msg).then(()=>{
                io.to(msg.chatId).emit("newMesage",msg);
                
                cb();
            })
           
        })
    })
}