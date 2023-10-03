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
    document.getElementById("signup-detail-email").hidden = true;
    document.getElementById("signup-detail-name").hidden = true;
    document.getElementsByName("email")[0].required = false;
    document.getElementsByName("firstname")[0].required = false;
    document.querySelector("form").setAttribute("action","/login");
  }
  else {
    document.getElementById("signup-detail-email").hidden = false;
    document.getElementById("signup-detail-name").hidden = false;
    document.getElementsByName("email")[0].required = true;
    document.getElementsByName("firstname")[0].required = true;
    document.querySelector("form").setAttribute("action","/signup");
  }
}