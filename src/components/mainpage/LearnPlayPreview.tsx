import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, Star, Gift, Gamepad2, Zap, Medal, Sparkles } from 'lucide-react';

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
}

const questions: Question[] = [
  {
    text: "What is a blockchain?",
    options: [
      "Distributed ledger",
      "Central database",
      "Cloud storage",
      "File system"
    ],
    correctIndex: 0,
    difficulty: 'easy',
    reward: 50
  },
  {
    text: "What is DeFi?",
    options: [
      "Digital Finance",
      "Decentralized Finance",
      "Direct Finance",
      "Distributed Finance"
    ],
    correctIndex: 1,
    difficulty: 'medium',
    reward: 75
  },
  {
    text: "What is a smart contract?",
    options: [
      "Legal document",
      "Digital agreement",
      "Self-executing code",
      "Trading bot"
    ],
    correctIndex: 2,
    difficulty: 'hard',
    reward: 100
  }
];

const games = [
  {
    name: 'Card Match',
    icon: Gamepad2,
    reward: '25-100',
    color: '#48BB78',
    description: 'Match crypto pairs to win tokens'
  },
  {
    name: 'Prize Wheel',
    icon: Gift,
    reward: '10-500',
    color: '#ED8936',
    description: 'Spin the wheel for random rewards'
  },
  {
    name: 'Crypto Quiz',
    icon: Brain,
    reward: '50-200',
    color: '#4299E1',
    description: 'Test your crypto knowledge'
  },
  {
    name: 'Daily Challenges',
    icon: Sparkles,
    reward: '100-1000',
    color: '#9F7AEA',
    description: 'Complete daily tasks for bonus rewards'
  }
];

const LearnPlayPreview = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showTrivia, setShowTrivia] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [activeGames, setActiveGames] = useState<number[]>([0, 1]);

  useEffect(() => {
    // Toggle between trivia and games
    const sectionInterval = setInterval(() => {
      setShowTrivia(prev => !prev);
    }, 6000);

    // Handle trivia animations
    const triviaInterval = setInterval(() => {
      if (showTrivia) {
        setSelectedOption(null);
        setTimeout(() => {
          setSelectedOption(questions[currentQuestion].correctIndex);
          setScore(prev => prev + questions[currentQuestion].reward);
          setStreak(prev => prev + 1);
          setShowSuccess(true);

          setTimeout(() => {
            setShowSuccess(false);
            setCurrentQuestion((prev) => (prev + 1) % questions.length);
          }, 1500);
        }, 1000);
      }
    }, 3000);

    // Rotate displayed games
    const gamesInterval = setInterval(() => {
      if (!showTrivia) {
        setActiveGames(prev => [
          (prev[0] + 2) % games.length,
          (prev[1] + 2) % games.length
        ]);
      }
    }, 3000);

    return () => {
      clearInterval(sectionInterval);
      clearInterval(triviaInterval);
      clearInterval(gamesInterval);
    };
  }, [showTrivia, currentQuestion]);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showSuccess && (
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
            +{questions[currentQuestion].reward} Tokens
          </MotionBadge>
        )}
      </AnimatePresence>

      <VStack 
        spacing={6} 
        h="full" 
        w="full" 
        bg="whiteAlpha.50" 
        borderRadius="lg"
        p={6}
      >
        {/* Stats */}
        <HStack spacing={6} w="full" justify="center">
          <VStack>
            <HStack>
              <Icon as={Trophy} color="yellow.400" />
              <Text fontSize="xl" fontWeight="bold">{score}</Text>
            </HStack>
            <Text fontSize="sm" color="whiteAlpha.700">Total Score</Text>
          </VStack>
          <VStack>
            <HStack>
              <Icon as={Zap} color="blue.400" />
              <Text fontSize="xl" fontWeight="bold">{streak}x</Text>
            </HStack>
            <Text fontSize="sm" color="whiteAlpha.700">Streak</Text>
          </VStack>
        </HStack>

        {/* Content */}
        <AnimatePresence mode="wait">
          {showTrivia ? (
            <MotionBox
              key="trivia"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              w="full"
            >
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Badge colorScheme={
                    questions[currentQuestion].difficulty === 'easy' ? 'green' :
                    questions[currentQuestion].difficulty === 'medium' ? 'blue' : 'purple'
                  }>
                    {questions[currentQuestion].difficulty}
                  </Badge>
                  <Badge colorScheme="yellow">+{questions[currentQuestion].reward} tokens</Badge>
                </HStack>
                
                <Text fontSize="lg" fontWeight="medium">
                  {questions[currentQuestion].text}
                </Text>

                <SimpleGrid columns={2} spacing={3}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <Box
                      key={index}
                      bg={selectedOption === index ? 
                        (index === questions[currentQuestion].correctIndex ? 'green.500' : 'red.500') :
                        'whiteAlpha.100'
                      }
                      p={3}
                      borderRadius="lg"
                      transition="all 0.2s"
                      cursor="pointer"
                      _hover={{ bg: 'whiteAlpha.200' }}
                    >
                      <Text>{option}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          ) : (
            <MotionBox
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              w="full"
            >
              <VStack spacing={4}>
                <Text fontSize="lg" fontWeight="bold">Daily Games</Text>
                <SimpleGrid columns={1} spacing={4} w="full">
                  {activeGames.map(index => (
                    <Box
                      key={games[index].name}
                      bg="whiteAlpha.100"
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                    >
                      <HStack justify="space-between">
                        <HStack spacing={4}>
                          <Box
                            p={2}
                            borderRadius="lg"
                            bg={`${games[index].color}20`}
                          >
                            <Icon 
                              as={games[index].icon} 
                              color={games[index].color}
                              boxSize={6}
                            />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">{games[index].name}</Text>
                            <Text fontSize="sm" color="whiteAlpha.700">
                              {games[index].description}
                            </Text>
                          </VStack>
                        </HStack>
                        <Badge colorScheme="purple">
                          {games[index].reward} tokens
                        </Badge>
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>
      </VStack>
    </Box>
  );
};

export default LearnPlayPreview;