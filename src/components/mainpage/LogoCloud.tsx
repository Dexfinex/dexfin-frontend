import React, { useState, useEffect } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { motion, useMotionValue, useSpring, transform } from 'framer-motion';

const MotionBox = motion(Box);

const logos = [
  // Blockchains
  { url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', size: 32 },
  { url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', size: 36 },
  { url: 'https://cryptologos.cc/logos/solana-sol-logo.png', size: 30 },
  { url: 'https://cryptologos.cc/logos/polygon-matic-logo.png', size: 34 },
  { url: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', size: 32 },
  { url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', size: 36 },
  { url: 'https://basescan.org/assets/base/images/svg/logos/chain-light.svg?v=24.11.1.0', size: 30 },
  
  // Protocols
  { url: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', size: 34 },
  { url: 'https://cryptologos.cc/logos/aave-aave-logo.png', size: 32 },
  { url: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png', size: 36 },
  { url: 'https://cryptologos.cc/logos/chainlink-link-logo.png', size: 30 },
  { url: 'https://cryptologos.cc/logos/compound-comp-logo.png', size: 34 },
  { url: 'https://cryptologos.cc/logos/maker-mkr-logo.png', size: 32 },
  { url: 'https://cryptologos.cc/logos/lido-dao-ldo-logo.png', size: 36 },
];

const LogoCloud = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x * 50);
      mouseY.set(y * 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      zIndex={0}
    >
      {logos.map((logo, index) => {
        // Calculate positions to keep logos more centered
        const columns = 5;
        const rows = Math.ceil(logos.length / columns);
        const col = index % columns;
        const row = Math.floor(index / columns);
        
        // Calculate base positions with padding from edges
        const padding = 100; // Padding from edges
        const availableWidth = window.innerWidth - (padding * 2);
        const availableHeight = window.innerHeight - (padding * 2);
        
        const baseX = padding + (col * (availableWidth / (columns - 1))) + (Math.random() * 50 - 25);
        const baseY = padding + (row * (availableHeight / (rows - 1))) + (Math.random() * 50 - 25);
        
        const duration = 20 + Math.random() * 20; // Slightly reduced duration range
        const delay = -Math.random() * duration;

        return (
          <MotionBox
            key={index}
            position="absolute"
            initial={{ 
              x: baseX,
              y: baseY,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              x: [
                baseX - 30, // Reduced movement range
                baseX + 30,
                baseX - 30,
              ],
              y: [
                baseY - 30,
                baseY + 30,
                baseY - 30,
              ],
              opacity: [0, 1, 1, 1, 0],
              scale: [0.5, 1, 1, 1, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              x: transform(mouseXSpring, [-50, 50], [baseX - 15, baseX + 15]),
              y: transform(mouseYSpring, [-50, 50], [baseY - 15, baseY + 15]),
            }}
            whileHover={{ 
              scale: 1.2,
              transition: { duration: 0.3 },
              zIndex: 1,
            }}
          >
            <Image
              src={logo.url}
              alt="Protocol Logo"
              boxSize={`${logo.size}px`}
              filter="drop-shadow(0 0 8px rgba(255,255,255,0.3))"
              transition="all 0.3s"
              _hover={{
                filter: "drop-shadow(0 0 12px rgba(255,255,255,0.5))",
                transform: "scale(1.1)",
              }}
            />
          </MotionBox>
        );
      })}
    </Box>
  );
};

export default LogoCloud;