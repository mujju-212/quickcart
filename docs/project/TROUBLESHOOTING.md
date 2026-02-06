# Troubleshooting Guide

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Target Audience:** Users, Developers, Support Team  
**Related Documents:** [DEV_01_QUICK_START.md](DEV_01_QUICK_START.md)

---

## Table of Contents

1. [User Issues](#user-issues)
2. [Developer Issues](#developer-issues)
3. [Admin Issues](#admin-issues)
4. [Common Error Messages](#common-error-messages)
5. [Performance Issues](#performance-issues)
6. [Getting Support](#getting-support)

---

## User Issues

### Authentication & Login

**❌ Cannot receive OTP**

**Causes:**
- Invalid phone number
- SMS service issues
- Rate limit reached (20 OTP/day)

**Solutions:**
- ✅ Verify phone number format (10 digits, starts with 6-9)
- ✅ Check SMS inbox and spam
- ✅ Wait 5 minutes and request new OTP
- ✅ Try different phone number if blocked
- ✅ Contact support if persistent

**❌ OTP expired**

**Cause:** OTP valid for 5 minutes only

**Solution:**
- ✅ Request new OTP
- ✅ Enter quickly after receiving

**❌ "Logged out unexpectedly"**

**Causes:**
- Token expired (7 days)
- Cleared browser data
- Different device login

**Solutions:**
- ✅ Login again with OTP
- ✅ Check "Keep me logged in" (future feature)
- ✅ Don't clear browser cookies frequently

---

### Shopping & Cart

**❌ Cannot add item to cart**

**Causes:**
- Product out of stock
- Network issue
- Session expired

**Solutions:**
- ✅ Check product stock status
- ✅ Refresh page
- ✅ Login again if needed
- ✅ Try different browser

**❌ Cart empty after login**

**Cause:** Guest cart not transferred

**Solutions:**
- ✅ Check if items still in stock
- ✅ Cart may have expired (guest carts temporary)
- ✅ Add items again

**❌ Cart total incorrect**

**Causes:**
- Price updated
- Coupon not applied
- Delivery fee miscalculation

**Solutions:**
- ✅ Refresh page for latest prices
- ✅ Verify coupon applied correctly
- ✅ Check delivery fee threshold (₹99 for free)

---

### Checkout & Orders

**❌ Cannot proceed to checkout**

**Causes:**
- Not logged in
- No items in cart
- Out of stock items
- Delivery location not serviceable

**Solutions:**
- ✅ Login first
- ✅ Add items to cart
- ✅ Remove out-of-stock items
- ✅ Check delivery area

**❌ Payment failed**

**For UPI:**
- ✅ Check UPI ID spelling
- ✅ Verify sufficient balance
- ✅ Approve in UPI app within time limit

**For Card:**
- ✅ Verify card details (number, CVV, expiry)
- ✅ Complete 3D Secure authentication
- ✅ Check if card enabled for online payments
- ✅ Contact bank if declined

**❌ Order not received/confirmed**

**Solutions:**
- ✅ Check email (including spam)
- ✅ Check SMS inbox
- ✅ Look in "My Orders"
- ✅ Wait 5 minutes for processing
- ✅ Contact support with order ID

---

### Account & Profile

**❌ Cannot update profile**

**Causes:**
- Invalid data format
- Network error
- Session expired

**Solutions:**
- ✅ Check field validation:
  - Name: Letters only, 2-50 chars
  - Email: Valid format
  - Phone: Cannot change (contact support)
- ✅ Refresh and try again
- ✅ Clear browser cache

**❌ Address not saving**

**Solutions:**
- ✅ Fill all required fields (*)
- ✅ Phone: 10 digits exactly
- ✅ Pincode: 6 digits
- ✅ Name: Letters and spaces only
- ✅ Reduce address text length if too long

---

## Developer Issues

### Setup Issues

**❌ Backend won't start**

```bash
Error: Unable to connect to database
```

**Solutions:**
```bash
# 1. Check PostgreSQL running
sudo service postgresql status
sudo service postgresql start  # if stopped

# 2. Verify database exists
psql -l | grep quickcart_db

# 3. Create if missing
createdb quickcart_db
psql quickcart_db < database/schema.sql

# 4. Check .env file
DATABASE_URL=postgresql://user:pass@localhost/quickcart_db
```

**❌ Frontend errors on npm start**

```bash
Error: Cannot find module 'react'
```

**Solutions:**
```bash
# 1. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Clear cache
npm cache clean --force

# 3. Check Node version
node --version  # Should be 16+

# 4. Try different port
PORT=3001 npm start
```

**❌ Port already in use**

```bash
Error: Port 5000 already in use
```

**Solutions:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9  # Unix
netstat -ano | findstr :5000   # Windows

# Or use different port
flask run --port 5001
```

---

### Database Issues

**❌ Migration failed**

**Solutions:**
```bash
# 1. Check current state
psql quickcart_db -c "\dt"

# 2. Drop and recreate (DEV ONLY!)
dropdb quickcart_db
createdb quickcart_db
psql quickcart_db < database/schema.sql

# 3. Check SQL syntax
psql quickcart_db -f database/schema.sql
```

**❌ Foreign key constraint violation**

```sql
ERROR: insert or update on table violates foreign key constraint
```

**Solutions:**
- ✅ Ensure referenced record exists
- ✅ Check cascade rules
- ✅ Verify data types match
- ✅ Use transactions for complex inserts

---

### API Issues

**❌ 401 Unauthorized**

**Causes:**
- Missing/invalid token
- Token expired
- Wrong authentication header

**Solutions:**
```javascript
// 1. Check token in request
headers: {
  'Authorization': `Bearer ${token}`
}

// 2. Verify token not expired
const decoded = jwt.decode(token);
console.log('Expires:', new Date(decoded.exp * 1000));

// 3. Get new token
await login(phone, otp);
```

**❌ 500 Internal Server Error**

**Debug Steps:**
```python
# 1. Check backend logs
tail -f backend/app.log

# 2. Enable debug mode
export FLASK_ENV=development
flask run --debug

# 3. Add logging
import logging
logger.error(f"Error: {str(e)}")
```

---

### Frontend Issues

**❌ Component not rendering**

**Debug Steps:**
```javascript
// 1. Check console for errors
console.log('Props:', props);

// 2. Verify data format
console.log('Data:', JSON.stringify(data, null, 2));

// 3. Check conditional rendering
{data && data.length > 0 ? (
  <Component data={data} />
) : (
  <p>No data</p>
)}
```

**❌ State not updating**

**Common Mistakes:**
```javascript
// ❌ Direct mutation
state.push(newItem);  // Wrong!

// ✅ Create new array
setState([...state, newItem]);  // Correct

// ❌ Async state access
setState(newValue);
console.log(state);  // Still old value!

// ✅ Use useEffect
useEffect(() => {
  console.log(state);  // New value
}, [state]);
```

---

## Admin Issues

**❌ Cannot access admin panel**

**Solutions:**
- ✅ Verify admin account:
  ```sql
  SELECT * FROM users WHERE is_admin = true;
  ```
- ✅ Check email/password (not phone)
- ✅ Clear browser cache
- ✅ Check admin routes enabled

**❌ Orders not showing**

**Solutions:**
- ✅ Check date filter
- ✅ Verify database connection
- ✅ Check order status filter
- ✅ Refresh page

**❌ Cannot update product**

**Solutions:**
- ✅ Check image file size (<5MB)
- ✅ Verify all required fields filled
- ✅ Check stock value (must be ≥0)
- ✅ Ensure product ID exists

---

## Common Error Messages

### Backend Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| `400 Bad Request` | Invalid input data | Check request format |
| `401 Unauthorized` | No/invalid token | Login again |
| `403 Forbidden` | Insufficient permissions | Check user role |
| `404 Not Found` | Resource doesn't exist | Verify ID/URL |
| `409 Conflict` | Duplicate entry | Check unique constraints |
| `422 Unprocessable` | Validation failed | Check field formats |
| `429 Too Many Requests` | Rate limit hit | Wait and retry |
| `500 Internal Error` | Server error | Check logs |

### Frontend Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| `Cannot read property of undefined` | Accessing null/undefined | Add null checks |
| `Maximum update depth exceeded` | Infinite loop | Check useEffect dependencies |
| `Objects are not valid as React child` | Rendering object | Render specific properties |
| `Warning: Each child should have unique key` | Missing key prop | Add key={item.id} |

---

## Performance Issues

**❌ Slow page load**

**Solutions:**
- ✅ Check network speed
- ✅ Clear browser cache
- ✅ Disable browser extensions
- ✅ Use production build (npm run build)
- ✅ Enable compression (gzip)

**❌ High database query time**

**Debug:**
```sql
-- 1. Explain query
EXPLAIN ANALYZE SELECT * FROM products WHERE category = 'Fruits';

-- 2. Check missing indexes
SELECT * FROM pg_stat_user_tables WHERE schemaname='public';

-- 3. Add indexes
CREATE INDEX idx_products_category ON products(category);
```

**❌ Memory leak**

**Solutions:**
```javascript
// 1. Cleanup in useEffect
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  
  return () => clearInterval(timer);  // Cleanup!
}, []);

// 2. Cancel API requests
useEffect(() => {
  const controller = new AbortController();
  
  fetch(url, { signal: controller.signal });
  
  return () => controller.abort();
}, []);
```

---

## Getting Support

### Self-Service

**Documentation:**
- 📚 Check relevant docs in `docs/project/`
- 🔍 Search for error message
- 💡 Review code examples

**Community:**
- GitHub Issues
- Stack Overflow
- Dev forums

### Contact Support

**For Users:**
- 📧 Email: support@quickcart.com
- 📞 Phone: 1800-123-4567 (10 AM - 6 PM)
- 💬 Live Chat: Available on website
- ⏱️ Response time: Within 24 hours

**For Developers:**
- 📧 Email: dev-team@quickcart.com
- 💬 Slack/Discord: [Link]
- 📝 GitHub Issues: [Repository]

### Bug Reports

**Include:**
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/logs
5. Environment:
   - Browser/OS version
   - Node/Python version
   - Database version

**Template:**
```markdown
## Bug Description
Brief summary

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows 11
- Browser: Chrome 120
- Node: 16.14.0

## Logs
```
Error message here
```

## Screenshots
[Attach image]
```

---

## Quick Reference

**Common Commands:**
```bash
# Backend
cd backend
python app.py
flask run --debug
pytest

# Frontend
npm start
npm test
npm run build

# Database
createdb quickcart_db
psql quickcart_db < database/schema.sql
psql quickcart_db

# Git
git status
git add .
git commit -m "message"
git push
```

**Environment Variables:**
```bash
# Backend .env
DATABASE_URL=postgresql://...
SECRET_KEY=...
JWT_SECRET=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...

# Frontend .env
REACT_APP_API_URL=http://localhost:5000
```

---

**Related Documentation:**
- [DEV_01_QUICK_START.md](DEV_01_QUICK_START.md)
- [01_INSTALLATION_GUIDE.md](01_INSTALLATION_GUIDE.md)
- [BACKEND_04_ERROR_HANDLING.md](BACKEND_04_ERROR_HANDLING.md)
- [DEPLOYMENT_01_PRODUCTION_SETUP.md](DEPLOYMENT_01_PRODUCTION_SETUP.md)
