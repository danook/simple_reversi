class Reversi {

    static GRID_SIZE = 8;

    static SQUARE_STATE = {
        vacant: 0,
        black: 1,
        white: -1
    };

    static TURN = {
        player: 1,
        computer: -1
    };

    constructor() {
        Reversi.GRID_SIZE = 8;

        this.grid = new Array(Reversi.GRID_SIZE);
        for (let i = 0; i < Reversi.GRID_SIZE; i++) {
            this.grid[i] = new Array(Reversi.GRID_SIZE).fill(Reversi.SQUARE_STATE.vacant);
        }

        // Initialize the grid
        console.log(this.grid[4][4]);
        this.grid[Reversi.GRID_SIZE / 2 - 1][Reversi.GRID_SIZE / 2 - 1] = Reversi.SQUARE_STATE.black;
        this.grid[Reversi.GRID_SIZE / 2 - 1][Reversi.GRID_SIZE / 2] = Reversi.SQUARE_STATE.white;
        this.grid[Reversi.GRID_SIZE / 2][Reversi.GRID_SIZE / 2 - 1] = Reversi.SQUARE_STATE.white;
        this.grid[Reversi.GRID_SIZE / 2][Reversi.GRID_SIZE / 2] = Reversi.SQUARE_STATE.black;
    }

    // Places a disk on (x, y) and flips other disks accordingly.
    // Returns true if you can place a disk on (x, y), otherwise false.
    placesDisk(turn, x, y) {
        if (!this.isInGrid(x, y) || this.grid[x][y] != Reversi.SQUARE_STATE.vacant) {
            return false;
        }

        // This becomes true when at least one disk is flipped
        let canPlaceDisk = false;

        for (let dx = -1; dx <= 1; ++dx) {
            for (let dy = -1; dy <= 1; ++dy) {
                if (dx == 0 && dy == 0) {
                    continue;
                }

                for (let i = 1; this.isInGrid(x + i * dx, y + i * dy); ++i) {
                    if (this.grid[x + i * dx][y + i * dy] == Reversi.SQUARE_STATE.vacant) {
                        break;
                    } else if (this.grid[x + i * dx][y + i * dy] == turn) {
                        // Flip the disks between (x, y) and (x+i*dx, y+i*dy)
                        if (i > 1) {
                            for (let j = 1; j < i; ++j) {
                                this.grid[x + j * dx][y + j * dy] = turn;
                            }
                            canPlaceDisk = true;
                        }
                        break;
                    }
                }
            }
        }

        if (canPlaceDisk) {
            this.grid[x][y] = turn;
            return true;
        } else {
            return false;
        }
    }

    // Computer places a disk.
    // Returns true if it can place a disk, otherwise false.
    computerPlacesDisk() {
        // TODO: Implement alpha-beta algorithm
        const trials = 1000
        for (let i = 0; i < trials; ++i) {
            let x = Math.floor(Math.random() * Reversi.GRID_SIZE);
            let y = Math.floor(Math.random() * Reversi.GRID_SIZE);
            if (this.placesDisk(Reversi.TURN.computer, x, y)) {
                return true;
            }
        }
        return false;
    }

    isInGrid(x, y) {
        return x >= 0 && x < Reversi.GRID_SIZE && y >= 0 && y < Reversi.GRID_SIZE;
    }
}