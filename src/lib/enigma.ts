
// Enigma machine simulator logic

// Rotor wiring definitions (historical accuracy)
const ROTOR_WIRINGS = {
  I: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
  II: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
  III: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
  IV: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
  V: 'VZBRGITYUPSDNHLXAWMJQOFECK',
  UKW_B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT', // Reflector B
};

// Rotor notch positions (when the next rotor advances)
const ROTOR_NOTCHES = {
  I: 'Q', // Rotor I advances the next rotor when Q is at the window
  II: 'E',
  III: 'V',
  IV: 'J',
  V: 'Z',
};

// Type definitions
export type RotorType = 'I' | 'II' | 'III' | 'IV' | 'V';
export type ReflectorType = 'UKW_B';

export interface RotorConfig {
  type: RotorType;
  position: number; // 0-25 (A-Z)
  ringSetting: number; // 0-25 (1-26 in the physical machine)
}

export interface PlugboardConnection {
  from: string;
  to: string;
}

export interface EnigmaConfig {
  rotors: RotorConfig[];
  reflector: ReflectorType;
  plugboard: PlugboardConnection[];
}

// Helper functions
const mod = (n: number, m: number): number => ((n % m) + m) % m;

const charToIndex = (char: string): number => char.charCodeAt(0) - 65; // A=0, B=1, ...
const indexToChar = (index: number): string => String.fromCharCode(index + 65);

// Enigma Machine Class
export class EnigmaMachine {
  private rotors: RotorConfig[];
  private reflector: ReflectorType;
  private plugboard: Map<string, string>;
  
  constructor(config: EnigmaConfig) {
    this.rotors = [...config.rotors]; // Clone to avoid mutation
    this.reflector = config.reflector;
    
    // Initialize plugboard as a two-way mapping
    this.plugboard = new Map();
    config.plugboard.forEach(({ from, to }) => {
      this.plugboard.set(from, to);
      this.plugboard.set(to, from);
    });
  }

  // Get current state (for UI display)
  public getState(): EnigmaConfig {
    const plugboardArray: PlugboardConnection[] = [];
    this.plugboard.forEach((to, from) => {
      // Avoid duplicates (since mapping is two-way)
      if (from < to) {
        plugboardArray.push({ from, to });
      }
    });
    
    return {
      rotors: [...this.rotors],
      reflector: this.reflector,
      plugboard: plugboardArray,
    };
  }

  // Advance the rotors before encryption (simulates the mechanical step)
  private advanceRotors(): void {
    // Implement the double-stepping mechanism of the Enigma

    // Check if middle rotor is at notch position (for double stepping)
    const middleAtNotch = this.rotors.length > 1 && 
      indexToChar(this.rotors[1].position) === ROTOR_NOTCHES[this.rotors[1].type];
    
    // Check if right rotor is at notch position
    const rightAtNotch = this.rotors.length > 0 && 
      indexToChar(this.rotors[0].position) === ROTOR_NOTCHES[this.rotors[0].type];
    
    // Step the middle rotor if right rotor is at notch or if middle rotor is at notch
    if (this.rotors.length > 1 && (rightAtNotch || middleAtNotch)) {
      this.rotors[1].position = mod(this.rotors[1].position + 1, 26);
    }
    
    // Step the left rotor if middle rotor is at notch
    if (this.rotors.length > 2 && middleAtNotch) {
      this.rotors[2].position = mod(this.rotors[2].position + 1, 26);
    }
    
    // Always step the right rotor
    if (this.rotors.length > 0) {
      this.rotors[0].position = mod(this.rotors[0].position + 1, 26);
    }
  }

  // Process a single character through the Enigma
  public encodeChar(char: string): string {
    // Only process letters A-Z
    if (!/^[A-Z]$/.test(char)) {
      return char;
    }
    
    // Step the rotors before encoding
    this.advanceRotors();
    
    // Apply plugboard substitution (if any)
    let current = this.plugboard.get(char) || char;
    
    // Forward pass through rotors (right to left)
    let index = charToIndex(current);
    
    for (let i = 0; i < this.rotors.length; i++) {
      const rotor = this.rotors[i];
      const offset = rotor.position;
      const ring = rotor.ringSetting;
      
      // Apply rotor position offset and ring setting
      const shifted = mod(index + offset - ring, 26);
      
      // Apply rotor wiring
      const wiring = ROTOR_WIRINGS[rotor.type];
      const wireOutput = wiring.charAt(shifted);
      
      // Reverse offset and ring setting
      index = mod(charToIndex(wireOutput) - offset + ring, 26);
    }
    
    // Apply reflector
    const reflectorWiring = ROTOR_WIRINGS[this.reflector];
    const reflectedChar = reflectorWiring.charAt(index);
    index = charToIndex(reflectedChar);
    
    // Backward pass through rotors (left to right)
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      const rotor = this.rotors[i];
      const offset = rotor.position;
      const ring = rotor.ringSetting;
      
      // Apply rotor position offset and ring setting
      const shifted = mod(index + offset - ring, 26);
      
      // Find the position in the wiring
      const wiring = ROTOR_WIRINGS[rotor.type];
      const wireInputPos = wiring.indexOf(indexToChar(shifted));
      
      // Reverse offset and ring setting
      index = mod(wireInputPos - offset + ring, 26);
    }
    
    // Convert back to letter
    current = indexToChar(index);
    
    // Apply plugboard again
    return this.plugboard.get(current) || current;
  }

  // Encode a full message
  public encode(message: string): string {
    return message
      .toUpperCase()
      .split('')
      .map(char => this.encodeChar(char))
      .join('');
  }

  // Create default Enigma configuration
  public static createDefaultConfig(): EnigmaConfig {
    return {
      rotors: [
        { type: 'III', position: 0, ringSetting: 0 }, // Right
        { type: 'II', position: 0, ringSetting: 0 },  // Middle
        { type: 'I', position: 0, ringSetting: 0 },   // Left
      ],
      reflector: 'UKW_B',
      plugboard: [], // No plugboard connections by default
    };
  }
}
