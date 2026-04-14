# 🔗 HOW TO GET YOUR SUPABASE CONNECTION STRING

## Step-by-Step Guide with Screenshots

### 📍 Step 1: Go to Your Supabase Project
```
Open this link: https://supabase.com/dashboard/project/ycwtmuclynitqursbyxd
```

### 📍 Step 2: Open Database Settings
1. Click on **Settings** (⚙️ gear icon) in the left sidebar
2. Click on **Database** in the Settings menu

### 📍 Step 3: Find Connection String Section
1. Scroll down to the **"Connection string"** section
2. You'll see multiple tabs: **URI**, **JDBC**, **Session Mode**
3. **Click on the "URI" tab** (this is important!)

### 📍 Step 4: Copy the Connection String
You'll see a connection string that looks like this:
```
postgresql://postgres.ycwtmuclynitqursbyxd:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### 📍 Step 5: Get Your Database Password
**Option A: If you remember your password**
- Replace `[YOUR-PASSWORD]` in the connection string with your actual password
- Example: If your password is `mySecret123`, the string becomes:
  ```
  postgresql://postgres.ycwtmuclynitqursbyxd:mySecret123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
  ```

**Option B: If you forgot your password**
1. In the same Database settings page, scroll up to **"Database password"** section
2. Click **"Reset database password"** button
3. Click **"Generate new password"**
4. **COPY THE NEW PASSWORD** and save it somewhere safe (you won't see it again!)
5. Click **"Update password"**
6. Now replace `[YOUR-PASSWORD]` in the connection string with this new password

### ✅ Your Final Connection String Should Look Like:
```
postgresql://postgres.ycwtmuclynitqursbyxd:yourActualPassword@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```
⚠️ **NO BRACKETS!** Remove `[` and `]` around the password!

---

# 📤 HOW TO ADD ENVIRONMENT VARIABLES TO RENDER

## You CANNOT upload .env files to Render
Render requires you to add environment variables manually through the dashboard. Here's how:

### 📍 Step 1: Create Your Web Service on Render
1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (**quickcart**)
4. Fill in the settings:
   - Name: `quickcart-api`
   - Region: `Singapore` (closest to Mumbai)
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Instance Type: `Free`

### 📍 Step 2: Add Environment Variables (BEFORE Clicking "Create Web Service")
Scroll down to the **"Environment Variables"** section.

For each variable below, click **"Add Environment Variable"** and enter:

#### Variable 1 - Database Connection
```
Key: DATABASE_URL
Value: postgresql://postgres.ycwtmuclynitqursbyxd:YOUR-ACTUAL-PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```
👆 Replace `YOUR-ACTUAL-PASSWORD` with your Supabase password!

#### Variable 2 - JWT Secret
```
Key: JWT_SECRET_KEY
Value: Xk9mP2vN8qR5tY7wZ3bF6hJ4nM1sL0cV
```
👆 You can use this or generate your own random string

#### Variable 3 - Flask Secret
```
Key: SECRET_KEY
Value: Qa2Ws3Ed4Rf5Tg6Yh7Uj8Ik9Ol0Pm1Zn
```
👆 You can use this or generate your own random string

#### Variable 4 - Flask Environment
```
Key: FLASK_ENV
Value: production
```

#### Variable 5 - Python Version
```
Key: PYTHON_VERSION
Value: 3.11.0
```

### 📍 Step 3: Create the Service
Once all 5 environment variables are added, click **"Create Web Service"** at the bottom.

Render will start building your app (takes 3-5 minutes).

---

## 🔄 To Add Variables AFTER Service is Created
If you forgot to add variables or need to update them:

1. Go to your service dashboard: https://dashboard.render.com
2. Click on your service (**quickcart-api**)
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Enter Key and Value
6. Click **"Save Changes"**
7. Render will automatically restart your service

---

## 🎯 Quick Copy-Paste Template

Copy these and paste into Render (replace the password!):

```
DATABASE_URL=postgresql://postgres.ycwtmuclynitqursbyxd:YOUR-PASSWORD-HERE@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
JWT_SECRET_KEY=Xk9mP2vN8qR5tY7wZ3bF6hJ4nM1sL0cV
SECRET_KEY=Qa2Ws3Ed4Rf5Tg6Yh7Uj8Ik9Ol0Pm1Zn
FLASK_ENV=production
PYTHON_VERSION=3.11.0
```

---

## ⚠️ Important Notes

- **DO NOT** commit your actual .env file to GitHub (it's already in .gitignore)
- **DO NOT** share your connection string publicly
- **DO NOT** include brackets `[` or `]` in the actual password
- **ALWAYS** use `production` for FLASK_ENV (not `development`)

---

## ✅ Verification Checklist

Before clicking "Create Web Service", verify:
- [ ] DATABASE_URL has your actual Supabase password (no brackets!)
- [ ] JWT_SECRET_KEY is set (at least 32 characters)
- [ ] SECRET_KEY is set (at least 32 characters)
- [ ] FLASK_ENV is set to "production"
- [ ] PYTHON_VERSION is set to "3.11.0"
- [ ] All 5 variables are added
- [ ] Root Directory is set to "backend"
- [ ] Start Command is "gunicorn app:app"

---

## 🆘 Need Help?

If your connection string doesn't work:
1. Check for typos in the password
2. Make sure you removed `[` and `]` brackets
3. Try resetting your Supabase password and use the new one
4. Verify the format matches exactly (including colons and slashes)

**Your Supabase Project:** https://supabase.com/dashboard/project/ycwtmuclynitqursbyxd/settings/database
