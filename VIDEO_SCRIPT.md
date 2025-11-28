# Video Demo Script (15 minutes)

**Target**: YouTube upload, 480p minimum, all team members participate

---

## 0:00-0:30 | Introduction (Overview)

**Speaker**: [Team Member 1]  
**On Screen**: Landing page, title slide

> "Welcome to HomeBound Care, a privacy-by-design home services platform built for COMP SCI 7412 Secure Software Engineering at the University of Adelaide.
>
> Our project addresses a critical need during COVID-19 restrictions: how do people access home services like inspections, consultations, and renovations without leaving home?
>
> Our solution prioritizes virtual services, implements privacy-by-design principles, and monitors COVID restriction levels to keep users safe."

**Visual**: Show landing page hero section, COVID alert banner

---

## 0:30-2:00 | Key Functionalities Overview (15%)

**Speaker**: [Team Member 2]  
**On Screen**: Dashboard, services page, admin panel

> "HomeBound Care offers three main user roles:
>
> 1. **Clients** can browse virtual home services, submit booking requests, and track their status.
>
> 2. **Admins** review all requests and accept or decline them with custom notes.
>
> 3. **Service Providers** (future) will deliver the virtual services.
>
> The platform features:
> - JWT authentication with bcrypt password hashing
> - End-to-end encrypted storage for credit cards using AES-256
> - COVID-19 restriction monitoring with service recommendations
> - Email confirmations via SMTP2GO for all bookings
> - Full user control with data deletion rights"

**Visual**: Click through dashboard → services → admin panel (show stats)

---

## 2:00-3:30 | Security & Privacy Issues (10%)

**Speaker**: [Team Member 3]  
**On Screen**: Presentation slides with research citations

> "Our research into contact tracing apps like COVIDSafe and BlueTrace revealed critical privacy concerns:
>
> 1. **Deanonymization**: Bluetooth-based tracking can be linked to individuals
> 2. **Surveillance**: China's color code system tracks movement and health status
> 3. **Data Breaches**: Centralized health databases are high-value targets
>
> Additionally, home service apps face:
> - Storing sensitive health information (vaccination status)
> - Payment data security (credit cards)
> - Location privacy (matching users to providers)
>
> These findings shaped our privacy-first approach."

**Visual**: Show research references, diagrams of privacy risks

---

## 3:30-5:00 | Privacy-by-Design Solutions (10%)

**Speaker**: [Team Member 1]  
**On Screen**: Code snippets, consent dialogs

> "We implemented seven privacy-by-design principles:
>
> 1. **Proactive**: Encryption and consent built-in from day one
> 2. **Privacy as Default**: Optional fields, minimal data collection
> 3. **Embedded**: Security features integrated, not bolted on
> 4. **Positive Sum**: Privacy doesn't compromise functionality
> 5. **End-to-End**: Protection from registration to deletion
> 6. **Transparency**: Clear notices, consent dialogs
> 7. **User Respect**: Full control via deletion rights
>
> Specific solutions:
> - Fernet symmetric encryption for credit cards
> - Explicit consent dialogs for vaccination status
> - Optional fields throughout registration
> - GDPR-compliant data deletion endpoint"

**Visual**: Show consent popup, encrypted data in database (obfuscated), deletion confirmation

---

## 5:00-7:15 | System Design & Architecture (15%)

**Speaker**: [Team Member 2]  
**On Screen**: Architecture diagram, class diagram, sequence diagram

> "Our architecture follows a modern full-stack approach:
>
> **Frontend**: React 19 with Tailwind CSS and Shadcn/UI for accessible components
> **Backend**: FastAPI (Python) with async/await for scalability
> **Database**: MongoDB with Motor async driver for flexible schemas
>
> **Key Design Decisions**:
> 1. JWT tokens for stateless authentication (scalable)
> 2. Role-Based Access Control for authorization
> 3. Virtual-first service model for COVID safety
> 4. SMTP2GO for reliable email delivery
>
> **Class Diagram** shows:
> - User with optional fields (age, vax_status, credit_card_encrypted)
> - Booking with covid_restrictions level
> - Service with is_online flag
>
> **Sequence Diagrams** illustrate:
> 1. Registration with consent flow
> 2. Booking request with COVID awareness"

**Visual**: Display architecture diagram, zoom into class relationships, animate sequence diagram

---

## 7:15-8:00 | User Interface Tour (5%)

**Speaker**: [Team Member 3]  
**On Screen**: Live UI walkthrough

> "The UI emphasizes privacy and clarity:
>
> - **Landing Page**: COVID alert banner, privacy-first messaging
> - **Registration**: Consent popups for optional fields, privacy notices
> - **Dashboard**: COVID restriction alerts, personalized service suggestions
> - **Services**: Virtual service badges, booking dialogs with privacy notices
> - **Admin Panel**: Request filtering, accept/decline workflow
>
> All components use Shadcn/UI for accessibility (ARIA labels, keyboard navigation)."

**Visual**: Click through each page, highlight privacy notices and COVID alerts

---

## 8:00-11:00 | Demo: Home Service Booking Flow (20%)

**Speaker**: [Team Member 1]  
**On Screen**: Live demo

> "Let's walk through the complete booking flow:
>
> **Step 1: Registration**
> - Navigate to /register
> - Fill required fields: name, email, password
> - Click vaccination status → consent dialog appears
> - Accept consent, check vaccination box
> - Optionally add encrypted credit card
> - Submit → receive welcome email
>
> **Step 2: Browse Services**
> - Dashboard shows COVID alert (medium level)
> - Recommended services prioritize virtual options
> - Click 'Browse Services' → see catalog
> - Each service shows price, duration, 'Virtual' badge
>
> **Step 3: Request Service**
> - Select 'Virtual Home Inspection'
> - Booking dialog: choose date, duration, add details
> - Privacy notice: data encrypted, shared only with provider
> - Submit → confirmation email sent
> - Dashboard shows booking status: 'Pending'
>
> **Step 4: Admin Review**
> - Login as admin
> - Admin dashboard shows stats: 1 pending request
> - Click 'Accept' → add notes for customer
> - Submit → user receives acceptance email
> - User dashboard updates: status 'Accepted'"

**Visual**: Live demo with real clicks, show email logs if SMTP not configured

---

## 11:00-12:30 | Demo: Security Features (10%)

**Speaker**: [Team Member 2]  
**On Screen**: Code + database views

> "Let's examine security implementations:
>
> **1. Password Hashing**
> - Show database: password field is bcrypt hash
> - Explain: bcrypt with salt rounds, resistant to rainbow tables
>
> **2. Credit Card Encryption**
> - Show database: credit_card_encrypted is Fernet ciphertext
> - Decrypt in backend (demonstrate in Python console)
> - Explain: AES-256 symmetric encryption, key in .env
>
> **3. JWT Tokens**
> - Inspect browser localStorage: see JWT token
> - Decode on jwt.io: shows user ID, expiry (24 hours)
> - Explain: stateless, signed with secret key
>
> **4. Role-Based Access**
> - Try accessing /admin as client → redirected
> - Try /admin/bookings API as client → 403 Forbidden
> - Explain: FastAPI dependencies check role
>
> **5. Data Deletion**
> - Click 'Delete My Account' → confirmation dialog
> - Confirm → user and all bookings deleted
> - Show database: no records remaining
> - Explain: GDPR 'Right to be Forgotten'"

**Visual**: Split screen with code and browser DevTools

---

## 12:30-13:30 | Novelty & Innovation (20%)

**Speaker**: [Team Member 3]  
**On Screen**: Unique features highlights

> "HomeBound Care introduces several novel features:
>
> **1. COVID-Aware Service Recommendations**
> - System monitors restriction levels (mock SA Government API)
> - Automatically suggests virtual services during high-risk periods
> - Dashboard alerts with actionable safety guidance
>
> **2. Privacy-First Virtual Services**
> - Home services typically require in-person visits
> - We reimagined inspections via video calls
> - Novel workflow: upload photos, live video walkthrough, AI analysis (future)
>
> **3. Granular Consent Management**
> - Most apps ask for all-or-nothing data access
> - We provide field-level consent with explanatory dialogs
> - Users control exactly what they share
>
> **4. Context-Aware Booking**
> - COVID restriction level stored with each booking
> - Audit trail for compliance and retrospective analysis
> - Admin sees user's context when reviewing requests
>
> **5. Logic-Based AI Suggestions** (not LLM, rule-based)
> - Analyzes user profile + restrictions + service history
> - Recommends 3 most relevant services
> - Prioritizes virtual during high restrictions
> - Considers vaccination status if consented"

**Visual**: Show suggestion algorithm code, COVID alert changes, consent comparison (other apps vs ours)

---

## 13:30-14:30 | Reflection & Learnings

**Speaker**: [Team Member 1]  
**On Screen**: Team photo, lessons learned slide

> "This project taught us:
>
> **Technical Skills**:
> - FastAPI async programming and dependency injection
> - React hooks and component composition
> - Cryptography (Fernet, bcrypt, JWT)
> - MongoDB schema design for privacy
>
> **Security Principles**:
> - Privacy by Design isn't optional — build it in from day one
> - Encryption is table stakes for any user data
> - Consent must be informed, specific, and revocable
>
> **Teamwork**:
> - Agile sprints with clear milestones
> - Code reviews for security vulnerabilities
> - Documentation as code (OpenAPI, inline comments)
>
> **Improvements**:
> - Real-time COVID API integration (not mock)
> - Video call implementation (WebRTC)
> - Rate limiting for brute force protection
> - Audit logs for compliance
> - Mobile app (React Native)"

**Visual**: Show team collaboration screenshots, GitHub commits (if applicable)

---

## 14:30-15:00 | Conclusion

**Speaker**: [All Team Members]  
**On Screen**: Landing page, credits

> "HomeBound Care demonstrates that security and privacy can coexist with excellent user experience.
>
> By implementing Privacy by Design from the ground up, we've created a platform that:
> - Protects user data with encryption and consent
> - Adapts to COVID restrictions for safety
> - Empowers users with control and transparency
> - Provides a viable solution for home services during pandemics
>
> Thank you for watching. Questions?
>
> **University of Adelaide - COMP SCI 7412/7612 - 2025**  
> **Team**: [List names]  
> **GitHub**: [Repository link if applicable]  
> **Demo Site**: [Live URL]"

**Visual**: Fade to credits, show GitHub/Demo links

---

## Video Production Checklist

- [ ] Record in 1080p (export 480p minimum)
- [ ] Use screen recording software (OBS, Loom)
- [ ] Add background music (royalty-free)
- [ ] Include subtitles for accessibility
- [ ] All team members appear on camera
- [ ] Edit transitions between sections
- [ ] Add timestamps in YouTube description
- [ ] Include links to GitHub, live demo, documentation

---

## Rubric Alignment

| Section | Duration | Rubric Weight | Content |
|---------|----------|---------------|---------|
| Overview + Functionalities | 2:00 | 15% | Home service app, user stories |
| Security/Privacy Issues | 1:30 | 10% | Research on contact tracing, home service risks |
| Solutions | 1:30 | 10% | Privacy by Design implementations |
| System Design | 2:15 | 15% | Architecture, class/sequence diagrams |
| UI Tour | 0:45 | 5% | Frontend pages, privacy notices |
| Demo (Home Service) | 3:00 | 20% | End-to-end booking flow |
| Demo (Security) | 1:30 | 10% | Encryption, JWT, RBAC, deletion |
| Novelty | 1:00 | 20% | COVID-aware, virtual services, consent |
| **Total** | **14:30** | **105%** | (5% buffer) |

**Note**: Flexible timing — adjust based on actual demo pace. Prioritize demo sections (40% combined weight).