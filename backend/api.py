
from flask import Flask, request, jsonify
from flask_cors import CORS
from enigma import Enigma

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Dictionary to store enigma machine instances for different sessions
enigma_instances = {}

@app.route('/api/enigma/create', methods=['POST'])
def create_enigma():
    """Create a new Enigma machine instance with the given configuration"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        # Extract configuration
        rotor_sequence = data.get('rotor_sequence', ['III', 'II', 'I'])
        reflector = data.get('reflector', 'B')
        ring_setting = data.get('ring_setting', [1, 1, 1])
        initial_positions = data.get('initial_positions', 'AAA')
        plug_combinations = data.get('plug_combinations', [])
        
        # Create new Enigma instance
        enigma_instances[session_id] = Enigma(
            rotor_sequence=rotor_sequence,
            reflector=reflector,
            ring_setting=ring_setting,
            initial_positions=initial_positions,
            plug_combinations=plug_combinations
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Enigma machine created',
            'session_id': session_id
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/api/enigma/encode', methods=['POST'])
def encode_message():
    """Encode a message using an existing Enigma machine instance"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        message = data.get('message', '')
        
        # Get the Enigma instance or create a new default one if not exists
        if session_id not in enigma_instances:
            enigma_instances[session_id] = Enigma(
                rotor_sequence=['III', 'II', 'I'],
                reflector='B'
            )
        
        enigma = enigma_instances[session_id]
        encoded = enigma.encode(message)
        
        # Get current rotor positions for display
        rotor_positions = [chr(65 + pos) for pos in enigma.rotor_positions[:-1]]  # Exclude reflector
        
        return jsonify({
            'status': 'success',
            'original': message,
            'encoded': encoded,
            'rotor_positions': rotor_positions
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/api/enigma/reset', methods=['POST'])
def reset_enigma():
    """Reset an Enigma machine to its initial state"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        if session_id in enigma_instances:
            enigma_instances[session_id].reset()
            return jsonify({
                'status': 'success',
                'message': 'Enigma machine reset to initial state'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Session not found'
            }), 404
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
