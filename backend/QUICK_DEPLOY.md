# 🚀 QuickCart Backend Deployment - Quick Start

## ⚡ Super Quick Deploy (5 Minutes)

### 1️⃣ Get Supabase Connection String
```
Supabase Dashboard → Settings → Database → Connection string → Copy URI
Format: postgresql://postgres.ycwtmuclynitqursbyxd:[PASSWORD]@...
```

### 2️⃣ Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3️⃣ Deploy on Render
1. Go to https://render.com (sign up with GitHub)
2. Click **New +** → **Web Service**
3. Connect your `quickcart` repository
4. Fill in these settings:

```
Name: quickcart-api
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
Instance Type: Free
```

### 4️⃣ Add Environment Variables
Click **Add Environment Variable** and add these 5 required ones:

```env
DATABASE_URL = your-supabase-connection-string-from-step-1
JWT_SECRET_KEY = any-random-32-character-string
SECRET_KEY = any-random-32-character-string
FLASK_ENV = production
PYTHON_VERSION = 3.11.0
```

**Generate random keys:**
```powershell
# Run in PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 5️⃣ Click "Create Web Service"
Wait 3-5 minutes for deployment...

### 6️⃣ Test Your API
Open: `https://your-service-name.onrender.com/api/categories`

You should see your 13 categories! 🎉

---

## 📝 Your Backend URL
Save this URL for frontend deployment:
```
https://quickcart-api.onrender.com
```
(Replace with your actual Render URL)

---

## ⚠️ Important Notes
- **Free tier spins down after 15 min** of inactivity
- First request takes 30-60 seconds (cold start)
- Use UptimeRobot (free) to keep it awake: ping every 5 minutes
- 750 hours/month free (enough for 24/7 single service)

---

## 🔍 Troubleshooting
**Build failed?** → Check Render logs for Python errors

**Can't connect to database?** → Verify DATABASE_URL format is correct

**Application error?** → Check environment variables are all set

**Need detailed guide?** → Read [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

---

## ✅ Next Steps
1. Test all API endpoints
2. Deploy frontend to Vercel
3. Update frontend with backend URL
4. Test full-stack app!

**Full deployment guide:** See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions.
