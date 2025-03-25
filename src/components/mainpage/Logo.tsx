import React from 'react';
import { HStack, Box, Text, Image } from '@chakra-ui/react';

interface LogoProps {
  onClick?: () => void;
}

const Logo = ({ onClick }: LogoProps) => {
  return (
    <HStack 
      spacing={2} 
      cursor="pointer" 
      onClick={onClick}
      _hover={{ opacity: 0.8 }}
      transition="opacity 0.2s"
    >
      <Image
        src="/dexfin-white-removebg-preview.png?url=%2Fdexfin-white-removebg-preview.png&w=128&q=75"
        alt="Dexfin"
        height="64px"
        objectFit="contain"
      />
    </HStack>
  );
};

export default Logo;