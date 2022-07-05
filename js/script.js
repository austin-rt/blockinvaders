const board = document.getElementById('board');
let playerPosition = 389;
let canPlayerShoot = true;
let shootTimer = 500;
const numberOfSquares = 400;
const highestIndexSquare = numberOfSquares - 1;
const widthOfBoard = Math.sqrt(numberOfSquares);
const invaderSpeed = 500;

for (let i = 0; i <= highestIndexSquare; i++) {
  const cell = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  cell.id = i;
  cell.innerText = i;
}
const cells = [...board.children];

const invaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
];

const deadInvaders = []; //use for score

const fillSquares = () => {
  for (let i = 0; i < invaders.length; i++) {
    cells[invaders[i]].classList.add('invader');
  }
  const moveInvaders = () => {
    let lowestIndexInvader = Math.min(...invaders);
    let highestIndexInvader = Math.max(...invaders);
    if (highestIndexInvader < highestIndexSquare) {
      for (let i = 0; i < invaders.length; i++) {
        invaders[i] += widthOfBoard;
        for (let j = 0; j < highestIndexSquare; j++) {
          if (cells[j].id < lowestIndexInvader) {
            cells[j].classList.remove('invader');
          }
        }
        if (cells[invaders[i]] !== undefined) {
          cells[invaders[i]].classList.add('invader');
        }
      }
    } else {
      clearInterval(invadersMoveTimer);
      console.log('game over');
    }
  };

  invadersMoveTimer = setInterval(moveInvaders, invaderSpeed);
};
fillSquares();

const placePlayer = () => {
  player = cells[playerPosition];
  player.classList.add('player');
};

placePlayer();

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    moveLeft();
  } else if (e.code === 'ArrowRight') {
    moveRight();
  } else if (e.code === 'Space') {
    shoot();
  };
});

const moveLeft = () => {
  if (playerPosition > 380) {
    cells[playerPosition].classList.remove('player');
    playerPosition--;
    placePlayer();
  }
};

const moveRight = () => {
  if (playerPosition < 399) {
    cells[playerPosition].classList.remove('player');
    playerPosition++;
    placePlayer();
  }
};

const shoot = () => {
  if (canPlayerShoot === true) {
    let bulletPosition = playerPosition;
    const moveBullet = () => {
      if (bulletPosition > 19) {
        cells[bulletPosition].classList.remove('bullet');
        bulletPosition -= widthOfBoard;
        cells[bulletPosition].classList.add('bullet');
        if (cells[bulletPosition].classList.contains('invader')) {
          cells[bulletPosition].classList.remove('invader');
          invaders.splice(invaders.indexOf(bulletPosition), 1);
          deadInvaders.push(bulletPosition);
          cells[bulletPosition].classList.remove('bullet');
          clearInterval(bulletTimer);
          console.log('invaders', invaders);
          console.log('deadInvaders', deadInvaders);
        }
      } else {
        cells[bulletPosition].classList.remove('bullet');
      }
    };
    canPlayerShoot = false;
    bulletTimer = setInterval(moveBullet, 50);
    setTimeout(playerCanShoot, shootTimer);
  }
};

const playerCanShoot = () => {
  canPlayerShoot = true;
};