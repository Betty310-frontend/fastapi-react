# React + TypeScript + Vite 프로젝트

이 프로젝트는 React, TypeScript, Vite를 사용한 프론트엔드 애플리케이션입니다.

## 📋 시작하기 전에

### 1. Node.js 버전 확인
- **필수 버전**: Node.js 22.12.0 이상
- Node.js가 설치되어 있지 않다면 [공식 웹사이트](https://nodejs.org/)에서 다운로드하세요

### 2. 버전 확인 방법
```bash
node --version
```

## 🚀 프로젝트 설치 및 실행

### 1단계: 프로젝트 생성 (이미 생성된 경우 건너뛰기)
```bash
npm create vite@latest frontend -- --template react-ts
```

### 2단계: 프로젝트 폴더로 이동
```bash
cd frontend
```

### 3단계: 의존성 설치
```bash
npm install
```

### 4단계: 개발 서버 실행
```bash
npm run dev
```

## ⚙️ 환경 변수 설정

이 프로젝트는 다양한 환경에서 실행할 수 있도록 환경 변수를 사용합니다.

### 환경 파일 종류
- `.env` - 기본 환경 변수
- `.env.development` - 개발 환경용
- `.env.production` - 프로덕션 환경용
- `.env.local` - 로컬 개발용 (Git에 커밋되지 않음)

### 주요 환경 변수
```bash
VITE_API_BASE_URL=http://localhost:8000  # FastAPI 서버 URL
VITE_DEBUG=true                          # 디버그 모드
VITE_PORT=5173                           # 개발 서버 포트
```

### 환경 변수 사용 예시
```typescript
import { config, createApiUrl } from './config/env'

// API URL 생성
const apiUrl = createApiUrl("users")  // http://localhost:8000/users

console.log(config.debug)      // 디버그 모드 여부
```

## 📝 중요한 참고사항

> **TypeScript 사용**: 이 프로젝트는 TypeScript를 사용합니다. 코드 작성 시 타입을 명시해주세요.

> **개발 서버**: `npm run dev` 실행 후 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

> **환경 변수**: Vite에서는 환경 변수가 `VITE_` 접두사로 시작해야 클라이언트에서 접근할 수 있습니다.