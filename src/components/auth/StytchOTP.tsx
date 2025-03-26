import {FormEvent, useState} from 'react';
import {useStytch} from '@stytch/react';
import {Button, Input, InputGroup, InputLeftElement, Text, VStack} from "@chakra-ui/react";
import {Mail, Phone} from "lucide-react";
import {AuthAlert} from "../AuthAlert.tsx";

interface StytchOTPProps {
    method: OtpMethod;
    authWithStytch: (session_jwt: string, user_id: string, method: string) => Promise<void>;
    setView: React.Dispatch<React.SetStateAction<string>>;
}

type OtpMethod = 'email' | 'phone';
type OtpStep = 'submit' | 'verify';

/**
 * One-time passcodes can be sent via phone number through Stytch
 */
const StytchOTP = ({method, authWithStytch, setView}: StytchOTPProps) => {
    const [step, setStep] = useState<OtpStep>('submit');
    const [userId, setUserId] = useState<string>('');
    const [methodId, setMethodId] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();

    const stytchClient = useStytch();

    async function sendPasscode() {
        setLoading(true);
        setError(undefined);
        try {
            let response;
            if (method === 'email') {
                response = await stytchClient.otps.email.loginOrCreate(userId);
            } else {
                response = await stytchClient.otps.sms.loginOrCreate(
                    !userId.startsWith('+') ? `+${userId}` : userId
                );
            }
            console.log(response);
            setMethodId(response.method_id);
            setStep('verify');
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function authenticate(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError(undefined);
        try {
            const response = await stytchClient.otps.authenticate(code, methodId, {
                session_duration_minutes: 60,
            });
            await authWithStytch(response.session_jwt, response.user_id, method);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {step === 'submit' && (
                <>
                    <AuthAlert error={error}/>
                    <VStack spacing={6}>
                        <Text fontSize="2xl" fontWeight="bold">Enter your {method}</Text>
                        <Text color="whiteAlpha.800">A verification code will be sent to your {method}.</Text>
                        <VStack spacing={4} w="full">
                            <InputGroup>
                                <InputLeftElement>
                                    {
                                        method === 'email' ? (
                                            <Mail size={20}/>
                                        ) : (
                                            <Phone size={20}/>
                                        )
                                    }
                                </InputLeftElement>
                                <Input
                                    id={method}
                                    value={userId}
                                    onChange={e => setUserId(e.target.value)}
                                    type={method === 'email' ? 'email' : 'tel'}
                                    name={method}
                                    placeholder={
                                        method === 'email' ? 'Your email' : 'Your phone number'
                                    }
                                />
                            </InputGroup>

                            <Button
                                colorScheme="blue"
                                w="full"
                                disabled={loading}
                                onClick={sendPasscode}
                            >
                                Send code
                            </Button>

                            <Button
                                w="full"
                                onClick={() => setView('default')}
                                variant="outline"
                                color="white"
                                borderColor="whiteAlpha.200"
                                _hover={{bg: 'whiteAlpha.100'}}
                            >
                                Back
                            </Button>

                        </VStack>
                    </VStack>
                </>
            )}
            {step === 'verify' && (
                <>
                    <VStack spacing={6}>
                        <Text fontSize="2xl" fontWeight="bold">Check your {method}</Text>
                        <Text color="whiteAlpha.800">Enter the 6-digit verification code to {userId}</Text>
                        <VStack spacing={4} w="full">
                            <InputGroup>
                                <Input
                                    id={method}
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    type="code"
                                    placeholder="Verification code"
                                    autoComplete="off"
                                />
                            </InputGroup>
                            <Button
                                colorScheme="blue"
                                w="full"
                                disabled={loading}
                                onClick={authenticate}
                            >Verify</Button>
                            <Button
                                w="full"
                                onClick={() => setStep('submit')}
                                variant="outline"
                                color="white"
                                borderColor="whiteAlpha.200"
                                _hover={{bg: 'whiteAlpha.100'}}
                            >
                                Try again
                            </Button>
                        </VStack>
                    </VStack>
                </>
            )}
        </>
    );
};

export default StytchOTP;
