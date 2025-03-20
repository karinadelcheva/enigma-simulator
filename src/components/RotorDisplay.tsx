
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { RotorConfig, RotorType } from '../lib/enigma';
import { cn } from '../lib/utils';

interface RotorDisplayProps {
  rotor: RotorConfig;
  index: number;
  onChange: (index: number, update: Partial<RotorConfig>) => void;
  label?: string;
}

const ROTOR_TYPES: RotorType[] = ['I', 'II', 'III', 'IV', 'V'];

const RotorDisplay: React.FC<RotorDisplayProps> = ({ 
  rotor, 
  index, 
  onChange,
  label = `Rotor ${index + 1}`
}) => {
  const [lastPosition, setLastPosition] = useState(rotor.position);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation when position changes
  useEffect(() => {
    if (rotor.position !== lastPosition) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setLastPosition(rotor.position);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [rotor.position, lastPosition]);

  // Convert position to letter
  const positionLetter = String.fromCharCode(65 + rotor.position); // A=0, B=1, etc.

  // Handle rotor type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as RotorType;
    onChange(index, { type: newType });
  };

  // Handle position change
  const incrementPosition = () => {
    const newPosition = (rotor.position + 1) % 26;
    onChange(index, { position: newPosition });
  };

  const decrementPosition = () => {
    const newPosition = (rotor.position - 1 + 26) % 26;
    onChange(index, { position: newPosition });
  };

  // Handle ring setting change
  const handleRingSettingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRingSetting = parseInt(e.target.value, 10);
    onChange(index, { ringSetting: newRingSetting });
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-neo p-4 w-28">
      <span className="text-xs uppercase tracking-wider text-enigma-accent mb-2">
        {label}
      </span>
      
      {/* Rotor Type */}
      <select
        value={rotor.type}
        onChange={handleTypeChange}
        className="mb-4 bg-enigma-light text-enigma-dark border border-enigma-accent/10 
                  rounded-md p-1 text-sm font-medium focus:outline-none focus:ring-1 
                  focus:ring-enigma-highlight"
      >
        {ROTOR_TYPES.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      
      {/* Rotor Position Display */}
      <div className="glass w-16 h-16 rounded-lg flex items-center justify-center mb-4 
                     overflow-hidden relative rotor-display">
        {/* Up Arrow */}
        <button 
          onClick={incrementPosition}
          className="absolute top-0 w-full h-6 flex items-center justify-center 
                    bg-gradient-to-b from-enigma-dark/10 to-transparent
                    hover:from-enigma-dark/20 transition-colors"
        >
          <ChevronUp className="h-4 w-4 text-enigma-dark/60" />
        </button>
        
        {/* Letter Display */}
        <div className={cn(
          "text-2xl font-mono font-bold", 
          isAnimating ? "animate-rotor-spin" : ""
        )}>
          {positionLetter}
        </div>
        
        {/* Down Arrow */}
        <button 
          onClick={decrementPosition}
          className="absolute bottom-0 w-full h-6 flex items-center justify-center 
                    bg-gradient-to-t from-enigma-dark/10 to-transparent
                    hover:from-enigma-dark/20 transition-colors"
        >
          <ChevronDown className="h-4 w-4 text-enigma-dark/60" />
        </button>
      </div>
      
      {/* Ring Setting */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-enigma-accent mb-1">Ring</span>
        <select
          value={rotor.ringSetting}
          onChange={handleRingSettingChange}
          className="bg-enigma-light text-enigma-dark border border-enigma-accent/10 
                    rounded-md p-1 text-xs focus:outline-none focus:ring-1 
                    focus:ring-enigma-highlight"
        >
          {Array.from({ length: 26 }, (_, i) => (
            <option key={i} value={i}>
              {i + 1} - {String.fromCharCode(65 + i)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RotorDisplay;
