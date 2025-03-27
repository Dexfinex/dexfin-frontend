import { useContext, useState } from "react";
import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Icon,
  Button,
  useColorModeValue,
  chakra,
} from "@chakra-ui/react";
import { Twitter, Send, BookOpen } from "lucide-react";
import Logo from "./Logo";
import { Web3AuthContext } from "../../providers/Web3AuthContext";
import { useStore } from "../../store/useStore";
import SignupModal from "../SignupModal";
import SignInModal from "../SignInModal";

const Header = () => {
  // Create dynamic colors for hover effects
  const hoverColor = useColorModeValue("blue.500", "blue.300");
  const buttonBgHover = useColorModeValue("blue.600", "blue.400");
  
  // Local state for modals to ensure they work
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  
  const { isConnected } = useContext(Web3AuthContext);
  
  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        h="70px"
        bg="rgba(0, 0, 0, 0.75)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
        zIndex={1000}
        transition="all 0.3s ease"
      >
        <Container maxW="container.xl" h="full">
          <Flex justify="space-between" align="center" h="full">
            <chakra.div
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Logo />
            </chakra.div>

            <HStack spacing={{ base: 2, md: 6 }}>
              <HStack spacing={5} mr={{ base: 2, md: 6 }}>
                <Link
                  href="https://x.com/Dexfinapp"
                  isExternal
                  color="white"
                  _hover={{
                    color: hoverColor,
                    transform: "translateY(-2px)",
                  }}
                  display="flex"
                  alignItems="center"
                  transition="all 0.2s ease"
                  aria-label="Twitter"
                >
                  <Icon as={Twitter} boxSize={5} />
                </Link>
                <Link
                  href="https://t.me/dexfinapp"
                  isExternal
                  color="white"
                  _hover={{
                    color: hoverColor,
                    transform: "translateY(-2px)",
                  }}
                  display="flex"
                  alignItems="center"
                  transition="all 0.2s ease"
                  aria-label="Telegram"
                >
                  <Icon as={Send} boxSize={5} />
                </Link>
                <Link
                  href="https://mirror.xyz/0xdE43F77a2954c3B7b11bA1284887449196849a5a"
                  isExternal
                  color="white"
                  _hover={{
                    color: hoverColor,
                    transform: "translateY(-2px)",
                  }}
                  display="flex"
                  alignItems="center"
                  transition="all 0.2s ease"
                  aria-label="Mirror"
                >
                  <Icon as={BookOpen} boxSize={5} />
                </Link>
              </HStack>

              {isConnected ? (
                <HStack spacing={3}>
                  <Button
                    variant="ghost"
                    color="whiteAlpha.800"
                    _hover={{
                      color: "white",
                      bg: "whiteAlpha.100",
                    }}
                    size={{ base: "sm", md: "md" }}
                    fontWeight="medium"
                    transition="all 0.2s ease"
                  >
                    Dexfin App
                  </Button>
                </HStack>
              ) : (
                <HStack spacing={3}>
                  <Button
                    variant="ghost"
                    color="whiteAlpha.800"
                    _hover={{
                      color: "white",
                      bg: "whiteAlpha.100",
                    }}
                    size={{ base: "sm", md: "md" }}
                    fontWeight="medium"
                    transition="all 0.2s ease"
                    onClick={() => setShowSignIn(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    bg="blue.500"
                    color="white"
                    _hover={{
                      bg: buttonBgHover,
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    size={{ base: "sm", md: "md" }}
                    onClick={() => setShowSignUp(true)}
                    fontWeight="semibold"
                    transition="all 0.2s ease"
                    px={6}
                  >
                    Sign Up
                  </Button>
                </HStack>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>
      <SignupModal 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)} 
      />
      
      <SignInModal 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)} 
        goToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />
    </>
  );
};

export default Header;

// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Container,
//   Flex,
//   HStack,
//   Link,
//   Icon,
//   Button,
//   useColorModeValue,
//   chakra,
// } from "@chakra-ui/react";
// import { Twitter, Send, BookOpen, ExternalLink } from "lucide-react";
// import Logo from "./Logo";
// import { Web3AuthContext } from "../../providers/Web3AuthContext";
// import { useStore } from "../../store/useStore";

// const Header = () => {
//   const navigate = useNavigate();
//   const hoverColor = useColorModeValue("blue.500", "blue.300");
//   const buttonBgHover = useColorModeValue("blue.600", "blue.400");
//   const appButtonBg = useColorModeValue("purple.500", "purple.400");
//   const appButtonHoverBg = useColorModeValue("purple.600", "purple.500");

//   const { isConnected } = useContext(Web3AuthContext);
  
//   const navigateToApp = () => {
//     navigate("/app");
//   };

//   return (
//     <>
//       <Box
//         position="fixed"
//         top={0}
//         left={0}
//         right={0}
//         h="70px"
//         bg="rgba(0, 0, 0, 0.75)"
//         backdropFilter="blur(12px)"
//         borderBottom="1px solid"
//         borderColor="whiteAlpha.200"
//         boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
//         zIndex={1000}
//         transition="all 0.3s ease"
//       >
//         <Container maxW="container.xl" h="full">
//           <Flex justify="space-between" align="center" h="full">
//             <chakra.div
//               transition="transform 0.3s ease"
//               _hover={{ transform: "scale(1.05)" }}
//               cursor="pointer"
//               onClick={() => navigate("/")}
//             >
//               <Logo />
//             </chakra.div>

//             <HStack spacing={{ base: 2, md: 6 }}>
//               <HStack spacing={5} mr={{ base: 2, md: 6 }}>
//                 <Link
//                   href="https://x.com/Dexfinapp"
//                   isExternal
//                   color="white"
//                   _hover={{
//                     color: hoverColor,
//                     transform: "translateY(-2px)",
//                   }}
//                   display="flex"
//                   alignItems="center"
//                   transition="all 0.2s ease"
//                   aria-label="Twitter"
//                 >
//                   <Icon as={Twitter} boxSize={5} />
//                 </Link>
//                 <Link
//                   href="https://t.me/dexfinapp"
//                   isExternal
//                   color="white"
//                   _hover={{
//                     color: hoverColor,
//                     transform: "translateY(-2px)",
//                   }}
//                   display="flex"
//                   alignItems="center"
//                   transition="all 0.2s ease"
//                   aria-label="Telegram"
//                 >
//                   <Icon as={Send} boxSize={5} />
//                 </Link>
//                 <Link
//                   href="https://mirror.xyz/0xdE43F77a2954c3B7b11bA1284887449196849a5a"
//                   isExternal
//                   color="white"
//                   _hover={{
//                     color: hoverColor,
//                     transform: "translateY(-2px)",
//                   }}
//                   display="flex"
//                   alignItems="center"
//                   transition="all 0.2s ease"
//                   aria-label="Mirror"
//                 >
//                   <Icon as={BookOpen} boxSize={5} />
//                 </Link>
//               </HStack>

//               {isConnected ? (
//                 <HStack spacing={3}>
//                   <Button
//                     bg={appButtonBg}
//                     color="white"
//                     _hover={{
//                       bg: appButtonHoverBg,
//                       transform: "translateY(-2px)",
//                       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
//                     }}
//                     _active={{
//                       bg: "purple.700",
//                       transform: "translateY(0)",
//                     }}
//                     size={{ base: "sm", md: "md" }}
//                     fontWeight="semibold"
//                     transition="all 0.2s ease"
//                     borderRadius="full"
//                     px={6}
//                     rightIcon={<ExternalLink size={16} />}
//                     onClick={navigateToApp}
//                   >
//                     Launch App
//                   </Button>
//                 </HStack>
//               ) : (
//                 <HStack spacing={3}>
//                   <Button
//                     variant="ghost"
//                     color="whiteAlpha.800"
//                     _hover={{
//                       color: "white",
//                       bg: "whiteAlpha.100",
//                     }}
//                     size={{ base: "sm", md: "md" }}
//                     fontWeight="medium"
//                     transition="all 0.2s ease"
//                     onClick={() =>
//                       useStore.getState().setIsSigninModalOpen(true)
//                     }
//                   >
//                     Sign In
//                   </Button>
//                   <Button
//                     bg="blue.500"
//                     color="white"
//                     _hover={{
//                       bg: buttonBgHover,
//                       transform: "translateY(-2px)",
//                       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//                     }}
//                     size={{ base: "sm", md: "md" }}
//                     onClick={() =>
//                       useStore.getState().setIsSignupModalOpen(true)
//                     }
//                     fontWeight="semibold"
//                     transition="all 0.2s ease"
//                     px={6}
//                   >
//                     Sign Up
//                   </Button>
//                 </HStack>
//               )}
//             </HStack>
//           </Flex>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default Header;