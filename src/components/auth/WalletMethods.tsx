import {Connector, CreateConnectorFn, useConnect} from 'wagmi';
import {Button, Text, VStack, Image} from "@chakra-ui/react";
import  {useMemo} from "react";

interface WalletMethodsProps {
    authWithEthWallet: (connector: any) => Promise<void>;
    setView: React.Dispatch<React.SetStateAction<string>>;
}

const WalletMethods = ({authWithEthWallet, setView}: WalletMethodsProps) => {
    const {connectors} = useConnect();
    console.log("connectors", connectors)

    const filteredConnectors = useMemo(() => {
        const result: Connector<CreateConnectorFn>[] = []
        const vis: Record<string, boolean> = {}
        connectors.map(connector => {
            if (!vis[connector.name])
                result.push(connector)
            vis[connector.name] = true
        })

        return result
    }, [connectors])

    return (
        <>
            <VStack spacing={3}>
                <Text fontSize="2xl" fontWeight="bold" textAlign='center' w="full">Connect your web3 wallet</Text>
                <Text color="whiteAlpha.800" textAlign='center'>
                    Connect your wallet then sign a message to verify you&apos;re the owner
                    of the address.
                </Text>
                <VStack spacing={4} w="full">
                    {filteredConnectors.map(connector => (
                        <Button
                            variant="outline"
                            w="full"
                            color="white"
                            borderColor="whiteAlpha.200"
                            _hover={{bg: 'whiteAlpha.100'}}
                            // disabled={!connector.ready}
                            key={connector.id}
                            onClick={() => authWithEthWallet(connector)}
                        >
                            {connector.name.toLowerCase() === 'metamask' && (
                                <div className="btn__icon">
                                    <Image
                                        src="/metamask.png"
                                        alt="MetaMask logo"
                                        width="2rem"
                                        // fill={true}
                                    />
                                </div>
                            )}
                            {connector.name.toLowerCase() === 'coinbase wallet' && (
                                <div className="btn__icon">
                                    <Image
                                        src="/coinbase.png"
                                        alt="Coinbase logo"
                                        width="2rem"
                                    />
                                </div>
                            )}
                            <Text w="full">Continue with {connector.name}</Text>
                        </Button>
                    ))}

                    <Button
                        onClick={() => setView('default')}
                        variant="outline"
                        w="full"
                        color="white"
                        borderColor="whiteAlpha.200"
                        _hover={{bg: 'whiteAlpha.100'}}
                    >
                        Back
                    </Button>
                </VStack>
            </VStack>
        </>
    );
};

export default WalletMethods;
