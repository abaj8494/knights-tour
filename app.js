/**
 * Knight's Tour Solver - UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    const setSizeBtn = document.getElementById('set-size-btn');
    const selectStartBtn = document.getElementById('select-start-btn');
    const playModeBtn = document.getElementById('play-mode-btn');
    const resetBtn = document.getElementById('reset-btn');
    const closedTourCheck = document.getElementById('closed-tour');
    const showHintsCheck = document.getElementById('show-hints');
    const statusText = document.getElementById('status');
    const boardContainer = document.getElementById('board');

    // Game state
    let knight = null;
    let rows = 8;
    let cols = 8;
    let solving = false;
    let startMode = false;
    let playerMode = false;
    let solution = [];
    let cells = [];

    // Colors
    const LIGHT_SQUARE = getComputedStyle(document.documentElement).getPropertyValue('--light-square').trim();
    const DARK_SQUARE = getComputedStyle(document.documentElement).getPropertyValue('--dark-square').trim();
    const GREEN = getComputedStyle(document.documentElement).getPropertyValue('--green').trim();
    const DARK_GREEN = getComputedStyle(document.documentElement).getPropertyValue('--dark-green').trim();
    const HIGHLIGHT = getComputedStyle(document.documentElement).getPropertyValue('--highlight').trim();

    // Initialize
    initializeBoard(8, 8);

    // Event listeners
    setSizeBtn.addEventListener('click', handleSetSize);
    selectStartBtn.addEventListener('click', enableStartSelection);
    playModeBtn.addEventListener('click', enterPlayerMode);
    resetBtn.addEventListener('click', resetBoard);
    showHintsCheck.addEventListener('change', () => {
        if (playerMode) {
            updateBoard(true);
        }
    });

    function handleSetSize() {
        const newRows = parseInt(rowsInput.value);
        const newCols = parseInt(colsInput.value);
        
        if (isNaN(newRows) || isNaN(newCols) || newRows < 3 || newCols < 3) {
            statusText.textContent = "Board must be at least 3x3";
            return;
        }
        
        initializeBoard(newRows, newCols);
    }

    function initializeBoard(newRows, newCols) {
        rows = newRows;
        cols = newCols;
        knight = new Knight(rows, cols);
        solution = [];
        playerMode = false;
        startMode = false;
        
        // Clear board
        boardContainer.innerHTML = '';
        
        // Setup grid columns
        boardContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        // Create cells
        cells = [];
        for (let row = 0; row < rows; row++) {
            const rowCells = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                // Chess pattern
                cell.style.backgroundColor = (row + col) % 2 === 0 ? LIGHT_SQUARE : DARK_SQUARE;
                
                // Add coordinates
                const coords = document.createElement('span');
                coords.className = 'cell-coords';
                coords.textContent = `(${row},${col})`;
                cell.appendChild(coords);
                
                // Add click handler
                cell.addEventListener('click', () => handleCellClick(row, col));
                
                // Add to DOM and arrays
                boardContainer.appendChild(cell);
                rowCells.push(cell);
            }
            cells.push(rowCells);
        }
        
        updateStatus("Select board size and click 'Select Start'");
        selectStartBtn.disabled = false;
        selectStartBtn.textContent = "Select Start";
        playModeBtn.disabled = false;
    }

    function handleCellClick(row, col) {
        if (startMode) {
            // First click - set starting position
            knight.board.reset();
            knight.setStartPosition(row, col);
            updateBoard();
            
            if (playerMode) {
                // Continue in player mode
                startMode = false;
                updateStatus("Player Mode: Make your moves by clicking valid squares");
            } else {
                // Solver mode
                startMode = false;
                updateStatus("Solving... please wait");
                
                // Slight delay to update UI
                setTimeout(() => solveTour(closedTourCheck.checked), 100);
            }
        } else if (playerMode) {
            // Player is making moves
            const success = knight.move(row, col);
            if (success) {
                // Valid move made
                updateBoard(true);
                
                // Check if all cells are visited
                let allVisited = true;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (!knight.board.getCell(r, c).visited) {
                            allVisited = false;
                            break;
                        }
                    }
                    if (!allVisited) break;
                }
                
                if (allVisited) {
                    updateStatus("Congratulations! You completed the knight's tour!");
                    selectStartBtn.disabled = false;
                    selectStartBtn.textContent = "Select Start";
                    playModeBtn.disabled = false;
                    playerMode = false;
                } else {
                    const availableMoves = knight.board.getAvailableMoves();
                    if (availableMoves.length === 0) {
                        updateStatus("No more valid moves! Game over.");
                        selectStartBtn.disabled = false;
                        selectStartBtn.textContent = "Select Start";
                        playModeBtn.disabled = false;
                        playerMode = false;
                    } else {
                        updateStatus(`Player Mode: ${availableMoves.length} valid moves available`);
                    }
                }
            } else {
                updateStatus("Invalid move! Knight must move in L-shape to unvisited square");
            }
        } else {
            updateStatus("Click 'Select Start' or 'Play Mode' first");
        }
    }

    function enableStartSelection() {
        startMode = true;
        playerMode = false;
        updateStatus("Select a starting square");
        selectStartBtn.disabled = true;
        playModeBtn.disabled = true;
    }

    function enterPlayerMode() {
        playerMode = true;
        startMode = true;
        updateStatus("Player Mode: Select a starting square");
        selectStartBtn.disabled = true;
        playModeBtn.disabled = true;
    }

    function resetBoard() {
        if (knight) {
            knight.board.reset();
            solution = [];
            playerMode = false;
            startMode = false;
            updateBoard();
            updateStatus("Board reset. Select 'Select Start' to begin.");
            selectStartBtn.disabled = false;
            selectStartBtn.textContent = "Select Start";
            playModeBtn.disabled = false;
        }
    }

    function solveTour(closedTour) {
        // Prevent UI interaction during solving
        solving = true;
        
        if (closedTour) {
            var success = knight.solveClosedTour();
        } else {
            var success = knight.solve();
        }
        
        if (success) {
            solution = [...knight.board.moves];
            updateStatus(`Solution found! Animating ${solution.length} moves...`);
            animateSolution(0);
        } else {
            updateStatus("No solution found from this starting position");
            selectStartBtn.disabled = false;
            selectStartBtn.textContent = "Select Start";
            playModeBtn.disabled = false;
            solving = false;
        }
    }

    function animateSolution(moveIndex) {
        if (moveIndex >= solution.length) {
            updateStatus("Solution complete!");
            selectStartBtn.disabled = false;
            selectStartBtn.textContent = "Select Start";
            playModeBtn.disabled = false;
            solving = false;
            return;
        }
        
        // Update board to show current state
        updateSolutionBoard(moveIndex);
        
        // Schedule next animation step
        setTimeout(() => animateSolution(moveIndex + 1), 200);
    }

    function updateSolutionBoard(moveIndex) {
        // Reset all cells to their original color, keeping coordinates visible
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = cells[row][col];
                
                // Reset background
                cell.style.backgroundColor = (row + col) % 2 === 0 ? LIGHT_SQUARE : DARK_SQUARE;
                
                // Reset content
                const coordSpan = cell.querySelector('.cell-coords');
                if (coordSpan) {
                    coordSpan.textContent = `(${row},${col})`;
                }
                
                // Remove knight symbol and move number if exists
                const knightSymbol = cell.querySelector('.knight-symbol');
                if (knightSymbol) knightSymbol.remove();
                
                const moveNumber = cell.querySelector('.move-number');
                if (moveNumber) moveNumber.remove();
            }
        }
        
        // Color all visited cells green
        for (let i = 0; i <= moveIndex; i++) {
            const [x, y] = solution[i];
            const cell = cells[x][y];
            
            // Green color based on when it was visited
            const intensity = solution.length > 1 
                ? Math.max(50, 255 - Math.floor(200 * i / (solution.length - 1))) 
                : 150;
            
            const greenColor = `rgb(0, ${intensity}, 0)`;
            cell.style.backgroundColor = greenColor;
            
            // Add move number
            const moveNumber = document.createElement('span');
            moveNumber.className = 'move-number';
            moveNumber.textContent = i.toString();
            cell.appendChild(moveNumber);
        }
        
        // Show knight at current position
        const [currentX, currentY] = solution[moveIndex];
        const currentCell = cells[currentX][currentY];
        
        // Add knight symbol
        const knightSymbol = document.createElement('span');
        knightSymbol.className = 'knight-symbol';
        knightSymbol.textContent = '♞';
        currentCell.appendChild(knightSymbol);
    }

    function updateBoard(highlightLast = false) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = cells[row][col];
                const boardCell = knight.board.getCell(row, col);
                
                // Remove knight symbol and move number if exists
                const knightSymbol = cell.querySelector('.knight-symbol');
                if (knightSymbol) knightSymbol.remove();
                
                const moveNumber = cell.querySelector('.move-number');
                if (moveNumber) moveNumber.remove();
                
                // Reset coordinates
                const coordSpan = cell.querySelector('.cell-coords');
                if (coordSpan) {
                    coordSpan.textContent = `(${row},${col})`;
                }
                
                if (boardCell && boardCell.visited) {
                    // Green for visited cells
                    cell.style.backgroundColor = GREEN;
                } else {
                    // Original chess pattern for unvisited
                    cell.style.backgroundColor = (row + col) % 2 === 0 ? LIGHT_SQUARE : DARK_SQUARE;
                }
            }
        }
        
        // Show knight at current position
        if (knight && knight.board.moves.length > 0) {
            const x = knight.board.x;
            const y = knight.board.y;
            const currentCell = cells[x][y];
            
            // For the last move in player mode, use darker green
            if (highlightLast && playerMode) {
                currentCell.style.backgroundColor = DARK_GREEN;
            }
            
            // Add knight symbol
            const knightSymbol = document.createElement('span');
            knightSymbol.className = 'knight-symbol';
            knightSymbol.textContent = '♞';
            currentCell.appendChild(knightSymbol);
            
            // If in player mode and hints are enabled, highlight available moves
            if (playerMode && showHintsCheck.checked) {
                const availableMoves = knight.board.getAvailableMoves();
                for (const [moveX, moveY] of availableMoves) {
                    cells[moveX][moveY].style.backgroundColor = HIGHLIGHT;
                }
            }
        }
    }

    function updateStatus(message) {
        statusText.textContent = message;
    }
}); 