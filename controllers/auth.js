const User = require("../models/User");

exports.getLogin = (req,res,next) =>{

  res.sendFile(process.cwd() + "/views/form.html");
}

exports.postSignup = async (req,res,next)=>{
  console.log(req.body);
  const user = new User();
  user.email = req.body.email;
  user.password = req.body.password;
  user.username = req.body.username;
  await user.save();
  res.send("Created a new account!!");
}