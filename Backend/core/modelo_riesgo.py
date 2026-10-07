import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os
from core.database import SessionLocal, Credito, AlertaRiesgo

RUTA_MODELO = "modelo_fofomi.pkl"

def entrenar_modelo():
    """Lee datos reales de PostgreSQL, transforma variables y entrena el Random Forest."""
    db = SessionLocal()
    try:
        query = """
            SELECT 
                c.n_monto_otorgado,
                c.n_tasa_interes,
                c.n_plazo_meses,
                cl.s_giro_comercial,
                c.s_estado
            FROM credito c
            JOIN cliente cl ON c.id_cliente = cl.id
        """
        df = pd.read_sql(query, db.bind)

        if len(df) < 5:
            print("No hay suficientes registros en la BD para entrenar el modelo.")
            return False

        # Variable objetivo: 1 si cayó en incumplimiento/riesgo, 0 si está sano
        df['target_default'] = df['s_estado'].apply(
            lambda x: 1 if x in ['En riesgo', 'Vencido'] else 0
        )

        # One-Hot Encoding para giros comerciales (categoría a numérico)
        df = pd.get_dummies(df, columns=['s_giro_comercial'], drop_first=False)

        # Definir X e y
        columnas_features = [col for col in df.columns if col not in ['s_estado', 'target_default']]
        X = df[columnas_features]
        y = df['target_default']

        # Entrenar modelo
        modelo = RandomForestClassifier(n_estimators=100, random_state=42)
        modelo.fit(X, y)

        # Guardar objeto del modelo y la lista de columnas esperadas
        joblib.dump({'modelo': modelo, 'columnas': columnas_features}, RUTA_MODELO)
        print("¡Modelo ML de FOFOMI entrenado y guardado correctamente!")
        return True

    finally:
        db.close()


def predecir_riesgo_credito(monto: float, tasa: float, plazo: int, giro_comercial: str):
    """
    Evalúa un nuevo crédito y retorna:
    - Probabilidad de impago (0.0 a 1.0)
    - Clasificación de nivel ('BAJO', 'MEDIO', 'ALTO')
    - Recomendación del sistema
    """
    if not os.path.exists(RUTA_MODELO):
        raise FileNotFoundError("El modelo no está entrenado. Ejecute entrenar_modelo() primero.")

    paquete_ml = joblib.load(RUTA_MODELO)
    modelo = paquete_ml['modelo']
    columnas_esperadas = paquete_ml['columnas']

    # Crear DataFrame con el nuevo crédito
    dict_entrada = {
        'n_monto_otorgado': [monto],
        'n_tasa_interes': [tasa],
        'n_plazo_meses': [plazo]
    }
    
    # Rellenar dummies de giro comercial
    for col in columnas_esperadas:
        if col.startswith('s_giro_comercial_'):
            giro_nombre = col.replace('s_giro_comercial_', '')
            dict_entrada[col] = [1 if giro_comercial == giro_nombre else 0]

    df_cliente = pd.DataFrame(dict_entrada)
    df_cliente = df_cliente.reindex(columns=columnas_esperadas, fill_value=0)

    # Predicción de probabilidad
    prob_default = float(modelo.predict_proba(df_cliente)[0][1])

    # Determinar categoría y recomendación
    if prob_default < 0.30:
        nivel = "BAJO"
        recomendacion = "Aprobación sugerida. Perfil crediticio estable."
    elif prob_default < 0.65:
        nivel = "MEDIO"
        recomendacion = "Requiere aval o garantía adicional antes de aprobar."
    else:
        nivel = "ALTO"
        recomendacion = "Rechazo sugerido. Alto riesgo de mora."

    return prob_default, nivel, recomendacion


if __name__ == "__main__":
    entrenar_modelo()