
/**
 * Enigma Machine API Service
 * Provides methods to interact with the Python backend Enigma machine
 */

// API base URL - update this based on where your Flask API is running
const API_BASE_URL = 'http://localhost:5000/api/enigma';

// Type definitions for API requests and responses
export interface EnigmaConfig {
  session_id?: string;
  rotor_sequence: string[];
  reflector: string;
  ring_setting: number[];
  initial_positions: string;
  plug_combinations: string[];
}

export interface EncodeRequest {
  session_id?: string;
  message: string;
}

export interface EncodeResponse {
  status: string;
  original: string;
  encoded: string;
  rotor_positions: string[];
}

/**
 * Creates a new Enigma machine instance on the backend
 */
export const createEnigma = async (config: EnigmaConfig): Promise<{session_id: string}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create Enigma machine');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Enigma machine:', error);
    throw error;
  }
};

/**
 * Encodes a message using the Enigma machine
 */
export const encodeMessage = async (request: EncodeRequest): Promise<EncodeResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/encode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to encode message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error encoding message:', error);
    throw error;
  }
};

/**
 * Resets an Enigma machine to its initial state
 */
export const resetEnigma = async (sessionId: string = 'default'): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset Enigma machine');
    }
  } catch (error) {
    console.error('Error resetting Enigma machine:', error);
    throw error;
  }
};
