export type SudokuGrid = number[][];

export enum CellStatus {
  INITIAL = 'INITIAL', // Loaded from image or manually entered before solve
  SOLVED = 'SOLVED',   // Filled by algorithm
  ERROR = 'ERROR',     // Conflicting cell
  EMPTY = 'EMPTY'
}

export interface CellData {
  value: number; // 0 means empty
  status: CellStatus;
  isReadOnly: boolean; // True if it was part of the initial puzzle
}

export type BoardData = CellData[][];

export interface AnalysisResult {
  grid: number[][];
}