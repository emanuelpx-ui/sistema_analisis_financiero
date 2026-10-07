import pandas as pd
from core.database import SessionLocal, Cliente, Credito

def ejecutar_etl(ruta_csv: str):
    print(f"Iniciando extracción de datos desde: {ruta_csv}")
    
    # 1. Extracción (Extract)
    try:
        df = pd.read_csv(ruta_csv)
    except FileNotFoundError:
        print("Error: No se encontró el archivo CSV.")
        return

    # 2. Transformación (Transform)
    print("Aplicando reglas de limpieza y estandarización...")
    # Forzar mayúsculas y limpiar espacios en blanco extra
    columnas_texto = ['NOMBRE_COMPLETO', 'RFC', 'MUNICIPIO', 'GIRO_COMERCIAL']
    for col in columnas_texto:
        df[col] = df[col].astype(str).str.upper().str.strip()
    
    # 3. Carga (Load)
    print("Conectando a la base de datos PostgreSQL...")
    db = SessionLocal()
    registros_insertados = 0
    
    try:
        for index, row in df.iterrows():
            # Buscar si el cliente ya existe por su RFC
            cliente = db.query(Cliente).filter(Cliente.s_rfc == row['RFC']).first()
            
            if not cliente:
                cliente = Cliente(
                    s_nombre_completo=row['NOMBRE_COMPLETO'],
                    s_rfc=row['RFC'],
                    s_municipio=row['MUNICIPIO'],
                    s_giro_comercial=row['GIRO_COMERCIAL']
                )
                db.add(cliente)
                db.commit()
                db.refresh(cliente)
            
            # Insertar el crédito asociándolo al ID del cliente (nuevo o existente)
            nuevo_credito = Credito(
                id_cliente=cliente.id,
                n_monto_otorgado=float(row['MONTO']),
                n_tasa_interes=float(row['TASA']),
                n_plazo_meses=int(row['PLAZO']),
                f_fecha_inicio=pd.to_datetime(row['FECHA_INICIO']).date(),
                s_estado=str(row['ESTADO']).strip().capitalize(), # Asegura formato como 'Al corriente'
                n_score_riesgo=0.0000
            )
            db.add(nuevo_credito)
            registros_insertados += 1
            
        db.commit()
        print(f"ETL Completado. Se procesaron e insertaron {registros_insertados} créditos en la cartera.")
        
    except Exception as e:
        db.rollback()
        print(f"Ocurrió un error durante la carga, se revirtieron los cambios: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    ejecutar_etl("datos_historicos.csv")