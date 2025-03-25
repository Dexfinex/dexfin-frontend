import React from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { 
  HelpCircle, 
  Blocks, 
  Crown, 
  Network, 
  DollarSign, 
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const faqs = [
  {
    question: "What is Dexfin?",
    answer: "Dexfin is an all-in-one DeFi platform that combines trading, staking, lending, and gaming features. Our platform integrates with multiple blockchains and protocols to provide a seamless DeFi experience with institutional-grade security.",
    icon: Blocks,
    category: "Platform"
  },
  // {
  //   question: "How does the Champion NFT system work?",
  //   answer: "Champion NFTs are unique membership tokens that provide exclusive benefits including reduced trading fees, early access to new features, governance rights, and special rewards. Each tier (Bronze, Gold, and Platinum) offers increasing levels of benefits and platform privileges. More details will be revealed soon",
  //   icon: Crown,
  //   category: "NFTs"
  // },
  {
    question: "Which blockchains are supported?",
    answer: "Dexfin supports major blockchains including Bitcoin, Ethereum, Polygon, Solana, and Layer 2 solutions. Our cross-chain infrastructure allows seamless trading and asset management across different networks. More chains will be added based on community voting.",
    icon: Network,
    category: "Technical"
  },
  {
    question: "What are the platform fees?",
    answer: "The fee structure will be introduced, when the platform will be live. There will a significant reductions available for Champion NFT holders. Staking and lending fees vary by protocol, and cross-chain transactions include network fees. Champion NFT holders can receive up to 50% fee reductions.",
    icon: DollarSign,
    category: "Fees"
  },
  {
    question: "How secure is the platform?",
    answer: "Dexfin employs distributed MPC+TSS infrastructure for key management. The platform will undergo regular security audits We use industry-leading encryption and maintain partnerships with top security firms to ensure asset safety.",
    icon: Shield,
    category: "Security"
  },
  {
    question: "What makes Dexfin different from other DeFi platforms?",
    answer: "Dexfin uniquely combines various DeFi tools, gamified learning experiences, and cross-chain capabilities in one platform. Our AI-powered assistant and innovative reward system create an engaging and educational easy to use DeFi experience suitable for both beginners and experts.",
    icon: Blocks,
    category: "Features"
  }
];

const FAQSection = () => {
  return (
    <Box 
      py={20} 
      bg="rgba(0, 12, 24, 0.97)" 
      position="relative" 
      overflow="hidden"
    >
      {/* Background Gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 50% 50%, purple.900 0%, transparent 70%)"
        opacity={0.15}
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative">
        <VStack spacing={12}>
          {/* Header */}
          <VStack spacing={6} textAlign="center">
            <HStack spacing={2}>
              <Icon as={HelpCircle} color="white" boxSize={6} />
              <Text color="white" fontWeight="medium">
                Frequently Asked Questions
              </Text>
            </HStack>
            <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" maxW="4xl" color="white">
              Everything you need to know
            </Text>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="whiteAlpha.800" maxW="2xl">
              Get quick answers to common questions about the Dexfin platform
            </Text>
          </VStack>

          {/* FAQ Accordion */}
          <Box
            w="full"
            maxW="3xl"
            bg="rgba(0, 0, 0, 0.4)"
            borderRadius="2xl"
            p={8}
            border="1px solid"
            borderColor="whiteAlpha.100"
            backdropFilter="blur(10px)"
          >
            <Accordion allowMultiple>
              {faqs.map((faq, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem
                    border="none"
                    mb={4}
                    bg="rgba(255, 255, 255, 0.05)"
                    borderRadius="xl"
                    overflow="hidden"
                  >
                    <AccordionButton
                      p={6}
                      _hover={{ bg: 'whiteAlpha.50' }}
                      _expanded={{ bg: 'whiteAlpha.100' }}
                    >
                      <HStack flex="1" spacing={4}>
                        <Icon as={faq.icon} color="white" boxSize={5} />
                        <VStack align="start" spacing={2}>
                          <Text fontSize="lg" fontWeight="medium" color="white">{faq.question}</Text>
                          <Badge colorScheme="purple" variant="subtle">
                            {faq.category}
                          </Badge>
                        </VStack>
                      </HStack>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel 
                      pb={6} 
                      px={6}
                      bg="rgba(0, 0, 0, 0.2)"
                      borderTop="1px solid"
                      borderColor="whiteAlpha.100"
                    >
                      <Text color="whiteAlpha.800" lineHeight="tall">
                        {faq.answer}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                </MotionBox>
              ))}
            </Accordion>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default FAQSection;