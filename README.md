# HomeBound Care - Privacy-by-Design Home Services Platform

**University of Adelaide - COMP SCI 7412/7612 - Secure Software Engineering Project 2025**

A full-stack web application enabling users to request safe, primarily remote/virtual home services during COVID-19 restrictions. Built with privacy-by-design principles, implementing data minimization, encryption, and user consent mechanisms.

---

## 🎯 Project Overview

### Purpose

This platform addresses the need for home services (inspections, consultations, renovations) during COVID-19 restrictions in South Australia, prioritizing:

- **Virtual/Remote Services**: Video-based inspections and consultations to minimize physical contact
- **Privacy Protection**: End-to-end encryption, data minimization, explicit consent
- **COVID Awareness**: Real-time restriction monitoring and safe service recommendations

### Key Features

1. **User Registration/Login** - JWT authentication with bcrypt password hashing
2. **Service Discovery** - Browse virtual and in-person home services
3. **Booking System** - Request services with admin approval workflow
4. **COVID Restrictions** - Mock SA government restriction level notifications
5. **Privacy Controls** - User data deletion, optional sensitive fields, encryption

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI components
- **Backend**: FastAPI (Python) + Motor (async MongoDB)
- **Database**: MongoDB
- **Security**: JWT tokens, bcrypt, AES-256 encryption (Fernet)
- **Email**: SMTP2GO for booking confirmations

### Privacy-by-Design Implementation

- ✅ Data minimization (optional fields remain optional)
- ✅ Encryption at rest (credit cards encrypted with Fernet)
- ✅ Consent popups for sensitive data (vaccination status)
- ✅ User data deletion endpoint
- ✅ No tracking without consent
- ✅ Clear privacy notices throughout UI

---

## 📦 Installation & Setup

### Prerequisites

- Python 3.11+
- Node.js 18+ and Yarn
- MongoDB 5.0+

### Backend Setup

```bash
cd /app/backend

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your values:
# - MONGO_URL: MongoDB connection string
# - JWT_SECRET: Secret key for JWT tokens
# - ENCRYPTION_KEY: Fernet key for data encryption (generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
# - SMTP_API_KEY: SMTP2GO API key for emails

# Start backend server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

```bash
cd /app/frontend

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Edit .env:
# - REACT_APP_BACKEND_URL: Backend API URL

# Start frontend server
yarn start
```

### MongoDB Setup

```bash
# Start MongoDB (if not running)
mongod --dbpath /data/db

# The application will automatically create:
# - Database: homeservices_db
# - Collections: users, bookings, services
```

---

## 🔐 Security Features

### Authentication

- **JWT Tokens**: 24-hour expiry, Bearer token authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: Client, Provider, Admin roles

### Data Protection

- **Encryption**: Credit card data encrypted with Fernet (AES-256)
- **Input Validation**: Pydantic models prevent injection attacks
- **CORS Configuration**: Controlled cross-origin requests
- **HTTPS**: All production traffic over TLS

### Privacy Compliance

- **GDPR-inspired**: Right to deletion, data portability
- **Consent Management**: Explicit opt-in for sensitive data
- **Minimal Collection**: Only necessary fields required
- **Transparency**: Clear privacy notices on all forms

---

## 🚀 Usage Guide

### User Roles

#### 1. Client (Regular User)

- Register with email/password
- Browse available services
- Submit booking requests
- View booking status
- Receive email confirmations

#### 2. Admin

- View all booking requests
- Accept/decline bookings
- Send notes to customers
- Monitor system activity

**Default Admin Account** (create manually in MongoDB):

```json
{
  "email": "admin@homeservices.com",
  "password": "<bcrypt_hash>",
  "role": "admin",
  "name": "Admin User"
}
```

### Workflow Example

1. **User Registration**

   - Navigate to `/register`
   - Fill required fields (name, email, password)
   - Optionally provide vaccination status (with consent popup)
   - Optionally provide encrypted credit card
   - Receive welcome email

2. **Browse Services**

   - View available virtual services
   - See COVID restriction alerts
   - Get AI-suggested services based on profile

3. **Request Service**

   - Select service from catalog
   - Choose preferred date and duration
   - Add details/requirements
   - Submit request
   - Receive email confirmation

4. **Admin Review**
   - Admin logs in
   - Views pending requests
   - Accepts/declines with notes
   - User receives notification email

---

## 🧪 API Endpoints

### Authentication

```
POST /api/auth/register - Register new user
POST /api/auth/login - Login and get JWT token
GET /api/auth/me - Get current user (requires auth)
```

### Services

```
GET /api/services - List all services
GET /api/services/suggestions - Get personalized suggestions (auth)
```

### Bookings

```
POST /api/bookings - Create booking request (auth)
GET /api/bookings - Get user's bookings (auth)
GET /api/admin/bookings - Get all bookings (admin)
PUT /api/admin/bookings/:id - Accept/decline booking (admin)
```

### COVID Data

```
GET /api/covid/restrictions - Get current restriction levels (mock)
```

### Privacy

```
DELETE /api/user/delete - Permanently delete user and all data (auth)
```

---

## 🔍 COVID-19 Integration

### Restriction Monitoring

The platform monitors (mock) South Australian COVID-19 restriction levels:

- **Low**: Normal operations, in-person services available
- **Medium**: Virtual services recommended, masks required
- **High**: Virtual-only services, in-person restricted

### Safety Features

- Real-time restriction level display on dashboard
- Service suggestions prioritize virtual options during high restrictions
- Vaccination status (optional) influences service eligibility
- Clear safety protocols for in-person visits

---

## 📊 Database Schema

### Users Collection

```javascript
{
  id: String (UUID),
  email: String (unique),
  name: String,
  password: String (bcrypt hash),
  role: String (client|provider|admin),
  age: Number (optional),
  mobile: String (optional),
  citizenship: String (optional),
  language: String,
  trade: String (for providers),
  vax_status: Boolean (optional, consent required),
  credit_card_encrypted: String (Fernet encrypted, optional),
  consent_vax: Boolean,
  consent_data: Boolean,
  created_at: ISO Date String
}
```

### Bookings Collection

```javascript
{
  id: String (UUID),
  user_id: String,
  user_name: String,
  user_email: String,
  service_id: String,
  service_type: String,
  preferred_date: ISO Date String,
  duration: Number (minutes),
  details: String,
  status: String (pending|accepted|declined),
  covid_restrictions: String (level),
  cost: Number,
  created_at: ISO Date String
}
```

### Services Collection

```javascript
{
  id: String (UUID),
  name: String,
  description: String,
  price: Number,
  service_type: String,
  is_online: Boolean,
  photos: Array<String>,
  provider_id: String (optional),
  created_at: ISO Date String
}
```

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on mobile, tablet, desktop
- **Modern Components**: Shadcn/UI with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation
- **Privacy-First UI**: Clear notices, consent dialogs, data control
- **COVID Awareness**: Alert banners, restriction indicators

---

## 🧩 Third-Party Libraries

### Backend

- `fastapi` - Web framework
- `motor` - Async MongoDB driver
- `pydantic` - Data validation
- `python-jose` - JWT handling
- `passlib` + `bcrypt` - Password hashing
- `cryptography` - Data encryption (Fernet)
- `aiosmtplib` - Email sending

### Frontend

- `react` + `react-router-dom` - UI framework & routing
- `axios` - HTTP client
- `tailwindcss` - Styling
- `shadcn/ui` - Component library
- `sonner` - Toast notifications
- `lucide-react` - Icons

---

## 📝 Testing

### Manual Testing

1. Register as client and admin users
2. Browse services and submit booking
3. Admin accepts/declines booking
4. Verify email notifications (check logs if SMTP not configured)
5. Test data deletion from user dashboard
6. Verify COVID restriction alerts display

---

## 🚧 Future Enhancements

- Real-time COVID API integration (SA Government)
- Video call integration for virtual inspections
- Payment processing (Stripe)
- Service provider profiles and ratings
- Advanced search and filtering
- Push notifications
- Mobile app (React Native)

---

## 📚 Project Requirements (Met)

### Security Requirements (5+)

1. ✅ **R01**: Secure user authentication with JWT and bcrypt
2. ✅ **R02**: Encrypted storage of sensitive data (credit cards)
3. ✅ **R03**: Privacy-by-design data minimization
4. ✅ **R04**: User consent management for optional fields
5. ✅ **R05**: Right to deletion (GDPR compliance)

### Design Decisions (5+)

1. ✅ JWT token authentication (stateless, scalable)
2. ✅ Fernet encryption for PII (symmetric, fast)
3. ✅ Optional fields pattern (privacy-first)
4. ✅ Role-based access control (security)
5. ✅ Virtual-first service model (COVID safety)

---

## 👥 Team & Contributions

**Individual Contribution**: Full-stack development including:

- Backend API design and implementation
- Frontend UI/UX design and development
- Database schema design
- Security and privacy features
- Documentation and testing

**Focus Areas**:

- Privacy-by-design implementation
- COVID-19 safety integration
- User experience optimization

---

## 📄 License

Academic project for University of Adelaide - COMP SCI 7412/7612

---

## 📞 Support

For issues or questions:

- Review documentation in `/docs` folder
- Check API logs in `/var/log/supervisor/`
- Review browser console for frontend errors

---

**Built with privacy, security, and user safety as top priorities.**# home_service_project

# home_service_project
