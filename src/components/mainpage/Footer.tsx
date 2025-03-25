import React from 'react';
import {
	Box,
	Container,
	VStack,
	HStack,
	Text,
	Link,
	Icon,
	Image,
	Divider,
	Flex,
} from '@chakra-ui/react';
import { Twitter, Send, Mail, BookOpen, Circle } from 'lucide-react';

const Footer = () => {
	return (
		<Box 
			bg="rgba(0, 0, 0, 0.75)"
			backdropFilter="blur(10px)"
			borderTop="1px solid"
			borderColor="whiteAlpha.100"
			position="relative"
			py={12}
		>
			<Container maxW="container.xl" position="relative">
				<VStack spacing={8} align="center">
					{/* Brand */}
					<Image
						src="/dexfin-white-removebg-preview.png?url=%2Fdexfin-white-removebg-preview.png&w=128&q=75"
						alt="Dexfin"
						height="64px"
						objectFit="contain"
						fallback={<Text fontSize="3xl" fontWeight="bold" color="white">DEXFIN</Text>}
					/>

					{/* Contact & Social Links */}
					<HStack spacing={8} flexWrap="wrap" justifyContent="center">
						<Link href="mailto:contact@dexfin.com" isExternal _hover={{ color: "blue.400" }}>
							<HStack spacing={2}>
								<Icon as={Mail} boxSize={5} />
								<Text>Contact</Text>
							</HStack>
						</Link>
						<Link href="https://x.com/Dexfinapp" isExternal _hover={{ color: "blue.400" }}>
							<HStack spacing={2}>
								<Icon as={Twitter} boxSize={5} />
								<Text>Twitter</Text>
							</HStack>
						</Link>
						<Link href="https://t.me/dexfinapp" isExternal _hover={{ color: "blue.400" }}>
							<HStack spacing={2}>
								<Icon as={Send} boxSize={5} />
								<Text>Telegram</Text>
							</HStack>
						</Link>
						<Link href="https://mirror.xyz/0xdE43F77a2954c3B7b11bA1284887449196849a5a" isExternal _hover={{ color: "blue.400" }}>
							<HStack spacing={2}>
								<Icon as={BookOpen} boxSize={5} />
								<Text>Blog</Text>
							</HStack>
						</Link>
					</HStack>

					{/* Legal Links */}
					<HStack spacing={6} flexWrap="wrap" justifyContent="center">
						<Link href="/terms" target="_blank" color="whiteAlpha.700" _hover={{ color: "blue.400" }}>
							<HStack spacing={2}>
								<Icon as={Circle} boxSize={1} />
								<Text fontSize="sm">Terms of Service</Text>
							</HStack>
						</Link>
						<Link href="/privacy" target="_blank" color="whiteAlpha.700" _hover={{ color: "blue.400" }}>
							<HStack spacing={2}>
								<Icon as={Circle} boxSize={1} />
								<Text fontSize="sm">Privacy Policy</Text>
							</HStack>
						</Link>
					</HStack>

					{/* Copyright */}
					<Text color="whiteAlpha.600" fontSize="sm">
						© {new Date().getFullYear()} Dexfin. All rights reserved.
					</Text>
				</VStack>
			</Container>
		</Box>
	);
};

export default Footer;
