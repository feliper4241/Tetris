const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const rotateBtn = document.getElementById('rotateBtn');
const downBtn = document.getElementById('downBtn');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');

const BLOCK_SIZE = 30;
const ROWS = 20;
const COLS = 10;
const BLOCK_COLOR = '#00f'; // Azul único para os blocos

const shapes = [
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]],       // O
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[1, 1, 1, 1]]          // I
];

let board;
let currentShape;
let currentPos;
let gameInterval;
let gameStarted = false;
let score = 0;

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    score = 0;
    scoreDisplay.textContent = score;
    gameOverMessage.style.display = "none";
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    generateShape();
    gameInterval = setInterval(update, 500);
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    gameOverMessage.style.display = "block";
}

function generateShape() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    currentShape = shape;
    currentPos = { x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 };
}

function update() {
    if (!canMove(0, 1)) {
        placeShape();
        clearLines();
        generateShape();
        if (gameOver()) {
            stopGame();
        }
    } else {
        currentPos.y++;
    }
    draw();
}

function canMove(dx, dy) {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                let newX = currentPos.x + x + dx;
                let newY = currentPos.y + y + dy;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (board[newY] && board[newY][newX] !== null)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placeShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                board[currentPos.y + y][currentPos.x + x] = BLOCK_COLOR;
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    for (let y = 0; y < ROWS; y++) {
        if (board[y].every(cell => cell !== null)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(null));
            linesCleared++;
        }
    }
    score += linesCleared * 100;
    scoreDisplay.textContent = score;
}

function gameOver() {
    return board[0].some(cell => cell !== null);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawShape();
}

function drawBoard() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] !== null) {
                ctx.fillStyle = board[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = "#222";
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                ctx.fillStyle = BLOCK_COLOR;
                ctx.fillRect((currentPos.x + x) * BLOCK_SIZE, (currentPos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = "#222";
                ctx.strokeRect((currentPos.x + x) * BLOCK_SIZE, (currentPos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

leftBtn.addEventListener('click', () => canMove(-1, 0) && currentPos.x--);
rightBtn.addEventListener('click', () => canMove(1, 0) && currentPos.x++);
downBtn.addEventListener('click', () => canMove(0, 1) && currentPos.y++);
rotateBtn.addEventListener('click', () => currentShape = currentShape[0].map((_, i) => currentShape.map(row => row[i]).reverse()));

startBtn.addEventListener('click', startGame);
