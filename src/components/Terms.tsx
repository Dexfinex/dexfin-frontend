import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	UnorderedList,
	ListItem,
	Link,
	Flex,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	useColorModeValue,
	Icon,
	Button,
	HStack,
	Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRight, FileText, Clock, Download, Home } from 'lucide-react';
import Header from './mainpage/Header';
import Footer from './mainpage/Footer';

const Terms = () => {
	const sectionBg = useColorModeValue('whiteAlpha.100', 'blackAlpha.300');
	const lastUpdated = "01.01.2025";

	const handleDownload = () => {
		const fileUrl = '/documents/Terms_of_Service.docx';

		const link = document.createElement('a');
		link.href = fileUrl;
		link.setAttribute('download', 'Terms_of_Service.docx');

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
	};

	return (
		<Flex direction="column" minH="100vh" bg="gray.900" color="white">
			<Header />

			<Box 
				py={10} 
                pt={20}
				bgGradient="linear(to-b, gray.900, dark.300)"
				borderBottom="1px solid"
				borderColor="whiteAlpha.100"
                mt="60px"
			>
				<Container maxW="4xl">
					<Breadcrumb 
						separator={<ChevronRight size={14} />} 
						fontSize="sm" 
						color="whiteAlpha.600"
						mb={6}
					>
						<BreadcrumbItem>
							<BreadcrumbLink as={RouterLink} to="/" _hover={{ color: 'brand.400' }}>
								<Icon as={Home} boxSize={3} mr={1} />
								Home
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbItem isCurrentPage>
							<BreadcrumbLink color="brand.400">Terms of Service</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>

					<Heading 
						as="h1" 
						size="2xl" 
						mb={4} 
						bgGradient="linear(to-r, brand.400, blue.400)" 
						// bgClip="text"
						letterSpacing="tight"
					>
						Terms of Service
					</Heading>

					<Text color="whiteAlpha.800" fontSize="lg" maxW="3xl">
						Please read these terms carefully before using our platform. By accessing or using Dexfin, you agree to be bound by these terms and conditions.
					</Text>

					<HStack mt={8} spacing={6} flexWrap="wrap">
						<Flex align="center" color="whiteAlpha.700">
							<Icon as={FileText} mr={2} />
							<Text fontSize="sm">Legal Document</Text>
						</Flex>
						<Flex align="center" color="whiteAlpha.700">
							<Icon as={Clock} mr={2} />
							<Text fontSize="sm">Last Updated: {lastUpdated}</Text>
						</Flex>
						<Button 
							leftIcon={<Download size={16} />} 
							size="sm" 
							variant="outline" 
								color={'white'}
							borderColor="whiteAlpha.200"
							_hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.300' }}
							onClick={handleDownload}
						>
							Download PDF
						</Button>
					</HStack>
				</Container>
			</Box>

			<Box flex="1" as="main" py={12}>
				<Container maxW="4xl" px={4}>
					<VStack spacing={12} align="stretch" divider={<Divider borderColor="whiteAlpha.100" />}>
						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="introduction"
								scrollMarginTop="100px"
							>
								1. Introduction
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									Welcome to Dexfin ("Dexfin," "we," "us," or "our"). These Terms of Service ("Terms") govern your use of our decentralized finance (DeFi) operating system, which provides users access to various DeFi applications, tools, and services. By accessing or using Dexfin, you agree to be bound by these Terms. If you do not agree, you must not use the platform.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="eligibility"
								scrollMarginTop="100px"
							>
								2. Eligibility
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									By using Dexfin, you represent and warrant that you:
								</Text>
								<UnorderedList spacing={3} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>Are at least 18 years old or the legal age of majority in your jurisdiction.</ListItem>
									<ListItem>Have the legal capacity to enter into these Terms.</ListItem>
									<ListItem>Are not a resident of a jurisdiction where the use of DeFi services is restricted or illegal.</ListItem>
								</UnorderedList>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="services-provided"
								scrollMarginTop="100px"
							>
								3. Services Provided
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									Dexfin provides:
								</Text>
								<UnorderedList spacing={3} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>Access to DeFi applications, including swapping, staking, lending, borrowing, and market research.</ListItem>
									<ListItem>AI-powered research and investment tools.</ListItem>
									<ListItem>Integration with third-party APIs and blockchain networks.</ListItem>
								</UnorderedList>
								<Text color="whiteAlpha.800" mt={4} lineHeight="tall">
									We do not provide financial, legal, or investment advice. All services are provided "as-is" without any guarantees.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="risks-disclaimers"
								scrollMarginTop="100px"
							>
								4. Risks and Disclaimers
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									By using Dexfin, you acknowledge and accept the inherent risks of DeFi, including but not limited to:
								</Text>
								<UnorderedList spacing={3} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>Market volatility and potential loss of funds.</ListItem>
									<ListItem>Smart contract vulnerabilities and exploits.</ListItem>
									<ListItem>Regulatory uncertainty and potential legal changes affecting your ability to use our services.</ListItem>
									<ListItem>Third-party API failures or inaccuracies.</ListItem>
								</UnorderedList>
								<Text color="whiteAlpha.800" mt={4} lineHeight="tall">
									Dexfin is not liable for any losses, damages, or liabilities incurred from using our platform.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="user-responsibilities"
								scrollMarginTop="100px"
							>
								5. User Responsibilities
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									You agree to:
								</Text>
								<UnorderedList spacing={3} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>Use Dexfin in compliance with all applicable laws and regulations.</ListItem>
									<ListItem>Secure your private keys and wallet credentials.</ListItem>
									<ListItem>Take full responsibility for any transactions you initiate.</ListItem>
									<ListItem>Refrain from using Dexfin for illegal or fraudulent activities.</ListItem>
								</UnorderedList>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="third-party-services"
								scrollMarginTop="100px"
							>
								6. Third-Party Services
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									Dexfin integrates with third-party APIs, wallets, and DeFi protocols. We are not responsible for the actions, failures, or terms of these third-party providers. Your interactions with them are at your own risk.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="fees-payments"
								scrollMarginTop="100px"
							>
								7. Fees and Payments
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									Dexfin may charge fees for certain services, including transaction processing fees and premium features. These fees are transparently disclosed and are subject to change. Blockchain network fees may also apply and are beyond our control.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="privacy-data"
								scrollMarginTop="100px"
							>
								8. Privacy and Data Protection
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									We respect user privacy and do not collect personal information beyond what is necessary for platform functionality. Blockchain transactions are public by nature, and we cannot guarantee anonymity. Please review our Privacy Policy for more details.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="termination"
								scrollMarginTop="100px"
							>
								9. Termination and Suspension
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									We reserve the right to suspend or terminate access to Dexfin at our discretion if we suspect:
								</Text>
								<UnorderedList spacing={3} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>Violation of these Terms.</ListItem>
									<ListItem>Illegal or fraudulent activities.</ListItem>
									<ListItem>Security risks to the platform or its users.</ListItem>
								</UnorderedList>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="no-warranties"
								scrollMarginTop="100px"
							>
								10. No Warranties and Limitation of Liability
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									Dexfin is provided on an "as-is" and "as-available" basis. We disclaim all warranties, express or implied, including but not limited to the accuracy, reliability, and security of our services. To the maximum extent permitted by law, Dexfin shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our platform.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="indemnification"
								scrollMarginTop="100px"
							>
								11. Indemnification
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									You agree to indemnify and hold harmless Dexfin, its affiliates, and team members from any claims, damages, or losses arising from your use of the platform, violation of these Terms, or infringement of any third-party rights.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="changes-to-terms"
								scrollMarginTop="100px"
							>
								12. Changes to These Terms
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									We may update these Terms from time to time. We will notify users of significant changes, but it is your responsibility to review the Terms periodically. Continued use of Dexfin after modifications constitutes acceptance of the updated Terms.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="governing-law"
								scrollMarginTop="100px"
							>
								13. Governing Law and Dispute Resolution
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									These Terms shall be governed by and interpreted in accordance with the laws of Czech Republic. Any disputes shall be resolved through arbitration or the courts of Czech Republic.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="contact-us"
								scrollMarginTop="100px"
							>
								14. Contact Information
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									For any questions or concerns regarding these Terms, contact us at{' '}
									<Link href="mailto:hello@dexfin.com" color="brand.400" fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
										hello@dexfin.com
									</Link>.
								</Text>
							</Box>
						</Box>
					</VStack>

					<Flex justify="center" mt={16} mb={8}>
						<Box 
							p={4} 
							borderRadius="md" 
							bg="whiteAlpha.100" 
							textAlign="center"
							maxW="md"
						>
							<Text color="whiteAlpha.700" fontSize="sm">
								By using Dexfin, you acknowledge that you have read, understood, and agreed to these Terms of Service.
							</Text>
						</Box>
					</Flex>
				</Container>
			</Box>

			<Footer />
		</Flex>
	);
};

export default Terms;
