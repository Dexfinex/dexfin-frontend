import {
    Input, InputGroup, InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay, useBreakpointValue
} from '@chakra-ui/react';
import {Search , TrendingUp , TrendingDown} from 'lucide-react';
import "./style.css"
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { convertNumberIntoFormat, toFixedFloat } from "../../../utils/trade.util"
import { chainId2IconMap, DEFAULT_ICON_URL, CURRENCY_ICONS_URL } from "../../../constants/mock/tradepairs";

// Define types for the data structures
interface SymbolData {
    lastPrice?: number;
    vol24h?: number;
    change24h?: number;
    networks?: number[];
    fromCurrency?: string;
}

interface TableRowData {
    imgUrl: string;
    pair: string;
    tokenName: string;
    lastPrice: string;
    volume: string | undefined;
    change: string | number;
    networks?: number[] | string[];
}

interface SymbolToDataMap {
    [key: string]: SymbolData;
}

// Declare window property for savedPairsMap
declare global {
    interface Window {
        savedPairsMap?: Record<string, number[]>;
    }
}

interface TableRowProps {
    row: TableRowData;
    onClick: () => void;
}

interface TokenPairSelectModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setCurrentPairSymbol: (symbol: string) => void;
    symbolToDataMap: SymbolToDataMap;
}

const TableRow: React.FC<TableRowProps> = React.memo(({ row, onClick }) => {
    return (
        <div className='table-row'
             onClick={onClick}
             key={row.pair}>
            <div className="pair-column">
                <div className='flex'>
                    <img
                        src={row.imgUrl}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = DEFAULT_ICON_URL;
                        }}
                        alt={row.pair}
                    />
                    <p className='pair-name'>
                        {row.pair}
                    </p>
                    <p className='token-name'>
                        {row.tokenName}
                    </p>
                </div>
            </div>
            <div className="networks-column">
                {row.networks && row.networks.map(networkId => (
                    chainId2IconMap[networkId] &&
                    <img
                        key={networkId}
                        src={chainId2IconMap[networkId]}
                        alt={`Network ${networkId}`}
                    />
                ))}
            </div>
            <div className="price-column">
                {row.lastPrice}
            </div>
            <div className="volume-column">
                {row.volume}
            </div>
            <div className="change-column" style={{
                color: row.change < -0.004 ? '#f03349' : row.change > 0.004 ? '#179981' : 'white'
            }}>
                {isNaN(row.change) ? row.change : Math.abs(row.change)}%
                {
                    row.change < -0.004
                        ? <TrendingDown className='trending-icon' size={16}/>
                        : row.change > 0.004 ? <TrendingUp className='trending-icon' size={16}/> : null
                }
            </div>
        </div>
    )
});

export const TokenPairSelectModal: React.FC<TokenPairSelectModalProps> = ({
    open,
    setOpen,
    setCurrentPairSymbol,
    symbolToDataMap
}) => {
    const [tableData, setTableData] = useState<TableRowData[]>([]);
    const [searchKey, setSearchKey] = useState<string>('');
    const [filteredTableData, setFilteredTableData] = useState<TableRowData[]>([]);
    const [waitFlag, setWaitFlag] = useState<boolean>(true);
    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setWaitFlag(false);
            }, 300);
        } else {
            setWaitFlag(true);
        }
    }, [open]);

    useEffect(() => {
        const keys = Object.keys(symbolToDataMap);
        setTableData(keys.map(key => {
            const data = symbolToDataMap[key];
            const firstTokenName = key.split('-')[0];

            return {
                imgUrl: CURRENCY_ICONS_URL + firstTokenName.toLowerCase() + '.svg',
                pair: key,
                tokenName: firstTokenName,
                lastPrice: data.lastPrice ? toFixedFloat(data.lastPrice, 4) : 'N/A',
                volume: data.vol24h !== undefined ? convertNumberIntoFormat(data.vol24h) : 'N/A',
                change: data.change24h !== undefined ? toFixedFloat(data.change24h, 2) : '0',
                networks: window.savedPairsMap ? window.savedPairsMap[key] : [1]
            }
        }));
    }, [symbolToDataMap]);

    useEffect(() => {
        const newTableData = tableData.filter((row) => 
            row.pair && row.pair.toLowerCase().includes(searchKey.toLowerCase())
        );
        setFilteredTableData(newTableData);
    }, [tableData, searchKey]);

    const doClose = (): void => {
        setOpen(false);
    }

    return (
        <Modal
            isCentered={!isSmallScreen}
            motionPreset="slideInBottom"
            closeOnOverlayClick={true}
            isOpen={open}
            onClose={doClose}
        >
            <ModalOverlay/>
            <ModalContent
                className="trade-token-pair-select-modal"
            >
                <ModalBody display="flex" gap="8px" flexDir="column" alignItems="center" marginTop="1rem"
                           marginBottom="5px" color="white">
                    <div className="search-bar">
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <Search color={'#aaa'}/>
                            </InputLeftElement>
                            <Input
                                autoFocus
                                bg="#141619"
                                _focusVisible={{outline: 'none'}}
                                value={searchKey}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setSearchKey(e.target.value);
                                }}
                                placeholder='Search or paste any token'/>
                        </InputGroup>
                        <ModalCloseButton bg="none" color="white" pos="absolute" top="4px" right="0px"/>
                    </div>

                    {(Object.keys(symbolToDataMap).length <= 0 || waitFlag) ? (
                        <div className="flex-center loading-bar-container">
                            <ThreeDots color={'#444'}/>
                        </div>
                    ) : (
                        <div className="token-pair-table">
                            <div className="table-header">
                                <div className="pair-column">Pair</div>
                                <div className="networks-column">Networks</div>
                                <div className="price-column">Last price</div>
                                <div className="volume-column">Volume</div>
                                <div className="change-column">Change</div>
                            </div>
                            <div className="table-body">
                                {(searchKey ? filteredTableData : tableData).map((row, index) => (
                                    <TableRow
                                        key={'table-row-' + index}
                                        row={row}
                                        onClick={() => {
                                            setCurrentPairSymbol(row.pair);
                                            doClose();
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};