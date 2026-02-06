# QuickCart - Installation Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Database Setup](#database-setup)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Environment Configuration](#environment-configuration)
8. [Running the Application](#running-the-application)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before installing QuickCart, ensure you have the following software installed on your system:

### Required Software

| Software | Version | Purpose | Download Link |
|----------|---------|---------|--------------|
| **Node.js** | 16.x or higher | Frontend runtime | [nodejs.org](https://nodejs.org) |
| **npm** | 8.x or higher | Package manager | Comes with Node.js |
| **Python** | 3.9 or higher | Backend runtime | [python.org](https://python.org) |
| **pip** | 21.x or higher | Python package manager | Comes with Python |
| **PostgreSQL** | 14.x or higher | Database | [postgresql.org](https://postgresql.org) |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com) |

### Optional Software
- **pgAdmin 4** - Database management GUI
- **VS Code** - Recommended code editor
- **Postman** - API testing tool

---

## 💻 System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4 GB
- **Storage**: 2 GB free space
- **Internet**: Required for package installation

### Recommended Requirements
- **OS**: Windows 11 or Ubuntu 22.04
- **RAM**: 8 GB or more
- **Storage**: 5 GB free space
- **Processor**: Quad-core or better

---

## 📥 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/quickcart.git

# Navigate to project directory
cd quickcart
```

### Step 2: Verify Directory Structure

Ensure your project has the following structure:
```
quickcart/
├── backend/          # Flask backend
├── database/         # Database scripts
├── src/              # React frontend
├── public/           # Static assets
├── docs/             # Documentation
├── package.json      # Frontend dependencies
└── requirements.txt  # Backend dependencies
```

---

## 🗄️ Database Setup

### Step 1: Install PostgreSQL

**Windows:**
```powershell
# Download installer from postgresql.org
# Run the installer and follow the setup wizard
# Remember the password you set for 'postgres' user
```

**Ubuntu/Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql prompt:
CREATE DATABASE blink_basket;

# Exit psql
\q
```

Or use the shorthand:
```bash
createdb -U postgres blink_basket
```

### Step 3: Run Database Schema

```bash
# Navigate to database directory
cd database

# Run schema creation
psql -U postgres -d blink_basket -f schema.sql
```

### Step 4: Seed Initial Data (Optional)

```bash
# Run setup script to populate sample data
python setup.py

# Or seed all data including products, categories, etc.
python seed_all_data.py
```

### Step 5: Create Admin User

```bash
# Create admin account for dashboard access
python ../backend/utils/create_admin.py
```

**Default Admin Credentials:**
- **Phone**: Configure in script
- **OTP**: Will be sent to configured phone number

---

## 🐍 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment

**Windows:**
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate
```

**Linux/macOS:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

You should see `(venv)` prefix in your terminal.

### Step 3: Install Python Dependencies

```bash
# Install all required packages
pip install -r requirements.txt
```

**Core Dependencies:**
```
flask==2.3.3
flask-cors==4.0.0
psycopg2-binary==2.9.7
python-dotenv==1.0.0
bcrypt==4.0.1
PyJWT==2.8.0
requests==2.31.0
twilio==8.2.0
openpyxl==3.1.2
reportlab==4.0.7
```

### Step 4: Verify Installation

```bash
# Check installed packages
pip list

# Test Python imports
python -c "import flask, psycopg2, jwt; print('All imports successful!')"
```

---

## ⚛️ Frontend Setup

### Step 1: Navigate to Root Directory

```bash
cd ..  # From backend directory
```

### Step 2: Install Node Dependencies

```bash
# Install all npm packages
npm install
```

This will install:
- React and React DOM
- React Router DOM
- React Bootstrap
- Bootstrap
- React Icons
- jsPDF and related libraries
- Other dependencies from package.json

### Step 3: Verify Installation

```bash
# Check installed packages
npm list --depth=0

# Verify React version
npm list react
```

---

## 🔐 Environment Configuration

### Step 1: Create Backend .env File

Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env  # Linux/macOS
# Or create manually in Windows
```

### Step 2: Configure Backend Environment Variables

Add the following to `backend/.env`:

```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-change-in-production
DEBUG=True

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blink_basket
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# SMS Service Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# OR use Fast2SMS
REACT_APP_FAST2SMS_API_KEY=your_fast2sms_api_key

# API Configuration
API_HOST=0.0.0.0
API_PORT=5000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

# Payment Gateway (Optional - Future Use)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Step 3: Configure Frontend Environment (Optional)

Create `.env` file in the root directory:

```env
# API Base URL
REACT_APP_API_URL=http://localhost:5000

# SMS API Key (if used directly from frontend)
REACT_APP_FAST2SMS_API_KEY=your_fast2sms_api_key
```

### Step 4: Security Considerations

⚠️ **Important Security Notes:**
- Never commit `.env` files to Git
- Change all secret keys in production
- Use strong, random keys (minimum 32 characters)
- Restrict database access in production
- Use environment-specific configurations

---

## 🚀 Running the Application

### Method 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
# Navigate to backend
cd backend

# Activate virtual environment (if not already active)
source venv/bin/activate  # Linux/macOS
# OR
.\venv\Scripts\activate   # Windows

# Run Flask server
python app.py
```

Backend will start on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
# Navigate to project root
cd quickcart  # Or appropriate directory

# Start React development server
npm start
```

Frontend will start on: `http://localhost:3000`

### Method 2: Using Scripts (Optional)

Create a `start.sh` (Linux/macOS) or `start.bat` (Windows):

**start.sh:**
```bash
#!/bin/bash
# Start backend
cd backend
source venv/bin/activate
python app.py &

# Start frontend
cd ..
npm start
```

**start.bat:**
```batch
@echo off
REM Start backend
cd backend
call venv\Scripts\activate
start python app.py

REM Start frontend
cd ..
start npm start
```

---

## ✅ Verification Steps

### 1. Check Backend Status

```bash
# Test backend API
curl http://localhost:5000/api/health

# Expected response:
# {"status": "healthy", "message": "API is running"}
```

### 2. Check Database Connection

```bash
# Test database connectivity
python -c "from backend.utils.database import db; print(db.check_connection())"
```

### 3. Check Frontend

Open browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 4. Test API Endpoints

```bash
# Test category endpoint
curl http://localhost:5000/api/categories

# Test products endpoint
curl http://localhost:5000/api/products
```

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Issue 1: PostgreSQL Connection Error

**Error:** `psycopg2.OperationalError: could not connect to server`

**Solutions:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
# OR
pg_ctl status  # Windows

# Start PostgreSQL if not running
sudo systemctl start postgresql  # Linux

# Verify database exists
psql -U postgres -l
```

#### Issue 2: Port Already in Use

**Error:** `Port 5000 is already in use` or `Port 3000 is already in use`

**Solutions:**
```bash
# Find process using the port (Linux/macOS)
lsof -i :5000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### Issue 3: Python Module Not Found

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solutions:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Linux/macOS
.\venv\Scripts\activate   # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

#### Issue 4: npm Install Fails

**Error:** `npm ERR! code ERESOLVE`

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

#### Issue 5: Database Schema Errors

**Error:** `relation "users" does not exist`

**Solutions:**
```bash
# Drop and recreate database
dropdb -U postgres blink_basket
createdb -U postgres blink_basket

# Re-run schema
cd database
psql -U postgres -d blink_basket -f schema.sql
python setup.py
```

#### Issue 6: CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Verify Flask-CORS is installed: `pip install flask-cors`
- Check CORS configuration in `backend/app.py`
- Ensure frontend API URL matches backend URL

#### Issue 7: SMS/OTP Not Sending

**Solutions:**
- Verify Twilio/Fast2SMS credentials in `.env`
- Check account balance on SMS service
- Verify phone number format (+91XXXXXXXXXX)
- Check backend logs for SMS errors

---

## 📚 Next Steps

After successful installation:

1. **Create Admin Account**: Use admin creation script
2. **Explore Features**: Log in and test all functionalities
3. **Read Documentation**: Check other docs for detailed guides
4. **Customize**: Modify configurations as needed
5. **Deploy**: Follow deployment guide for production

---

## 📖 Related Documentation

- [Environment Configuration](02_ENVIRONMENT_CONFIGURATION.md)
- [Architecture Overview](03_ARCHITECTURE_OVERVIEW.md)
- [API Documentation](BACKEND_01_API_DOCUMENTATION.md)
- [User Guide](USER_01_GETTING_STARTED.md)
- [Admin Guide](ADMIN_01_DASHBOARD_OVERVIEW.md)

---

## 🆘 Getting Help

If you encounter issues not covered here:
- Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
- Review [FAQ](FAQ.md)
- Check GitHub Issues
- Contact development team

---

**Installation Guide Version**: 1.0.0  
**Last Updated**: February 2026  
**Tested On**: Windows 11, Ubuntu 22.04, macOS Monterey
