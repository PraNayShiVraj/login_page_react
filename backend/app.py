from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt
import os # To load your Client ID if using environment variables
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
load_dotenv() # This loads your .env file into os.environ


from database import supabase

app = FastAPI()
YOUR_GOOGLE_CLIENT_ID=os.getenv("VITE_GOOGLE_CLIENT_ID")

# ---------------------------
# CORS (React connection)
# ---------------------------
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://login-page-react.onrender.com",
        ALLOWED_ORIGIN
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Request Models
# ---------------------------
class User(BaseModel):
    name: str
    email: str
    password: str
    phonenumber: str


class LoginUser(BaseModel):
    email: str
    password: str


class GoogleToken(BaseModel):
    token: str


@app.post("/auth/google")
async def google_auth(data: GoogleToken):
    try:
        # Debugging prints (minimal changes)
        print(f"DEBUG: Using Client ID: {YOUR_GOOGLE_CLIENT_ID}")
        
        # 1. Verify the token with Google
        id_info = id_token.verify_oauth2_token(
            data.token, 
            requests.Request(), 
            YOUR_GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10  # Allows for small time differences
        )

        email = id_info.get("email")
        name = id_info.get("name")
        google_id = id_info.get("sub")
        print(f"DEBUG: Authenticated {email}")

        # 2. Check if user exists in Supabase
        response = supabase.table("users") \
            .select("*") \
            .eq("email", email) \
            .execute()

        if not response.data:
            # 3. Create a new user if they don't exist
            # Note: We leave 'password' empty or set a placeholder for Google users
            new_user = supabase.table("users").insert({
                "name": name,
                "email": email,
                "password": "GOOGLE_AUTH_USER", 
                "phonenumber": "" # Or get this from Google if scopes allow
            }).execute()
            db_user = new_user.data[0]
        else:
            db_user = response.data[0]

        return {
            "message": "Google Login successful",
            "user": {
                "id": db_user["id"],
                "name": db_user["name"],
                "email": db_user["email"]
            }
        }

    except ValueError as e:
        print(f"DEBUG: Google Auth ValueError: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")
    except Exception as e:
        print(f"DEBUG: Google Auth Generic Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------
# SIGNUP
# ---------------------------
@app.post("/signup")
def signup(user: User):
    print(f"DEBUG: Received signup request for {user.email}")
    try:
        # 1. Check if user exists
        existing = supabase.table("users") \
            .select("id") \
            .eq("email", user.email) \
            .execute()

        if existing.data:
            # We want this to go straight to the frontend, NOT be caught by 'except Exception'
            raise HTTPException(status_code=400, detail="Email already registered")

        # 2. Hash password
        hashed_pw = bcrypt.hashpw(
            user.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # 3. Insert user
        response = supabase.table("users").insert({
            "name": user.name,
            "email": user.email,
            "password": hashed_pw,
            "phonenumber": user.phonenumber
        }).execute()

        return {
            "message": "User created successfully",
            "user": response.data
        }

    except HTTPException as http_err:
        # Re-raise the 400 error so FastAPI handles it correctly
        raise http_err
    except Exception as e:
        # Catch genuine server crashes (database down, etc.)
        print(f"Server Error: {e}") # Log this in Render so you can see it
        raise HTTPException(status_code=500, detail="Internal Server Error")

# ---------------------------
# LOGIN
# ---------------------------
@app.post("/login")
def login(user: LoginUser):
    try:
        # Get user from DB
        response = supabase.table("users") \
            .select("*") \
            .eq("email", user.email) \
            .execute()

        if not response.data:
            raise HTTPException(status_code=400, detail="User not found")

        db_user = response.data[0]

        # Check password
        if not bcrypt.checkpw(
            user.password.encode("utf-8"),
            db_user["password"].encode("utf-8")
        ):
            raise HTTPException(status_code=400, detail="Invalid password")

        return {
            "message": "Login successful",
            "user": {
                "id": db_user["id"],
                "name": db_user["name"],
                "email": db_user["email"]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------
# TEST ROUTE
# ---------------------------
@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}