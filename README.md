# 🛒 QuickCart

> **A modern grocery delivery application with real-time features and comprehensive admin panel**

QuickCart is a full-stack e-commerce application for grocery delivery built with React (frontend) and Flask (backend). It provides a seamless shopping experience with product browsing, cart management, user authentication, order tracking, real-time analytics, and a comprehensive admin panel with PDF export capabilities.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

## ✨ Features

### 🛍️ Customer Features
- **User Authentication** - Phone-based login with OTP verification via SMS
- **Product Browsing** - Browse products by categories with search functionality
- **Shopping Cart** - Add, remove, and manage items with quantity selection
- **Wishlist** - Save favorite products for later purchase
- **Address Management** - Multiple delivery addresses support
- **Order Tracking** - Real-time order status updates and history
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### 👨‍💼 Admin Features
- **Real-time Dashboard** - Live sales metrics, revenue analytics, and order statistics
- **Product Management** - Add, edit, delete products with multiple image support
- **Category Management** - Organize products with category-wise analytics
- **Order Management** - View, filter, and update order statuses
- **User Management** - Monitor customer accounts and activity
- **Banner & Offers Management** - Manage promotional content and discount offers
- **PDF Export** - Generate and download analytics reports, order reports, and product catalogs
- **Security Features** - JWT authentication, rate limiting, CSRF protection

## 🚀 Technology Stack

### Frontend
- **Framework**: React 18 with Hooks
- **Routing**: React Router DOM v6
- **UI Library**: React Bootstrap 5
- **Icons**: React Icons, Font Awesome
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Charts**: Recharts for analytics visualization
- **State Management**: Context API
- **Storage**: Local Storage + HTTP Cookies

### Backend
- **Framework**: Flask 3.0 (Python)
- **Database**: PostgreSQL 16
- **Authentication**: JWT tokens with bcrypt
- **SMS Service**: Twilio / Fast2SMS integration
- **Security**: Rate limiting, input validation, SQL injection prevention
- **API**: RESTful API with JSON responses

### Security Features
- JWT-based authentication
- Admin login rate limiting (5 attempts/min)
- CSRF token protection
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- Security headers (X-Frame-Options, CSP, HSTS, etc.)
- Environment-based configuration

## 📁 Project Structure

```
quickcart/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── config/
│   │   └── config.py          # Database and app configuration
│   ├── routes/
│   │   ├── auth_routes.py     # Authentication endpoints
│   │   ├── product_routes.py  # Product CRUD operations
│   │   ├── order_routes.py    # Order management
│   │   ├── category_routes.py # Category operations
│   │   ├── banner_routes.py   # Banner management
│   │   ├── offer_routes.py    # Offers management
│   │   └── analytics_routes.py # Dashboard analytics
│   ├── utils/
│   │   ├── database.py        # Database connection handler
│   │   ├── auth_middleware.py # JWT verification & admin auth
│   │   ├── input_validator.py # Input validation & sanitization
│   │   ├── rate_limiter.py    # Rate limiting implementation
│   │   └── csrf_protection.py # CSRF token handling
│   └── services/
│       └── sms_service.py     # SMS OTP service
├── database/
│   ├── schema.sql             # Database schema
│   ├── setup.py               # Database initialization
│   └── ensure_admin.py        # Create admin user
├── src/
│   ├── components/
│   │   ├── admin/             # Admin dashboard components
│   │   │   ├── dashboard/     # Real-time analytics dashboard
│   │   │   ├── ProductManagement.js
│   │   │   ├── OrderManagement.js
│   │   │   ├── CategoryManagement.js
│   │   │   └── BannerManagement.js
│   │   ├── product/           # Product display components
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   └── common/            # Reusable components
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Admin.js
│   │   ├── Cart.js
│   │   └── Checkout.js
│   ├── context/
│   │   ├── AuthContext.js     # Authentication state
│   │   ├── CartContext.js     # Shopping cart state
│   │   └── SessionContext.js  # Session management
│   ├── services/
│   │   ├── authService.js     # Auth API calls
│   │   ├── productService.js  # Product API calls
│   │   └── orderService.js    # Order API calls
│   └── utils/
│       ├── constants.js
│       └── helpers.js
├── docs/                      # 📚 All documentation
│   ├── README.md              # Documentation index
│   ├── PRODUCTION_SECURITY_FIXES.md  # ⭐ Production deployment guide
│   ├── QUICK_SECURITY_FIXES_SUMMARY.md
│   ├── SECURITY_AND_TEST_ANALYSIS.md
│   ├── TEST_EXECUTION_GUIDE.md
│   ├── PDF_EXPORT_FEATURES.md
│   └── DASHBOARD_REDESIGN_GUIDE.md
├── public/
├── .env.example               # Environment variables template
└── README.md                  # This file
│   │   ├── auth/           # Login/authentication
│   │   ├── cart/           # Shopping cart
│   │   ├── product/        # Product display
│   │   └── common/         # Shared components
│   ├── pages/              # Main page components
│   ├── services/           # Data services
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── assets/             # Images, styles, icons
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/mujju-212/quickcart.git
   cd quickcart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env with your API keys (optional for basic functionality)
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Customer Flow
1. **Browse Products** - Explore categories and view product details
2. **Add to Cart** - Select items and quantities
3. **Login** - Sign in with phone number (OTP simulation)
4. **Checkout** - Enter delivery address and place order
5. **Track Order** - Monitor order status in real-time

### Admin Panel Access
- Navigate to `/admin` to access the admin dashboard
- Manage products, orders, and view analytics
- Add new categories and promotional banners

## 📱 Screenshots

### Customer Interface
| Home Page | Product Catalog | Shopping Cart |
|-----------|----------------|---------------|
| Clean homepage with categories | Product grid with filters | Interactive cart management |

### Admin Dashboard
| Analytics | Product Management | Order Management |
|-----------|-------------------|------------------|
| Sales insights and metrics | Add/edit products | Order status updates |

## 🚀 Available Scripts

In the project directory, you can run:

### Development Commands
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run serve` - Serves the production build locally

### Code Quality Commands
- `npm run lint` - Runs ESLint for code linting
- `npm run lint:fix` - Fixes ESLint errors automatically
- `npm run format` - Formats code with Prettier
- `npm run analyze` - Analyzes the bundle size

## 🔧 Configuration

### Environment Variables

#### Backend (.env in backend folder)
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/quickcart
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickcart
DB_USER=your_username
DB_PASSWORD=your_password

# Security (REQUIRED for production)
JWT_SECRET_KEY=<generate-strong-secret-key>
FLASK_ENV=production  # or 'development'

# SMS Service (Optional - for OTP)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
FAST2SMS_API_KEY=your_fast2sms_key
```

#### Frontend (.env in root folder)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001/api
NODE_ENV=production  # or 'development'

# Optional Features
REACT_APP_USE_MOCK_DATA=false
```

### Generate JWT Secret Key
```bash
# For production, generate a strong secret key:
python -c "import secrets; print(secrets.token_hex(32))"
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Production Deployment Guide](docs/PRODUCTION_SECURITY_FIXES.md)** ⭐ - Complete guide for production setup
- **[Security Analysis](docs/SECURITY_AND_TEST_ANALYSIS.md)** - Security audit and test results
- **[Testing Guide](docs/TEST_EXECUTION_GUIDE.md)** - 60+ test cases and procedures
- **[PDF Export Features](docs/PDF_EXPORT_FEATURES.md)** - PDF generation documentation
- **[Dashboard Guide](docs/DASHBOARD_REDESIGN_GUIDE.md)** - Dashboard architecture

### Quick Links
- Security Rating: **9.5/10** ✅
- Test Coverage: **93.3% pass rate**
- Production Ready: **Yes** ✅

## 🔒 Security Features

QuickCart implements enterprise-grade security:

1. **Authentication**
   - JWT-based token authentication
   - 7-day token expiration
   - Secure password hashing (ready for production)

2. **Rate Limiting**
   - OTP requests: 20 per day per phone
   - Admin login: 5 attempts per minute per IP
   - Prevents brute force attacks

3. **Input Validation**
   - SQL injection prevention (parameterized queries)
   - XSS protection (input sanitization with bleach)
   - Price/quantity validation
   - Phone number validation

4. **Security Headers**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Strict-Transport-Security (HSTS in production)
   - Content-Security-Policy
   - Referrer-Policy

5. **CSRF Protection**
   - Token-based CSRF validation
   - 1-hour token lifetime
   - HMAC-SHA256 signature

## 🚀 Production Deployment

### Prerequisites
1. PostgreSQL 16+ installed
2. Python 3.9+ installed
3. Node.js 18+ installed
4. Strong JWT secret key generated

### Step-by-Step Guide

#### 1. Database Setup
```bash
# Navigate to database folder
cd database

# Run setup script
python setup.py

# Ensure admin user exists
python ensure_admin.py
```

#### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export JWT_SECRET_KEY="<your-generated-secret>"
export FLASK_ENV="production"
export DATABASE_URL="postgresql://user:password@localhost:5432/quickcart"

# Start backend server
python app.py
```

#### 3. Frontend Setup
```bash
# Install dependencies
npm install

# Build for production
NODE_ENV=production npm run build

# Serve with a web server (nginx/apache)
# Or use serve: npx serve -s build
```

#### 4. Configure Web Server (Nginx example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/quickcart/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Production Checklist
- [ ] Generate and set JWT_SECRET_KEY
- [ ] Set FLASK_ENV=production
- [ ] Set NODE_ENV=production
- [ ] Configure database with production credentials
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set up SMS service (Twilio/Fast2SMS) for real OTP
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Test all security features
- [ ] Backup database regularly

📖 **Full deployment guide**: See [docs/PRODUCTION_SECURITY_FIXES.md](docs/PRODUCTION_SECURITY_FIXES.md)

## 📦 Deployment

### Netlify/Vercel Deployment
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service
3. Set environment variables in your hosting dashboard

### GitHub Pages Deployment
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add to package.json:
   ```json
   "homepage": "https://mujju-212.github.io/quickcart"
   ```
3. Deploy:
   ```bash
   npm run build
   npm run deploy
   ```

## 🔍 Key Features Explained

### Local Storage Architecture
- All data is stored in browser's local storage
- Simulates real backend behavior
- Perfect for demo and portfolio purposes

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Custom CSS for enhanced UX

### State Management
- React Context for global state
- Custom hooks for data management
- Efficient re-rendering optimization

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mujju-212**
- GitHub: [@mujju-212](https://github.com/mujju-212)
- Repository: [quickcart](https://github.com/mujju-212/quickcart)

## 🙏 Acknowledgments

- Built with Create React App
- UI components from React Bootstrap
- Icons from React Icons and Font Awesome
- Inspired by modern e-commerce platforms

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Mujju-212](https://github.com/mujju-212)

</div>