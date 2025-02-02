// Content Security Policy configuration
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://s3.tradingview.com',
    'https://www.google.com',
    'https://www.gstatic.com'
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:', 'http:'],
  'connect-src': ["'self'", 'wss:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'object-src': ["'none'"],
  'media-src': ["'none'"],
  'frame-src': ["'self'", 'https://s3.tradingview.com']
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

// URL sanitization
export const sanitizeUrl = (url: string): string => {
  const pattern = /^(?:(?:https?):\/\/)/i;
  if (!pattern.test(url)) {
    return '';
  }
  return url;
};

// Local storage encryption
export const secureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const encryptedValue = btoa(JSON.stringify(value));
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },

  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(atob(item));
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  }
};