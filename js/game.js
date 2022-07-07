const levelDisplay = document.getElementById('level');
let level = 1;
levelDisplay.innerText = `Level: ${level}`;
const board = document.getElementById('board');
const overlay = document.querySelector('.overlay');
const numberOfSquares = 400;
const highestIndexSquare = numberOfSquares - 1;
const widthOfBoard = Math.sqrt(numberOfSquares);
const invaderSpeed = 1500 / level;
const invaders = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
];

const bulletSpeed = invaderSpeed / 100;
const shootTimer = bulletSpeed * 20;
let playerPosition = highestIndexSquare - (Math.floor(widthOfBoard / 2));
let canPlayerShoot = true;
let gameIsOver = true;
let gameStartTimer = 3;

for (let i = 0; i <= highestIndexSquare; i++) {
  const cell = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  cell.id = i;
}
const cells = [...board.children];
const fillSquares = () => {
  invaders.forEach(invader => {
    cells[invader].classList.add('invader');
  });
  invadersMoveTimer = setInterval(moveInvaders, invaderSpeed);
};

const moveInvaders = () => {
  if (gameIsOver === false) {
    let lowestIndexInvader = Math.min(...invaders);
    let highestIndexInvader = Math.max(...invaders);
    if (highestIndexInvader < (highestIndexSquare - widthOfBoard)) {
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
      gameOver(highestIndexInvader);
    }
  }
};

const placePlayer = () => {
  player = cells[playerPosition];
  player.classList.add('player');
};

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    moveLeft();
  } else if (e.code === 'ArrowRight') {
    moveRight();
  } else if (e.code === 'Space') {
    e.preventDefault();
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

const startGame = () => {
  overlay.innerText = `Game starting in ${gameStartTimer}`;
  const countdown = () => {
    if (gameStartTimer === 1) {
      overlay.classList.add('hidden');
      clearInterval(startTimerInterval);
      fillSquares();
      gameIsOver = false;
    } else {
      gameStartTimer--;
      overlay.innerText = `Game starting in ${gameStartTimer}`;
    }
  };
  const startTimerInterval = setInterval(countdown, 1000);
};

const gameOver = (highestIndexInvader) => {
  if (gameIsOver === true) {
    if (invaders.length === 0) {
      overlay.innerText = 'You Won';
      level++;
    } else if (highestIndexInvader >= (highestIndexSquare - widthOfBoard)) {
      overlay.innerText = 'You Lost';
    }
    overlay.classList.remove('hidden');
  }
};



placePlayer();
startGame();