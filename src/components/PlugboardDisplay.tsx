
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PlugboardConnection } from '../lib/enigma';
import { cn } from '../lib/utils';

interface PlugboardDisplayProps {
  connections: PlugboardConnection[];
  onChange: (connections: PlugboardConnection[]) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const PlugboardDisplay: React.FC<PlugboardDisplayProps> = ({ connections, onChange }) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  
  // Convert connections array to a map for easier lookup
  const connectionMap = new Map<string, string>();
  connections.forEach(({ from, to }) => {
    connectionMap.set(from, to);
    connectionMap.set(to, from);
  });
  
  // Handle letter selection
  const handleLetterClick = (letter: string) => {
    // Check if the letter is already connected
    if (connectionMap.has(letter)) {
      // If clicked on connected letter, remove the connection
      const connectedTo = connectionMap.get(letter)!;
      const newConnections = connections.filter(
        conn => !(conn.from === letter && conn.to === connectedTo) && 
                !(conn.from === connectedTo && conn.to === letter)
      );
      onChange(newConnections);
      setSelectedLetter(null);
    } else if (selectedLetter === null) {
      // First letter selection
      setSelectedLetter(letter);
    } else if (selectedLetter === letter) {
      // Deselect if clicking the same letter
      setSelectedLetter(null);
    } else {
      // Creating a new connection
      const newConnection: PlugboardConnection = {
        from: selectedLetter < letter ? selectedLetter : letter,
        to: selectedLetter < letter ? letter : selectedLetter,
      };
      
      // Add the new connection
      const newConnections = [...connections, newConnection];
      onChange(newConnections);
      setSelectedLetter(null);
    }
  };
  
  // Handle removing a connection
  const removeConnection = (connection: PlugboardConnection) => {
    const newConnections = connections.filter(
      conn => !(conn.from === connection.from && conn.to === connection.to)
    );
    onChange(newConnections);
  };

  return (
    <div className="bg-white rounded-xl shadow-neo p-4">
      <h3 className="text-sm font-medium mb-2 text-center text-enigma-dark">Plugboard</h3>
      
      {/* Current connections */}
      <div className="mb-3">
        <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
          {connections.map((connection) => (
            <div 
              key={`${connection.from}-${connection.to}`}
              className="flex bg-enigma-light rounded-md items-center justify-between px-2 py-1"
            >
              <span className="text-xs">{connection.from} ↔ {connection.to}</span>
              <button 
                onClick={() => removeConnection(connection)}
                className="text-enigma-accent hover:text-enigma-dark"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {connections.length === 0 && (
          <p className="text-xs text-enigma-accent text-center py-1">
            No connections. Click letters to connect.
          </p>
        )}
      </div>
      
      {/* Letter grid */}
      <div className="grid grid-cols-6 md:grid-cols-9 gap-1">
        {ALPHABET.map((letter) => {
          const isConnected = connectionMap.has(letter);
          const isSelected = selectedLetter === letter;
          const connectedTo = connectionMap.get(letter);
          
          return (
            <button
              key={letter}
              className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center text-sm",
                "transition-all duration-150 focus:outline-none",
                isConnected 
                  ? "bg-enigma-accent/20 font-medium" 
                  : "bg-enigma-light hover:bg-enigma-light/80",
                isSelected 
                  ? "ring-2 ring-enigma-highlight/70" 
                  : ""
              )}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
              {isConnected && (
                <span className="absolute -bottom-1 -right-1 bg-enigma-accent/80 text-white 
                                w-3 h-3 rounded-full text-[8px] flex items-center justify-center">
                  {connectedTo}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedLetter && (
        <div className="mt-2 text-center text-xs text-enigma-accent">
          Select another letter to connect with <strong>{selectedLetter}</strong>
          <button 
            className="ml-2 underline"
            onClick={() => setSelectedLetter(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PlugboardDisplay;
