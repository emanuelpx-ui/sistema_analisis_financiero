from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = FastAPI(
    title="API de Sistema de Análisis Financiero",
    version="1.0.0",
    description="Backend oficial para FOFOMI Inteligente"
)

# Configurar CORS para permitir comunicación con el Frontend (React + Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción se restringirá al dominio del front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "¡Bienvenido a la API de FOFOMI Inteligente!",
        "status": "activo",
        "env": os.getenv("APP_ENV", "development")
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}