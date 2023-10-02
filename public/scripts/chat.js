var selectedContact = users[0].username;
var contacts = document.getElementById("side-menu");
users.forEach((user)=>{
  let contact = document.createElement('contact');
  contact.innerHTML = user.name;
  contact.addEventListener("click",()=>{
      selectedContact = user.username;
  })
  contact.setAttribute("username",user.username);
  contacts.appendChild(contact);
})
function toggleMenu() {
  var sideMenu = document.getElementById("side-menu");
  var content = document.getElementById("content");
  var body = document.body
  if (sideMenu.style.width === "250px") {
      sideMenu.style.width = "0";
      content.style.marginLeft = "0";
      body.classList.remove("menu-open");
  } else {
      sideMenu.style.width = "250px";
      content.style.marginLeft = "250px";
      body.classList.add("menu-open");
  }
}