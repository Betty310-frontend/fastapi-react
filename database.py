from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# 설정에서 데이터베이스 URL 가져오기
SQLALCHEMY_DATABASE_URL = settings.get_database_url()

# 데이터베이스별 connect_args 설정
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("mysql"):
    connect_args = {
        "charset": "utf8mb4",
        "use_unicode": True,
    }

# 데이터베이스 엔진 생성
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)

# 세션 로컬 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성
Base = declarative_base()

naming_convention = {
    'ix': 'ix_%(column_0_label)s',
    'uq': 'uq_%(table_name)s_%(column_0_name)s',
    'ck': 'ck_%(table_name)s_%(constraint_name)s',
    'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
    'pk': 'pk_%(table_name)s'
}
Base.metadata = MetaData(naming_convention=naming_convention)

# 데이터베이스 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 