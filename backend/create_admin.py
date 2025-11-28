#!/usr/bin/env python3
"""
Script to create an admin user in the database.
Run this script to set up the default admin account.
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime, timezone

# Load environment variables
load_dotenv()

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Admin credentials
ADMIN_EMAIL = "admin@homeservices.com"
ADMIN_PASSWORD = "admin123"  # Change this after first login!
ADMIN_NAME = "Admin User"

async def create_admin_user():
    """Create admin user in MongoDB"""
    try:
        # Connect to MongoDB
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        print(f"🔄 Connecting to MongoDB...")
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Check if admin already exists
        existing_admin = await db.users.find_one({"email": ADMIN_EMAIL})
        if existing_admin:
            print(f"⚠️  Admin user already exists with email: {ADMIN_EMAIL}")
            print(f"   User ID: {existing_admin['id']}")
            print(f"   Name: {existing_admin['name']}")
            print(f"   Role: {existing_admin['role']}")
            
            response = input("\nDo you want to reset the password? (yes/no): ")
            if response.lower() != 'yes':
                print("Operation cancelled.")
                client.close()
                return
            
            # Update password
            hashed_password = pwd_context.hash(ADMIN_PASSWORD)
            await db.users.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {"password": hashed_password}}
            )
            print(f"✅ Admin password has been reset!")
        else:
            # Create new admin user
            admin_user = {
                "id": str(uuid.uuid4()),
                "email": ADMIN_EMAIL,
                "name": ADMIN_NAME,
                "password": pwd_context.hash(ADMIN_PASSWORD),
                "role": "admin",
                "age": None,
                "mobile": None,
                "citizenship": None,
                "language": "English",
                "trade": None,
                "vax_status": None,
                "credit_card_encrypted": None,
                "consent_vax": False,
                "consent_data": True,
                "email_verified": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            await db.users.insert_one(admin_user)
            print(f"✅ Admin user created successfully!")
        
        print(f"\n📋 Admin Credentials:")
        print(f"   Email: {ADMIN_EMAIL}")
        print(f"   Password: {ADMIN_PASSWORD}")
        print(f"\n⚠️  IMPORTANT: Change this password after first login!")
        print(f"\n🌐 Login at: http://localhost:3000/login")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")
        raise

if __name__ == "__main__":
    print("=" * 60)
    print("  HomeBound Care - Admin User Setup")
    print("=" * 60)
    print()
    
    asyncio.run(create_admin_user())
    
    print()
    print("=" * 60)
