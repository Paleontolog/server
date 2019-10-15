var url = "/api/addresses";

function createTr(obj) {
	var td = document.createElement('td');
	td.innerHTML = obj;
	return td;
}

function getAllAddressees() {
	var client = new XMLHttpRequest();
	client.open("get", url, true);
	client.onreadystatechange = function() {
		if (client.readyState === 4) {
			var list = client.response;
			list = JSON.parse(list);
			var el = document.getElementById('addressess list');
			var len = el.rows.length;

			for (var t = len - 1; t >= 0; t--) {
				el.deleteRow(t);
			}

			for (var a = 0; a < list.length; a += 1) {
				var tr = document.createElement('tr');
				tr.appendChild(createTr(list[a].id));
				tr.appendChild(createTr(list[a].email));
				tr.onclick = function chooseOnClick() {
					document.getElementById('inputID').value =
						this.getElementsByTagName("td")[0].innerHTML;
					document.getElementById('inputE-MAILChange').value =
						this.getElementsByTagName("td")[1].innerHTML;
				};
				document.getElementById('addressess list').appendChild(tr);
			}
		}
	};
	client.send();
}

function addAddressees() {
	var textE_MAIL = document.getElementById('inputE-MAILAdd').value;
	if (textE_MAIL !== "") {

		var body = {
			id: "",
			email: textE_MAIL
		};

		var client = new XMLHttpRequest();
		client.open("PUT", url, true);
		client.setRequestHeader('Content-Type', 'application/json');
		client.setRequestHeader('X-CSRF-Token', $("#_csrf").val());
		client.onreadystatechange  = function() {
			if (client.readyState === 4) {
				if (client.status === 200) {
					alert("Пользователь добавлен в базу");
				}
			}
		};
			client.send(JSON.stringify(body));
		}
		else
			alert("Должно быть заполнено поле email!");
}

function changeAddresseesOnId() {
	var textID = document.getElementById('inputID').value;

	var textE_MAIL = document.getElementById('inputE-MAILChange').value;

	if (textID !== "" && textE_MAIL !== "") {

		var body = {
			id: textID,
			email: textE_MAIL
		};

		var client = new XMLHttpRequest();

		client.open("POST", url, true);
		client.setRequestHeader('Content-Type', 'application/json');
		client.setRequestHeader('X-CSRF-Token', $("#_csrf").val());
		client.onreadystatechange  = function() {
			if (client.readyState === 4) {
				if (client.status === 200) {
					alert("Обновление успешно проведено!");
				} else {
				    alert("Ошибка! " + client.status);
				}
			}
		};
		client.send(JSON.stringify(body));
	}
	else
		alert("Должны быть заполнены оба поля!");
}
