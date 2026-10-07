from sqlalchemy import create_engine, Column, Integer, String, Numeric, Date, Text, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy.sql import func

# URL de conexión (localhost)
DATABASE_URL = "postgresql+psycopg2://app_user:12345@localhost:5439/analisis_financiero_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Dependencia para inyectar la sesión en FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Usuario(Base):
    __tablename__ = "usuario"
    
    id = Column(Integer, primary_key=True, index=True)
    s_nombre = Column(String)
    s_email = Column(String, unique=True, index=True)
    s_password_hash = Column(String)
    s_rol = Column(String)


class Cliente(Base):
    __tablename__ = "cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    s_nombre_completo = Column(String(150), nullable=False)
    s_rfc = Column(String(13), unique=True, nullable=False)
    s_municipio = Column(String(100), nullable=False)
    s_giro_comercial = Column(String(100), nullable=False)
    
    # Relación inversa para consultar los créditos desde el cliente
    creditos = relationship("Credito", back_populates="cliente")


class Credito(Base):
    __tablename__ = "credito"
    
    id = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("cliente.id", ondelete="CASCADE"))
    n_monto_otorgado = Column(Numeric(12, 2), nullable=False)
    n_tasa_interes = Column(Numeric(5, 2), nullable=False)
    n_plazo_meses = Column(Integer, nullable=False)
    f_fecha_inicio = Column(Date, nullable=False)
    s_estado = Column(String(50), nullable=False)
    n_score_riesgo = Column(Numeric(5, 4), default=0.0000)
    
    # Relación directa con el cliente
    cliente = relationship("Cliente", back_populates="creditos")
    # Relación bidireccional con las alertas de riesgo
    alertas = relationship("AlertaRiesgo", back_populates="credito")


class AlertaRiesgo(Base):
    __tablename__ = "alerta_riesgo"

    id = Column(Integer, primary_key=True, index=True)
    # CORREGIDO: "credito.id" en singular para coincidir con Credito.__tablename__
    id_credito = Column(Integer, ForeignKey("credito.id"), nullable=False)
    n_probabilidad_impago = Column(Numeric(5, 4), nullable=False)
    s_nivel_riesgo = Column(String(20), nullable=False)
    s_recomendacion = Column(Text, nullable=True)
    f_created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relación con el modelo Credito
    credito = relationship("Credito", back_populates="alertas")