from sqlalchemy.orm import Session
import bcrypt

from domain.user.user_schema import UserCreate
from models import User

def _hash_password(password: str) -> str:
    """
    bcrypt를 직접 사용하여 비밀번호 해시화
    72바이트 제한을 안전하게 처리
    """
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    평문 비밀번호와 해시된 비밀번호를 비교
    """
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))

def create_user(db: Session, user_create: UserCreate):
    hashed_password = _hash_password(user_create.password1)
    db_user = User(username=user_create.username, password=hashed_password, email=user_create.email)
    db.add(db_user)
    db.commit()

def get_existing_user(db: Session, user_create: UserCreate):
    return db.query(User).filter((User.username == user_create.username) | (User.email == user_create.email)).first()

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()