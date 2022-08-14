const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const board = document.getElementById('board');
const overlay = document.querySelector('.overlay');
const replayButton = document.createElement('button');
const numberOfSquares = 400;
const highestIndexSquare = numberOfSquares - 1;
const widthOfBoard = Math.sqrt(numberOfSquares);
const invaders = [];
let level = 1;
let scoreMultiplier;
let invaderSpeed;
let score = 0;
let bulletSpeed;
let shootTimer;
let playerPosition = highestIndexSquare - (Math.floor(widthOfBoard / 2));
let canPlayerShoot = true;
let gameIsOver = true;
let gameStartTimer = 3;
let invadersMoveTimer;


// creating cell html elements and spreading them into an array

for (let i = 0; i <= highestIndexSquare; i++) {
  const cell = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  cell.id = i;
}

const cells = [...board.children];

// while loop places random whole numbers into invaders array until it contains (level * 5) unique numbers
// forEach loop places "invader" css class onto each invader position
// setInterval calls moveInvaders at invaderSpeed frequency

const generateRandomNumber = () => {
  return Math.floor(Math.random() * (59));
};

const fillSquares = () => {
  clearInterval(invadersMoveTimer);
  while (invaders.length < (level * 5)) {
    let randomNumber = generateRandomNumber();
    if (invaders.indexOf(randomNumber) === -1) {
      invaders.push(randomNumber);
    }
  }
  invaders.forEach(invader => {
    cells[invader].classList.add('invader');
  });
  invadersMoveTimer = setInterval(moveInvaders, invaderSpeed);
};

// if highestIndexInvader gets to the last row, call gameOver else, define "redrawInvaders"
// redrawInvaders filters all cells and if the remove invader class. forEach loop adds "invader" class
// to cells with the html ID === the invaders array at each position
// creates new empty array, "invaderDestinations" forEach adds the width of the board to each invader position
// and pushes that onto the new array. then splice removes all elements from invaders array and spreads the
// new array into the original array. then calls "redrawInvaders" with the new invaders array

const moveInvaders = () => {
  if (gameIsOver === false) {
    let highestIndexInvader = Math.max(...invaders);
    if (highestIndexInvader <= (highestIndexSquare - (widthOfBoard))) {
      const redrawInvaders = (arr) => {
        cells.filter((cell) => {
          if (cell.classList.contains('invader')) {
            if (cell.id <= highestIndexInvader) {
              cell.classList.remove('invader');
            }
          }
        });
        arr.forEach(element => {
          cells[element].classList.add('invader');
        });
      };
      const invaderDestinations = [];
      invaders.forEach(invader => {
        invader += widthOfBoard;
        invaderDestinations.push(invader);
      });
      invaders.splice(0, invaders.length, ...invaderDestinations);
      redrawInvaders(invaders);
    } else {
      gameIsOver = true;
      gameOver();
    }
  }
};

// placing the player add/removes the "player" class from a cell based on
// keyboard event listeners

const placePlayer = () => {
  player = cells[playerPosition];
  player.classList.add('player');
};

let startingX,
  startingY,
  movingX,
  movingY;

document.addEventListener('touchstart', (e) => {
  e.preventDefault;
  startingX = e.touches[0].clientX;
  startingY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  e.preventDefault;
  movingX = e.touches[0].clientX;
  movingY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchend', (e) => {
  e.preventDefault;
  if (startingX + 100 > movingX) {
    moveLeft();
  } else if (movingX === undefined) {
    shoot();
  }

  if (startingX - 100 < movingX) {
    moveRight();
  } else if (movingX === undefined) {
    shoot();
  }
  if (startingY + 100 < movingY) {
    e.preventDefault();
  }

  movingX = undefined;
}, { passive: false });

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    e.preventDefault();
    moveLeft();
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    e.preventDefault();
    moveRight();
  } else if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
    e.preventDefault();
    shoot();
  };
});

const moveLeft = () => {
  if (gameIsOver === false) {
    if (playerPosition > numberOfSquares - widthOfBoard) {
      cells[playerPosition].classList.remove('player');
      playerPosition--;
      placePlayer();
    }
  }
};

const moveRight = () => {
  if (gameIsOver === false) {
    if (playerPosition < highestIndexSquare) {
      cells[playerPosition].classList.remove('player');
      playerPosition++;
      placePlayer();
    }
  }
};

// shoot truth whether the game is over and if the player is allowed to shoot, starts bulletPosition
// at playerPosition.
// moveBullet uses the same movement logic as moveInvaders. adding the width of the
// board to the current position, adding and removing the "bullet" class, and repeating with a
// setInterval based on bulletSpeed. player shoot cooldown needed. if the player shoots too fast,
// a bullet will get stuck.
// if bullet class and invader class occupy the same square, both are removed, that position is
// spliced out of the invader array, then score is added to, each hit adds to (level * 10) to the score
// if bulletPosition < widthOfBoard, bullet class is removed

const shoot = () => {
  if (gameIsOver === false) {
    if (canPlayerShoot === true) {
      let bulletPosition = playerPosition;
      const moveBullet = () => {
        if (bulletPosition >= widthOfBoard) {
          cells[bulletPosition].classList.remove('bullet');
          bulletPosition -= widthOfBoard;
          cells[bulletPosition].classList.add('bullet');
          if (cells[bulletPosition].classList.contains('invader')) {
            cells[bulletPosition].classList.remove('invader');
            invaders.splice(invaders.indexOf(bulletPosition), 1);
            score = score + scoreMultiplier;
            scoreDisplay.innerText = Math.floor(score);
            cells[bulletPosition].classList.remove('bullet');
            clearInterval(bulletTimer);
            if (invaders.length === 0) {
              gameIsOver = true;
              gameOver();
            }
          }
        } else {
          cells[bulletPosition].classList.remove('bullet');
        }
      };
      canPlayerShoot = false;
      bulletTimer = setInterval(moveBullet, bulletSpeed);
      setTimeout(playerCanShoot, shootTimer);
    }
  }
};

const playerCanShoot = () => {
  canPlayerShoot = true;
};

// setStats resets the pregame timer
// calculates the speed of invader descension, bulletSpeed, shootTimer,
// and scoreMultiplyer based on either the level or each other

const setStats = () => {
  gameStartTimer = 3;
  invaderSpeed = Math.ceil((2000 / (level * 1.3)) + 500);
  bulletSpeed = (invaderSpeed / 100) + 2;
  shootTimer = bulletSpeed * 20;
  scoreMultiplier = level * 10;
};

// startGame calls setStats and runs countdown timer using setInterval
// after timer === 1, it calls fillSquares

const startGame = () => {
  setStats();
  levelDisplay.innerText = `${level}`;
  scoreDisplay.innerText = `${score}`;
  overlay.innerText = `Level ${level} starting in... ${gameStartTimer}`;
  const countdown = () => {
    if (gameStartTimer === 1) {
      overlay.classList.add('hidden');
      clearInterval(startTimerInterval);
      fillSquares();
      gameIsOver = false;
    } else {
      gameStartTimer--;
      overlay.innerText = `Level ${level} starting in... ${gameStartTimer}`;
    }
  };
  const startTimerInterval = setInterval(countdown, 1000);
};

// restart handles level advancement as well as starting over from level 1

const restart = () => {
  cells.forEach(cell => {
    cell.classList.remove('invader');
    cell.classList.remove('player');
  });
  invaders.splice(0, invaders.length);
  playerPosition = highestIndexSquare - (Math.floor(widthOfBoard / 2));
  placePlayer();
  startGame();
};

// gameOver is called when the invaders.length === 0 or highestIndexInvader reaches
// the bottom of the board. if invaders.length === 0, level increments and player
// continues else display game over. again add/remove classes to HTML elements
// based on logic.
// will add leaderboard once backend is built

const gameOver = () => {
  if (gameIsOver === true) {
    clearInterval(invadersMoveTimer);
    if (invaders.length === 0) {
      overlay.innerText = `Level ${level} complete!`;
      level++;
      const restartTimer = setTimeout(restart, 1500);
    } else {
      overlay.innerHTML = `<p>Game Over</p><p>Level: ${level}</p><p>Score: ${score}</p>`;
      overlay.appendChild(replayButton);
      replayButton.innerText = 'Play again?';
      replayButton.classList.add('play');
      replayButton.classList.add('again');
    }
    overlay.classList.remove('hidden');
  }
};

// initial function calls upon page load

placePlayer();
startGame();

// resets level and score before starting game over
// button is only created and appended if palyer loses

replayButton.addEventListener('click', () => {
  level = 1;
  score = 0;
  restart();
});
