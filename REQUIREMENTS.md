# Security & Privacy Requirements

## Requirement Specifications (5+)

### R01: Secure User Authentication
**ID**: R01  
**Name**: Secure Multi-Factor User Authentication  
**Description**: Users must register and login with email/password. System implements JWT token-based authentication with bcrypt password hashing for secure credential storage.  
**Rationale**: Prevents unauthorized access and protects user accounts. Aligns with OWASP authentication best practices.  
**Security Goals**: Authentication, Authorization, Accountability  
**Implementation**: FastAPI Security module, JWT tokens with 24-hour expiry, bcrypt with salt rounds

---

### R02: Encryption of Sensitive Personal Data
**ID**: R02  
**Name**: End-to-End Encryption for PII  
**Description**: Sensitive personally identifiable information (credit card numbers, vaccination status) must be encrypted at rest using AES-256 encryption (Fernet cipher).  
**Rationale**: Protects against data breaches and unauthorized database access. Compliant with PCI-DSS for payment data.  
**Security Goals**: Confidentiality, Data Protection  
**Implementation**: Cryptography.Fernet library, dedicated encryption key in environment variables

---

### R03: Privacy-by-Design Data Minimization
**ID**: R03  
**Name**: Minimal Data Collection with Optional Fields  
**Description**: Application collects only essential information for service delivery. Age, mobile, citizenship, vaccination status, and credit card are optional fields requiring explicit user consent.  
**Rationale**: Reduces privacy risk by limiting attack surface and unnecessary data exposure. Core principle of Privacy by Design.  
**Security Goals**: Privacy, Data Minimization, User Control  
**Implementation**: Pydantic models with Optional fields, consent checkboxes in UI

---

### R04: Explicit User Consent Management
**ID**: R04  
**Name**: Granular Consent for Sensitive Data Collection  
**Description**: Users must provide explicit opt-in consent before sharing sensitive information like vaccination status. Consent dialogs explain data usage, storage, and deletion rights.  
**Rationale**: Empowers users with control over personal data. Required by GDPR Article 7 and Australian Privacy Principles.  
**Security Goals**: Privacy, Transparency, User Control  
**Implementation**: AlertDialog consent popups, consent_vax and consent_data boolean flags in database

---

### R05: Right to Data Deletion (GDPR Compliance)
**ID**: R05  
**Name**: User-Initiated Complete Data Deletion  
**Description**: Users can permanently delete their account and all associated data (profile, bookings, encrypted PII) through dashboard controls with confirmation dialogs.  
**Rationale**: Fulfills GDPR "Right to be Forgotten" and provides user autonomy. Demonstrates accountability and data stewardship.  
**Security Goals**: Privacy, Compliance, User Control  
**Implementation**: DELETE /api/user/delete endpoint, cascading deletion of related data, confirmation UI flow

---

### R06: COVID-19 Restriction-Aware Service Recommendations
**ID**: R06  
**Name**: Dynamic Service Filtering Based on Health Restrictions  
**Description**: System monitors current COVID-19 restriction levels (mock SA Government data) and recommends virtual services during high-risk periods. Dashboard displays restriction alerts with safety guidance.  
**Rationale**: Protects public health by reducing unnecessary physical contact. Demonstrates context-aware security.  
**Security Goals**: Safety, Context Awareness, Risk Mitigation  
**Implementation**: Mock restriction API, frontend alert banners, logic-based service suggestions

---

### R07: Secure Email Communications
**ID**: R07  
**Name**: TLS-Encrypted Email Notifications  
**Description**: All booking confirmations and status updates sent via SMTP2GO with TLS encryption. Email templates avoid exposing sensitive data in plain text.  
**Rationale**: Prevents email interception and phishing attacks. Ensures secure customer communication.  
**Security Goals**: Confidentiality, Communication Security  
**Implementation**: aiosmtplib with start_tls=True, HTML email templates, no PII in subject lines

---

## Design Models

### Class Diagram (2 Requirements)

**R03: Data Minimization** and **R04: Consent Management** modeled below:

```
┌─────────────────────────────────────┐
│            User                     │
├─────────────────────────────────────┤
│ - id: String (UUID)                 │
│ - email: String (unique)            │
│ - password: String (hashed)         │
│ - name: String                      │
│ - role: String                      │
│ - age: Optional<Number>             │  ← Optional (R03)
│ - mobile: Optional<String>          │  ← Optional (R03)
│ - vax_status: Optional<Boolean>     │  ← Optional (R03)
│ - credit_card_encrypted: Optional   │  ← Optional + Encrypted (R02, R03)
│ - consent_vax: Boolean              │  ← Consent flag (R04)
│ - consent_data: Boolean             │  ← Consent flag (R04)
│ - created_at: DateTime              │
├─────────────────────────────────────┤
│ + register(data)                    │
│ + login(credentials)                │
│ + deleteAccount()                   │  ← R05: Deletion
│ + updateConsent(type, value)        │  ← R04: Consent
└─────────────────────────────────────┘
        │
        │ 1:N (creates)
        ▼
┌─────────────────────────────────────┐
│          Booking                    │
├─────────────────────────────────────┤
│ - id: String (UUID)                 │
│ - user_id: String                   │
│ - service_id: String                │
│ - preferred_date: DateTime          │
│ - status: String                    │
│ - covid_restrictions: String        │  ← R06: COVID-aware
│ - details: Optional<String>         │  ← Optional (R03)
├─────────────────────────────────────┤
│ + create(data)                      │
│ + updateStatus(status, notes)       │
│ + notifyUser()                      │  ← R07: Email
└─────────────────────────────────────┘
        │
        │ N:1 (references)
        ▼
┌─────────────────────────────────────┐
│          Service                    │
├─────────────────────────────────────┤
│ - id: String (UUID)                 │
│ - name: String                      │
│ - description: String               │
│ - price: Number                     │
│ - is_online: Boolean                │  ← R06: Virtual flag
├─────────────────────────────────────┤
│ + list()                            │
│ + getSuggestions(user, covid)       │  ← R06: Context-aware
└─────────────────────────────────────┘
```

**Relationships**:  
- User `1:N` Booking (One user creates many bookings)
- Booking `N:1` Service (Many bookings reference one service)

**Key Attributes for Privacy**:  
- Optional fields (age, mobile, vax_status, credit_card) demonstrate R03
- Consent flags (consent_vax, consent_data) implement R04
- Encrypted storage (credit_card_encrypted) fulfills R02

---

### Sequence Diagrams (2 Requirements)

#### Sequence 1: User Registration with Consent (R04)

```
Actor: User
Objects: RegistrationForm, ConsentDialog, AuthService, Database

User -> RegistrationForm: Fill basic info (email, password, name)
RegistrationForm -> User: Display form
User -> RegistrationForm: Click "Vaccination Status" checkbox
RegistrationForm -> ConsentDialog: Show consent popup
ConsentDialog -> User: Display consent terms (data usage, deletion rights)
User -> ConsentDialog: Click "Yes, I Consent"
ConsentDialog -> RegistrationForm: Set consent_vax=true
RegistrationForm -> AuthService: POST /auth/register (with consent flags)
AuthService -> AuthService: Hash password (bcrypt)
AuthService -> AuthService: Encrypt credit card (Fernet) if provided
AuthService -> Database: Insert user document
Database -> AuthService: Success
AuthService -> User: Return JWT token + user data
AuthService -> EmailService: Send welcome email (TLS)
```

**Key Security Points**:  
- Explicit consent dialog before collecting vaccination status
- Password hashing before storage
- Optional credit card encryption
- Secure email confirmation

---

#### Sequence 2: Booking Request with COVID Awareness (R06)

```
Actor: User, Admin
Objects: ServicesPage, COVIDService, BookingService, Database, EmailService

User -> ServicesPage: Navigate to /services
ServicesPage -> COVIDService: GET /covid/restrictions
COVIDService -> ServicesPage: Return {level: "medium", message: "Virtual recommended"}
ServicesPage -> User: Display services + COVID alert banner
User -> ServicesPage: Select "Virtual Home Inspection"
ServicesPage -> User: Show booking dialog (date, duration, details)
User -> ServicesPage: Submit booking form
ServicesPage -> BookingService: POST /bookings (with preferred_date, service_id)
BookingService -> COVIDService: Get current restriction level
COVIDService -> BookingService: Return "medium"
BookingService -> Database: Insert booking {status: "pending", covid_restrictions: "medium"}
Database -> BookingService: Success
BookingService -> EmailService: Send confirmation email to user
BookingService -> User: Return booking confirmation

Admin -> AdminDashboard: View pending bookings
AdminDashboard -> Database: GET /admin/bookings
Database -> AdminDashboard: Return all bookings
Admin -> AdminDashboard: Click "Accept" on booking
AdminDashboard -> BookingService: PUT /admin/bookings/:id {action: "accept", notes: "..."}
BookingService -> Database: Update {status: "accepted"}
BookingService -> EmailService: Send acceptance email to user
BookingService -> Admin: Return success
```

**Key Security Points**:  
- COVID restriction level checked at booking time
- Status stored with booking for audit trail
- Admin-only access to accept/decline endpoint
- Email notifications sent via TLS

---

## Privacy-by-Design Principles Applied

1. **Proactive not Reactive**: Encryption and consent built-in from start
2. **Privacy as Default**: Optional fields, minimal data collection
3. **Privacy Embedded**: Security features integrated, not add-ons
4. **Full Functionality**: Privacy doesn't compromise service quality
5. **End-to-End Security**: Protection from registration to deletion
6. **Visibility and Transparency**: Clear notices, consent dialogs
7. **Respect for User Privacy**: User control via deletion, consent management

---

## Security Testing Checklist

- [x] SQL/NoSQL injection prevention (Pydantic validation)
- [x] XSS prevention (React escaping, Content-Security-Policy)
- [x] CSRF protection (JWT tokens, CORS configuration)
- [x] Brute force protection (rate limiting recommended)
- [x] Sensitive data encryption (Fernet AES-256)
- [x] Password strength (bcrypt with salt)
- [x] HTTPS enforcement (production deployment)
- [x] Error handling (no stack traces to users)
- [x] Logging without PII (sanitized logs)
- [x] Dependency scanning (pip-audit, npm audit)