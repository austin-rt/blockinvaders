"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var levelDisplay = document.getElementById('level-display');
var scoreDisplay = document.getElementById('score-display');
var board = document.getElementById('board');
var overlay = document.querySelector('.overlay');
var replayButton = document.createElement('button');
var numberOfSquares = 400;
var highestIndexSquare = numberOfSquares - 1;
var widthOfBoard = Math.sqrt(numberOfSquares);
var invaders = [];
var cells = [];
var level = 1;
var scoreMultiplier;
var invaderSpeed;
var score = 0;
var laserSpeed;
var shootTimer;
var playerPosition = highestIndexSquare - Math.floor(widthOfBoard / 2);
var canPlayerShoot = true;
var gameIsOver = true;
var gameStartTimer = 3;
var invadersMoveTimer;
var startingX, startingY, movingX, movingY;
for (var i = 0; i <= highestIndexSquare; i++) {
    var cell = document.createElement('div');
    board.appendChild(cell);
    cell.classList.add('cell');
    cell.id = i.toString();
    cells.push(cell);
}
var generateRandomNumber = function () {
    return Math.floor(Math.random() * 59);
};
var fillSquares = function () {
    clearInterval(invadersMoveTimer);
    while (invaders.length < level * 5) {
        var randomNumber = generateRandomNumber();
        if (invaders.indexOf(randomNumber) === -1) {
            invaders.push(randomNumber);
        }
    }
    invaders.forEach(function (invader) {
        cells[invader].classList.add('invader');
    });
    invadersMoveTimer = setInterval(moveInvaders, invaderSpeed);
};
var moveInvaders = function () {
    if (gameIsOver === false) {
        var highestIndexInvader_1 = Math.max.apply(Math, invaders);
        if (highestIndexInvader_1 <= highestIndexSquare - widthOfBoard) {
            var redrawInvaders = function (arr) {
                cells.filter(function (cell) {
                    if (cell.classList.contains('invader')) {
                        if (parseInt(cell.id) <= highestIndexInvader_1) {
                            cell.classList.remove('invader');
                        }
                    }
                });
                arr.forEach(function (element) {
                    cells[element].classList.add('invader');
                });
            };
            var invaderDestinations_1 = [];
            invaders.forEach(function (invader) {
                invader += widthOfBoard;
                invaderDestinations_1.push(invader);
            });
            invaders.splice.apply(invaders, __spreadArray([0, invaders.length], invaderDestinations_1, false));
            redrawInvaders(invaders);
        }
        else {
            gameIsOver = true;
            gameOver();
        }
    }
};
var placePlayer = function () {
    var player = cells[playerPosition];
    player.classList.add('player');
};
document.addEventListener('touchstart', function (e) {
    e.preventDefault;
    startingX = e.touches[0].clientX;
    startingY = e.touches[0].clientY;
}, { passive: false });
document.addEventListener('touchmove', function (e) {
    e.preventDefault;
    movingX = e.touches[0].clientX;
    movingY = e.touches[0].clientY;
}, { passive: false });
document.addEventListener('touchend', function (e) {
    e.preventDefault;
    if (startingX + 100 > movingX) {
        moveLeft();
    }
    else if (movingX < 1) {
        shoot();
    }
    if (startingX - 100 < movingX) {
        moveRight();
    }
    else if (movingX < 1) {
        shoot();
    }
    if (startingY + 100 < movingY) {
        e.preventDefault();
    }
    movingX = 0;
}, { passive: false });
document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        moveLeft();
    }
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        moveRight();
    }
    else if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
        e.preventDefault();
        shoot();
    }
});
var moveLeft = function () {
    if (gameIsOver === false) {
        if (playerPosition > numberOfSquares - widthOfBoard) {
            cells[playerPosition].classList.remove('player');
            playerPosition--;
            placePlayer();
        }
    }
};
var moveRight = function () {
    if (gameIsOver === false) {
        if (playerPosition < highestIndexSquare) {
            cells[playerPosition].classList.remove('player');
            playerPosition++;
            placePlayer();
        }
    }
};
var shoot = function () {
    if (gameIsOver === false) {
        if (canPlayerShoot === true) {
            var laserPosition_1 = playerPosition;
            var moveLaser = function () {
                if (laserPosition_1 >= widthOfBoard) {
                    cells[laserPosition_1].classList.remove('laser');
                    laserPosition_1 -= widthOfBoard;
                    cells[laserPosition_1].classList.add('laser');
                    if (cells[laserPosition_1].classList.contains('invader')) {
                        cells[laserPosition_1].classList.remove('invader');
                        invaders.splice(invaders.indexOf(laserPosition_1), 1);
                        score = score + scoreMultiplier;
                        scoreDisplay.innerText = Math.floor(score).toString();
                        cells[laserPosition_1].classList.remove('laser');
                        clearInterval(laserTimer_1);
                        if (invaders.length === 0) {
                            gameIsOver = true;
                            gameOver();
                        }
                    }
                }
                else {
                    cells[laserPosition_1].classList.remove('laser');
                }
            };
            canPlayerShoot = false;
            var laserTimer_1 = setInterval(moveLaser, laserSpeed);
            setTimeout(playerCanShoot, shootTimer);
        }
    }
};
var playerCanShoot = function () {
    canPlayerShoot = true;
};
var setStats = function () {
    gameStartTimer = 3;
    invaderSpeed = Math.ceil(1750 / level);
    laserSpeed = invaderSpeed / 25;
    shootTimer = laserSpeed * 20;
    scoreMultiplier = level * 10;
};
var startGame = function () {
    setStats();
    levelDisplay.innerText = "".concat(level);
    scoreDisplay.innerText = "".concat(score);
    overlay.innerText = "Level ".concat(level, " starting in... ").concat(gameStartTimer);
    var countdown = function () {
        if (gameStartTimer === 1) {
            overlay.classList.add('hidden');
            clearInterval(startTimerInterval);
            fillSquares();
            gameIsOver = false;
        }
        else {
            gameStartTimer--;
            overlay.innerText = "Level ".concat(level, " starting in... ").concat(gameStartTimer);
        }
    };
    var startTimerInterval = setInterval(countdown, 1000);
};
var restart = function () {
    cells.forEach(function (cell) {
        cell.classList.remove('invader');
        cell.classList.remove('player');
    });
    invaders.splice(0, invaders.length);
    playerPosition = highestIndexSquare - Math.floor(widthOfBoard / 2);
    placePlayer();
    startGame();
};
var gameOver = function () {
    if (gameIsOver === true) {
        clearInterval(invadersMoveTimer);
        if (invaders.length === 0) {
            overlay.innerText = "Level ".concat(level, " complete!");
            level++;
            var restartTimer = setTimeout(restart, 1500);
        }
        else {
            overlay.innerHTML = "<p>Game Over</p><p>Level: ".concat(level, "</p><p>Score: ").concat(score, "</p>");
            overlay.appendChild(replayButton);
            replayButton.innerText = 'Play again?';
            replayButton.classList.add('play');
            replayButton.classList.add('again');
        }
        overlay.classList.remove('hidden');
    }
};
placePlayer();
startGame();
replayButton.addEventListener('click', function () {
    level = 1;
    score = 0;
    restart();
});
