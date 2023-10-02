var mode = "Sign Up";
const changeMode = document.getElementById("changeMode");
changeMode.addEventListener("click",change);
function change(){
  var str = changeMode.innerHTML;
  changeMode.innerHTML = mode;
  mode = str;
  document.querySelector("h1").innerHTML = mode;
  document.getElementById("actionButton").innerHTML = mode;
  if(mode =="Sign In"){
    document.querySelector("form").setAttribute("action","/login");
  }
  else {
    document.querySelector("form").setAttribute("action","/signup");
  }
}