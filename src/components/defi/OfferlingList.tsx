import React, { useContext } from "react";
import { numberToHex } from "viem";

import { Web3AuthContext } from "../../providers/Web3AuthContext";
import { TokenChainIcon } from '../swap/components/TokenIcon';
import useDefiStore, { Position } from '../../store/useDefiStore';
import { getTypeIcon, getTypeColor, } from "../../utils/defi.util";

interface OfferingListProps {
    setSelectedPositionType: (position: Position['type'] | 'ALL') => void,
    selectedPositionType: Position['type'] | 'ALL',
    handleAction: (type: 'deposit' | 'redeem' | 'borrow' | 'repay', position: Position) => void,
}

interface Offering extends Position {
    chainId: number;
}

const offerings: Offering[] = [
    {
        "chainId": 56,
        "address": "0x6ab0ae46c4b450bc1b4ffcaa192b235134d584b2",
        "protocol": "Uniswap v2",
        "protocol_id": "uniswap-v2",
        "type": "liquidity",
        "amount": 0,
        "apy": 0,
        "tokens": [
            {
                "token_type": "supplied",
                "name": "Tether USD",
                "symbol": "USDT",
                "contract_address": "0x55d398326f99059ff775485246999027b3197955",
                "decimals": "18",
                "logo": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
                "thumbnail": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            },
            {
                "token_type": "supplied",
                "name": "USD Coin",
                "symbol": "USDC",
                "contract_address": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
                "decimals": "18",
                "logo": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
                "thumbnail": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            },
            {
                "token_type": "defi-token",
                "name": "Uniswap V2",
                "symbol": "UNI-V2",
                "contract_address": "0x6ab0ae46c4b450bc1b4ffcaa192b235134d584b2",
                "decimals": "18",
                "logo": "",
                "thumbnail": "",
                "balance": "0",
                "balance_formatted": "0",
                "usd_price": 0,
                "usd_value": 0
            }
        ],
        "rewards": 0,
        "healthFactor": 0,
        "logo": "https://cdn.moralis.io/defi/uniswap.png",
        "factory": "0x8909dc15e40173ff4699343b6eb8132c65e18ec6"
    }
];

export const OfferingList: React.FC<OfferingListProps> = ({ setSelectedPositionType, selectedPositionType, handleAction }) => {

    const CATEGORY_LIST = ['LENDING', 'BORROWING', 'STAKING', 'LIQUIDITY'] as Position['type'][]

    const { chainId, switchChain } = useContext(Web3AuthContext);
    const { positions, } = useDefiStore();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => setSelectedPositionType('ALL')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${selectedPositionType === 'ALL'
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                        }`}
                >
                    All Types
                </button>
                {CATEGORY_LIST.map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedPositionType(type)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${selectedPositionType === type
                            ? 'bg-white/10'
                            : 'hover:bg-white/5'
                            }`}
                    >
                        {getTypeIcon(type)}
                        <span>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {offerings
                    .filter(o => selectedPositionType === 'ALL' || o.type.toLowerCase() === selectedPositionType.toLowerCase())
                    .map((offering, index) => (
                        <div
                            key={index}
                            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <TokenChainIcon src={offering.logo || ""} alt={offering.protocol || ""} size={"lg"} chainId={Number(offering.chainId)} />

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-medium">{offering.protocol}</h3>
                                        <span className={`text-sm ${getTypeColor(offering.type)}`}>
                                            {offering.type}
                                        </span>
                                        <span className="text-white/40">•</span>
                                        <span className="text-sm text-white/60">
                                            {`${offering.tokens[0]?.symbol}/${offering.tokens[1]?.symbol} ${offering.tokens[2]?.symbol}`}
                                        </span>
                                    </div>

                                    {/* <p className="text-sm text-white/60 mb-2">
                            this is description
                          </p> */}

                                    <div className="flex items-center gap-6">
                                        <div>
                                            <span className="text-sm text-white/60">Base APY</span>
                                            <div className={`${offering.type === 'BORROWING' ? 'text-red-400' : 'text-emerald-400'
                                                }`}>
                                                {offering.apy || "0"} %
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        if (Number(chainId) === Number(offering.chainId)) {
                                            const position = positions.find(position => position.address === offering.address && position.protocol === offering.protocol)
                                            handleAction(
                                                'deposit',
                                                position || offering
                                            );
                                        } else {
                                            await switchChain(parseInt(numberToHex(Number(offering.chainId)), 16));
                                        }
                                    }
                                    }
                                    className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg`}
                                >
                                    {Number(chainId) === Number(offering.chainId) ? "Get Started" : "Switch Network"}
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}