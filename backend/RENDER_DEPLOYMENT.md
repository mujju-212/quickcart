# QuickCart Backend - Render Deployment Guide
# ==============================================

## Prerequisites
1. ✅ Supabase database is ready and running
2. ✅ Flask backend code is ready in the `backend/` folder
3. ✅ GitHub repository with your code
4. ✅ Render.com account (free - no credit card required)

---

## Step 1: Get Your Supabase Connection String

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ycwtmuclynitqursbyxd
2. Click **Settings** (⚙️) → **Database**
3. Scroll to **Connection string** → Select **URI**
4. Copy the connection string (looks like this):
   ```
   postgresql://postgres.ycwtmuclynitqursbyxd:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual Supabase database password
6. **SAVE THIS** - you'll need it in Step 4

---

## Step 2: Push Your Code to GitHub

Make sure all your recent changes are committed and pushed:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

---

## Step 3: Create Web Service on Render

### 3.1 Sign Up / Log In to Render
1. Go to https://render.com
2. Sign up with GitHub (easiest option)
3. Authorize Render to access your repositories

### 3.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (search: "quickcart")
3. Click **"Connect"** next to your repository

### 3.3 Configure Web Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `quickcart-api` (or any name you prefer) |
| **Region** | Choose closest to Mumbai (Singapore or Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Instance Type** | **Free** |

---

## Step 4: Add Environment Variables

Scroll down to **Environment Variables** section and add these:

### Required Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | Your Supabase connection string from Step 1 | PostgreSQL URI format |
| `JWT_SECRET_KEY` | `your-super-secret-jwt-key-change-this` | Generate a random string |
| `SECRET_KEY` | `your-flask-secret-key-change-this` | Generate a random string |
| `FLASK_ENV` | `production` | Important for security |
| `PYTHON_VERSION` | `3.11.0` | Specifies Python version |

### Optional Variables (for OTP/Email features):

| Key | Value | Notes |
|-----|-------|-------|
| `TWILIO_ACCOUNT_SID` | Your Twilio SID | Only if using Twilio OTP |
| `TWILIO_AUTH_TOKEN` | Your Twilio Token | Only if using Twilio OTP |
| `TWILIO_PHONE_NUMBER` | Your Twilio Number | Only if using Twilio OTP |
| `REACT_APP_FAST2SMS_API_KEY` | Your Fast2SMS Key | Only if using Fast2SMS |

**How to Generate Secret Keys:**
```bash
# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use this online: https://randomkeygen.com/
```

---

## Step 5: Deploy! 🚀

1. Click **"Create Web Service"** at the bottom
2. Render will start building your app (takes 2-5 minutes)
3. Watch the logs in real-time
4. Once you see "Starting gunicorn" → **Deployment successful!** ✅

Your backend will be live at: `https://quickcart-api.onrender.com`

---

## Step 6: Test Your Backend

### Test Health Endpoint:
Open in browser: `https://quickcart-api.onrender.com/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-09T..."
}
```

### Test Categories API:
Open: `https://quickcart-api.onrender.com/api/categories`

Expected response:
```json
{
  "success": true,
  "categories": [
    {"id": 1, "name": "Fruits & Vegetables", ...},
    {"id": 2, "name": "Dairy & Breakfast", ...},
    ...
  ]
}
```

---

## Step 7: Important Notes

### ⚠️ Free Tier Limitations:
- **Spins down after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds (cold start)
- 750 hours/month free (enough for testing)

### 🔄 Keep Backend Awake (Optional):
Use **UptimeRobot** (free service):
1. Go to https://uptimerobot.com
2. Sign up (free, no credit card)
3. Add Monitor:
   - Type: **HTTP(s)**
   - URL: `https://quickcart-api.onrender.com/health`
   - Interval: **5 minutes**
4. This pings your backend every 5 minutes, keeping it awake!

### 🔐 Security Checklist:
- ✅ Change default `JWT_SECRET_KEY` to random string
- ✅ Change default `SECRET_KEY` to random string
- ✅ Set `FLASK_ENV=production`
- ✅ Never commit `.env` file to Git
- ✅ Keep Supabase password secure

---

## Step 8: Get Your Backend URL

Once deployed, Render gives you a URL like:
```
https://quickcart-api.onrender.com
```

**Save this URL!** You'll need it for:
1. Frontend environment variable (`REACT_APP_API_URL`)
2. Testing APIs
3. Mobile app configuration

---

## Troubleshooting

### Build Failed?
- Check the build logs on Render dashboard
- Verify `requirements.txt` has all dependencies
- Make sure `backend/` folder structure is correct

### Application Error?
- Click "Logs" on Render dashboard
- Look for Python errors
- Common issues:
  - Wrong `DATABASE_URL` format
  - Missing environment variables
  - Database connection timeout

### Database Connection Failed?
- Verify Supabase connection string is correct
- Check Supabase project is ACTIVE_HEALTHY
- Try connection string in local environment first

### Still Having Issues?
- Check Render logs: Dashboard → Your Service → Logs tab
- Test database connection in Supabase SQL Editor
- Verify all environment variables are set

---

## Next Steps

Once backend is deployed:
1. ✅ Test all API endpoints
2. ✅ Note your backend URL
3. ✅ Move to frontend deployment (Vercel)
4. ✅ Update frontend with backend URL
5. ✅ Test full-stack integration

---

## Render Dashboard Shortcuts

- **Logs:** See real-time application logs
- **Events:** Deployment history and status
- **Environment:** Manage environment variables
- **Settings:** Change configuration
- **Metrics:** View performance stats

---

## Free Tier Features

✅ 750 hours/month (enough for 24/7 if one service)
✅ Automatic HTTPS
✅ Custom domains (optional)
✅ Auto-deploy from GitHub
✅ Environment variables
✅ Persistent logs (7 days)

---

**Your QuickCart Backend is Ready for Production!** 🎉

Backend URL: `https://quickcart-api.onrender.com` (your actual URL will vary)
