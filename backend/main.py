from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import hashlib
from database import get_db_connection

# --- Pydantic models ---
class RegisterUser(BaseModel):
    full_name: str
    phone_number: str
    password: str
    role: str  # "farmer" or "buyer"
    city: Optional[str] = None       # Added to track farmer location
    commodity: Optional[str] = None  # Added to track farmer crop

class LoginUser(BaseModel):
    phone_number: str
    password: str
    role: str  # "farmer" or "buyer"

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

app = FastAPI(title="Agri Marketplace API")

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/prices")
def get_mandi_prices(state: str = None, district: str = None, commodity: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor(dictionary=True)
    
    # Build dynamic query based on filters
    query = "SELECT * FROM mandi_prices WHERE 1=1"
    params = []
    
    if state:
        query += " AND state = %s"
        params.append(state)
    if district:
        query += " AND district = %s"
        params.append(district)
    if commodity:
        query += " AND commodity = %s"
        params.append(commodity)
        
    query += " ORDER BY arrival_date DESC"
    
    cursor.execute(query, tuple(params))
    records = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {"status": "success", "data": records}

@app.post("/api/register")
def register_user(user: RegisterUser):
    if user.role not in ["farmer", "buyer"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")
        
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Dynamically select the table based on role
    table_name = "farmers" if user.role == "farmer" else "buyers"
    
    # Check if phone number already exists
    cursor.execute(f"SELECT * FROM {table_name} WHERE phone_number = %s", (user.phone_number,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Phone number already registered")
        
    hashed_pw = hash_password(user.password)
    
    try:
        # If registering a farmer, include the city and commodity fields
        if user.role == "farmer":
            cursor.execute(
                f"INSERT INTO {table_name} (full_name, phone_number, password_hash, city, commodity) VALUES (%s, %s, %s, %s, %s)",
                (user.full_name, user.phone_number, hashed_pw, user.city, user.commodity)
            )
        # If registering a buyer, standard insert
        else:
            cursor.execute(
                f"INSERT INTO {table_name} (full_name, phone_number, password_hash) VALUES (%s, %s, %s)",
                (user.full_name, user.phone_number, hashed_pw)
            )
        conn.commit()
        
        # Fetch the newly created user to return their data back to React
        cursor.execute(f"SELECT id, full_name, phone_number FROM {table_name} WHERE phone_number = %s", (user.phone_number,))
        new_user = cursor.fetchone()
        
        return {
            "status": "success", 
            "user": {
                "name": new_user['full_name'], 
                "phone": new_user['phone_number'],
                "role": user.role
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/api/login")
def login_user(user: LoginUser):
    if user.role not in ["farmer", "buyer"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Dynamically select the table based on role
    table_name = "farmers" if user.role == "farmer" else "buyers"
    
    hashed_pw = hash_password(user.password)
    
    cursor.execute(
        f"SELECT id, full_name, phone_number FROM {table_name} WHERE phone_number = %s AND password_hash = %s",
        (user.phone_number, hashed_pw)
    )
    db_user = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid phone number or password")
        
    return {
        "status": "success", 
        "user": {
            "name": db_user['full_name'], 
            "phone": db_user['phone_number'],
            "role": user.role
        }
    }

# --- New Endpoint for Buyer Dashboard ---
@app.get("/api/farmers")
def get_farmers(city: str = None, commodity: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    cursor = conn.cursor(dictionary=True)
    
    query = "SELECT id, full_name, phone_number, city, commodity FROM farmers WHERE 1=1"
    params = []
    
    # Use LIKE for flexible, case-insensitive text searching
    if city:
        query += " AND city LIKE %s"
        params.append(f"%{city}%")
    if commodity:
        query += " AND commodity LIKE %s"
        params.append(f"%{commodity}%")
        
    cursor.execute(query, tuple(params))
    farmers = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {"status": "success", "data": farmers}