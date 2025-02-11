import MarketInput from "../MarketInput/index";
import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import BenefitsSlider from "../BenefitsSlider/index.tsx";
import { useSwapInfoHook } from "../../../../../hooks/UseSwapinfoHook.js";
import { formatNumberByFrac, getExchangeIconUrlFrom, getRealExchangeDescription, toFixedFloat } from "../../../../../utils/trade.util";
import { Web3AuthContext } from "../../../../../providers/Web3AuthContext.js";
// import {Orion} from "@orionprotocol/sdk";
import BigNumber from "bignumber.js";
// import { BrowserProvider, Wallet } from "ethers-v6";
import { DepositWithdrawModal } from "../Modals/DepositAndWithdrawModal";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { getAssetIconUrlBySymbolName } from "../../../../../constants/mock/tradepairs.ts";
import { unit } from "../../../../TradingViewModal.tsx"
import { ConfirmOrderModal, IToken } from "../Modals/ConfirmOrderModal";
import { getTokenPriceByTokenAddress } from "../../../../../utils/Token.util.ts";

interface IPairConfig {
    pricePrecision: number;
    minQty?: number;
}

interface IChainServiceInfo {
    assetToAddress: object;
    assetToDecimals: object;
    chainId: number;
    chainName: string;
    exchangeContractAddress: string;
    matcherAddress: string;
    oracleContractAddress: string;
    orderFeePercent: number;
    swapExecutorContractAddress: string;
    baseSymbol: string;
}

interface IQuotedPriceInfo {
    prices: object;
    quoteAsset: string;
    quoteAssetAddress: string;
}

interface IMarketAndLimitPanel {
    feeAssets: object;
    balances: object;
    currentTabIndex: number;
    currentPairSymbol: string;
    defaultBuyPrice: number;
    defaultSellPrice: number;
    symbolAssetIn: string;
    symbolAssetOut: string;
    pairConfig: IPairConfig;
    chainServiceInfo: IChainServiceInfo;
    quotedPriceInfo: IQuotedPriceInfo;
    setGlobalNetworkGasFee: () => void;
}

interface IFeeAssetItem {
    symbol: string;
    percentage: string;
    feeAmount: number;
}

interface IFeeAssetRow {
    item: IFeeAssetItem,
    isBottomMenu?: boolean
}

const FeeAssetRow = ({ item, isBottomMenu }: IFeeAssetRow) => {

    if (!item)
        return null;

    return (
        <div className={"fee-asset-row glass " + (isBottomMenu ? 'bottom-menu' : '')}>
            <div className="token-symbol">
                <img width="27"
                    height="27"
                    src={getAssetIconUrlBySymbolName(item.symbol)}
                />
                <div className="symbol">{item.symbol}</div>
            </div>
            <div className="description">({item.percentage}%) {item.feeAmount}</div>
        </div>
    )
};


const MarketAndLimitPanel = ({
    balances,
    feeAssets,
    chainServiceInfo,
    quotedPriceInfo,
    currentTabIndex,
    currentPairSymbol,
    pairConfig,
    symbolAssetIn,
    symbolAssetOut,
    defaultBuyPrice,
    defaultSellPrice,
    setGlobalNetworkGasFee
}: IMarketAndLimitPanel) => {


    const buttonNames = [25, 50, 75, 100];
    const TabNames = ['buy', 'sell'];
    const [activeTabName, setActiveTabName] = useState(TabNames[0]); // Default to assistant
    const [percentage, setPercentage] = useState(0); // Default to assistant
    const [slippage, setSlippage] = useState(0.5); // Default to assistant
    const [depositWithdrawModalVisible, setDepositWithdrawModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [priceAssetOut, setPriceAssetOut] = useState(0);

    const { switchChain, login, isConnected, signer, address, chain: chainOnWallet } = useContext(Web3AuthContext);
    const [amountAssetIn, setAmountAssetIn] = useState(0);
    const [amountAssetOut, setAmountAssetOut] = useState(0);
    const [price, setPrice] = useState(0);
    const [feeAssetItems, setFeeAssetItems] = useState([]);
    const [networkGasFee, setNetworkGasFee] = useState(0);

    const [currentFeeAssetSymbol, setCurrentFeeAssetSymbol] = useState('USDT');
    const [currentFeeAssetItem, setCurrentFeeAssetItem] = useState(null);

    const { swapInfo, gasWei, tradeProfits } = useSwapInfoHook(currentPairSymbol, activeTabName, amountAssetIn);

    const assetInHasLabel = currentTabIndex === 0 && activeTabName === 'buy' ? true : false;
    const assetOutHasLabel = currentTabIndex === 0 && activeTabName === 'sell' ? true : false;
    const assetOutInputDisabled = currentTabIndex === 0 ? true : false;


    const exchangeImgUrl = (swapInfo && swapInfo.exchanges.length > 0)
        ? getExchangeIconUrlFrom(swapInfo.exchanges[0])
        : 'bot.png';

    const poolDescription = (swapInfo && swapInfo.exchanges.length > 0)
        ? swapInfo.exchanges.map(exchangeKey => getRealExchangeDescription(exchangeKey)).join(' and ')
        : 'Dexfin Pool';

    useEffect(() => {

        if (currentTabIndex === 0) {

            if (amountAssetIn == 0) {
                setPrice(activeTabName === 'buy' ? defaultBuyPrice : defaultSellPrice);
            }

        }

    }, [defaultBuyPrice, defaultSellPrice]);


    useEffect(() => {

        if (symbolAssetOut && chainServiceInfo?.assetToAddress[symbolAssetOut]) {
            (async () => {
                const priceUSD = await getTokenPriceByTokenAddress(chainServiceInfo?.assetToAddress[symbolAssetOut], chainServiceInfo?.chainId);
                setPriceAssetOut(priceUSD);
            })();
        }

    }, [symbolAssetOut, chainServiceInfo]);


    useEffect(() => {
        if (currentTabIndex === 1 && price && amountAssetIn) {
            // @ts-ignore
            setAmountAssetOut(formatNumberByFrac(parseFloat(price) * amountAssetIn));
        }
    }, [amountAssetIn, price]);


    useEffect(() => {
        console.log("swapInfo changed", swapInfo);
        if (swapInfo && currentTabIndex === 0 && swapInfo?.[activeTabName === 'buy' ? 'amountOut' : 'amountIn'] == amountAssetIn) {

            const priceValue = activeTabName === 'buy'
                ? 1 / swapInfo.marketPrice
                : swapInfo.marketPrice;
            const totalvalue = activeTabName === 'buy' ? swapInfo.amountIn : swapInfo.amountOut;

            setPrice(parseFloat(toFixedFloat(priceValue, pairConfig.pricePrecision)));
            // setPrice(priceValue);
            setAmountAssetOut(totalvalue);
        }

    }, [swapInfo]);

    const feeAssetAmountBySymbol = (symbol, percentage) => {
        const assetAmount = symbol === symbolAssetIn ? amountAssetIn : amountAssetOut;
        if (assetAmount) {
            return parseFloat(formatNumberByFrac(assetAmount / 100 * parseFloat(percentage), 7));
        }

        return 0;
    }

    useEffect(() => {

        if (feeAssets && Object.keys(feeAssets).length > 0) {
            const _newItems = Object.keys(feeAssets).map(symbol => ({
                symbol,
                percentage: feeAssets[symbol],
                feeAmount: feeAssetAmountBySymbol(symbol, feeAssets[symbol])
            }));
            setFeeAssetItems(_newItems);
            setCurrentFeeAssetItem(getCurrentFeeAssetItem(_newItems, currentFeeAssetSymbol));
        }


        console.log("feeAssets---", feeAssets);

    }, [feeAssets, amountAssetIn])


    const getCurrentFeeAssetItem = (items, symbol) => {
        if (items && items.length > 0) {
            return items.filter(item => item.symbol === symbol)[0];
        }

        return null;
    }


    useEffect(() => {

        const baseDecimals = chainServiceInfo?.assetToDecimals[chainServiceInfo?.baseSymbol];
        if (baseDecimals) {
            const gasPrice = gasWei / Math.pow(10, baseDecimals) * 22e4;
            const calculatedValue = parseFloat(formatNumberByFrac(gasPrice, 5));
            setNetworkGasFee(calculatedValue);
            setGlobalNetworkGasFee(calculatedValue);
        }

    }, [gasWei, chainServiceInfo]);



    const handleAction = () => {

        setConfirmModalVisible(true)
        return;
    }


    const { balanceAssetIn, balanceAssetOut } = useMemo(() => {

        const balanceAssetIn = balances[symbolAssetIn];
        const balanceAssetOut = balances[symbolAssetOut];
        console.log("balanceAssetIn", balanceAssetIn);
        console.log("balanceAssetOut", balanceAssetOut);

        return {
            balanceAssetIn,
            balanceAssetOut,
        }
    }, [symbolAssetIn, symbolAssetOut, balances]);


    const getRealAmount = (assetBalance, symbol) => {
        if (assetBalance?.wallet) {
            if (chainServiceInfo?.baseSymbol === symbol)
                return parseFloat(assetBalance?.wallet) + parseFloat(assetBalance?.tradable);

            return parseFloat(assetBalance?.wallet) + parseFloat(assetBalance?.contract);
        }

        return 0;
    }

    const availableAmount = activeTabName === 'buy' ? getRealAmount(balanceAssetOut, symbolAssetOut) : getRealAmount(balanceAssetIn, symbolAssetIn);
    const availableSymbol = activeTabName === 'buy' ? symbolAssetOut : symbolAssetIn;

    const availableAssetInAmount = activeTabName === 'sell'
        ? availableAmount
        : (price ? availableAmount / price : 0);

    const minQty = (pairConfig?.minQty && price)
        ? (activeTabName === 'buy'
            ? parseFloat(formatNumberByFrac(pairConfig?.minQty / price))
            : pairConfig?.minQty)
        : 0;

    const isInsufficientAssetIn = amountAssetIn < minQty || amountAssetIn > availableAssetInAmount;

    const isInsufficientAssetOut = activeTabName === 'buy' && amountAssetOut > availableAmount;
    const invalidTextAssetIn = amountAssetIn < minQty ? `Min ${minQty}` : 'insufficient balance';
    const isValidSelectedChain = chainOnWallet ? parseInt(unit.chainId) === chainOnWallet.id : false;


    // for confirm-order-modal
    const assetInToken: IToken = {
        logoURI: getAssetIconUrlBySymbolName(symbolAssetIn),
        symbol: symbolAssetIn,
        amount: amountAssetIn,
        priceUSD: price,
        balance: balanceAssetIn,
    }

    const assetOutToken: IToken = {
        logoURI: getAssetIconUrlBySymbolName(symbolAssetOut),
        symbol: symbolAssetOut,
        amount: amountAssetOut,
        priceUSD: priceAssetOut,
        balance: balanceAssetOut,
    }

    const fromToken: IToken = activeTabName === 'buy' ? assetOutToken : assetInToken;
    const toToken: IToken = activeTabName === 'sell' ? assetOutToken : assetInToken;


    // @ts-ignore
    const isNeccessaryToDeposit = fromToken.symbol === chainServiceInfo?.baseSymbol && parseFloat(fromToken.balance?.tradable) < parseFloat(fromToken.amount);
    // @ts-ignore
    const isNeccessaryToWithdraw = activeTabName === 'buy' &&
        fromToken.symbol !== chainServiceInfo?.baseSymbol &&
        parseFloat(assetInToken.amount) > 0 &&
        parseFloat(fromToken.balance?.contract) > parseFloat(assetInToken.amount);


    useEffect(() => {

        let _amountAssetIn = amountAssetIn;

        if (percentage != 0) {
            _amountAssetIn = parseFloat(formatNumberByFrac(availableAssetInAmount * percentage / 100));
            setAmountAssetIn(_amountAssetIn);
        }

        setAmountAssetOut(formatNumberByFrac(_amountAssetIn * price, 5));

    }, [activeTabName]);


    const calculatePlatformFeePriceByBaseSymbol = (feeAssetItem) => {

        if (!feeAssetItem || !quotedPriceInfo || !chainServiceInfo)
            return 0;

        if (feeAssetItem?.symbol == chainServiceInfo?.baseSymbol) {
            return feeAssetItem?.feeAmount
        }

        const feeAssetTokenPrice = parseFloat(quotedPriceInfo.prices[chainServiceInfo?.assetToAddress[feeAssetItem?.symbol]]);
        const baseTokenPrice = parseFloat(quotedPriceInfo.prices[chainServiceInfo?.assetToAddress[chainServiceInfo?.baseSymbol]]);

        return formatNumberByFrac(feeAssetItem?.feeAmount * feeAssetTokenPrice / baseTokenPrice);
    }


    return (
        // <div className="w-full text-white bg-black">
        <div className="relative w-full text-white bg-black border glass">
            <MarketInput
                hasLeftElement={true}
                disabled={currentTabIndex === 0}
                isInvalid={false}
                label={'Price'}
                value={price}
                setValue={setPrice}
            />
            <MarketInput
                onFocus={() => {
                    setPercentage(0)
                }}
                hasLeftElement={assetInHasLabel}
                hasUnit={true}
                // isInvalid={amountAssetIn > 0 && !isAssetInTokenApproved}
                isInvalid={isInsufficientAssetIn}
                invalidText={invalidTextAssetIn}
                unitName={symbolAssetIn}
                label={'Amount'}
                value={amountAssetIn}
                setValue={setAmountAssetIn}
            />
            <Box
                display="flex"
                gap="1"
                width="100%"
                my="3"  // Changed this: added margin top and bottom
            >
                {buttonNames.map((buttonName, index) => (
                    <Button
                        onClick={() => {
                            setAmountAssetIn(parseFloat(formatNumberByFrac(availableAssetInAmount * 0.25 * (1 + index))));
                            setPercentage(buttonName);
                        }}
                        key={'slippage-btn' + buttonName}
                        variant="ghost"
                        bg={buttonName === percentage ? "#a8adb8" : "#71717a"}
                        color={buttonName === percentage ? "#3d434f" : "whiteAlpha.600"}
                        _hover={{
                            bg: "#red",
                            color: "#a8adb8"
                        }}
                        height="28px"
                        flex="1"
                        borderRadius="md"
                        fontSize="13px"
                        fontWeight="medium"
                        p="0"
                        border="1px solid"
                        borderColor={buttonName === percentage ? "#262a2e" : "#2C3036"}
                    >
                        {buttonName} %
                    </Button>
                ))}
            </Box>
            {/* Available, Buy Sell */}
            <div className="w-full">
                {/* Available Amount */}
                <div className="flex items-center justify-between w-full mb-4">
                    <span className="text-sm text-gray-400">Available</span>
                    <span className="text-sm text-blue-400">
                        {formatNumberByFrac(availableAmount, 6)} {availableSymbol}
                    </span>
                </div>

                {/* Navigation Tabs */}
                <div className="relative flex w-full p-1 rounded-lg bg-zinc-900 glass">
                    {TabNames.map((tabName, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTabName(tabName)}
                            className={`
              flex-1 py-2 px-4 rounded-lg text-sm font-medium
              transition-all duration-200 ease-in-out
              ${activeTabName === tabName
                                    ? 'bg-zinc-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }
            `}
                        >
                            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <MarketInput
                disabled={assetOutInputDisabled} // setDisabled when select market tab
                hasLeftElement={assetOutHasLabel}
                hasUnit={true}
                isInvalid={isInsufficientAssetOut}
                invalidText={'insufficient balance'}
                unitName={symbolAssetOut}
                label={'Total'}
                value={amountAssetOut}
                setValue={setAmountAssetOut}
                
            />
            {/* Network fee.....Order will be ... */}

            <div className="space-y-6 text-sm">
                {(swapInfo && swapInfo.poolOptimal === false) ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-gray-400">
                            <span>Network fee:</span>
                            <span>{networkGasFee} {chainServiceInfo?.baseSymbol}</span>
                        </div>

                        <div className="flex items-center justify-between text-gray-400">
                            <span>Total fee:</span>
                            <span>{networkGasFee} {chainServiceInfo?.baseSymbol}</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 text-gray-400">
                            <span>Network fee:</span>
                            <span>{networkGasFee} {chainServiceInfo?.baseSymbol}</span>
                        </div>

                        <div className="flex items-center justify-between pb-3 text-gray-400">
                            <span>fee</span>
                            <span className="text-blue-400">0%</span>
                        </div>

                        <div className="flex items-start gap-3 pt-2 text-gray-400">
                            <div className="flex-shrink-0">
                                <img
                                    src={exchangeImgUrl}
                                    alt="Exchange"
                                    className="w-10 h-10 animate-spin"
                                />
                            </div>
                            <div className="text-sm leading-relaxed">
                                The order will be executed directly on the Exchange Contract via {poolDescription}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2 ">
                <span className="text-blue-400 text-sm w-[50%]">Max slippage</span>
                <div className="w-full py-1 rounded">
                    <MarketInput
                        hasUnit={true}
                        isInvalid={false}
                        unitName={'%'}
                        value={slippage}
                        setValue={(v) => {
                            setSlippage(v);
                        }}
                    />
                </div>
            </div>


            {/* connect wallet */}
            <div className="flex items-center justify-center p-2">
                {
                    !isConnected ? (
                        <Button className="w-full py-3 font-medium text-white transition-all duration-200 ease-in-out bg-blue-400 rounded-full hover:bg-blue-500"
                            colorScheme={'messenger'}
                            onClick={login}>
                            Connect Wallet
                        </Button>
                    ) : !isValidSelectedChain ? (
                        <Button className="w-full py-3 font-medium text-white transition-all duration-200 ease-in-out bg-blue-400 rounded-full hover:bg-blue-500"
                            colorScheme={'messenger'}
                            onClick={() => switchChain(parseInt(unit.chainId))}>
                            Switch Network
                        </Button>
                    ) : (isNeccessaryToDeposit || isNeccessaryToWithdraw) ? (
                        <Button className="w-full py-3 font-medium text-white transition-all duration-200 ease-in-out bg-blue-400 rounded-full hover:bg-blue-500"
                            colorScheme={'messenger'}
                            onClick={() => setDepositWithdrawModalVisible(true)}>
                            {isNeccessaryToDeposit ? 'Deposit ' : 'Withdraw '} {fromToken.symbol}
                        </Button>
                    ) : (
                        <Button className="w-full py-3 font-medium text-white transition-all duration-200 ease-in-out bg-blue-400 rounded-full hover:bg-blue-500"
                            colorScheme={'messenger'}
                            onClick={handleAction}
                            isDisabled={amountAssetIn == 0 || isInsufficientAssetIn || isInsufficientAssetOut}
                        >
                            {(activeTabName.charAt(0).toUpperCase() + activeTabName.slice(1)) + ' ' + symbolAssetIn}
                        </Button>
                    )
                }

            </div>

            <BenefitsSlider tradeProfits={tradeProfits} />
            {
                depositWithdrawModalVisible && (
                    <DepositWithdrawModal
                        unit={unit}
                        isWithdrawWindow={isNeccessaryToWithdraw}
                        signer={signer}
                        networkFeeStr={`${networkGasFee} ${chainServiceInfo?.baseSymbol}`}
                        fromToken={fromToken}
                        open={depositWithdrawModalVisible}
                        setOpen={setDepositWithdrawModalVisible}
                    />
                )
            }
            {
                confirmModalVisible && (
                    <ConfirmOrderModal
                        unit={unit}
                        swapType={activeTabName === 'buy' ? 'exactReceive' : 'exactSpend'}
                        isMarketSwap={currentTabIndex === 0 ? true : false}
                        slippage={slippage}
                        signer={signer}
                        price={price}
                        networkFee={networkGasFee}
                        platformFee={calculatePlatformFeePriceByBaseSymbol(currentFeeAssetItem)}
                        needPlatformFee={swapInfo && swapInfo.poolOptimal === false}
                        open={confirmModalVisible}
                        setOpen={setConfirmModalVisible}
                        serviceInfo={chainServiceInfo}
                        pairConfig={pairConfig}
                        fromToken={fromToken}
                        feeAssetSymbol={currentFeeAssetSymbol}
                        toToken={toToken} />
                )
            }
        </div>
        // </div>
    );
}

export default MarketAndLimitPanel;
