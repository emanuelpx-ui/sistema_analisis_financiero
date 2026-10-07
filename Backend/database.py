from sqlalchemy import create_engine, Column, Integer, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# URL de conexión (localhost porque uvicorn corre en tu terminal, no en Docker aún)
DATABASE_URL = "postgresql+psycopg2://app_user:12345@localhost:5439/analisis_financiero_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Mapeamos la tabla que creó Flyway
class Usuario(Base):
    __tablename__ = "usuario"
    
    id = Column(Integer, primary_key=True, index=True)
    s_nombre = Column(String)
    s_email = Column(String, unique=True, index=True)
    s_password_hash = Column(String)
    s_rol = Column(String)

# Dependencia para inyectar la sesión en FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    
    # Relación directa para acceder a los datos del cliente desde el crédito
    cliente = relationship("Cliente", back_populates="creditos")