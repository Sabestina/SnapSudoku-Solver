import React, { useState, useCallback } from 'react';
import { Board } from './components/Board';
import { analyzeSudokuImage } from './services/geminiService';
import { solveSudoku, isValidBoard } from './services/sudokuSolver';
import { BoardData, CellStatus, SudokuGrid } from './types';
import { ArrowPathIcon, CameraIcon, PlayIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

// Helper to create an empty 9x9 board
const createEmptyBoard = (): BoardData => {
  return Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => ({
      value: 0,
      status: CellStatus.INITIAL,
      isReadOnly: false
    }))
  );
};

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardData>(createEmptyBoard());
  const [isSolving, setIsSolving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle file upload and Gemini processing
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Invalid file type. Please select a valid image (JPEG, PNG, WebP, or HEIC).");
      event.target.value = ''; // Reset input so the same file can be selected again if needed/corrected
      return;
    }

    // Check network status for AI feature
    if (!navigator.onLine) {
      setErrorMsg("You seem to be offline. AI analysis requires an active internet connection.");
      event.target.value = '';
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const mimeType = file.type;

        try {
          const result = await analyzeSudokuImage(base64Data, mimeType);
          
          // Transform simple number[][] to BoardData
          const newBoard: BoardData = result.grid.map((row) => 
            row.map((val) => ({
              value: val,
              status: val !== 0 ? CellStatus.INITIAL : CellStatus.EMPTY,
              isReadOnly: val !== 0
            }))
          );
          
          setBoard(newBoard);
          setSuccessMsg("Grid extracted! Please verify numbers before solving.");
        } catch (err) {
          // Handle API errors specifically
          if (!navigator.onLine) {
             setErrorMsg("Connection lost during analysis. Please check your internet.");
          } else {
             setErrorMsg("Failed to analyze image. Please try again or enter manually.");
          }
        } finally {
          setIsAnalyzing(false);
          event.target.value = ''; // Reset input
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMsg("Error reading file.");
      setIsAnalyzing(false);
      event.target.value = ''; // Reset input
    }
  };

  // Handle manual cell changes
  const handleCellChange = useCallback((row: number, col: number, value: number) => {
    setBoard(prev => {
      const newBoard = [...prev];
      newBoard[row] = [...prev[row]];
      newBoard[row][col] = {
        ...newBoard[row][col],
        value,
        status: CellStatus.INITIAL,
        isReadOnly: value !== 0 // Manually entered values are treated as initial constraints
      };
      return newBoard;
    });
    setErrorMsg(null);
    setSuccessMsg(null);
  }, []);

  const handleClear = () => {
    setBoard(createEmptyBoard());
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSolve = () => {
    setIsSolving(true);
    setErrorMsg(null);

    // 1. Convert BoardData to simple number[][]
    const simpleGrid: SudokuGrid = board.map(row => row.map(cell => cell.value));

    // 2. Validate
    if (!isValidBoard(simpleGrid)) {
      setErrorMsg("The current board configuration is invalid. Please check for duplicates.");
      setIsSolving(false);
      return;
    }

    // 3. Solve using backtracking algorithm (CPU bound, but fast for 9x9)
    // We use setTimeout to allow UI to render the loading state before blocking
    setTimeout(() => {
      const solvedGrid = solveSudoku(simpleGrid);

      if (solvedGrid) {
        // Update board with solution
        const solvedBoard: BoardData = board.map((row, rIndex) => 
          row.map((cell, cIndex) => {
            // Keep original READONLY cells as is
            if (cell.isReadOnly && cell.value !== 0) return cell;
            
            return {
              value: solvedGrid[rIndex][cIndex],
              status: CellStatus.SOLVED,
              isReadOnly: false
            };
          })
        );
        setBoard(solvedBoard);
        setSuccessMsg("Puzzle Solved!");
      } else {
        setErrorMsg("This puzzle seems unsolvable. Check the input numbers.");
      }
      setIsSolving(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          SnapSudoku
        </h1>
        <p className="text-gray-400">Upload a photo or enter numbers to solve instantly.</p>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md space-y-6">
        
        {/* Status Messages */}
        {errorMsg && (
          <div className="p-4 rounded-lg bg-red-900/30 border border-red-800 flex items-center gap-3 text-red-200 animate-pulse">
            <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="p-4 rounded-lg bg-green-900/30 border border-green-800 text-green-200 text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* The Board */}
        <div className="flex justify-center">
          <Board board={board} onCellChange={handleCellChange} />
        </div>

        {/* Action Bar */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Camera Input */}
                <label className="relative flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg cursor-pointer transition-all active:scale-95">
                    <CameraIcon className="w-5 h-5" />
                    <span>{isAnalyzing ? "Scanning..." : "Snap / Upload"}</span>
                    <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isAnalyzing || isSolving}
                    />
                </label>

                {/* Solve Button */}
                <button
                    onClick={handleSolve}
                    disabled={isAnalyzing || isSolving}
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95"
                >
                    {isSolving ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                        <PlayIcon className="w-5 h-5" />
                    )}
                    <span>{isSolving ? "Solving..." : "Solve Now"}</span>
                </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex justify-center">
                <button
                    onClick={handleClear}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm font-semibold transition-colors px-4 py-2 rounded-md hover:bg-gray-700/50"
                >
                    <TrashIcon className="w-4 h-4" />
                    Clear Board
                </button>
            </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center leading-relaxed px-4">
            <p>Tip: For best results, ensure the Sudoku grid is clearly visible and well-lit. You can tap any cell to correct numbers manually before solving.</p>
        </div>
      </div>
    </div>
  );
};

export default App;