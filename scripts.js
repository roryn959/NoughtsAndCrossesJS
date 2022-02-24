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
        else if (this.turn == 'o') {
            this.turn = 'x';
        } else {
            console.log('*** switchturn error ***')
        }
    }

    checkWin() {
        // Returns 'x' or 'o' if either won, 'd' if draw, null otherwise
        let square1, square2, square3;

        //Check for win
        for (let line of this.winningLines) {
            square1 = this.board[line[0]];
            square2 = this.board[line[1]];
            square3 = this.board[line[2]];

            if (square1 != null && (square1 == square2) && (square2 == square3)) {
                return square1;
            }
        }

        //Check for draw. If we meet an empty square, it's in progess. else, draw.
        for (let i=0; i<9; i++){
            if (this.board[i] == null) {
                return null;
            }
        }

        return 'd';
    }

    evaluate() {
        let gameState = this.checkWin();

        if (gameState == 'x') {
            return 10;
        } else if (gameState == 'o') {
            return -10;
        } else if (gameState == 'd') {
            return 0;
        } else {
            return undefined;
        }
    }

    endGame(winner) {
        this.inProgress = false;
        this.winner = winner;
        console.log('game over.', this.winner, 'wins!');
        showSnackbar();
    }

    undoMove(move) {
        if (this.board[move] != null) {
            this.board[move] = null;
            this.switchTurn();
        } else {
            console.log('square', move, 'is already empty!');
        }
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
            //let move = this.easyMove();
            let move = this.hardMove();
            this.makeMove(move);
        }
    }

    easyMove() {
        return this.randomMove();
    }

    hardMove() {
        if (this.board[4] == null) {
            return 4;
        } else {
            return this.minimax('o')[1]
        }
    }

    randomMove() {
        let choice;
        while (true) {
            choice = Math.floor(Math.random() * 9)
            if (this.board[choice] == null) {
                return choice;
            }
        }
    }

    minimax(player) { //player => best score, best move

        // if terminal node then return evaluation
        let evaluation = this.evaluate();

        if (evaluation != undefined) {
            return [evaluation, undefined];
        }

        let result, best_score, best_move;
        best_move = 'u';
        // if maximising_player then
        if (player == 'x') {
            // best_score = -inf
            best_score = -100;

            // for each child of node do
            for (let i=0; i<9; i++) {
                if (this.board[i]==null){
                    // best_score = max(best_score, minimax(minimising_player, depth-1))
                    this.makeMove(i);
                    result = this.minimax('o');
                    this.undoMove(i);
                    if (result[0] > best_score) {
                        best_score = result[0];
                        best_move = i;
                    }
                }
            }
            // return best_score
            return [best_score, best_move];
        } else {
        // else *minimising_player* then
            // best_score = inf
            best_score = 100;

            // for each child of node do
            for (let i=0; i<9; i++) {
                if (this.board[i]==null){
                    // best_score = min(best_score, minimax(maximising_player, depth-1))
                    this.makeMove(i);
                    result = this.minimax('x');
                    this.undoMove(i);
                    if (result[0] < best_score) {
                        best_score = result[0];
                        best_move = i;
                    }
                }
            }
            //return best_score
            return [best_score, best_move];
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
displayBoard();