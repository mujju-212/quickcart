# 🔍 Get Your Supabase Connection String

## Step-by-Step Guide

### **Step 1: Open Supabase Dashboard**
1. Go to: https://supabase.com/dashboard
2. Click on your **quickcart-db** project

### **Step 2: Get Connection String**
1. On the left sidebar, click **Project Settings** (gear icon at bottom)
2. Click **Database** tab
3. Scroll down to **Connection string** section
4. Select **URI** (not PSQL mode)
5. Scroll to the **Connection pooling** section
6. Make sure **Session mode** is selected
7. Click **Copy** to copy the connection string

### **Step 3: Important - Update the Connection String**
The copied string will look like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Add SSL parameter** to the end:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### **Step 4: URL-Encode Special Characters in Password**

If your password contains special characters like `@`, `#`, `$`, `%`, `&`, etc., you MUST URL-encode them:

| Character | Encoded |
|-----------|---------|
| @ | %40 |
| # | %23 |
| $ | %24 |
| % | %25 |
| & | %26 |

**Example:**
-Password: `quickcart@786`  
- Encoded: `quickcart%40786`

**Full connection string:**
```
postgresql://postgres.ycwtmuclynitqursbyxd:quickcart%40786@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

---

## 📋 What to Do Next

### **Option 1: Get Connection String from Supabase** (Recommended)
Follow steps above to get the exact connection string from your dashboard.

### **Option 2: Use the Connection String Below**
If your password is still `quickcart@786`, use this:

```
postgresql://postgres.ycwtmuclynitqursbyxd:quickcart%40786@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

---

## 🚀 Update Render with the Connection String

1. Go to: https://dashboard.render.com
2. Click on **quickcart-api-a09g**
3. Go to **Environment** tab (left sidebar)
4. Find `DATABASE_URL`
5. Paste the complete connection string (with `?sslmode=require`)
6. Click **Save Changes**
7. Wait 2-3 minutes for redeploy

---

## ✅ Test After Update

```bash
# Test 1: Health check
curl https://quickcart-api-a09g.onrender.com/health

# Test 2: Categories API
curl https://quickcart-api-a09g.onrender.com/api/categories

# Test 3: Frontend
# Open: https://quickcart-two-drab.vercel.app
```

---

## 🔧 Troubleshooting

### If "Tenant or user not found" error:
1. **Check password** - Get the correct password from Supabase dashboard
2. **Reset password** - In Supabase → Settings → Database → Reset database password
3. **Check project ID** - Make sure it's `ycwtmuclynitqursbyxd`
4. **Check region** - Make sure it's `aws-0-ap-south-1`

### If still not working:
1. Try direct connection (port 5432 instead of 6543):
   ```
   postgresql://postgres.ycwtmuclynitqursbyxd:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
   ```

2. Check if project is paused in Supabase dashboard

3. Verify the connection works in Supabase SQL Editor first

---

## 🎯 Expected Result

Once fixed, your backend /health endpoint should show:
```json
{
  "database": "connected",
  "message": "QuickCart Backend API is running",
  "success": true
}
```

And your frontend will load all data correctly! 🎉
