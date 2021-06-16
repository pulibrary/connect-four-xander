//////// constants and variables
const refreshBtn = document.getElementById("refresh");
const turnLabel = document.getElementById("turn");
const body = document.querySelector("body");
const instructions = document.getElementById("instructions");
const blueScoreLabel = document.getElementById("blueScore");
const redScoreLabel = document.getElementById("redScore");
let blueScore = 0;
let redScore = 0;

const board = document.getElementById("board");
let game = new Game(board);


//////// event listeners

// add new token
board.addEventListener("mousedown", (e) => {
    // corner case: game is done
    if (game.gameWon) {
        return;
    }

    // get row and col of clicked grid element
    let position = e.target.id.substring(4);
    let col = position % 7;

    // place piece
    let gameOutcome = game.newMove(col);

    if (gameOutcome === -1) {
        // corner case, column is full
        return;
    } else if (gameOutcome === 1) {
        // blue wins
        blueWon();
    } else if (gameOutcome === 2) {
        // red wins
        redWon();
    } else {
        updateTurn();
    }
});

// begin a new game
refreshBtn.addEventListener("click", () => {
    body.style.backgroundColor = "burlywood";
    game = new Game(board);
    instructions.textContent = "~ Click a column to place a token ~"
});



//////// helper methods

// function occurs when player wins
function blueWon() {
    turnLabel.textContent = "";
    body.style.backgroundColor = "rgb(58, 127, 255)";
    instructions.textContent = "BLUE WINS!";
    blueScore++;
    blueScoreLabel.textContent = blueScore;
}

function redWon() {
    turnLabel.textContent = "";
    body.style.backgroundColor = "rgb(255, 61, 61)";
    instructions.textContent = "RED WINS!";
    redScore++;
    redScoreLabel.textContent = redScore;
}

// changes turn
function updateTurn() {
    if (game.turn) {
        turnLabel.textContent = "Blue's Turn";
        turnLabel.style.color = "rgb(0, 0, 192)"
    } else {
        turnLabel.textContent = "Red's Turn";
        turnLabel.style.color = "Red";
    }
}