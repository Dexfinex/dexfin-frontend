import BigNumber from "bignumber.js";
import {Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useToast} from '@chakra-ui/react';
import {MdOutlineKeyboardArrowRight} from "react-icons/md";
import "./style.scss"
import {formatNumber} from "../../../../../../utils/token.util";
import {useState} from "react";
import {formatNumberByFrac, toFixedFloat} from "../../../../../../utils/trade.util";
import {BrowserProvider} from "ethers-v6";
import {useTokenApprove} from "../../../../../../hooks/useTokenApprove";
import {chainId2ChainMap} from "../../../../../../constants/chains.ts";


export interface IToken {
    logoURI: string;
    symbol: string;
    amount: number;
    priceUSD: number;
    balance: object;
}


interface IConfirmOrderModal {
    open: boolean,
    setOpen: any,
    swapType: string,
    fromToken: IToken,
    toToken: IToken,
    unit: any,
    price: number,
    signer: any,
    slippage: number,
    needPlatformFee: boolean,
    serviceInfo: any,
    networkFee: number,
    platformFee: number,
    pairConfig: any,
    feeAssetSymbol: string,
    isMarketSwap: boolean
}

export const ConfirmOrderModal = ({
                                      open,
                                      setOpen,
                                      swapType,
                                      unit,
                                      signer,
                                      slippage,
                                      isMarketSwap,
                                      serviceInfo,
                                      networkFee,
                                      platformFee,
                                      needPlatformFee,
                                      price,
                                      pairConfig,
                                      fromToken,
                                      feeAssetSymbol,
                                      toToken
                                  }: IConfirmOrderModal) => {

    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingText, setLoadingText] = useState('Confirm in your wallet');
    const toast = useToast();


    const handleConfirm = async () => {
        try {

            const decimals = pairConfig.qtyPrecision;
            // const decimals = serviceInfo?.assetToDecimals[fromToken.symbol];
            console.log("decimals", decimals);
            const roundedAmount = new BigNumber(fromToken.amount).decimalPlaces(
                decimals,
                BigNumber.ROUND_FLOOR
            ); // You can use your own Math lib

            setIsProcessing(true);
            // It may take a little more time. we are using multi sig wallet, all of my co-workers must agree to send you payment
            let functionName = 'swapMarket';

            // @ts-ignore
            const browserProvider = new BrowserProvider(window.ethereum);
            const browserSigner = await browserProvider.getSigner();

            const param = {
                type: swapType,// "exactSpend" , exactReceive
                assetIn: fromToken.symbol,
                assetOut: toToken.symbol,
                feeAsset: feeAssetSymbol,
                amount: roundedAmount.toNumber(),
                slippagePercent: slippage,
                signer: browserSigner, // or signer when UI
                options: {
                    // All options are optional 🙂
                    poolOnly: true, // You can specify whether you want to perform the exchange only through the pool
                    instantSettlement: true, // Set true to ensure that funds can be instantly transferred to wallet (otherwise, there is a possibility of receiving funds to the balance of the exchange contract)
                    logger: console.log,
                    // Set it to true if you want the issues associated with
                    // the lack of allowance to be automatically corrected
                    autoApprove: false,
                    developer: {
                        route: 'aggregator'
                    }
                },
            };

            if (!isMarketSwap) {
                functionName = 'swapLimit';
                delete param['slippagePercent'];
                // @ts-ignore
                param.price = price;
            }

            unit.exchange[functionName](param)
                .then(res => {
                    console.log("result", res);
                    setIsProcessing(false);
                    setOpen(false);
                    toast({
                        title: isMarketSwap ? 'confirmed successfully' : 'Order placed successfully',
                        status: 'success',
                        duration: 10000,
                        isClosable: true,
                        position: 'bottom-right',
                        containerStyle: {
                            width: '100%',
                            maxWidth: '300px',
                        }
                    })
                }).catch(error => {
                    console.log("ERROR", error);
                    setIsProcessing(false);
                    if (error.code == 'ACTION_REJECTED') {
                        toast({
                            title: 'Rejected order',
                            description: 'you rejected order',
                            status: 'info',
                            duration: 10000,
                            isClosable: true,
                            position: 'bottom-right',
                            containerStyle: {
                                width: '100%',
                                maxWidth: '300px',
                            }
                        })
                    } else {
                        toast({
                            title: 'Failed Order',
                            status: 'error',
                            description: error.message,
                            duration: 10000,
                            isClosable: true,
                            position: 'bottom-right',
                            containerStyle: {
                                width: '100%',
                                maxWidth: '300px',
                            }
                        })
                    }
            });

        } catch (e) {

        }
    }


    const {
        isApproved: isAssetInTokenApproved,
        // allowance,
        approveInfinite: approveFromTokenInfinite,
        isInfiniteLoading,
        approveReset: approveFromTokenReset,
        isLoading: isApprovalLoading
    } = useTokenApprove({
        token: (serviceInfo?.assetToAddress[fromToken.symbol]) as `0x${string}`,
        spender: serviceInfo?.exchangeContractAddress as `0x${string}`,
        amount: new BigNumber(toFixedFloat(fromToken.amount, 4))
            .times(new BigNumber(10)
                .pow(serviceInfo?.assetToDecimals[fromToken.symbol]))
            .toFixed(0),
        chain: chainId2ChainMap[serviceInfo?.chainId]?.network
    });



    return (
        <>
            <Modal
                isCentered
                motionPreset="slideInBottom"
                closeOnOverlayClick={true}
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <ModalOverlay/>
                <ModalContent
                    className="trade-confirm-order-modal"
                >
                    <ModalCloseButton color="white"/>

                    <ModalBody display="flex" gap="8px" flexDir="column" alignItems="center" marginTop="1rem"
                               marginBottom="1rem" color="white">

                        <div className="modal-title">Confirm Order</div>
                        <div className="block-wrapper">
                            <div className="block">
                                <img src={fromToken?.logoURI}/>
                                <div
                                    className="token-amount">{`${formatNumber(fromToken.amount, 4)} ${fromToken?.symbol}`}</div>
                                <div
                                    className="usd-amount"> ${formatNumber(fromToken.amount * fromToken.priceUSD)}</div>
                            </div>
                            <div className="arrow-wrapper">
                                <div className="arrow-box">
                                    <MdOutlineKeyboardArrowRight/>
                                </div>
                            </div>
                            <div className="block">
                                <img
                                    src={toToken?.logoURI}/>
                                <div
                                    className="token-amount">{`${formatNumber(toToken.amount, 4)} ${toToken?.symbol}`}</div>
                                <div className="usd-amount">${formatNumber(toToken.amount * toToken.priceUSD)}</div>
                            </div>
                        </div>
                        <div className="row-wrapper mt-1rem">
                            <div className="label">Price Impact</div>
                            <div className="content">
                                <span className="">0 %</span>
                            </div>
                        </div>
                        <div className="row-wrapper">
                            <div className="label">Network fee</div>
                            <div className="content">
                                <span className="">{networkFee} {serviceInfo?.baseSymbol}</span>
                            </div>
                        </div>
                        <div className="row-wrapper">
                            <div className="label">Platform fee</div>
                            <div className="content">
                                <span className="">{needPlatformFee ? platformFee : 0} {serviceInfo?.baseSymbol}</span>
                            </div>
                        </div>
                        {
                            needPlatformFee && (
                                <div className="row-wrapper">
                                    <div className="label">Total fee</div>
                                    <div className="content">
                                        <span className="fee-price">{formatNumberByFrac(networkFee + platformFee, 5)} {serviceInfo?.baseSymbol}
                                            {/*<span>($0.06)</span>*/}
                                        </span>
                                    </div>
                                </div>
                            )
                        }

                        {
                            (!isAssetInTokenApproved && fromToken?.symbol !== serviceInfo?.baseSymbol) ? (
                                <Button
                                    className="place-order-button"
                                    colorScheme={'blue'}
                                    onClick={() => {
                                        approveFromTokenInfinite();
                                    }}
                                    isDisabled={isInfiniteLoading}
                                    isLoading={isInfiniteLoading}
                                    loadingText={'approving...'}
                                >
                                    Allow Dexfin to use your {fromToken?.symbol}
                                </Button>
                            ) : (
                                <Button
                                    className="place-order-button"
                                    colorScheme={'blue'}
                                    onClick={handleConfirm}
                                    isDisabled={isProcessing}
                                    isLoading={isProcessing}
                                    loadingText={loadingText}
                                >
                                    Confirm
                                </Button>
                            )
                        }

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
