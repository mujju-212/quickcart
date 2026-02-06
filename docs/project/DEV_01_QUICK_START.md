# Developer Quick Start Guide

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** New Developers  
**Related Documents:** [01_INSTALLATION_GUIDE.md](01_INSTALLATION_GUIDE.md), [03_ARCHITECTURE_OVERVIEW.md](03_ARCHITECTURE_OVERVIEW.md)

---

## ⚡ Quick Setup (15 minutes)

### Prerequisites

```bash
# Required:
- Node.js 16+ & npm
- Python 3.9+
- PostgreSQL 12+
- Git
```

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd quickcart

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Create database
createdb quickcart_db

# Run schema
psql quickcart_db < database/schema.sql

# Seed data (optional)
python database/seed_all_data.py
```

### 3. Environment Configuration

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:pass@localhost/quickcart_db
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

**Frontend** (`.env`):
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm start
# Runs on http://localhost:3000
```

### 5. Verify Setup

- Open http://localhost:3000
- Sign up / Login
- Browse products
- ✅ Setup complete!

---

## 📁 Project Structure

```
quickcart/
├── backend/              # Flask API
│   ├── routes/          # API endpoints
│   ├── utils/           # Helpers, middleware
│   ├── config/          # Configuration
│   └── app.py           # Entry point
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── pages/           # Page components
│   ├── context/         # Global state
│   ├── services/        # API calls
│   └── App.js           # Root component
├── database/            # SQL scripts
└── docs/                # Documentation
```

---

## 🔑 Key Concepts

### Authentication

- **User login:** OTP-based (SMS)
- **Admin login:** Password-based
- **Tokens:** JWT (7-day validity)

### State Management

- **React Context API** for global state
- **Contexts:** Auth, Cart, Wishlist, Location

### Database

- **PostgreSQL** with 12 tables
- **Foreign keys** for relationships
- **Indexes** on common queries

---

## 🚀 Common Tasks

### Add a New API Endpoint

**1. Create route** (`backend/routes/example_routes.py`):
```python
from flask import Blueprint, jsonify

example_bp = Blueprint('example', __name__)

@example_bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello World!"})
```

**2. Register in app** (`backend/app.py`):
```python
from routes.example_routes import example_bp
app.register_blueprint(example_bp, url_prefix='/api/example')
```

### Add a New Page

**1. Create page** (`src/pages/NewPage.js`):
```javascript
import React from 'react';

const NewPage = () => {
  return <h1>New Page</h1>;
};

export default NewPage;
```

**2. Add route** (`src/App.js`):
```javascript
import NewPage from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

### Add a New Component

**1. Create component** (`src/components/MyComponent.js`):
```javascript
import React from 'react';

const MyComponent = ({ title }) => {
  return <div>{title}</div>;
};

export default MyComponent;
```

**2. Use in page:**
```javascript
import MyComponent from '../components/MyComponent';

<MyComponent title="Hello!" />
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest
```

### Run Frontend Tests
```bash
npm test
```

### Manual Testing
- Use Postman for API testing
- Test UI in browser
- Check Chrome DevTools console

---

## 🐛 Debugging

### Backend Debugging
```python
# Add breakpoint
import pdb; pdb.set_trace()

# Run with debug mode
flask run --debug
```

### Frontend Debugging
- Use **React DevTools** extension
- Check browser console (`F12`)
- Add `console.log()` statements

### Common Issues

**Backend won't start:**
- Check database connection
- Verify `.env` file
- Check port 5000 not in use

**Frontend errors:**
- Run `npm install` again
- Clear cache: `npm cache clean --force`
- Check API_URL in `.env`

**Database errors:**
- Verify PostgreSQL running
- Check database exists
- Verify credentials in `.env`

---

## 📚 Resources

### Documentation
- [Full Installation Guide](01_INSTALLATION_GUIDE.md)
- [API Documentation](BACKEND_01_API_DOCUMENTATION.md)
- [Frontend Architecture](FRONTEND_01_ARCHITECTURE.md)
- [Database Schema](BACKEND_02_DATABASE_SCHEMA.md)

### Tech Stack Docs
- [Flask](https://flask.palletsprojects.com/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Bootstrap](https://getbootstrap.com/docs/)

---

## 💡 Tips

**✅ Best Practices:**
- Follow existing code style
- Write meaningful commit messages
- Test before committing
- Document new features
- Use descriptive variable names

**🚀 Productivity:**
- Use VS Code extensions
- Set up auto-formatting
- Use Git branches for features
- Keep dependencies updated

---

## 🆘 Getting Help

**Stuck? Try:**
1. Check documentation
2. Search existing issues
3. Ask team members
4. Create detailed bug report

**Support:**
- Team Chat: [Slack/Discord]
- Email: dev-team@quickcart.com

---

**Next Steps:**
- Read [Architecture Overview](03_ARCHITECTURE_OVERVIEW.md)
- Explore [Component Library](FRONTEND_02_KEY_COMPONENTS.md)
- Review [Security Guidelines](SECURITY_01_OVERVIEW.md)
