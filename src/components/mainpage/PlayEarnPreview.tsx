import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Icon,
  SimpleGrid,
  Progress,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Trophy, 
  Star, 
  Gift, 
  Gamepad2, 
  Zap,
  Medal,
  Sparkles,
  Swords,
  Target,
  Crown,
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const games = [
  {
    name: 'Trivia Challenge',
    icon: Brain,
    reward: '50-200',
    color: '#48BB78',
    description: 'Test your crypto knowledge',
    level: 'Easy'
  },
  {
    name: 'Battle Arena',
    icon: Swords,
    reward: '100-500',
    color: '#E53E3E',
    description: 'Fight other players',
    level: 'Medium'
  },
  {
    name: 'Daily Quests',
    icon: Target,
    reward: '25-100',
    color: '#9F7AEA',
    description: 'Complete daily tasks',
    level: 'Easy'
  },
  {
    name: 'Tournament',
    icon: Crown,
    reward: '500-2000',
    color: '#ECC94B',
    description: 'Compete in tournaments',
    level: 'Hard'
  }
];

const achievements = [
  { name: 'First Win', progress: 100, tokens: 50 },
  { name: 'Win Streak', progress: 75, tokens: 100 },
  { name: 'Tournament Champion', progress: 45, tokens: 500 },
];

const PlayEarnPreview = () => {
  const [activeGame, setActiveGame] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(1240);
  const [rewards, setRewards] = useState(124);
  const [streak, setStreak] = useState(5);

  useEffect(() => {
    // Cycle through games
    const gameInterval = setInterval(() => {
      setActiveGame((prev) => (prev + 1) % games.length);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
      
      // Increment stats
      setScore(prev => prev + Math.floor(Math.random() * 50));
      setRewards(prev => prev + Math.floor(Math.random() * 10));
      setStreak(prev => Math.min(prev + 1, 10));
    }, 3000);

    return () => clearInterval(gameInterval);
  }, []);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showReward && (
          <MotionBadge
            position="absolute"
            top={4}
            right={4}
            colorScheme="green"
            fontSize="sm"
            px={3}
            py={1}
            zIndex={2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <HStack spacing={1}>
              <Sparkles size={14} />
              <Text>+{Math.floor(Math.random() * 50)} Tokens</Text>
            </HStack>
          </MotionBadge>
        )}
      </AnimatePresence>

      <VStack spacing={4} h="full" w="full">
        {/* Stats Section */}
        <SimpleGrid columns={3} spacing={4} w="full">
          <MotionBox
            whileHover={{ scale: 1.05 }}
            bg="whiteAlpha.100"
            p={3}
            borderRadius="lg"
            textAlign="center"
          >
            <VStack>
              <Icon as={Trophy} color="yellow.400" boxSize={6} />
              <Text fontSize="xl" fontWeight="bold">{score}</Text>
              <Text fontSize="sm" color="whiteAlpha.600">Total Score</Text>
            </VStack>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.05 }}
            bg="whiteAlpha.100"
            p={3}
            borderRadius="lg"
            textAlign="center"
          >
            <VStack>
              <Icon as={Gift} color="purple.400" boxSize={6} />
              <Text fontSize="xl" fontWeight="bold">{rewards}</Text>
              <Text fontSize="sm" color="whiteAlpha.600">Rewards Earned</Text>
            </VStack>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.05 }}
            bg="whiteAlpha.100"
            p={3}
            borderRadius="lg"
            textAlign="center"
          >
            <VStack>
              <Icon as={Zap} color="blue.400" boxSize={6} />
              <Text fontSize="xl" fontWeight="bold">{streak}x</Text>
              <Text fontSize="sm" color="whiteAlpha.600">Win Streak</Text>
            </VStack>
          </MotionBox>
        </SimpleGrid>

        {/* Active Game */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={activeGame}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            w="full"
          >
            <Box
              bg="whiteAlpha.100"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              <HStack justify="space-between" mb={4}>
                <HStack spacing={4}>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={`${games[activeGame].color}20`}
                  >
                    <Icon 
                      as={games[activeGame].icon} 
                      color={games[activeGame].color}
                      boxSize={6}
                    />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{games[activeGame].name}</Text>
                    <Text fontSize="sm" color="whiteAlpha.700">
                      {games[activeGame].description}
                    </Text>
                  </VStack>
                </HStack>
                <Badge colorScheme={
                  games[activeGame].level === 'Easy' ? 'green' :
                  games[activeGame].level === 'Medium' ? 'blue' : 'purple'
                }>
                  {games[activeGame].level}
                </Badge>
              </HStack>

              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="whiteAlpha.700">Reward Pool</Text>
                <Text color="green.400">{games[activeGame].reward} tokens</Text>
              </HStack>

              <Progress 
                value={Math.random() * 100} 
                size="sm" 
                colorScheme="blue" 
                borderRadius="full"
                mb={4}
              />

              <SimpleGrid columns={2} spacing={4}>
                <Box bg="whiteAlpha.100" p={2} borderRadius="lg">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Players Online</Text>
                    <Text>{Math.floor(Math.random() * 100) + 50}</Text>
                  </HStack>
                </Box>
                <Box bg="whiteAlpha.100" p={2} borderRadius="lg">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Games Today</Text>
                    <Text>{Math.floor(Math.random() * 1000) + 500}</Text>
                  </HStack>
                </Box>
              </SimpleGrid>
            </Box>
          </MotionBox>
        </AnimatePresence>

        {/* Achievements */}
        <Box w="full">
          <Text fontSize="sm" color="whiteAlpha.700" mb={2}>Achievements</Text>
          <VStack spacing={3}>
            {achievements.map((achievement, index) => (
              <Box
                key={index}
                w="full"
                bg="whiteAlpha.100"
                p={3}
                borderRadius="lg"
              >
                <HStack justify="space-between" mb={2}>
                  <HStack>
                    <Icon as={Medal} color="yellow.400" />
                    <Text fontSize="sm">{achievement.name}</Text>
                  </HStack>
                  <Badge colorScheme="purple">{achievement.tokens} tokens</Badge>
                </HStack>
                <Progress
                  value={achievement.progress}
                  size="xs"
                  colorScheme="yellow"
                  borderRadius="full"
                />
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default PlayEarnPreview;