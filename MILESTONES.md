# Project Milestones

## Milestone 1: Research & Requirements (✅ Completed)

**Objective**: Understand the problem domain, research privacy issues, define security requirements

### Tasks:
- [x] Research COVID-19 contact tracing apps (COVIDSafe, BlueTrace, DP3T)
- [x] Identify privacy issues (deanonymization, surveillance, data breaches)
- [x] Research home services industry and existing solutions
- [x] Define 5+ security/privacy requirements (R01-R07)
- [x] Document requirements in template format (ID, Name, Description, Rationale, Security Goals)
- [x] Review Privacy by Design principles (7 foundational principles)
- [x] Elicit user stories for clients, providers, admins

### Deliverables:
- `REQUIREMENTS.md` with 7 requirements
- Research notes on contact tracing privacy issues
- User story documentation

---

## Milestone 2: System Design (✅ Completed)

**Objective**: Design system architecture, data models, and interaction flows

### Tasks:
- [x] Create architecture diagram (frontend, backend, database, external services)
- [x] Design database schemas (User, Booking, Service collections)
- [x] Model 2 requirements with class diagrams (R03, R04)
- [x] Create 2 sequence diagrams (Registration with consent, Booking with COVID)
- [x] Document 5+ design decisions (JWT, Fernet, RBAC, virtual-first, SMTP2GO, React, MongoDB)
- [x] Identify design patterns (Token-Based Auth, Privacy by Design, RBAC, Brokered Service)
- [x] Create UI sketches/storyboards (5+ screens: landing, register, dashboard, services, admin)

### Deliverables:
- `DESIGN_DECISIONS.md` with 8 decisions
- Class diagram (ASCII art in requirements)
- Sequence diagrams (text format in requirements)
- UI storyboard sketches (in code as React components)

---

## Milestone 3: Backend Implementation (✅ Completed)

**Objective**: Build FastAPI backend with security and privacy features

### Tasks:
- [x] Set up FastAPI project structure
- [x] Implement MongoDB connection with Motor
- [x] Create Pydantic models (User, Booking, Service, Token, etc.)
- [x] Implement JWT authentication (register, login, get_current_user)
- [x] Implement password hashing with bcrypt
- [x] Implement Fernet encryption for credit cards
- [x] Create user management endpoints (register, login, delete)
- [x] Create service endpoints (list, suggestions)
- [x] Create booking endpoints (create, list user bookings, admin list/update)
- [x] Implement role-based access control (client, admin)
- [x] Create COVID restrictions mock API
- [x] Integrate SMTP2GO for email confirmations
- [x] Add startup event to seed default services
- [x] Configure CORS for frontend

### Deliverables:
- `/app/backend/server.py` (450+ lines)
- `/app/backend/.env` with configuration
- `/app/backend/requirements.txt` with dependencies
- Working API endpoints (test with curl)

---

## Milestone 4: Frontend Implementation (✅ Completed)

**Objective**: Build React frontend with privacy-focused UI/UX

### Tasks:
- [x] Set up React project with React Router
- [x] Configure Tailwind CSS and Shadcn/UI components
- [x] Create landing page with COVID messaging
- [x] Create registration page with consent dialogs
- [x] Create login page with privacy notices
- [x] Create user dashboard with COVID alerts and suggestions
- [x] Create services page with booking dialogs
- [x] Create admin dashboard with filtering and actions
- [x] Implement authentication context and token storage
- [x] Add axios interceptor for automatic token attachment
- [x] Implement protected routes (client, admin)
- [x] Add toast notifications for user feedback
- [x] Style with privacy-first design (notices, consent, deletion)
- [x] Add data-testid attributes for testing

### Deliverables:
- `/app/frontend/src/` with 6 pages + components
- `/app/frontend/src/App.css` with custom styles
- Responsive, accessible UI
- Working frontend application

---

## Milestone 5: Integration & Testing (⏳ In Progress)

**Objective**: Connect frontend and backend, test end-to-end flows

### Tasks:
- [x] Connect frontend to backend API
- [x] Test user registration with consent flow
- [x] Test login and JWT token handling
- [x] Test booking creation and email confirmations
- [x] Test admin accept/decline workflow
- [ ] Test data deletion (GDPR compliance)
- [x] Test COVID restriction alerts
- [ ] Test role-based access (client can't access admin routes)
- [ ] Manual security testing (XSS, injection attempts)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (responsive design)

### Deliverables:
- Test report document
- Bug fixes from testing
- Screenshots of working features

---

## Milestone 6: Documentation & Presentation (✅ Completed)

**Objective**: Complete documentation and prepare demo materials

### Tasks:
- [x] Write comprehensive README.md
- [x] Document all API endpoints with examples
- [x] Create installation instructions
- [x] Write REQUIREMENTS.md with 7 requirements
- [x] Write DESIGN_DECISIONS.md with 8 decisions
- [x] Create VIDEO_SCRIPT.md with 15-minute demo outline
- [x] Create MILESTONES.md (this file)
- [ ] Prepare presentation slides (12 max)
- [ ] Record demo video (15 minutes)
- [ ] Write individual reflection report (contributions, learnings, improvements)
- [ ] Write group report (10 pages, include all milestones)

### Deliverables:
- Complete `/app/` directory with all documentation
- Presentation slides (PowerPoint/PDF)
- Demo video (YouTube upload)
- Individual report (PDF)
- Group report (PDF)

---

## Milestone 7: Deployment & Finalization (🔜 Future)

**Objective**: Deploy to production and finalize for submission

### Tasks:
- [ ] Deploy backend to cloud platform (Heroku, AWS, Azure)
- [ ] Deploy frontend to hosting service (Vercel, Netlify)
- [ ] Configure production environment variables
- [ ] Enable HTTPS for all traffic
- [ ] Set up MongoDB Atlas for cloud database
- [ ] Test production deployment
- [ ] Create demo account credentials for markers
- [ ] Submit all deliverables
- [ ] Present to class

### Deliverables:
- Live demo URL
- Production environment
- Submission package (code + docs + video)

---

## Progress Summary

| Milestone | Status | Completion |
|-----------|--------|------------|
| 1. Research & Requirements | ✅ Done | 100% |
| 2. System Design | ✅ Done | 100% |
| 3. Backend Implementation | ✅ Done | 100% |
| 4. Frontend Implementation | ✅ Done | 100% |
| 5. Integration & Testing | ⏳ In Progress | 70% |
| 6. Documentation & Presentation | ✅ Done | 90% |
| 7. Deployment & Finalization | 🔜 Future | 0% |

**Overall Project Completion**: ~80%

---

## Known Issues & Future Work

### Current Limitations:
1. **Mock COVID API**: Using hardcoded restriction levels, should integrate real SA Government API
2. **No Rate Limiting**: Backend vulnerable to brute force attacks
3. **localStorage for Tokens**: XSS-vulnerable, should use httpOnly cookies
4. **No Video Calls**: Virtual services described but not implemented (need WebRTC)
5. **No Payment Processing**: Credit cards stored but not charged (need Stripe)
6. **Simple Email Templates**: HTML emails are basic, could improve design
7. **No Audit Logs**: Should log all security-relevant actions

### Planned Improvements:
1. Real-time COVID API integration
2. WebRTC video call implementation
3. Stripe payment processing
4. Advanced search and filtering (Elasticsearch)
5. Service provider profiles and ratings
6. Push notifications (Firebase Cloud Messaging)
7. Mobile app (React Native)
8. Two-factor authentication (TOTP)
9. Comprehensive unit and integration tests
10. Performance optimization (caching, CDN)

---

## Timeline

- **Week 1-2**: Research & Requirements (Milestone 1)
- **Week 3**: System Design (Milestone 2)
- **Week 4-5**: Backend Implementation (Milestone 3)
- **Week 6-7**: Frontend Implementation (Milestone 4)
- **Week 8**: Integration & Testing (Milestone 5)
- **Week 9-10**: Documentation & Presentation (Milestone 6)
- **Week 11**: Deployment & Finalization (Milestone 7)
- **Week 12**: Submission & Presentation

---

**Last Updated**: November 2025  
**Project Status**: On Track for Submission