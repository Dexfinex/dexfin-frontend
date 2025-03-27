
interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
  
  declare global {
    interface Window {
      dataLayer: any[];
      gtag: (...args: any[]) => void;
    }
  }
  
  const GA_TRACKING_ID = 'G-BHMP8RFYRJ';
  
  export const initializeGA = () => {
    if (typeof window !== 'undefined') {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script1);
  
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
  
      window.gtag('js', new Date());
      window.gtag('config', GA_TRACKING_ID, {
        page_path: window.location.pathname,
      });
    }
  };
  
  export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  };
  
  export const trackModalInteraction = (modalName: string, action: 'open' | 'close') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', `modal_${action}`, {
        event_category: 'Modal Interaction',
        event_label: modalName,
      });
    }
  };
  
  export const trackEvent = (
    eventName: string, 
    category: string, 
    label?: string, 
    value?: number, 
    nonInteraction?: boolean
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
        value: value,
        non_interaction: nonInteraction
      });
    }
  };
  
  export const trackButtonClick = (buttonName: string, location: string) => {
    trackEvent('button_click', location, buttonName);
  };
  
  export const trackFormSubmission = (formName: string, success: boolean) => {
    trackEvent('form_submission', formName, success ? 'success' : 'failure');
  };
  
  export const trackFeatureUsage = (featureName: string) => {
    trackEvent('feature_usage', 'Features', featureName);
  };
  
  export const trackAuthEvent = (action: 'sign_up' | 'sign_in' | 'sign_out', method: string) => {
    trackEvent(action, 'Authentication', method);
  };