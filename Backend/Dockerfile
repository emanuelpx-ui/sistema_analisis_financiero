FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar psycopg2 si fuera necesario
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . .

# Exponer el puerto de FastAPI
EXPOSE 8000

# Comando para correr la API con recarga automática en desarrollo
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]