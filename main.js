window.addEventListener('DOMContentLoaded', e => {
    renderGrid();
});

function renderGrid() {
    for (let row = 0; row < 8; ++row) {
        const gridRowElement = document.createElement("tr");
        document.querySelector(".grid").appendChild(gridRowElement);

        for (let col = 0; col < 8; ++col) {
            const gridSquareElement = document.createElement("td");
            gridSquareElement.id = `square_${row}_${col}`;
            document.querySelector(".grid").appendChild(gridSquareElement);

            // Create a disk in each square
            // We change the disk status by changing its class (disk_black / disk_white / disk_none)
            const diskElement = document.createElement("div");
            diskElement.id = `disk_${row}_${col}`;
            diskElement.className = "disk_none";
            document.querySelector(`#square_${row}_${col}`).appendChild(diskElement);
        }
    }
}