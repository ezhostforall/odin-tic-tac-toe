const GameBoard = (function() {
    
    let board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];

    const getBoard = () => board.map(row => [...row]);

    const resetBoard = () => {
        board = [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "]
        ];
    }

    const printBoard = () => {
        console.log(board[0]);
        console.log(board[1]);
        console.log(board[2]);
    }

    const placeMark = (row, col, mark) => {
        if (board[row][col] === " ") {
            board[row][col] = mark;
            return true;
        }
        return false;
    }


    return {
        getBoard,
        resetBoard,
        printBoard,
        placeMark
    };
})();

function Player(name, mark) {
    this._name = name;
    this._mark = mark;
    this.getName = () => this._name;
    this.getMark = () => this._mark;
    return { name: this.getName(), mark: this.getMark() };
}

const GameController = (function() {
    let player1,
        player2,    
        currentPlayer;
    let gameOver = false,
    let board = GameBoard;
    
    const startGame = (playerOne = "Player 1", playerTwo = "Player 2") => {
        player1 = new Player(playerOne, "X");
        player2 = new Player(playerTwo, "O");

        currentPlayer = player1;

        gameOver = false;
        board.resetBoard();

        console.log(`${player1.name} vs ${player2.name}`);
        console.log(`${player1.name} goes first!`);

        playRound();
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const getCurrentPlayer = () => currentPlayer;

    const playRound = () => {
        while (!gameOver) {
            
            console.log(`It's ${currentPlayer.name}'s turn!`)
            board.printBoard();

            let row = parseInt(prompt("Enter row (0-2): "));
            let col = parseInt(prompt("Enter column (0-2): "));

            if (board.placeMark(row, col, currentPlayer.mark)) {
                if (checkWinner(currentPlayer.mark)) {
                    console.log(`${currentPlayer.name} wins!`);
                    board.printBoard();
                    gameOver = true;
                    return;
                }
                if (checkTie()) {
                    console.log("It's a tie!");
                    board.printBoard();
                    gameOver = true;
                    return;
                }
                
                board.printBoard();
                switchPlayer();
            }  else {
                console.log("Invalid move! Try again.");
            }
            
        }
    }

    const checkWinner = (mark) => {
        const currentBoard = board.getBoard();
        
        for (let i = 0; i < 3; i++) {
            if (currentBoard[i][0] !== " " &&
                currentBoard[i][0] === mark &&
                currentBoard[i][1] === mark && 
                currentBoard[i][2] === mark) {
                    
                    return true;
                }

            if (currentBoard[i][0] !== " " &&
                currentBoard[0][i] === mark &&
                currentBoard[1][i] === mark &&
                currentBoard[2][i] === mark) {
                    
                    return true;
            }          
            
        }

        if (currentBoard[0][0] !== " " &&
            currentBoard[0][0] === mark &&
            currentBoard[1][1] === mark && 
            currentBoard[2][2] === mark) {
                
                return true;
            }
            
        if (currentBoard[0][2] !== " " &&
            currentBoard[0][2] === mark &&
            currentBoard[1][1] === mark && 
            currentBoard[2][0] === mark) {
                
                return true;
            }

        return false;

    }

    const checkTie = () => {
        const currentBoard = board.getBoard();
        return currentBoard.flat().every(cell => cell !== " ");
    }

    return {
        startGame,
        switchPlayer,
        getCurrentPlayer
    };

})();

const gameController = GameController;
gameController.startGame("Player 1", "Player 2");