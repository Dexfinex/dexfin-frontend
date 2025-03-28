// src/services/mouseflow.ts
const MOUSEFLOW_PROJECT_ID = '4a24906b-10a0-45d1-8992-ed5e29e2605a';

// Initialize Mouseflow
export const initializeMouseflow = () => {
  if (typeof window !== 'undefined') {
    // Define _mfq if it doesn't exist
    window._mfq = window._mfq || [];
    
    // Create and append the Mouseflow script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.defer = true;
    script.src = `//cdn.mouseflow.com/projects/${MOUSEFLOW_PROJECT_ID}.js`;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
};

// Track page views in Mouseflow
export const trackMouseflowPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window._mfq) {
    window._mfq.push(['newPageView', pageName]);
  }
};

// Add custom tag for Mouseflow
export const addMouseflowTag = (tagName: string) => {
  if (typeof window !== 'undefined' && window._mfq) {
    window._mfq.push(['addTag', tagName]);
  }
};

// Track variables
export const setMouseflowVariable = (name: string, value: string) => {
  if (typeof window !== 'undefined' && window._mfq) {
    window._mfq.push(['setVariable', name, value]);
  }
};