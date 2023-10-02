var inputArea = document.getElementById("message-input");
var sendButton = document.getElementById("send-button");
sendButton.addEventListener("click",sendMessage);
var ws;
async function connectChat(){
  ws = await new WebSocket('ws://localhost:3000/chat');
  ws.onerror = (error)=>console.error;
  ws.onopen = open;
  ws.onmessage = gotMessage;
}
function open(){
  console.log("Connection Established!!");
}
function gotMessage(dat){
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
}
async function sendMessage(){
  const data = {
    type:"text",
    message: inputArea.value,
    from:selectedContact
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