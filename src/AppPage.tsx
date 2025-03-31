// src/AppPage.tsx
import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { Workspace } from "./components/Workspace";
import ReferralHandler from "./components/ReferralHandler.tsx";
import { useStore } from "./store/useStore";
import { trackEvent } from "./services/analytics";
import { addMouseflowTag, setMouseflowVariable, trackMouseflowPageView } from "./services/mouseflow";
import { useLocation } from "react-router-dom";
import TrackingScripts from "./components/TrackingScripts.tsx";

const AppPage: React.FC = () => {
  const { theme } = useStore();
  const [isStylesApplied, setIsStylesApplied] = useState(false);
  const location = useLocation();

  // Initialize styles
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);

    if (!isStylesApplied) {
      const style = document.createElement("style");
      style.innerHTML = `
                html, body {
                    overflow-x: hidden;
                    scroll-behavior: smooth;
                }
                body {
                    position: relative;
                    width: 100%;
                }
                #sections-container > div {
                    min-height: 300px;
                    position: relative;
                    width: 100%;
                }
            `;
      document.head.appendChild(style);
      setIsStylesApplied(true);
    }
  }, [theme, isStylesApplied]);

  // Track app page view with enhanced detail
  useEffect(() => {
    const startTime = new Date().getTime();
    const pagePath = location.pathname;
    
    // More specific page tracking for app pages
    trackMouseflowPageView(`app${pagePath}`);
    
    // Track that user entered the main app
    trackEvent('app_entry', 'Application', 'Main App');
    
    // Enhanced Mouseflow tracking
    addMouseflowTag('app_entry');
    addMouseflowTag(`app_page_${pagePath.replace(/\//g, '_') || 'main'}`);
    
    // Setup session duration tracking
    return () => {
      const endTime = new Date().getTime();
      const durationInSeconds = Math.floor((endTime - startTime) / 1000);
      
      // Only track if the session was meaningful (longer than 5 seconds)
      if (durationInSeconds > 5) {
        trackEvent('session_duration', 'Engagement', 'App Session', durationInSeconds);
        
        // Track in Mouseflow
        setMouseflowVariable('session_duration', durationInSeconds.toString());
        
        // If session is particularly long, mark as engaged user
        if (durationInSeconds > 300) { // 5 minutes
          addMouseflowTag('engaged_user');
        }
      }
    };
  }, [location.pathname]);

  // Track theme changes
  useEffect(() => {
    trackEvent('theme_change', 'User Preferences', theme);
    
    // Track in Mouseflow
    setMouseflowVariable('theme', theme);
    addMouseflowTag(`theme_${theme}`);
  }, [theme]);

  // Track referral usage if applicable
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referralCode = params.get('ref');
    
    if (referralCode) {
      setMouseflowVariable('referral_code', referralCode);
      addMouseflowTag('referred_user');
      trackEvent('referral_used', 'Acquisition', referralCode);
    }
  }, [location.search]);

  return (
    <Box minH="100vh" width="100%">
      <TrackingScripts />
      <ReferralHandler />
      <Header />
      <Workspace />
    </Box>
  );
};

export default AppPage;