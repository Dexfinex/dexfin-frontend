import React, { useEffect, useState} from "react";
import { Box } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { Workspace } from "./components/Workspace";
import ReferralHandler from "./components/ReferralHandler.tsx";
import { useStore } from "./store/useStore";

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

  return (
    <Box minH="100vh" width="100%">
      <ReferralHandler />
      <Header />
      <Workspace />
    </Box>
  );
};

export default AppPage;
