const User = require("../models/User");

exports.getLogin = (req,res,next) =>{

  res.render('form');
}

exports.postSignup = async (req,res,next)=>{
  console.log(req.body);
   const user = await new User();
  user.email = req.body.email;
  user.password = req.body.password;
  user.username = req.body.username;
  user.name.first = req.body.firstname;
  if(req.body.lastname) user.name.last = req.body.lastname;
  await user.save();
  res.send("Created a new account!!");
}