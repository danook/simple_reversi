const reversi = new Reversi()

window.addEventListener('DOMContentLoaded', e => {
    createGrid();
    renderGrid();
    updateScoreBoard();

    document.querySelector(".pass_button").addEventListener(
        "click", e => onClickPassButton());

    showMessage("It's your turn!");
});

function createGrid() {
    for (let row = 0; row < Reversi.GRID_SIZE; ++row) {
        const gridRowElement = document.createElement("tr");
        document.querySelector(".grid").appendChild(gridRowElement);

        for (let col = 0; col < Reversi.GRID_SIZE; ++col) {
            const gridSquareElement = document.createElement("td");
            gridSquareElement.id = `square_${row}_${col}`;
            gridSquareElement.addEventListener("click", e => onClickSquare(row, col));
            document.querySelector(".grid").appendChild(gridSquareElement);

            // Create a disk in each square
            // We change the disk status by changing its class (disk_black / disk_white / disk_none)
            const diskElement = document.createElement("div");
            diskElement.id = `disk_${row}_${col}`;
            document.querySelector(`#square_${row}_${col}`).appendChild(diskElement);
        }
    }
}

function renderGrid() {
    for (let row = 0; row < Reversi.GRID_SIZE; ++row) {
        for (let col = 0; col < Reversi.GRID_SIZE; ++col) {
            const diskElement = document.querySelector(`#disk_${row}_${col}`);
            switch (reversi.grid[row][col]) {
                case Reversi.SQUARE_STATE.vacant:
                    diskElement.className = "disk_none";
                    break;
                case Reversi.SQUARE_STATE.black:
                    diskElement.className = "disk_black";
                    break;
                case Reversi.SQUARE_STATE.white:
                    diskElement.className = "disk_white";
            }
        }
    }
}

function updateScoreBoard() {
    const blackScoreElement = document.querySelector("#black_score");
    const whiteScoreElement = document.querySelector("#white_score");

    blackScoreElement.innerHTML = `${reversi.countScore(Reversi.SQUARE_STATE.black)}`;
    whiteScoreElement.innerHTML = `${reversi.countScore(Reversi.SQUARE_STATE.white)}`;
}

async function onClickSquare(x, y) {
    if (reversi.isFinished || reversi.currentTurn !== Reversi.TURN.player) {
        return;
    }

    if (!reversi.playerPlacesDisk(x, y)) {
        showMessage("Cannot place a disk here.");
        return;
    }

    updateScoreBoard();
    renderGrid();
    switch (reversi.gameIsFinished()) {
        case Reversi.TURN.player:
            showMessage("You win!");
            return;
        case Reversi.TURN.computer:
            showMessage("You lose...");
            return;
        case 0:
    }
    showMessage("Computer is thinking...");

    await renewForComputerTurn();
}

async function onClickPassButton() {
    if (reversi.isFinished || reversi.currentTurn !== Reversi.TURN.player) {
        return;
    }
    if (!reversi.tryToPass(Reversi.TURN.player)) {
        showMessage("Cannot pass.");
        return;
    }

    showMessage("Passed.");

    await renewForComputerTurn();
}

async function renewForComputerTurn() {
    const computerPlacesDiskResult = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(reversi.computerPlacesDisk());
        }, /* timeout = */ 500);
    });

    if (!computerPlacesDiskResult) {
        showMessage("Computer passed.");
        return;
    }

    updateScoreBoard();
    renderGrid();
    switch (reversi.gameIsFinished()) {
        case Reversi.TURN.player:
            showMessage("Congratulations! You win!");
            return;
        case Reversi.TURN.computer:
            showMessage("You lose...");
            return;
        case 0:
    }
    showMessage("It's your turn!");
    return;
}

function showMessage(message) {
    const messageElement = document.querySelector(".message");
    messageElement.innerHTML = message;
}