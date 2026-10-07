import httpx
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

# Importación unificada desde core.database
from core.database import get_db, Credito, Cliente, AlertaRiesgo
from ml.model import evaluar_riesgo_credito

router = APIRouter(prefix="/api/riesgo", tags=["Análisis de Riesgo"])


async def enviar_webhook_alerta(alerta_payload: dict):
    """
    Notifica a un sistema externo vía Webhook cuando hay un crédito con riesgo alto (HU-009).
    """
    webhook_url = "https://discord.com/api/webhooks/1557488707517423647/4x4Lce6SGix5pyD1l8XuvjXHCuV4ZNhYVTGp1m9807FYwHiLbaE8gQ5kwMdHT-6ulqNs"
    try:
        async with httpx.AsyncClient() as client:
            await client.post(webhook_url, json=alerta_payload, timeout=5.0)
    except Exception as e:
        print(f"[WEBHOOK WARNING] No se pudo enviar la notificación: {e}")

@router.get("")
def obtener_historial_alertas(db: Session = Depends(get_db)):
    # Consulta la tabla AlertaRiesgo ordenando de la más reciente a la más antigua
    alertas = db.query(AlertaRiesgo).order_by(AlertaRiesgo.id.desc()).all()
    return alertas

@router.post("/evaluar/{id_credito}", status_code=status.HTTP_201_CREATED)
def evaluar_riesgo_credito_endpoint(
    id_credito: int, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # 1. Obtener crédito de la base de datos
    credito = db.query(Credito).filter(Credito.id == id_credito).first()
    if not credito:
        raise HTTPException(status_code=404, detail="Crédito no encontrado")

    # 2. Ejecutar inferencia del modelo ML (Scikit-learn)
    resultado_ml = evaluar_riesgo_credito(
        monto=float(credito.n_monto_otorgado),
        tasa=float(credito.n_tasa_interes),
        plazo=int(credito.n_plazo_meses)
    )

    # 3. Registrar en la tabla alerta_riesgo
    nueva_alerta = AlertaRiesgo(
        id_credito=credito.id,
        n_probabilidad_impago=resultado_ml["probabilidad_impago"],
        s_nivel_riesgo=resultado_ml["nivel_riesgo"].upper(),
        s_recomendacion=resultado_ml["recomendacion"]
    )
    db.add(nueva_alerta)

    # 4. Actualizar estado y score en la tabla credito
    credito.n_score_riesgo = resultado_ml["probabilidad_impago"]
    
    nivel = resultado_ml["nivel_riesgo"].upper()
    if nivel == "ALTO":
        credito.s_estado = "En riesgo"
    elif nivel in ["MEDIO", "BAJO"]:
        credito.s_estado = "Al corriente"


    # 5. Disparo de Webhook en segundo plano si el riesgo es ALTO (HU-009)
    if resultado_ml["nivel_riesgo"].upper() == "ALTO":
        payload = {
            "evento": "ALERTA_RIESGO_ALTO",
            "id_credito": credito.id,
            "probabilidad_impago": resultado_ml["probabilidad_impago"],
            "nivel_riesgo": resultado_ml["nivel_riesgo"],
            "recomendacion": resultado_ml["recomendacion"]
        }
        background_tasks.add_task(enviar_webhook_alerta, payload)

    return {
        "mensaje": "Evaluación de riesgo completada correctamente",
        "id_credito": credito.id,
        "probabilidad_impago": resultado_ml["probabilidad_impago"],
        "nivel_riesgo": resultado_ml["nivel_riesgo"],
        "recomendacion": resultado_ml["recomendacion"]
    }

