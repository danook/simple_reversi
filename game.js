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
}