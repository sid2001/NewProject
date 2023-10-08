const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
exports.getLogin = (req,res,next) =>{
  res.render('form');
}

exports.postLogin = async (req,res,next)=>{
  const {username,password} = req.body;
  User.findOne({username:username})
  .then((user)=>{
    if(!user)
      return res.sendStatus(401);
    bcrypt.compare(password,user.password)
    .then((doMatch)=>{
      if(doMatch){
        console.log("Existing User!!");
        req.session.isLoggedIn = true;
        req.session.user = user;
        console.log(req.session);
        return req.session.save((data)=>{
          console.log("hi");
          // console.log(data);
          res.redirect("/chat");
        })
        // return res.redirect("/chat");
      }
      res.sendStatus(401);
    })
    .catch((err)=>{
      console.log("Error while comparing password!!");
      console.log(err);
    })
  })
  .catch((err)=>{
    console.log("Error while finding username!!");
    console.log(err);
  })
}

exports.postSignup = async (req,res,next)=>{

  // console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  let flag = null;
  User.findOne({$or:[{email:req.body.email},{username:password}]})
  .then((foundMatch)=>{
    if(foundMatch){
      flag = 1;
      return res.sendStatus(403);
    }
    return bcrypt.hash(req.body.password,10)
            .then((hashedPassword)=>{
              return new User({
                email:email,
                username : username,
                password:hashedPassword,
                name:{
                  first:firstname,
                  last:lastname
                }
              })
            })
  })
  .then(async (user)=>{
    if(flag===null){
      return await user.save();
    }
    return "Matching credentials found";
  })
  .then(result=>{
    console.log(result);
    if(flag===null)
    res.redirect("/login");
  })
  .catch(err=>{
    console.log("Error while sigining up!!");
    console.log(err);
  })
}

exports.postLogout = async function (req,res,next){

  mongoose.connection.db.collection("sessions")
  .deleteOne({_id:req.session._id})
  .then((ack)=>{
    return console.log(ack);
  })
  .then(async ()=>{
    return await req.session.destroy(()=>{
      console.log("destroyed cookie!!");
    })

  })
  .then(()=>{
    res.redirect("/login");
  })
  .catch(err=>{
    console.log("mongo session not destroyed!!");
    console.log(err);
  })


  // User.sessions.deleteOne({_id:req.session.user._id})
  // .then((ack)=>{
  //   return console.log(ack);
  // })
  // .then(async ()=>{
  //   await req.session.destroy();
  //   res.redirect("/login");
  // })
  // .catch((err)=>{
  //   console.log("Error while logging out!!");
  //   console.log(err);
  // })
  
}