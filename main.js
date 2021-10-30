const reversi = new Reversi()

window.addEventListener('DOMContentLoaded', e => {
    createGrid();
    renderGrid();
    updateScoreBoard();
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
    let blackScore = 0;
    let whiteScore = 0;
    for (let x = 0; x < Reversi.GRID_SIZE; ++x) {
        for (let y = 0; y < Reversi.GRID_SIZE; ++y) {
            switch (reversi.grid[x][y]) {
                case Reversi.SQUARE_STATE.black:
                    ++blackScore;
                    break;
                case Reversi.SQUARE_STATE.white:
                    ++whiteScore;
                    break;
                case Reversi.SQUARE_STATE.vacant:
            }
        }
    }

    const blackScoreElement = document.querySelector("#black_score");
    const whiteScoreElement = document.querySelector("#white_score");

    blackScoreElement.innerHTML = `${blackScore}`;
    whiteScoreElement.innerHTML = `${whiteScore}`;
}

async function onClickSquare(x, y) {
    await new Promise((resolve, reject) => {
        if (reversi.placesDisk(Reversi.TURN.player, x, y)) {
            renderGrid();
            updateScoreBoard();
            resolve();
        } else {
            showMessage("Cannot place a disk here.");
            reject();
        }
    });
    await new Promise((resolve, reject) => {
        showMessage("Computer is thinking...");
        setTimeout(() => {
            if (reversi.computerPlacesDisk()) {
                renderGrid();
                updateScoreBoard();
                resolve();
            } else {
                showMessage("Computer passed.");
                reject();
            }
        }, /* timeout = */ 500);
    });
    showMessage("It's your turn!");
}

function showMessage(message) {
    const messageElement = document.querySelector(".message");
    messageElement.innerHTML = message;
}