from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request
from fastapi.exceptions import RequestValidationError
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from config import settings
from database import get_db, engine
from models import Base

from domain.question import question_router
from domain.answer import answer_router
from domain.user import user_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown (cleanup code can go here if needed)

app = FastAPI(
    title="FastAPI React Backend",
    debug=settings.DEBUG,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(question_router.router)
app.include_router(answer_router.router)
app.include_router(user_router.router)

# Validation Error 핸들러 추가
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error on {request.method} {request.url}")
    print(f"Request headers: {request.headers}")
    print(f"Validation errors: {exc.errors()}")
    try:
        body = await request.body()
        print(f"Request body: {body}")
    except:
        print("Could not read request body")
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "message": "Validation error occurred. Check server logs for details."
        }
    )

@app.get("/db-test")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        # 데이터베이스 연결 테스트
        result = db.execute(text("SELECT 1"))
        return {"status": "success", "message": "MySQL 데이터베이스 연결 성공"}
    except Exception as e:
        return {"status": "error", "message": f"데이터베이스 연결 실패: {str(e)}"}