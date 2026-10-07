from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

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