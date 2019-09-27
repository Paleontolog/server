var matr = [
    [
        true, true, true,
        true, false, true,
        true, false, true,
        true, false, true,
        true, true, true
    ],
    [
        false, true, false,
        false, true, false,
        false, true, false,
        false, true, false,
        false, true, false
    ],
    [
        true, true, true,
        false, false, true,
        true, true, true,
        true, false, false,
        true, true, true
    ],
    [
        true, true, true,
        false, false, true,
        false, true, true,
        false, false, true,
        true, true, true
    ],
    [
        true, false, true,
        true, false, true,
        true, true, true,
        false, false, true,
        false, false, true
    ],
    [
        true, true, true,
        true, false, false,
        true, true, true,
        false, false, true,
        true, true, true
    ],
    [
        true, true, true,
        true, false, false,
        true, true, true,
        true, false, true,
        true, true, true
    ],
    [
        true, true, true,
        false, false, true,
        false, false, true,
        false, false, true,
        false, false, true
    ],
    [
        true, true, true,
        true, false, true,
        true, true, true,
        true, false, true,
        true, true, true
    ],
    [
        true, true, true,
        true, false, true,
        true, true, true,
        false, false, true,
        false, false, true
    ]
];

var point = [
    [
        false, true, false,
        false, true, false,
        false, true, false,
        false, true, false,
        false, true, false
    ],
    [
        true, true, true,
        false, false, true,
        true, true, true,
        true, false, false,
        true, true, true
    ],
];

var grad = new Date(0, 0, 0, 0, 0, 0, 0);
var cube1 = $('#cubes1');
var cube2 = $('#cubes2');
var cube3 = $('#cubes3');
var cube4 = $('#cubes4');
var cube = $('#cubes');

function renderDigit(matrix, container, number) {
    var children = container.children().children();
    var len = matrix[number].length;
    var state;
    for (var i = 0; i < len; i++) {
        state = children.eq(i).data('state') || 'off';
        if (
            (matrix[number][i] && state === 'off') ||
            (!matrix[number][i] && state === 'on')
        ) {
            rotate.call(children.eq(i));
        }
    }
}

function render() {
    var now = new Date(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        hours = now.getHours();

    renderDigit(matr, cube1, Number(parseInt(hours / 10)));
    renderDigit(matr, cube2, Number(hours % 10));
    renderDigit(matr, cube3, Number(parseInt(min / 10)));
    renderDigit(matr, cube4, Number(min % 10));

    renderDigit(point, cube, Number(sec % 2));

    requestAnimationFrame(render);
}
requestAnimationFrame(render);

function rotate(){
    var angle = ($(this).data('angle') + -90) || -90;
    var state = $(this).data('state') || 'off';
    $(this).css({'transform': 'rotateX(' + angle + 'deg)'});
    $(this).data('angle', angle);
    $(this).data('state', (state === 'on') ? 'off' : 'on');
}