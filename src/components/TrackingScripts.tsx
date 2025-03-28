import { useEffect } from 'react';
import { initializeGA } from '../services/analytics';
import { initializeMouseflow } from '../services/mouseflow';

const TrackingScripts: React.FC = () => {
  useEffect(() => {
    // Initialize Google Analytics
    initializeGA();
    
    // Initialize Mouseflow
    initializeMouseflow();
  }, []);

  return null;
};

export default TrackingScripts;