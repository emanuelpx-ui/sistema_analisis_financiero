from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    nombre: str
    email: str
    rol: str

    class Config:
        from_attributes = True