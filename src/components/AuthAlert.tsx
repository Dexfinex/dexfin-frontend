import {Alert, AlertIcon, Text} from "@chakra-ui/react";
import {ExtendedError} from "../types/auth.type.ts";

export const AuthAlert = ({error}: {error: ExtendedError | undefined}) => {
    return (
        <>
            {error && (
                <Alert status="error" color="white" borderRadius="md" mb="2">
                    <AlertIcon/>
                    <Text fontSize="sm" width={'calc(100% - 2rem)'}>
                        {/*{error.message} {error?.details?.[0]}*/}
                        Your session has expired. Please log in again.
                    </Text>
                </Alert>
            )}
        </>
    )
}