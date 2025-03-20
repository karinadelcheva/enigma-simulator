
import React from 'react';
import { Info, ExternalLink, BookOpen, History } from 'lucide-react';
import { cn } from '../lib/utils';

interface InfoPanelProps {
  className?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ className }) => {
  return (
    <div className={cn("bg-white rounded-xl shadow-neo p-6 animate-fade-in", className)}>
      <h2 className="text-lg font-medium flex items-center mb-4">
        <Info className="w-5 h-5 mr-2 text-enigma-accent" />
        About the Enigma Machine
      </h2>
      
      <div className="space-y-4 text-sm text-enigma-dark/80">
        <p>
          The Enigma machine was a cipher device developed and used in the early- to mid-20th century 
          to protect commercial, diplomatic, and military communication.
        </p>
        
        <div className="glass rounded-lg p-3 text-xs">
          <h3 className="font-medium mb-2 flex items-center">
            <History className="w-4 h-4 mr-1 text-enigma-accent" />
            How It Works
          </h3>
          <p className="mb-2">
            The Enigma machine consists of a keyboard, a set of rotors, a reflector, and a plugboard:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>Rotors:</strong> When a key is pressed, the right rotor advances one position. 
              When the right rotor completes a full revolution, it triggers the middle rotor to advance, and so on.
            </li>
            <li>
              <strong>Plugboard:</strong> Before and after going through the rotors, the signal passes 
              through the plugboard, which swaps pairs of letters.
            </li>
            <li>
              <strong>Reflector:</strong> After passing through all rotors, the signal is reflected back 
              through the rotors in reverse order, creating a different path.
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-1 text-enigma-accent" />
            How to Use This Simulator
          </h3>
          <ul className="list-disc pl-4 space-y-1 text-xs">
            <li>Type on your keyboard or click the virtual keys to input text</li>
            <li>Adjust rotor types and positions using the controls above</li>
            <li>Connect letters on the plugboard to add additional complexity</li>
            <li>Both input and encoded text will appear in the display area</li>
          </ul>
        </div>
        
        <div className="text-xs flex justify-end pt-2">
          <a 
            href="https://en.wikipedia.org/wiki/Enigma_machine" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-enigma-highlight flex items-center hover:underline"
          >
            Learn more 
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
