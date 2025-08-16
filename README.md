# 🛩 Airport Booking System

A full-stack application for booking flight tickets with Django REST API backend and React frontend.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

### Backend (Django REST API)
- **User Authentication**: JWT token-based authentication
- **Flight Management**: CRUD operations for flights, airplanes, routes
- **Order System**: Ticket booking and order management
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Docker

### Frontend (React)
- **Modern UI**: Material-UI components
- **User Authentication**: Login/Register forms
- **Flight Search**: Browse and filter flights
- **Order History**: View booking history
- **Admin Panel**: Full CRUD operations for flights, airports, airplanes, routes
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Backend Dependencies (Python)
```
django==4.1
djangorestframework==3.13.1
djangorestframework-simplejwt==5.2.0
drf-spectacular==0.22.1
Pillow==9.1.1
psycopg2-binary
django-debug-toolbar==3.4.0
flake8==5.0.4
```

### Frontend Dependencies (Node.js)
```
react@^18.2.0
react-dom@^18.2.0
react-router-dom@^6.8.1
@mui/material@^5.14.20
@mui/icons-material@^5.14.19
axios@^1.6.2
zustand@^4.4.7
@tanstack/react-query@^5.8.4
date-fns@^2.30.0
```

## 📁 Project Structure

```
Airport-API-service/
├── backend/              # Django REST API
│   ├── airport/         # Airport app with models and views
│   ├── user/            # User authentication
│   ├── airport_api_service/  # Django settings
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend application
│   ├── src/            # React source code
│   │   ├── components/ # React components
│   │   │   ├── Auth/   # Authentication components
│   │   │   └── Layout/ # Layout components
│   │   ├── pages/      # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── FlightsPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/   # API services
│   │   ├── store/      # State management (Zustand)
│   │   └── utils/      # Utility functions
│   └── public/         # Static files
└── docker-compose.yaml  # Docker configuration
```

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (for backend)
- **Node.js** (v16+) and **npm** (for frontend)

### Step 1: Setup Environment

```bash
# Copy environment files
cp backend/env.sample backend/.env
cp frontend/env.sample frontend/.env

# Edit .env files if needed (optional)
# Backend: backend/.env
# Frontend: frontend/.env
```

### Step 2: Start Backend

```bash
# First time setup (build + start)
docker-compose up --build -d

# Run migrations (first time only)
docker-compose exec airport python manage.py makemigrations
docker-compose exec airport python manage.py migrate

# Subsequent runs (just start - once you have container built)
docker-compose up -d

# Verify backend is running
curl http://localhost:8000/api/airport/airports/
```

### Step 3: Start Frontend

```bash
# Install frontend dependencies
cd frontend
npm install

# Start React development server
npm run dev
```

### Step 4: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/

### Step 5: Test the Application

1. **Open** http://localhost:3000
2. **Register** a new user account
3. **Login** with your credentials
4. **Browse flights** and test the functionality
5. **Create admin user** (see Admin Panel section below)

### Complete First-Time Setup

```bash
# 1. Setup environment
cp backend/env.sample backend/.env
cp frontend/env.sample frontend/.env

# 2. Start backend with build
docker-compose up --build -d

# 3. Create and run migrations
docker-compose exec airport python manage.py makemigrations
docker-compose exec airport python manage.py migrate

# 4. Create admin user
docker-compose exec airport python manage.py createsuperuser

# 5. Start frontend
cd frontend
npm install
npm run dev

# 6. Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## 💻 Development

### Backend Development

```bash
# Create migrations (when models change)
docker-compose exec airport python manage.py makemigrations

# Run migrations
docker-compose exec airport python manage.py migrate

# Create superuser (admin)
docker-compose exec airport python manage.py createsuperuser

# View logs
docker-compose logs -f airport
```

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Workflow

1. **Backend Development**:
   - Edit Django models in `backend/airport/models.py`
   - Add API endpoints in `backend/airport/views.py`
   - Run migrations: `python manage.py makemigrations && python manage.py migrate`

2. **Frontend Development**:
   - Edit React components in `frontend/src/`
   - API calls are configured to proxy to `localhost:8000`
   - Hot reload is enabled with Vite

## 🔌 API Endpoints

### Authentication
- `POST /api/user/register/` - Register user
- `POST /api/user/token/` - Login
- `GET /api/user/me/` - Get user profile

### Public Endpoints (No Auth Required)
- `GET /api/airport/flights/` - List flights
- `GET /api/airport/airports/` - List airports
- `GET /api/airport/airplanes/` - List airplanes

### Protected Endpoints (Auth Required)
- `GET /api/airport/orders/` - List of user's orders
- `POST /api/airport/orders/` - Create order

### Admin Endpoints (Admin Only)
- `POST /api/airport/flights/` - Create flight
- `PUT /api/airport/flights/{id}/` - Update flight
- `DELETE /api/airport/flights/{id}/` - Delete flight
- `POST /api/airport/airports/` - Create airport
- `PUT /api/airport/airports/{id}/` - Update airport
- `DELETE /api/airport/airports/{id}/` - Delete airport
- `POST /api/airport/airplanes/` - Create airplane
- `PUT /api/airport/airplanes/{id}/` - Update airplane
- `DELETE /api/airport/airplanes/{id}/` - Delete airplane
- `POST /api/airport/routes/` - Create route
- `PUT /api/airport/routes/{id}/` - Update route
- `DELETE /api/airport/routes/{id}/` - Delete route

## 👨‍💼 Admin Panel

The application includes a comprehensive admin panel for managing all entities:

### Features
- **Flight Management**: Create, edit, and delete flights
- **Airport Management**: Add and manage airports
- **Airplane Management**: Manage airplane fleet
- **Route Management**: Create and manage flight routes

### Access
1. **Create Admin User**:
   ```bash
   docker-compose exec airport python manage.py createsuperuser
   ```

2. **Login as Admin**:
   - Go to http://localhost:3000
   - Login with admin credentials (as a regular user)
   - Click "Admin" button in navigation

3. **Admin Panel Features**:
   - **Tabs Interface**: Switch between Flights, Airports, Airplanes, Routes
   - **CRUD Operations**: Add, edit, delete all entities
   - **Form Validation**: Proper input validation
   - **Real-time Updates**: Changes reflect immediately

### Security
- **AdminRoute Protection**: Only admin users can access
- **Backend Permissions**: Proper Django permissions
- **User Role Check**: Frontend checks for `is_staff` or `is_superuser`

## 🚀 Deployment

### Production Backend (Django)
```bash
# Build Docker image
docker build -t airport-backend ./backend

# Run with environment variables
docker run -p 8000:8000 airport-backend
```

### Production Frontend (React)
```bash
# Build for production
cd frontend
npm run build

# Serve static files
npm install -g serve
serve -s dist -l 3000
```

### Environment Variables

#### Backend (.env)
```env
# Database Configuration
POSTGRES_DB=airport_db
POSTGRES_USER=airport_user
POSTGRES_PASSWORD=airport_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django Configuration
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Configuration
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=1

# API Configuration
API_SCHEMA_URL=http://localhost:8000/api/schema/
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Development Configuration
VITE_DEV_SERVER_PORT=3000
VITE_DEV_SERVER_HOST=localhost
```

#### Setup Instructions
```bash
# Copy sample files
cp backend/env.sample backend/.env
cp frontend/env.sample frontend/.env

# Edit files if needed
nano backend/.env
nano frontend/.env
```

### Database

The application uses PostgreSQL. For development, it's containerized with Docker:

```yaml
# docker-compose.yaml
db:
  image: postgres:16.0-alpine3.18
  environment:
    POSTGRES_DB: airport_db
    POSTGRES_USER: airport_user
    POSTGRES_PASSWORD: airport_password
  ports:
    - "5432:5432"
```

## 🔧 Troubleshooting

### Backend Issues
1. Check if PostgreSQL is running
2. Verify environment variables
3. Create migrations: `docker-compose exec airport python manage.py makemigrations`
4. Run migrations: `docker-compose exec airport python manage.py migrate`
5. Check logs: `docker-compose logs -f airport`

### Frontend Issues
1. Ensure backend is running on port 8000
2. Check API proxy configuration in `vite.config.js`
3. Clear browser cache
4. Check console for CORS errors

### Database Issues
1. Reset database: `docker-compose down -v && docker-compose up -d`
2. Create migrations: `docker-compose exec airport python manage.py makemigrations`
3. Run migrations: `docker-compose exec airport python manage.py migrate`
4. Create superuser: `docker-compose exec airport python manage.py createsuperuser`

### Common Problems

#### If backend won't start:
```bash
# Check Docker logs
docker-compose logs backend

# Restart services
docker-compose down
docker-compose up -d
```

#### If frontend shows blank page:
1. **Check Console** (F12) for JavaScript errors
2. **Verify API Connection**: Check if backend is running on port 8000
3. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
4. **Check Network Tab**: Ensure all files are loading

#### If admin panel doesn't work:
1. **Create Admin User**: `docker-compose exec airport python manage.py createsuperuser`
2. **Login as Admin**: Use admin credentials
3. **Check Permissions**: Ensure user has `is_staff=True`

#### If frontend won't start:
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### If API connection fails:
1. Ensure backend is running on port 8000
2. Check browser console for CORS errors
3. Verify proxy configuration in `vite.config.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## Conclusion

Thank you for reading about the Airport Booking System! 
If you have any questions or suggestions, feel free to open an issue or submit a pull request.

Have a good day!