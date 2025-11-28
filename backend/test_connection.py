import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

async def test_connection():
    try:
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        print(f"🔄 Connecting to MongoDB...")
        print(f"📍 Database: {db_name}")
        
        client = AsyncIOMotorClient(mongo_url)
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Get database
        db = client[db_name]
        
        # List collections
        collections = await db.list_collection_names()
        print(f"📦 Collections in database: {collections if collections else 'None (empty database)'}")
        
        # Get collection counts
        if collections:
            for collection in collections:
                count = await db[collection].count_documents({})
                print(f"   - {collection}: {count} documents")
        
        client.close()
        print("\n✨ Connection test completed successfully!")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(test_connection())
