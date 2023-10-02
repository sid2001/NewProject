const express = require('express');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
// const db = new MongoClient("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000 ")
const app = express();
const User = require('./models/User.js');
const chatServer = require('./chatServer.js');
const homeRoutes = require("./routes/homeRoutes.js")
app.set("view engine", "ejs");
app.set("views","views");
app.use(express.urlencoded({extended:false}));
app.use(homeRoutes);
// app.use(chatServer);
app.get('/chat',(req,res,next)=>{
  res.sendFile(__dirname+'/views/chat.html');
  console.log("request came!!");
})


mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000").then(()=>{
  console.log(`Connected to db`)
  const httpServer = app.listen({host:"127.0.0.1",port:3000});
  chatServer(httpServer);
  // console.log(app.locals.httpServer.);
  console.log("Server listening at port 3000");
}).catch((err)=>{
  console.log(err);
})

