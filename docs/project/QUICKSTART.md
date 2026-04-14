# 🚀 QuickCart - Quick Start Guide

This is a simplified guide to get QuickCart running in 5 minutes!

## ⚡ Express Setup (5 Minutes)

### 1. Prerequisites Check ✅

Run these commands to verify you have everything:

```bash
node --version    # Should show v14.0.0 or higher
python --version  # Should show 3.9.0 or higher
psql --version    # Should show 16.0 or higher
git --version     # Should be installed
```

If anything is missing, install from:
- Node.js: https://nodejs.org/
- Python: https://www.python.org/
- PostgreSQL: https://www.postgresql.org/
- Git: https://git-scm.com/

### 2. Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/mujju-212/quickcart.git
cd quickcart

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Database Setup (1 min)

```bash
cd database
python setup.py
python ensure_admin.py
cd ..
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

### 4. Configuration (1 min)

**Backend (.env in backend folder):**

Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickcart
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET_KEY=dev_secret_key_change_in_production_12345678
FLASK_ENV=development
```

**Frontend (.env in root folder):**

Create `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
NODE_ENV=development
```

### 5. Start Application (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

Wait for: `* Running on http://localhost:5001`

**Terminal 2 - Frontend:**
```bash
npm start
```

Wait for: `webpack compiled successfully`

### 6. Access the App! 🎉

- **Customer App**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Username: `admin`
  - Password: `admin123`

---

## 🧪 Test It Works

1. **Open** http://localhost:3000
2. **Browse** products on home page
3. **Add** items to cart
4. **Login** with phone: `1234567890` (any 10 digits in development)
5. **OTP**: Use `123456` (development mode)
6. **Admin**: Go to `/admin` and login with credentials above

---

## 🎁 Optional: Add Sample Data

```bash
cd database
python seed_all_data.py
```

This adds:
- 50+ products across multiple categories
- Sample reviews and ratings
- Promotional banners and offers

---

## 🆘 Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Database Connection Error?
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # Mac
# Check Windows Services          # Windows

# Verify database exists
psql -U postgres -l | grep quickcart
```

### Module Not Found?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

cd backend
pip install --upgrade -r requirements.txt
```

### Still Having Issues?
- Check [Full Documentation](README.md)
- Review [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- Open an [Issue](https://github.com/mujju-212/quickcart/issues)

---

## 📚 Next Steps

- [ ] Change admin password
- [ ] Add your products
- [ ] Configure SMS service for real OTP
- [ ] Customize branding and colors
- [ ] Set up payment gateway
- [ ] Deploy to production

See [README.md](README.md) for complete documentation!

---

**Made with ❤️ by QuickCart Team**
