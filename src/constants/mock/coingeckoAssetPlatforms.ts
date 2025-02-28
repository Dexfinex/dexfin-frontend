import { AssetPlatformType } from "../../types/swap.type.ts";

export const mapCoingeckoAssetPlatforms: Record<number, AssetPlatformType> = {
    1: {
        "id": "ethereum",
        "chain_identifier": 1,
        "name": "Ethereum",
        "shortname": "Ethereum",
        "native_coin_id": "ethereum"
    },
    10: {
        "id": "optimistic-ethereum",
        "chain_identifier": 10,
        "name": "Optimism",
        "shortname": "Optimism",
        "native_coin_id": "ethereum"
    },
    14: {
        "id": "flare-network",
        "chain_identifier": 14,
        "name": "Flare Network",
        "shortname": "",
        "native_coin_id": "flare-networks"
    },
    19: { "id": "songbird", "chain_identifier": 19, "name": "Songbird", "shortname": "", "native_coin_id": "songbird" },
    25: {
        "id": "cronos",
        "chain_identifier": 25,
        "name": "Cronos",
        "shortname": "CRO",
        "native_coin_id": "crypto-com-chain"
    },
    30: {
        "id": "rootstock",
        "chain_identifier": 30,
        "name": "Rootstock RSK",
        "shortname": "",
        "native_coin_id": "rootstock"
    },
    50: {
        "id": "xdc-network",
        "chain_identifier": 50,
        "name": "XDC Network",
        "shortname": "xdc xinfin",
        "native_coin_id": "xdce-crowd-sale"
    },
    52: {
        "id": "coinex-smart-chain",
        "chain_identifier": 52,
        "name": "CoinEx Smart Chain",
        "shortname": "CSC",
        "native_coin_id": "coinex-token"
    },
    56: {
        "id": "binance-smart-chain",
        "chain_identifier": 56,
        "name": "BNB Smart Chain",
        "shortname": "BSC",
        "native_coin_id": "binancecoin"
    },
    57: {
        "id": "syscoin",
        "chain_identifier": 57,
        "name": "Syscoin NEVM",
        "shortname": "syscoin",
        "native_coin_id": "syscoin"
    },
    66: {
        "id": "okex-chain",
        "chain_identifier": 66,
        "name": "OKExChain",
        "shortname": "OKEx",
        "native_coin_id": "oec-token"
    },
    70: {
        "id": "hoo-smart-chain",
        "chain_identifier": 70,
        "name": "Hoo Smart Chain",
        "shortname": "",
        "native_coin_id": "hoo-token"
    },
    82: { "id": "meter", "chain_identifier": 82, "name": "Meter", "shortname": "", "native_coin_id": "meter" },
    88: {
        "id": "tomochain",
        "chain_identifier": 88,
        "name": "TomoChain",
        "shortname": "",
        "native_coin_id": "tomochain"
    },
    96: {
        "id": "bitkub-chain",
        "chain_identifier": 96,
        "name": "Bitkub Chain",
        "shortname": "",
        "native_coin_id": "bitkub-coin"
    },
    100: { "id": "xdai", "chain_identifier": 100, "name": "Gnosis Chain", "shortname": "", "native_coin_id": "xdai" },
    106: { "id": "velas", "chain_identifier": 106, "name": "Velas", "shortname": "velas", "native_coin_id": "velas" },
    108: {
        "id": "thundercore",
        "chain_identifier": 108,
        "name": "ThunderCore",
        "shortname": "",
        "native_coin_id": "thunder-token"
    },
    122: {
        "id": "fuse",
        "chain_identifier": 122,
        "name": "Fuse",
        "shortname": "",
        "native_coin_id": "fuse-network-token"
    },
    128: {
        "id": "huobi-token",
        "chain_identifier": 128,
        "name": "Huobi ECO Chain Mainnet",
        "shortname": "HECO",
        "native_coin_id": "huobi-token"
    },
    137: {
        "id": "polygon-pos",
        "chain_identifier": 137,
        "name": "Polygon POS",
        "shortname": "MATIC",
        "native_coin_id": "matic-network"
    },
    148: {
        "id": "shimmer_evm",
        "chain_identifier": 148,
        "name": "ShimmerEVM",
        "shortname": "",
        "native_coin_id": "shimmer"
    },
    169: {
        "id": "manta-pacific",
        "chain_identifier": 169,
        "name": "Manta Pacific",
        "shortname": "",
        "native_coin_id": "weth"
    },
    196: { "id": "x1", "chain_identifier": 196, "name": "X1", "shortname": "", "native_coin_id": "okb" },
    199: {
        "id": "bittorrent",
        "chain_identifier": 199,
        "name": "BitTorrent",
        "shortname": "",
        "native_coin_id": "bittorrent"
    },
    204: { "id": "opbnb", "chain_identifier": 204, "name": "opBNB", "shortname": "", "native_coin_id": "binancecoin" },
    250: { "id": "fantom", "chain_identifier": 250, "name": "Fantom", "shortname": "", "native_coin_id": "fantom" },
    288: {
        "id": "boba",
        "chain_identifier": 288,
        "name": "Boba Network",
        "shortname": "",
        "native_coin_id": "ethereum"
    },
    295: {
        "id": "hedera-hashgraph",
        "chain_identifier": 295,
        "name": "Hedera Hashgraph",
        "shortname": "hashgraph",
        "native_coin_id": "hedera-hashgraph"
    },
    311: { "id": "omax", "chain_identifier": 311, "name": "OMAX", "shortname": "", "native_coin_id": "omax-token" },
    314: {
        "id": "filecoin",
        "chain_identifier": 314,
        "name": "Filecoin",
        "shortname": "",
        "native_coin_id": "filecoin"
    },
    321: {
        "id": "kucoin-community-chain",
        "chain_identifier": 321,
        "name": "Kucoin Community Chain",
        "shortname": "KCC",
        "native_coin_id": "kucoin-shares"
    },
    324: {
        "id": "zksync",
        "chain_identifier": 324,
        "name": "zkSync",
        "shortname": "zkSync",
        "native_coin_id": "ethereum"
    },
    361: { "id": "theta", "chain_identifier": 361, "name": "Theta", "shortname": "", "native_coin_id": "theta-token" },
    530: {
        "id": "function-x",
        "chain_identifier": 530,
        "name": "Function X",
        "shortname": "",
        "native_coin_id": "fx-coin"
    },
    1088: {
        "id": "metis-andromeda",
        "chain_identifier": 1088,
        "name": "Metis Andromeda",
        "shortname": "",
        "native_coin_id": "metis-token"
    },
    1101: {
        "id": "polygon-zkevm",
        "chain_identifier": 1101,
        "name": "Polygon zkEVM",
        "shortname": "",
        "native_coin_id": "ethereum"
    },
    1111: {
        "id": "wemix-network",
        "chain_identifier": 1111,
        "name": "Wemix Network",
        "shortname": "",
        "native_coin_id": "wemix-token"
    },
    1231: { "id": "ultron", "chain_identifier": 1231, "name": "Ultron", "shortname": "", "native_coin_id": "ultron" },
    1284: {
        "id": "moonbeam",
        "chain_identifier": 1284,
        "name": "Moonbeam",
        "shortname": "",
        "native_coin_id": "moonbeam"
    },
    1285: {
        "id": "moonriver",
        "chain_identifier": 1285,
        "name": "Moonriver",
        "shortname": "moonriver",
        "native_coin_id": "moonriver"
    },
    1559: {
        "id": "tenet",
        "chain_identifier": 1559,
        "name": "Tenet",
        "shortname": "",
        "native_coin_id": "tenet-1b000f7b-59cb-4e06-89ce-d62b32d362b9"
    },
    1890: {
        "id": "lightlink",
        "chain_identifier": 1890,
        "name": "LightLink",
        "shortname": "",
        "native_coin_id": "ethereum"
    },
    1907: {
        "id": "Bitcichain",
        "chain_identifier": 1907,
        "name": "Bitcichain",
        "shortname": "Bitcichain",
        "native_coin_id": "bitcicoin"
    },
    2001: {
        "id": "milkomeda-cardano",
        "chain_identifier": 2001,
        "name": "Milkomeda (Cardano)",
        "shortname": "",
        "native_coin_id": "cardano"
    },
    2222: { "id": "kava", "chain_identifier": 2222, "name": "Kava", "shortname": "", "native_coin_id": "kava" },
    2415: { "id": "xodex", "chain_identifier": 2415, "name": "XODEX", "shortname": "", "native_coin_id": "xodex" },
    2611: {
        "id": "redlight-chain",
        "chain_identifier": 2611,
        "name": "Redlight Chain",
        "shortname": "",
        "native_coin_id": "redlight-chain"
    },
    3693: {
        "id": "empire",
        "chain_identifier": 3693,
        "name": "Empire",
        "shortname": "",
        "native_coin_id": "empire-capital-token"
    },
    3776: {
        "id": "astar-zkevm",
        "chain_identifier": 3776,
        "name": "Astar zkEVM",
        "shortname": "",
        "native_coin_id": "weth"
    },
    4200: {
        "id": "merlin-chain",
        "chain_identifier": 4200,
        "name": "Merlin Chain",
        "shortname": "",
        "native_coin_id": "wrapped-bitcoin"
    },
    4337: { "id": "beam", "chain_identifier": 4337, "name": "Beam", "shortname": "", "native_coin_id": "beam" },
    5000: { "id": "mantle", "chain_identifier": 5000, "name": "Mantle", "shortname": "", "native_coin_id": "mantle" },
    6661: {
        "id": "cybria",
        "chain_identifier": 6661,
        "name": "Cybria",
        "shortname": "",
        "native_coin_id": "wrapped-cybria"
    },
    7000: {
        "id": "zetachain",
        "chain_identifier": 7000,
        "name": "ZetaChain",
        "shortname": "",
        "native_coin_id": "zetachain"
    },
    7700: { "id": "canto", "chain_identifier": 7700, "name": "Canto", "shortname": "", "native_coin_id": "canto" },
    8453: { "id": "base", "chain_identifier": 8453, "name": "Base", "shortname": "", "native_coin_id": "ethereum" },
    8545: {
        "id": "shiden network",
        "chain_identifier": 8545,
        "name": "Shiden Network",
        "shortname": "",
        "native_coin_id": "shiden"
    },
    9001: { "id": "evmos", "chain_identifier": 9001, "name": "Evmos", "shortname": "evmos", "native_coin_id": "evmos" },
    10000: {
        "id": "smartbch",
        "chain_identifier": 10000,
        "name": "SmartBCH",
        "shortname": "",
        "native_coin_id": "bitcoin-cash"
    },
    13371: {
        "id": "immutable",
        "chain_identifier": 13371,
        "name": "Immutable zkEVM",
        "shortname": "",
        "native_coin_id": "immutable-x"
    },
    17777: { "id": "eos-evm", "chain_identifier": 17777, "name": "EOS EVM", "shortname": "", "native_coin_id": "eos" },
    23294: {
        "id": "oasis-sapphire",
        "chain_identifier": 23294,
        "name": "Oasis Sapphire",
        "shortname": "",
        "native_coin_id": "oasis-network"
    },
    34443: { "id": "mode", "chain_identifier": 34443, "name": "Mode", "shortname": "", "native_coin_id": "mode" },
    42161: {
        "id": "arbitrum-one",
        "chain_identifier": 42161,
        "name": "Arbitrum One",
        "shortname": "Arbitrum",
        "native_coin_id": "ethereum"
    },
    42170: {
        "id": "arbitrum-nova",
        "chain_identifier": 42170,
        "name": "Arbitrum Nova",
        "shortname": "",
        "native_coin_id": "ethereum"
    },
    42220: { "id": "celo", "chain_identifier": 42220, "name": "Celo", "shortname": "celo", "native_coin_id": "celo" },
    42262: {
        "id": "oasis",
        "chain_identifier": 42262,
        "name": "Oasis",
        "shortname": "oasis",
        "native_coin_id": "oasis-network"
    },
    43114: {
        "id": "avalanche",
        "chain_identifier": 43114,
        "name": "Avalanche",
        "shortname": "AVAX",
        "native_coin_id": "avalanche-2"
    },
    59144: { "id": "linea", "chain_identifier": 59144, "name": "Linea", "shortname": "", "native_coin_id": "ethereum" },
    81457: { "id": "blast", "chain_identifier": 81457, "name": "Blast", "shortname": "", "native_coin_id": "blast" },
    333999: {
        "id": "polis-chain",
        "chain_identifier": 333999,
        "name": "Polis Chain",
        "shortname": "",
        "native_coin_id": "polis"
    },
    534352: { "id": "scroll", "chain_identifier": 534352, "name": "Scroll", "shortname": "", "native_coin_id": "weth" },
    622277: {
        "id": "hypra-network",
        "chain_identifier": 622277,
        "name": "Hypra Network",
        "shortname": "",
        "native_coin_id": "hypra"
    },
    7777777: {
        "id": "zora-network",
        "chain_identifier": 7777777,
        "name": "Zora",
        "shortname": "",
        "native_coin_id": "weth"
    },
    245022934: {
        "id": "neon-evm",
        "chain_identifier": 245022934,
        "name": "Neon EVM",
        "shortname": "",
        "native_coin_id": "neon"
    },
    333000333: {
        "id": "meld",
        "chain_identifier": 333000333,
        "name": "Meld",
        "shortname": "",
        "native_coin_id": "meld-2"
    },
    1313161554: {
        "id": "aurora",
        "chain_identifier": 1313161554,
        "name": "Aurora",
        "shortname": "aurora",
        "native_coin_id": "aurora-near"
    },
    1666600000: {
        "id": "harmony-shard-0",
        "chain_identifier": 1666600000,
        "name": "Harmony Shard 0",
        "shortname": "Harmony Shard 0",
        "native_coin_id": "harmony"
    }
}