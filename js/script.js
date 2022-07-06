const board = document.getElementById('board');
const overlay = document.querySelector('.overlay');
const numberOfSquares = 400;
const highestIndexSquare = numberOfSquares - 1;
const widthOfBoard = Math.sqrt(numberOfSquares);
const invaderSpeed = 1000;
const invaders = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
];
const deadInvaders = []; //use for score calculation later
let playerPosition = highestIndexSquare - (Math.floor(widthOfBoard / 2));
let canPlayerShoot = true;
let shootTimer = 500;
let gameIsOver = false;
let gameStartTimer = 1;

for (let i = 0; i <= highestIndexSquare; i++) {
  const cell = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  cell.id = i;
  cell.innerText = i;
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
        console.log(lowestIndexInvader);
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
      console.log(invaders);
      redrawInvaders(invaders);
    } else {
      gameIsOver = true;
      gameOver();
    }
  }
};

// const fillSquares = () => {
//   for (let i = 0; i < invaders.length; i++) {
//     cells[invaders[i]].classList.add('invader');
//   }
//   const moveInvaders = () => {
//     if (gameIsOver === false) {
//       let lowestIndexInvader = Math.min(...invaders);
//       let highestIndexInvader = Math.max(...invaders);
//       if (highestIndexInvader < highestIndexSquare) {
//         for (let j = 0; j < invaders.length; j++) {
//           invaders[j] += widthOfBoard;
//           for (let k = 0; k < highestIndexSquare; k++) {
//             if (cells[k].classList.contains('player') && cells[k].classList.contains('invader')) {
//               gameIsOver = true;
//               gameOver();
//             }
//             if (cells[k].id < lowestIndexInvader) {
//               cells[k].classList.remove('invader');
//             }
//           }
//           if (cells[invaders[j]] !== undefined) {
//             cells[invaders[j]].classList.add('invader');
//           }
//         }
//       } else {
//         clearInterval(invadersMoveTimer);
//         gameOver();
//       }
//     }
//   };

//   invadersMoveTimer = setInterval(moveInvaders, invaderSpeed);
// };

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
      if (bulletPosition >= 20) {
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

const startGame = () => {
  overlay.innerText = `Get ready in ${gameStartTimer}`;
  const countdown = () => {
    if (gameStartTimer === 1) {
      overlay.classList.add('hidden');
      clearInterval(startTimerInterval);
      fillSquares();
    } else {
      gameStartTimer--;
      overlay.innerText = `Get ready in ${gameStartTimer}`;
    }
  };
  const startTimerInterval = setInterval(countdown, 1000);
};

const gameOver = () => {
  if (gameIsOver === true) {
    if (invaders.length === 0) {
      overlay.innerText = 'You Won';
    } else {
      overlay.innerText = 'You Lost';
    }
    overlay.classList.remove('hidden');
  }
};


placePlayer();
startGame();