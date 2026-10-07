from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware  # 1. Importar el middleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import Usuario, Cliente, Credito, get_db
from pydantic import BaseModel, Field
from datetime import date

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

@app.get("/api/creditos")
def obtener_creditos(db: Session = Depends(get_db)):
    # Hacemos la consulta a la tabla de créditos
    creditos_db = db.query(Credito).all()
    
    # Formateamos la respuesta para que el frontend la consuma fácilmente
    resultado = []
    for credito in creditos_db:
        resultado.append({
            "id_credito": credito.id,
            "cliente": credito.cliente.s_nombre_completo,
            "rfc": credito.cliente.s_rfc,
            "monto": float(credito.n_monto_otorgado),
            "tasa": float(credito.n_tasa_interes),
            "plazo": credito.n_plazo_meses,
            "fecha_inicio": credito.f_fecha_inicio,
            "estado": credito.s_estado,
            "score_riesgo": float(credito.n_score_riesgo)
        })
        
    return resultado

# Esquema para validar los datos que enviará React
class CreditoNuevo(BaseModel):
    s_nombre_completo: str
    s_rfc: str
    s_municipio: str
    s_giro_comercial: str
    # Validaciones estrictas: gt=0 (greater than 0), ge=0 (greater or equal to 0)
    n_monto_otorgado: float = Field(gt=0, description="El monto debe ser mayor a 0")
    n_tasa_interes: float = Field(ge=0, description="La tasa no puede ser negativa")
    n_plazo_meses: int = Field(gt=0, description="El plazo debe ser de al menos 1 mes")

@app.post("/api/creditos")
def crear_credito(datos: CreditoNuevo, db: Session = Depends(get_db)):
    # 1. Buscar si el cliente ya existe por RFC para no duplicarlo
    cliente = db.query(Cliente).filter(Cliente.s_rfc == datos.s_rfc).first()
    
    # 2. Si no existe, lo creamos
    if not cliente:
        cliente = Cliente(
            s_nombre_completo=datos.s_nombre_completo,
            s_rfc=datos.s_rfc,
            s_municipio=datos.s_municipio,
            s_giro_comercial=datos.s_giro_comercial
        )
        db.add(cliente)
        db.commit()
        db.refresh(cliente)
        
    # 3. Creamos el crédito asociado a ese cliente
    nuevo_credito = Credito(
        id_cliente=cliente.id,
        n_monto_otorgado=datos.n_monto_otorgado,
        n_tasa_interes=datos.n_tasa_interes,
        n_plazo_meses=datos.n_plazo_meses,
        f_fecha_inicio=date.today(),
        s_estado="Al corriente",
        n_score_riesgo=0.0000
    )
    
    db.add(nuevo_credito)
    db.commit()
    
    return {"mensaje": "Crédito registrado exitosamente"}