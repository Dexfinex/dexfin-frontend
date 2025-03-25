import React from 'react';
import { VStack, Text, Icon } from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

const DesktopIcon = ({ icon, label, onClick }: DesktopIconProps) => {
  return (
    <VStack
      className="desktop-icon"
      onClick={onClick}
      spacing={2}
    >
      <Icon as={icon} boxSize={8} color="white" />
      <Text className="icon-label">{label}</Text>
    </VStack>
  );
};

export default DesktopIcon;