const {WebSocketServer} = require('ws');
const app = require('express')();

// const queryString = import('query-string');

module.exports =  async(httpServer) =>{
  let clients = {};
  const wss = new WebSocketServer({
  noServer:true,
  path:"/chat",
  clientTracking:true
  });

  httpServer.on('upgrade',(req,socket,head)=>{
    wss.handleUpgrade(req,socket,head,(ws)=>{
      wss.emit('connection',ws,req);
    })
  })

  wss.on('connection',(ws,req)=>{
    const [_path,params] = req?.url?.split("?");
    // const reqParam = queryString.parse(params);
    console.log("New ws connection!!");
    console.log(params);
    const name = params.split('=')[1];
    clients[name] = ws;
    // console.log(name);
    ws.on('message',(message)=>{
      const parsedMessage = JSON.parse(message);
      console.log(parsedMessage);
      // console.log(clients);
      Object.keys(clients).forEach((name)=>{

        if(parsedMessage.to==name)
          clients[name].send(parsedMessage.message);
      })
    })
  })
  return wss;
}
