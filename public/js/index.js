

var divs = document.querySelectorAll('.material-dropdown');
var clickHandler = function(event){
	document.getElementById('field-dropDown').value = event.target.innerText;
	document.querySelectorAll('.material-dropdown li').forEach(el=>{
		el.classList.remove('material-dropdown-selected')
	})
	event.target.classList.add('material-dropdown-selected')
}
divs.forEach(el => el.addEventListener('click', clickHandler));


var submitHandler = function(e) {
	e.preventDefault(); 
	document.getElementById('submitButton').classList.add('disabled');
	var form = document.querySelector('form'),
	formData = new FormData(form),
	object = {};
	formData.forEach((value, key) => {object[key] = value});
	var json = JSON.stringify(object);
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open('POST', '/vote');
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(json);
	xhr.onload = function() {
		var responseObj = xhr.response;
		console.log(responseObj); 
	};
}

document.getElementById('voteForm').addEventListener('submit',submitHandler);

document.getElementById('submitButton').addEventListener('click',submitHandler)

