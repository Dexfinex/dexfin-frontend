import {Alert, AlertIcon, Text} from "@chakra-ui/react";
import {ExtendedError} from "../types/auth.ts";

export const AuthAlert = ({error}: {error: ExtendedError | undefined}) => {
    return (
        <>
            {error && (
                <Alert status="error" bg="red.900" color="white" borderRadius="md" mb="2">
                    <AlertIcon/>
                    <Text fontSize="sm" width={'calc(100% - 2rem)'}>
                        {error.message} {error?.details?.[0]}
                    </Text>
                </Alert>
            )}
        </>
    )
}