# ✈️ Airport API Service

A RESTful API for managing and ordering flight tickets. Built with **Django 5.1** and **Django REST Framework**, it provides endpoints for managing airports, airplanes, crews, flights, and user orders — all secured with JWT authentication.

---

## 🚀 Features

- 🔐 JWT Authentication (`SimpleJWT`)
- 📦 CRUD for Airplanes, Routes, Flights, and Orders
- 🧑‍✈️ Crew and Airplane type management
- 📸 Airplane image upload
- 📊 API Schema via `drf-spectacular`
- 🐘 PostgreSQL database integration
- 🐞 Debug Toolbar for development

---

## 🧱 Tech Stack

- Python 3.11+
- Django 5.1
- Django REST Framework
- PostgreSQL
- Simple JWT
- drf-spectacular (OpenAPI schema)
- Debug Toolbar (for local debugging)

---

## 🛠 Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yaroslavsysoiev/Airport-API-service.git
   cd airport_api_service

2. **Set up virtual environment:**
   ```bash
    python -m venv venv
    source venv/bin/activate

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   Create a .env file (or use environment variables):

4. **Create a .env file (or use environment variables):**
   ```bash
   POSTGRES_DB=your_db
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   
5. **Run migrations:**
   ```bash
   python manage.py migrate

6. **Create a superuser (for admin access):**
   ```bash
   python manage.py createsuperuser

7. **Run the server:**
   ```bash
   python manage.py runserver
   
## 🐳 Run with Docker
   Docker should be installed

   ```bash
   docker-compose build
   docker-compose up
   ```

## Getting access

   - create user via /api/user/register/

   - get access token via /api/user/token/