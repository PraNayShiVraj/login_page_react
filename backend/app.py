from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt

from database import supabase

app = FastAPI()

# ---------------------------
# CORS (React connection)
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # CRA
        "http://localhost:5173"   # Vite
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


# ---------------------------
# SIGNUP
# ---------------------------
@app.post("/signup")
def signup(user: User):
    try:
        # Check if user exists
        existing = supabase.table("users") \
            .select("id") \
            .eq("email", user.email) \
            .execute()

        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Hash password
        hashed_pw = bcrypt.hashpw(
            user.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # Insert user
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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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