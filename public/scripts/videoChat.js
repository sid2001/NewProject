var mediaDevices;
var local_video = document.getElementById('local_video');
var remote_video = document.getElementById('remote_video');

var pc;

async function videoCall() {
pc = new RTCPeerConnection();

await navigator.mediaDevices.getUserMedia({audio:true,video:true}).then(async function gotStream(evt){
  await pc.addStream(evt);
  console.log("Got streams!!");
  console.log(evt);

  local_video.srcObject = evt;

  pc.createOffer()
  .then(async function(offer){
    console.log("Offer created!!");
    console.log(offer);
    await pc.setLocalDescription(offer).then(()=>{
      console.log("Local Description Set!!");
    })
    ws.send(JSON.stringify({
      type:"offer",
      from: username,
      to: selectedContact,
      offer:offer
    }))
  })
  .catch((err)=>{
    console.log(err);
  })
})
.catch(function logError(err){
  console.log("ERROR connecting!!");
  console.log(err);
})



pc.onicecandidate = function(evt) {
  if(evt.candidate) {
    //for later
  }
}
pc.onaddstream = function (evt) {
  console.log("on add stream!!");
  remote_video.srcObject = evt;
}
}
