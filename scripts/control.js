//////// constants and variables

const board = document.getElementById("board");
const refreshBtn = document.getElementById("refresh");
const turnLabel = document.getElementById("turn");
const body = document.querySelector("body");
const instructions = document.getElementById("instructions");
const blueScoreLabel = document.getElementById("blueScore");
const redScoreLabel = document.getElementById("redScore");
let turn = true; // true for blue's turn, false for red's turn
let gameWon = false;
let blueScore = 0;
let redScore = 0;

newBoard(); // create html
let slots = getBoardElements(); // array of token slots elements
// 2d array 0s 1s 2s
// 0s for empty, 1s for blue, 2s for red
let statusGrid = createStatusGrid(); 



//////// event listeners

// add new token
board.addEventListener("mousedown", (e) => {
    // corner case: game is done
    if (gameWon) {
        return;
    }

    // get row and col of clicked grid element
    let position = e.target.id.substring(4);
    let col = position % 7;

    // get new token location
    let row = 5;
    while (!isEmpty(row, col)) {
        row--;
        if (row === -1) {
            console.log("break");
            return; // corner case, col is full
        }
    }

    // update board
    if (turn) {
        // blue's turn
        statusGrid[row][col] = 1;
        slots[row][col].style.backgroundColor = "blue";
    } else {
        // red's turn
        statusGrid[row][col] = 2;
        slots[row][col].style.backgroundColor = "red";
    }

    if (checkForWin(row, col)) {
        gameWon = true;
        winFound();
    } else {
        changeTurn();
    }
});

// begin a new game
refreshBtn.addEventListener("click", () => {
    gameWon = false;
    body.style.backgroundColor = "burlywood";
    instructions.textContent = "~ Click a column to place a token ~"
    if (!turn) {
        changeTurn();
    }
    newBoard();
    slots = getBoardElements();
    statusGrid = createStatusGrid();
});



//////// helper methods

// create new empty board of elements with unique ids
function newBoard() {
    board.innerHTML = ``;
    for (let i = 0; i < 6 * 7; i++) {
        board.innerHTML += `<div id="spot${i}" class="slot"></div>`
    }
}

// returns 2d array of elements in the board
function getBoardElements() {
    let slotsTemp = [];
    for (let startIndex = 0; startIndex < 36; startIndex += 7) {
        slotsTemp.push(getRowElements(startIndex));
    }
    return slotsTemp;
}

// returns array of all elements in the specified row
function getRowElements(startElement) {
    let rowSlotsTemp = [];
    for (let curr = startElement; curr < startElement + 7; curr++) {
        rowSlotsTemp.push(document.getElementById("spot" + curr));
    }
    return rowSlotsTemp;
}

// returns new status grid. 2d array 0s 1s 2s
// 0s for empty, 1s for blue, 2s for red
function createStatusGrid() {
    let statusGridTemp = new Array(6);
    for (let row = 0; row < 6; row++) {
        statusGridTemp[row] = Array(7).fill(0);
    }
    return statusGridTemp;
}

// returns if the given col and row is empty
function isEmpty(row, col) {
    return statusGrid[row][col] === 0;
}

// returns if the given col and row is red
function isRed(row, col) {
    return statusGrid[row][col] === 2;
}

// returns if the given col and row is blue
function isBlue(row, col) {
    return statusGrid[row][col] === 1;
}

// returns if the given col and row contributes to the streak
function validCount(row, col) {
    if (row >= 0 && row <= 5 && col >= 0 && col <= 6) {
        if (turn) {
            return isBlue(row, col);
        } else {
            return isRed(row, col);
        }
    }
    return false;
}

// checks to see if player got 4 in a row
function checkForWin(row, col) {
    let count = 1; // number in a row
    let currRow = row;
    let currCol = col;

    // check south
    currRow++;
    while (validCount(currRow, currCol)) {
        count++;
        currRow++;
    }
    if (count >= 4) {
        return true;
    }

    // check NE and SW
    count = 1;
    // NE
    currRow = row - 1;
    currCol = col + 1;
    while (validCount(currRow, currCol)) {
        count++;
        currRow--;
        currCol++;
    }
    // SW
    currRow = row + 1;
    currCol = col -1;
    while (validCount(currRow, currCol)) {
        count++;
        currRow++;
        currCol--;
    }
    if (count >= 4) {
        return true;
    }

    // check east west
    count = 1;
    // east
    currRow = row;
    currCol = col + 1;
    while (validCount(currRow, currCol)) {
        count++;
        currCol++;
    }
    // west
    currCol = col - 1;
    while (validCount(currRow, currCol)) {
        count++;
        currCol--;
    }
    if (count >= 4) {
        return true;
    }

    // check SE and NW
    count = 1;
    // SE
    currRow = row + 1;
    currCol = col + 1;
    while (validCount(currRow, currCol)) {
        count++;
        currCol++;
        currRow++;
    }
    // NW
    currRow = row - 1;
    currCol = col - 1;
    while (validCount(currRow, currCol)) {
        count++;
        currRow--;
        currCol--;
    }
    if (count >= 4) {
        return true;
    }

    return false;
}

// function occurs when player wins
function winFound() {
    turnLabel.textContent = "";
    if (turn) {
        body.style.backgroundColor = "rgb(58, 127, 255)";
        instructions.textContent = "BLUE WINS!";
        blueScore++;
        blueScoreLabel.textContent = blueScore;
    } else {
        body.style.backgroundColor = "rgb(255, 61, 61)";
        instructions.textContent = "RED WINS!";
        redScore++;
        redScoreLabel.textContent = redScore;
    }
}

// changes turn
function changeTurn() {
    turn = !turn;
    if (turn) {
        turnLabel.textContent = "Blue's Turn";
        turnLabel.style.color = "rgb(0, 0, 192)"
    } else {
        turnLabel.textContent = "Red's Turn";
        turnLabel.style.color = "Red";
    }
}