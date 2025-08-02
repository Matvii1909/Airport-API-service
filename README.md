# 🛩️ Airport Booking System

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
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── store/      # State management
│   │   └── utils/      # Utility functions
│   └── public/         # Static files
└── docker-compose.yaml  # Docker configuration
```

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (for backend)
- **Node.js** (v16+) and **npm** (for frontend)

### Step 1: Start Backend

```bash
# Start Django API and PostgreSQL
docker-compose up -d

# Verify backend is running
curl http://localhost:8000/api/airport/airports/
```

### Step 2: Start Frontend

```bash
# Install frontend dependencies
cd frontend
npm install

# Start React development server
npm run dev
```

### Step 3: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/

### Step 4: Test the Application

1. **Open** http://localhost:3000
2. **Register** a new user account
3. **Login** with your credentials
4. **Browse flights** and test the functionality

## 💻 Development

### Backend Development

```bash
# Run migrations
docker-compose exec airport python manage.py migrate

# Create superuser
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

### Flights
- `GET /api/airport/flights/` - List flights
- `GET /api/airport/airports/` - List airports
- `GET /api/airport/airplanes/` - List airplanes

### Orders
- `GET /api/airport/orders/` - List user orders
- `POST /api/airport/orders/` - Create order

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
POSTGRES_DB=airport_db
POSTGRES_USER=airport_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
SECRET_KEY=your_secret_key
DEBUG=True
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
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
3. Run migrations: `python manage.py migrate`
4. Check logs: `docker-compose logs backend`

### Frontend Issues
1. Ensure backend is running on port 8000
2. Check API proxy configuration in `vite.config.js`
3. Clear browser cache
4. Check console for CORS errors

### Database Issues
1. Reset database: `docker-compose down -v && docker-compose up -d`
2. Run migrations: `python manage.py migrate`
3. Create superuser: `python manage.py createsuperuser`

### Common Problems

#### If backend won't start:
```bash
# Check Docker logs
docker-compose logs backend

# Restart services
docker-compose down
docker-compose up -d
```

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

Thank you for using the Airport Booking System! 
If you have any questions or suggestions, feel free to open an issue or submit a pull request.
Have a good day!