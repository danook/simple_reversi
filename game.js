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

    // To obtain the score of each grid square
    static SQUARE_SCORE = [
        [150, -20, 8, 0, 0, 8, -20, 150],
        [-20, -40, -6, -6, -6, -6, -40, -20],
        [8, -6, 0, -1, -1, 0, -6, 8],
        [0, -6, -1, -2, -2, -1, -6, 0],
        [0, -6, -1, -2, -2, -1, -6, 0],
        [8, -6, 0, -1, -1, 0, -6, 8],
        [-20, -40, -6, -6, -6, -6, -40, -20],
        [150, -20, 8, 0, 0, 8, -20, 150]
    ];

    constructor() {
        Reversi.GRID_SIZE = 8;

        // This variable is used to manage the two players' turn.
        // The human player cannot place a disk when currentTurn is computer.
        this.currentTurn = Reversi.TURN.player;

        // If this is true, no user action is accepted
        this.isFinished = false;

        this.grid = new Array(Reversi.GRID_SIZE);
        for (let i = 0; i < Reversi.GRID_SIZE; i++) {
            this.grid[i] = new Array(Reversi.GRID_SIZE).fill(Reversi.SQUARE_STATE.vacant);
        }

        // Initialize the grid
        this.grid[Reversi.GRID_SIZE / 2 - 1][Reversi.GRID_SIZE / 2 - 1] = Reversi.SQUARE_STATE.black;
        this.grid[Reversi.GRID_SIZE / 2 - 1][Reversi.GRID_SIZE / 2] = Reversi.SQUARE_STATE.white;
        this.grid[Reversi.GRID_SIZE / 2][Reversi.GRID_SIZE / 2 - 1] = Reversi.SQUARE_STATE.white;
        this.grid[Reversi.GRID_SIZE / 2][Reversi.GRID_SIZE / 2] = Reversi.SQUARE_STATE.black;
    }

    // Places a disk on (x, y) and flips other disks accordingly.
    // Returns true if you can place a disk on (x, y), otherwise false.
    placeDisk(turn, x, y) {
        if (!this.isInGrid(x, y) || this.grid[x][y] !== Reversi.SQUARE_STATE.vacant) {
            return false;
        }

        const disksToFlip = this.getDisksToFlip(turn, x, y);
        if (disksToFlip.length === 0) {
            return false;
        }

        this.grid[x][y] = turn;
        for (const disk of disksToFlip) {
            this.grid[disk.x][disk.y] = turn;
        }
        return true;
    }

    // Returns an array of coordinate (x, y) of disks to flip
    getDisksToFlip(turn, x, y) {

        let disksToFlip = new Array();

        if (!this.isInGrid(x, y) || this.grid[x][y] !== Reversi.SQUARE_STATE.vacant) {
            return disksToFlip;
        }

        for (let dx = -1; dx <= 1; ++dx) {
            for (let dy = -1; dy <= 1; ++dy) {
                if (dx === 0 && dy === 0) {
                    continue;
                }

                for (let i = 1; this.isInGrid(x + i * dx, y + i * dy); ++i) {
                    if (this.grid[x + i * dx][y + i * dy] === Reversi.SQUARE_STATE.vacant) {
                        break;
                    } else if (this.grid[x + i * dx][y + i * dy] === turn) {
                        // Flip the disks between (x, y) and (x+i*dx, y+i*dy)
                        if (i > 1) {
                            for (let j = 1; j < i; ++j) {
                                disksToFlip.push({
                                    x: x + j * dx,
                                    y: y + j * dy
                                });
                            }
                        }
                        break;
                    }
                }
            }
        }

        return disksToFlip;
    }

    // Tries to pass the turn.
    // If cannot (i.e. you can place a disk), returns false and does nothing.
    tryToPass(turn) {
        for (let x = 0; x < Reversi.GRID_SIZE; ++x) {
            for (let y = 0; y < Reversi.GRID_SIZE; ++y) {
                if (this.getDisksToFlip(turn, x, y).length > 0) {
                    return false;
                }
            }
        }

        this.currentTurn = -turn;
        return true;
    }

    // Player places a disk.
    playerPlacesDisk(x, y) {
        if (!this.placeDisk(Reversi.TURN.player, x, y)) {
            return false;
        }

        this.currentTurn = Reversi.TURN.computer;
        return true;
    }

    // Computer places a disk.
    // Returns true if it can place a disk, otherwise false.
    computerPlacesDisk() {
        const [x, y] = this.getsSquareToPlaceDisk();
        this.currentTurn = Reversi.TURN.player;
        if (x === -1 && y === -1) {
            return false;
        }
        this.placeDisk(Reversi.TURN.computer, x, y);
        return true;
    }

    // Gets the square that computer should put a disk on.
    // TODO: Introduce alpha-beta algorithm
    // Returns [x, y]. If it cannot put a disk, returns [-1, -1].
    getsSquareToPlaceDisk() {
        const [x, y, score] = this.miniMax(Reversi.TURN.computer, 5, this.grid);
        return [x, y];
    }

    // Counts the number of disks of a certain color
    countScore(turn) {
        let scoreCount = 0;

        for (let x = 0; x < Reversi.GRID_SIZE; ++x) {
            for (let y = 0; y < Reversi.GRID_SIZE; ++y) {
                if (this.grid[x][y] === turn) {
                    ++scoreCount;
                }
            }
        }
        return scoreCount;
    }

    // If game is finished, returns the winner's id (1 or -1)
    // otherwise returns 0
    gameIsFinished() {
        for (let x = 0; x < Reversi.GRID_SIZE; ++x) {
            for (let y = 0; y < Reversi.GRID_SIZE; ++y) {
                if (this.getDisksToFlip(Reversi.TURN.computer, x, y).length > 0 || this.getDisksToFlip(Reversi.TURN.player, x, y).length > 0) {
                    return 0;
                }
            }
        }
        this.isFinished = true;
        if (this.countScore(Reversi.TURN.player) > this.countScore(Reversi.TURN.computer)) {
            return Reversi.TURN.player;
        } else {
            return Reversi.TURN.computer;
        }
    }

    isInGrid(x, y) {
        return x >= 0 && x < Reversi.GRID_SIZE && y >= 0 && y < Reversi.GRID_SIZE;
    }

    // Returns [x, y, score]
    miniMax(turn, depth, grid) {

        // Returns infinity if the game is finished
        const isFinished = this.gameIsFinished();
        if (isFinished !== 0) {
            return [-1, -1, 10000000 * isFinished];
        }

        if (depth === 0) {
            return [-1, -1, this.evaluateGridScore(grid)];
        }

        let bestMove = [-1, -1, 0];
        for (let x = 0; x < Reversi.GRID_SIZE; ++x) {
            for (let y = 0; y < Reversi.GRID_SIZE; ++y) {
                const disksToFlip = this.getDisksToFlip(turn, x, y);
                if (disksToFlip.length === 0) {
                    continue;
                }

                let newgrid = new Array(Reversi.GRID_SIZE);
                for (let i = 0; i < Reversi.GRID_SIZE; ++i) {
                    newgrid[i] = Array.from(grid[i]);
                }
                newgrid[x][y] = turn;
                for (const disk of disksToFlip) {
                    newgrid[disk.x][disk.y] = turn;
                }

                const move = this.miniMax(-turn, depth - 1, newgrid);
                if (bestMove[0] === -1 || (move[2] - bestMove[2]) * turn > 0) {
                    bestMove = [x, y, move[2]];
                }
            }
        }

        // When bestMove has not been renewed, it means that computer has to pass its turn.
        if (bestMove[0] === -1) {
            return [-1, -1, this.miniMax(-turn, depth - 1, grid) - 200 * turn];
        } else {
            return bestMove;
        }
    }

    evaluateGridScore(grid) {
        let score = 0;
        for (let x = 0; x < Reversi.GRID_SIZE; ++x) {
            for (let y = 0; y < Reversi.GRID_SIZE; ++y) {
                score += grid[x][y] * Reversi.SQUARE_SCORE[x][y];
            }
        }
        return score;
    }
}