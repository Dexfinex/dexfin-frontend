import { IRelayPKP } from '@lit-protocol/types';
import React,{ useState } from 'react';
import {
  Box,
  Text,
  Alert,
  AlertIcon,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Heading,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

interface AccountSelectionProp {
  accounts: IRelayPKP[];
  setCurrentAccount: React.Dispatch<React.SetStateAction<IRelayPKP | undefined>>;
  error?: Error;
}

export default function AccountSelection({
                                           accounts,
                                           setCurrentAccount,
                                           error,
                                         }: AccountSelectionProp) {
  const [selectedValue, setSelectedValue] = useState<string>('0');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const account = accounts[parseInt(selectedValue)];
    return setCurrentAccount(account);
  }

  return (
      <Box className="container">
        <Box className="wrapper">
          {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <Text>{error.message}</Text>
              </Alert>
          )}
          <Heading as="h1" size="lg" mb={2}>
            Choose your account
          </Heading>
          <Text mb={4}>Continue with one of your accounts.</Text>
          <form onSubmit={handleSubmit} className="form">
            <FormControl as="fieldset">
              <FormLabel as="legend">View accounts</FormLabel>
              <RadioGroup
                  value={selectedValue}
                  onChange={setSelectedValue}
                  className="accounts-wrapper"
              >
                <Stack direction="column" spacing={3}>
                  {accounts.map((account, index) => (
                      <Box
                          key={`account-${index}`}
                          className={`account-item ${
                              selectedValue === index.toString() &&
                              'account-item--selected'
                          }`}
                      >
                        <Radio value={index.toString()} id={account.ethAddress}>
                          {account.ethAddress.toLowerCase()}
                        </Radio>
                      </Box>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>
            <Button type="submit" colorScheme="blue" mt={4}>
              Continue
            </Button>
          </form>
        </Box>
      </Box>
  );
}
