import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Link,
  HStack,
  IconButton,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ExternalLink, Newspaper, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
}

const dummyNews = [
  {
    id: '1',
    title: 'Bitcoin Surpasses $70,000 in Historic Rally',
    source: 'CryptoNews',
    date: new Date().toLocaleString(),
    url: '#'
  },
  {
    id: '2',
    title: 'New DeFi Protocol Launches with $100M TVL',
    source: 'DeFi Daily',
    date: new Date().toLocaleString(),
    url: '#'
  },
  {
    id: '3',
    title: 'Major Bank Announces Crypto Integration',
    source: 'Finance Weekly',
    date: new Date().toLocaleString(),
    url: '#'
  }
];

const NewsWidget = () => {
  const [news, setNews] = useState<NewsItem[]>(dummyNews);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  return (
    <Box
      position="fixed"
      top="60px"
      right="24px"
      w="400px"
      bg="rgba(0, 0, 0, 0.75)"
      backdropFilter="blur(10px)"
      borderRadius="xl"
      p={4}
      color="white"
      zIndex={100}
      border="1px solid rgba(255, 255, 255, 0.1)"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
    >
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            <Newspaper size={18} />
            <Text fontWeight="bold">Market News</Text>
          </HStack>
          <HStack spacing={1}>
            <IconButton
              aria-label="Refresh"
              icon={<RefreshCw size={18} />}
              variant="ghost"
              size="sm"
              isLoading={isLoading}
              _hover={{ bg: 'whiteAlpha.100' }}
            />
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeft size={18} />}
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              isDisabled={page === 1 || isLoading}
              _hover={{ bg: 'whiteAlpha.100' }}
            />
            <IconButton
              aria-label="Next"
              icon={<ChevronRight size={18} />}
              variant="ghost"
              size="sm"
              onClick={handleNext}
              isDisabled={isLoading}
              _hover={{ bg: 'whiteAlpha.100' }}
            />
          </HStack>
        </Flex>

        {error && (
          <Alert status="error" bg="red.900" color="white" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="lg" color="blue.400" />
          </Flex>
        ) : (
          <VStack spacing={3} align="stretch">
            {news.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                isExternal
                _hover={{ textDecoration: 'none' }}
              >
                <Box
                  p={3}
                  borderRadius="lg"
                  bg="whiteAlpha.50"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="500">
                        {item.title}
                      </Text>
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="whiteAlpha.700">
                          {item.source}
                        </Text>
                        <Text fontSize="xs" color="whiteAlpha.700">
                          •
                        </Text>
                        <Text fontSize="xs" color="whiteAlpha.700">
                          {item.date}
                        </Text>
                      </HStack>
                    </VStack>
                    <Box color="whiteAlpha.400" ml={2}>
                      <ExternalLink size={14} />
                    </Box>
                  </Flex>
                </Box>
              </Link>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default NewsWidget;