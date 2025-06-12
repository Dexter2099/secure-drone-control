/// <reference types="vite/client" />

declare module '*.png' {
  const value: string;
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
