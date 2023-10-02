const User = require("../models/User")

exports.getChat = async function(req,res,next){
  const getUser = [];

  User.find({})
  .then((users)=>{
    users.forEach((user)=>{
      let obj = {
        username:user.username,
        name: user.name.first + " " + user.name.last
      }
      getUser.push(obj);
    });
    return getUser;
  }).then((data)=>{
    console.log(data);
    res.render("chat",{users:data});
  })
  
} 