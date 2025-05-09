// src/global.d.ts

interface Window {
    gtag: (command: string, action: string, options?: Record<string, any>) => void;
  }
  