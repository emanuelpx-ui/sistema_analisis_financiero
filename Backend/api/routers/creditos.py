from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func

from core.database import Cliente, Credito, AlertaRiesgo, get_db

router = APIRouter(prefix="/api/creditos", tags=["Créditos"])

class CreditoNuevo(BaseModel):
    s_nombre_completo: str
    s_rfc: str
    s_municipio: str
    s_giro_comercial: str
    n_monto_otorgado: float = Field(gt=0, description="El monto debe ser mayor a 0")
    n_tasa_interes: float = Field(ge=0, description="La tasa no puede ser negativa")
    n_plazo_meses: int = Field(gt=0, description="El plazo debe ser de al menos 1 mes")

@router.get("")
def obtener_creditos(db: Session = Depends(get_db)):
    creditos_db = db.query(Credito).all()
    resultado = []
    for credito in creditos_db:
        resultado.append({
            "id_credito": credito.id,
            "cliente": credito.cliente.s_nombre_completo if credito.cliente else None,
            "rfc": credito.cliente.s_rfc if credito.cliente else None,
            "monto": float(credito.n_monto_otorgado),
            "tasa": float(credito.n_tasa_interes),
            "plazo": credito.n_plazo_meses,
            "fecha_inicio": credito.f_fecha_inicio,
            "estado": credito.s_estado,
            "score_riesgo": float(credito.n_score_riesgo)
        })
    return resultado

@router.post("")
def crear_credito(datos: CreditoNuevo, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.s_rfc == datos.s_rfc).first()
    
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

@router.get("/kpis")
def obtener_kpis_dashboard(db: Session = Depends(get_db)):
    total_creditos = db.query(func.count(Credito.id)).scalar() or 0
    monto_total = db.query(func.sum(Credito.n_monto_otorgado)).scalar() or 0.0
    
    creditos_en_riesgo = db.query(func.count(Credito.id)).filter(Credito.s_estado == "En riesgo").scalar() or 0
    creditos_vencidos = db.query(func.count(Credito.id)).filter(Credito.s_estado == "Vencido").scalar() or 0
    
    porcentaje_riesgo = (creditos_en_riesgo / total_creditos * 100) if total_creditos > 0 else 0.0

    return {
        "total_creditos": total_creditos,
        "monto_total_otorgado": float(monto_total),
        "creditos_en_riesgo": creditos_en_riesgo,
        "creditos_vencidos": creditos_vencidos,
        "porcentaje_riesgo": round(porcentaje_riesgo, 2)
    }