from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# 설정에서 데이터베이스 URL 가져오기
SQLALCHEMY_DATABASE_URL = settings.get_database_url()

# SQLite의 경우 connect_args 설정
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# 데이터베이스 엔진 생성
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)

# 세션 로컬 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성
Base = declarative_base()

# 데이터베이스 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 