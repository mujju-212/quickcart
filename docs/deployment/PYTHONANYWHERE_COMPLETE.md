# 🐍 PythonAnywhere - Complete Web App Setup

## You're at: Web Apps Section

Continue from here:

---

## Step 1: Configure Web App

You should see your web app dashboard. Now configure it:

### **A. Set Python Version**
1. Scroll to **"Python version"** section
2. Select: **Python 3.11**
3. Click **"Reload"** (if shown)

---

### **B. Set Source Code Directory**
1. Find **"Code"** section
2. In **"Source code"**, click the path
3. Set to: `/home/YOUR_USERNAME/quickcart/backend`
4. Replace `YOUR_USERNAME` with your actual PythonAnywhere username

---

### **C. Set Working Directory**
1. Still in **"Code"** section
2. In **"Working directory"**, set to: `/home/YOUR_USERNAME/quickcart/backend`

---

## Step 2: Configure WSGI File

This is CRITICAL - tells PythonAnywhere how to run your Flask app.

1. In web app dashboard, find **"Code"** section
2. Click on the **WSGI configuration file** link (something like `/var/www/username_pythonanywhere_com_wsgi.py`)
3. **DELETE everything** in that file
4. **Paste this code:**

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/YOUR_USERNAME/quickcart/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['DATABASE_URL'] = 'postgresql://postgres:0435bAyL282xvG3b@db.ycwtmuclynitqursbyxd.supabase.co:5432/postgres'
os.environ['JWT_SECRET_KEY'] = 'your-jwt-secret-key-here'
os.environ['SECRET_KEY'] = 'your-flask-secret-key-here'
os.environ['FLASK_ENV'] = 'production'

# Import Flask app
from app import app as application
```

5. **IMPORTANT:** Replace `YOUR_USERNAME` with your actual username (appears twice!)
6. Click **"Save"** (top right)

---

## Step 3: Install Dependencies

PythonAnywhere needs to install your Python packages.

1. Go to **"Consoles"** tab (top menu)
2. Click **"Bash"** to open a bash console
3. Run these commands:

```bash
# Navigate to your project
cd ~/quickcart/backend

# Install packages
pip3.11 install --user -r requirements.txt
```

Wait for installation to complete (2-3 minutes).

**If you see errors about psycopg2:**
```bash
pip3.11 install --user psycopg2-binary
```

---

## Step 4: Reload Web App

1. Go back to **"Web"** tab
2. Click the big green **"Reload"** button at the top
3. Wait 10-15 seconds

---

## Step 5: Test Your Deployment

Your app should now be live!

### **Get Your URL**
Look at the top of the Web tab - you'll see:
```
Configuration for [YOUR_USERNAME].pythonanywhere.com
```

### **Test Endpoints:**

Open these URLs in your browser:

1. **Health Check:**
   ```
   https://YOUR_USERNAME.pythonanywhere.com/health
   ```
   Should show: `{"database": "connected"}` ✅

2. **Categories API:**
   ```
   https://YOUR_USERNAME.pythonanywhere.com/api/categories
   ```
   Should show: JSON with 13 categories ✅

3. **Offers API:**
   ```
   https://YOUR_USERNAME.pythonanywhere.com/api/offers
   ```
   Should show: JSON with 3 offers ✅

---

## 🔧 Troubleshooting

### **Error: "Something went wrong :-("**

**Fix:**
1. Click **"Log files"** (in Error log section)
2. Click **"Error log"** link
3. **Copy the last 20 lines** and send them to me

### **Error: "ModuleNotFoundError"**

**Fix:**
```bash
# In bash console
cd ~/quickcart/backend
pip3.11 install --user [missing-package-name]
```
Then reload web app.

### **Error: Database connection failed**

**Fix:**
1. Check WSGI file has correct DATABASE_URL
2. Make sure `psycopg2-binary` is installed
3. Reload web app

### **Static files not loading**

**Fix:**
1. In Web tab, go to **"Static files"** section
2. Add mapping:
   - URL: `/static/`
   - Directory: `/home/YOUR_USERNAME/quickcart/backend/static`

---

## Step 6: Update Frontend

Once backend works:

1. Go to: https://vercel.com/dashboard
2. Open **quickcart** project
3. **Settings** → **Environment Variables**
4. Update `REACT_APP_API_URL` to: `https://YOUR_USERNAME.pythonanywhere.com/api`
5. **Deployments** → **Redeploy**

---

## 📊 PythonAnywhere Free Tier Limits

- **CPU:** 100 seconds/day (resets daily)
- **Bandwidth:** Limited
- **Always-on:** ❌ (app sleeps after 3 months of inactivity)
- **Best for:** Testing and development

**Note:** If your app gets heavy traffic, you'll need to upgrade to paid tier ($5/month).

---

## ✅ Success Checklist

- [ ] Python version set to 3.11
- [ ] Source code directory configured
- [ ] WSGI file updated with correct code
- [ ] Dependencies installed (requirements.txt)
- [ ] psycopg2-binary installed
- [ ] Web app reloaded
- [ ] Health endpoint returns "connected"
- [ ] Categories API returns JSON
- [ ] Frontend updated with new API URL

---

## 🆘 Need Help?

At any step, if you see errors:
1. Check the **Error log** (Web tab → Log files)
2. Copy the error message
3. Send it to me and I'll help fix it!

---

## 🎯 Next Steps After Success

1. ✅ Test all API endpoints
2. ✅ Test frontend with PythonAnywhere backend
3. ✅ Test full user flows (cart, checkout, orders)
4. 🎉 Your app is LIVE!

---

**Continue from where you are and let me know if you hit any errors!** 🚀
