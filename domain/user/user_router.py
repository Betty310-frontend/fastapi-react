import os
from datetime import timedelta, datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.orm import Session
from starlette import status
from dotenv import load_dotenv

from database import get_db
from domain.user import user_crud, user_schema

# 환경변수 로드
load_dotenv()

# JWT 설정을 환경변수에서 가져오기
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# SECRET_KEY가 없으면 에러 발생
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is required")

router = APIRouter(
    prefix='/api/user'
)

@router.post('/create', status_code=status.HTTP_204_NO_CONTENT)
def user_create(_user_create: user_schema.UserCreate, db: Session=Depends(get_db)):
    user = user_crud.get_existing_user(db, user_create=_user_create)
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="이미 존재하는 사용자입니다.")
    user_crud.create_user(db=db, user_create=_user_create)

@router.post('/login', response_model=user_schema.Token)
def login_for_access_token(login_data: user_schema.UserLogin, db: Session = Depends(get_db)):
    user = user_crud.get_user(db, login_data.username)
    if not user or not user_crud.verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={"WWW-Authenticate": "Bearer"}
        )

    data = {
        'sub': user.username,
        'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'username': user.username
    }

# OAuth2 형식의 로그인도 지원 (기존 호환성을 위해)
@router.post('/login/oauth2', response_model=user_schema.Token)
def login_oauth2_format(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = user_crud.get_user(db, form_data.username)
    if not user or not user_crud.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={"WWW-Authenticate": "Bearer"}
        )

    data = {
        'sub': user.username,
        'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'username': user.username
    }