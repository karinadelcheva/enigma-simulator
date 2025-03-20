
# 🕵🏻‍♀️ Enigma Machine Simulator
<img width="1438" alt="Screenshot 2025-03-20 at 19 28 52" src="https://github.com/user-attachments/assets/b83fe2cc-030a-4ade-b5dc-cd9426619ef3" />

This project is a historically accurate recreation of the WWII Enigma cipher device, featuring both a frontend interface and a Python backend.

## Technologies Used

- **Frontend**:
  - Vite
  - TypeScript
  - React
  - shadcn-ui
  - Tailwind CSS

- **Backend**:
  - Python
  - Flask
  - Flask-CORS

## Project Structure

This project consists of two main parts:

1. **Frontend**: A React application that provides a visual interface for the Enigma machine.
2. **Backend**: A Python Flask API that implements the core Enigma machine logic.

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the API server:
   ```
   python api.py
   ```

The server will start on http://localhost:5000

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

The frontend will start on http://localhost:5173

## Using the Simulator

- Configure the rotors and plugboard settings
- Type or click on the keyboard to encode/decode messages
- The encoded output will appear in real-time

## Features

- Historically accurate Enigma machine simulation
- Interactive rotor and plugboard configuration
- Real-time encoding and decoding
- Visual feedback on the encryption process

P.S - This project was instantiated with Lovable.
