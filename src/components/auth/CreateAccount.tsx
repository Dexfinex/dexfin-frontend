import {Button, Text, VStack} from "@chakra-ui/react";
import {AuthAlert} from "../AuthAlert";

interface CreateAccountProp {
  signUp: () => void;
  error?: Error;
}

export default function CreateAccount({ signUp, error }: CreateAccountProp) {
  return (
    <div className="container">
      <div className="wrapper">
        <AuthAlert error={error}/>
        <VStack spacing={3}>
          <Text fontSize="2xl" fontWeight="bold" textAlign={'left'} w="full">New To Dexfin?</Text>
          <Text color="whiteAlpha.800">
            There doesn&apos;t seem to be a Lit wallet associated with your
            credentials. Create one today.
          </Text>
          <VStack spacing={4} w="full">
          </VStack>
        </VStack>

        <Button
            colorScheme="blue"
            w="full"
            onClick={signUp}
        >Sign up</Button>
      </div>
    </div>
  );
}
