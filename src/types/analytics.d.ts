// Type definitions for Mouseflow
interface MouseflowInstance {
  push: (args: any[]) => void;
}

declare global {
  interface Window {
    _mouseflow: MouseflowInstance;
  }
}

export {};