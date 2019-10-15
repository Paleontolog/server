var message = {
    id: null,
    subject: "",
    email: ""
};

var addresseesList;
var addresseesListChoose = [];

function emailDelete(email) {
    var elem = $(email.parentElement.parentElement);
    addresseesListChoose.splice(elem.index(), elem.index() + 1);
    elem.remove();
}

function newEmail(email) {
    var text =
        "<tr>" +
        "<td>" + email +"</td>" +
        "<td>" +
        "<button class=\"button primary small\"\n" +
        " onclick='emailDelete(this)'>X</button>" +
        "</td>" +
        "</tr>";
    $("#emailList").append(text);
}


function addEmail() {
    if (addresseesList.length === 0) {
        alert("email: " + $("#inputEmail").val() + " нет в базе!");
        return;
    }
    var email = addresseesList[0].email;
    if (addresseesList.length === 1 &&
         addresseesListChoose.find(ad => ad.email === email) === undefined) {
        newEmail(email);
        addresseesListChoose.push(addresseesList[0]);
    } else if (addresseesList.length > 1){
        alert("Выберите email адресата!");
    }
}

function fillForm() {
    message.subject = $("#messageSubject").val();
    message.email = $("#messageText").val();
}


function onloadPage() {
    var list = document.location.pathname.split("/");
    var index = list[list.length - 1];
    if (!isNaN(parseFloat(index)) && isFinite(index)) {
        message.id = index;

        var url = "/api/addresses/" + message.id;
        var client = new XMLHttpRequest();
        client.open("GET", url, true);
        client.onreadystatechange = function () {
            if (client.readyState === 4) {
                if (client.status === 200) {
                    addresseesListChoose = JSON.parse(client.response);
                    for (var i = 0; i < addresseesListChoose.length; i++) {
                        newEmail(addresseesListChoose[i].email);
                    }
                }
            }
        };
        client.send();
    }
}

function load(field) {
    var url = "/api/addresses/email/" + field.value;
    var client = new XMLHttpRequest();
    client.open("GET", url, true);
    client.onreadystatechange = function () {
        if (client.readyState === 4) {
            if (client.status === 200) {

                addresseesList = JSON.parse(client.response);

                var template =
                    "{{#addresseesList}}" +
                    "<option value='{{email}}'></option>" +
                    "{{/addresseesList}}";

                var res = Mustache.to_html(template,
                    {addresseesList : addresseesList});

                $("#cityname").html(res);
            }
        }
    };
    client.send();
}


function saveMessage() {
    var url = "/api/messages";
    var client = new XMLHttpRequest();

    fillForm(); // заполнили поля сообщения

    var result = {
        message: message,
        addresses: addresseesListChoose
    };

    var method;
    if (message.id === null) {
        method = "PUT";
    } else {
       url += "/" + message.id;
       method = "POST";
    }

    client.open(method, url, true);
    client.setRequestHeader('Content-Type', 'application/json');
    client.setRequestHeader('X-CSRF-Token', $("#_csrf").val());
    client.onreadystatechange = function () {
        if (client.readyState === 4) {
            if (client.status === 200) {
                document.location.href =  "/messlist"
            } else {
                alert("Ошибка сохранения!");
            }
        }
    };
    client.send(JSON.stringify(result));
}


// function getMessage(id) {
//     var url = "http://localhost:8080/api/messages/" + id;
//     var client = new XMLHttpRequest();
//     client.open("GET", url, true);
//     client.onreadystatechange = function () {
//         if (client.readyState === 4) {
//             if (client.response === 200) {
//                 message = JSON.parse(client.response);
//             }
//         }
//     };
//     client.send();
// }
