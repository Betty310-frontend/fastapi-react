"""
Environment configuration utility for FastAPI backend
백엔드 환경 설정 유틸리티
"""
import os
from dotenv import load_dotenv
from typing import List

# .env 파일 로드
load_dotenv()

class Settings:
    """환경 설정 클래스"""
    
    # 데이터베이스 설정
    SQLALCHEMY_DATABASE_URL: str = os.getenv("SQLALCHEMY_DATABASE_URL", "sqlite:///./myapi.db")
    
    # 환경 설정
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # 서버 설정
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS 설정
    ALLOWED_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    ]
    
    # 로깅 설정
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # 보안 설정
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-this")
    
    # 개발자 설정
    DEVELOPER_MODE: bool = os.getenv("DEVELOPER_MODE", "false").lower() == "true"
    ENABLE_PROFILING: bool = os.getenv("ENABLE_PROFILING", "false").lower() == "true"
    
    @classmethod
    def is_development(cls) -> bool:
        """개발 환경 여부 확인"""
        return cls.ENVIRONMENT in ["development", "local"]
    
    @classmethod
    def is_production(cls) -> bool:
        """프로덕션 환경 여부 확인"""
        return cls.ENVIRONMENT == "production"
    
    @classmethod
    def get_database_url(cls) -> str:
        """데이터베이스 URL 반환"""
        return cls.SQLALCHEMY_DATABASE_URL
    
    @classmethod
    def print_config(cls) -> None:
        """설정 정보 출력 (개발 환경에서만)"""
        if cls.is_development():
            print("🔧 Backend Configuration:")
            print(f"   Environment: {cls.ENVIRONMENT}")
            print(f"   Debug: {cls.DEBUG}")
            print(f"   Database: {cls.SQLALCHEMY_DATABASE_URL}")
            print(f"   Host: {cls.HOST}:{cls.PORT}")
            print(f"   CORS Origins: {cls.ALLOWED_ORIGINS}")

# 전역 설정 인스턴스
settings = Settings()

# 개발 환경에서 설정 정보 출력
if settings.is_development() and settings.DEBUG:
    settings.print_config()
