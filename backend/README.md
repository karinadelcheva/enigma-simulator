
# Enigma Machine Backend API

This directory contains a Flask API for the Enigma machine simulator.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the API server:
   ```
   python api.py
   ```

The server will start on http://localhost:5000

## API Endpoints

### Create Enigma Machine
- POST `/api/enigma/create`
- Creates a new Enigma machine instance with the specified configuration

### Encode Message
- POST `/api/enigma/encode`
- Encodes a message using the specified Enigma machine instance

### Reset Enigma Machine
- POST `/api/enigma/reset`
- Resets an Enigma machine to its initial state
