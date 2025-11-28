# Acknowledgments

## Third-Party Libraries & Services

This project utilizes the following open-source libraries and third-party services:

---

## Backend Dependencies

### Core Framework
- **FastAPI** (v0.110.1) - Modern Python web framework  
  License: MIT  
  URL: https://fastapi.tiangolo.com/  
  Used for: REST API endpoints, automatic OpenAPI documentation, async request handling

- **Uvicorn** (v0.25.0) - ASGI server  
  License: BSD-3-Clause  
  URL: https://www.uvicorn.org/  
  Used for: Running FastAPI application with async workers

### Database
- **Motor** (v3.3.1) - Async MongoDB driver  
  License: Apache-2.0  
  URL: https://motor.readthedocs.io/  
  Used for: Non-blocking MongoDB operations with FastAPI

- **PyMongo** (v4.5.0) - MongoDB driver  
  License: Apache-2.0  
  URL: https://pymongo.readthedocs.io/  
  Used for: MongoDB connection and queries

### Security & Cryptography
- **python-jose** (v3.3.0) - JWT implementation  
  License: MIT  
  URL: https://github.com/mpdavis/python-jose  
  Used for: Creating and validating JWT tokens for authentication

- **passlib** (v1.7.4) - Password hashing library  
  License: BSD  
  URL: https://passlib.readthedocs.io/  
  Used for: Password hashing context management

- **bcrypt** (v4.1.3) - Password hashing  
  License: Apache-2.0  
  URL: https://github.com/pyca/bcrypt/  
  Used for: Secure password hashing with salt rounds

- **cryptography** (v42.0.8) - Cryptographic recipes  
  License: Apache-2.0 / BSD  
  URL: https://cryptography.io/  
  Used for: Fernet symmetric encryption for credit card data

### Data Validation
- **Pydantic** (v2.6.4) - Data validation  
  License: MIT  
  URL: https://docs.pydantic.dev/  
  Used for: Request/response models, data validation, serialization

- **email-validator** (v2.2.0) - Email validation  
  License: CC0-1.0  
  URL: https://github.com/JoshData/python-email-validator  
  Used for: Validating email addresses in user registration

### Email
- **aiosmtplib** (v5.0.0) - Async SMTP client  
  License: MIT  
  URL: https://aiosmtplib.readthedocs.io/  
  Used for: Sending email confirmations via SMTP2GO

### Utilities
- **python-dotenv** (v1.0.1) - Environment variable loader  
  License: BSD-3-Clause  
  URL: https://github.com/theskumar/python-dotenv  
  Used for: Loading configuration from .env files

- **python-multipart** (v0.0.9) - Multipart form data parser  
  License: Apache-2.0  
  URL: https://github.com/andrew-d/python-multipart  
  Used for: Handling file uploads in FastAPI

---

## Frontend Dependencies

### Core Framework
- **React** (v19.0.0) - UI library  
  License: MIT  
  URL: https://react.dev/  
  Used for: Component-based UI development

- **React Router DOM** (v7.5.1) - Routing library  
  License: MIT  
  URL: https://reactrouter.com/  
  Used for: Client-side routing and navigation

### HTTP Client
- **Axios** (v1.8.4) - Promise-based HTTP client  
  License: MIT  
  URL: https://axios-http.com/  
  Used for: API requests to backend with interceptors

### UI Components
- **Shadcn/UI** - Component library (collection of Radix UI + Tailwind)  
  License: MIT  
  URL: https://ui.shadcn.com/  
  Used for: Accessible, customizable UI components

- **Radix UI** (multiple packages) - Unstyled accessible components  
  License: MIT  
  URL: https://www.radix-ui.com/  
  Components used: Dialog, AlertDialog, Dropdown, Select, Checkbox, Label, Tabs, Toast, etc.  
  Used for: Accessibility (ARIA) and keyboard navigation primitives

- **Lucide React** (v0.507.0) - Icon library  
  License: ISC  
  URL: https://lucide.dev/  
  Used for: Consistent, modern SVG icons

### Styling
- **Tailwind CSS** (v3.4.17) - Utility-first CSS framework  
  License: MIT  
  URL: https://tailwindcss.com/  
  Used for: Rapid UI styling with utility classes

- **tailwindcss-animate** (v1.0.7) - Animation utilities  
  License: MIT  
  URL: https://github.com/jamiebuilds/tailwindcss-animate  
  Used for: Pre-built animation classes

- **PostCSS** (v8.4.49) - CSS processor  
  License: MIT  
  URL: https://postcss.org/  
  Used for: Processing Tailwind CSS

- **Autoprefixer** (v10.4.20) - CSS vendor prefixer  
  License: MIT  
  URL: https://github.com/postcss/autoprefixer  
  Used for: Automatic CSS vendor prefixes

### Utilities
- **clsx** (v2.1.1) - Class name utility  
  License: MIT  
  URL: https://github.com/lukeed/clsx  
  Used for: Conditional CSS class concatenation

- **class-variance-authority** (v0.7.1) - Variant utility  
  License: MIT  
  URL: https://cva.style/  
  Used for: Type-safe component variants

- **tailwind-merge** (v3.2.0) - Tailwind class merger  
  License: MIT  
  URL: https://github.com/dcastil/tailwind-merge  
  Used for: Merging Tailwind classes without conflicts

### Notifications
- **Sonner** (v2.0.3) - Toast notification library  
  License: MIT  
  URL: https://sonner.emilkowal.ski/  
  Used for: User feedback via toast messages

### Form Handling
- **React Hook Form** (v7.56.2) - Form library  
  License: MIT  
  URL: https://react-hook-form.com/  
  Used for: Performant form validation and submission

- **Zod** (v3.24.4) - Schema validation  
  License: MIT  
  URL: https://zod.dev/  
  Used for: TypeScript-first schema validation

- **@hookform/resolvers** (v5.0.1) - Validation resolver  
  License: MIT  
  URL: https://github.com/react-hook-form/resolvers  
  Used for: Integrating Zod with React Hook Form

### Date Handling
- **date-fns** (v4.1.0) - Date utility library  
  License: MIT  
  URL: https://date-fns.org/  
  Used for: Date formatting and manipulation

- **react-day-picker** (v8.10.1) - Date picker component  
  License: MIT  
  URL: https://daypicker.dev/  
  Used for: Calendar date selection in forms

---

## External Services

### Email Delivery
- **SMTP2GO**  
  URL: https://www.smtp2go.com/  
  Used for: Reliable email delivery for booking confirmations and notifications  
  Note: Requires API key for production use

### Font Services
- **Google Fonts**  
  URL: https://fonts.google.com/  
  Fonts used: Space Grotesk, Inter  
  License: Open Font License  
  Used for: Typography and branding

---

## Development Tools

### Build Tools
- **CRACO** (v7.1.0) - Create React App Configuration Override  
  License: Apache-2.0  
  URL: https://craco.js.org/  
  Used for: Customizing Create React App without ejecting

- **Yarn** (v1.22.22) - Package manager  
  License: BSD-2-Clause  
  URL: https://yarnpkg.com/  
  Used for: Managing frontend dependencies

### Linting & Formatting
- **ESLint** (v9.23.0) - JavaScript linter  
  License: MIT  
  URL: https://eslint.org/  
  Used for: Code quality and consistency

- **Black** (v24.1.1) - Python formatter  
  License: MIT  
  URL: https://black.readthedocs.io/  
  Used for: Consistent Python code formatting

---

## Research References

### Privacy-by-Design Principles
- **Privacy by Design: The 7 Foundational Principles** by Ann Cavoukian  
  URL: https://www.ipc.on.ca/wp-content/uploads/Resources/7foundationalprinciples.pdf  
  Used for: Guiding privacy implementation decisions

### Contact Tracing Research
- **BlueTrace Protocol** - Singapore's contact tracing protocol  
  URL: https://bluetrace.io/  
  Used for: Understanding Bluetooth-based privacy risks

- **DP-3T (Decentralized Privacy-Preserving Proximity Tracing)**  
  URL: https://github.com/DP-3T/documents  
  Used for: Privacy-preserving contact tracing design patterns

- **COVIDSafe App (Australia)**  
  URL: https://www.health.gov.au/resources/apps-and-tools/covidsafe-app  
  Used for: Analyzing national contact tracing implementation

### Security Standards
- **OWASP Top 10** - Web application security risks  
  URL: https://owasp.org/www-project-top-ten/  
  Used for: Identifying and mitigating common vulnerabilities

- **GDPR (General Data Protection Regulation)**  
  URL: https://gdpr.eu/  
  Used for: Privacy compliance requirements

---

## Special Thanks

- **University of Adelaide** - COMP SCI 7412/7612 course staff and teaching team
- **FastAPI Community** - Excellent documentation and active support forums
- **React Community** - Comprehensive tutorials and ecosystem
- **Shadcn** - For open-sourcing the UI component collection

---

## License

This project is an academic submission and not licensed for commercial use.  
All third-party libraries retain their original licenses as listed above.

**Project**: HomeBound Care - Privacy-by-Design Home Services Platform  
**Institution**: University of Adelaide  
**Course**: COMP SCI 7412 & 7612 - Secure Software Engineering  
**Year**: 2025

---

**Note**: If you use this project as a reference or base for your own work, please provide appropriate attribution and respect the licenses of all included libraries.