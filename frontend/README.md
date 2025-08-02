# Airport Booking System - Frontend

React frontend application for the Airport Booking System API.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Flight Search**: Browse and search available flights
- **Order Management**: View booking history
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Material-UI components

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Material-UI** - UI component library
- **Axios** - HTTP client
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Auth/          # Authentication components
│   ├── Layout/        # Layout components
│   └── UI/            # UI components
├── pages/             # Page components
├── services/          # API services
├── store/             # State management
├── hooks/             # Custom hooks
└── utils/             # Utility functions
```

## API Integration

The frontend communicates with the Django REST API backend:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT tokens
- **Proxy**: Configured in Vite for development

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for new components
3. Add proper error handling
4. Test your changes thoroughly 