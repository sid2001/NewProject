var inputArea = document.getElementById("message-input");
var sendButton = document.getElementById("send-button");
sendButton.addEventListener("click",sendMessage);
var ws;
async function connectChat(){
  ws = new WebSocket(`ws://localhost:3000/chat?username=${username}`);
  ws.onerror = (error)=>console.error;
  ws.onopen = open;
  ws.onmessage = gotMessage;
}
function open(){
  console.log("Connection Established!!");
}
async function gotMessage(dat){
  console.log(dat.data);
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
    pc = new RTCPeerConnection();
    pc.setRemoteDescription(parsedData.offer);

    pc.onaddstream = function (evt) {
      remote_video.src = evt;
    }

    await navigator.mediaDevices.getUserMedia({audio:true,video:true})
    .then(function gotStream(evt) {
      pc.addStream(evt);
      local_video.srcObject = evt;
  
      pc.createAnswer().then(async function (answer){
        await pc.setLocalDescription(answer);
  
        ws.send(JSON.stringify({
          type:"answer",
          from:username,
          to:selectedContact,
          answer:answer
        }));
      })
    })
    .catch(function logError(err) {
      console.log("Error!!");
      console.log(err);
    })
  }
  else if(parsedData.type=="answer"){
    pc.setRemoteDescription(parsedData.answer).then(()=>{
      console.log("Answer received!!");
    });
  }
  
}

async function sendMessage(){
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