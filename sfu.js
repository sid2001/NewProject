const webrtc = require('wrtc');
const {v4 : uuid} = require('uuid');
const {WebSocketServer,WebSocket} = require('ws');
const fs = require('fs');
const https = require("https");
const app = require('express')();

let peers = new Map();
let consumers = new Map();

var options = {
  'iceServers' :[{
    'urls': 'stun:stun.l.google.com:19302'
}]
}

const httpsServer = https.createServer({key:fs.readFileSync("key.pem"),cert:fs.readFileSync("cert.pem")},app)
.listen({host:"127.0.0.1",port:3030})

const wss = new WebSocketServer({
  server:httpsServer,
  clientTracking:true
})

async function createPeer(){

  let peer = new webrtc.RTCPeerConnection(options);
  return peer;
}

async function handleTrackEvent(e,id,ws){
  if(e.streams && e.streams[0]){
  peers.get(id).stream = e.streams[0];

  const payload = {
    type:"newProducer",
    id:id,
    username:peers.get(id).username
  }

  wss.broadcast(JSON.stringify(payload));
  }
}

wss.on("connection",async(ws,req)=>{

  wss.broadcast = function(data){
    peers.clients.forEach((client)=>{
      if(client.sock.readyState===WebSocket.OPEN){
        client.sock.send(data);
      }
    })
  }
  console.log("New peer connected!!");
  const peerId = uuid();
  ws.id = peerId;
  ws.on("close",(event)=>{
    peers.delete(ws.id);
    consumers.delete(ws.id);

    console.log(event);
    wss.broadcast(JSON.stringify({
      type:'user_left',
      id:ws.id
    }));
    
  });
  
  ws.send(JSON.stringify({type:"welcome",id:peerId}))
  ws.on('message',async (message)=>{
    const parsedMessage = JSON.parse(JSON.stringify(message));
    const type = parsedMessage.type;

    if(type==="connect"){
      peers.set(parsedMessage.uid,{sock:ws});
      const pc = await createPeer();
      peers.get(parsedMessage.uid).peer = pc;
      peers.get(parsedMessage.uid).username = username;
      pc.ontrack = (e)=>{
        handleTrackEvent(e,parsedMessage.uid,ws);
      }
      const desc = new webrtc.RTCSessionDescription(parsedMessage.sdp);
      await pc.setRemoteDescription(desc);
      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

      const payload = {
        type:'answer',
        sdp:pc.localDescription
      }

      ws.send(JSON.stringify(payload));
    }
    else if(parsedMessage.type === 'getPeers'){

      let uid = parsedMessage.uid;
      const list = [];
      peers.forEach((peer,key)=>{
        if(key!=uid){
          const peerInfo = {
            id:key,
            username: peer.username,
          }

          list.push(peerInfo);
        }
      });
      
      const peersPayload = {
        type: "peers",
        peers: list
      }

      ws.send(JSON.stringify(peersPayload));
    }
    else if(parsedMessage.type==="ice"){

      const user = peers.get(parsedMessage.uid);
      if(user.peer)
        user.peer.addIceCandidate(new webrtc.RTCIceCandidate(parsedMessage.ice))
        .catch(e=> console.log(e));
    }
    else if(parsedMessage.type==="consume"){
      try{
      let {id,sdp,consumerId} = parsedMessage;
      const remoteUser = peers.get(id);
      const newPeer = createPeer();

      consumers.set(consumerId,newPeer);
      const _desc = new webrtc.RTCSessionDescription(sdp);
      await consumers.get(consumerId).setRemoteDescription(_desc);

      remoteUser.stream.getTracks().forEach(track=>{
        consumers.get(consumerId).addTrack(track,remoteUser.stream);
      });
      const _answer = await consumers.get(consumerId).setLocalDescription(_answer);

      const _payload ={
        type:'consume',
        sdp:consumers.get(consumerId).localDescription,
        username:remoteUser.username,
        id:consumerId
      }

      ws.send(JSON.stringify(_payload));
    }catch(err) {
      console.log(err);
    }
    }
    else if(parsedMessage.type==='consumer_ice'){

      if(consumers.has(parsedMessage.consumerId)) {
        consumers.get(parsedMessage.consumerId).addIceCandidate(new webrtc.RTCIceCandidate(parsedMessage.ice))
        .catch(err=>{
          console.log(err);
        })
      }
    }
    else wss.broadcast(message);
  });
  ws.on('error',()=>ws.terminate());
});

console.log("Server Running.");









