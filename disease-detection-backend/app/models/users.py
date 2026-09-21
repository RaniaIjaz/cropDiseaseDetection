from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    userName: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    userName: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
    
class RequestOTP(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    otp: str
    new_password: str
    
class UserToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    id: str
    userName: str
    email: EmailStr

