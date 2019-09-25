;(function () {
    var height_field = document.querySelector("#height"),
        width_field = document.querySelector("#width"),
        mineCount_field = document.querySelector("#mines"),
        endMessageField = document.querySelector("#gameEnd"),
        picture_field = document.querySelector("#pic"),
        board = document.querySelector(".board"),
        numberColors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c', '#34495e', '#7f8c8d'],
        endGameMessage = ["А ты хорош :)", "Поищи другую профессию..."];
        height = 5,
        width = 5,
        mineCount = 5,
        field = [],
        field_wiew = [],
        firstClick = true,
        gameOver = false,
        win = true;

    document.querySelector("#newgame").addEventListener('click', clearGame);
    height_field.addEventListener('input', (e)=>inputCheck(e));
    width_field.addEventListener('input', (e)=>inputCheck(e));
    mineCount_field.addEventListener('input', (e)=>inputCheck(e));
    
	function inputCheck(e) {
        height = parseInt(height_field.value);
        width = parseInt(width_field.value);
        var max = height * width - 10;
        mineCount_field.setAttribute("max", `${max}`);
        if (e.target != mineCount_field || e.target.value < 0) {
            mineCount_field.value = "5";
			var target = e.target;
			if (target.value < 4) {
				target.value = 4;
			} else if (target.value > 15) {
				target.value = 15;
			}
        } else if (e.target.value > max) {
            mineCount_field.value = max;
        }
        clearGame();
    }

    function hideEndGameMessage() {
        endMessageField.innerHTML = "";
        endMessageField.display = "none";
        endMessageField.classList = "end-game";
        picture_field.style.display = "none";
        picture_field.setAttribute("src", "../static/src/win.jpg");
    }

    function clearGame() {
        firstClick = true;
        gameOver = false;
        hideEndGameMessage();
        win = true;
        field = [];
        field_wiew.forEach(function (elem) {
            elem.remove()
        });
        height = parseInt(height_field.value);
        width = parseInt(width_field.value);
        mineCount = parseInt(mineCount_field.value);
        fieldGeneration();
    }

    function tag(tagName) {
        return document.createElement(tagName);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function fieldGeneration() {
        board.setAttribute(`style`, `width: ${50 * width}px; height: ${50 * height}px`);
        field = new Array(height);
        for (var i = 0; i < height; i++) {
            field[i] = new Array(width);
            for (var j = 0; j < width; j++) {
                field[i][j] = {
                    isMine: false,
                    isFlag: false,
                    isOpen: false,
                    minesAround: 0
                };
                var elem = tag('div');
                elem.classList.add("tile");
                elem.setAttribute("data-tile", `${i},${j}`);
                elem.oncontextmenu = function (e) {
                    e.preventDefault();
                    flag(e.target);
                }
                elem.addEventListener('click', function (e) {
                    click(e.target);
                });
                board.append(elem);
            }
        }
        field_wiew = board.querySelectorAll(".tile");
        minesGeneration();
        countMinesAround();
    }

    function flag(element) {
        if (!gameOver) {
            var coord = parseCoords(element);
            var cell = field[coord[0]][coord[1]],
                cell_view = field_wiew[coord[0] * height + coord[1]];
            if (!cell.isFlag) {
                cell_view.classList.add("tile--flagged");
                cell_view.innerHTML = "&#128681;";
            } else {
                cell_view.classList.remove("tile--flagged");
                cell_view.innerHTML = "";
            }
            cell.isFlag = !cell.isFlag;
        }
    }

    function minesGeneration() {
        while (mineCount > 0) {
            var x = getRandomInt(0, height),
                y = getRandomInt(0, width);
            if (!field[x][y].isMine) {
                field[x][y].isMine = true;
                mineCount--;
            }
        }
    }

    function countMinesAround() {
        for (var i = 0; i < height; i++)
            for (var j = 0; j < width; j++) {
                field[i][j].minesAround = calkMinesCount(i, j);
            }
    }

    function parseCoords(elem) {
        var coord = elem.getAttribute("data-tile").split(",");
        coord = coord.map(function (e) {
            return parseInt(e);
        });
        return coord;
    }

    function click(ceil) {
        if (!gameOver) {
            var coord = parseCoords(ceil);
            if (!field[coord[0]][coord[1]].isFlag) {
                if (firstClick && field[coord[0]][coord[1]].isMine) {
                    mineCount = 1;
                    minesGeneration();
                    field[coord[0]][coord[1]].isMine = false;
                    countMinesAround();
                } else if (field[coord[0]][coord[1]].isMine) {
                    gameOver = true;
                    win = false;
                    openMines(coord[0], coord[1]);
                }
                firstClick = false;
                openField(coord[0], coord[1]);
                gameOver = gameOver || isGameOver();
            }
            if (gameOver) {
                gameEnd(win);
            }
        }
    }

    function gameEnd(win) {
        if (win) {
            endMessageField.innerHTML = endGameMessage[0];
            endMessageField.classList.add("win");
            picture_field.setAttribute("src", "../static/src/win.jpg");
        } else {
            endMessageField.innerHTML = endGameMessage[1];
            endMessageField.classList.add("loose");
            picture_field.setAttribute("src", "../static/src/loose.jpg");
        }
        endMessageField.style.display = "block";
        picture_field.style.display = "block";
    }

    function openMines(x, y) {
        field_wiew[x * width + y].setAttribute("style", `background: #e74c3c`);
        for (var i = 0; i < height; i++)
            for (var j = 0; j < width; j++) {
                if (field[i][j].isMine) {
                    field_wiew[i * width + j].classList.add("tile--checked");
                    field_wiew[i * width + j].classList.add("tile--bomb");
                    field_wiew[i * width + j].innerHTML = "&#128163;";
                }
            }
    }

    function isGameOver() {
        var ggwp = true;
        var cell;
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                cell = field[i][j];
                if (!cell.isOpen && !cell.isMine) {
                    ggwp = false;
                }
            }
        }
        return ggwp;
    }


    function outBounds(x, y) {
        return x < 0 || y < 0 || x >= height || y >= width;
    }

    function calkMinesCount(x, y) {
        if (outBounds(x, y)) return 0;
        var cntr = 0;
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++) {
                if (!outBounds(x + i, y + j)) {
                    cntr += field[x + i][y + j].isMine;
                }
            }
        return cntr;
    }

    function openField(x, y) {
        if (outBounds(x, y)) return;

        var cell = field[x][y];

        if (cell.isFlag) return;
        if (cell.isOpen) return;

        cell.isOpen = true;
        openCeilView(x, y);

        if (cell.minesAround != 0) return;
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++) {
                openField(x + i, y + j);
            }
    }

    function openCeilView(x, y) {
        var ceil = field_wiew[x * width + y];
        ceil.classList.add("tile--checked");
        var minesCount = field[x][y].minesAround;
        if (minesCount !== 0 && !field[x][y].isMine) {
            ceil.innerHTML = minesCount;
            ceil.setAttribute("style", `color: ${numberColors[minesCount - 1]}`);
        }
    }

    clearGame();

})();


