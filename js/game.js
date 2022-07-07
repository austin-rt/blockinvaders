const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const board = document.getElementById('board');
const overlay = document.querySelector('.overlay');
const replayButton = document.createElement('button');
const numberOfSquares = 400;
const highestIndexSquare = numberOfSquares - 1;
const widthOfBoard = Math.sqrt(numberOfSquares);
const invaders = [];
const deadInvaders = [];
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

const generateRandomNumber = () => {
  return Math.floor(Math.random() * (59));
};

for (let i = 0; i <= highestIndexSquare; i++) {
  const cell = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  cell.id = i;
  // cell.innerText = i;
}

const cells = [...board.children];
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

const placePlayer = () => {
  player = cells[playerPosition];
  player.classList.add('player');
};

document.addEventListener('keydown', (e) => {
  e.preventDefault();
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    moveLeft();
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    moveRight();
  } else if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
    shoot();
  };
});

const moveLeft = () => {
  if (gameIsOver === false) {
    if (playerPosition > 380) {
      cells[playerPosition].classList.remove('player');
      playerPosition--;
      placePlayer();
    }
  }
};

const moveRight = () => {
  if (gameIsOver === false) {
    if (playerPosition < 399) {
      cells[playerPosition].classList.remove('player');
      playerPosition++;
      placePlayer();
    }
  }
};

const shoot = () => {
  if (gameIsOver === false) {
    if (canPlayerShoot === true) {
      let bulletPosition = playerPosition;
      const moveBullet = () => {
        if (bulletPosition >= 20) {
          cells[bulletPosition].classList.remove('bullet');
          bulletPosition -= widthOfBoard;
          cells[bulletPosition].classList.add('bullet');
          if (cells[bulletPosition].classList.contains('invader')) {
            cells[bulletPosition].classList.remove('invader');
            invaders.splice(invaders.indexOf(bulletPosition), 1);
            deadInvaders.push('x');
            score = deadInvaders.length * scoreMultiplier;
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

const setStats = () => {
  gameStartTimer = 3;
  invaderSpeed = Math.ceil((2000 / (level * 1.3)) + 500);
  bulletSpeed = (invaderSpeed / 100) + 2;
  shootTimer = bulletSpeed * 15;
  scoreMultiplier = level * 2 + 10;
  console.log(`level: ${level}`);
  console.log(`invaderSpeed: ${invaderSpeed}`);
  console.log(`bulletSpeed: ${bulletSpeed}`);
  console.log(`shootTimer: ${shootTimer}`);
};

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


placePlayer();
startGame();

replayButton.addEventListener('click', () => {
  level = 1;
  score = 0;
  restart();
});
