const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-btn');
const gameBoard = document.getElementById('game-board');
const twoPlayerBtn = document.getElementById('two-player-btn');
const computerBtn = document.getElementById('computer-btn');

let gameActive = false;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let isComputerMode = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleCellClick(clickedCell, clickedCellIndex) {
    if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer === 'O') {
        return; // Prevent clicking if the cell is already filled or if it's the computer's turn
    }
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    checkResult();
    if (gameActive && isComputerMode) {
        currentPlayer = 'O'; // Switch to computer
        setTimeout(computerMove, 500); // Add delay for the computer move
    }
}

function computerMove() {
    let bestMove = minimax(gameState, 'O').index;
    gameState[bestMove] = 'O';
    cells[bestMove].innerHTML = 'O';
    checkResult();
    currentPlayer = 'X'; // Switch back to user after computer move
}

function minimax(board, player) {
    const availableCells = board.map((cell, index) => (cell === '' ? index : null)).filter(x => x !== null);

    // Check for terminal states (win, loss, draw)
    if (checkWin('X')) return { score: -10 }; // Player wins
    if (checkWin('O')) return { score: 10 };  // Computer wins
    if (availableCells.length === 0) return { score: 0 }; // Draw

    let moves = [];
    for (let index of availableCells) {
        board[index] = player; // Make the move
        let result = minimax(board, player === 'O' ? 'X' : 'O'); // Call minimax recursively
        moves.push({ index, score: result.score }); // Store the move and its score
        board[index] = ''; // Undo the move
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

function checkWin(player) {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === player;
        });
    });
}

function checkResult() {
    if (checkWin(currentPlayer)) {
        highlightWinningCells();
        statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusDisplay.innerHTML = 'It\'s a draw!';
        gameActive = false;
        return;
    }
}

function highlightWinningCells() {
    winningConditions.forEach(condition => {
        if (condition.every(index => gameState[index] === currentPlayer)) {
            condition.forEach(index => {
                cells[index].classList.add('winner');
            });
        }
    });
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = '';
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('winner');
    });
}

function startGame(mode) {
    isComputerMode = mode === 'computer';
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = '';
    gameBoard.style.display = 'grid';
    resetButton.style.display = 'inline-block';
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('winner');
        cell.addEventListener('click', () => handleCellClick(cell, cell.dataset.index));
    });
}

twoPlayerBtn.addEventListener('click', () => startGame('two-player'));
computerBtn.addEventListener('click', () => startGame('computer'));
resetButton.addEventListener('click', resetGame);
