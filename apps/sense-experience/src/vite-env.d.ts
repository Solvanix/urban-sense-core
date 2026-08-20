/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENSE_EXPERIENCE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
