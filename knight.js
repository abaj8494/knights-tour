/**
 * Knight's Tour Solver
 * JavaScript implementation of the Knight's Tour algorithm
 */

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
    }

    markVisited() {
        this.visited = true;
    }

    toString() {
        return this.visited ? 'X' : '.';
    }

    isKnightMove(x, y) {
        const dx = Math.abs(x - this.x);
        const dy = Math.abs(y - this.y);
        return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }
}

class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = Array(rows).fill().map((_, row) => 
            Array(cols).fill().map((_, col) => new Cell(row, col))
        );
        this.x = 0;
        this.y = 0;
        this.startX = 0;
        this.startY = 0;
        this.moveCount = 0;
        this.moves = [];
    }

    setStartPosition(x, y) {
        if (x >= 0 && x < this.rows && y >= 0 && y < this.cols) {
            this.x = x;
            this.y = y;
            this.startX = x;
            this.startY = y;
            this.board[x][y].markVisited();
            this.moves = [[x, y]];
            this.moveCount = 0;
            return true;
        }
        return false;
    }

    getCell(x, y) {
        if (x >= 0 && x < this.rows && y >= 0 && y < this.cols) {
            return this.board[x][y];
        }
        return null;
    }

    getAvailableMoves() {
        const moves = [];
        const knightMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
        
        for (const [dx, dy] of knightMoves) {
            const newX = this.x + dx;
            const newY = this.y + dy;
            
            if (newX >= 0 && newX < this.rows && newY >= 0 && newY < this.cols && 
                !this.board[newX][newY].visited) {
                moves.push([newX, newY]);
            }
        }
        
        return moves;
    }

    getAvailableMovesFrom(pos) {
        const [x, y] = pos;
        const moves = [];
        const knightMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
        
        for (const [dx, dy] of knightMoves) {
            const newX = x + dx;
            const newY = y + dy;
            
            if (newX >= 0 && newX < this.rows && newY >= 0 && newY < this.cols && 
                !this.board[newX][newY].visited) {
                moves.push([newX, newY]);
            }
        }
        
        return moves;
    }

    printBoard() {
        let result = '';
        for (const row of this.board) {
            result += row.map(cell => cell.toString()).join(' ') + '\n';
        }
        console.log(result);
        console.log(`Knight position: (${this.x}, ${this.y})`);
        console.log(`Moves available: ${this.getAvailableMoves().length}`);
    }

    isSolved(tour = false) {
        // Check if all cells have been visited
        let allVisited = true;
        
        for (const row of this.board) {
            for (const cell of row) {
                if (!cell.visited) {
                    allVisited = false;
                    break;
                }
            }
            if (!allVisited) break;
        }
        
        // If we're checking for a closed tour, make sure we can return to start
        if (tour && allVisited) {
            // Check if current position can reach starting position
            const dx = Math.abs(this.x - this.startX);
            const dy = Math.abs(this.y - this.startY);
            const canReturn = (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
            return canReturn;
        }
        
        return allVisited;
    }

    reset() {
        for (const row of this.board) {
            for (const cell of row) {
                cell.visited = false;
            }
        }
        this.moveCount = 0;
        this.moves = [];
    }

    undoMove() {
        if (this.moves.length <= 1) {
            return false;
        }
        
        this.board[this.x][this.y].visited = false;
        this.moves.pop();
        [this.x, this.y] = this.moves[this.moves.length - 1];
        this.moveCount--;
        
        return true;
    }

    move(x, y) {
        // Check if in bounds
        if (!(x >= 0 && x < this.rows && y >= 0 && y < this.cols)) {
            return false;
        }
        
        // Check if unvisited
        if (this.board[x][y].visited) {
            return false;
        }
        
        // Check if valid knight move
        const dx = Math.abs(this.x - x);
        const dy = Math.abs(this.y - y);
        if (!((dx === 2 && dy === 1) || (dx === 1 && dy === 2))) {
            return false;
        }
        
        this.x = x;
        this.y = y;
        this.moveCount++;
        this.board[x][y].markVisited();
        this.moves.push([x, y]);
        
        return true;
    }

    printMoves() {
        console.log("Moves made:");
        console.log(this.moves.map((move, index) => [index, move]));
        console.log(`Total moves: ${this.moveCount}`);
    }
}

class Knight {
    constructor(N = 8, M = 8) {
        this.board = new Board(N, M);
    }

    setStartPosition(x, y) {
        return this.board.setStartPosition(x, y);
    }

    move(x, y) {
        return this.board.move(x, y);
    }

    solveClosedTour() {
        if (!this.board.moves.length) {
            return false;
        }
        
        return this._solve(true);
    }

    solve() {
        if (!this.board.moves.length) {
            return false;
        }
        
        return this._solve(false);
    }

    _solve(tour = false) {
        // Check if we've visited all cells
        const totalCells = this.board.rows * this.board.cols;
        
        if (this.board.moveCount === totalCells - 1) {
            // We're visiting the last cell
            if (!tour) {
                return true;
            }
            
            // For closed tour, check if we can get back to start
            const lastX = this.board.x;
            const lastY = this.board.y;
            const dx = Math.abs(lastX - this.board.startX);
            const dy = Math.abs(lastY - this.board.startY);
            
            if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
                return true;
            }
            return false;
        }
        
        // Warnsdorff's heuristic: sort moves by fewest onward moves
        let moves = this.board.getAvailableMoves();
        if (!moves.length) {
            return false;
        }
        
        // Sort by the number of onward moves (fewer options first)
        moves.sort((a, b) => {
            const movesFromA = this.board.getAvailableMovesFrom(a).length;
            const movesFromB = this.board.getAvailableMovesFrom(b).length;
            return movesFromA - movesFromB;
        });
        
        for (const [moveX, moveY] of moves) {
            if (this.board.move(moveX, moveY)) {
                if (this._solve(tour)) {
                    return true;
                }
                this.board.undoMove();
            }
        }
        
        return false;
    }
} 