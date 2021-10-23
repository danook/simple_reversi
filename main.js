const reversi = new Reversi()

window.addEventListener('DOMContentLoaded', e => {
    renderGrid();
});

function renderGrid() {
    for (let row = 0; row < Reversi.GRID_SIZE; ++row) {
        const gridRowElement = document.createElement("tr");
        document.querySelector(".grid").appendChild(gridRowElement);

        for (let col = 0; col < Reversi.GRID_SIZE; ++col) {
            const gridSquareElement = document.createElement("td");
            gridSquareElement.id = `square_${row}_${col}`;
            document.querySelector(".grid").appendChild(gridSquareElement);

            // Create a disk in each square
            // We change the disk status by changing its class (disk_black / disk_white / disk_none)
            const diskElement = document.createElement("div");
            diskElement.id = `disk_${row}_${col}`;

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

            document.querySelector(`#square_${row}_${col}`).appendChild(diskElement);
        }
    }
}