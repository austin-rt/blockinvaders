const board = document.getElementById('board');
for (let i = 0; i < 400; i++) {
  const cell = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  // cell.innerText = i;
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

player = cells[389];
player.classList.add('player');