
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface KeyboardProps {
  onKeyPress: (letter: string) => void;
  illuminatedKey?: string | null;
  plugboardConnections?: Record<string, string>;
}

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'],
  ['P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'L'],
];

const Keyboard: React.FC<KeyboardProps> = ({ 
  onKeyPress, 
  illuminatedKey = null,
  plugboardConnections = {} 
}) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  
  // Set up keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      // Only process A-Z keys
      if (/^[A-Z]$/.test(key)) {
        onKeyPress(key);
        setActiveKey(key);
      }
    };
    
    const handleKeyUp = () => {
      setActiveKey(null);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyPress]);
  
  // Reset active key after a short delay
  useEffect(() => {
    if (activeKey) {
      const timer = setTimeout(() => {
        setActiveKey(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [activeKey]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass rounded-2xl p-4 shadow-neo">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={cn(
              "flex justify-center gap-1 md:gap-2",
              rowIndex === 1 ? "ml-4 mr-4" : ""
            )}
          >
            {row.map((letter) => {
              const isActive = activeKey === letter;
              const isIlluminated = illuminatedKey === letter;
              const hasPlugboardConnection = plugboardConnections[letter];
              
              return (
                <button
                  key={letter}
                  className={cn(
                    "key w-10 h-10 md:w-12 md:h-12 m-1 rounded-lg font-medium text-lg",
                    "flex items-center justify-center transition-all duration-200",
                    "shadow-md hover:shadow-lg focus:outline-none relative",
                    isActive || isIlluminated 
                      ? "bg-enigma-highlight text-white transform scale-95"
                      : "bg-enigma-keyboard text-enigma-dark",
                    hasPlugboardConnection 
                      ? "ring-2 ring-enigma-accent/30" 
                      : ""
                  )}
                  onClick={() => onKeyPress(letter)}
                >
                  {letter}
                  
                  {/* Plugboard indicator */}
                  {hasPlugboardConnection && (
                    <span className="absolute -bottom-1 -right-1 bg-enigma-accent/80 text-white 
                                    w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
                      {hasPlugboardConnection}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
