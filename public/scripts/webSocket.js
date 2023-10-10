var inputArea = document.getElementById("message-input");
var sendButton = document.getElementById("send-button");
sendButton.addEventListener("click",sendMessage);

var ws;
async function connectChat(){
  ws = new WebSocket(`wss://127.0.0.1:3000/chat?username=${username}`);
  ws.onerror = (error)=>console.error;
  ws.onopen = open;
  ws.onmessage = gotMessage;
}
function open(){
  console.log("Connection Established!!");
}
async function gotMessage(dat){
//   console.log(dat.data);
  const parsedData = JSON.parse(dat.data.toString("utf8"));
  //if sent data is a text message from the user then display the message.
  if(parsedData.type=='text'){
    var currentMessage = document.getElementById("message");
    var messageSender = document.createElement('div');
    messageSender.class = "message-sender";
    messageSender.innerHTML = parsedData.from;
    var message = document.createElement("div");
    message.class = "message";
    message.innerHTML = parsedData.message; 
    currentMessage.appendChild(messageSender);
    currentMessage.appendChild(message);
  }
  else if(parsedData.type=="offer"){
    console.log("Offer received!!");
    await pc.setRemoteDescription(new RTCSessionDescription(parsedData.offer)).then(()=>{
        console.log("Remote desc set!!");
    });
    const answer = await pc.createAnswer();
    console.log("Answer created!!");
    await pc.setLocalDescription(answer).then(()=>{
        console.log("Local desc set!!");
    });
    ws.send(JSON.stringify({
          type:"answer",
          from:username,
          to:selectedContact,
          answer:answer
        }));
    

  }
  else if(parsedData.type=="answer"){
    console.log("Answer received!!");
    const remoteDesc = new RTCSessionDescription(parsedData.answer);
    await pc.setRemoteDescription(remoteDesc);
  }
  else if(parsedData.type=="candidate"){
    try {
        await pc.addIceCandidate(parsedData.candidate);
    } catch (e) {
        console.log(e);
    }
  }
  
}


async function sendMessage(){
    if(selectedContact===""){
        alert("Select a contact!!");
        return;
    }
  const data = {
    type:"text",
    message: inputArea.value,
    from:username,
    to:selectedContact
  }
  try{
    if(ws.readyState===3) await connectChat();
    ws.send(JSON.stringify(data));
    inputArea.value = "";
  }
  catch{
    console.log("Couldn't send message!!");
  }
}