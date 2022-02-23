//Rory Nicholas 22/02/2022

//DOM References
const squares = document.getElementsByTagName('td');
var snackbar = document.getElementById('snackbar');

class Board {
    constructor() {
        this.board = [
            null, null, null,
            null, null, null,
            null, null, null
        ];

        // All lines to check for a win
        this.winningLines = [
            // Horizontal lines
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            //Vertical lines
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            //Diagonal lines
            [0, 4, 8],
            [2, 4, 6]
        ];

        this.inProgress = true;
        this.turn = 'x';
    }

    switchTurn() {
        if (this.turn == 'x') {
            this.turn = 'o';
        }
        else {
            this.turn = 'x';
        }
    }

    checkWin() {
        // Returns 'x' or 'o' if either won, null otherwise.
        let square1, square2, square3;

        for (let line of this.winningLines) {
            square1 = this.board[line[0]];
            square2 = this.board[line[1]];
            square3 = this.board[line[2]];

            if (square1 != null && (square1 == square2) && (square2 == square3)) {
                return square1
            }
        }
        console.log('no winner found');
        return null;
    }

    endGame(winner) {
        this.inProgress = false;
        this.winner = winner;
        console.log('game over.', this.winner, 'wins!');
        showSnackbar();
    }

    makeMove(move) {
        if (this.board[move] == null) {
            this.board[move] = this.turn;
            this.switchTurn();
        } else {
            console.log('square already full')
        }
    }

    attemptMove(move) {
        //Check game is still actually in progress
        if (!this.inProgress){
            console.log('game has finished!');
            return;
        }

        // Attempt move using given box id
        move = move[3] // Box position will be fourth char in id
        move = parseInt(move);
        this.makeMove(move);

        let gameState = this.checkWin();
        if (gameState != null){
            this.endGame(gameState);
        }
    }

    CPUMove() {
        if (this.inProgress){
            this.randomMove();
            //this.miniMax();
        }
    }

    randomMove() {
        let choice;
        while (true) {
            choice = Math.floor(Math.random() * 9)
            if (this.board[choice] == null) {
                this.makeMove(choice);
                break;
            }
        }
    }

}

function displayBoard() {
    for (let i=0; i<squares.length; i++){
        if (myBoard.board[i] != null) {
            squares[i].innerText = myBoard.board[i];
            squares[i].setAttribute('class', 'filled-square');
        } else {
            squares[i].innerText = 'x';
            squares[i].setAttribute('class', 'empty-square');
        }
    }
}

function registerClick() {
    myBoard.attemptMove(event.target.id);

    // If move successful, turn will be 'o', so CPU move. Check user hasn't won yet first.
    if (myBoard.turn == 'o') {
        myBoard.CPUMove();
    } else {
        console.log('user move failed');
    }

    displayBoard();
}


function createListeners() {
    for (let i=0; i<squares.length; i++){
        squares[i].addEventListener('click', registerClick)
    }
}

function showSnackbar() {
    snackbar.className = 'show';
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

function hideSnackbar() {
    snackbar.className.replace('show', '');
}

createListeners();
let myBoard = new Board();