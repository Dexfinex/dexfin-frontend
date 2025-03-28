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
import { ChevronRight, Shield, Clock, Download, Home } from 'lucide-react';
import Header from './mainpage/Header';
import Footer from './mainpage/Footer';

const Privacy = () => {
	const sectionBg = useColorModeValue('whiteAlpha.100', 'blackAlpha.300');

	const handleDownload = () => {
		const fileUrl = '/documents/Privacy_Policy.docx';

		const link = document.createElement('a');
		link.href = fileUrl;
		link.setAttribute('download', 'Privacy_Policy.docx');

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
							<BreadcrumbLink color="brand.400">Privacy Policy</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					<Heading 
						as="h1" 
						size="2xl" 
						mb={5} 
						bgGradient="linear(to-r, brand.400, blue.400)" 
						letterSpacing="tight"
					>
						Privacy Policy
					</Heading>

					<Text color="whiteAlpha.800" fontSize="lg" maxW="3xl">
						We value your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information.
					</Text>

					<HStack mt={8} spacing={6} flexWrap="wrap">
						<Flex align="center" color="whiteAlpha.700">
							<Icon as={Shield} mr={2} />
							<Text fontSize="sm">Secure & Encrypted</Text>
						</Flex>
						<Flex align="center" color="whiteAlpha.700">
							<Icon as={Clock} mr={2} />
							<Text fontSize="sm">Effective Date: 01.01.2025</Text>
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
									Welcome to Dexfin. Your privacy is important to us, and we are committed to protecting your personal information.
								</Text>
								<Text color="whiteAlpha.800" mt={4} lineHeight="tall">
									This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you access our platform, services, and website.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="information-collected"
								scrollMarginTop="100px"
							>
								2. Information We Collect
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									We may collect the following types of information:
								</Text>
								<UnorderedList spacing={4} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>
										<Text as="span" fontWeight="bold" color="brand.300">Personal Information:</Text> Email address, wallet address, and other information you voluntarily provide.
									</ListItem>
									<ListItem>
										<Text as="span" fontWeight="bold" color="brand.300">Transaction Data:</Text> Details of transactions performed through Dexfin, including deposits, withdrawals, and trades.
									</ListItem>
									<ListItem>
										<Text as="span" fontWeight="bold" color="brand.300">Technical Information:</Text> IP address, browser type, operating system, and usage patterns collected via cookies and similar technologies.
									</ListItem>
									<ListItem>
										<Text as="span" fontWeight="bold" color="brand.300">Communications Data:</Text> Messages, feedback, and customer support interactions.
									</ListItem>
								</UnorderedList>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="information-usage"
								scrollMarginTop="100px"
							>
								3. How We Use Your Information
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									We use your data for the following purposes:
								</Text>
								<UnorderedList spacing={3} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>To provide and enhance our services</ListItem>
									<ListItem>To verify your identity and secure transactions</ListItem>
									<ListItem>To comply with legal and regulatory requirements</ListItem>
									<ListItem>To improve our platform and develop new features</ListItem>
									<ListItem>To communicate updates, security alerts, and promotional offers</ListItem>
								</UnorderedList>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="information-disclosure"
								scrollMarginTop="100px"
							>
								4. How We Share Your Information
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									We do not sell or rent your personal information. However, we may share your data with:
								</Text>
								<UnorderedList spacing={4} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>
										<Text as="span" fontWeight="bold" color="brand.300">Service Providers:</Text> Third-party vendors who assist in operating Dexfin.
									</ListItem>
									<ListItem>
										<Text as="span" fontWeight="bold" color="brand.300">Legal Authorities:</Text> If required by law or to enforce our policies.
									</ListItem>
									<ListItem>
										<Text as="span" fontWeight="bold" color="brand.300">Business Transfers:</Text> In case of mergers, acquisitions, or asset sales.
									</ListItem>
								</UnorderedList>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="data-security"
								scrollMarginTop="100px"
							>
								5. Data Security
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									We implement robust security measures to protect your data, including encryption, secure storage, and access controls. However, no online service is 100% secure, and we cannot guarantee absolute security.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="cookies"
								scrollMarginTop="100px"
							>
								6. Cookies and Tracking Technologies
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									Dexfin uses cookies and similar technologies to enhance user experience and collect analytics. You can manage cookie preferences through your browser settings.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="your-rights"
								scrollMarginTop="100px"
							>
								7. Your Rights and Choices
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									You have the right to:
								</Text>
								<UnorderedList spacing={3} pl={6} color="whiteAlpha.800" mt={4}>
									<ListItem>Access, update, or delete your personal data</ListItem>
									<ListItem>Opt-out of marketing communications</ListItem>
									<ListItem>Restrict or object to data processing under certain conditions</ListItem>
								</UnorderedList>
								<Text color="whiteAlpha.800" mt={4} lineHeight="tall">
									To exercise your rights, contact us at{' '}
									<Link href="mailto:hello@dexfin.com" color="brand.400" fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
										hello@dexfin.com
									</Link>.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="third-party-links"
								scrollMarginTop="100px"
							>
								8. Third-Party Links
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									Our platform may contain links to third-party websites. We are not responsible for their privacy practices, and we encourage you to review their policies.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="childrens-privacy"
								scrollMarginTop="100px"
							>
								9. Children's Privacy
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									Dexfin is not intended for individuals under 18 years of age. We do not knowingly collect data from minors.
								</Text>
							</Box>
						</Box>

						<Box>
							<Heading 
								as="h2" 
								size="lg" 
								mb={6} 
								color="brand.400"
								id="policy-changes"
								scrollMarginTop="100px"
							>
								10. Changes to This Privacy Policy
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									We may update this Privacy Policy from time to time. The latest version will be posted on our website with an updated effective date.
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
								11. Contact Us
							</Heading>
							<Box 
								p={6} 
								borderRadius="lg" 
								bg={sectionBg} 
								borderLeft="4px solid" 
								borderColor="brand.500"
							>
								<Text color="whiteAlpha.800" lineHeight="tall">
									If you have any questions or concerns about this Privacy Policy, please contact us at:{' '}
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
                            This Privacy policy ensures transparency and compliance with global data protection standards. If you need any modifications based on specific regulatory requirements, let me know!
							</Text>
						</Box>
					</Flex>
				</Container>
			</Box>

			<Footer />
		</Flex>
	);
};

export default Privacy;