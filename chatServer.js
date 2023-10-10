const {WebSocketServer} = require('ws');
const app = require('express')();

// const queryString = require('query-string');

module.exports =  async(httpServer) =>{
  let clients = {};
  const wss = new WebSocketServer({
  noServer:true,
  path:"/chat",
  clientTracking:true
  });

  httpServer.on('upgrade',(req,socket,head)=>{
    // console.log(req.session.user);
    wss.handleUpgrade(req,socket,head,(ws)=>{
      wss.emit('connection',ws,req);
    })
  })

  wss.on('connection',async (ws,req)=>{
    const [_path,params] = req?.url?.split("?");
    // const reqParam = queryString.parse(params);
    console.log("New ws connection!!");
    console.log(req.IncomingMessage);
    console.log(params);
    const username = params?.split('=')[1];
    clients[username] = ws;
    // console.log(username);
    ws.on('message',async (message)=>{
      const parsedMessage = JSON.parse(message.toString());
      console.log(parsedMessage);
      // console.log(clients);
      // clients[parsedMessage.to].forEach((name)=>{
      //   console.log(parsedMessage.message);
      //   console.log(JSON.parse(message.toString()));
      //   name.send(JSON.stringify(parsedMessage));
      // })
      // console.log(parsedMessage.to);
      // Object.keys(clients).forEach((key)=>{
      //   console.log(key);
      // })
      if(parsedMessage.type=="text"){
        clients[parsedMessage.to].send(JSON.stringify(parsedMessage));
        parsedMessage.from = "You";
        ws.send(JSON.stringify(parsedMessage));
      }
      else if(parsedMessage.type=="offer"||parsedMessage.type=="answer"||parsedMessage.type=="candidate"){
        clients[parsedMessage.to].send(JSON.stringify(parsedMessage));
      }
    })
  })
  return wss;
}

