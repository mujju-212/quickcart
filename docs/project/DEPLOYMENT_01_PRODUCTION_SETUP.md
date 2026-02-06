# Deployment: Production Setup Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Production Architecture](#production-architecture)
3. [Prerequisites](#prerequisites)
4. [Server Setup](#server-setup)
5. [Database Setup](#database-setup)
6. [Backend Deployment](#backend-deployment)
7. [Frontend Deployment](#frontend-deployment)
8. [Nginx Configuration](#nginx-configuration)
9. [SSL/HTTPS Setup](#sslhttps-setup)
10. [Environment Variables](#environment-variables)
11. [Process Management](#process-management)
12. [Performance Optimization](#performance-optimization)
13. [Caching Strategy](#caching-strategy)
14. [Monitoring & Logging](#monitoring--logging)
15. [Backup Strategy](#backup-strategy)
16. [CI/CD Pipeline](#cicd-pipeline)
17. [Scaling Strategy](#scaling-strategy)
18. [Troubleshooting](#troubleshooting)
19. [Maintenance](#maintenance)

---

## 1. Introduction

### Deployment Overview

This guide covers the complete production deployment of QuickCart on a Linux server (Ubuntu 20.04/22.04 LTS).

### Deployment Stack

```
┌─────────────────────────────────────────────────────┐
│                   Internet                           │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│            Cloudflare (Optional CDN)                │
│  • SSL/TLS Termination                              │
│  • DDoS Protection                                   │
│  • Static Asset Caching                             │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│               Nginx (Web Server)                     │
│  • Reverse Proxy                                     │
│  • SSL/TLS (Let's Encrypt)                          │
│  • Static File Serving                              │
│  • Load Balancing                                    │
│  • Request Rate Limiting                            │
└─────────────────┬───────────────────────────────────┘
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
┌────────────────┐   ┌────────────────┐
│  React Frontend │   │  Flask Backend │
│  (Static Build) │   │  (Gunicorn)    │
│  Port: 80/443   │   │  Port: 5000    │
└────────────────┘   └────────┬───────┘
                              ↓
                    ┌────────────────┐
                    │  PostgreSQL    │
                    │  Database      │
                    │  Port: 5432    │
                    └────────────────┘
```

### Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Ubuntu 20.04 | Ubuntu 22.04 LTS |
| **CPU** | 2 cores | 4+ cores |
| **RAM** | 4 GB | 8+ GB |
| **Storage** | 40 GB SSD | 100+ GB SSD |
| **Network** | 100 Mbps | 1 Gbps |

---

## 2. Production Architecture

### Single Server Deployment

```
┌──────────────────────────────────────────────────────┐
│                 Production Server                     │
│                (Ubuntu 22.04 LTS)                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │            Nginx (Port 80, 443)              │   │
│  │  • Reverse proxy to Gunicorn                 │   │
│  │  • Serve React static files                  │   │
│  │  • SSL/TLS with Let's Encrypt                │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │    Gunicorn + Flask (Port 5000)              │   │
│  │  • Python backend API                        │   │
│  │  • Multiple worker processes                 │   │
│  │  • Process managed by systemd                │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │    PostgreSQL (Port 5432)                    │   │
│  │  • Primary database                          │   │
│  │  • Local connections only                    │   │
│  │  • Automated backups                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │    Redis (Optional - Port 6379)              │   │
│  │  • Session storage                           │   │
│  │  • Cache layer                               │   │
│  │  • Rate limiting                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Multi-Server Deployment (Scalable)

```
                    [Load Balancer]
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                  ↓
   [Web Server 1]   [Web Server 2]   [Web Server 3]
        │                 │                  │
        └─────────────────┼──────────────────┘
                          ↓
              [Application Servers Pool]
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                  ↓
  [Database Master] [Read Replica] [Redis Cluster]
```

---

## 3. Prerequisites

### Domain & DNS Setup

```bash
# Point your domain to server IP
A     quickcart.com        →  your.server.ip
A     www.quickcart.com    →  your.server.ip
A     api.quickcart.com    →  your.server.ip

# Verify DNS propagation
nslookup quickcart.com
dig quickcart.com
```

### Required Accounts

- ✅ Domain registrar (Namecheap, GoDaddy, etc.)
- ✅ Cloud provider (AWS, DigitalOcean, Linode, etc.)
- ✅ Twilio account (for SMS)
- ✅ Fast2SMS account (alternative SMS)
- ✅ Email service (optional - SendGrid, Mailgun)
- ✅ Payment gateway (Razorpay, Stripe)

---

## 4. Server Setup

### Initial Server Configuration

```bash
# 1. Connect to server via SSH
ssh root@your.server.ip

# 2. Update system packages
sudo apt update && sudo apt upgrade -y

# 3. Set timezone
sudo timedatectl set-timezone Asia/Kolkata

# 4. Create deployment user
sudo adduser quickcart
sudo usermod -aG sudo quickcart

# 5. Configure SSH for deployment user
sudo mkdir -p /home/quickcart/.ssh
sudo cp ~/.ssh/authorized_keys /home/quickcart/.ssh/
sudo chown -R quickcart:quickcart /home/quickcart/.ssh
sudo chmod 700 /home/quickcart/.ssh
sudo chmod 600 /home/quickcart/.ssh/authorized_keys

# 6. Disable root login (security)
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 7. Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000  # Flask (will be closed after Nginx setup)
sudo ufw enable
```

### Install Required Software

```bash
# Switch to deployment user
su - quickcart

# Install system dependencies
sudo apt install -y \
    python3 python3-pip python3-venv \
    postgresql postgresql-contrib \
    nginx \
    git \
    build-essential \
    libpq-dev \
    curl \
    supervisor

# Install Node.js (for React build)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
python3 --version    # Python 3.8+
node --version       # Node 18+
npm --version        # npm 8+
psql --version       # PostgreSQL 12+
nginx -v             # Nginx 1.18+
```

---

## 5. Database Setup

### PostgreSQL Configuration

```bash
# 1. Switch to postgres user
sudo -i -u postgres

# 2. Create database and user
psql
CREATE DATABASE quickcart_production;
CREATE USER quickcart_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE quickcart_production TO quickcart_user;
\q

# 3. Exit postgres user
exit

# 4. Configure PostgreSQL for local connections
sudo nano /etc/postgresql/12/main/pg_hba.conf

# Add this line (if not exists)
local   quickcart_production    quickcart_user                  md5

# 5. Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# 6. Test connection
psql -U quickcart_user -d quickcart_production -h localhost
# Enter password when prompted
\q
```

### Initialize Database Schema

```bash
# Navigate to project directory
cd /home/quickcart/quickcart

# Run schema creation
psql -U quickcart_user -d quickcart_production -h localhost -f database/schema.sql

# Seed initial data (optional)
python3 database/seed_all_data.py
```

### Database Performance Tuning

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/12/main/postgresql.conf

# Recommended settings for 8GB RAM server
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10MB
min_wal_size = 1GB
max_wal_size = 4GB
max_connections = 100

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 6. Backend Deployment

### Clone Repository

```bash
# Create project directory
sudo mkdir -p /var/www/quickcart
sudo chown quickcart:quickcart /var/www/quickcart
cd /var/www/quickcart

# Clone repository
git clone https://github.com/yourusername/quickcart.git .

# Or upload via SCP
# From local machine:
# scp -r quickcart/ quickcart@your.server.ip:/var/www/quickcart/
```

### Setup Python Virtual Environment

```bash
cd /var/www/quickcart/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Install production dependencies
pip install gunicorn
```

### Create Production Environment File

```bash
# Create .env file
nano /var/www/quickcart/backend/.env
```

```bash
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=False

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickcart_production
DB_USER=quickcart_user
DB_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://quickcart_user:your_secure_password_here@localhost:5432/quickcart_production

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=168

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Fast2SMS Configuration
REACT_APP_FAST2SMS_API_KEY=your_fast2sms_api_key

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_email_app_password

# API Configuration
API_HOST=0.0.0.0
API_PORT=5000
```

```bash
# Secure the .env file
chmod 600 .env
```

### Setup Gunicorn

```bash
# Create Gunicorn configuration
nano /var/www/quickcart/backend/gunicorn_config.py
```

```python
# gunicorn_config.py
import multiprocessing

# Server socket
bind = "127.0.0.1:5000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = '/var/log/quickcart/gunicorn-access.log'
errorlog = '/var/log/quickcart/gunicorn-error.log'
loglevel = 'info'

# Process naming
proc_name = 'quickcart-backend'

# Server mechanics
daemon = False
pidfile = '/var/run/quickcart/gunicorn.pid'
user = 'quickcart'
group = 'quickcart'
umask = 0o007

# SSL (if terminating SSL at Gunicorn)
# keyfile = '/etc/ssl/private/quickcart.key'
# certfile = '/etc/ssl/certs/quickcart.crt'
```

```bash
# Create log directories
sudo mkdir -p /var/log/quickcart
sudo chown quickcart:quickcart /var/log/quickcart

sudo mkdir -p /var/run/quickcart
sudo chown quickcart:quickcart /var/run/quickcart
```

### Test Gunicorn

```bash
cd /var/www/quickcart/backend
source venv/bin/activate

# Test Gunicorn
gunicorn -c gunicorn_config.py app:app

# If successful, you should see:
# [INFO] Starting gunicorn 20.1.0
# [INFO] Listening at: http://127.0.0.1:5000

# Test API endpoint
curl http://localhost:5000/api/health

# Stop Gunicorn (Ctrl+C)
```

### Create Systemd Service

```bash
# Create systemd service file
sudo nano /etc/systemd/system/quickcart-backend.service
```

```ini
[Unit]
Description=QuickCart Flask Backend
After=network.target postgresql.service

[Service]
Type=notify
User=quickcart
Group=quickcart
WorkingDirectory=/var/www/quickcart/backend
Environment="PATH=/var/www/quickcart/backend/venv/bin"
EnvironmentFile=/var/www/quickcart/backend/.env
ExecStart=/var/www/quickcart/backend/venv/bin/gunicorn -c gunicorn_config.py app:app
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Reload systemd, enable and start service
sudo systemctl daemon-reload
sudo systemctl enable quickcart-backend.service
sudo systemctl start quickcart-backend.service

# Check status
sudo systemctl status quickcart-backend.service

# View logs
sudo journalctl -u quickcart-backend.service -f
```

---

## 7. Frontend Deployment

### Build React Application

```bash
# On your local machine or CI/CD server

cd quickcart
npm install

# Create production environment file
nano .env.production
```

```bash
# .env.production
REACT_APP_API_URL=https://quickcart.com/api
REACT_APP_FAST2SMS_API_KEY=your_fast2sms_api_key
GENERATE_SOURCEMAP=false
```

```bash
# Build for production
npm run build

# This creates a 'build' folder with optimized static files
```

### Deploy Frontend to Server

```bash
# Transfer build folder to server
scp -r build/ quickcart@your.server.ip:/var/www/quickcart/frontend/

# Or on server, build directly
cd /var/www/quickcart
npm install
npm run build
```

### Optimize Frontend Build

```bash
# On server, configure Nginx to serve static files
sudo mkdir -p /var/www/quickcart/frontend
sudo cp -r build/* /var/www/quickcart/frontend/
sudo chown -R www-data:www-data /var/www/quickcart/frontend
```

---

## 8. Nginx Configuration

### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/quickcart
```

```nginx
# QuickCart Nginx Configuration

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

# Upstream backend servers
upstream backend {
    server 127.0.0.1:5000 fail_timeout=0;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name quickcart.com www.quickcart.com;

    # Let's Encrypt ACME challenge
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name quickcart.com www.quickcart.com;

    # SSL Configuration (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/quickcart.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quickcart.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Root directory for frontend
    root /var/www/quickcart/frontend;
    index index.html;

    # Logging
    access_log /var/log/nginx/quickcart-access.log;
    error_log /var/log/nginx/quickcart-error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # API routes (proxy to Flask backend)
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Login rate limiting
    location /api/auth/send-otp {
        limit_req zone=login_limit burst=3 nodelay;
        
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend routes (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Service worker (no cache)
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Security: Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/quickcart /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 9. SSL/HTTPS Setup

### Install Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Create directory for ACME challenge
sudo mkdir -p /var/www/letsencrypt
sudo chown www-data:www-data /var/www/letsencrypt
```

### Obtain SSL Certificate

```bash
# Get certificate (interactive)
sudo certbot --nginx -d quickcart.com -d www.quickcart.com

# Or non-interactive
sudo certbot certonly --webroot \
  -w /var/www/letsencrypt \
  -d quickcart.com \
  -d www.quickcart.com \
  --email admin@quickcart.com \
  --agree-tos \
  --non-interactive

# Certbot will:
# 1. Verify domain ownership
# 2. Generate SSL certificate
# 3. Update Nginx configuration automatically
```

### Test SSL Configuration

```bash
# Test HTTPS
curl -I https://quickcart.com

# Check SSL grade at: https://www.ssllabs.com/ssltest/
```

### Auto-Renewal Setup

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically installs renewal cron job
# Check cron job:
sudo systemctl list-timers | grep certbot

# Manual renewal (if needed)
sudo certbot renew

# Reload Nginx after renewal
sudo systemctl reload nginx
```

---

## 10. Environment Variables

### Production Environment Variables

```bash
# Backend .env (/var/www/quickcart/backend/.env)
FLASK_ENV=production
SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET_KEY=$(openssl rand -hex 32)
DEBUG=False

DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickcart_production
DB_USER=quickcart_user
DB_PASSWORD=$(openssl rand -base64 32)

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend .env.production
REACT_APP_API_URL=https://quickcart.com/api
GENERATE_SOURCEMAP=false
```

### Secure Environment Files

```bash
# Set proper permissions
chmod 600 /var/www/quickcart/backend/.env
chown quickcart:quickcart /var/www/quickcart/backend/.env

# Backup environment file (encrypted)
tar -czf env-backup.tar.gz .env
gpg -c env-backup.tar.gz
rm env-backup.tar.gz
```

---

## 11. Process Management

### Systemd Services

```bash
# Start services
sudo systemctl start quickcart-backend.service
sudo systemctl start nginx.service
sudo systemctl start postgresql.service

# Enable auto-start on boot
sudo systemctl enable quickcart-backend.service
sudo systemctl enable nginx.service
sudo systemctl enable postgresql.service

# Check status
sudo systemctl status quickcart-backend.service

# Restart services
sudo systemctl restart quickcart-backend.service
sudo systemctl restart nginx.service

# View logs
sudo journalctl -u quickcart-backend.service -f
sudo tail -f /var/log/nginx/quickcart-error.log
```

### Process Monitoring

```bash
# Monitor Gunicorn processes
ps aux | grep gunicorn

# Monitor system resources
htop

# Check port usage
sudo netstat -tlnp | grep :5000
sudo lsof -i :5000
```

---

## 12. Performance Optimization

### Gunicorn Workers Configuration

```python
# Calculate optimal workers
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
# 4-core server = 9 workers
# 8-core server = 17 workers
```

### Database Connection Pooling

```python
# backend/utils/database.py
import psycopg2.pool

connection_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=20,
    host=Config.DB_HOST,
    database=Config.DB_NAME,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD
)

def get_connection():
    return connection_pool.getconn()

def return_connection(conn):
    connection_pool.putconn(conn)
```

### Frontend Optimization

```javascript
// React lazy loading
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductPage = React.lazy(() => import('./pages/ProductPage'));

// Image optimization
<img
  src={product.image}
  alt={product.name}
  loading="lazy"
  width="300"
  height="300"
/>

// Code splitting by route
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/product/:id" element={<ProductPage />} />
  </Routes>
</Suspense>
```

---

## 13. Caching Strategy

### Redis Setup (Optional)

```bash
# Install Redis
sudo apt install redis-server -y

# Configure Redis
sudo nano /etc/redis/redis.conf

# Set bind to localhost only
bind 127.0.0.1

# Set password
requirepass your_redis_password_here

# Enable persistence
save 900 1
save 300 10
save 60 10000

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli
AUTH your_redis_password_here
PING
# Should return: PONG
```

### Implement Redis Caching

```python
# backend/utils/cache.py
import redis
import json
from config import Config

redis_client = redis.Redis(
    host='localhost',
    port=6379,
    password=Config.REDIS_PASSWORD,
    decode_responses=True
)

def cache_get(key):
    """Get value from cache"""
    value = redis_client.get(key)
    return json.loads(value) if value else None

def cache_set(key, value, ttl=300):
    """Set value in cache with TTL (seconds)"""
    redis_client.setex(key, ttl, json.dumps(value))

def cache_delete(key):
    """Delete key from cache"""
    redis_client.delete(key)

# Usage in routes
@app.route('/api/products')
def get_products():
    # Try cache first
    cached = cache_get('products:all')
    if cached:
        return jsonify(cached)
    
    # Query database
    products = db.execute_query("SELECT * FROM products")
    
    # Cache for 5 minutes
    cache_set('products:all', products, ttl=300)
    
    return jsonify(products)
```

### Nginx Caching

```nginx
# Add to nginx.conf
proxy_cache_path /var/cache/nginx/quickcart levels=1:2 keys_zone=quickcart_cache:10m max_size=1g inactive=60m use_temp_path=off;

# In server block
location /api/products {
    proxy_cache quickcart_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    proxy_cache_bypass $http_cache_control;
    add_header X-Cache-Status $upstream_cache_status;
    
    proxy_pass http://backend;
}
```

---

## 14. Monitoring & Logging

### Application Logging

```python
# backend/app.py
import logging
from logging.handlers import RotatingFileHandler

# Configure logging
if not app.debug:
    file_handler = RotatingFileHandler(
        '/var/log/quickcart/app.log',
        maxBytes=10240000,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('QuickCart startup')
```

### Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/quickcart
```

```bash
/var/log/quickcart/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 quickcart quickcart
    sharedscripts
    postrotate
        systemctl reload quickcart-backend.service
    endscript
}
```

### System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Monitor CPU and memory
htop

# Monitor disk I/O
iotop

# Monitor network
nethogs

# Check disk usage
df -h

# Check memory usage
free -h
```

### Uptime Monitoring

Use external services:
- UptimeRobot (https://uptimerobot.com/)
- Pingdom (https://www.pingdom.com/)
- StatusCake (https://www.statuscake.com/)

---

## 15. Backup Strategy

### Database Backup Script

```bash
#!/bin/bash
# /home/quickcart/scripts/backup_database.sh

# Configuration
BACKUP_DIR="/home/quickcart/backups/database"
DB_NAME="quickcart_production"
DB_USER="quickcart_user"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/quickcart_db_$DATE.sql.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump database and compress
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_FILE

# Delete backups older than 30 days
find $BACKUP_DIR -name "quickcart_db_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: $BACKUP_FILE"
```

```bash
# Make script executable
chmod +x /home/quickcart/scripts/backup_database.sh

# Test backup
/home/quickcart/scripts/backup_database.sh
```

### Automated Backup (Cron Job)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/quickcart/scripts/backup_database.sh >> /var/log/quickcart/backup.log 2>&1
```

### Application Backup Script

```bash
#!/bin/bash
# /home/quickcart/scripts/backup_application.sh

BACKUP_DIR="/home/quickcart/backups/application"
APP_DIR="/var/www/quickcart"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/quickcart_app_$DATE.tar.gz"

mkdir -p $BACKUP_DIR

tar -czf $BACKUP_FILE \
    --exclude='node_modules' \
    --exclude='venv' \
    --exclude='__pycache__' \
    --exclude='.git' \
    $APP_DIR

find $BACKUP_DIR -name "quickcart_app_*.tar.gz" -mtime +7 -delete

echo "Application backup completed: $BACKUP_FILE"
```

### Restore from Backup

```bash
# Restore database
gunzip < quickcart_db_20260201_020000.sql.gz | psql -U quickcart_user -d quickcart_production

# Restore application
tar -xzf quickcart_app_20260201_020000.tar.gz -C /var/www/
```

---

## 16. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    # Backend deployment
    - name: Deploy Backend
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/quickcart
          git pull origin main
          cd backend
          source venv/bin/activate
          pip install -r requirements.txt
          sudo systemctl restart quickcart-backend.service
    
    # Frontend deployment
    - name: Build Frontend
      run: |
        npm install
        npm run build
    
    - name: Deploy Frontend
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        source: "build/*"
        target: "/var/www/quickcart/frontend/"
```

---

## 17. Scaling Strategy

### Vertical Scaling (Single Server)

```bash
# Increase server resources
# CPU: 2 cores → 4 cores → 8 cores
# RAM: 4GB → 8GB → 16GB
# Storage: 40GB → 100GB → 200GB
```

### Horizontal Scaling (Multiple Servers)

```
                [Load Balancer - Nginx]
                          |
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                  ↓
   [App Server 1]   [App Server 2]   [App Server 3]
        |                 |                  |
        └─────────────────┼──────────────────┘
                          ↓
              [PostgreSQL Master-Slave]
                          |
                    [Redis Cluster]
```

### Database Scaling

```sql
-- Create read replica
-- Master handles writes
-- Replicas handle reads

-- Configure master
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 10;
ALTER SYSTEM SET wal_keep_size = '1GB';

-- On replica server
pg_basebackup -h master_ip -D /var/lib/postgresql/12/main -U replication -P -R
```

---

## 18. Troubleshooting

### Common Issues

#### Backend Not Starting

```bash
# Check logs
sudo journalctl -u quickcart-backend.service -n 50

# Check if port is in use
sudo lsof -i :5000

# Check environment variables
sudo systemctl show quickcart-backend.service | grep Environment

# Test manually
cd /var/www/quickcart/backend
source venv/bin/activate
python app.py
```

#### Nginx 502 Bad Gateway

```bash
# Check backend status
sudo systemctl status quickcart-backend.service

# Check Nginx logs
sudo tail -f /var/log/nginx/quickcart-error.log

# Test backend directly
curl http://127.0.0.1:5000/api/health

# Check Nginx configuration
sudo nginx -t
```

#### Database Connection Error

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U quickcart_user -d quickcart_production -h localhost

# Check pg_hba.conf
sudo nano /etc/postgresql/12/main/pg_hba.conf

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate expiration
sudo certbot certificates

# Test SSL
curl -vI https://quickcart.com
```

---

## 19. Maintenance

### Regular Maintenance Tasks

#### Daily
- ✅ Check application logs
- ✅ Monitor disk usage
- ✅ Check backup completion

#### Weekly
- ✅ Review error logs
- ✅ Check security updates
- ✅ Verify backup integrity
- ✅ Monitor performance metrics

#### Monthly
- ✅ Update system packages
- ✅ Update dependencies
- ✅ Database vacuum/analyze
- ✅ Review access logs
- ✅ Security audit

### Update Procedures

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Python dependencies
cd /var/www/quickcart/backend
source venv/bin/activate
pip list --outdated
pip install -U package_name

# Update frontend dependencies
cd /var/www/quickcart
npm outdated
npm update

# Restart services
sudo systemctl restart quickcart-backend.service
sudo systemctl reload nginx
```

### Database Maintenance

```sql
-- Vacuum database
VACUUM ANALYZE;

-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Summary

### Deployment Checklist

✅ **Server Setup**
- Ubuntu 22.04 LTS installed
- Firewall configured (UFW)
- SSH hardened (key-only, no root)
- System packages updated

✅ **Database**
- PostgreSQL 12+ installed
- Database and user created
- Schema initialized
- Backups automated

✅ **Backend**
- Flask application deployed
- Virtual environment configured
- Gunicorn running with systemd
- Environment variables secured
- Logging configured

✅ **Frontend**
- React application built
- Static files deployed
- Environment variables set
- Service worker configured

✅ **Web Server**
- Nginx installed and configured
- Reverse proxy to backend
- Static file serving
- Rate limiting enabled
- Gzip compression enabled

✅ **SSL/HTTPS**
- Let's Encrypt certificate installed
- Auto-renewal configured
- HSTS enabled
- SSL grade A+

✅ **Security**
- HTTPS enforced
- Security headers configured
- Firewall rules set
- Environment files secured

✅ **Monitoring**
- Application logging
- Nginx logs
- System monitoring
- Uptime monitoring

✅ **Backups**
- Database backup automated
- Application backup configured
- Restore procedures tested

✅ **Performance**
- Gunicorn workers optimized
- Database connection pooling
- Caching configured (Redis)
- Frontend optimized

---

**Deployment Complete!** 🎉

QuickCart is now running in production at:
- **Frontend**: https://quickcart.com
- **API**: https://quickcart.com/api

---

**Related Documentation**:
- [Security Overview](SECURITY_01_OVERVIEW.md)
- [Backend API](BACKEND_01_API_DOCUMENTATION.md)
- [Database Schema](BACKEND_02_DATABASE_SCHEMA.md)

**Version**: 1.0.0  
**Last Updated**: February 2026
