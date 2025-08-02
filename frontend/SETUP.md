# Frontend Setup Instructions

## Quick Start

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Version 16 or higher required

2. **Install Dependencies**
   ```bash
   # Option 1: Using batch file (Windows)
   install.bat
   
   # Option 2: Manual command
   npm install
   ```

3. **Start Development Server**
   ```bash
   # Option 1: Using batch file (Windows)
   start.bat
   
   # Option 2: Manual command
   npm run dev
   ```

4. **Open Browser**
   - Navigate to: http://localhost:3000

## Prerequisites

- Node.js (v16+)
- Backend API running on port 8000
- npm or yarn package manager

## Troubleshooting

### If npm install fails:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules folder and package-lock.json
3. Run `npm install` again

### If development server won't start:
1. Check if port 3000 is available
2. Ensure backend is running on port 8000
3. Check console for error messages

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── store/         # State management
│   └── ...
├── public/            # Static files
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
``` 