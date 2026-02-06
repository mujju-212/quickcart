# Email Authentication API Documentation

## Overview
QuickCart now supports **email-based authentication** in addition to phone-based authentication using **MailerSend API**.

## Configuration

### Environment Variables
```env
MAILERSEND_API_KEY=mlsn.f0621451e79ca0b77e9588684da056854649d329922a3868367d8d412adb36cb
MAILERSEND_DOMAIN=test-y7zpl98xj1545vx6.mlsender.net
```

## New API Endpoints

### 1. Send Email OTP
**Endpoint:** `POST /auth/send-email-otp`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "provider": "mailersend",
  "remaining_attempts": 9
}
```

**Development Mode Response:**
```json
{
  "success": true,
  "message": "Development Mode: OTP is 123456",
  "provider": "development",
  "development_mode": true,
  "otp": "123456",
  "remaining_attempts": 9
}
```

**Error Responses:**
- `400` - Invalid email format
- `429` - Rate limit exceeded (max 10 OTP requests per day per email)
- `500` - Internal server error

---

### 2. Verify Email OTP
**Endpoint:** `POST /auth/verify-email-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Existing User Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "customer",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": false,
  "loginMethod": "email"
}
```

**New User Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": null,
  "token": null,
  "isNewUser": true,
  "email": "user@example.com",
  "loginMethod": "email"
}
```

**Error Responses:**
- `400` - Invalid email, OTP, or OTP expired/incorrect
- `500` - Internal server error

---

### 3. Complete Profile (Email)
**Endpoint:** `POST /auth/complete-profile-email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "9876543210"  // Optional
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Profile created successfully",
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "customer",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "loginMethod": "email"
}
```

**Note:** A welcome email is automatically sent to the user after profile creation.

---

## Features

### 🔒 Security Features
- **Rate Limiting:** 10 OTP requests per email per day
- **OTP Expiration:** OTPs expire after 5 minutes
- **JWT Tokens:** Secure authentication tokens for session management
- **Email Validation:** Comprehensive email format validation

### 📧 Email Features
- **Beautiful HTML Emails:** Branded emails with gradient design
- **OTP Emails:** Secure verification codes with clear instructions
- **Welcome Emails:** Automated welcome emails for new users
- **Fallback Mode:** Development mode when email service is unavailable

### 🎨 Email Templates
The service includes professionally designed HTML email templates:
- **OTP Email:** Features large, easy-to-read verification codes
- **Security Warnings:** Clear instructions to never share codes
- **Welcome Email:** Engaging onboarding experience

---

## Email Service Architecture

### MailerSend Integration
- **API Client:** `MailerSendClient` from official Python SDK
- **Email Builder:** `EmailBuilder` for constructing emails
- **Domain:** `info@test-y7zpl98xj1545vx6.mlsender.net`
- **Sender Name:** QuickCart

### Fallback Mechanism
When MailerSend is unavailable:
1. Service automatically falls back to **development mode**
2. OTP is displayed in console logs
3. API returns `provider: "development"` with OTP in response (dev only)
4. Application continues to function for local testing

---

## Usage Examples

### Frontend Integration

#### Send Email OTP
```javascript
const sendEmailOTP = async (email) => {
  const response = await fetch('/auth/send-email-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return await response.json();
};
```

#### Verify Email OTP
```javascript
const verifyEmailOTP = async (email, otp) => {
  const response = await fetch('/auth/verify-email-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await response.json();
  
  if (data.isNewUser) {
    // Redirect to profile completion
    return { needsProfile: true, email: data.email };
  } else {
    // Login successful, store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { success: true, user: data.user };
  }
};
```

#### Complete Profile
```javascript
const completeProfileEmail = async (email, name, phone) => {
  const response = await fetch('/auth/complete-profile-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, phone })
  });
  const data = await response.json();
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};
```

---

## Testing

### Test Email Service
```python
from services.email_service import EmailService

email_service = EmailService()
result = email_service.send_otp_email('test@example.com')
print(result)
```

### Test API Endpoints
```bash
# Send OTP
curl -X POST http://localhost:5001/auth/send-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Verify OTP
curl -X POST http://localhost:5001/auth/verify-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'
```

---

## Migration from Phone to Email

Users can now login using **either phone or email**:
- Phone login: Uses SMS (Twilio/Fast2SMS)
- Email login: Uses MailerSend

Both methods:
- ✅ Generate 6-digit OTP codes
- ✅ Support rate limiting
- ✅ Return JWT tokens
- ✅ Work with existing user database
- ✅ Have development mode fallback

---

## Production Checklist

Before deploying to production:
- [ ] Verify MailerSend domain is authenticated
- [ ] Update sender email if using custom domain
- [ ] Remove OTP from development mode responses
- [ ] Configure proper rate limits for your use case
- [ ] Test email deliverability
- [ ] Set up email monitoring and alerts
- [ ] Add email bounce/complaint handling
- [ ] Configure SPF, DKIM, DMARC records

---

## Troubleshooting

### Email Not Received
1. Check spam/junk folder
2. Verify MailerSend domain is verified
3. Check API key is valid
4. Review MailerSend dashboard for errors

### Development Mode Always Active
1. Check `MAILERSEND_API_KEY` environment variable
2. Verify internet connectivity
3. Check API key permissions in MailerSend dashboard

### Rate Limit Issues
- Rate limits reset daily at midnight
- Adjust limits in `RateLimiter.check_otp_rate_limit()` if needed
- Current limit: 10 OTP per email per day

---

## Dependencies

```
mailersend==2.0.0
twilio==8.2.0
```

Install with:
```bash
pip install mailersend twilio
```
