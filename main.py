from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from config import settings

app = FastAPI(
    title="FastAPI React Backend",
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/hello")
def hello():
    return {"message": "안녕하세요, 파이보"}