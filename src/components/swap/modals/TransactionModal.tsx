import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Link as ChakraLink,
	Text, Box
} from '@chakra-ui/react';
import { Check } from 'lucide-react';

interface TransactionModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	link: string;
}

export const TransactionModal = ({ open, setOpen, link }: TransactionModalProps) => {
	return (
		<Modal
			isCentered
			motionPreset="slideInBottom"
			closeOnOverlayClick={true}
			isOpen={open}
			onClose={() => setOpen(false)}
		>
			<ModalOverlay backdropFilter="blur(4px)"/>
			<ModalContent
				bg="#0e0e0e"
				color="white"
				borderRadius="xl"
				p={0}
			>
				<ModalCloseButton color="white" />

				<ModalBody display="flex" gap="8px" flexDir="column" alignItems="center" marginY="4rem" color="white">
					<Box className="flex-center mb-4">
						<Box
							backgroundColor="#00ffbf1a"
							color="#0dda75"
							borderRadius="100%"
							p="1.5rem"
							fontSize="2rem"
						>
							<Check />
						</Box>
					</Box>
					<Text as="h1" fontSize="xl" fontWeight="600">
						Transaction Submitted
					</Text>
				</ModalBody>

				<ChakraLink
					href={link}
					isExternal
					fontSize={'lg'}
					textAlign={'center'}
					padding="6px 1rem"
					borderRadius="0.375rem"
					bg="#183f6d"
					margin="0 1rem 1rem"
					color="white"
					_hover={{ textDecoration: 'none' }}
				>
					View Transaction
				</ChakraLink>
			</ModalContent>
		</Modal>
	);
};
