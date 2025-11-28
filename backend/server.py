from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from cryptography.fernet import Fernet
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import base64
import qrcode
import io
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Encryption for sensitive data
ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY', Fernet.generate_key().decode())
fernet = Fernet(ENCRYPTION_KEY.encode() if isinstance(ENCRYPTION_KEY, str) else ENCRYPTION_KEY)

# Email Configuration
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.ethereal.email')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASS = os.environ.get('SMTP_PASS', '')
SMTP_FROM_EMAIL = os.environ.get('SMTP_FROM_EMAIL', 'noreply@homeservices.com')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class UserBase(BaseModel):
    email: EmailStr
    name: str
    age: Optional[int] = None
    mobile: Optional[str] = None
    citizenship: Optional[str] = None
    language: Optional[str] = "English"
    role: str = "client"  # client, provider, admin
    trade: Optional[str] = None  # for providers

class UserRegister(UserBase):
    password: str
    vax_status: Optional[bool] = None
    credit_card: Optional[str] = None
    consent_vax: bool = False
    consent_data: bool = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str
    created_at: str
    vax_status: Optional[bool] = None
    credit_card_encrypted: Optional[str] = None
    email_verified: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class ServiceBase(BaseModel):
    name: str
    description: str
    price: float
    service_type: str  # inspection, consultation, renovation, repair
    is_online: bool = True
    photos: List[str] = []

class Service(ServiceBase):
    model_config = ConfigDict(extra="ignore")
    id: str
    provider_id: Optional[str] = None
    created_at: str

class BookingBase(BaseModel):
    service_id: str
    service_type: str
    preferred_date: str
    duration: int = 60  # minutes
    details: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_name: str
    user_email: str
    status: str  # pending, accepted, declined
    created_at: str
    covid_restrictions: str
    cost: float

class CovidRestrictions(BaseModel):
    level: str  # low, medium, high
    density_limits: str
    mask_required: bool
    quarantine_required: bool
    last_updated: str
    message: str

class BookingAction(BaseModel):
    action: str  # accept or decline
    admin_notes: Optional[str] = None

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    title: str
    message: str
    type: str  # info, success, warning, error
    read: bool = False
    created_at: str
    booking_id: Optional[str] = None

class EmailVerification(BaseModel):
    token: str

# Helper Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def encrypt_data(data: str) -> str:
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    return fernet.decrypt(encrypted_data.encode()).decode()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if user is None:
        raise credentials_exception
    return user

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

async def send_email(to_email: str, subject: str, body: str, qr_image: bytes = None):
    """Send email via Ethereal Email with optional QR code"""
    try:
        if not SMTP_USER or not SMTP_PASS:
            logging.info(f"Email mock - To: {to_email}, Subject: {subject}")
            return True
        
        message = MIMEMultipart("related")
        message["From"] = SMTP_FROM_EMAIL
        message["To"] = to_email
        message["Subject"] = subject
        
        # Add HTML body
        html_part = MIMEText(body, "html")
        message.attach(html_part)
        
        # Add QR code if provided
        if qr_image:
            qr_part = MIMEImage(qr_image)
            qr_part.add_header('Content-ID', '<qr_code>')
            qr_part.add_header('Content-Disposition', 'inline', filename='qr_code.png')
            message.attach(qr_part)
        
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASS,
            start_tls=True
        )
        logging.info(f"✉️  Email sent to {to_email} - View at: https://ethereal.email/messages")
        return True
    except Exception as e:
        logging.error(f"Email error: {e}")
        return False

def generate_qr_code(data: str) -> bytes:
    """Generate QR code as PNG bytes"""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes.read()

async def create_notification(user_id: str, title: str, message: str, notification_type: str, booking_id: str = None):
    """Create a notification for a user"""
    notification = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": title,
        "message": message,
        "type": notification_type,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "booking_id": booking_id
    }
    await db.notifications.insert_one(notification)
    return notification

def get_covid_restrictions() -> CovidRestrictions:
    """Mock COVID restriction data"""
    return CovidRestrictions(
        level="medium",
        density_limits="1 person per 4 sqm",
        mask_required=True,
        quarantine_required=False,
        last_updated=datetime.now(timezone.utc).isoformat(),
        message="Current restrictions recommend remote services. Masks required for in-person visits."
    )

def suggest_services(user_profile: dict, restrictions: CovidRestrictions) -> List[str]:
    """Simple logic-based service suggestions"""
    suggestions = []
    
    # Prioritize online services during high restrictions
    if restrictions.level in ["high", "medium"]:
        suggestions.extend([
            "Virtual Home Inspection",
            "Online Renovation Consultation",
            "Remote Design Planning"
        ])
    
    # Add based on user profile
    if user_profile.get("vax_status"):
        suggestions.append("In-Person Safety Assessment")
    
    return suggestions[:3]

# Routes
@api_router.get("/")
async def root():
    return {"message": "Home Services API - Privacy by Design"}

@api_router.post("/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "age": user_data.age,
        "mobile": user_data.mobile,
        "citizenship": user_data.citizenship,
        "language": user_data.language,
        "role": user_data.role,
        "trade": user_data.trade,
        "password": hash_password(user_data.password),
        "vax_status": user_data.vax_status if user_data.consent_vax else None,
        "credit_card_encrypted": encrypt_data(user_data.credit_card) if user_data.credit_card else None,
        "consent_vax": user_data.consent_vax,
        "consent_data": user_data.consent_data,
        "email_verified": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create token
    access_token = create_access_token(
        data={"sub": user_id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Prepare user response
    user_response = User(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        age=user_data.age,
        mobile=user_data.mobile,
        citizenship=user_data.citizenship,
        language=user_data.language,
        role=user_data.role,
        trade=user_data.trade,
        created_at=user_doc["created_at"],
        vax_status=user_data.vax_status,
        email_verified=True
    )
    
    # Send welcome email
    await send_email(
        user_data.email,
        "Welcome to HomeBound Care",
        f"""<h2>Welcome {user_data.name}!</h2>
        <p>Thank you for registering with HomeBound Care. Your account has been created successfully.</p>
        <p>We prioritize your privacy and data security.</p>
        <p>You can now browse services and request bookings!</p>"""
    )
    
    # Create welcome notification
    await create_notification(
        user_id,
        "Welcome to HomeBound Care! 🎉",
        "Your account is ready. Start browsing services now!",
        "success"
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    user_response = User(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        age=user.get("age"),
        mobile=user.get("mobile"),
        citizenship=user.get("citizenship"),
        language=user.get("language", "English"),
        role=user["role"],
        trade=user.get("trade"),
        created_at=user["created_at"],
        vax_status=user.get("vax_status")
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    return User(**current_user)

@api_router.delete("/user/delete")
async def delete_user_data(current_user: dict = Depends(get_current_user)):
    """Privacy by Design: User data deletion"""
    user_id = current_user["id"]
    
    # Delete user bookings
    await db.bookings.delete_many({"user_id": user_id})
    
    # Delete user
    await db.users.delete_one({"id": user_id})
    
    return {"message": "All your data has been permanently deleted"}

@api_router.get("/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(1000)
    return services

@api_router.get("/services/suggestions")
async def get_service_suggestions(current_user: dict = Depends(get_current_user)):
    restrictions = get_covid_restrictions()
    suggestions = suggest_services(current_user, restrictions)
    return {"suggestions": suggestions, "restrictions": restrictions}

@api_router.post("/bookings", response_model=Booking, status_code=status.HTTP_201_CREATED)
async def create_booking(booking_data: BookingCreate, current_user: dict = Depends(get_current_user)):
    # Get service
    service = await db.services.find_one({"id": booking_data.service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Get COVID restrictions
    restrictions = get_covid_restrictions()
    
    # Create booking
    booking_id = str(uuid.uuid4())
    booking_doc = {
        "id": booking_id,
        "user_id": current_user["id"],
        "user_name": current_user["name"],
        "user_email": current_user["email"],
        "service_id": booking_data.service_id,
        "service_type": booking_data.service_type,
        "preferred_date": booking_data.preferred_date,
        "duration": booking_data.duration,
        "details": booking_data.details,
        "status": "pending",
        "covid_restrictions": restrictions.level,
        "cost": service["price"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.bookings.insert_one(booking_doc)
    
    # Create notification for user
    await create_notification(
        current_user["id"],
        "Booking Request Submitted",
        f"Your {booking_data.service_type} booking is pending admin approval.",
        "info",
        booking_id
    )
    
    # Notify all admins about new booking request
    admins = await db.users.find({"role": "admin"}, {"_id": 0}).to_list(100)
    for admin in admins:
        await create_notification(
            admin["id"],
            "New Booking Request! 📋",
            f"{current_user['name']} requested {booking_data.service_type} service.",
            "info",
            booking_id
        )
    
    # Send confirmation email
    await send_email(
        current_user["email"],
        "Service Request Confirmation",
        f"<h2>Booking Confirmed</h2><p>Dear {current_user['name']},</p><p>Your request for {service['name']} has been received. Booking ID: {booking_id}</p><p>Status: Pending Admin Approval</p><p><strong>COVID Safety:</strong> {restrictions.message}</p><p>You will receive a notification and email once an admin reviews your request.</p>"
    )
    
    return Booking(**booking_doc)

@api_router.get("/bookings", response_model=List[Booking])
async def get_user_bookings(current_user: dict = Depends(get_current_user)):
    bookings = await db.bookings.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.get("/admin/bookings", response_model=List[Booking])
async def get_all_bookings(current_user: dict = Depends(get_admin_user)):
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.put("/admin/bookings/{booking_id}")
async def update_booking_status(booking_id: str, action: BookingAction, current_user: dict = Depends(get_admin_user)):
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    new_status = "accepted" if action.action == "accept" else "declined"
    
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": new_status, "admin_notes": action.admin_notes, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Create notification for user
    notification_title = "Booking Accepted! 🎉" if new_status == "accepted" else "Booking Update"
    notification_message = f"Your {booking['service_type']} booking has been {new_status}."
    await create_notification(
        booking["user_id"],
        notification_title,
        notification_message,
        "success" if new_status == "accepted" else "info",
        booking_id
    )
    
    # Generate QR code for accepted bookings
    qr_image = None
    if new_status == "accepted":
        qr_data = f"""HomeBound Care Receipt
Booking ID: {booking_id}
Service: {booking['service_type']}
Date: {booking['preferred_date']}
Duration: {booking['duration']} min
Cost: ${booking['cost']}
Status: CONFIRMED
Customer: {booking['user_name']}"""
        qr_image = generate_qr_code(qr_data)
    
    # Send email notification with QR code
    email_body = f"""<h2>Booking {new_status.title()}</h2>
    <p>Dear {booking['user_name']},</p>
    <p>Your booking for <strong>{booking['service_type']}</strong> has been {new_status}.</p>
    <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Booking Details:</strong></p>
        <p>📋 Booking ID: {booking_id}</p>
        <p>📅 Date: {booking['preferred_date']}</p>
        <p>⏱️ Duration: {booking['duration']} minutes</p>
        <p>💰 Cost: ${booking['cost']}</p>
    </div>
    <p>{action.admin_notes or ''}</p>"""
    
    if new_status == "accepted":
        email_body += """<div style="margin: 20px 0; text-align: center;">
        <h3>Your Service Receipt QR Code:</h3>
        <img src="cid:qr_code" alt="Booking QR Code" style="max-width: 300px; border: 2px solid #4F46E5; padding: 10px; border-radius: 8px;"/>
        <p style="font-size: 12px; color: #666;">Show this QR code to your service provider</p>
        </div>"""
    
    email_body += "<p>Thank you for choosing HomeBound Care!</p>"
    
    await send_email(
        booking["user_email"],
        f"Booking {new_status.title()} - HomeBound Care",
        email_body,
        qr_image
    )
    
    # Notify admin
    await create_notification(
        current_user["id"],
        "Booking Updated",
        f"You {new_status} booking {booking_id} for {booking['user_name']}",
        "success",
        booking_id
    )
    
    return {"message": f"Booking {new_status}", "booking_id": booking_id, "qr_generated": new_status == "accepted"}

@api_router.get("/covid/restrictions", response_model=CovidRestrictions)
async def get_restrictions():
    return get_covid_restrictions()

@api_router.get("/notifications")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    """Get user notifications"""
    notifications = await db.notifications.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(50).to_list(50)
    
    unread_count = await db.notifications.count_documents({"user_id": current_user["id"], "read": False})
    
    return {"notifications": notifications, "unread_count": unread_count}

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user: dict = Depends(get_current_user)):
    """Mark notification as read"""
    result = await db.notifications.update_one(
        {"id": notification_id, "user_id": current_user["id"]},
        {"$set": {"read": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification marked as read"}

@api_router.put("/notifications/read-all")
async def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read"""
    await db.notifications.update_many(
        {"user_id": current_user["id"], "read": False},
        {"$set": {"read": True}}
    )
    
    return {"message": "All notifications marked as read"}

@api_router.get("/bookings/{booking_id}/qr")
async def get_booking_qr(booking_id: str, current_user: dict = Depends(get_current_user)):
    """Get QR code for a booking"""
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if user owns the booking or is admin
    if booking["user_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    if booking["status"] != "accepted":
        raise HTTPException(status_code=400, detail="QR code only available for accepted bookings")
    
    # Generate QR code
    qr_data = f"""HomeBound Care Receipt
Booking ID: {booking_id}
Service: {booking['service_type']}
Date: {booking['preferred_date']}
Duration: {booking['duration']} min
Cost: ${booking['cost']}
Status: CONFIRMED
Customer: {booking['user_name']}"""
    
    qr_image = generate_qr_code(qr_data)
    
    return StreamingResponse(io.BytesIO(qr_image), media_type="image/png")

# Initialize default services
@app.on_event("startup")
async def startup_event():
    # Check if services exist
    count = await db.services.count_documents({})
    if count == 0:
        default_services = [
            {
                "id": str(uuid.uuid4()),
                "name": "Virtual Home Inspection",
                "description": "Complete home inspection via video call. Our experts guide you through a thorough assessment.",
                "price": 150.0,
                "service_type": "inspection",
                "is_online": True,
                "photos": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Online Renovation Consultation",
                "description": "Plan your dream renovation from home. Expert advice on design, materials, and budgeting.",
                "price": 200.0,
                "service_type": "consultation",
                "is_online": True,
                "photos": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Remote Design Planning",
                "description": "Professional interior design services delivered online. Receive 3D renders and shopping lists.",
                "price": 300.0,
                "service_type": "design",
                "is_online": True,
                "photos": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Virtual Maintenance Consultation",
                "description": "Get expert advice on home repairs via video. DIY guidance or schedule an in-person visit.",
                "price": 100.0,
                "service_type": "repair",
                "is_online": True,
                "photos": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "COVID-Safe In-Person Assessment",
                "description": "For urgent needs only. Full PPE protocols. Subject to current restriction levels.",
                "price": 250.0,
                "service_type": "inspection",
                "is_online": False,
                "photos": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.services.insert_many(default_services)
        logging.info("Default services initialized")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()