const levelDisplay: HTMLSpanElement = document.getElementById('level-display')!;
const scoreDisplay: HTMLSpanElement = document.getElementById('score-display')!;
const board: HTMLDivElement = document.getElementById(
  'board'
)! as HTMLDivElement;
const overlay: HTMLDivElement = document.querySelector('.overlay')!;
const replayButton: HTMLButtonElement = document.createElement('button');
const numberOfSquares: number = 400;
const highestIndexSquare: number = numberOfSquares - 1;
const widthOfBoard: number = Math.sqrt(numberOfSquares);
const invaders: number[] = [];
const cells: HTMLDivElement[] = [];
let level: number = 1;
let scoreMultiplier: number;
let invaderSpeed: number;
let score: number = 0;
let laserSpeed: number;
let shootTimer: number;
let playerPosition: number = highestIndexSquare - Math.floor(widthOfBoard / 2);
let canPlayerShoot: boolean = true;
let gameIsOver: boolean = true;
let gameStartTimer: number = 3;
let invadersMoveTimer: number;
let startingX: number, startingY: number, movingX: number, movingY: number;

for (let i = 0; i <= highestIndexSquare; i++) {
  const cell: HTMLDivElement = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  cell.id = i.toString();
  cells.push(cell);
}

const generateRandomNumber = (): number => {
  return Math.floor(Math.random() * 59);
};

const fillSquares = () => {
  clearInterval(invadersMoveTimer);
  while (invaders.length < level * 5) {
    const randomNumber: number = generateRandomNumber();
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
    const highestIndexInvader: number = Math.max(...invaders);
    if (highestIndexInvader <= highestIndexSquare - widthOfBoard) {
      const redrawInvaders = (arr: number[]) => {
        cells.filter(cell => {
          if (cell.classList.contains('invader')) {
            if (parseInt(cell.id) <= highestIndexInvader) {
              cell.classList.remove('invader');
            }
          }
        });
        arr.forEach((element: number) => {
          cells[element].classList.add('invader');
        });
      };
      const invaderDestinations: number[] = [];
      invaders.forEach((invader: number) => {
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
  const player: HTMLDivElement = cells[playerPosition];
  player.classList.add('player');
};

document.addEventListener(
  'touchstart',
  e => {
    e.preventDefault;
    startingX = e.touches[0].clientX;
    startingY = e.touches[0].clientY;
  },
  { passive: false }
);

document.addEventListener(
  'touchmove',
  e => {
    e.preventDefault;
    movingX = e.touches[0].clientX;
    movingY = e.touches[0].clientY;
  },
  { passive: false }
);

document.addEventListener(
  'touchend',
  e => {
    e.preventDefault;
    if (startingX + 100 > movingX) {
      moveLeft();
    } else if (movingX < 1) {
      shoot();
    }

    if (startingX - 100 < movingX) {
      moveRight();
    } else if (movingX < 1) {
      shoot();
    }
    if (startingY + 100 < movingY) {
      e.preventDefault();
    }
    movingX = 0;
  },
  { passive: false }
);

document.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    e.preventDefault();
    moveLeft();
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    e.preventDefault();
    moveRight();
  } else if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
    e.preventDefault();
    shoot();
  }
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

const shoot = () => {
  if (gameIsOver === false) {
    if (canPlayerShoot === true) {
      let laserPosition = playerPosition;
      const moveLaser = () => {
        if (laserPosition >= widthOfBoard) {
          cells[laserPosition].classList.remove('laser');
          laserPosition -= widthOfBoard;
          cells[laserPosition].classList.add('laser');
          if (cells[laserPosition].classList.contains('invader')) {
            cells[laserPosition].classList.remove('invader');
            invaders.splice(invaders.indexOf(laserPosition), 1);
            score = score + scoreMultiplier;
            scoreDisplay.innerText = Math.floor(score).toString();
            cells[laserPosition].classList.remove('laser');
            clearInterval(laserTimer);
            if (invaders.length === 0) {
              gameIsOver = true;
              gameOver();
            }
          }
        } else {
          cells[laserPosition].classList.remove('laser');
        }
      };
      canPlayerShoot = false;
      const laserTimer: number = setInterval(moveLaser, laserSpeed);
      setTimeout(playerCanShoot, shootTimer);
    }
  }
};

const playerCanShoot = () => {
  canPlayerShoot = true;
};

const setStats = () => {
  gameStartTimer = 3;
  invaderSpeed = Math.ceil(1750 / level);
  laserSpeed = invaderSpeed / 25;
  shootTimer = laserSpeed * 20;
  scoreMultiplier = level * 10;
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
  const startTimerInterval: number = setInterval(countdown, 1000);
};

const restart = () => {
  cells.forEach(cell => {
    cell.classList.remove('invader');
    cell.classList.remove('player');
  });
  invaders.splice(0, invaders.length);
  playerPosition = highestIndexSquare - Math.floor(widthOfBoard / 2);
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
