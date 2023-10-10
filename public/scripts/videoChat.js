let localStream = null;
const configuration = {
    'iceServers' :[{
        'urls': 'stun:stun.l.google.com:19302'
    }]
}

let pc = new RTCPeerConnection();

    navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true
    }).then(stream =>{
        local_video.srcObject = stream;
        localStream = stream;

        for (let track of localStream.getTracks()) {
            pc.addTrack(track, localStream);
        }
    }).catch(err=>{ 
        console.log(err);
    })


async function videoCall() {

    if(selectedContact===""){
        alert("Select a contact!!");
        return;
    }
    await pc.createOffer().then(async (offer)=>{
        await pc.setLocalDescription(offer);
        await ws.send(JSON.stringify({
        type:"offer",
        from:username,
        to:selectedContact,
        offer:offer
    }))
    })
    
    
}

pc.onicecandidate = event => {
    if(event.candidate){
        ws.send(JSON.stringify({
            type:"candidate",
            from:username,
            to:selectedContact,
            candidate:event.candidate
        }))
    }
}

pc.onaddstream = function (evt) {
      remote_video.srcObject = evt.stream;
    }