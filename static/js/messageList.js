function deleteMess(mess) {
    var messageID = $(mess.parentElement.parentElement).find("#id").val();
    var url = "/api/messages/del/" + messageID;
    var client = new XMLHttpRequest();
    client.open("POST", url, true);
    client.setRequestHeader('X-CSRF-Token', $("#_csrf").val());
    client.onreadystatechange = function () {
        if (client.readyState === 4) {
            if (client.status === 200) {
                mess.parentElement.parentElement.remove();
            }
        }
    };
    client.send();
}