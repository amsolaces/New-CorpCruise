from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import secrets
import string
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Code validity duration in minutes
CODE_VALIDITY_MINUTES = 15

# Create the main app without a prefix
app = FastAPI()

# Health check endpoint for deployment (must be at root level, not under /api)
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "corpcruise-backend"}

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Booking Code Models
class BookingCode(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
    used: bool = False
    used_by: Optional[str] = None
    used_at: Optional[datetime] = None

class BookingCodeResponse(BaseModel):
    id: str
    code: str
    created_at: str
    expires_at: str
    used: bool
    used_by: Optional[str] = None
    used_at: Optional[str] = None
    is_expired: bool
    minutes_remaining: int

class VerifyCodeRequest(BaseModel):
    code: str

class VerifyCodeResponse(BaseModel):
    valid: bool
    message: str
    code: Optional[str] = None


# Booking Models
class BookingCreate(BaseModel):
    code: str
    company_name: str
    city: str
    duty_type: str
    vehicle_category: str
    pickup_location: str
    date: str
    time: str
    dropoff_location: str
    full_name: str
    phone_number: str
    email: str
    special_requests: Optional[str] = None

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    company_name: str
    city: str
    duty_type: str
    vehicle_category: str
    pickup_location: str
    date: str
    time: str
    dropoff_location: str
    full_name: str
    phone_number: str
    email: str
    special_requests: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"


# Helper function to generate unique code
def generate_booking_code():
    random_part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    year = datetime.now().year
    timestamp_part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
    return f"CORP-{random_part}-{year}-{timestamp_part}"


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ============ BOOKING CODE ENDPOINTS ============

@api_router.post("/codes", response_model=BookingCodeResponse)
async def generate_code():
    """Generate a new booking code with 15-minute validity"""
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=CODE_VALIDITY_MINUTES)
    
    code_obj = BookingCode(
        code=generate_booking_code(),
        created_at=now,
        expires_at=expires_at
    )
    
    # Save to database
    doc = code_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['expires_at'] = doc['expires_at'].isoformat()
    
    await db.booking_codes.insert_one(doc)
    
    return BookingCodeResponse(
        id=code_obj.id,
        code=code_obj.code,
        created_at=code_obj.created_at.isoformat(),
        expires_at=code_obj.expires_at.isoformat(),
        used=code_obj.used,
        used_by=code_obj.used_by,
        used_at=None,
        is_expired=False,
        minutes_remaining=CODE_VALIDITY_MINUTES
    )


@api_router.get("/codes", response_model=List[BookingCodeResponse])
async def get_all_codes():
    """Get all booking codes (for admin)"""
    codes = await db.booking_codes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    now = datetime.now(timezone.utc)
    result = []
    
    for code in codes:
        created_at = datetime.fromisoformat(code['created_at']) if isinstance(code['created_at'], str) else code['created_at']
        expires_at = datetime.fromisoformat(code['expires_at']) if isinstance(code['expires_at'], str) else code['expires_at']
        
        # Make sure both datetimes are timezone-aware
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        is_expired = now > expires_at
        minutes_remaining = max(0, int((expires_at - now).total_seconds() / 60)) if not is_expired else 0
        
        result.append(BookingCodeResponse(
            id=code['id'],
            code=code['code'],
            created_at=code['created_at'] if isinstance(code['created_at'], str) else code['created_at'].isoformat(),
            expires_at=code['expires_at'] if isinstance(code['expires_at'], str) else code['expires_at'].isoformat(),
            used=code.get('used', False),
            used_by=code.get('used_by'),
            used_at=code.get('used_at'),
            is_expired=is_expired,
            minutes_remaining=minutes_remaining
        ))
    
    return result


@api_router.post("/codes/verify", response_model=VerifyCodeResponse)
async def verify_code(request: VerifyCodeRequest):
    """Verify a booking code"""
    code_upper = request.code.strip().upper()
    
    # Find the code in database
    code_doc = await db.booking_codes.find_one({"code": code_upper}, {"_id": 0})
    
    if not code_doc:
        return VerifyCodeResponse(valid=False, message="Invalid access code. Please check and try again.")
    
    # Check if already used
    if code_doc.get('used', False):
        return VerifyCodeResponse(valid=False, message="This code has already been used. Please contact admin for a new code.")
    
    # Check if expired
    expires_at = datetime.fromisoformat(code_doc['expires_at']) if isinstance(code_doc['expires_at'], str) else code_doc['expires_at']
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    now = datetime.now(timezone.utc)
    if now > expires_at:
        return VerifyCodeResponse(valid=False, message="This code has expired. Please contact admin for a new code.")
    
    # Code is valid - mark as used
    await db.booking_codes.update_one(
        {"code": code_upper},
        {"$set": {
            "used": True,
            "used_at": now.isoformat(),
            "used_by": "Customer"
        }}
    )
    
    return VerifyCodeResponse(valid=True, message="Access verified! Proceeding to booking...", code=code_upper)


@api_router.delete("/codes/{code_id}")
async def delete_code(code_id: str):
    """Delete a booking code (admin only)"""
    result = await db.booking_codes.delete_one({"id": code_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Code not found")
    
    return {"message": "Code deleted successfully"}


# ============ BOOKING ENDPOINTS ============

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    """Create a new booking"""
    booking = Booking(
        code=booking_data.code,
        company_name=booking_data.company_name,
        city=booking_data.city,
        duty_type=booking_data.duty_type,
        vehicle_category=booking_data.vehicle_category,
        pickup_location=booking_data.pickup_location,
        date=booking_data.date,
        time=booking_data.time,
        dropoff_location=booking_data.dropoff_location,
        full_name=booking_data.full_name,
        phone_number=booking_data.phone_number,
        email=booking_data.email,
        special_requests=booking_data.special_requests
    )
    
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def get_all_bookings():
    """Get all bookings (for admin)"""
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()