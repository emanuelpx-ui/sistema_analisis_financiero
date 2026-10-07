from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import sys
import os

# Asegurarnos de que Airflow encuentre tu script del backend
sys.path.append('/opt/airflow/backend') # Ajusta esta ruta según tus volúmenes de Docker

from etl_historicos import ejecutar_etl

# Argumentos por defecto del pipeline
default_args = {
    'owner': 'equipo_software',
    'depends_on_past': False,
    'start_date': datetime(2026, 10, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Definición del DAG (Se ejecutará todos los días a la medianoche)
with DAG(
    'ingesta_historicos_fofomi',
    default_args=default_args,
    description='Pipeline ETL para cargar CSV de créditos a PostgreSQL',
    schedule_interval='@daily',
    catchup=False,
) as dag:

    tarea_ingesta = PythonOperator(
        task_id='extraer_y_cargar_csv',
        python_callable=ejecutar_etl,
        op_kwargs={'ruta_csv': '/opt/airflow/datos/datos_historicos.csv'} # Ruta dentro del contenedor
    )

    tarea_ingesta