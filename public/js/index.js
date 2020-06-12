function lmSelect(select, onChange) {	
	var selectValue = select.querySelector('.lm-select-value');
	var options = select.querySelector('.lm-select-options');
	var list = select.querySelector('.lm-select-list');
	var items = select.querySelectorAll('.lm-select-item');
	var overflow = select.querySelector('.lm-select-overflow');
	var bodyScroll;

	function selectItem(selected, isUpdate) {
		var value = selected.getAttribute('data-value') || selected.textContent;
		selected.classList.add('lm-select-selected');
		selectValue.textContent = selected.textContent;
		selectValue.setAttribute('data-value', value);
		if (onChange && isUpdate) {
			onChange(getData());
		}
	}

	function getData() {
		return {text: selectValue.textContent, value: selectValue.getAttribute('data-value')};
	}

	function setData(value) {
		var selected;
		for(var i = 0, l = items.length; i < l; i++){
			if(items[i].textContent == value){
				selected = items[i]
			}
		}
		if(selected){
			var old = select.querySelector('.lm-select-selected');
			if (old) {
				old.classList.remove('lm-select-selected');
			}
			selected.classList.add('lm-select-selected');
			selectValue.textContent = selected.textContent;
			selectValue.setAttribute('data-value', value);
		}
	}

	function hideSelect() {
		select.classList.remove("lm-select-active");
		setTimeout(function() {
			select.classList.remove("lm-select-animating");
		}, 400);
	}

	function handleChange(event) {
		var old = select.querySelector('.lm-select-selected');
		if (old) {
			old.classList.remove('lm-select-selected');
		}    
		selectItem(event.target, true);
		hideSelect();
	}

	function handleOpen() {
		var selected = select.querySelector('.lm-select-selected');
		select.classList.add("lm-select-animating");
		var scrollTop = (selected.offsetTop + (selected.offsetHeight/2)) - list.offsetHeight/2;
		list.scrollTop = Math.max(0, scrollTop);
		var listTop = Math.min(select.offsetTop - 10, selected.offsetTop - list.scrollTop) *-1
		options.style.top = listTop + "px";

		setTimeout(function() {
			select.classList.add("lm-select-active");
		}, 10);
	}

	selectItem(select.querySelector('.lm-select-selected') || select.querySelector('.lm-select-item'));
	selectValue.addEventListener('click', handleOpen);
	for (var i = 0, l = items.length; i < l; i++) {
		items[i].addEventListener('click', handleChange);
	}
	overflow.addEventListener('click', hideSelect);
	return {
		get: getData,
		set: setData
	}
}
function validateEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

var regions = ["Выбрать","Алтайский край", "Амурская область", "Архангельская область", "Астраханская область", "Белгородская область", "Брянская область", "Владимирская область", "Волгоградская область", "Вологодская область", "Воронежская область", "Еврейская АО", "Забайкальский край", "Ивановская область", "Иркутская область", "Кабардино-Балкарская Республика", "Калининградская область", "Калужская область", "Камчатский край", "Карачаево-Черкесская Республика", "Кемеровская область - Кузбасс", "Кировская область", "Костромская область", "Краснодарский край", "Красноярский край", "Курганская область", "Курская область", "Ленинградская область", "Липецкая область", "Магаданская область", "Москва", "Московская область", "Мурманская область", "Ненецкий АО", "Нижегородская область", "Новгородская область", "Новосибирская область", "Омская область", "Оренбургская область", "Орловская область", "Пензенская область", "Пермский край", "Приморский край", "Псковская область", "Республика Адыгея", "Республика Алтай", "Республика Башкортостан", "Республика Бурятия", "Республика Дагестан", "Республика Ингушетия", "Республика Калмыкия", "Республика Карелия", "Республика Коми", "Республика Крым", "Республика Марий Эл", "Республика Мордовия", "Республика Саха (Якутия)", "Республика Северная Осетия", "Республика Татарстан", "Республика Тыва", "Республика Хакасия", "Ростовская область", "Рязанская область", "Самарская область", "Санкт-Петербург", "Саратовская область", "Сахалинская область", "Свердловская область", "Севастополь", "Смоленская область", "Ставропольский край", "Тамбовская область", "Тверская область", "Томская область", "Тульская область", "Тюменская область", "Удмуртская Республика", "Ульяновская область", "Хабаровский край", "Ханты-Мансийский АО — Югра", "Челябинская область", "Чеченская Республика", "Чувашская Республика", "Чукотский АО", "Ямало-Ненецкий АО", "Ярославская область"];
var onChange = function(data){
	document.getElementById('dropDown').value = data.value;
}
var listElement = document.querySelectorAll('.lm-select-list')[0];
for(var i=0;i<regions.length;i++){
	listElement.innerHTML+= '<div class="lm-select-item">'+regions[i]+'</div>'
}
var select = lmSelect(document.getElementById('regions'), onChange)


var submitHandler = function(e) {
	e.preventDefault();

	document.getElementById('submitButton').classList.add('loading');
	document.getElementById('submitButton').classList.add('disabled');

	var form = document.querySelector('form'),
	formData = new FormData(form),
	object = {};
	formData.forEach((value, key) => {object[key] = value});

	console.log(validateEmail(formData.emailAddress))

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

