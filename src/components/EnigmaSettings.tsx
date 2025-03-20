
import React from 'react';
import { RotorConfig, PlugboardConnection } from '../lib/enigma';
import RotorDisplay from './RotorDisplay';
import PlugboardDisplay from './PlugboardDisplay';
import { Settings, Info, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface EnigmaSettingsProps {
  rotors: RotorConfig[];
  plugboard: PlugboardConnection[];
  onRotorChange: (index: number, update: Partial<RotorConfig>) => void;
  onPlugboardChange: (connections: PlugboardConnection[]) => void;
  onReset: () => void;
  className?: string;
}

const EnigmaSettings: React.FC<EnigmaSettingsProps> = ({
  rotors,
  plugboard,
  onRotorChange,
  onPlugboardChange,
  onReset,
  className,
}) => {
  return (
    <div className={cn("bg-white rounded-xl shadow-neo p-6 animate-fade-in", className)}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium flex items-center">
          <Settings className="w-5 h-5 mr-2 text-enigma-accent" />
          Machine Configuration
        </h2>
        <button
          onClick={onReset}
          className="text-sm flex items-center text-enigma-accent hover:text-enigma-dark
                     transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <h3 className="text-sm font-medium">Rotor Configuration</h3>
          <div className="ml-2 text-xs text-enigma-accent flex items-center">
            <Info className="w-3 h-3 mr-1" />
            Click arrows to change positions
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {rotors.map((rotor, index) => (
            <RotorDisplay
              key={index}
              rotor={rotor}
              index={index}
              onChange={onRotorChange}
              label={index === 0 ? "Right" : index === 1 ? "Middle" : "Left"}
            />
          ))}
        </div>
      </div>
      
      <div>
        <PlugboardDisplay 
          connections={plugboard} 
          onChange={onPlugboardChange} 
        />
      </div>
    </div>
  );
};

export default EnigmaSettings;
