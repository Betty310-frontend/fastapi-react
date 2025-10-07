# MySQL 개발 환경 설정 가이드
> 저는 Docker + Mysql 환경으로 개발했습니다.

## MySQL 설치 및 설정

### 1. MySQL 설치 (macOS)
```bash
# Homebrew로 설치
brew install mysql

# MySQL 서버 시작
brew services start mysql

# MySQL 보안 설정 (옵션)
mysql_secure_installation
```

### 2. 데이터베이스 생성
```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE myapi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE myapi_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용자 생성 (옵션)
CREATE USER 'myapi_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON myapi_db.* TO 'myapi_user'@'localhost';
GRANT ALL PRIVILEGES ON myapi_dev.* TO 'myapi_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### 3. 환경 변수 설정
`.env.local` 파일에서 본인의 MySQL 정보로 수정:
```bash
SQLALCHEMY_DATABASE_URL=mysql+pymysql://root:본인비밀번호@localhost:3306/myapi_dev
```

### 4. 마이그레이션 실행
```bash
# 기존 SQLite 마이그레이션 삭제 (옵션)
rm -rf migrations/versions/*

# 새 마이그레이션 생성
alembic revision --autogenerate -m "Initial migration for MySQL"

# 마이그레이션 적용
alembic upgrade head
```

## 🐳 Docker로 MySQL 실행 (권장)

### 0️⃣ Docker Desktop 설치 (필요한 경우)

#### Docker Desktop 설치:

**방법 1: 공식 웹사이트에서 다운로드**
1. https://www.docker.com/products/docker-desktop/ 접속
2. PC에 맞는 파일 Download
3. Docker Desktop 실행

**Docker Desktop 첫 실행:**
1. Applications 폴더에서 Docker.app 실행
2. "Use recommended settings" 선택
3. Docker 계정 로그인 (선택사항)
4. 상단 메뉴바에 🐳 아이콘이 나타나면 준비 완료

### 1️⃣ Docker 설치 확인
```bash
# Docker가 설치되어 있는지 확인
docker --version

# Docker가 실행 중인지 확인
docker ps
```

### 2️⃣ MySQL Docker 컨테이너 실행
```bash
# MySQL 8.0 컨테이너 실행 (한 번만 실행)
docker run --name myapi-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE={DATABASE_NAME} \
  -e MYSQL_USER={USER} \
  -e MYSQL_PASSWORD={YOUR_PASSWORD_HERE} \
  -p 3306:3306 \
  -d mysql:8.0
```

**명령어 설명:**
- `--name myapi-mysql`: 컨테이너 이름 지정
- `-e MYSQL_ROOT_PASSWORD=rootpassword`: root 비밀번호 설정
- `-e MYSQL_DATABASE={DATABASE_NAME}`: 자동으로 생성할 데이터베이스 이름
- `-e MYSQL_USER={USER}`: 새 사용자 생성
- `-e MYSQL_PASSWORD={YOUR_PASSWORD_HERE}`: 새 사용자 비밀번호
- `-p 3306:3306`: 포트 포워딩 (호스트:컨테이너)
- `-d`: 백그라운드 실행
- `mysql:8.0`: MySQL 8.0 이미지 사용

### 3️⃣ MySQL 컨테이너 상태 확인
```bash
# 실행 중인 컨테이너 확인
docker ps

# 컨테이너 로그 확인 (MySQL이 정상적으로 시작되었는지)
docker logs myapi-mysql
```

### 4️⃣ MySQL 접속 테스트
```bash
# MySQL 컨테이너에 접속해서 MySQL 클라이언트 실행
docker exec -it myapi-mysql mysql -u {USER} -p

# 비밀번호 입력: {YOUR_PASSWORD_HERE}
# MySQL 프롬프트가 나타나면 성공!
mysql> SHOW DATABASES;
mysql> EXIT;
```

### 5️⃣ FastAPI 환경 변수 설정
`.env.local` 파일을 다음과 같이 수정:
```bash
SQLALCHEMY_DATABASE_URL=mysql+pymysql://{USER}:{YOUR_PASSWORD_HERE}@localhost:3306/{DATABASE_NAME}
```

### 6️⃣ 컨테이너 관리 명령어
```bash
# 컨테이너 중지
docker stop myapi-mysql

# 컨테이너 시작 (이미 생성된 경우)
docker start myapi-mysql

# 컨테이너 재시작
docker restart myapi-mysql

# 컨테이너 삭제 (데이터도 함께 삭제됨!)
docker rm myapi-mysql
```

### 7️⃣ 데이터 지속성 (선택사항)
데이터를 컴퓨터에 저장하고 싶다면:
```bash
# 볼륨을 사용한 MySQL 실행
docker run --name myapi-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE={DATABASE_NAME} \
  -e MYSQL_USER={USER} \
  -e MYSQL_PASSWORD={YOUR_PASSWORD_HERE} \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  -d mysql:8.0
```
