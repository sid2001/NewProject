const express = require('express');
const dotenv = require('dotenv').config();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const https = require('https');
const User = require('./models/User.js');
const chatServer = require('./chatServer.js');
const homeRoutes = require("./routes/homeRoutes.js")
const fs = require('fs');
var mongooseInstance;
app.set("view engine", "ejs");
app.set("views","views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:false}));


app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
      uri: process.env.MONGODB_URI,
      collection: "sessions",
    }),
  })
);

app.use((req,res,next)=>{
  if(req.session.user){
    User.findById(req.session.user._id)
    .then((user)=>{
      console.log(user);
      req.user = user;
      next();
    })
    .catch(err=>{
      console.log(`Error while finding session user id!! ${err}`)
    })
  }
  else{
    next();
  }
})

app.use(homeRoutes);

mongoose.connect(process.env.MONGODB_URI).then((data)=>{
  
  console.log(`Connected to db`);
  const httpServer = https.createServer({key:fs.readFileSync("key.pem"),cert:fs.readFileSync("cert.pem")},app).listen({host:"127.0.0.1",port:3000});
  chatServer(httpServer);
  // console.log(app.locals.httpServer.);
  console.log("Server listening at port 3000");
}).catch((err)=>{
  console.log(err);
})

