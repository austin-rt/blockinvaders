const board = document.getElementById('board');
let playerPosition = 389;
for (let i = 0; i < 400; i++) {
  const cell = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  cell.innerText = i;
}

const cells = Array.from(document.querySelectorAll('.cell'));

const invaders = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
  65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
  85, 86, 87, 88, 89, 90, 91, 92, 93, 94
];

const fillSquares = () => {
  for (let i = 0; i < invaders.length; i++) {
    cells[invaders[i]].classList.add('invader');
  }
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
  let bulletPosition = playerPosition;
  const moveBullet = () => {
    if (bulletPosition > 19) {
      cells[bulletPosition].classList.remove('bullet');
      bulletPosition -= 20;
      cells[bulletPosition].classList.add('bullet');
      if (cells[bulletPosition].classList.contains('invader')) {
        cells[bulletPosition].classList.remove('invader');
        cells[bulletPosition].classList.remove('bullet');
        clearInterval(bulletTimer);
      }
    } else {
      cells[bulletPosition].classList.remove('bullet');
    }
  };
  bulletTimer = setInterval(moveBullet, 50);
};