from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware  # 1. Importar el middleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import Usuario, get_db

app = FastAPI()

# 2. Configurar CORS para permitir que React (Vite) se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], # Ajusta si usas otro puerto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@app.post("/auth/login")
def login(credenciales: LoginSchema, db: Session = Depends(get_db)):
    # 1. Buscar al usuario real en PostgreSQL por email
    usuario_db = db.query(Usuario).filter(Usuario.s_email == credenciales.email).first()
    
    # 2. Validar si existe y si la contraseña coincide (actualmente en texto plano)
    if not usuario_db or usuario_db.s_password_hash != credenciales.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña inválidos"
        )
        
    # 3. Retornar los datos del usuario logueado
    return {
        "message": "Login exitoso",
        "usuario": {
            "nombre": usuario_db.s_nombre,
            "email": usuario_db.s_email,
            "rol": usuario_db.s_rol
        },
        "token": "token_jwt_temporal" # Esto lo cambiaremos por un JWT real después
    }