//Rory Nicholas 22/02/2022

//DOM References
const squares = document.getElementsByClassName("empty-square")

class Board {
    constructor() {
        this.board = [
            null, null, null,
            null, null, null,
            null, null, null
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

    makeMove(move) {
        this.board[move] = this.turn;
        this.switchTurn();
    }

    attemptMove(move) {
        //Attempt move using given box id
        move = move[4] //Box position will be fourth char in id
        this.makeMove(move)
    }
}