const GameBoard = (function () {
  let board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  const getBoard = () => board.map((row) => [...row]);

  const resetBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = " ";
      }
    }
  };

  const printBoard = () => {
    console.log(board[0]);
    console.log(board[1]);
    console.log(board[2]);
  };

  const placeMark = (row, col, mark) => {
    if (board[row][col] === " ") {
      board[row][col] = mark;
      return true;
    }
    return false;
  };

  return {
    getBoard,
    resetBoard,
    printBoard,
    placeMark,
  };
})();

function Player(name, mark) {
  return { name, mark };
}

const DisplayController = (function () {
  const boardContainer = document.querySelector("#game-board");
  const vsInfoDisplay = document.querySelector(".vs-info-display");
  const startButton = document.querySelector("#start-button");
  const message = document.querySelector("#message");

  const renderBoard = () => {
    boardContainer.innerHTML = "";
    const currentBoard = GameBoard.getBoard();

    currentBoard.forEach((row, rowIndex) => {
      row.forEach((cel, colIndex) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = cel;
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;
        cell.addEventListener("click", handleCellClick);
        boardContainer.appendChild(cell);
      });
    });
  };

  const handleCellClick = (event) => {
    if (GameController.isGameOver()) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    GameController.playRound(row, col);
  };

  const handleStartButton = () => {
    const playerOne = prompt("Enter player 1 name: ");
    const playerTwo = prompt("Enter player 2 name: ");

    GameController.startGame(playerOne, playerTwo);
  };

  const updateVsInfo = (text) => {
    if (vsInfoDisplay) {
      vsInfoDisplay.textContent = text;
    } else {
      console.error("vsInfoDisplay element not found in the DOM!");
    }
  };

  const updateMessage = (text) => {
    if (message) {
      message.textContent = text;
    } else {
      console.error("message element not found in the DOM!");
    }
  };

  const updateButtonText = (text) => {
    if (startButton) {
      startButton.textContent = text;
    } else {
      console.error("startButton element not found in the DOM!");
    }
  };

  startButton.addEventListener("click", handleStartButton);

  return {
    renderBoard,
    updateVsInfo,
    updateMessage,
    updateButtonText,
  };
})();

const GameController = (function () {
  let player1, player2, currentPlayer;
  let gameOver = false;
  let board = GameBoard;

  const startGame = (playerOne = "Player 1", playerTwo = "Player 2") => {
    player1 = new Player(playerOne, "X");
    player2 = new Player(playerTwo, "O");

    currentPlayer = player1;

    gameOver = false;
    board.resetBoard();
    DisplayController.renderBoard();

    DisplayController.updateVsInfo(`${player1.name} vs ${player2.name}`);
    DisplayController.updateMessage(`${player1.name} goes first!`);
    DisplayController.updateButtonText("Restart");

    console.log(`${player1.name} vs ${player2.name}`);
    console.log(`${player1.name} goes first!`);
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayer = () => currentPlayer;

  const playRound = (row, col) => {
    if (isGameOver()) return;

    if (board.placeMark(row, col, currentPlayer.mark)) {
      DisplayController.renderBoard();
      if (checkWinner(currentPlayer.mark)) {
        DisplayController.updateVsInfo(`${currentPlayer.name.toUpperCase()} WINS!`);
        DisplayController.updateMessage(`${currentPlayer.name.toUpperCase()} WINS!`);
        console.log(`${currentPlayer.name} WINS!`);
        board.printBoard();
        gameOver = true;
        return;
      } else if (checkTie()) {
        DisplayController.updateVsInfo("IT'S A TIE!");
        DisplayController.updateMessage("IT'S A TIE!");
        console.log("IT'S A TIE!");
        board.printBoard();
        gameOver = true;
        return;
      } else {
        switchPlayer();
        DisplayController.updateMessage(`It's ${currentPlayer.name}'s turn!`);
        console.log(`It's ${currentPlayer.name}'s turn!`);
      }
    } else {
      DisplayController.updateMessage("Invalid move! Try again.");
      console.log("Invalid move! Try again.");
    }
    board.printBoard();
  };

  const checkWinner = (mark) => {
    const currentBoard = board.getBoard();

    for (let i = 0; i < 3; i++) {
      if (
        currentBoard[i][0] !== " " &&
        currentBoard[i][0] === mark &&
        currentBoard[i][1] === mark &&
        currentBoard[i][2] === mark
      ) {
        return true;
      }

      if (
        currentBoard[0][i] !== " " &&
        currentBoard[0][i] === mark &&
        currentBoard[1][i] === mark &&
        currentBoard[2][i] === mark
      ) {
        return true;
      }
    }

    if (
      currentBoard[0][0] !== " " &&
      currentBoard[0][0] === mark &&
      currentBoard[1][1] === mark &&
      currentBoard[2][2] === mark
    ) {
      return true;
    }

    if (
      currentBoard[0][2] !== " " &&
      currentBoard[0][2] === mark &&
      currentBoard[1][1] === mark &&
      currentBoard[2][0] === mark
    ) {
      return true;
    }

    return false;
  };

  const checkTie = () => {
    const currentBoard = board.getBoard();
    return currentBoard.flat().every((cell) => cell !== " ");
  };

  const isGameOver = () => gameOver;

  return {
    startGame,
    switchPlayer,
    getCurrentPlayer,
    playRound,
    isGameOver,
  };
})();
