let chatId=document.getElementById("chatId").value;
let myId=document.getElementById("senderId").value;
let msg=document.getElementById('message');
let sendBtn=document.getElementById('sendMessage');
let messageseen=document.getElementById('messageseen');
var appendelement=document.getElementById("appendelement");

socket.emit("joinChat",chatId);

sendBtn.onclick=()=>{
    let content=msg.value;
    let img=files.value;
  
    socket.emit("sendMsg",{
        chatId:chatId,
        content:content,
        sender:myId,
        image:img
    },()=>{
        msg.value='';
    })
   
}


socket.on("newMesage",msg=>{
    let cont=msg.content;
    var divMessage = document.createElement("div");
    divMessage.innerHTML=cont;
    
    appendelement.appendChild(divMessage);
    messageseen.innerHTML+="<br/>"+cont;
    console.log(cont);
})
