import React from 'react';
import { CellData, CellStatus } from '../types';

interface CellProps {
  row: number;
  col: number;
  data: CellData;
  onChange: (row: number, col: number, value: number) => void;
  isSelected: boolean;
  onSelect: (row: number, col: number) => void;
}

export const Cell: React.FC<CellProps> = ({ row, col, data, onChange, isSelected, onSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(row, col, 0);
      return;
    }
    
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      onChange(row, col, num);
    }
  };

  // Determine border classes for the 3x3 grid look
  const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-blue-500' : 'border-b border-gray-700';
  const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-blue-500' : 'border-r border-gray-700';
  
  // Determine text color
  let textColor = 'text-white';
  if (data.isReadOnly) textColor = 'text-blue-300 font-bold'; // Initial values
  else if (data.status === CellStatus.SOLVED) textColor = 'text-green-400'; // Solved values
  else if (data.status === CellStatus.ERROR) textColor = 'text-red-500';

  // Background
  const bgClass = isSelected ? 'bg-blue-900/50' : (data.status === CellStatus.ERROR ? 'bg-red-900/20' : 'bg-gray-800');

  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      max={9}
      value={data.value === 0 ? '' : data.value}
      onChange={handleChange}
      onFocus={() => onSelect(row, col)}
      className={`
        w-full h-full text-center text-xl md:text-2xl outline-none transition-colors duration-200
        ${bgClass} ${textColor} ${borderBottom} ${borderRight}
      `}
    />
  );
};