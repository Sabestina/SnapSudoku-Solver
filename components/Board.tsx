import React from 'react';
import { BoardData } from '../types';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardData;
  onCellChange: (row: number, col: number, value: number) => void;
}

export const Board: React.FC<BoardProps> = ({ board, onCellChange }) => {
  const [selectedCell, setSelectedCell] = React.useState<{r: number, c: number} | null>(null);

  return (
    <div className="relative w-full max-w-md aspect-square border-4 border-blue-500 rounded-lg shadow-2xl bg-gray-900 overflow-hidden">
      <div className="grid grid-cols-9 grid-rows-9 w-full h-full">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="w-full h-full">
                <Cell
                row={rowIndex}
                col={colIndex}
                data={cell}
                onChange={onCellChange}
                isSelected={selectedCell?.r === rowIndex && selectedCell?.c === colIndex}
                onSelect={(r, c) => setSelectedCell({ r, c })}
                />
            </div>
          ))
        )}
      </div>
    </div>
  );
};