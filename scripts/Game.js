class Game {
    constructor(board) {
        //// variables
        this.board = board;
        this.turn = true; // true for blue's turn, false for red's turn
        this.gameWon = false;

        //// unaccessible variables
        newBoard(); // create html
        this.slots = getBoardElements(); // array of token slots elements
        this.statusGrid = createStatusGrid(); // numerical array representation

        //// constructor helper methods
        // create board html in given board element
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
    } // end constructor


    //// getter methods
    get board() {
        return this._board;
    }

    get turn() {
        return this._turn;
    }

    get gameWon() {
        return this._gameWon;
    }

    get slots() {
        return this._slots;
    }

    get statusGrid() {
        return this._statusGrid;
    }

    

    //// setter methods
    set board(board) {
        this._board = board;
    }

    set turn(turn) {
        this._turn = turn;
    }

    set gameWon(gameWon) {
        this._gameWon = gameWon;
    }

    set slots(slots) {
        this._slots = slots;
    }

    set statusGrid(statusGrid) {
        this._statusGrid = statusGrid;
    }

    //// game logic methods
    // when new piece is added
    newMove(col) {
        // get new token location
        console.log(this.statusGrid);
        let row = 5;
        while (!isEmpty(this.statusGrid, row, col)) {
            row--;
            if (row === -1) {
                return -1; // corner case, col is full
            }
        }

        // update board
        if (this.turn) {
            // blue's turn
            this.statusGrid[row][col] = 1;
            this.slots[row][col].style.backgroundColor = "blue";
            if (checkForWin(this.statusGrid, this.turn, row, col)) {
                this.gameWon = true;
                return 1; // blue wins
            }
        } else {
            // red's turn
            this.statusGrid[row][col] = 2;
            this.slots[row][col].style.backgroundColor = "red";
            if (checkForWin(this.statusGrid, this.turn, row, col)) {
                this.gameWon = true;
                return 2; // red wins
            }
        }

        this.turn = !this.turn;
        return 0; // normal move (no winner)

        //// helper methods
        // returns if the given col and row is empty
        function isEmpty(sg, row, col) {
            return sg[row][col] === 0;
        }

        // checks to see if player got 4 in a row
        function checkForWin(sg, turn, row, col) {
            let count = 1; // number in a row
            let currRow = row;
            let currCol = col;

            // check south
            currRow++;
            while (validCount(sg, turn, currRow, currCol)) {
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
            while (validCount(sg, turn, currRow, currCol)) {
                count++;
                currRow--;
                currCol++;
            }
            // SW
            currRow = row + 1;
            currCol = col -1;
            while (validCount(sg, turn, currRow, currCol)) {
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
            while (validCount(sg, turn, currRow, currCol)) {
                count++;
                currCol++;
            }
            // west
            currCol = col - 1;
            while (validCount(sg, turn, currRow, currCol)) {
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
            while (validCount(sg, turn, currRow, currCol)) {
                count++;
                currCol++;
                currRow++;
            }
            // NW
            currRow = row - 1;
            currCol = col - 1;
            while (validCount(sg, turn, currRow, currCol)) {
                count++;
                currRow--;
                currCol--;
            }
            if (count >= 4) {
                return true;
            }

            return false;
        }

        // returns if the given col and row contributes to the streak
        function validCount(sg, turn, row, col) {
            if (row >= 0 && row <= 5 && col >= 0 && col <= 6) {
                if (turn) {
                    return isBlue(sg, row, col);
                } else {
                    return isRed(sg, row, col);
                }
            }
            return false;
        }

        // returns if the given col and row is red
        function isRed(sg, row, col) {
            return sg[row][col] === 2;
        }

        // returns if the given col and row is blue
        function isBlue(sg, row, col) {
            return sg[row][col] === 1;
        }
    } // end of newMove()

    
}
