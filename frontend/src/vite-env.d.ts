/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEBUG: string
  readonly VITE_PORT: string
  readonly VITE_ENABLE_HTTPS: string
  readonly VITE_HOT_RELOAD: string
  readonly VITE_VERBOSE_LOGGING: string
  readonly VITE_MOCK_API: string
  readonly VITE_ENABLE_DEV_TOOLS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
