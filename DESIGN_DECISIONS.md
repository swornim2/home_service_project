# Design Decisions

## Decision 1: JWT Token Authentication

**Design Issue**: User authentication and session management  
**Context**: Multi-page React application with FastAPI backend requiring stateless authentication  
**Quality Attributes**: Security, Scalability, Performance  
**Solution**: JWT (JSON Web Tokens) with Bearer authentication  
**Description**:  
- Backend issues JWT tokens on successful login (24-hour expiry)
- Frontend stores token in localStorage
- Axios interceptor automatically attaches token to requests
- Backend validates token on protected endpoints using FastAPI HTTPBearer

**Rationale**:  
- **Stateless**: No server-side session storage needed (scalable to multiple servers)
- **Performance**: Reduces database lookups (user info encoded in token)
- **Security**: Tokens signed with secret key, short expiry limits exposure
- **Standard**: Widely adopted, libraries available (python-jose)

**Pattern**: Token-Based Authentication  
**Alternative Considered**: Session-based cookies (rejected due to stateful nature, CORS complexity)

---

## Decision 2: Fernet (AES-256) Symmetric Encryption

**Design Issue**: Protecting sensitive personal data at rest (credit cards)  
**Context**: Database stores encrypted PII, backend needs to decrypt for processing  
**Quality Attributes**: Security (Confidentiality), Compliance, Performance  
**Solution**: Cryptography.Fernet symmetric encryption  
**Description**:  
- Credit card numbers encrypted before MongoDB storage
- Encryption key stored in environment variable (.env)
- Fernet provides authenticated encryption (AES-128-CBC + HMAC)
- Backend decrypts only when necessary (e.g., payment processing)

**Rationale**:  
- **Symmetric Speed**: Faster than asymmetric for bulk data
- **Authenticated**: HMAC prevents tampering, ensures integrity
- **Simple API**: High-level interface reduces implementation errors
- **PCI-DSS**: Meets payment card data protection requirements

**Pattern**: Data Encryption at Rest  
**Alternative Considered**: Asymmetric RSA (rejected: slower, overkill for single-server architecture)

---

## Decision 3: Optional Fields with Consent Dialogs

**Design Issue**: Balancing functionality with privacy minimization  
**Context**: Some features benefit from extra data (vaccination status for eligibility) but privacy-first design discourages collection  
**Quality Attributes**: Privacy, User Control, Compliance  
**Solution**: Make sensitive fields optional with explicit consent popups  
**Description**:  
- Age, mobile, vaccination status, credit card are Optional<T> in Pydantic models
- UI shows consent dialog explaining data usage before collection
- Users can skip optional fields without losing core functionality
- Consent flags stored in database (consent_vax, consent_data)

**Rationale**:  
- **GDPR Article 7**: Consent must be freely given, specific, informed
- **Privacy by Design**: Data minimization principle (collect only what's needed)
- **User Trust**: Transparency builds confidence in platform
- **Flexibility**: Users choose privacy/functionality trade-off

**Pattern**: Privacy-by-Design Data Minimization  
**Alternative Considered**: Make all fields mandatory (rejected: violates privacy principles, decreases registrations)

---

## Decision 4: Role-Based Access Control (RBAC)

**Design Issue**: Different user types need different permissions  
**Context**: Clients request services, admins approve/decline, providers (future) deliver services  
**Quality Attributes**: Security (Authorization), Maintainability, Scalability  
**Solution**: Role-based access control with enum roles  
**Description**:  
- User.role field: "client" | "provider" | "admin"
- FastAPI dependency injection validates roles (get_admin_user)
- Frontend routes protected by role checks (React Router guards)
- Admin endpoints (/admin/bookings) require admin role

**Rationale**:  
- **Principle of Least Privilege**: Users access only necessary resources
- **Scalability**: Easy to add new roles (e.g., "super_admin", "auditor")
- **Centralized**: Role checks in dependency functions (DRY)
- **Security**: Prevents horizontal/vertical privilege escalation

**Pattern**: Role-Based Access Control (RBAC)  
**Alternative Considered**: Attribute-Based Access Control (rejected: overkill for current scale, complex policy management)

---

## Decision 5: Virtual-First Service Model

**Design Issue**: Provide home services during COVID-19 restrictions  
**Context**: South Australia lockdowns/restrictions limit in-person contact  
**Quality Attributes**: Safety, Availability, Innovation  
**Solution**: Prioritize virtual/remote services with is_online flag  
**Description**:  
- All default services are virtual (video call-based)
- Services model has is_online boolean (true = virtual, false = in-person)
- COVID restriction API (mock) influences service suggestions
- Dashboard alerts users to current restriction levels
- Booking system stores covid_restrictions level at request time

**Rationale**:  
- **Public Health**: Reduces COVID transmission risk
- **Availability**: Services continue during lockdowns
- **Innovation**: Video inspections/consultations are novel
- **Context-Aware**: System adapts recommendations to current conditions

**Pattern**: Context-Aware Computing  
**Alternative Considered**: In-person only (rejected: unsafe during restrictions, unavailable during lockdowns)

---

## Decision 6: SMTP2GO for Email Delivery

**Design Issue**: Send booking confirmations and status updates to users  
**Context**: Backend needs reliable email delivery without managing SMTP server  
**Quality Attributes**: Reliability, Security, Maintainability  
**Solution**: SMTP2GO third-party email service with TLS  
**Description**:  
- aiosmtplib async library for non-blocking email sends
- SMTP2GO API key authentication (stored in .env)
- TLS encryption for email transmission (start_tls=True)
- HTML email templates for rich formatting
- Fallback to mock mode if SMTP not configured (logs instead)

**Rationale**:  
- **Deliverability**: SMTP2GO handles spam filters, reputation
- **Security**: TLS prevents email interception
- **Reliability**: SLA-backed uptime, retry logic
- **Developer Experience**: No server maintenance, simple API

**Pattern**: Brokered Service Integration  
**Alternative Considered**: SendGrid (similar), Self-hosted SMTP (rejected: maintenance burden, deliverability issues)

---

## Decision 7: React with Shadcn/UI Component Library

**Design Issue**: Build modern, accessible, privacy-focused frontend quickly  
**Context**: Academic project timeline, need professional UI/UX  
**Quality Attributes**: Usability, Accessibility, Development Speed  
**Solution**: React 19 + Tailwind CSS + Shadcn/UI components  
**Description**:  
- React for component-based UI (reusable, maintainable)
- Tailwind CSS for utility-first styling (rapid iteration)
- Shadcn/UI for pre-built accessible components (Button, Dialog, Card)
- Sonner for toast notifications (user feedback)
- Lucide React for consistent iconography

**Rationale**:  
- **Accessibility**: Shadcn/UI built on Radix primitives (ARIA, keyboard nav)
- **Consistency**: Unified design system across all pages
- **Speed**: Pre-built components reduce development time
- **Modern**: Hooks API, React Router v7, latest best practices

**Pattern**: Component-Based Architecture  
**Alternative Considered**: Vanilla HTML/CSS (rejected: slow, less maintainable), Vue (rejected: team familiarity with React)

---

## Decision 8: MongoDB with Motor (Async Driver)

**Design Issue**: Database for flexible user profiles and booking data  
**Context**: FastAPI async framework, schema may evolve, document-oriented data  
**Quality Attributes**: Performance, Flexibility, Developer Experience  
**Solution**: MongoDB with Motor async driver  
**Description**:  
- Motor provides async/await API for MongoDB (non-blocking I/O)
- Document model fits user/booking data (optional fields, nested objects)
- No migrations needed for schema changes (schemaless)
- Pydantic models validate data before DB insertion

**Rationale**:  
- **Async**: Non-blocking queries scale with FastAPI async endpoints
- **Flexibility**: Easy to add fields without migrations (privacy-friendly)
- **JSON-native**: Documents map directly to Python dicts, Pydantic models
- **Performance**: Horizontal scaling with sharding (future-proof)

**Pattern**: NoSQL Document Store  
**Alternative Considered**: PostgreSQL with SQLAlchemy (rejected: rigid schema, sync overhead, migration complexity)

---

## Summary Table

| Decision | Pattern | Quality Attributes |
|----------|---------|--------------------|
| JWT Authentication | Token-Based Auth | Security, Scalability |
| Fernet Encryption | Data Encryption at Rest | Confidentiality, Compliance |
| Optional Fields + Consent | Privacy by Design | Privacy, User Control |
| Role-Based Access Control | RBAC | Security, Maintainability |
| Virtual-First Services | Context-Aware Computing | Safety, Innovation |
| SMTP2GO Email | Brokered Service | Reliability, Security |
| React + Shadcn/UI | Component Architecture | Usability, Accessibility |
| MongoDB + Motor | NoSQL Document Store | Performance, Flexibility |

---

## Trade-offs & Future Improvements

**Current Limitations**:  
- Mock COVID API (not real-time SA Government data)
- Simple role system (could expand to permissions-based)
- localStorage for tokens (vulnerable to XSS, consider httpOnly cookies)
- No rate limiting (should add express-rate-limit equivalent)

**Planned Enhancements**:  
- Real video call integration (WebRTC, Zoom API)
- Payment processing (Stripe with PCI-compliant tokenization)
- Advanced search/filtering (Elasticsearch)
- Mobile app (React Native with same backend)
- Audit logs for compliance (immutable log trail)