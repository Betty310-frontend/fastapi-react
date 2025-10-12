// Environment configuration utility
// 환경 변수를 타입 안전하게 사용하기 위한 유틸리티

interface AppConfig {
  nodeEnv: string;
  apiBaseUrl: string;
  debug: boolean;
  port: number;
  enableHttps: boolean;
  hotReload: boolean;
  verboseLogging: boolean;
  mockApi: boolean;
  enableDevTools: boolean;
}

// 환경 변수를 파싱하여 올바른 타입으로 변환하는 함수
const parseBoolean = (value: string | undefined): boolean => {
  return value?.toLowerCase() === "true";
};

const parseNumber = (
  value: string | undefined,
  defaultValue: number
): number => {
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// 환경 변수 설정 객체
export const config: AppConfig = {
  nodeEnv: import.meta.env.VITE_NODE_ENV || "development",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  debug: parseBoolean(import.meta.env.VITE_DEBUG),
  port: parseNumber(import.meta.env.VITE_PORT, 5173),
  enableHttps: parseBoolean(import.meta.env.VITE_ENABLE_HTTPS),
  hotReload: parseBoolean(import.meta.env.VITE_HOT_RELOAD),
  verboseLogging: parseBoolean(import.meta.env.VITE_VERBOSE_LOGGING),
  mockApi: parseBoolean(import.meta.env.VITE_MOCK_API),
  enableDevTools: parseBoolean(import.meta.env.VITE_ENABLE_DEV_TOOLS),
};

// API URL 생성 헬퍼 함수
export const createApiUrl = (endpoint: string): string => {
  const baseUrl = config.apiBaseUrl.replace(/\/$/, ""); // 마지막 슬래시 제거
  const cleanEndpoint = endpoint.replace(/^\//, ""); // 첫 번째 슬래시 제거

  return `${baseUrl}/${cleanEndpoint}`;
};

// 개발 환경 여부 확인
export const isDevelopment = (): boolean => {
  return config.nodeEnv === "development";
};

// 프로덕션 환경 여부 확인
export const isProduction = (): boolean => {
  return config.nodeEnv === "production";
};

// 디버그 로그 헬퍼 함수
export const debugLog = (message: string, ...args: any[]): void => {
  if (config.debug && isDevelopment()) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

// 환경 설정 정보 출력 (개발 환경에서만)
if (isDevelopment() && config.verboseLogging) {
  console.log("🔧 Environment Configuration:", config);
}
