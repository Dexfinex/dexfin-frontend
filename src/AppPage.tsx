import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { Workspace } from "./components/Workspace";
import ReferralHandler from "./components/ReferralHandler.tsx";
import { useStore } from "./store/useStore";
import { trackEvent } from "./services/analytics";
import { addMouseflowTag, setMouseflowVariable } from "./services/mouseflow";

const AppPage: React.FC = () => {
  const { theme } = useStore();
  const [isStylesApplied, setIsStylesApplied] = useState(false);

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

  // Track app page view with session duration
  useEffect(() => {
    const startTime = new Date().getTime();
    
    // Track that user entered the main app
    trackEvent('app_entry', 'Application', 'Main App');
    
    // Track in Mouseflow
    addMouseflowTag('app_entry');
    
    // Setup session duration tracking
    return () => {
      const endTime = new Date().getTime();
      const durationInSeconds = Math.floor((endTime - startTime) / 1000);
      
      // Only track if the session was meaningful (longer than 5 seconds)
      if (durationInSeconds > 5) {
        trackEvent('session_duration', 'Engagement', 'App Session', durationInSeconds);
        
        // Track in Mouseflow
        setMouseflowVariable('session_duration', durationInSeconds.toString());
      }
    };
  }, []);

  // Track theme changes
  useEffect(() => {
    trackEvent('theme_change', 'User Preferences', theme);
    
    // Track in Mouseflow
    setMouseflowVariable('theme', theme);
  }, [theme]);

  return (
    <Box minH="100vh" width="100%">
      <ReferralHandler />
      <Header />
      <Workspace />
    </Box>
  );
};

export default AppPage;