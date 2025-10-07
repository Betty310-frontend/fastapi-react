# fastapi-react
점프 투 FastAPI를 FastAPI+MySQL, React+Typescript 조합으로 수정하여 실습

## 🚀 빠른 시작

### 1. 환경 변수 설정
```bash
# .env.example을 복사해서 .env.local 파일 생성
cp .env.example .env.local

# .env.local 파일을 열어서 실제 데이터베이스 정보로 수정
# SQLALCHEMY_DATABASE_URL=mysql+pymysql://{USER}:{YOUR_PASSWORD_HERE}@localhost:3306/{DATABASE_NAME}
```

### 2. Docker MySQL 실행 (권장)
```bash
# MySQL 컨테이너 실행
docker run --name myapi-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE={DATABASE_NAME} \
  -e MYSQL_USER={USER} \
  -e MYSQL_PASSWORD={YOUR_PASSWORD_HERE} \
  -p 3306:3306 \
  -d mysql:8.0
```

### 3. 마이그레이션 실행
```bash
# 데이터베이스 테이블 생성
alembic upgrade head
```

### 4. 서버 실행
```bash
# FastAPI 서버 시작
/opt/anaconda3/envs/django_pro/bin/python run_server.py
```

## ⚠️ 보안 주의사항

- **절대 실제 비밀번호를 Git에 커밋하지 마세요**
- `.env.local` 파일은 Git에서 제외됩니다
- `.env.development`는 템플릿용이므로 실제 비밀번호 입력 금지
- `alembic.ini`에서도 실제 비밀번호 사용 금지

## 📁 프로젝트 구조

```
myapi/
├── main.py              # FastAPI 메인 앱
├── database.py          # 데이터베이스 연결
├── models.py            # SQLAlchemy 모델
├── config.py            # 환경 설정
├── migrations/          # Alembic 마이그레이션
├── .env.example         # 환경변수 템플릿
├── .env.local          # 실제 환경변수 (Git 제외)
└── frontend/           # React 프론트엔드
```

자세한 MySQL 설정은 [MYSQL_SETUP.md](./MYSQL_SETUP.md)를 참고하세요.
