import {
    Box, Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay, useToast
} from '@chakra-ui/react';
import {useContext, useEffect, useState} from "react";
import "./style.scss"
import MarketInput from "../../MarketInput";
import {IToken} from "../ConfirmOrderModal";
import {formatNumberByFrac} from "../../../../../../utils/trade.util";
import {Web3AuthContext} from '../../../../../../providers/Web3AuthContext';

interface IDepositWithdrawModal {
    open: boolean,
    setOpen: any,
    fromToken: IToken,
    networkFeeStr: string,
    unit: any,
    signer: any,
    isWithdrawWindow?: boolean
}

export const DepositWithdrawModal = ({
                                         open,
                                         setOpen,
                                         unit,
                                         networkFeeStr,
                                         signer,
                                         fromToken,
                                         isWithdrawWindow // true => withdraw , else => deposit
                                     }: IDepositWithdrawModal) => {

    // @ts-ignore
    const maxAmount = isWithdrawWindow ? fromToken?.balance?.contract : fromToken?.balance?.wallet;
    const {switchChain, chain: chainOnWallet} = useContext(Web3AuthContext);
    const [internalIsWithdrawWindow, setInternalIsWithdrawWindow] = useState(isWithdrawWindow);
    const [amount, setAmount] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleWarningMessage, setVisibleWarningMessage] = useState(false);
    const buttonNames = [25, 50, 75, 100];

    const isInvalidAmount = parseFloat(amount) > parseFloat(maxAmount);
    const isZeroAmount = parseFloat(amount) <= 0;
    const toast = useToast();

    useEffect(() => {
        if (open) {
            setInternalIsWithdrawWindow(isWithdrawWindow);
        }
    }, [open]);

    useEffect(() => {
        setVisibleWarningMessage(percentage === 100);
    }, [percentage]);

    const handleAction = () => {
        setIsLoading(true);

        try {

            const functionName = internalIsWithdrawWindow ? 'withdraw' : 'deposit';

            unit.exchange[functionName]({
                amount: amount,
                asset: fromToken.symbol,
                signer
            }).then(res => {
                setIsLoading(false);
                setOpen(false);
                toast({
                    title: `${internalIsWithdrawWindow ? 'Witdraw' : 'Deposit'} success`,
                    // description: '',
                    status: 'success',
                    duration: 15000,
                    isClosable: true,
                    position: 'bottom-right',
                    containerStyle: {
                        width: '100%',
                        maxWidth: '300px',
                    }
                })

            }).catch(error => {
                setIsLoading(false);
                toast({
                    title: `error occured`,
                    // description: '',
                    status: 'error',
                    duration: 15000,
                    isClosable: true,
                    position: 'bottom-right',
                    containerStyle: {
                        width: '100%',
                        maxWidth: '300px',
                    }
                })
            });

        } catch (e) {
            setIsLoading(false);
        }
    }


    const isValidSelectedChain = chainOnWallet ? parseInt(unit.chainId) === chainOnWallet.id : false;


    return (
        <Modal
            isCentered
            motionPreset="slideInBottom"
            closeOnOverlayClick={true}
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <ModalOverlay/>
            <ModalContent
                className="trade-deposit-modal"
            >
                <ModalBody display="flex" gap="8px" flexDir="column" alignItems="center" marginTop="4px"
                           marginBottom="5px" color="white">
                    <div className="header-wrapper">
                        <div className="">{internalIsWithdrawWindow ? 'Witdraw' : 'Deposit'}</div>
                        <ModalCloseButton bg="none" color="white" pos="absolute" top="12px" right="30px"/>
                    </div>
                    <div className="w-100">
                        <MarketInput
                            hasUnit={true}
                            hasLeftElement={false}
                            disabled={false}
                            isInvalid={isInvalidAmount}
                            unitName={fromToken.symbol}
                            value={amount}
                            setValue={(value) => {
                                setAmount(parseFloat(value));
                                setPercentage(0);
                            }}
                        />

                        <Box className="percentage-buttons-group">
                            {buttonNames.map((buttonName, index) => (
                                <Button
                                    className={"percentage-button " + (buttonName === percentage ? 'selected' : '')}
                                    onClick={() => {
                                        setAmount(formatNumberByFrac(maxAmount / 100 * buttonName, 6));
                                        setPercentage(buttonName);
                                    }}
                                    key={'slippage-btn' + buttonName}
                                >
                                    {buttonName} %
                                </Button>
                            ))}
                        </Box>

                        <div className={"deposit-info-row first-row " + (isInvalidAmount ? 'error' : '')}>
                            <div className="label">Available:</div>
                            <div className="value">${maxAmount} {fromToken.symbol}</div>
                        </div>

                        <div className="deposit-info-row">
                            <div className="label">Network fee:</div>
                            <div className="value">~{networkFeeStr}</div>
                        </div>

                        {
                            !internalIsWithdrawWindow && visibleWarningMessage && (
                                <div className="warning-text">
                                    Warning: don't deposit 100% of a native coin (e.g. ETH, BNB) as it is needed for
                                    performing transactions on Dexfin.
                                </div>
                            )
                        }
                        {
                            !isValidSelectedChain ? (
                                <Button className="deposit-button"
                                        colorScheme={'messenger'}
                                        onClick={() => switchChain(parseInt(unit.chainId))}>
                                    Switch Network
                                </Button>
                            ) : (
                                <Button className="deposit-button"
                                        isLoading={isLoading}
                                        loadingText={'please wait...'}
                                        colorScheme={'messenger'}
                                        isDisabled={isInvalidAmount || !amount || isZeroAmount}
                                        onClick={handleAction}>
                                    {internalIsWithdrawWindow ? `Withdraw ${fromToken.symbol}` : 'Deposit'}
                                </Button>
                            )
                        }

                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
