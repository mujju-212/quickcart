# QuickCart - Technology Stack

## 📚 Complete Technology Overview

This document provides a comprehensive breakdown of all technologies, frameworks, libraries, and tools used in the QuickCart project.

---

## 🎨 Frontend Technologies

### Core Framework

#### React 18.2.0
**Purpose**: UI library for building component-based interfaces

**Key Features Used:**
- ✅ **Hooks** - useState, useEffect, useContext, useCallback
- ✅ **Context API** - Global state management
- ✅ **Lazy Loading** - Code splitting for performance
- ✅ **Suspense** - Loading state management
- ✅ **Error Boundaries** - Error handling

**Why React?**
- Component reusability
- Virtual DOM for performance
- Large ecosystem and community
- Easy to learn and maintain

---

### Routing

#### React Router DOM 6.3.0
**Purpose**: Client-side routing and navigation

**Features Used:**
- `BrowserRouter` - HTML5 history API
- `Routes` and `Route` - Route definition
- `Navigate` - Programmatic navigation
- `useNavigate` - Navigation hook
- `useParams` - URL parameters
- `useLocation` - Current location access
- Protected Routes - Authentication guards

**Example:**
```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/product/:id" element={<ProductDetails />} />
  <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
</Routes>
```

---

### UI Components & Styling

#### Bootstrap 5.2.0
**Purpose**: CSS framework for responsive design

**Components Used:**
- Grid system (Container, Row, Col)
- Navigation components (Navbar, Nav)
- Forms (Form, FormControl, FormGroup)
- Buttons and Button groups
- Cards and ListGroups
- Modals and Alerts
- Badges and Pagination
- Spinners and Progress bars

#### React Bootstrap 2.5.0
**Purpose**: Bootstrap components as React components

**Advantages:**
- Native React integration
- No jQuery dependency
- Better state management
- TypeScript support

**Example:**
```javascript
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

<Card>
  <Card.Img src={product.image} />
  <Card.Body>
    <Card.Title>{product.name}</Card.Title>
    <Button variant="warning">Add to Cart</Button>
  </Card.Body>
</Card>
```

---

### Icons

#### React Icons 5.5.0
**Purpose**: Popular icon libraries as React components

**Icon Sets Used:**
- **FontAwesome (Fa)** - General icons
- **Bootstrap Icons (Bi)** - UI icons
- **Material Design (Md)** - Action icons
- **Remix Icon (Ri)** - Modern icons

**Example:**
```javascript
import { FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
```

---

### PDF Generation

#### jsPDF 2.5.1
**Purpose**: Client-side PDF generation

**Use Cases:**
- Order receipts
- Invoice generation
- Report exports

#### jsPDF-AutoTable 3.8.2
**Purpose**: Table generation for jsPDF

**Features:**
- Automatic pagination
- Column styling
- Row alternation
- Header/footer support

**Example:**
```javascript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const doc = new jsPDF();
doc.autoTable({
  head: [['Order ID', 'Product', 'Price']],
  body: orders.map(order => [order.id, order.product, order.price])
});
doc.save('report.pdf');
```

---

### Additional Frontend Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **html2canvas** | 1.4.1 | Screenshot/image capture |
| **js-cookie** | 3.0.5 | Cookie management |
| **web-vitals** | 2.1.4 | Performance metrics |

---

## 🐍 Backend Technologies

### Core Framework

#### Flask 3.0 (Python)
**Purpose**: Lightweight web framework for REST API

**Why Flask?**
- Simple and flexible
- Minimal boilerplate
- Easy to learn
- Perfect for microservices
- Extensive ecosystem

**Key Features Used:**
- Blueprint organization
- Request/Response handling
- JSON serialization
- CORS support
- Error handling
- Middleware support

---

### Flask Extensions

#### Flask-CORS 4.0.0
**Purpose**: Cross-Origin Resource Sharing

**Configuration:**
```python
CORS(app, 
     resources={r"/*": {"origins": "*"}},
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)
```

**Use Case:**
- Allow React frontend (port 3000) to access Flask backend (port 5000)
- Handle preflight OPTIONS requests
- Support authenticated requests

---

### Database

#### PostgreSQL 16
**Purpose**: Primary relational database

**Why PostgreSQL?**
- ACID compliance
- Advanced data types (JSON, Arrays)
- Strong referential integrity
- Excellent performance
- Open-source and free
- Rich feature set

**Features Used:**
- Foreign key constraints
- CHECK constraints
- Serial/Auto-increment
- Indexes for performance
- Date/Time types
- Decimal for currency

#### psycopg2-binary 2.9.7
**Purpose**: PostgreSQL adapter for Python

**Features:**
- Connection pooling
- Parameterized queries (SQL injection prevention)
- Transaction support
- Cursor management

**Example:**
```python
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="blink_basket",
    user="postgres",
    password="password"
)
cursor = conn.cursor()
cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
```

---

### Authentication & Security

#### PyJWT 2.8.0
**Purpose**: JSON Web Token implementation

**Use Cases:**
- User session management
- Stateless authentication
- Token expiration handling
- Secure claims storage

**Token Structure:**
```python
token = jwt.encode({
    'user_id': user_id,
    'role': 'customer',
    'exp': datetime.utcnow() + timedelta(hours=24)
}, secret_key, algorithm='HS256')
```

#### bcrypt 4.0.1
**Purpose**: Password hashing

**Features:**
- Secure password hashing
- Salt generation
- Slow by design (brute-force resistant)

**Example:**
```python
import bcrypt

# Hash password
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Verify password
if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
    # Password matches
```

---

### External Service Integration

#### Twilio 8.2.0
**Purpose**: SMS service for OTP delivery

**Use Cases:**
- Phone verification
- OTP sending
- Order notifications

**Example:**
```python
from twilio.rest import Client

client = Client(account_sid, auth_token)
message = client.messages.create(
    body=f"Your OTP is: {otp}",
    from_=twilio_number,
    to=phone_number
)
```

#### Requests 2.31.0
**Purpose**: HTTP library for API calls

**Use Cases:**
- Fast2SMS integration
- External API calls
- Webhook handling

---

### Report Generation

#### ReportLab 4.0.7
**Purpose**: Server-side PDF generation

**Features:**
- Complex layouts
- Charts and graphics
- Multi-page documents
- Custom styling

**Use Cases:**
- Admin reports
- Analytics exports
- Invoice generation

#### OpenPyXL 3.1.2
**Purpose**: Excel file generation

**Features:**
- Create .xlsx files
- Multiple sheets
- Cell formatting
- Formulas

**Use Cases:**
- Data exports
- Sales reports
- Inventory reports

**Example:**
```python
from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws['A1'] = 'Order ID'
ws['B1'] = 'Total'
wb.save('report.xlsx')
```

---

### Development Tools

#### python-dotenv 1.0.0
**Purpose**: Environment variable management

**Usage:**
```python
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
```

---

## 🗄️ Database Technology

### PostgreSQL 16

#### Data Types Used

| Type | Usage | Example |
|------|-------|---------|
| **SERIAL** | Auto-incrementing IDs | `id SERIAL PRIMARY KEY` |
| **VARCHAR(n)** | Variable-length text | `name VARCHAR(200)` |
| **TEXT** | Long text | `description TEXT` |
| **INTEGER** | Whole numbers | `stock INTEGER` |
| **DECIMAL(p,s)** | Currency | `price DECIMAL(10,2)` |
| **BOOLEAN** | True/False | `is_active BOOLEAN` |
| **TIMESTAMP** | Date and time | `created_at TIMESTAMP` |
| **DATE** | Date only | `order_date DATE` |

#### Constraints Used

```sql
-- Primary Key
id SERIAL PRIMARY KEY

-- Foreign Key
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE

-- Unique
email VARCHAR(150) UNIQUE

-- Check
status VARCHAR(20) CHECK (status IN ('active', 'inactive'))

-- Default
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Not Null
name VARCHAR(100) NOT NULL
```

#### Indexes

```sql
-- Single column index
CREATE INDEX idx_products_category ON products(category_id);

-- Composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date);

-- Unique index
CREATE UNIQUE INDEX idx_users_phone ON users(phone);
```

---

## 🛠️ Development Tools

### Version Control

#### Git
**Purpose**: Source code management

**Workflow:**
- Feature branches
- Pull requests
- Code reviews
- Version tagging

### Code Editor

#### VS Code (Recommended)
**Extensions Used:**
- Python
- ESLint
- Prettier
- GitLens
- PostgreSQL
- Thunder Client (API testing)

---

## 📦 Package Management

### npm (Node Package Manager)
**Purpose**: Frontend dependency management

**Key Commands:**
```bash
npm install          # Install dependencies
npm start           # Start dev server
npm build           # Production build
npm test            # Run tests
```

### pip (Python Package Installer)
**Purpose**: Backend dependency management

**Key Commands:**
```bash
pip install -r requirements.txt    # Install dependencies
pip freeze > requirements.txt      # Export dependencies
pip list                          # List installed packages
```

---

## 🧪 Testing Tools (Future)

### Frontend Testing

| Tool | Purpose |
|------|---------|
| **Jest** | Unit testing framework |
| **React Testing Library** | Component testing |
| **Cypress** | E2E testing |

### Backend Testing

| Tool | Purpose |
|------|---------|
| **pytest** | Unit testing |
| **unittest** | Built-in testing |
| **Postman** | API testing |

---

## 📊 Performance Tools

### Frontend Performance

- **React Developer Tools** - Component profiling
- **Lighthouse** - Performance auditing
- **Web Vitals** - Core metrics tracking

### Backend Performance

- **Flask Debug Toolbar** - Request profiling
- **pgAdmin** - Query analysis
- **cProfile** - Python profiling

---

## 🔒 Security Tools

| Layer | Tool/Library | Purpose |
|-------|-------------|---------|
| **Password** | bcrypt | Secure hashing |
| **Tokens** | PyJWT | JWT generation |
| **Input** | Custom validator | Sanitization |
| **SQL** | psycopg2 | Parameterized queries |
| **CSRF** | Custom | Token validation |
| **Rate Limit** | Custom | Request throttling |
| **Headers** | Flask | Security headers |

---

## 🌐 Third-Party Services

### SMS Services

#### Twilio
- **Pros**: Reliable, global coverage, good docs
- **Cons**: Cost per SMS
- **Use**: Production OTP delivery

#### Fast2SMS
- **Pros**: Cost-effective, India-focused
- **Cons**: Limited to India
- **Use**: Development and India deployments

### Email Services (Optional)

#### MailerSend
- **Pros**: Free tier, good API
- **Use**: Order confirmations, notifications

---

## 📈 Monitoring & Logging (Future)

| Service | Purpose |
|---------|---------|
| **Sentry** | Error tracking |
| **LogRocket** | Session replay |
| **Google Analytics** | User analytics |
| **Datadog** | Application monitoring |

---

## ☁️ Deployment Technologies (Future)

### Hosting Options

#### Frontend
- **Vercel** - React deployment
- **Netlify** - Static hosting
- **AWS S3 + CloudFront** - CDN delivery

#### Backend
- **Heroku** - Easy deployment
- **AWS EC2** - Full control
- **DigitalOcean** - Affordable VPS
- **Render** - Modern platform

#### Database
- **AWS RDS** - Managed PostgreSQL
- **Heroku Postgres** - Managed service
- **ElephantSQL** - PostgreSQL hosting

---

## 🐳 Containerization (Future)

### Docker
**Benefits:**
- Consistent environments
- Easy deployment
- Scalability

**Example `docker-compose.yml`:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
  frontend:
    build: ./
    ports:
      - "3000:3000"
  database:
    image: postgres:16
    environment:
      POSTGRES_DB: blink_basket
```

---

## 📊 Technology Comparison

### Why We Chose This Stack

| Decision | Alternatives | Reason for Choice |
|----------|-------------|-------------------|
| **React** | Angular, Vue | Component reusability, ecosystem |
| **Flask** | Django, FastAPI | Simplicity, flexibility |
| **PostgreSQL** | MySQL, MongoDB | ACID compliance, features |
| **JWT** | Sessions | Stateless, scalable |
| **Bootstrap** | Tailwind, MUI | Quick development, familiar |

---

## 📚 Learning Resources

### Official Documentation

- [React Docs](https://react.dev)
- [Flask Docs](https://flask.palletsprojects.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Bootstrap Docs](https://getbootstrap.com/docs/)

### Tutorials

- React Router: [ReactRouter.com](https://reactrouter.com)
- JWT: [JWT.io](https://jwt.io)
- psycopg2: [Psycopg.org](https://www.psycopg.org)

---

## 🔄 Version Management

### Dependency Updates

```bash
# Frontend
npm outdated           # Check outdated packages
npm update            # Update packages

# Backend
pip list --outdated   # Check outdated packages
pip install --upgrade package-name
```

### Version Compatibility Matrix

| Component | Min Version | Tested Version | Max Compatible |
|-----------|------------|----------------|----------------|
| Node.js | 16.0 | 18.16 | 20.x |
| Python | 3.9 | 3.11 | 3.12 |
| PostgreSQL | 14.0 | 16.0 | 16.x |
| React | 18.0 | 18.2 | 18.x |
| Flask | 2.3 | 3.0 | 3.x |

---

## 📖 Related Documentation

- [Installation Guide](01_INSTALLATION_GUIDE.md)
- [Architecture Overview](03_ARCHITECTURE_OVERVIEW.md)
- [Development Guidelines](DEV_01_CODING_STANDARDS.md)
- [Backend Documentation](BACKEND_01_API_DOCUMENTATION.md)

---

**Technology Stack Version**: 1.0.0  
**Last Updated**: February 2026  
**Review Cycle**: Quarterly
