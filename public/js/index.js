const divs = document.querySelectorAll('.material-dropdown');
const clickHandler = function(event){
  document.getElementById('field-dropDown').value = event.target.innerText;
  document.querySelectorAll('.material-dropdown li').forEach(el=>{
  	el.classList.remove("material-dropdown-selected")
  })
  event.target.classList.add("material-dropdown-selected")
}
divs.forEach(el => el.addEventListener('click', clickHandler));