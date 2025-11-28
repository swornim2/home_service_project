# Email Configuration Guide

## Current Setup

### Service Provider
**SMTP2GO** - Reliable email delivery service

### Configuration Details

**Location:** `/app/backend/.env`

```env
SMTP_API_KEY="api-E7073E28D8E84108BD9D9B1BEF50CAF3"
SMTP_FROM_EMAIL="noreply@homeservices.com"
```

### Connection Settings

- **Host:** `mail.smtp2go.com`
- **Port:** `2525`
- **Security:** TLS (start_tls=True)
- **Username:** `homeservices`
- **Password:** API key from .env

---

## Email Templates & Use Cases

### 1. Registration/Verification Email
**Trigger:** User registers  
**Subject:** "Verify Your Email - HomeBound Care"  
**Contains:**
- Welcome message
- Verification link button
- Plain text link (fallback)
- Privacy statement

**Example:**
```html
<h2>Welcome John!</h2>
<p>Thank you for registering with HomeBound Care...</p>

```

---

### 2. Booking Confirmation Email
**Trigger:** User creates booking  
**Subject:** "Service Request Confirmation"  
**Contains:**
- Booking ID
- Service name
- Status (Pending Approval)
- COVID safety information

**Example:**
```html
<h2>Booking Confirmed</h2>
<p>Dear John,</p>
<p>Your request for Virtual Home Inspection has been received.</p>
<p>Booking ID: abc-123-xyz</p>
<p>Status: Pending Admin Approval</p>
<p><strong>COVID Safety:</strong> Current restrictions recommend remote services...</p>
```

---

### 3. Booking Acceptance Email (with QR Code)
**Trigger:** Admin accepts booking  
**Subject:** "Booking Accepted - HomeBound Care"  
**Contains:**
- Acceptance confirmation
- Booking details (date, duration, cost)
- **Embedded QR Code Image**
- Admin notes
- Service provider instructions

**QR Code Content:**
```
HomeBound Care Receipt
Booking ID: abc-123-xyz
Service: Virtual Home Inspection
Date: 2025-12-01
Duration: 60 min
Cost: $150
Status: CONFIRMED
Customer: John Doe
```

**Example:**
```html
<h2>Booking Accepted</h2>
<p>Dear John,</p>
<p>Your booking for <strong>Virtual Home Inspection</strong> has been accepted.</p>

<div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
    <p><strong>Booking Details:</strong></p>
    <p>📋 Booking ID: abc-123-xyz</p>
    <p>📅 Date: 2025-12-01</p>
    <p>⏱️ Duration: 60 minutes</p>
    <p>💰 Cost: $150</p>
</div>

<div style="text-align: center; margin: 20px 0;">
    <h3>Your Service Receipt QR Code:</h3>
    <img src="cid:qr_code" alt="Booking QR Code" 
         style="max-width: 300px; border: 2px solid #4F46E5; padding: 10px;"/>
    <p style="font-size: 12px; color: #666;">Show this QR code to your service provider</p>
</div>

<p>Admin Notes: Your booking is confirmed! We will contact you soon.</p>
```

---

### 4. Booking Decline Email
**Trigger:** Admin declines booking  
**Subject:** "Booking Update - HomeBound Care"  
**Contains:**
- Decline notification
- Booking details
- Admin notes/reason

---

### 5. Resend Verification Email
**Trigger:** User clicks "Resend Verification"  
**Subject:** "Verify Your Email - HomeBound Care"  
**Contains:**
- New verification link
- Instructions

---

## Testing Email Delivery

### Test Registration Email
```bash
 \\\
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "client",
    "language": "English",
    "consent_data": true
  }'
```

### Test Resend Verification
```bash
# First login to get token
TOKEN="your-jwt-token"
  -H "Authorization: Bearer $TOKEN"
```

---

## Email Logs

Email sending is logged in backend logs:

```bash
# View email activity
tail -f /var/log/supervisor/backend.out.log | grep -i email

# Check for email errors
tail -f /var/log/supervisor/backend.err.log | grep -i smtp
```

**Success Log Example:**
```
INFO - Email sent to user@example.com
```

**Mock Mode Log (when SMTP_API_KEY not set):**
```
INFO - Email mock - To: user@example.com, Subject: Welcome to Home Services
```

---

## Troubleshooting

### Emails Not Sending

1. **Check API Key**
   ```bash
   grep SMTP_API_KEY /app/backend/.env
   ```

2. **Verify Backend is Running**
   ```bash
   sudo supervisorctl status backend
   ```

3. **Check Backend Logs**
   ```bash
   tail -n 50 /var/log/supervisor/backend.err.log
   ```

4. **Test SMTP Connection**
   ```python
   # Python test
   import aiosmtplib
   import asyncio
   
   async def test():
       await aiosmtplib.send(
           message,
           hostname="mail.smtp2go.com",
           port=2525,
           username="homeservices",
           password="api-E7073E28D8E84108BD9D9B1BEF50CAF3",
           start_tls=True
       )
   
   asyncio.run(test())
   ```

### Common Issues

**Issue:** "Email mock" in logs  
**Solution:** SMTP_API_KEY is empty or invalid. Check `.env` file.

**Issue:** TLS connection failed  
**Solution:** Firewall blocking port 2525. Try port 587 or 465.

**Issue:** Authentication failed  
**Solution:** API key is incorrect. Get new key from SMTP2GO dashboard.

---

## Changing Email Provider

To use a different provider (SendGrid, Mailgun, Gmail):

### 1. Update .env
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USERNAME="apikey"
SMTP_API_KEY="your-sendgrid-api-key"
```

### 2. Update server.py
```python
await aiosmtplib.send(
    message,
    hostname=os.environ.get('SMTP_HOST', 'mail.smtp2go.com'),
    port=int(os.environ.get('SMTP_PORT', '2525')),
    username=os.environ.get('SMTP_USERNAME', 'homeservices'),
    password=SMTP_API_KEY,
    start_tls=True
)
```

### 3. Restart Backend
```bash
sudo supervisorctl restart backend
```

---

## Email Best Practices

✅ **Always use TLS** - Encrypt email transmission  
✅ **HTML + Plain Text** - Provide fallback for email clients  
✅ **Responsive Design** - Mobile-friendly email templates  
✅ **Clear Subject Lines** - Help users identify emails  
✅ **Unsubscribe Link** - For marketing emails (not implemented)  
✅ **Test Emails** - Send test emails before production  

---

## SMTP2GO Dashboard

To manage your SMTP2GO account:

1. Visit: https://www.smtp2go.com/
2. Login with your credentials
3. View email statistics
4. Generate new API keys
5. Configure sender domains
6. Monitor delivery rates

---

## Security Notes

🔒 **API Key Security:**
- Never commit API keys to Git
- Store in .env file only
- Rotate keys periodically
- Use environment-specific keys (dev/prod)

🔒 **Email Content:**
- Don't include sensitive data in plain text
- Use verification tokens (not passwords)
- QR codes are safe (contain booking info only)

---

**Last Updated:** November 2025  
**API Key Updated:** November 27, 2025  
**Current Key:** `api-E7073E28D8E84108BD9D9B1BEF50CAF3`
