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

        // This variable is used to manage the two players' turn.
        // The human player cannot place a disk when currentTurn is computer.
        this.currentTurn = Reversi.TURN.player;

        this.blackScore = 0;
        this.whiteScore = 0;

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

        this.updateScores();
    }

    // Places a disk on (x, y) and flips other disks accordingly.
    // Returns true if you can place a disk on (x, y), otherwise false.
    placeDisk(turn, x, y) {
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

    // Player places a disk.
    playerPlacesDisk(x, y) {
        if (!this.placeDisk(Reversi.TURN.player, x, y)) {
            return false;
        }

        this.updateScores();
        this.currentTurn = Reversi.TURN.computer;
        return true;
    }

    // Computer places a disk.
    // Returns true if it can place a disk, otherwise false.
    computerPlacesDisk() {
        const [x, y] = this.getsSquareToPlaceDisk();
        if (x === -1 && y === -1) {
            return false;
        }

        this.updateScores();
        this.currentTurn = Reversi.TURN.player;
        return true;
    }

    // Gets the square that computer should put a disk on.
    // TODO: Introduce alpha-beta algorithm
    // Returns [x, y]. If it cannot put a disk, returns [-1, -1].
    getsSquareToPlaceDisk() {
        const trials = 1000
        for (let i = 0; i < trials; ++i) {
            let x = Math.floor(Math.random() * Reversi.GRID_SIZE);
            let y = Math.floor(Math.random() * Reversi.GRID_SIZE);
            if (this.placeDisk(Reversi.TURN.computer, x, y)) {
                return [x, y];
            }
        }
        return [-1, -1];
    }

    // Updates blackScore and whiteScore.
    updateScores() {
        let blackScoreCount = 0;
        let whiteScoreCount = 0;

        for (let x = 0; x < Reversi.GRID_SIZE; ++x) {
            for (let y = 0; y < Reversi.GRID_SIZE; ++y) {
                switch (this.grid[x][y]) {
                    case Reversi.SQUARE_STATE.black:
                        ++blackScoreCount;
                        break;
                    case Reversi.SQUARE_STATE.white:
                        ++whiteScoreCount;
                        break;
                    case Reversi.SQUARE_STATE.vacant:
                }
            }
        }

        this.blackScore = blackScoreCount;
        this.whiteScore = whiteScoreCount;
    }

    isInGrid(x, y) {
        return x >= 0 && x < Reversi.GRID_SIZE && y >= 0 && y < Reversi.GRID_SIZE;
    }
}