from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from core.database import Usuario, get_db 
from api.routers import creditos, riesgo

app = FastAPI()

# Configurar CORS para permitir que React (Vite) se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers modularizados
app.include_router(creditos.router)
app.include_router(riesgo.router)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@app.post("/auth/login")
def login(credenciales: LoginSchema, db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.s_email == credenciales.email).first()
    
    if not usuario_db or usuario_db.s_password_hash != credenciales.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña inválidos"
        )
        
    return {
        "message": "Login exitoso",
        "usuario": {
            "nombre": usuario_db.s_nombre,
            "email": usuario_db.s_email,
            "rol": usuario_db.s_rol
        },
        "token": "token_jwt_temporal"
    }