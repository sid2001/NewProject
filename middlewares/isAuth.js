
module.exports = function (req,res,next){
  //added '?' to prevent error when no session is created
  console.log(req.session?.isLoggedIn);
  if(!req.session?.isLoggedIn){
    console.log("Not logged in");
    
    return res.redirect("/login");
  }
  next();
}