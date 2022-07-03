const board = document.getElementById('board');
for (let i = 0; i < 400; i++) {
  const cell = document.createElement('div');
  board.appendChild(cell);
  cell.classList.add('cell');
  cell.innerText = i;
}