import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

MODEL_PATH = os.path.join(os.path.dirname(__file__), "modelo_riesgo.pkl")

def entrenar_modelo_sintetico():
    """
    Entrena un modelo base con datos de prueba si no existe un archivo .pkl previo.
    """
    # X: [monto_otorgado, tasa_interes, plazo_meses]
    np.random.seed(42)
    # Aumentamos los montos de simulación hasta $500,000
    X_train = np.random.rand(500, 3) * np.array([500000, 30, 48])
    
    # Ecuación calibrada: Montos muy altos o tasas altas con plazos cortos = Riesgo
    # Se ajusta el multiplicador del monto a 0.000005 y el umbral a 1.5
    y_train = (X_train[:, 0] * 0.000005 + X_train[:, 1] * 0.04 - X_train[:, 2] * 0.01 > 1.5).astype(int)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    joblib.dump(model, MODEL_PATH)
    return model

def cargar_modelo():
    """
    Carga el modelo guardado en disco o entrena uno rápido en el primer arranque.
    """
    if os.path.exists(MODEL_PATH):
        try:
            return joblib.load(MODEL_PATH)
        except Exception:
            return entrenar_modelo_sintetico()
    else:
        return entrenar_modelo_sintetico()

# Instancia global del modelo
ml_model = cargar_modelo()

def evaluar_riesgo_credito(monto: float, tasa: float, plazo: int):
    """
    Evalúa las condiciones financieras del crédito y devuelve el score predictivo.
    """
    features = np.array([[monto, tasa, plazo]])
    
    # Calcular la probabilidad del evento de impago (Clase 1)
    probabilidades = ml_model.predict_proba(features)
    prob_impago = float(probabilidades[0][1]) if probabilidades.shape[1] > 1 else float(probabilidades[0][0])
    
    # Clasificación por umbrales de negocio
    if prob_impago >= 0.50:
        nivel_riesgo = "Alto"
        recomendacion = "Requiere supervisión prioritaria y comité de garantías."
    elif prob_impago >= 0.25:
        nivel_riesgo = "Medio"
        recomendacion = "Realizar monitoreo preventivo de pagos quincenales."
    else:
        nivel_riesgo = "Bajo"
        recomendacion = "Aprobación regular sin condiciones especiales."

    return {
        "probabilidad_impago": round(prob_impago, 4),
        "nivel_riesgo": nivel_riesgo,
        "recomendacion": recomendacion
    }