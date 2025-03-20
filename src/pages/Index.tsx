
import React, { useState, useEffect, useRef } from 'react';
import { EnigmaMachine, EnigmaConfig, RotorConfig, PlugboardConnection } from '../lib/enigma';
import RotorDisplay from '../components/RotorDisplay';
import Keyboard from '../components/Keyboard';
import EnigmaSettings from '../components/EnigmaSettings';
import PlugboardDisplay from '../components/PlugboardDisplay';
import InfoPanel from '../components/InfoPanel';
import NavBar from '../components/NavBar';
import ApiToggle from '../components/ApiToggle';
import { Trash2, Copy, ArrowRight, ServerCrash } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';
import { createEnigma, encodeMessage, resetEnigma } from '../services/enigmaApi';

const Index = () => {
  // Initialize enigma configuration state
  const [config, setConfig] = useState<EnigmaConfig>(EnigmaMachine.createDefaultConfig());
  
  // Create an Enigma machine instance with the current configuration
  const enigmaRef = useRef<EnigmaMachine>(new EnigmaMachine(config));
  
  // Update the Enigma machine when config changes
  useEffect(() => {
    enigmaRef.current = new EnigmaMachine(config);
  }, [config]);
  
  // Input and output text
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  
  // State for tracking the current highlighted keys
  const [inputKey, setInputKey] = useState<string | null>(null);
  const [outputKey, setOutputKey] = useState<string | null>(null);
  
  // API mode toggle
  const [useBackend, setUseBackend] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('default');
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Toast notifications
  const { toast } = useToast();
  
  // Initialize API session when toggling to backend mode
  useEffect(() => {
    if (useBackend) {
      initializeBackend();
    }
  }, [useBackend]);
  
  // Initialize the backend API
  const initializeBackend = async () => {
    try {
      setApiError(null);
      // Convert frontend config to backend format
      const backendConfig = {
        rotor_sequence: config.rotors.map(r => r.type).reverse(), // Reverse to match Python API
        reflector: config.reflector === 'UKW_B' ? 'B' : config.reflector, // Convert reflector name
        ring_setting: config.rotors.map(r => r.ringSetting + 1).reverse(), // API uses 1-26 format
        initial_positions: config.rotors.map(r => String.fromCharCode(65 + r.position)).reverse().join(''),
        plug_combinations: config.plugboard.map(p => p.from + p.to)
      };
      
      const response = await createEnigma(backendConfig);
      setSessionId(response.session_id);
      
      // Clear the text when switching modes
      setInputText('');
      setOutputText('');
      
      toast({
        title: "Connected to Python Backend",
        description: "Now using the Python Enigma implementation",
      });
    } catch (error) {
      console.error("Failed to initialize backend:", error);
      // Silently fall back to frontend implementation without showing error message
      setUseBackend(false);
      
      toast({
        variant: "destructive",
        title: "Backend Connection Failed",
        description: "Using frontend implementation instead.",
      });
    }
  };
  
  // Handle letter input
  const handleKeyPress = async (letter: string) => {
    // Only process A-Z
    if (!/^[A-Z]$/.test(letter)) return;
    
    // Animate the input key
    setInputKey(letter);
    
    let encoded: string;
    
    if (useBackend) {
      try {
        setApiError(null);
        const response = await encodeMessage({
          session_id: sessionId,
          message: letter
        });
        
        encoded = response.encoded;
        
        // Update rotor positions from backend (if needed)
        // This would require additional state management
      } catch (error) {
        console.error("Backend encoding error:", error);
        // Silently fall back to frontend implementation
        setUseBackend(false);
        encoded = enigmaRef.current.encodeChar(letter);
        
        toast({
          variant: "destructive",
          title: "Backend Error",
          description: "Switched to frontend implementation.",
        });
      }
    } else {
      // Process through frontend enigma
      encoded = enigmaRef.current.encodeChar(letter);
    }
    
    // Animate the output key
    setOutputKey(encoded);
    
    // Update input and output text
    setInputText(prev => prev + letter);
    setOutputText(prev => prev + encoded);
    
    // Clear highlighted keys after a delay
    setTimeout(() => {
      setInputKey(null);
      setOutputKey(null);
    }, 300);
  };

  // Reset the machine and clear text
  const handleReset = async () => {
    // Reset to default configuration
    const defaultConfig = EnigmaMachine.createDefaultConfig();
    setConfig(defaultConfig);
    
    // Clear text
    setInputText('');
    setOutputText('');
    
    if (useBackend) {
      try {
        await resetEnigma(sessionId);
      } catch (error) {
        console.error("Failed to reset backend:", error);
        // Don't show the error message to the user
        setUseBackend(false);
      }
    }
    
    toast({
      title: "Machine Reset",
      description: "All settings have been restored to default",
    });
  };
  
  // Clear message text only
  const handleClearText = () => {
    setInputText('');
    setOutputText('');
  };
  
  // Copy output to clipboard
  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputText);
    
    toast({
      title: "Copied!",
      description: "Encrypted message copied to clipboard",
    });
  };
  
  // Handle rotor changes
  const handleRotorChange = (index: number, update: Partial<RotorConfig>) => {
    const newRotors = [...config.rotors];
    newRotors[index] = { ...newRotors[index], ...update };
    
    setConfig(prev => ({
      ...prev,
      rotors: newRotors
    }));
    
    // If using backend, re-initialize with new config
    if (useBackend) {
      initializeBackend();
    }
  };
  
  // Handle plugboard changes
  const handlePlugboardChange = (connections: PlugboardConnection[]) => {
    setConfig(prev => ({
      ...prev,
      plugboard: connections
    }));
    
    // If using backend, re-initialize with new config
    if (useBackend) {
      initializeBackend();
    }
  };

  // Create a map of plugboard connections for the keyboard
  const plugboardMap: Record<string, string> = {};
  config.plugboard.forEach(({ from, to }) => {
    plugboardMap[from] = to;
    plugboardMap[to] = from;
  });

  return (
    <div className="min-h-screen bg-enigma-bg text-enigma-dark flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ApiToggle 
            useBackend={useBackend} 
            onToggle={setUseBackend} 
          />
        </div>
        
        {/* Remove the error message display */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Rotor display row */}
          <div className="col-span-1 lg:col-span-3 flex flex-wrap justify-center gap-4 animate-slide-in">
            {config.rotors.map((rotor, index) => (
              <RotorDisplay
                key={index}
                rotor={rotor}
                index={index}
                onChange={handleRotorChange}
                label={index === 0 ? "Right" : index === 1 ? "Middle" : "Left"}
              />
            ))}
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message display */}
            <div className="glass rounded-xl shadow-neo p-6 min-h-[200px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Message</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearText}
                    className="text-sm flex items-center text-enigma-accent hover:text-enigma-dark
                              transition-colors p-1 rounded-md"
                    disabled={!inputText}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </button>
                  
                  <button
                    onClick={handleCopyOutput}
                    className="text-sm flex items-center text-enigma-accent hover:text-enigma-dark
                              transition-colors p-1 rounded-md"
                    disabled={!outputText}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-enigma-accent mb-1 flex items-center">
                    Input
                  </div>
                  <div className="bg-white/50 rounded-md p-3 min-h-[50px] font-mono text-enigma-dark break-all">
                    {inputText || <span className="text-enigma-accent/50 italic">Type to begin...</span>}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="text-enigma-accent h-5 w-5" />
                </div>
                
                <div>
                  <div className="text-xs text-enigma-accent mb-1 flex items-center">
                    Encrypted Output
                  </div>
                  <div className="bg-white/50 rounded-md p-3 min-h-[50px] font-mono text-enigma-dark break-all">
                    {outputText || <span className="text-enigma-accent/50 italic">Encrypted message will appear here...</span>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Keyboard */}
            <Keyboard 
              onKeyPress={handleKeyPress} 
              illuminatedKey={inputKey} 
              plugboardConnections={plugboardMap}
            />
          </div>
          
          {/* Side panel */}
          <div className="space-y-6">
            <EnigmaSettings
              rotors={config.rotors}
              plugboard={config.plugboard}
              onRotorChange={handleRotorChange}
              onPlugboardChange={handlePlugboardChange}
              onReset={handleReset}
            />
            
            <InfoPanel />
          </div>
        </div>
      </main>
      
      <footer className="bg-white/80 backdrop-blur-sm border-t border-enigma-accent/10 py-3">
        <div className="container mx-auto px-4 text-center text-xs text-enigma-accent">
          Enigma Machine Simulator — A historically accurate recreation of the WWII cipher device
        </div>
      </footer>
    </div>
  );
};

export default Index;
