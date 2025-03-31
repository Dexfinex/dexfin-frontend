import {Alert, AlertIcon, Text} from "@chakra-ui/react";
import {ExtendedError} from "../types/auth.type.ts";
import {LitError} from "@lit-protocol/constants";
import {useMemo} from "react";
import { StytchAPIError } from '@stytch/core/public';

export const AuthAlert = ({error}: {error: ExtendedError | LitError | StytchAPIError | undefined }) => {
    console.log("AuthAlert", error)
    const errorMessage = useMemo(() => {
        if (error) {
            if (error instanceof LitError) {
                const litError = error as LitError;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return litError.info.message ?? litError.message
            } else if (error?.name === "StytchAPIError") {
                const stytchApiError = error as StytchAPIError
                const errorMessage = stytchApiError.error_message
                if (errorMessage.indexOf('encourage the user to try inputting the passcode again') > 0) {
                    return 'The passcode was incorrect and could not be authenticated'
                }
                return errorMessage
            }
            return error.message
        }
        return ''
    }, [error])
    return (
        <>
            {error && (
                <Alert status="error" color="white" borderRadius="md">
                    <AlertIcon/>
                    <Text fontSize="sm" width={'calc(100% - 2rem)'}>
                        { errorMessage }
                        {/*{error.message} {error?.details?.[0]}*/}
                        {/*Your session has expired. Please log in again.*/}
                    </Text>
                </Alert>
            )}
        </>
    )
}