from fastapi import APIRouter, Depends, HTTPException, status
from app.models.users import UserCreate, UserLogin, UserOut, Token,UserToken
from app.db.mongo import users_collection
from app.utils.utils import hash_password, verify_password, create_access_token, decode_access_token
from bson import ObjectId
from datetime import datetime, timedelta
import random
from fastapi import Body
from app.utils.sendEmail import send_email
from pydantic import EmailStr


auth_router = APIRouter(prefix="/auth", tags=["Auth"])

# @auth_router.post("/register", response_model=Token)
# async def register(user: UserCreate):
#     existing = await users_collection.find_one({"email": user.email})
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed = hash_password(user.password)
#     user_doc = {
#         "email": user.email,
#         "userName": user.userName,
#         "password": hashed,
#     }

#     result = await users_collection.insert_one(user_doc)

#     # Generate token for the new user
#     token = create_access_token({"sub": str(result.inserted_id)})

#     # Return token and user info together
#     return {
#         "access_token": token,
#         "id": str(result.inserted_id),
#         "email": user.email,
#         "userName": user.userName,
#     }

@auth_router.post("/register", response_model=UserToken)
async def register(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)
    user_doc = {"email": user.email, "userName": user.userName, "password": hashed}

    result = await users_collection.insert_one(user_doc)
    token = create_access_token({"sub": str(result.inserted_id)})

    return {
        "access_token": token,
        "id": str(result.inserted_id),
        "email": user.email,
        "userName": user.userName,
    }




@auth_router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid emaill or password")

    token = create_access_token({"sub": str(db_user["_id"])})
    return {"access_token": token}


async def get_current_user(token: str):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": str(user["_id"]),  "email": user["email"],"userName": user["userName"]}



@auth_router.get("/users", response_model=list[UserOut])
async def get_users():
    users = []
    async for u in users_collection.find({}, {"password": 0}):
        users.append({"id": str(u["_id"]), "email": u["email"],"userName": u.get("userName", "")})
    return users


@auth_router.get("/me", response_model=UserOut)
async def get_me(token: str):
    return await get_current_user(token)




@auth_router.post("/forget-password")
async def forget_password(email: EmailStr = Body(...)):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=10)  # OTP valid for 10 mins

    await users_collection.update_one(
        {"email": email},
        {"$set": {"resetOTP": otp, "otpExpiry": expiry}}
    )

    # Send email
    await send_email(
        subject="Password Reset OTP",
        email=email,
        body=f"Your OTP for password reset is {otp}. It expires in 10 minutes."
    )
    return {"msg": "OTP sent to your email"}


@auth_router.post("/reset-password")
async def reset_password(email: EmailStr = Body(...), otp: str = Body(...), new_password: str = Body(...)):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if "resetOTP" not in user or "otpExpiry" not in user:
        raise HTTPException(status_code=400, detail="OTP not requested")

    if user["resetOTP"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > user["otpExpiry"]:
        raise HTTPException(status_code=400, detail="OTP expired")

    hashed = hash_password(new_password)
    await users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed}, "$unset": {"resetOTP": "", "otpExpiry": ""}}
    )

    return {"msg": "Password updated successfully"}

