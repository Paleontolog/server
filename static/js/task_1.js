// document.querySelector('.prevue-container')
//     .addEventListener('click', function (evt) {
//         var id = evt.target.src;
//         var to = document.querySelector('.main-picture > img');
//
//         $(to).attr("src", id).animate({
//             width: [ "toggle", "swing" ], // ширина элемента
//             height: [ "toggle", "swing" ], // высота элемента
//             opacity: "toggle",
//         }, 500);
//     })

$(function () {
    var fl = true;
    $(document).on('click', '.prevue-container img',
        function (evt) {
            var newSrc = evt.target;
            var to = document.querySelector('.main-picture > img');
            if (to['data-id'] != newSrc.id && fl === true) {
                $(to).animate({
                    width: "0", // ширина элемента
                    height: "0", // высота элемента
                    opacity: 0,
                }, 0);
                fl = false;
                to["data-id"] = newSrc.id;
                $(to).attr("src", newSrc.src).animate({
                    width: "55%", // ширина элемента
                    height: "55%", // высота элемента
                    opacity: 1,
                }, {
                    duration: 400,
                    queue : false,
                    complete: function () {
                        fl = true;
                    }
                });
            }
        }
    )
});

$('.multiple-items').slick({
    infinite: true,
    dots: true,
    slidesToShow: 5,
    slidesToScroll: 3
});