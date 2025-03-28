import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  SimpleGrid,
  Button,
  Switch,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Palette, 
  Monitor, 
  Eye, 
  EyeOff,
  LineChart,
  Newspaper,
  Wallet,
  Sparkles,
  Sun,
  Moon,
  Image as ImageIcon,
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const sections = ['wallpaper', 'theme', 'widgets'] as const;
type Section = typeof sections[number];

const wallpapers = [
  {
    id: 'city-lights',
    name: 'City Lights',
    category: 'City',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
  },
  {
    id: 'mountain-lake',
    name: 'Mountain Lake',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
  },
  {
    id: 'night-forest',
    name: 'Night Forest',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969',
  },
  {
    id: 'urban-sunset',
    name: 'Urban Sunset',
    category: 'City',
    url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9',
  },
  {
    id: 'sakura-garden',
    name: 'Sakura Garden',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951',
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    category: 'City',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  },
];

const widgets = [
  { id: 'chart', name: 'Price Chart', icon: LineChart, color: '#48BB78' },
  { id: 'news', name: 'News Feed', icon: Newspaper, color: '#4299E1' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, color: '#9F7AEA' },
];

const CustomizationPreview = () => {
  const [activeSection, setActiveSection] = useState<Section>('wallpaper');
  const [activeWallpaper, setActiveWallpaper] = useState(0);
  const [visibleWidgets, setVisibleWidgets] = useState(new Set(['chart', 'news']));
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Auto-rotate through sections
    const sectionInterval = setInterval(() => {
      setActiveSection(prev => {
        const currentIndex = sections.indexOf(prev);
        return sections[(currentIndex + 1) % sections.length];
      });
    }, 5000);

    return () => clearInterval(sectionInterval);
  }, []);

  useEffect(() => {
    // Show success badge when changes are made
    const showSuccessBadge = () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    };

    showSuccessBadge();
  }, [activeWallpaper, isDarkMode, visibleWidgets]);

  const toggleWidget = (widgetId: string) => {
    setVisibleWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  };

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showSuccess && (
          <MotionBadge
            position="absolute"
            top={4}
            right={4}
            colorScheme="blue"
            fontSize="sm"
            px={3}
            py={1}
            zIndex={2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            Settings Updated
          </MotionBadge>
        )}
      </AnimatePresence>

      <VStack spacing={6} h="full" w="full">
        {/* Header */}
        <HStack w="full" justify="center" spacing={4}>
          {sections.map((section) => (
            <Button
              key={section}
              size="sm"
              variant={activeSection === section ? 'solid' : 'ghost'}
              onClick={() => setActiveSection(section)}
              leftIcon={
                section === 'wallpaper' ? <ImageIcon size={16} color="white" /> :
                section === 'theme' ? <Palette size={16} color="white" /> :
                <Layout size={16} color="white" />
              }
              colorScheme={activeSection === section ? 'blue' : 'gray'}
              color="white"
              _hover={{
                '& svg': {
                  color: 'blue.400'
                }
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Button>
          ))}
        </HStack>

        {/* Content Sections */}
        <Box flex={1} display="flex" alignItems="center" justifyContent="center" w="full">
          <AnimatePresence mode="wait">
            {activeSection === 'wallpaper' && (
              <MotionBox
                key="wallpaper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                w="full"
              >
                {/* Wallpaper Preview */}
                <Box w="full" h="200px" position="relative" borderRadius="lg" overflow="hidden" mb={6}>
                  <Box
                    bgImage={`url(${wallpapers[activeWallpaper].url})`}
                    bgSize="cover"
                    bgPosition="center"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    transition="transform 0.3s"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={4}
                    bg="rgba(0,0,0,0.7)"
                    backdropFilter="blur(10px)"
                  >
                    <HStack justify="space-between">
                      <Text color="white">{wallpapers[activeWallpaper].name}</Text>
                      <Badge colorScheme="blue">{wallpapers[activeWallpaper].category}</Badge>
                    </HStack>
                  </Box>
                </Box>

                {/* Wallpaper Grid */}
                <SimpleGrid columns={3} spacing={4}>
                  {wallpapers.map((wallpaper, index) => (
                    <Box
                      key={wallpaper.id}
                      h="100px"
                      bgImage={`url(${wallpaper.url})`}
                      bgSize="cover"
                      bgPosition="center"
                      borderRadius="lg"
                      cursor="pointer"
                      onClick={() => setActiveWallpaper(index)}
                      border="2px solid"
                      borderColor={index === activeWallpaper ? "blue.500" : "transparent"}
                      transition="all 0.2s"
                      _hover={{ transform: 'scale(1.05)' }}
                    />
                  ))}
                </SimpleGrid>
              </MotionBox>
            )}

            {activeSection === 'theme' && (
              <MotionBox
                key="theme"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                w="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="300px"
              >
                <Box
                  p={8}
                  bg={isDarkMode ? "gray.800" : "white"}
                  borderRadius="xl"
                  w="full"
                  maxW="md"
                  transition="all 0.3s"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  <VStack spacing={8}>
                    <Text
                      fontSize="xl"
                      color={isDarkMode ? "white" : "black"}
                      transition="color 0.3s"
                    >
                      Color Theme
                    </Text>
                    <HStack spacing={8}>
                      <Icon
                        as={Sun}
                        boxSize={8}
                        color={!isDarkMode ? "yellow.400" : isDarkMode ? "white" : "black"}
                        transition="color 0.3s"
                        _hover={{ color: "blue.400" }}
                      />
                      <Switch
                        size="lg"
                        colorScheme="blue"
                        isChecked={isDarkMode}
                        onChange={() => setIsDarkMode(!isDarkMode)}
                      />
                      <Icon
                        as={Moon}
                        boxSize={8}
                        color={isDarkMode ? "white" : "black"}
                        transition="color 0.3s"
                        _hover={{ color: "blue.400" }}
                      />
                    </HStack>
                  </VStack>
                </Box>
              </MotionBox>
            )}

            {activeSection === 'widgets' && (
              <MotionBox
                key="widgets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                w="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="300px"
              >
                <SimpleGrid columns={3} spacing={6} maxW="xl">
                  {widgets.map((widget) => (
                    <Box
                      key={widget.id}
                      bg="whiteAlpha.100"
                      p={6}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      cursor="pointer"
                      onClick={() => toggleWidget(widget.id)}
                      position="relative"
                      transition="all 0.2s"
                      _hover={{ bg: 'whiteAlpha.200' }}
                    >
                      <VStack spacing={4}>
                        <Icon 
                          as={widget.icon} 
                          boxSize={8} 
                          color="white" 
                          transition="color 0.2s"
                          _hover={{ color: "blue.400" }}
                        />
                        <Text color="white">{widget.name}</Text>
                        <Icon
                          as={visibleWidgets.has(widget.id) ? Eye : EyeOff}
                          position="absolute"
                          top={4}
                          right={4}
                          boxSize={4}
                          color="white"
                          opacity={0.5}
                          _hover={{ color: "blue.400" }}
                        />
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>
      </VStack>
    </Box>
  );
};

export default CustomizationPreview;