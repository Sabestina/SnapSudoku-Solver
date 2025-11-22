import { SudokuGrid } from '../types';

// Validates if a number can be placed at grid[row][col]
const isValid = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check col
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Backtracking solver
const solve = (grid: SudokuGrid): boolean => {
  let row = -1;
  let col = -1;
  let isEmpty = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  // No empty space left
  if (!isEmpty) return true;

  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
      if (solve(grid)) return true;
      grid[row][col] = 0; // Backtrack
    }
  }
  return false;
};

export const solveSudoku = (initialGrid: SudokuGrid): SudokuGrid | null => {
  // Clone the grid to avoid mutating the original during computation
  const gridCopy = initialGrid.map(row => [...row]);
  
  // Basic validation before starting
  if (!isValidBoard(gridCopy)) return null;

  if (solve(gridCopy)) {
    return gridCopy;
  }
  return null;
};

// Check if the initial board is valid (no duplicates in rows/cols/boxes)
export const isValidBoard = (grid: SudokuGrid): boolean => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const num = grid[r][c];
            if (num !== 0) {
                // Temporarily remove number to check validity
                grid[r][c] = 0;
                if (!isValid(grid, r, c, num)) {
                    grid[r][c] = num;
                    return false;
                }
                grid[r][c] = num;
            }
        }
    }
    return true;
}