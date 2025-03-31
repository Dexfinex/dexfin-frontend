import {Button, VStack,} from '@chakra-ui/react';
import {Chrome, Mail, Wallet} from 'lucide-react';
import { TbBrandDiscord as Discord } from "react-icons/tb";
import {useContext} from "react";
import {Web3AuthContext} from "../../providers/Web3AuthContext.tsx";

interface AuthMethodsProps {
    handleGoogleLogin: (isSignIn: boolean) => Promise<void>;
    handleDiscordLogin: (isSignIn: boolean) => Promise<void>;
    setView: React.Dispatch<React.SetStateAction<string>>;
    isSignIn: boolean;
}

const AuthMethods = ({
                         handleGoogleLogin,
                         handleDiscordLogin,
                         setView,
                         isSignIn,
                     }: AuthMethodsProps) => {
    const {initializeErrors} = useContext(Web3AuthContext);
    return (
        <>
            <VStack spacing={4} w="full">
                <Button
                    w="full"
                    leftIcon={<Chrome size={20}/>}
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.200"
                    _hover={{bg: 'whiteAlpha.100'}}
                    onClick={() => {
                        initializeErrors()
                        handleGoogleLogin(isSignIn)
                    }}
                >
                    Continue with Google
                </Button>

                <Button
                    w="full"
                    leftIcon={<Discord size={20}/>}
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.200"
                    _hover={{bg: 'whiteAlpha.100'}}
                    onClick={() => {
                        initializeErrors()
                        handleDiscordLogin(isSignIn)
                    }}
                >
                    Continue with Discord
                </Button>

                <Button
                    w="full"
                    leftIcon={<Mail size={20}/>}
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.200"
                    _hover={{bg: 'whiteAlpha.100'}}
                    onClick={() => {
                        initializeErrors()
                        setView('email')
                    }}
                >
                    Continue with email
                </Button>
{/*
                <Button
                    w="full"
                    leftIcon={<Smartphone size={20}/>}
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.200"
                    _hover={{bg: 'whiteAlpha.100'}}
                    onClick={() => {
                        initializeErrors()
                        setView('phone')
                    }}
                >
                    Continue with phone
                </Button>
*/}
                <Button
                    w="full"
                    leftIcon={<Wallet size={20}/>}
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.200"
                    _hover={{bg: 'whiteAlpha.100'}}
                    onClick={() => {
                        initializeErrors()
                        setView('wallet')
                    }}
                >
                    Connect your web3 wallet
                </Button>
{/*
                <Button
                    w="full"
                    leftIcon={<Bot size={20}/>}
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.200"
                    _hover={{bg: 'whiteAlpha.100'}}
                    onClick={() => {
                        initializeErrors()
                        setView('webauthn')
                    }}
                >
                    Use a passkey
                </Button>
*/}
            </VStack>
        </>
    );
};

export default AuthMethods;
