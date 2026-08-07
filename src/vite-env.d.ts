/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_TRACKER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}