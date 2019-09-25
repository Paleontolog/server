;(function () {
    var form = document.querySelector("#reg-form"),
        fields = form.querySelectorAll(".form-control"),
        btn = form.querySelector("#register"),
        emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/,
        agePattern = /^\d*$/,
        errors = {
            "empty-field": "Поле должно быть заполнено",
            "err-email": "Введён некорректный емайл",
            "err-age": "Введён некорректный возраст",
            "err-pass-simple": "Пароль слишком простой",
            "err-pass": "Ошибка при повторном вводе пароля"
        }
    validationError = false;

    btn.addEventListener('click', validForm);

    function validForm(e) {
        e.preventDefault();
        validationError = false;

        var formVal = getFormData(fields),
            error;

        for (var property in formVal) {
            error = getError(formVal, property);
            if (error.length != 0) {
                validationError = true;
                showError(property, error);
            }
        }
        if (!validationError) {
            alert("Форма отправлена!")
        }
    }

    fields.forEach(function (value) {
        value.addEventListener("blur", function (evt) {
            var elem = evt.target,
                name = elem.getAttribute("name"),
                data = {};
			if (name === "repeatedpassword") {
				data["password"] = form.querySelector("[name = password]").value;
			}
            data[name] = elem.value;
            var error = getError(data, name);
            if (error.length != 0) {
                showError(name, error);
            }
        })
    })

    function showError(name, error) {
        var field = form.querySelector('[name=' + name + ']');
        var errorField = field.parentElement.nextElementSibling;
        field.classList.add("form-control_error");
        errorField.innerHTML = error;
        errorField.style.display = "block";
    }

    function cleanError(element) {
        element.classList.remove("form-control_error")
        element.parentElement.nextElementSibling.removeAttribute("style");
    }

    form.addEventListener('focus', function (evt) {
        var element = evt.target;
        if (element !== btn) {
            cleanError(element);
        }
    }, true);

    function getFormData(elements) {
        var data = {};
        for (var i = 0, len = elements.length; i < len; i++) {
            data[elements[i].name.replace(/-/g, "")] = elements[i].value;
        }
        return data;
    }


    function getError(form, field) {
        var error = "",
            verify = {
                "useremail": function () {
                    if (emailPattern.test(form.useremail) == false) {
                        error = errors['err-email'];
                    }
                },

                'age': function () {
                    if (agePattern.test(form.age) == false) {
                        error = errors["err-age"];
                    }
                },

                "username" : function () {},

                'password': function () {
                    if (form.password.length < 8) {
                        error = errors["err-pass-simple"];
                    }
                },
                'repeatedpassword': function () {
                    if (form.password !== form.repeatedpassword) {
                        error = errors["err-pass"];
                    }
                }
            };

        if (form[field].length == 0) {
            error = errors["empty-field"];
        } else {
            verify[field]();
        }
        return error;
    }

})();
