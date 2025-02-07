var zs = Object.defineProperty;
var ae = (r, e) => {
    for (var t in e) zs(r, t, { get: e[t], enumerable: !0 });
};
import { BigNumber as tl } from "bignumber.js";
var hi = {};
ae(hi, { chains: () => qe, envs: () => ot, schemas: () => Wa });
var ri = {
    1: {
        chainId: "1",
        explorer: "https://etherscan.io/",
        label: "Ethereum",
        shortName: "ETH",
        code: "eth",
        rpc: "https://trade.orion.xyz/eth-mainnet/rpc",
        baseCurrencyName: "ETH",
        contracts: {
            WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            curveRegistry: "0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5",
        },
    },
    56: {
        chainId: "56",
        explorer: "https://bscscan.com/",
        label: "BNB Chain",
        shortName: "BSC",
        code: "bsc",
        rpc: "https://bsc-dataseed.bnbchain.org/",
        baseCurrencyName: "BNB",
        contracts: {
            WETH: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            curveRegistry: "",
        },
    },
    97: {
        chainId: "97",
        explorer: "https://testnet.bscscan.com/",
        label: "BNB Chain Testnet",
        shortName: "BSC-Testnet",
        code: "bsc",
        rpc: "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
        baseCurrencyName: "BNB",
        contracts: {
            WETH: "0x23eE96bEaAB62abE126AA192e677c52bB7d274F0",
            curveRegistry: "0x93461072c00b2740c474a3d52c70be6249c802d8",
        },
    },
    204: {
        chainId: "204",
        explorer: "http://opbnbscan.com/",
        label: "opBNB Chain",
        shortName: "opBNB",
        code: "opbnb",
        rpc: "https://opbnb-mainnet-rpc.bnbchain.org",
        baseCurrencyName: "BNB",
        contracts: {
            WETH: "0x4200000000000000000000000000000000000006",
            curveRegistry: "",
        },
    },
    3: {
        chainId: "3",
        explorer: "https://ropsten.etherscan.io/",
        label: "Ropsten",
        shortName: "ETH-Ropsten",
        code: "eth",
        rpc: "https://testing.orion.xyz/eth-ropsten/rpc",
        baseCurrencyName: "ETH",
        contracts: { WETH: "", curveRegistry: "" },
    },
    5: {
        chainId: "5",
        explorer: "https://goerli.etherscan.io/",
        label: "Goerli",
        shortName: "ETH-Goerli",
        code: "eth",
        rpc: "https://testing.orion.xyz/eth-goerli/rpc",
        baseCurrencyName: "ETH",
        contracts: { WETH: "", curveRegistry: "" },
    },
    421613: {
        chainId: "421613",
        explorer: "https://goerli.arbiscan.io/",
        label: "Arbitrum Goerli",
        shortName: "Arbitrum Goerli",
        code: "arb",
        rpc: "https://goerli-rollup.arbitrum.io/rpc",
        baseCurrencyName: "ETH",
        contracts: { WETH: "", curveRegistry: "" },
    },
    42161: {
        chainId: "42161",
        explorer: "https://arbiscan.io/",
        label: "Arbitrum",
        shortName: "Arbitrum",
        code: "arb",
        rpc: "https://arb1.arbitrum.io/rpc",
        baseCurrencyName: "ETH",
        contracts: {
            WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            curveRegistry: "0x445FE580eF8d70FF569aB36e80c647af338db351",
        },
    },
    4002: {
        chainId: "4002",
        explorer: "https://testnet.ftmscan.com/",
        label: "Fantom Testnet",
        shortName: "FTM-Testnet",
        code: "ftm",
        rpc: "https://rpc.testnet.fantom.network/",
        baseCurrencyName: "FTM",
        contracts: { WETH: "", curveRegistry: "" },
    },
    250: {
        chainId: "250",
        explorer: "https://ftmscan.com/",
        label: "Fantom",
        shortName: "FTM",
        code: "ftm",
        rpc: "https://rpcapi.fantom.network/",
        baseCurrencyName: "FTM",
        contracts: {
            WETH: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
            curveRegistry: "0x0f854EA9F38ceA4B1c2FC79047E9D0134419D5d6",
        },
    },
    137: {
        chainId: "137",
        label: "Polygon",
        shortName: "Polygon",
        code: "polygon",
        baseCurrencyName: "MATIC",
        rpc: "https://polygon-rpc.com/",
        explorer: "https://polygonscan.com/",
        contracts: {
            WETH: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            curveRegistry: "0x094d12e5b541784701FD8d65F11fc0598FBC6332",
        },
    },
    80001: {
        chainId: "80001",
        label: "Polygon Mumbai",
        shortName: "Polygon Mumbai",
        code: "polygon",
        baseCurrencyName: "MATIC",
        rpc: "https://rpc.ankr.com/polygon_mumbai",
        explorer: "https://mumbai.polygonscan.com/",
        contracts: { WETH: "", curveRegistry: "" },
    },
    66: {
        chainId: "66",
        explorer: "https://www.oklink.com/okc/",
        label: "OKT Chain",
        shortName: "OKC",
        code: "okc",
        rpc: "https://exchainrpc.okex.org/",
        baseCurrencyName: "OKT",
        contracts: {
            WETH: "0x843340759bFCa4a3776F401cD2E03fE9bc0d838f",
            curveRegistry: "",
        },
    },
    65: {
        chainId: "65",
        explorer: "https://www.oklink.com/okc-test/",
        label: "OKC Testnet",
        shortName: "OKC-Testnet",
        code: "okc",
        rpc: "https://exchaintestrpc.okex.org/",
        baseCurrencyName: "OKT",
        contracts: { WETH: "", curveRegistry: "" },
    },
    56303: {
        chainId: "56303",
        label: "DRIP Chain",
        shortName: "DRIP Chain",
        code: "drip",
        baseCurrencyName: "DRIP",
        rpc: "https://testnet.1d.rip/",
        explorer: "https://explorer-testnet.1d.rip/",
        contracts: { WETH: "", curveRegistry: "" },
    },
    2525: {
        chainId: "2525",
        label: "inEVM",
        shortName: "inEVM",
        code: "inevm",
        baseCurrencyName: "INJ",
        rpc: "https://inevm.calderachain.xyz/http/",
        explorer: "https://explorer.injective.network/",
        contracts: {
            WETH: "0x4C3A213bd5e8c4BD70a8396d6F3C8302571598Cd",
            curveRegistry: "",
        },
    },
    59144: {
        chainId: "59144",
        label: "Linea",
        shortName: "Linea",
        code: "linea",
        baseCurrencyName: "ETH",
        rpc: "https://rpc.linea.build/",
        explorer: "https://lineascan.build/",
        contracts: {
            WETH: "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
            curveRegistry: "",
        },
    },
    43114: {
        chainId: "43114",
        label: "Avalanche Network",
        shortName: "Avax",
        code: "avax",
        baseCurrencyName: "AVAX",
        rpc: "https://api.avax.network/ext/bc/C/rpc/",
        explorer: "https://snowtrace.io/",
        contracts: {
            WETH: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
            curveRegistry: "",
        },
    },
    8453: {
        chainId: "8453",
        label: "Base",
        shortName: "BASE",
        code: "base",
        baseCurrencyName: "ETH",
        rpc: "https://mainnet.base.org/",
        explorer: "https://basescan.org/",
        contracts: {
            WETH: "0x4200000000000000000000000000000000000006",
            curveRegistry: "",
        },
    },
};
var ni = {
    production: {
        referralAPI: "https://trade.orion.xyz/referral-api",
        frontageAPI: "https://trade.orion.xyz/frontage",
        networks: {
            1: {
                api: "https://trade.orion.xyz/eth-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
                liquidityMigratorAddress: "0x23a1820a47BcD022E29f6058a5FD224242F50D1A",
            },
            56: {
                api: "https://trade.orion.xyz/bsc-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            250: {
                api: "https://trade.orion.xyz/ftm-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            137: {
                api: "https://trade.orion.xyz/polygon-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            66: {
                api: "https://trade.orion.xyz/okc-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            42161: {
                api: "https://trade.orion.xyz/arbitrum-one",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            204: {
                api: "https://trade.orion.xyz/opbnb-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            2525: {
                api: "https://trade.orion.xyz/inevm-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            59144: {
                api: "https://trade.orion.xyz/linea-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            43114: {
                api: "https://trade.orion.xyz/avalanche-c-chain",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            8453: {
                api: "https://trade.orion.xyz/base-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
        },
    },
    testing: {
        referralAPI: "https://testing.orion.xyz/referral-api",
        frontageAPI: "https://testing.orion.xyz/frontage",
        networks: {
            97: {
                api: "https://testing.orion.xyz/bsc-testnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
                liquidityMigratorAddress: "0x01b10dds12478C88A5E18e2707E729906bC25CfF6",
            },
            5: {
                api: "https://testing.orion.xyz/eth-goerli",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            421613: {
                api: "https://testing.orion.xyz/arbitrum-goerli",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            4002: {
                api: "https://testing.orion.xyz/ftm-testnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            80001: {
                api: "https://testing.orion.xyz/polygon-mumbai",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            56303: {
                api: "https://testing.orion.xyz/drip-testnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
        },
    },
    staging: {
        referralAPI: "https://staging.orion.xyz/referral-api",
        frontageAPI: "https://staging.orion.xyz/frontage",
        networks: {
            1: {
                api: "https://staging.orion.xyz/eth-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            56: {
                api: "https://staging.orion.xyz/bsc-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            250: {
                api: "https://staging.orion.xyz/ftm-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            137: {
                api: "https://staging.orion.xyz/polygon-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            66: {
                api: "https://staging.orion.xyz/okc-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            42161: {
                api: "https://staging.orion.xyz/arbitrum-one",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            204: {
                api: "https://staging.orion.xyz/opbnb-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            2525: {
                api: "https://staging.orion.xyz/inevm-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            59144: {
                api: "https://staging.orion.xyz/linea-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            43114: {
                api: "https://staging.orion.xyz/avalanche-c-chain",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            8453: {
                api: "https://staging.orion.xyz/base-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
        },
    },
    experimental: {
        referralAPI: "https://testing.orion.xyz/referral-api",
        frontageAPI: "https://testing.orion.xyz/frontage",
        networks: {
            97: {
                api: "https://dn-dev.orion.xyz/bsc-testnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            3: {
                api: "https://dn-dev.orion.xyz/eth-ropsten",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
        },
    },
    "kucoin-production": {
        referralAPI: "https://trade.orion.xyz/referral-api",
        frontageAPI: "https://trade.orion.xyz/frontage",
        networks: {
            1: {
                api: "https://trade.orion.xyz/eth-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
                liquidityMigratorAddress: "0x23a1820a47BcD022E29f6058a5FD224242F50D1A",
            },
            56: {
                api: "https://trade.orion.xyz/bsc-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            250: {
                api: "https://trade.orion.xyz/ftm-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            137: {
                api: "https://trade.orion.xyz/polygon-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
            66: {
                api: "https://trade.orion.xyz/okc-mainnet",
                services: {
                    aggregator: { http: "/backend", ws: "/v1" },
                    blockchain: { http: "" },
                    priceFeed: { all: "/price-feed" },
                    indexer: { http: "/orion-indexer/" },
                },
            },
        },
    },
};
var Wa = {};
ae(Wa, {
    eip712DomainSchema: () => rn,
    knownEnvs: () => nn,
    pureChainInfoPayloadSchema: () => gi,
    pureChainInfoSchema: () => Ma,
    pureEnvNetworksSchema: () => si,
    pureEnvPayloadSchema: () => ci,
    pureEnvSchema: () => Ua,
});
import { z as or } from "zod";
var Js = or
        .object({
            name: or.string(),
            version: or.string(),
            chainId: or.string(),
            verifyingContract: or.string(),
            salt: or.string(),
        })
        .partial()
        .refine(
            (r) => Object.keys(r).length > 0,
            "At least one property should be filled in.",
        ),
    rn = Js;
import { z } from "zod";
var Ge = ((y) => (
    (y.MAINNET = "1"),
        (y.ROPSTEN = "3"),
        (y.GOERLI = "5"),
        (y.ARBITRUM = "42161"),
        (y.FANTOM_OPERA = "250"),
        (y.POLYGON = "137"),
        (y.OKC = "66"),
        (y.OPBNB = "204"),
        (y.INEVM = "2525"),
        (y.LINEA = "59144"),
        (y.AVAX = "43114"),
        (y.BASE = "8453"),
        (y.POLYGON_TESTNET = "80001"),
        (y.FANTOM_TESTNET = "4002"),
        (y.BSC = "56"),
        (y.BSC_TESTNET = "97"),
        (y.OKC_TESTNET = "65"),
        (y.DRIP_TESTNET = "56303"),
        (y.ARBITRUM_GOERLI = "421613"),
        y
))(Ge || {});
var ai = ((a) => (
        (a.PENDING = "Pending"),
            (a.DONE = "Done"),
            (a.APPROVING = "Approving"),
            (a.CANCELLED = "Cancelled"),
            a
    ))(ai || {}),
    oi = ((m) => (
        (m.QUEUED = "queued"),
            (m.SIGN_FAILED = "sign_failed"),
            (m.GAS_ESTIMATING = "gas_estimating"),
            (m.ESTIMATE_GAS_FAILED = "estimate_gas_failed"),
            (m.CANCELLED = "cancelled"),
            (m.PENDING = "pending"),
            (m.FAILED = "failed"),
            (m.SETTLED = "settled"),
            (m.SIGNING = "signing"),
            (m.UNKNOWN = "unknown"),
            m
    ))(oi || {}),
    ii = ((s) => (
        (s.SWAP_THROUGH_ORION_POOL = "SWAP_THROUGH_ORION_POOL"),
            (s.DEPOSIT = "DEPOSIT"),
            (s.WITHDRAW = "WITHDRAW"),
            (s.BRIDGE_LOCK = "BRIDGE_LOCK"),
            (s.BRIDGE_REDEEM = "BRIDGE_REDEEM"),
            (s.BRIDGE_REFUND = "BRIDGE_REFUND"),
            (s.LIQUIDITY_MIGRATION = "LIQUIDITY_MIGRATION"),
            (s.REDEEM_TWO_ATOMICS = "REDEEM_TWO_ATOMICS"),
            s
    ))(ii || {});
var si = z.object({
        api: z.string(),
        services: z.object({
            blockchain: z.object({ http: z.string() }),
            aggregator: z.object({ http: z.string(), ws: z.string() }),
            priceFeed: z.object({ all: z.string() }),
            indexer: z.object({ http: z.string() }).optional(),
        }),
        rpc: z.string().optional(),
        liquidityMigratorAddress: z.string().optional(),
    }),
    ci = z.object({
        analyticsAPI: z.string().url().optional(),
        referralAPI: z.string().url(),
        frontageAPI: z.string().url(),
        networks: z.record(z.nativeEnum(Ge), si),
    }),
    nn = ["production", "staging", "testing"],
    Ua = z.record(z.enum(nn).or(z.string()), ci);
import { z as ze } from "zod";
var Qs = {
        DeleteOrder: [
            { name: "senderAddress", type: "address" },
            { name: "id", type: "string" },
        ],
    },
    La = Qs;
var Ys = [
        "NEW",
        "ACCEPTED",
        "PARTIALLY_FILLED",
        "FILLED",
        "TX_PENDING",
        "CANCELED",
        "REJECTED",
        "FAILED",
        "SETTLED",
        "NOT_FOUND",
    ],
    Wt = Ys;
var Zs = [...Wt, "ROUTING"],
    ir = Zs;
var Xs = {
        Order: [
            { name: "senderAddress", type: "address" },
            { name: "matcherAddress", type: "address" },
            { name: "baseAsset", type: "address" },
            { name: "quoteAsset", type: "address" },
            { name: "matcherFeeAsset", type: "address" },
            { name: "amount", type: "uint64" },
            { name: "price", type: "uint64" },
            { name: "matcherFee", type: "uint64" },
            { name: "nonce", type: "uint64" },
            { name: "expiration", type: "uint64" },
            { name: "buySide", type: "uint8" },
        ],
    },
    Da = Xs;
var Pr = [
    "ftm",
    "bsc",
    "eth",
    "polygon",
    "okc",
    "arb",
    "drip",
    "opbnb",
    "inevm",
    "linea",
    "avax",
    "base",
];
var $a = [
    "ASCENDEX",
    "OKX",
    "BINANCE",
    "KUCOIN",
    "ORION",
    "INTERNAL_ORDER_BOOK",
    "SPOOKYSWAP",
    "PANCAKESWAP",
    "UNISWAP",
    "QUICKSWAP",
    "ORION_POOL",
    "INTERNAL_POOL_V2",
    "INTERNAL_POOL_V3",
    "INTERNAL_POOL_V3_0_01",
    "INTERNAL_POOL_V3_0_05",
    "INTERNAL_POOL_V3_0_3",
    "INTERNAL_POOL_V3_1_0",
    "CHERRYSWAP",
    "OKXSWAP",
    "CURVE",
    "CURVE_FACTORY",
    "THENA_ALGEBRA_V1",
];
var ec = {
        ASCENDEX: "AscendEx",
        OKX: "OKX",
        BINANCE: "Binance",
        KUCOIN: "KuCoin",
        ORION: "Orion",
        INTERNAL_ORDER_BOOK: "Internal",
        SPOOKYSWAP: "SpookySwap",
        PANCAKESWAP: "PancakeSwap",
        UNISWAP: "Uniswap",
        QUICKSWAP: "QuickSwap",
        ORION_POOL: "Internal Pool",
        INTERNAL_POOL_V2: "Internal Pool V2",
        INTERNAL_POOL_V3: "Internal Pool V3",
        CHERRYSWAP: "CherrySwap",
        OKXSWAP: "OKXSwap",
        CURVE: "Curve",
        CURVE_FACTORY: "Curve Factory",
        THENA_ALGEBRA_V1: "Thena",
    },
    tc = ec;
var Al = ["97", "3", "5", "421613", "4002", "80001", "65"],
    wl = [
        "1",
        "56",
        "250",
        "137",
        "66",
        "42161",
        "204",
        "2525",
        "59144",
        "43114",
        "8453",
    ];
var q = 8,
    G = 18;
var di = 7e4,
    mi = 15e4,
    an = 15e4,
    Fa = 8e4,
    Pl = 15e4,
    El = 15e4,
    pi = 22e4,
    _t = 6e5,
    Tl = 6e5,
    vl = 35e4,
    kl = 35e4,
    Ol = 5e5,
    Rl = 35e4,
    Cl = 25e4,
    _l = 3e5,
    Nl = 25e4,
    Bl = 2e5,
    Ul = 8e5,
    ja = 2e5,
    Ha = 2e5,
    Ll = 6e5,
    Dl = 7e5,
    $l = { CUMMIES: { deposit: 3e5, withdraw: 3e5 } };
var jl = 86400,
    li = 7,
    ui = 31536e3;
var Ml = "ORN";
var gi = ze.object({
        chainId: ze.nativeEnum(Ge),
        label: ze.string(),
        shortName: ze.string(),
        code: ze.enum(Pr),
        explorer: ze.string(),
        rpc: ze.string(),
        baseCurrencyName: ze.string(),
        contracts: ze.record(ze.string(), ze.string()),
    }),
    Ma = ze.record(ze.nativeEnum(Ge), gi);
var qe = Ma.parse(ri),
    ot = Ua.parse(ni);
import { JsonRpcProvider as kp } from "ethers-v6";
var lo = {};
ae(lo, { Aggregator: () => Br, schemas: () => mo, ws: () => no });
import { z as M } from "zod";
import { z as I } from "zod";
var fi = I.object({
        assetPair: I.string().toUpperCase(),
        side: I.enum(["BUY", "SELL"]),
        amount: I.number(),
        safePrice: I.number(),
    }).nullable(),
    rc = I.object({
        pool: I.string(),
        assetIn: I.string(),
        assetOut: I.string(),
        factory: I.string(),
    }),
    bi = I.object({
        id: I.string(),
        amountIn: I.number(),
        amountOut: I.number(),
        assetIn: I.string().toUpperCase(),
        assetOut: I.string().toUpperCase(),
        path: I.array(I.string()),
        executionInfo: I.string(),
        orderInfo: fi,
        exchanges: I.array(I.string()),
        price: I.number().nullable(),
        minAmountOut: I.number(),
        minAmountIn: I.number(),
        marketPrice: I.number().nullable(),
        exchangeContractPath: I.array(rc),
        alternatives: I.object({
            exchanges: I.array(I.string()),
            path: I.array(I.string()),
            marketAmountOut: I.number().nullable(),
            marketAmountIn: I.number().nullable(),
            marketPrice: I.number(),
            availableAmountIn: I.number().nullable(),
            availableAmountOut: I.number().nullable(),
            orderInfo: fi,
            isThroughPoolOrCurve: I.boolean(),
        }).array(),
        assetNameMapping: I.record(I.string()).optional(),
        usd: I.object({
            aa: I.number().optional(),
            aao: I.number().optional(),
            mo: I.number().optional(),
            mi: I.number().optional(),
            d: I.string().optional(),
        }).optional(),
        autoSlippage: I.number().optional(),
    }),
    nc = bi
        .extend({
            availableAmountOut: I.null(),
            availableAmountIn: I.number(),
            marketAmountOut: I.number().nullable(),
            marketAmountIn: I.null(),
        })
        .transform((r) => ({ ...r, type: "exactSpend" })),
    ac = bi
        .extend({
            availableAmountOut: I.number(),
            availableAmountIn: I.null(),
            marketAmountOut: I.null(),
            marketAmountIn: I.number().nullable(),
        })
        .transform((r) => ({ ...r, type: "exactReceive" })),
    oc = nc.or(ac),
    on = oc;
import { z as sc } from "zod";
import { z as Nt } from "zod";
var ic = Nt.object({
        maxPrice: Nt.number(),
        maxQty: Nt.number(),
        minPrice: Nt.number(),
        minQty: Nt.number(),
        name: Nt.string().toUpperCase(),
        pricePrecision: Nt.number().int(),
        qtyPrecision: Nt.number().int(),
    }),
    sr = ic;
var cc = sc.array(sr),
    sn = cc;
import { z as ut } from "zod";
var dc = ut.object({
        orderId: ut.union([ut.number(), ut.string()]),
        cancellationRequests: ut
            .array(
                ut.object({
                    amount: ut.number(),
                    brokerAddress: ut.string(),
                    exchange: ut.string(),
                }),
            )
            .optional(),
        remainingAmount: ut.number().optional(),
    }),
    cn = dc;
import { z as dn } from "zod";
var mc = dn.record(
        dn.object({ benefitBtc: dn.string(), benefitPct: dn.string() }),
    ),
    mn = mc;
import { z as Er } from "zod";
var pc = Er.object({
        error: Er.object({ code: Er.number(), reason: Er.string() }),
        timestamp: Er.string(),
    }),
    se = pc;
import { z as Xe } from "zod";
var lc = Xe.object({
        redeemOrder: Xe.object({
            amount: Xe.number(),
            asset: Xe.string().toUpperCase(),
            expiration: Xe.number(),
            receiver: Xe.string(),
            secretHash: Xe.string(),
            sender: Xe.string(),
            signature: Xe.string(),
            claimReceiver: Xe.string(),
        }),
        secretHash: Xe.string(),
        sender: Xe.string(),
    }),
    pn = lc;
var no = {};
ae(no, {
    AggregatorWS: () => Nr,
    MessageType: () => B,
    SubscriptionType: () => Y,
    UnsubscriptionType: () => wn,
    schemas: () => ro,
});
import { z as gd } from "zod";
import Ui from "isomorphic-ws";
import { validate as hd, v4 as Li } from "uuid";
var uc = {
        ERROR: "e",
        PING_PONG: "pp",
        SWAP_INFO: "si",
        INITIALIZATION: "i",
        AGGREGATED_ORDER_BOOK_UPDATE: "aobu",
        ASSET_PAIRS_CONFIG_UPDATE: "apcu",
        ASSET_PAIR_CONFIG_UPDATE: "apiu",
        ADDRESS_UPDATE: "au",
        BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATE: "btasabu",
        UNSUBSCRIPTION_DONE: "ud",
    },
    B = uc;
var gc = {
        ASSET_PAIRS_CONFIG_UPDATES_SUBSCRIBE: "apcus",
        ASSET_PAIR_CONFIG_UPDATES_SUBSCRIBE: "apius",
        AGGREGATED_ORDER_BOOK_UPDATES_SUBSCRIBE: "aobus",
        ADDRESS_UPDATES_SUBSCRIBE: "aus",
        BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATES_SUBSCRIBE: "btasabus",
        SWAP_SUBSCRIBE: "ss",
    },
    Y = gc;
var ro = {};
ae(ro, {
    addressUpdateSchema: () => gn,
    assetPairsConfigSchema: () => hn,
    balancesSchema: () => Or,
    baseMessageSchema: () => Z,
    brokerMessageSchema: () => fn,
    errorSchema: () => Cr,
    initMessageSchema: () => Sn,
    orderBookItemSchema: () => eo,
    orderBookSchema: () => to,
    pingPongMessageSchema: () => yn,
    swapInfoSchema: () => An,
});
import { z as x } from "zod";
var hc = ["LIMIT", "STOP_LIMIT"],
    Va = hc;
import { z as Lt } from "zod";
var Ei = {};
ae(Ei, {
    calculateFeeInFeeAsset: () => Bt,
    calculateNetworkFee: () => Tr,
    calculateNetworkFeeInFeeAsset: () => un,
    calculateServiceFeeInFeeAsset: () => kr,
    checkIsToken: () => yi,
    denormalizeNumber: () => H,
    generateSecret: () => cr,
    getNativeCryptocurrencyName: () => Ne,
    hasProp: () => dr,
    isKeyOfObject: () => Mc,
    isKnownEnv: () => xi,
    isNetworkCodeInEnvironment: () => Ja,
    isUnknownObject: () => Vt,
    isUppercasedNetworkCode: () => wi,
    isValidChainId: () => Ut,
    isWithCode: () => Wc,
    isWithData: () => qc,
    isWithError: () => zc,
    isWithMessage: () => Gc,
    isWithReason: () => Vc,
    laconicParse: () => Ii,
    makePartial: () => Oe,
    normalizeNumber: () => K,
    parseExchangeTradeTransaction: () => Ya,
    removeFieldsFromObject: () => Pi,
    toLowerCase: () => Za,
    toUpperCase: () => gt,
});
import { BigNumber as Sc } from "bignumber.js";
import { BigNumber as Ga } from "bignumber.js";
import { ethers as fc } from "ethers-v6";
function Tr(r, e) {
    let t = new Ga(r).multipliedBy(e);
    return new Ga(fc.parseUnits(t.toString(), "gwei").toString())
        .div(new Ga(10).pow(18))
        .toString();
}
import { BigNumber as ln } from "bignumber.js";
function vr(r, e, t, n) {
    let a = n[e];
    if (a === void 0)
        throw Error(
            `Price conversion: AssetIn (${e}) price is undefined. Available prices: ${JSON.stringify(n)}`,
        );
    let o = n[t];
    if (o === void 0)
        throw Error(
            `Price conversion: AssetOut (${t}) price is undefined. Available prices: ${JSON.stringify(n)}`,
        );
    let c = new ln(a),
        i = new ln(o),
        d = new ln(r).multipliedBy(c);
    return new ln(d).dividedBy(i);
}
var bc = (r, e, t, n, a) => {
        let o = Tr(r, e);
        return vr(o, t, n, a);
    },
    un = bc;
import { BigNumber as Si } from "bignumber.js";
function kr(r, e, t, n, a) {
    let o = new Si(r).multipliedBy(new Si(n).div(100));
    return vr(o, e, t, a);
}
var yc = (r, e, t, n, a, o, c) => {
        if (c[o] === void 0)
            throw Error(
                `Fee asset price not found. Available prices: ${Object.keys(c).join(", ")}`,
            );
        if (c[n] === void 0)
            throw Error(
                `Base asset price not found. Available prices: ${Object.keys(c).join(", ")}`,
            );
        if (c[a] === void 0)
            throw Error(
                `Base currency price not found. Available prices: ${Object.keys(c).join(", ")}`,
            );
        let m = kr(r, n, o, t, c),
            l = un(e, 22e4, a, o, c);
        return {
            serviceFeeInFeeAsset: m,
            networkFeeInFeeAsset: l,
            totalFeeInFeeAsset: new Sc(m).plus(l).toString(),
        };
    },
    Bt = yc;
import { ERC20__factory as Ac } from "./contracts/lib/ethers-v6/index.js";
import { ethers as wc } from "ethers-v6";
import Ic from "tiny-invariant";
var xc = async (r, e) => {
        Ic(e, "No provider for token checking");
        let t = Ac.connect(r, e);
        try {
            return !!(await Promise.all([
                t.name(),
                t.symbol(),
                t.decimals(),
                t.totalSupply(),
                t.balanceOf(wc.ZeroAddress),
            ]));
        } catch {
            return !1;
        }
    },
    yi = xc;
import { ethers as Pc } from "ethers-v6";
var za = class {
    x;
    y;
    constructor(e) {
        (this.x = e), (this.y = e ^ 1831565813);
    }
    nextInt32() {
        let e = this.x,
            t = this.y;
        return (
            (this.x = t),
                (e ^= e << 23),
                (e ^= e >> 17),
                (e ^= t ^ (t >> 26)),
                (this.y = e),
            e + t
        );
    }
};
function Ec() {
    return Math.floor(Date.now() * Math.random());
}
function Tc(r, e) {
    let t = new Uint8Array(r);
    for (let n = 0; n < r; n++) t[n] = e.nextInt32() & 255;
    return t;
}
function vc(r) {
    let e = Ec(),
        t = new za(e);
    return Tc(r, t);
}
var kc = () => {
        let e = vc(256);
        return Pc.keccak256(e);
    },
    cr = kc;
import { BigNumber as qa } from "bignumber.js";
function H(r, e) {
    let t = new qa(e.toString());
    if (!t.isInteger())
        throw new Error(`Decimals '${t.toString()}' is not an integer`);
    return new qa(r.toString()).div(new qa(10).pow(t));
}
import { BigNumber as Ka } from "bignumber.js";
function K(r, e, t) {
    let n = new Ka(e);
    if (!n.isInteger())
        throw new Error(`Decimals '${n.toString()}' is not an integer`);
    let a = new Ka(r);
    return BigInt(a.multipliedBy(new Ka(10).pow(e)).integerValue(t).toString());
}
function Ja(r, e) {
    if (!(e in ot))
        throw new Error(
            `Env ${e} is not supported. Available environments is: ${Object.keys(ot).join(", ")}`,
        );
    let n = ot[e]?.networks;
    if (!n)
        throw new Error("Env networks is undefined (isNetworkCodeInEnvironment)");
    return Object.values(qe).some(
        (a) => a.code.toLowerCase() === r.toLowerCase() && a.chainId in n,
    );
}
import { Exchange__factory as Oc } from "./contracts/lib/ethers-v6/index.js";
import { ethers as Fe } from "ethers-v6";
import { z as E } from "zod";
var Rc = E.object({
        name: E.literal("swapThroughOrionPool"),
        args: E.tuple([
            E.bigint(),
            E.bigint(),
            E.string().refine(Fe.isAddress).array().nonempty(),
            E.boolean(),
        ]),
    }).transform((r) => ({
        name: r.name,
        args: {
            amount_spend: r.args[0],
            amount_receive: r.args[1],
            path: r.args[2],
            is_exact_spend: r.args[3],
        },
    })),
    Cc = E.tuple([
        E.string().refine(Fe.isAddress),
        E.string().refine(Fe.isAddress),
        E.string().refine(Fe.isAddress),
        E.string().refine(Fe.isAddress),
        E.string().refine(Fe.isAddress),
        E.bigint(),
        E.bigint(),
        E.bigint(),
        E.bigint(),
        E.bigint(),
        E.literal(1),
        E.boolean(),
        E.string().refine(Fe.isHexString),
    ]),
    Ai = E.tuple([
        E.string().refine(Fe.isAddress),
        E.string().refine(Fe.isAddress),
        E.string().refine(Fe.isAddress),
        E.string().refine(Fe.isAddress),
        E.string().refine(Fe.isAddress),
        E.bigint(),
        E.bigint(),
        E.bigint(),
        E.bigint(),
        E.bigint(),
        E.literal(0),
        E.boolean(),
        E.string().refine(Fe.isHexString),
    ]),
    Qa = (r) => ({
        senderAddress: r[0],
        matcherAddress: r[1],
        baseAsset: r[2],
        quoteAsset: r[3],
        matcherFeeAsset: r[4],
        amount: r[5],
        price: r[6],
        matcherFee: r[7],
        nonce: r[8],
        expiration: r[9],
        buySide: r[10],
        isPersonalSign: r[11],
        signature: r[12],
    }),
    _c = E.object({
        name: E.literal("fillThroughOrionPool"),
        args: E.tuple([
            Ai,
            E.bigint(),
            E.bigint(),
            E.string().refine(Fe.isAddress).array().nonempty(),
        ]),
    }).transform((r) => ({
        name: r.name,
        args: {
            order: Qa(r.args[0]),
            filledAmount: r.args[1],
            blockchainFee: r.args[2],
            path: r.args[3],
        },
    })),
    Nc = E.object({
        name: E.literal("fillOrders"),
        args: E.tuple([Cc, Ai, E.bigint(), E.bigint()]),
    }).transform((r) => ({
        name: r.name,
        args: {
            orders: { buyOrder: Qa(r.args[0]), sellOrder: Qa(r.args[1]) },
            filledPrice: r.args[2],
            filledAmount: r.args[3],
        },
    }));
function Ya(r) {
    let t = Oc.createInterface().parseTransaction(r);
    return E.union([Nc, Rc, _c]).parse(t);
}
function gt(r) {
    return r.toUpperCase();
}
function Za(r) {
    return r.toLowerCase();
}
var Bc = (r) => Pr.map(gt).some((e) => e === r),
    wi = Bc;
import { ethers as Uc } from "ethers-v6";
var Lc = (r) => {
        let t = Object.entries(r).reduce(
            (n, [a, o]) => (o === void 0 ? n : { ...n, [o]: a }),
            {},
        )[Uc.ZeroAddress];
        if (t === void 0)
            throw new Error("Native cryptocurrency asset name is not found");
        return t;
    },
    Ne = Lc;
var Dc = (r, e) => {
        let t = e.safeParse(r);
        if (!t.success) {
            let n = t.error.issues
                .map((a) => `[${a.path.join(".")}]  ${a.message}`)
                .join(", ");
            throw new Error(`Can't recognize payload: ${n}`);
        }
        return t.data;
    },
    Ii = Dc;
import { z as $c } from "zod";
var Fc = (r) => {
        let { success: e } = $c.nativeEnum(Ge).safeParse(r);
        return e;
    },
    Ut = Fc;
var jc = (r) => nn.some((e) => e === r),
    xi = jc;
var Hc = (r, e) => {
        let t = { ...r };
        for (let n of e) delete t[n];
        return t;
    },
    Pi = Hc;
var Oe = (r) => r;
function Vt(r) {
    return r !== null && typeof r == "object";
}
function Mc(r, e) {
    return r in e;
}
function dr(r, e) {
    return e in r;
}
function Wc(r) {
    if (!Vt(r) || !dr(r, "code")) return !1;
    let e = typeof r.code;
    return e === "number" || e === "string";
}
function Vc(r) {
    return Vt(r) ? dr(r, "reason") && typeof r.reason == "string" : !1;
}
function Gc(r) {
    return Vt(r) ? dr(r, "message") && typeof r.message == "string" : !1;
}
function zc(r) {
    return Vt(r) ? dr(r, "error") && Vt(r.error) : !1;
}
function qc(r) {
    return Vt(r) ? dr(r, "data") && typeof r.data == "object" : !1;
}
var Kc = Lt.record(
        Lt.string().toUpperCase(),
        Lt.tuple([Lt.string(), Lt.string(), Lt.string(), Lt.string(), Lt.string()]),
    ).transform(Oe),
    Or = Kc;
import { z as Xa } from "zod";
var Jc = Xa.object({ T: Xa.nativeEnum(B), _: Xa.number() }),
    Z = Jc;
var Ti = Z.extend({
        id: x.string(),
        T: x.literal(B.ADDRESS_UPDATE),
        S: x.string(),
        uc: x.array(x.enum(["b", "o"])),
    }),
    vi = x.object({
        i: x.number(),
        I: x.string(),
        O: x.string(),
        P: x.string().toUpperCase(),
        s: x.enum(["BUY", "SELL"]),
        a: x.number(),
        A: x.number(),
        p: x.number(),
        e: x.string(),
        es: x.string().array().optional(),
        b: x.string(),
        S: x.enum(Wt),
        o: x.boolean(),
    }),
    Qc = x
        .object({
            I: x.string(),
            A: x.number(),
            S: x.enum(ir),
            l: x.boolean().optional(),
            t: x.number(),
            C: x.string().optional(),
            E: x.enum(Va).optional(),
            c: vi.array(),
        })
        .transform((r) => ({ ...r, k: "update" }))
        .transform((r) => ({
            kind: r.k,
            id: r.I,
            settledAmount: r.A,
            status: r.S,
            liquidated: r.l,
            executionType: r.E,
            triggerCondition: r.C,
            subOrders: r.c.map((e) => ({
                pair: e.P,
                exchange: e.e,
                exchanges: e.es,
                id: e.i,
                amount: e.a,
                settledAmount: e.A,
                price: e.p,
                status: e.S,
                side: e.s,
                subOrdQty: e.A,
            })),
        })),
    ki = x
        .object({
            I: x.string(),
            O: x.string(),
            P: x.string().toUpperCase(),
            s: x.enum(["BUY", "SELL"]),
            a: x.number(),
            A: x.number(),
            p: x.number(),
            F: x.string().toUpperCase(),
            f: x.number(),
            l: x.boolean().optional(),
            L: x.number().optional(),
            o: x.boolean(),
            S: x.enum(ir),
            T: x.number(),
            t: x.number(),
            c: vi.array(),
            E: x.enum(Va).optional(),
            C: x.string().optional(),
            ro: x.boolean().optional(),
        })
        .transform((r) => ({ ...r, k: "full" }))
        .transform((r) => ({
            kind: r.k,
            id: r.I,
            settledAmount: r.A,
            feeAsset: r.F,
            fee: r.f,
            liquidated: r.l,
            stopPrice: r.L,
            status: r.S,
            date: r.T,
            clientOrdId: r.O,
            type: r.s,
            pair: r.P,
            amount: r.a,
            price: r.p,
            executionType: r.E,
            triggerCondition: r.C,
            isReversedOrder: r.ro,
            subOrders: r.c.map((e) => ({
                pair: e.P,
                exchange: e.e,
                exchanges: e.es,
                id: e.i,
                amount: e.a,
                settledAmount: e.A,
                price: e.p,
                status: e.S,
                side: e.s,
                subOrdQty: e.A,
            })),
        })),
    Yc = Ti.extend({
        k: x.literal("u"),
        uc: x.array(x.enum(["b", "o"])),
        b: Or.optional(),
        o: x.tuple([ki.or(Qc)]).optional(),
    }),
    Zc = Ti.extend({ k: x.literal("i"), b: Or, o: x.array(ki).optional() }),
    Xc = x.union([Zc, Yc]),
    gn = Xc;
import { z as Dt } from "zod";
var ed = Z.extend({
        id: Dt.string(),
        T: Dt.literal(B.ASSET_PAIRS_CONFIG_UPDATE),
        k: Dt.enum(["i", "u"]),
        u: Dt.array(
            Dt.tuple([Dt.string().toUpperCase(), Dt.number(), Dt.number().int()]),
        ),
    }),
    hn = ed;
import { z as Rr } from "zod";
var td = Z.extend({
        T: Rr.literal(B.BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATE),
        bb: Rr.array(Rr.tuple([Rr.string().toUpperCase(), Rr.number()])),
    }),
    fn = td;
import { z as bn } from "zod";
var rd = Z.extend({
        T: bn.literal(B.ERROR),
        c: bn.number().int(),
        id: bn.string().optional(),
        m: bn.string(),
    }),
    Cr = rd;
import { z as Oi } from "zod";
var nd = Z.extend({ T: Oi.literal(B.INITIALIZATION), i: Oi.string() }),
    Sn = nd;
import { z as ad } from "zod";
var od = Z.extend({ T: ad.literal(B.PING_PONG) }),
    yn = od;
import { z as T } from "zod";
var _r = ["UniswapV2", "UniswapV3", "Curve", "OrionV2", "OrionV3"];
var id = T.object({
        e: T.string().array(),
        ps: T.string().array(),
        mo: T.number().optional(),
        mi: T.number().optional(),
        mp: T.number(),
        aa: T.number().optional(),
        aao: T.number().optional(),
    }),
    sd = T.enum(_r),
    Ri = Z.extend({
        T: T.literal(B.SWAP_INFO),
        S: T.string(),
        ai: T.string().toUpperCase(),
        ao: T.string().toUpperCase(),
        a: T.number(),
        o: T.number(),
        ma: T.number(),
        mao: T.number(),
        ps: T.string().array(),
        po: T.boolean(),
        e: T.string().array().optional(),
        p: T.number().optional(),
        mp: T.number().optional(),
        oi: T.object({
            p: T.string().toUpperCase(),
            s: T.enum(["SELL", "BUY"]),
            a: T.number(),
            sp: T.number(),
        }).optional(),
        as: id.array(),
        anm: T.record(T.string()).optional(),
        eps: T.array(
            T.object({
                p: T.string(),
                ai: T.string().toUpperCase(),
                ao: T.string().toUpperCase(),
                f: sd,
            }),
        ),
        usd: T.object({
            aa: T.number().optional(),
            aao: T.number().optional(),
            mo: T.number().optional(),
            mi: T.number().optional(),
            d: T.string().optional(),
        }).optional(),
        sl: T.number().optional(),
    }),
    cd = Ri.extend({ mo: T.number().optional(), aa: T.number() }).transform(
        (r) => ({ ...r, k: "exactSpend" }),
    ),
    dd = Ri.extend({ mi: T.number().optional(), aao: T.number() }).transform(
        (r) => ({ ...r, k: "exactReceive" }),
    ),
    md = T.union([cd, dd]),
    An = md;
import { z as je } from "zod";
var eo = je.tuple([
        je.string(),
        je.string(),
        je.array(je.string()),
        je.array(je.tuple([je.enum(["SELL", "BUY"]), je.string().toUpperCase()])),
    ]),
    to = Z.extend({
        T: je.literal(B.AGGREGATED_ORDER_BOOK_UPDATE),
        S: je.string(),
        ob: je.object({ a: je.array(eo), b: je.array(eo) }),
    });
var pd = {
        ASSET_PAIRS_CONFIG_UPDATES_UNSUBSCRIBE: "apcu",
        BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATES_UNSUBSCRIBE: "btasabu",
    },
    wn = pd;
import { z as Ci } from "zod";
var ld = Z.extend({ id: Ci.string(), T: Ci.literal(B.UNSUBSCRIPTION_DONE) }),
    _i = ld;
import { z as Gt } from "zod";
var ud = Z.extend({
        id: Gt.string(),
        T: Gt.literal(B.ASSET_PAIR_CONFIG_UPDATE),
        k: Gt.enum(["i", "u"]),
        u: Gt.tuple([Gt.string().toUpperCase(), Gt.number(), Gt.number().int()]),
    }),
    Ni = ud;
var Bi = Object.keys;
var fd = "u",
    bd = 3e4,
    Sd = 5e3,
    yd = gd.union([Sn, yn, gn, hn, Ni, fn, to, An, Cr, _i]),
    Ad = [
        Y.BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATES_SUBSCRIBE,
        Y.ASSET_PAIRS_CONFIG_UPDATES_SUBSCRIBE,
    ],
    wd = (r) => Object.values(Y).some((e) => e === r),
    Id = /An unknown message type: '(.*)', json: (.*)/,
    xd = /Could not cancel nonexistent subscription: (.*)/,
    Nr = class {
        ws;
        isClosedIntentionally = !1;
        subscriptions = {};
        onInit;
        onWSOpen;
        onWSClose;
        onError;
        logger;
        subIdReplacements = {};
        wsUrl;
        isAlive = !1;
        get api() {
            let e = new URL(this.wsUrl);
            return (
                this.basicAuth &&
                ((e.username = this.basicAuth.username),
                    (e.password = this.basicAuth.password)),
                    e
            );
        }
        instanceId = Li();
        basicAuth;
        constructor(e, t, n) {
            (this.wsUrl = e), (this.basicAuth = t), (this.logger = n);
        }
        messageQueue = [];
        sendWsMessage(e) {
            this.ws?.readyState === Ui.OPEN
                ? this.ws.send(e)
                : this.messageQueue.push(e);
        }
        handleWsOpen = () => {
            for (let e of this.messageQueue) this.ws?.send(e);
            (this.messageQueue = []), this.setupHeartbeat();
        };
        sendRaw(e) {
            this.sendWsMessage(e);
        }
        send(e) {
            let t = JSON.stringify(e);
            this.sendWsMessage(t), this.logger?.(`Sent: ${t}`);
        }
        hearbeatIntervalId;
        setupHeartbeat() {
            let e = () => {
                this.isAlive
                    ? (this.isAlive = !1)
                    : (this.logger?.("Heartbeat timeout"),
                        (this.isClosedIntentionally = !1),
                        this.ws?.close(4e3));
            };
            this.hearbeatIntervalId = setInterval(e, bd + Sd);
        }
        clearHeartbeat() {
            (this.isAlive = !1), clearInterval(this.hearbeatIntervalId);
        }
        subscribe(e, t, n) {
            let a =
                    e === Y.AGGREGATED_ORDER_BOOK_UPDATES_SUBSCRIBE ? t.payload : Li(),
                o = () => {
                    let c = Ad.some((d) => d === e),
                        i = {};
                    (i.T = e),
                        (i.id = a),
                    "dc" in t && typeof t.dc == "number" && (i.dc = t.dc),
                    "payload" in t &&
                    (typeof t.payload == "string"
                        ? (i.S = t.payload)
                        : (i.S = { d: a, ...t.payload }));
                    let s = c ? "default" : a;
                    if (n === void 0) {
                        let d = this.subscriptions[e];
                        if (c && d && Object.keys(d).length > 0)
                            throw new Error(
                                `Subscription '${e}' already exists. Please unsubscribe first.`,
                            );
                        this.logger?.(
                            `Subscribing to ${e} with id ${a}. Subscription request: ${JSON.stringify(i)}`,
                        ),
                            (this.subscriptions[e] = { ...this.subscriptions[e], [s]: t });
                    } else {
                        this.logger?.(
                            `Resubscribing to ${e} with id ${a}. Subscription request: ${JSON.stringify(i)}`,
                        );
                        let d = this.subscriptions[e]?.[n];
                        d &&
                        ((this.subIdReplacements[n] = a),
                        this.subscriptions[e]?.[n] && delete this.subscriptions[e]?.[n],
                            (this.subscriptions[e] = {
                                ...this.subscriptions[e],
                                [s]: { ...t, callback: d.callback },
                            }));
                    }
                    this.send(i);
                };
            return (
                this.ws ||
                (this.init(),
                    console.log(`Aggregator WS ${this.instanceId} is initialized`)),
                    o(),
                    a
            );
        }
        getNewestSubscriptionId(e) {
            let t = this.subIdReplacements[e];
            return t !== void 0 && t !== e ? this.getNewestSubscriptionId(t) : e;
        }
        unsubscribe(e, t) {
            let n = this.getNewestSubscriptionId(e);
            this.send({ T: fd, S: n, ...(t !== void 0 && { d: t }) });
            let a = (o) => o.includes("-") && o.split("-").length === 2;
            if (n.includes("0x")) {
                let o = this.subscriptions[Y.ADDRESS_UPDATES_SUBSCRIBE];
                if (o) {
                    let c = Object.entries(o).find(([, i]) => i?.payload === n);
                    if (c) {
                        let [i] = c;
                        delete this.subscriptions[Y.ADDRESS_UPDATES_SUBSCRIBE]?.[i];
                    }
                }
            } else if (hd(n))
                delete this.subscriptions[Y.SWAP_SUBSCRIBE]?.[n],
                    delete this.subscriptions[Y.ASSET_PAIR_CONFIG_UPDATES_SUBSCRIBE]?.[n];
            else if (a(n)) {
                let o = this.subscriptions[Y.AGGREGATED_ORDER_BOOK_UPDATES_SUBSCRIBE];
                if (o) {
                    let c = Object.entries(o).find(([, i]) => i?.payload === n);
                    if (c) {
                        let [i] = c;
                        delete this.subscriptions[
                            Y.AGGREGATED_ORDER_BOOK_UPDATES_SUBSCRIBE
                            ]?.[i];
                    }
                }
            } else
                n === wn.ASSET_PAIRS_CONFIG_UPDATES_UNSUBSCRIBE
                    ? delete this.subscriptions[Y.ASSET_PAIRS_CONFIG_UPDATES_SUBSCRIBE]
                        ?.default
                    : n ===
                    wn.BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATES_UNSUBSCRIBE &&
                    delete this.subscriptions[
                        Y.BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATES_SUBSCRIBE
                        ]?.default;
        }
        destroy() {
            (this.isClosedIntentionally = !0), this.ws?.close(), delete this.ws;
        }
        init(e = !1) {
            (this.isClosedIntentionally = !1),
                (this.ws = new Ui(this.api)),
                (this.ws.onerror = (t) => {
                    this.onError?.(`AggregatorWS error: ${t.message}`),
                        this.logger?.(`AggregatorWS: ${t.message}`);
                }),
                (this.ws.onclose = (t) => {
                    this.onWSClose?.(t),
                        this.logger?.(
                            `AggregatorWS: connection closed ${this.isClosedIntentionally ? "intentionally" : ""}`,
                        ),
                        this.clearHeartbeat(),
                    this.isClosedIntentionally || this.init(!0);
                }),
                (this.ws.onopen = (t) => {
                    this.onWSOpen?.(t),
                        this.handleWsOpen(),
                    e &&
                    Object.keys(this.subscriptions)
                        .filter(wd)
                        .forEach((n) => {
                            let a = this.subscriptions[n];
                            a &&
                            Object.keys(a).forEach((o) => {
                                let c = a[o];
                                this.logger?.(
                                    `AggregatorWS: reconnecting to subscription ${n} ${o}. Params: ${JSON.stringify(c)}`,
                                ),
                                c && this.subscribe(n, c, o);
                            });
                        }),
                        this.logger?.(
                            `AggregatorWS: connection opened${e ? " (reconnect)" : ""}`,
                        );
                }),
                (this.ws.onmessage = (t) => {
                    this.isAlive = !0;
                    let { data: n } = t;
                    if (typeof n != "string")
                        throw new Error("AggregatorWS: received non-string message");
                    this.logger?.(`AggregatorWS: received message: ${n}`);
                    let a = JSON.parse(n),
                        o = yd.parse(a);
                    switch (o.T) {
                        case B.ERROR:
                        {
                            let c = Cr.parse(o),
                                { id: i, m: s } = c;
                            if (i !== void 0) {
                                let d = s.match(xd),
                                    m = s.match(Id);
                                if (d !== null) {
                                    let [, l] = d;
                                    if (l === void 0)
                                        throw new TypeError(
                                            "Subscription is undefined. This should not happen.",
                                        );
                                    console.warn(
                                        `You tried to unsubscribe from non-existent subscription '${l}'. This is probably a bug in the code. Please be sure that you are unsubscribing from the subscription that you are subscribed to.`,
                                    );
                                } else if (m !== null) {
                                    let [, l, p] = m;
                                    if (l === void 0)
                                        throw new TypeError(
                                            "Subscription is undefined. This should not happen.",
                                        );
                                    if (p === void 0)
                                        throw new TypeError(
                                            "JSON payload is undefined. This should not happen.",
                                        );
                                    console.warn(
                                        `You tried to subscribe to '${l}' with unknown payload '${p}'. This is probably a bug in the code. Please be sure that you are subscribing to the existing subscription with the correct payload.`,
                                    );
                                } else {
                                    let l = Bi(this.subscriptions).find(
                                        (u) => this.subscriptions[u]?.[i],
                                    );
                                    if (l === void 0)
                                        throw new Error(
                                            `AggregatorWS: cannot find subscription type by id ${i}. Current subscriptions: ${JSON.stringify(this.subscriptions)}`,
                                        );
                                    let p = this.subscriptions[l]?.[i];
                                    if (p === void 0)
                                        throw new Error(
                                            `AggregatorWS: cannot find subscription by id ${i}. Current subscriptions: ${JSON.stringify(this.subscriptions)}`,
                                        );
                                    "errorCb" in p && p.errorCb(c.m);
                                }
                            }
                            this.onError?.(c.m);
                        }
                            break;
                        case B.PING_PONG:
                            this.sendRaw(n);
                            break;
                        case B.UNSUBSCRIPTION_DONE:
                            break;
                        case B.SWAP_INFO:
                        {
                            let c = {
                                swapRequestId: o.S,
                                assetIn: o.ai,
                                assetOut: o.ao,
                                amountIn: o.a,
                                amountOut: o.o,
                                price: o.p,
                                marketPrice: o.mp,
                                minAmountOut: o.mao,
                                minAmountIn: o.ma,
                                path: o.ps,
                                exchanges: o.e,
                                exchangeContractPath: o.eps.map((i) => ({
                                    pool: i.p,
                                    assetIn: i.ai,
                                    assetOut: i.ao,
                                    factory: i.f,
                                })),
                                poolOptimal: o.po,
                                ...(o.oi && {
                                    orderInfo: {
                                        pair: o.oi.p,
                                        side: o.oi.s,
                                        amount: o.oi.a,
                                        safePrice: o.oi.sp,
                                    },
                                }),
                                alternatives: o.as.map((i) => ({
                                    exchanges: i.e,
                                    path: i.ps,
                                    marketAmountOut: i.mo,
                                    marketAmountIn: i.mi,
                                    marketPrice: i.mp,
                                    availableAmountIn: i.aa,
                                    availableAmountOut: i.aao,
                                })),
                                assetsNameMapping: o.anm,
                                usdInfo: o.usd && {
                                    availableAmountIn: o.usd.aa,
                                    availableAmountOut: o.usd.aao,
                                    marketAmountOut: o.usd.mo,
                                    marketAmountIn: o.usd.mi,
                                    difference: o.usd.d,
                                },
                                autoSlippage: o.sl,
                            };
                            switch (o.k) {
                                case "exactSpend":
                                    this.subscriptions[Y.SWAP_SUBSCRIBE]?.[o.S]?.callback({
                                        kind: o.k,
                                        marketAmountOut: o.mo,
                                        availableAmountIn: o.aa,
                                        ...c,
                                    });
                                    break;
                                case "exactReceive":
                                    this.subscriptions[Y.SWAP_SUBSCRIBE]?.[o.S]?.callback({
                                        kind: o.k,
                                        ...c,
                                        marketAmountIn: o.mi,
                                        availableAmountOut: o.aao,
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }
                            break;
                        case B.INITIALIZATION:
                            this.onInit?.();
                            break;
                        case B.AGGREGATED_ORDER_BOOK_UPDATE:
                        {
                            let { ob: c, S: i } = o,
                                s = (d) =>
                                    d.reduce((m, l) => {
                                        let [p, u, S, f] = l;
                                        return (
                                            m.push({
                                                price: p,
                                                amount: u,
                                                exchanges: S,
                                                vob: f.map(([h, b]) => ({ side: h, pairName: b })),
                                            }),
                                                m
                                        );
                                    }, []);
                            this.subscriptions[Y.AGGREGATED_ORDER_BOOK_UPDATES_SUBSCRIBE]?.[
                                o.S
                                ]?.callback(s(c.a), s(c.b), i);
                        }
                            break;
                        case B.ASSET_PAIR_CONFIG_UPDATE: {
                            let c = o.u,
                                [, i, s] = c;
                            this.subscriptions[Y.ASSET_PAIR_CONFIG_UPDATES_SUBSCRIBE]?.[
                                o.id
                                ]?.callback({
                                data: { minQty: i, pricePrecision: s },
                                kind: o.k === "i" ? "initial" : "update",
                            });
                            break;
                        }
                        case B.ASSET_PAIRS_CONFIG_UPDATE:
                        {
                            let c = o,
                                i = {};
                            c.u.forEach(([s, d, m]) => {
                                i[s] = { minQty: d, pricePrecision: m };
                            }),
                                this.subscriptions[
                                    Y.ASSET_PAIRS_CONFIG_UPDATES_SUBSCRIBE
                                    ]?.default?.callback({
                                    kind: o.k === "i" ? "initial" : "update",
                                    data: i,
                                });
                        }
                            break;
                        case B.ADDRESS_UPDATE:
                        {
                            let c = o.b
                                ? Object.entries(o.b).reduce((i, [s, d]) => {
                                    if (!d) return i;
                                    let [m, l, p, u, S] = d;
                                    return (
                                        (i[s] = {
                                            tradable: m,
                                            reserved: l,
                                            contract: p,
                                            wallet: u,
                                            allowance: S,
                                        }),
                                            i
                                    );
                                }, {})
                                : {};
                            switch (o.k) {
                                case "i":
                                {
                                    let i = o.o
                                        ? o.o.reduce((s, d) => (s.push(d), s), [])
                                        : void 0;
                                    this.subscriptions[Y.ADDRESS_UPDATES_SUBSCRIBE]?.[
                                        o.id
                                        ]?.callback({ kind: "initial", orders: i, balances: c });
                                }
                                    break;
                                case "u":
                                {
                                    let i;
                                    o.o && (i = o.o[0]),
                                        this.subscriptions[Y.ADDRESS_UPDATES_SUBSCRIBE]?.[
                                            o.id
                                            ]?.callback({ kind: "update", order: i, balances: c });
                                }
                                    break;
                                default:
                                    break;
                            }
                        }
                            break;
                        case B.BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATE:
                        {
                            let c = {};
                            o.bb.forEach(([i, s]) => {
                                c[i] = s;
                            }),
                                this.subscriptions[
                                    Y
                                        .BROKER_TRADABLE_ATOMIC_SWAP_ASSETS_BALANCE_UPDATES_SUBSCRIBE
                                    ]?.default?.callback(c);
                        }
                            break;
                        default:
                            break;
                    }
                });
        }
    };
import { z as He } from "zod";
var Di = [
    "FTM",
    "BSC",
    "ETH",
    "POLYGON",
    "OKC",
    "ARB",
    "OPBNB",
    "INEVM",
    "LINEA",
    "AVAX",
    "BASE",
];
import { z as wt } from "zod";
var Pd = wt.object({
        asset: wt.string().toUpperCase(),
        amount: wt.number(),
        secretHash: wt.string(),
        sender: wt.string(),
        receiver: wt.string(),
        expiration: wt.number(),
        signature: wt.string(),
        claimReceiver: wt.string(),
    }),
    In = Pd;
var ao = He.array(
        He.object({
            id: He.string(),
            sender: He.string(),
            lockOrder: He.object({
                sender: He.string(),
                asset: He.string().toUpperCase(),
                amount: He.number(),
                expiration: He.number(),
                secretHash: He.string(),
                used: He.boolean(),
                sourceNetworkCode: He.enum(Di),
            }),
            redeemOrder: In,
            status: He.enum(["SETTLED", "EXPIRED", "ACTIVE"]),
            creationTime: He.number(),
        }),
    ),
    $i = ao;
var mo = {};
ae(mo, {
    aggregatedOrderbookSchema: () => io,
    atomicSwapHistorySchema: () => $i,
    cancelOrderSchema: () => cn,
    errorSchema: () => se,
    exchangeInfoSchema: () => sn,
    exchangeOrderbookSchema: () => so,
    orderBenefitsSchema: () => mn,
    orderSchema: () => xn,
    pairConfigSchema: () => sr,
    placeAtomicSwapSchema: () => pn,
    poolReservesSchema: () => co,
    redeemOrderSchema: () => In,
    swapInfoSchema: () => on,
});
import { ethers as et } from "ethers-v6";
import { z as w } from "zod";
var Fi = w.object({
        id: w
            .string()
            .refine(et.isHexString, (r) => ({
                message: `blockchainOrder.id must be a hex string, got ${r}`,
            })),
        senderAddress: w
            .string()
            .refine(et.isAddress, (r) => ({
                message: `blockchainOrder.senderAddress must be an address, got ${r}`,
            })),
        matcherAddress: w
            .string()
            .refine(et.isAddress, (r) => ({
                message: `blockchainOrder.matcherAddress must be an address, got ${r}`,
            })),
        baseAsset: w
            .string()
            .refine(et.isAddress, (r) => ({
                message: `blockchainOrder.baseAsset must be an address, got ${r}`,
            })),
        quoteAsset: w
            .string()
            .refine(et.isAddress, (r) => ({
                message: `blockchainOrder.quoteAsset must be an address, got ${r}`,
            })),
        matcherFeeAsset: w
            .string()
            .refine(et.isAddress, (r) => ({
                message: `blockchainOrder.matcherFeeAsset must be an address, got ${r}`,
            })),
        amount: w.number().int().nonnegative(),
        price: w.number().int().nonnegative(),
        matcherFee: w.number().int().nonnegative(),
        nonce: w.number(),
        expiration: w.number(),
        buySide: w.union([w.literal(1), w.literal(0)]),
        signature: w
            .string()
            .refine(et.isHexString, (r) => ({
                message: `blockchainOrder.signature must be a hex string, got ${r}`,
            }))
            .nullable(),
        isPersonalSign: w.boolean(),
        needWithdraw: w.boolean(),
    }),
    Ed = w.object({
        tradeId: w.string().uuid(),
        tradeStatus: w.enum([
            "NEW",
            "PENDING",
            "OK",
            "FAIL",
            "TEMP_ERROR",
            "REJECTED",
        ]),
        filledAmount: w.number().nonnegative(),
        price: w.number().nonnegative(),
        creationTime: w.number(),
        updateTime: w.number(),
        matchedBlockchainOrder: Fi.optional(),
        matchedSubOrderId: w.number().int().nonnegative().optional(),
    }),
    ji = w.object({
        assetPair: w.string().toUpperCase(),
        side: w.enum(["BUY", "SELL"]),
        amount: w.number().nonnegative(),
        remainingAmount: w.number().nonnegative(),
        price: w.number().nonnegative(),
        sender: w
            .string()
            .refine(et.isAddress, (r) => ({
                message: `order.sender must be an address, got ${r}`,
            })),
        filledAmount: w.number().nonnegative(),
        internalOnly: w.boolean(),
    }),
    Td = $a.map((r) => `SELF_BROKER_${r}`),
    vd = (r) => Td.some((e) => e === r),
    kd = w.custom((r) => !!(typeof r == "string" && vd(r))),
    Od = w
        .enum(["INTERNAL_BROKER", "ORION_BROKER", "SELF_BROKER"])
        .or(kd)
        .or(
            w
                .string()
                .refine(et.isAddress, (r) => ({
                    message: `subOrder.subOrders.[n].brokerAddress must be an address, got ${r}`,
                })),
        ),
    Rd = ji.extend({
        price: w.number(),
        id: w.number(),
        parentOrderId: w
            .string()
            .refine(et.isHexString, (r) => ({
                message: `subOrder.parentOrderId must be a hex string, got ${r}`,
            })),
        exchange: w.string(),
        exchanges: w.string().array().optional(),
        brokerAddress: Od,
        tradesInfo: w.record(w.string().uuid(), Ed),
        status: w.enum(Wt),
        complexSwap: w.boolean(),
    }),
    Cd = w.object({
        orderId: w
            .string()
            .refine(et.isHexString, (r) => ({
                message: `orderId must be a hex string, got ${r}`,
            })),
        order: ji.extend({
            id: w
                .string()
                .refine(et.isHexString, (r) => ({
                    message: `order.id must be a hex string, got ${r}`,
                })),
            fee: w.number().nonnegative(),
            feeAsset: w.string().toUpperCase(),
            creationTime: w.number(),
            blockchainOrder: Fi,
            subOrders: w.record(Rd),
            updateTime: w.number(),
            status: w.enum(ir),
            settledAmount: w.number().nonnegative(),
        }),
    }),
    xn = Cd;
import { z as Se } from "zod";
var oo = Se.object({
        price: Se.number(),
        amount: Se.number(),
        path: Se.array(
            Se.object({
                assetPair: Se.string().toUpperCase(),
                action: Se.enum(["BUY", "SELL"]),
            }),
        ),
    }),
    Hi = oo.extend({ exchanges: Se.string().array() }),
    io = Se.object({ asks: Se.array(Hi), bids: Se.array(Hi) }),
    so = Se.object({ asks: Se.array(oo), bids: Se.array(oo) }),
    co = Se.object({
        a: Se.number(),
        p: Se.number(),
        indicativePrice: Se.number(),
    });
var _d = (r) => {
        let e;
        try {
            e = new URL(r);
        } catch (t) {
            throw (console.error(`httpToWS: Invalid URL ${r}`), t);
        }
        return (
            e.protocol === "https:"
                ? (e.protocol = "wss:")
                : e.protocol === "http:" && (e.protocol = "ws:"),
                e.toString()
        );
    },
    Mi = _d;
import { ethers as Wi } from "ethers-v6";
import { fetchWithValidation as ce } from "simple-typed-fetch";
import { z as tt } from "zod";
var Nd = tt.object({
        info: tt.string().default(""),
        makerAsset: tt.string().default(""),
        takerAsset: tt.string().default(""),
        maker: tt.string().default(""),
        allowedSender: tt.string().default(""),
        makingAmount: tt.string().default(""),
        takingAmount: tt.string().default(""),
    }),
    po = tt.object({
        order: Nd.default({}),
        signature: tt.string().default(""),
        success: tt.boolean().default(!1),
        error: tt.string().default(""),
    });
var Br = class {
    apiUrl;
    ws;
    basicAuth;
    get api() {
        return this.apiUrl;
    }
    logger;
    constructor(e, t, n, a) {
        (this.logger = a),
            (this.apiUrl = e),
            (this.ws = new Nr(Mi(t), void 0, a)),
            (this.basicAuth = n),
            (this.getHistoryAtomicSwaps = this.getHistoryAtomicSwaps.bind(this)),
            (this.getPairConfig = this.getPairConfig.bind(this)),
            (this.getPairConfigs = this.getPairConfigs.bind(this)),
            (this.getPairsList = this.getPairsList.bind(this)),
            (this.getSwapInfo = this.getSwapInfo.bind(this)),
            (this.getTradeProfits = this.getTradeProfits.bind(this)),
            (this.getStableCoins = this.getStableCoins.bind(this)),
            (this.placeAtomicSwap = this.placeAtomicSwap.bind(this)),
            (this.placeOrder = this.placeOrder.bind(this)),
            (this.cancelOrder = this.cancelOrder.bind(this)),
            (this.checkWhitelisted = this.checkWhitelisted.bind(this)),
            (this.getLockedBalance = this.getLockedBalance.bind(this)),
            (this.getAggregatedOrderbook = this.getAggregatedOrderbook.bind(this)),
            (this.getExchangeOrderbook = this.getExchangeOrderbook.bind(this)),
            (this.getPoolReserves = this.getPoolReserves.bind(this)),
            (this.getVersion = this.getVersion.bind(this)),
            (this.getPrices = this.getPrices.bind(this)),
            (this.getIsCexLiquidityAvailable =
                this.getIsCexLiquidityAvailable.bind(this));
    }
    get basicAuthHeaders() {
        return this.basicAuth
            ? {
                Authorization: `Basic ${btoa(`${this.basicAuth.username}:${this.basicAuth.password}`)}`,
            }
            : {};
    }
    getOrder = (e, t) => {
        if (!Wi.isHexString(e))
            throw new Error(`Invalid order id: ${e}. Must be a hex string`);
        let n = new URL(`${this.apiUrl}/api/v1/order`);
        if ((n.searchParams.append("orderId", e), t !== void 0)) {
            if (!Wi.isAddress(t)) throw new Error(`Invalid owner address: ${t}`);
            n.searchParams.append("owner", t);
        }
        return ce(n.toString(), xn, { headers: this.basicAuthHeaders }, se);
    };
    getPairsList = (e) => {
        let t = new URL(`${this.apiUrl}/api/v1/pairs/list`);
        return (
            t.searchParams.append("market", gt(e)),
                ce(t.toString(), M.array(M.string().toUpperCase()), {
                    headers: this.basicAuthHeaders,
                })
        );
    };
    getAggregatedOrderbook = (e, t = 20) => {
        let n = new URL(`${this.apiUrl}/api/v1/orderbook`);
        return (
            n.searchParams.append("pair", e),
                n.searchParams.append("depth", t.toString()),
                ce(n.toString(), io, { headers: this.basicAuthHeaders }, se)
        );
    };
    getAvailableExchanges = () =>
        ce(`${this.apiUrl}/api/v1/exchange/list`, M.string().array());
    getExchangeOrderbook = (e, t, n = 20, a = null) => {
        let o = new URL(`${this.apiUrl}/api/v1/orderbook/${t}/${e}`);
        return (
            o.searchParams.append("pair", e),
                o.searchParams.append("depth", n.toString()),
            a !== null &&
            o.searchParams.append("filterByBrokerBalances", a.toString()),
                ce(o.toString(), so, { headers: this.basicAuthHeaders }, se)
        );
    };
    getPairConfigs = (e) => {
        let t = new URL(`${this.apiUrl}/api/v1/pairs/exchangeInfo`);
        return (
            t.searchParams.append("market", gt(e)),
                ce(t.toString(), sn, { headers: this.basicAuthHeaders }, se)
        );
    };
    getPoolReserves = (e, t) => {
        let n = new URL(`${this.apiUrl}/api/v1/pools/reserves/${t}/${e}`);
        return ce(n.toString(), co, { headers: this.basicAuthHeaders }, se);
    };
    getVersion = () =>
        ce(
            `${this.apiUrl}/api/v1/version`,
            M.object({
                serviceName: M.string(),
                version: M.string(),
                apiVersion: M.string(),
            }),
            { headers: this.basicAuthHeaders },
            se,
        );
    getPairConfig = (e) =>
        ce(
            `${this.apiUrl}/api/v1/pairs/exchangeInfo/${e}`,
            sr,
            { headers: this.basicAuthHeaders },
            se,
        );
    checkWhitelisted = (e) =>
        ce(
            `${this.apiUrl}/api/v1/whitelist/check?address=${e}`,
            M.boolean(),
            { headers: this.basicAuthHeaders },
            se,
        );
    placeOrder = (e, t, n, a, o, c) => {
        let i = {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(n !== void 0 && { "X-Reverse-Order": n ? "true" : "false" }),
                ...(a !== void 0 && { "X-Partner-Id": a }),
                ...(o !== void 0 && { "X-Source": o }),
                ...this.basicAuthHeaders,
            },
            s = new URL(`${this.apiUrl}/api/v1/order/${t ? "internal" : ""}`);
        return ce(
            s.toString(),
            M.object({
                orderId: M.string(),
                placementRequests: M.array(
                    M.object({
                        amount: M.number(),
                        brokerAddress: M.string(),
                        exchange: M.string(),
                    }),
                ).optional(),
            }),
            {
                headers: i,
                method: "POST",
                body: JSON.stringify({ ...e, rawExchangeRestrictions: c }),
            },
            se,
        );
    };
    cancelOrder = (e) =>
        ce(
            `${this.apiUrl}/api/v1/order`,
            cn,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...this.basicAuthHeaders,
                },
                body: JSON.stringify({ ...e, sender: e.senderAddress }),
            },
            se,
        );
    getSwapInfo = (e, t, n, a, o, c) => {
        let i = new URL(`${this.apiUrl}/api/v1/swap`);
        return (
            i.searchParams.append("assetIn", t),
                i.searchParams.append("assetOut", n),
                e === "exactSpend"
                    ? i.searchParams.append("amountIn", a)
                    : i.searchParams.append("amountOut", a),
            c !== void 0 &&
            (Array.isArray(c)
                ? c.forEach((s) => {
                    i.searchParams.append("exchanges", s);
                })
                : i.searchParams.append("exchanges", c)),
            o !== void 0 && o && i.searchParams.append("instantSettlement", "true"),
                ce(i.toString(), on, { headers: this.basicAuthHeaders }, se)
        );
    };
    getPrices = (e, t) => {
        let n = new URL(`${this.apiUrl}/api/v1/prices/`);
        return (
            n.searchParams.append("assetPair", e),
                n.searchParams.append("includePools", t.toString()),
                ce(n.toString(), M.number(), { headers: this.basicAuthHeaders }, se)
        );
    };
    getLockedBalance = (e, t) => {
        let n = new URL(`${this.apiUrl}/api/v1/address/balance/reserved/${t}`);
        return (
            n.searchParams.append("address", e),
                ce(
                    n.toString(),
                    M.object({ [t]: M.number() }).partial(),
                    { headers: this.basicAuthHeaders },
                    se,
                )
        );
    };
    getTradeProfits = (e, t, n) => {
        let a = new URL(`${this.apiUrl}/api/v1/orderBenefits`);
        return (
            a.searchParams.append("symbol", e),
                a.searchParams.append("amount", t.toString()),
                a.searchParams.append("side", n ? "buy" : "sell"),
                ce(a.toString(), mn, { headers: this.basicAuthHeaders }, se)
        );
    };
    getStableCoins = () => {
        let e = new URL(`${this.apiUrl}/api/v1/tokens/stable/`);
        return ce(
            e.toString(),
            M.array(M.string()),
            { headers: this.basicAuthHeaders },
            se,
        );
    };
    placeAtomicSwap = (e, t) =>
        ce(
            `${this.apiUrl}/api/v1/atomic-swap`,
            pn,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...this.basicAuthHeaders,
                },
                method: "POST",
                body: JSON.stringify({ secretHash: e, sourceNetworkCode: t }),
            },
            se,
        );
    getHistoryAtomicSwaps = (e, t = 1e3) => {
        let n = new URL(`${this.apiUrl}/api/v1/atomic-swap/history/all`);
        return (
            n.searchParams.append("sender", e),
                n.searchParams.append("limit", t.toString()),
                ce(n.toString(), ao, { headers: this.basicAuthHeaders })
        );
    };
    getIsCexLiquidityAvailable = (e, t) => {
        let n = new URL(`${this.apiUrl}/api/v1/pairs/cex/liquidity/${e}/${t}`);
        return ce(
            n.toString(),
            M.boolean(),
            { headers: this.basicAuthHeaders },
            se,
        );
    };
    sign(e, t) {
        return "";
    }
    generateHeaders(e, t, n, a, o, c) {
        let i = Object.keys(e)
                .sort()
                .map((l) => `${l}=${e[l]}`)
                .join("&"),
            s = a + t.toUpperCase() + n + i,
            d = this.sign(s, c);
        return {
            headers: {
                "API-KEY": o,
                "ACCESS-TIMESTAMP": a.toString(),
                "ACCESS-SIGN": d,
            },
        };
    }
    async RFQOrder(e, t, n, a, o, c) {
        let i = "/rfq",
            s = `${this.apiUrl}/api/v1/integration/pmm` + i,
            d = { "Content-Type": "application/json" },
            m = { baseToken: e, quoteToken: t, amount: n, taker: c, feeBps: 0 },
            l = "POST",
            p = Date.now(),
            u = this.generateHeaders(m, l, i, p, a, o),
            S = { ...d, ...u.headers },
            f = JSON.stringify(m),
            h = po.parse({});
        try {
            let g = await (await fetch(s, { headers: S, method: l, body: f })).json(),
                y = po.safeParse(g);
            if (!y.success) {
                let N = M.object({
                    error: M.object({ code: M.number(), reason: M.string() }),
                }).safeParse(g);
                throw N.success
                    ? Error(N.data.error.reason)
                    : Error(`Unrecognized answer from aggregator: ${g}`);
            }
            (h.order = y.data.order),
                (h.signature = y.data.signature),
                (h.error = ""),
                (h.success = !0);
        } catch (b) {
            h.error = `${b}`;
        }
        return h;
    }
};
var wo = {};
ae(wo, { BlockchainService: () => $r, schemas: () => Ao });
import { z as L } from "zod";
var Ao = {};
ae(Ao, {
    IDOSchema: () => On,
    PairStatusEnum: () => uo,
    addPoolSchema: () => Gi,
    adminPoolSchema: () => go,
    adminPoolsListSchema: () => En,
    atomicHistorySchema: () => Tn,
    atomicSummarySchema: () => Lr,
    checkRedeemOrderSchema: () => Zi,
    historySchema: () => kn,
    infoSchema: () => Rn,
    pairStatusSchema: () => Ur,
    pmmSchema: () => Fn,
    poolOnVerificationSchema: () => Pn,
    poolsConfigSchema: () => Cn,
    poolsInfoSchema: () => _n,
    poolsLpAndStakedSchema: () => Bn,
    poolsV3InfoSchema: () => $n,
    pricesWithQuoteAssetSchema: () => jn,
    referralDataSchema: () => Hn,
    userEarnedSchema: () => Ln,
    userVotesSchema: () => Un,
});
import { z as Re } from "zod";
var uo = ((a) => (
        (a[(a.DOESNT_EXIST = -1)] = "DOESNT_EXIST"),
            (a[(a.REVIEW = 0)] = "REVIEW"),
            (a[(a.ACCEPTED = 1)] = "ACCEPTED"),
            (a[(a.REJECTED = 2)] = "REJECTED"),
            a
    ))(uo || {}),
    Ur = Re.nativeEnum(uo),
    Vi = Re.object({
        symbol: Re.string(),
        icon: Re.string().optional(),
        address: Re.string(),
        decimals: Re.number().optional(),
        isUser: Re.boolean().optional(),
    }),
    Pn = Re.object({
        tokenA: Vi,
        tokenB: Vi,
        _id: Re.string().optional(),
        address: Re.string(),
        symbol: Re.string(),
        isUser: Re.boolean(),
        minQty: Re.number().optional(),
        tokensReversed: Re.boolean(),
        status: Ur,
        updatedAt: Re.number(),
        createdAt: Re.number(),
    }),
    go = Pn;
import { z as Bd } from "zod";
var En = Bd.array(Pn);
import { z as mr } from "zod";
var Ud = mr.object({
        poolAddress: mr.string(),
        tokenAIcon: mr.string().optional(),
        tokenAName: mr.string().optional(),
        tokenBIcon: mr.string().optional(),
        tokenBName: mr.string().optional(),
    }),
    Gi = Ud;
import { ethers as fo } from "ethers-v6";
import { z as k } from "zod";
import { z as zi } from "zod";
function ho(r) {
    return zi.array(zi.unknown()).transform((e) => {
        let t = [];
        for (let n = 0; n < e.length; n++) {
            let a = e[n],
                o = r.safeParse(a);
            o.success
                ? t.push(o.data)
                : console.log(
                    `Array item with index ${n} is invalid. Error: ${o.error.message}. Data: ${JSON.stringify(a)}.`,
                );
        }
        return t;
    });
}
var bo = k.object({
        success: k.boolean(),
        count: k.number(),
        total: k.number(),
        pagination: k.object({}),
    }),
    qi = k.object({
        used: k.boolean(),
        claimed: k.boolean(),
        isAggApplied: k.boolean(),
        _id: k.string(),
        __v: k.number(),
        asset: k.string(),
        sender: k.string().refine(fo.isAddress),
        secretHash: k.string().refine(fo.isHexString),
        receiver: k.string().refine(fo.isAddress).optional(),
        secret: k.string().optional(),
    }),
    Ki = qi.extend({
        type: k.literal("source"),
        amountToReceive: k.number().optional(),
        amountToSpend: k.number().optional(),
        timestamp: k
            .object({
                lock: k.number().optional(),
                claim: k.number().optional(),
                refund: k.number().optional(),
            })
            .optional(),
        expiration: k.object({ lock: k.number().optional() }).optional(),
        state: k.enum(["BEFORE-LOCK", "LOCKED", "REFUNDED", "CLAIMED"]).optional(),
        targetChainId: k.number(),
        transactions: k
            .object({
                lock: k.string().optional(),
                claim: k.string().optional(),
                refund: k.string().optional(),
            })
            .optional(),
    }),
    Ji = qi.extend({
        type: k.literal("target"),
        timestamp: k.object({ redeem: k.number().optional() }).optional(),
        expiration: k.object({ redeem: k.number().optional() }).optional(),
        state: k.enum(["BEFORE-REDEEM", "REDEEMED"]).optional(),
        transactions: k.object({ redeem: k.string().optional() }).optional(),
    }),
    Qi = bo.extend({ data: k.array(Ki) }),
    Yi = bo.extend({ data: k.array(Ji) }),
    Ld = bo.extend({ data: ho(k.discriminatedUnion("type", [Ki, Ji])) }),
    Tn = Ld;
import { z as vn } from "zod";
var Dd = vn.object({
        redeemTxHash: vn.string(),
        secret: vn.string().nullable(),
        secretHash: vn.string(),
    }),
    Zi = Dd;
import { z as rt } from "zod";
var $d = rt
        .array(
            rt.object({
                amount: rt.string(),
                amountNumber: rt.string(),
                asset: rt.string(),
                assetAddress: rt.string(),
                contractBalance: rt.string().nullable().optional(),
                createdAt: rt.number(),
                transactionHash: rt.string(),
                type: rt.enum(["deposit", "withdrawal"]),
                user: rt.string(),
                walletBalance: rt.string().nullable().optional(),
            }),
        )
        .transform((r) =>
            r.map((e) => {
                let { type: t, createdAt: n, transactionHash: a, user: o } = e;
                return {
                    type: t,
                    date: n * 1e3,
                    token: e.asset,
                    amount: e.amountNumber,
                    status: "Done",
                    transactionHash: a,
                    user: o,
                };
            }),
        ),
    kn = $d;
import { z as $t } from "zod";
var Fd = $t.object({
        amount: $t.number().or($t.null()),
        amountInWei: $t.number().or($t.null()),
        amountInUSDT: $t.number().or($t.null()),
        address: $t.string(),
    }),
    On = Fd;
import { z as le } from "zod";
var jd = le.object({
        type: le.enum(["percent", "plain"]),
        value: le.number(),
        asset: le.string(),
    }),
    Hd = le.object({
        chainId: le.number(),
        chainName: le.string(),
        exchangeContractAddress: le.string(),
        swapExecutorContractAddress: le.string(),
        oracleContractAddress: le.string(),
        matcherAddress: le.string(),
        orderFeePercent: le.number(),
        assetToAddress: le.record(le.string()).transform(Oe),
        assetToDecimals: le.record(le.number()).transform(Oe),
        assetToIcons: le.record(le.string()).transform(Oe).optional(),
        cexTokens: le.string().array(),
        internalFeeAssets: jd.array().optional(),
    }),
    Rn = Hd;
import { z as Ke } from "zod";
import { ethers as Md } from "ethers-v6";
import { z as Wd } from "zod";
var Vd = Wd.string().refine(Md.isAddress, (r) => ({
        message: `Should be an address, got ${r}`,
    })),
    It = Vd;
var Gd = Ke.object({
        WETHAddress: It.optional(),
        factoryAddress: It,
        governanceAddress: It.optional(),
        routerAddress: It,
        votingAddress: It.optional(),
        factories: Ke.record(Ke.string(), It).transform(Oe).optional(),
        pools: Ke.record(
            Ke.string(),
            Ke.object({
                lpTokenAddress: It,
                minQty: Ke.number().optional(),
                reverted: Ke.boolean().optional(),
                rewardToken: Ke.string().nullable().optional(),
                state: Ke.number().int().optional(),
                rewardTokenDecimals: Ke.number().int().optional(),
                stakingRewardFinish: Ke.number().optional(),
                stakingRewardAddress: It,
                vote_rewards_disabled: Ke.boolean().optional(),
            }),
        ).transform(Oe),
    }),
    Cn = Gd;
import { z as ue } from "zod";
var zd = ue.object({
        governance: ue.object({
            apr: ue.string(),
            rewardRate: ue.string(),
            totalBalance: ue.string(),
        }),
        totalRewardRatePerWeek: ue.string(),
        pools: ue.record(
            ue.object({
                currentAPR: ue.string(),
                isUser: ue.boolean().optional(),
                price: ue.string(),
                reserves: ue.record(ue.string()),
                totalLiquidityInDollars: ue.string(),
                totalRewardRatePerWeek: ue.string(),
                totalStakedAmountInDollars: ue.string(),
                totalSupply: ue.string(),
                totalVoted: ue.string(),
                weight: ue.string(),
            }),
        ),
    }),
    _n = zd;
import { z as So } from "zod";
var Lr = So.object({ amount: So.number(), count: So.number() });
import { z as Nn } from "zod";
var qd = Nn.record(
        Nn.object({ unstakedLPBalance: Nn.string(), stakedLPBalance: Nn.string() }),
    ),
    Bn = qd;
import { z as Xi } from "zod";
var Kd = Xi.record(Xi.string()),
    Un = Kd;
import { z as es } from "zod";
var Jd = es.record(es.string()),
    Ln = Jd;
import { z as Dn } from "zod";
var Qd = Dn.object({
        OrionV3Factory: Dn.string(),
        OrionV3Pool: Dn.string(),
        OrionV3NFTManager: Dn.string(),
    }),
    $n = Qd;
import { z as ts } from "zod";
var Yd = ts.object({ orionPMMRouterContractAddress: ts.string() }),
    Fn = Yd;
import { z as Dr } from "zod";
var jn = Dr.object({
    quoteAsset: Dr.string(),
    quoteAssetAddress: Dr.string(),
    prices: Dr.record(Dr.string()).transform(Oe),
});
import { z as yo } from "zod";
var Hn = yo.object({
    referer: yo.string().nullable(),
    isReferral: yo.boolean(),
});
import { fetchWithValidation as R } from "simple-typed-fetch";
var $r = class {
    apiUrl;
    basicAuth;
    get api() {
        return this.apiUrl;
    }
    constructor(e, t) {
        (this.apiUrl = e),
            (this.basicAuth = t),
            (this.getAtomicSwapAssets = this.getAtomicSwapAssets.bind(this)),
            (this.getAtomicSwapHistory = this.getAtomicSwapHistory.bind(this)),
            (this.getAuthToken = this.getAuthToken.bind(this)),
            (this.getCirculatingSupply = this.getCirculatingSupply.bind(this)),
            (this.getInfo = this.getInfo.bind(this)),
            (this.getPmmInfo = this.getPmmInfo.bind(this)),
            (this.getPoolsConfig = this.getPoolsConfig.bind(this)),
            (this.getPoolsInfo = this.getPoolsInfo.bind(this)),
            (this.getPoolsLpAndStaked = this.getPoolsLpAndStaked.bind(this)),
            (this.getUserVotes = this.getUserVotes.bind(this)),
            (this.getUserEarned = this.getUserEarned.bind(this)),
            (this.getPoolsV3Info = this.getPoolsV3Info.bind(this)),
            (this.getHistory = this.getHistory.bind(this)),
            (this.getPricesWithQuoteAsset = this.getPricesWithQuoteAsset.bind(this)),
            (this.getTokensFee = this.getTokensFee.bind(this)),
            (this.getPlatformFees = this.getPlatformFees.bind(this)),
            (this.getGasPriceWei = this.getGasPriceWei.bind(this)),
            (this.checkFreeRedeemAvailable =
                this.checkFreeRedeemAvailable.bind(this)),
            (this.redeemAtomicSwap = this.redeemAtomicSwap.bind(this)),
            (this.redeem2AtomicSwaps = this.redeem2AtomicSwaps.bind(this)),
            (this.checkRedeem = this.checkRedeem.bind(this)),
            (this.checkRedeem2Atomics = this.checkRedeem2Atomics.bind(this)),
            (this.getIDOInfo = this.getIDOInfo.bind(this)),
            (this.checkAuth = this.checkAuth.bind(this)),
            (this.addPool = this.addPool.bind(this)),
            (this.editPool = this.editPool.bind(this)),
            (this.getPool = this.getPool.bind(this)),
            (this.getPoolsList = this.getPoolsList.bind(this)),
            (this.getSourceAtomicSwapHistory =
                this.getSourceAtomicSwapHistory.bind(this)),
            (this.getTargetAtomicSwapHistory =
                this.getTargetAtomicSwapHistory.bind(this)),
            (this.checkPoolInformation = this.checkPoolInformation.bind(this)),
            (this.checkIfHashUsed = this.checkIfHashUsed.bind(this)),
            (this.getBlockNumber = this.getBlockNumber.bind(this)),
            (this.getRedeemOrderBySecretHash =
                this.getRedeemOrderBySecretHash.bind(this)),
            (this.claimOrder = this.claimOrder.bind(this)),
            (this.getGasLimits = this.getGasLimits.bind(this)),
            (this.getExchangeContractWalletBalance =
                this.getExchangeContractWalletBalance.bind(this));
    }
    get basicAuthHeaders() {
        return this.basicAuth
            ? {
                Authorization: `Basic ${btoa(`${this.basicAuth.username}:${this.basicAuth.password}`)}`,
            }
            : {};
    }
    get blockchainServiceWsUrl() {
        return `${this.apiUrl}/`;
    }
    getSummaryRedeem = (e, t, n) => {
        let a = new URL(`${this.apiUrl}/api/atomic/summary-redeem/${e}`);
        return (
            t !== void 0 &&
            t === 1 &&
            a.searchParams.append("unshifted", t.toString()),
            n !== void 0 && a.searchParams.append("sourceNetworkCode", n),
                R(a.toString(), Lr, { headers: this.basicAuthHeaders })
        );
    };
    getSummaryClaim = (e) =>
        R(`${this.apiUrl}/api/atomic/summary-claim/${e}`, Lr, {
            headers: this.basicAuthHeaders,
        });
    getQueueLength = () =>
        R(`${this.apiUrl}/api/queueLength`, L.number().int(), {
            headers: this.basicAuthHeaders,
        });
    get internal() {
        return {
            getSummaryRedeem: this.getSummaryRedeem.bind(this),
            getSummaryClaim: this.getSummaryClaim.bind(this),
            getQueueLength: this.getQueueLength.bind(this),
        };
    }
    getAuthToken = () =>
        R(`${this.apiUrl}/api/auth/token`, L.object({ token: L.string() }), {
            headers: this.basicAuthHeaders,
        });
    getCirculatingSupply = () =>
        R(`${this.apiUrl}/api/circulating-supply`, L.number(), {
            headers: this.basicAuthHeaders,
        });
    getInfo = () => R(`${this.apiUrl}/api/info`, Rn);
    getPmmInfo = () => R(`${this.apiUrl}/api/pmm-info`, Fn);
    getPoolsConfig = () =>
        R(`${this.apiUrl}/api/pools/config`, Cn, {
            headers: this.basicAuthHeaders,
        });
    getPoolsInfo = () =>
        R(`${this.apiUrl}/api/pools/info`, _n, { headers: this.basicAuthHeaders });
    getPoolsLpAndStaked = (e) =>
        R(`${this.apiUrl}/api/pools/user-lp/${e}`, Bn, {
            headers: this.basicAuthHeaders,
        });
    getUserVotes = (e) =>
        R(`${this.apiUrl}/api/pools/user-votes/${e}`, Un, {
            headers: this.basicAuthHeaders,
        });
    getUserEarned = (e) =>
        R(`${this.apiUrl}/api/pools/user-earned/${e}`, Ln, {
            headers: this.basicAuthHeaders,
        });
    getPoolsV3Info = () =>
        R(`${this.apiUrl}/api/pools-v3/info`, $n, {
            headers: this.basicAuthHeaders,
        });
    getHistory = (e) =>
        R(`${this.apiUrl}/api/history/${e}`, kn, {
            headers: this.basicAuthHeaders,
        });
    getPricesWithQuoteAsset = () =>
        R(`${this.apiUrl}/api/quotedPrices`, jn, {
            headers: this.basicAuthHeaders,
        });
    getTokensFee = () =>
        R(`${this.apiUrl}/api/tokensFee`, L.record(L.string()).transform(Oe), {
            headers: this.basicAuthHeaders,
        });
    getPlatformFees = ({
                           assetIn: e,
                           assetOut: t,
                           walletAddress: n,
                           fromWidget: a,
                       }) => {
        let o = new URL(`${this.apiUrl}/api/platform-fees`);
        return (
            o.searchParams.append("assetIn", e),
                o.searchParams.append("assetOut", t),
            n !== void 0 && o.searchParams.append("walletAddress", n),
            a !== void 0 && o.searchParams.append("fromWidget", a),
                R(o.toString(), L.record(L.string()).transform(Oe), {
                    headers: this.basicAuthHeaders,
                })
        );
    };
    getReferralData = (e) =>
        R(`${this.apiUrl}/api/referral-data/${e}`, Hn, {
            headers: this.basicAuthHeaders,
        });
    getGasPriceWei = () =>
        R(`${this.apiUrl}/api/gasPrice`, L.string(), {
            headers: this.basicAuthHeaders,
        });
    checkFreeRedeemAvailable = (e) =>
        R(`${this.apiUrl}/api/atomic/has-free-redeem/${e}`, L.boolean(), {
            headers: this.basicAuthHeaders,
        });
    getRedeemOrderBySecretHash = (e) =>
        R(
            `${this.apiUrl}/api/atomic/redeem-order/${e}`,
            L.object({
                secretHash: L.string(),
                secret: L.string(),
                redeemTxHash: L.string(),
            }),
            { headers: this.basicAuthHeaders },
        );
    claimOrder = (e, t, n) =>
        R(`${this.apiUrl}/api/atomic/claim-order`, L.string(), {
            method: "POST",
            body: JSON.stringify({
                secretHash: e,
                targetNetwork: t,
                redeemTxHash: n,
            }),
            headers: { "Content-Type": "application/json", ...this.basicAuthHeaders },
        });
    redeemAtomicSwap = (e, t, n) =>
        R(`${this.apiUrl}/api/atomic/matcher-redeem`, L.string(), {
            method: "POST",
            body: JSON.stringify({ order: e, secret: t, sourceNetwork: n }),
            headers: { "Content-Type": "application/json", ...this.basicAuthHeaders },
        });
    redeem2AtomicSwaps = (e, t, n, a, o) =>
        R(`${this.apiUrl}/api/atomic/matcher-redeem2atomics`, L.string(), {
            method: "POST",
            body: JSON.stringify({
                order1: e,
                secret1: t,
                order2: n,
                secret2: a,
                sourceNetwork: o,
            }),
            headers: { "Content-Type": "application/json", ...this.basicAuthHeaders },
        });
    checkRedeem = (e) =>
        R(
            `${this.apiUrl}/api/atomic/matcher-redeem/${e}`,
            L.enum(["OK", "FAIL"]).nullable(),
            { headers: this.basicAuthHeaders },
        );
    checkRedeem2Atomics = (e, t) =>
        R(
            `${this.apiUrl}/api/atomic/matcher-redeem/${e}-${t}`,
            L.enum(["OK", "FAIL"]).nullable(),
            { headers: this.basicAuthHeaders },
        );
    getBlockNumber = () =>
        R(`${this.apiUrl}/api/blocknumber`, L.number().int(), {
            headers: this.basicAuthHeaders,
        });
    getIDOInfo = () =>
        R(`${this.apiUrl}/api/solarflare`, On, { headers: this.basicAuthHeaders });
    checkAuth = (e) =>
        R(`${this.apiUrl}/api/auth/check`, L.object({ auth: L.boolean() }), {
            headers: { ...e, ...this.basicAuthHeaders },
        });
    getPool = (e, t) =>
        R(`${this.apiUrl}/api/pools/${e}`, go, {
            headers: { ...t, ...this.basicAuthHeaders },
        });
    getPoolsList = (e) =>
        R(`${this.apiUrl}/api/pools/list`, En, {
            headers: { ...e, ...this.basicAuthHeaders },
        });
    editPool = (e, t, n) =>
        R(`${this.apiUrl}/api/pools/edit/${e}`, Ur, {
            method: "POST",
            body: JSON.stringify(t),
            headers: {
                "Content-Type": "application/json",
                ...n,
                ...this.basicAuthHeaders,
            },
        });
    addPool = (e) =>
        R(
            `${this.apiUrl}/api/pools/add`,
            L.number(),
            {
                method: "POST",
                body: JSON.stringify(e),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...this.basicAuthHeaders,
                },
            },
            L.string(),
        );
    checkPoolInformation = (e) =>
        R(`${this.apiUrl}/api/pools/check/${e}`, Ur, {
            headers: this.basicAuthHeaders,
        });
    getAtomicSwapAssets = () =>
        R(`${this.apiUrl}/api/atomic/swap-assets`, L.array(L.string()), {
            headers: this.basicAuthHeaders,
        });
    getAtomicSwapHistory = (e) => {
        let t = new URL(`${this.apiUrl}/api/atomic/history/`);
        return (
            Object.entries(e).forEach(([n, a]) => {
                if (a === void 0) throw new Error("Value must be defined");
                t.searchParams.append(n, a.toString());
            }),
                R(t.toString(), Tn, { headers: this.basicAuthHeaders })
        );
    };
    getSourceAtomicSwapHistory = (e) => {
        let t = new URL(`${this.apiUrl}/api/atomic/history/`);
        return (
            Object.entries(e).forEach(([n, a]) => {
                if (a === void 0) throw new Error("Value must be defined");
                t.searchParams.append(n, a.toString());
            }),
            e.type === void 0 && t.searchParams.append("type", "source"),
                R(t.toString(), Qi, { headers: this.basicAuthHeaders })
        );
    };
    getTargetAtomicSwapHistory = (e) => {
        let t = new URL(`${this.apiUrl}/api/atomic/history/`);
        return (
            Object.entries(e).forEach(([n, a]) => {
                if (a === void 0) throw new Error("Value must be defined");
                t.searchParams.append(n, a.toString());
            }),
            e.type === void 0 && t.searchParams.append("type", "target"),
                R(t.toString(), Yi, { headers: this.basicAuthHeaders })
        );
    };
    checkIfHashUsed = (e) =>
        R(
            `${this.apiUrl}/api/atomic/is-hash-used`,
            L.record(L.boolean()).transform(Oe),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...this.basicAuthHeaders,
                },
                method: "POST",
                body: JSON.stringify(e),
            },
        );
    getGasLimits = () =>
        R(`${this.apiUrl}/api/baseLimits`, L.record(L.number()), {
            headers: this.basicAuthHeaders,
        });
    getExchangeContractWalletBalance = (e) =>
        R(`${this.apiUrl}/api/broker/getWalletBalance/${e}`, L.record(L.string()), {
            headers: this.basicAuthHeaders,
        });
};
var Eo = {};
ae(Eo, { PriceFeed: () => Mr, schemas: () => Io, ws: () => Po });
import { fetchWithValidation as Zn } from "simple-typed-fetch";
var Io = {};
ae(Io, {
    allTickersSchema: () => Gn,
    candlesSchema: () => Mn,
    statisticsOverviewSchema: () => Wn,
    topPairsStatisticsSchema: () => Vn,
});
import { z as Je } from "zod";
var Zd = Je.object({
        candles: Je.array(
            Je.object({
                close: Je.string(),
                high: Je.string(),
                low: Je.string(),
                open: Je.string(),
                time: Je.number(),
                timeEnd: Je.number(),
                timeStart: Je.number(),
                volume: Je.string(),
            }),
        ),
        timeStart: Je.number(),
        timeEnd: Je.number(),
    }),
    Mn = Zd;
import { z as ht } from "zod";
var rs = ht.object({ volume24h: ht.number(), volume7d: ht.number() }),
    Wn = ht.object({ time: ht.number(), statisticsOverview: rs }),
    Vn = ht.object({
        time: ht.number(),
        topPairs: ht.array(
            ht.object({ assetPair: ht.string(), statisticsOverview: rs }),
        ),
    });
import { z as Fr } from "zod";
var Xd = Fr.object({
        pair: Fr.string(),
        volume24: Fr.number(),
        change24: Fr.number(),
        lastPrice: Fr.number(),
    }),
    Gn = Xd.array();
var Po = {};
ae(Po, { PriceFeedWS: () => Hr, schemas: () => xo });
import ns from "isomorphic-ws";
import { z as as } from "zod";
import { v4 as cm } from "uuid";
var em = {
        TICKER: "ticker",
        ALL_TICKERS: "allTickers",
        LAST_PRICE: "lastPrice",
        CANDLE: "candle",
        CEX: "cexPrices",
    },
    pr = em;
var xo = {};
ae(xo, {
    allTickersSchema: () => Jn,
    candleSchema: () => zn,
    cexPricesSchema: () => Yn,
    priceSchema: () => Kn,
    tickerInfoSchema: () => lr,
});
import { z as zt } from "zod";
var tm = zt
        .tuple([
            zt.string(),
            zt.string(),
            zt.string(),
            zt.string(),
            zt.string(),
            zt.string(),
        ])
        .transform(([r, e, t, n, a, o]) => ({
            pairName: r,
            lastPrice: e,
            openPrice: t,
            highPrice: n,
            lowPrice: a,
            volume24h: o,
        })),
    lr = tm;
import { z as ft } from "zod";
var rm = ft
        .tuple([
            ft.string(),
            ft.string(),
            ft.number(),
            ft.number(),
            ft.string(),
            ft.string(),
            ft.string(),
            ft.string(),
            ft.string(),
        ])
        .transform(([r, e, t, n, a, o, c, i, s]) => ({
            interval: r,
            pair: e,
            timeStart: t,
            timeEnd: n,
            close: a,
            open: o,
            high: c,
            low: i,
            volume: s,
        })),
    zn = rm;
import { z as qn } from "zod";
var nm = qn
        .tuple([qn.number(), qn.string(), qn.number()])
        .transform(([, r, e]) => ({ pair: r, price: e })),
    Kn = nm;
import { z as am } from "zod";
var om = am
        .unknown()
        .array()
        .transform((r) => {
            let e = [...r];
            return (
                e.shift(),
                    lr
                        .array()
                        .parse(e)
                        .reduce((n, a) => ({ ...n, [a.pairName]: a }), {})
            );
        }),
    Jn = om;
import { z as Qn } from "zod";
var im = Qn.tuple([Qn.string(), Qn.number()]).transform(([r, e]) => ({
        pairName: r.toUpperCase(),
        lastPrice: e,
    })),
    sm = Qn.unknown()
        .array()
        .transform((r) => {
            let e = [...r];
            return (
                e.shift(),
                    im
                        .array()
                        .parse(e)
                        .reduce((n, a) => ({ ...n, [a.pairName]: a }), {})
            );
        }),
    Yn = sm;
var dm = {
        [pr.ALL_TICKERS]: { schema: Jn, payload: !1 },
        [pr.TICKER]: {
            schema: as.tuple([as.number(), lr]).transform(([, r]) => r),
            payload: !0,
        },
        [pr.LAST_PRICE]: { schema: Kn, payload: !0 },
        [pr.CANDLE]: { schema: zn, payload: !0 },
        [pr.CEX]: { schema: Yn, payload: !1 },
    },
    jr = class {
        id;
        callback;
        errorCallback;
        payload;
        ws;
        url;
        heartbeatInterval;
        type;
        isClosedIntentionally = !1;
        onOpen;
        constructor(e, t, n, a) {
            (this.id = cm()),
                (this.url = t),
                (this.type = e),
            "payload" in n && (this.payload = n.payload),
                (this.callback = n.callback),
                (this.errorCallback = n.errorCallback),
                (this.onOpen = a),
                this.init();
        }
        send(e) {
            if (this.ws?.readyState === ns.OPEN) {
                let t = JSON.stringify(e);
                this.ws.send(t);
            } else
                setTimeout(() => {
                    this.send(e);
                }, 50);
        }
        init() {
            this.isClosedIntentionally = !1;
            let { payload: e, url: t, type: n } = this;
            (this.ws = new ns(`${t}/${n}${e !== void 0 ? `/${e.toString()}` : ""}`)),
            this.onOpen !== void 0 && (this.ws.onopen = this.onOpen),
                (this.ws.onmessage = (a) => {
                    let { data: o } = a,
                        c;
                    if (
                        (typeof o == "string"
                            ? (c = o)
                            : Buffer.isBuffer(o)
                                ? (c = o.toString())
                                : Array.isArray(o)
                                    ? (c = Buffer.concat(o).toString())
                                    : (c = Buffer.from(o).toString()),
                        c === "pong")
                    )
                        return;
                    let i = JSON.parse(c),
                        d = dm[n].schema.safeParse(i);
                    if (d.success) this.callback(d.data);
                    else {
                        let m = d.error.errors
                                .map((p) => `[${p.path.join(".")}] ${p.message}`)
                                .join(", "),
                            l = new Error(
                                `Can't recognize PriceFeed "${n}" subscription message "${c}": ${m}`,
                            );
                        if (this.errorCallback !== void 0) this.errorCallback(l);
                        else throw l;
                    }
                }),
                (this.ws.onclose = () => {
                    this.heartbeatInterval && clearInterval(this.heartbeatInterval),
                    this.isClosedIntentionally || this.init();
                }),
                (this.heartbeatInterval = setInterval(() => {
                    this.send("heartbeat");
                }, 15e3));
        }
        kill() {
            (this.isClosedIntentionally = !0), this.ws?.close();
        }
    };
var Hr = class {
    subscriptions = {};
    url;
    basicAuth;
    constructor(e, t) {
        (this.url = e), (this.basicAuth = t);
    }
    get api() {
        let e = new URL(this.url);
        return (
            this.basicAuth &&
            ((e.username = this.basicAuth.username),
                (e.password = this.basicAuth.password)),
                e.toString()
        );
    }
    subscribe(e, t, n) {
        let a = new jr(e, this.api, t, n);
        return (
            (this.subscriptions = {
                ...this.subscriptions,
                [e]: { ...this.subscriptions[e], [a.id]: a },
            }),
                {
                    type: a.type,
                    id: a.id,
                    unsubscribe: () => {
                        this.unsubscribe(a.type, a.id);
                    },
                }
        );
    }
    unsubscribe(e, t) {
        this.subscriptions[e]?.[t]?.kill(), delete this.subscriptions[e]?.[t];
    }
};
var Mr = class {
    apiUrl;
    basicAuth;
    ws;
    get api() {
        return this.apiUrl;
    }
    constructor(e, t) {
        (this.apiUrl = e),
            (this.ws = new Hr(this.wsUrl)),
            (this.basicAuth = t),
            (this.getCandles = this.getCandles.bind(this)),
            (this.getStatisticsOverview = this.getStatisticsOverview.bind(this)),
            (this.getTopPairStatistics = this.getTopPairStatistics.bind(this)),
            (this.getAllTickers = this.getAllTickers.bind(this));
    }
    get basicAuthHeaders() {
        return this.basicAuth
            ? {
                Authorization: `Basic ${btoa(`${this.basicAuth.username}:${this.basicAuth.password}`)}`,
            }
            : {};
    }
    getCandles = (e, t, n, a, o = "all") => {
        let c = new URL(this.candlesUrl);
        return (
            c.searchParams.append("symbol", e),
                c.searchParams.append("timeStart", t.toString()),
                c.searchParams.append("timeEnd", n.toString()),
                c.searchParams.append("interval", a),
                c.searchParams.append("exchange", o),
                Zn(c.toString(), Mn, { headers: this.basicAuthHeaders })
        );
    };
    getStatisticsOverview = (e = "ALL") => {
        let t = new URL(`${this.statisticsUrl}/overview`);
        return (
            t.searchParams.append("exchange", e),
                Zn(t.toString(), Wn, { headers: this.basicAuthHeaders })
        );
    };
    getTopPairStatistics = (e = "ALL") => {
        let t = new URL(`${this.statisticsUrl}/top-pairs`);
        return (
            t.searchParams.append("exchange", e),
                Zn(t.toString(), Vn, { headers: this.basicAuthHeaders })
        );
    };
    getAllTickers = () =>
        Zn(`${this.tickersUrl}/all`, Gn, { headers: this.basicAuthHeaders });
    get wsUrl() {
        let e = new URL(this.apiUrl);
        return `${e.protocol === "https:" ? "wss" : "ws"}://${e.host + e.pathname}/api/v1`;
    }
    get candlesUrl() {
        return `${this.apiUrl}/api/v1/candles`;
    }
    get statisticsUrl() {
        return `${this.apiUrl}/api/v1/statistics`;
    }
    get tickersUrl() {
        return `${this.apiUrl}/api/v1/ticker`;
    }
};
import { BigNumber as vo } from "bignumber.js";
import { ethers as ko } from "ethers-v6";
import { Exchange__factory as ym } from "./contracts/lib/ethers-v6/index.js";
import {
    ERC20__factory as Wr,
    Exchange__factory as os,
} from "./contracts/lib/ethers-v6/index.js";
import { ZeroAddress as Xn, ethers as mm } from "ethers-v6";
async function ge(r) {
    return (
        (r = await r),
        typeof r != "string" && (r = await r.getAddress()),
            r.toLowerCase()
    );
}
async function To(r, e, t, n, a, o) {
    let c = t === mm.ZeroAddress,
        i,
        s;
    if (c) (i = await o.getBalance(n)), (s = H(i, BigInt(18)));
    else {
        let p = Wr.connect(t, o),
            u = await p.decimals();
        (i = await p.balanceOf(n)), (s = H(i, u));
    }
    let d = await a.getBalance(t, n),
        m = H(d, BigInt(8)),
        l = await r.getLockedBalance(n, e);
    if (l.isErr()) throw new Error(l.error.message);
    return { exchange: m.minus(l.value.data[e] ?? 0), wallet: s };
}
async function pm(r, e, t, n, a = !0) {
    (e = await ge(e)), (t = await ge(t)), (r = await ge(r));
    let c = await os.connect(t, n).getBalance(r, e);
    if (a) {
        let s = await Wr.connect(r, n).decimals();
        return (c * BigInt(10) ** s) / BigInt(10) ** 8n;
    }
    return c;
}
async function lm(r, e, t, n = !0) {
    (r = await ge(r)), (e = await ge(e));
    let o = await os.connect(e, t).getBalance(Xn, r);
    return n ? (o * BigInt(10) ** 18n) / BigInt(10) ** 8n : o;
}
async function um(r, e, t, n, a = !0) {
    return (
        (e = await ge(e)),
            (r = await ge(r)),
            typeof r == "string" && r === Xn ? lm(e, t, n, a) : pm(r, e, t, n, a)
    );
}
async function is(r, e, t, n) {
    return typeof r == "string" && r === Xn
        ? 0n
        : ((e = await ge(e)),
            (r = await ge(r)),
            await Wr.connect(r, n).allowance(e, t));
}
async function gm(r, e, t, n = !1) {
    (e = await ge(e)), (r = await ge(r));
    let o = await Wr.connect(r, t).balanceOf(e);
    if (n) {
        let i = await Wr.connect(r, t).decimals();
        return (o * BigInt(10) ** 8n) / BigInt(10) ** i;
    }
    return o;
}
async function hm(r, e, t = !1) {
    r = await ge(r);
    let n = await e.getBalance(r);
    return t ? (n * BigInt(10) ** 8n) / BigInt(10) ** 18n : n;
}
async function fm(r, e, t, n = !1) {
    return typeof r == "string" && r === Xn ? hm(e, t, n) : gm(r, e, t, n);
}
async function ss(r, e, t, n, a = !0) {
    let o = await fm(r, e, n, !a),
        c = await um(r, e, t, n, a);
    return { walletBalance: o, exchangeBalance: c, totalBalance: o + c };
}
var it = async (r, e, t, n, a) =>
    (
        await Promise.all(
            Object.entries(r).map(async ([c, i]) => {
                if (i === void 0) throw new Error(`Asset address of ${c} not found`);
                let s = await To(e, c, i, t, n, a);
                return { assetName: c, amount: s };
            }),
        )
    ).reduce((c, i) => ({ ...c, [i.assetName]: i.amount }), {});
import { BigNumber as xt } from "bignumber.js";
import { ethers as ea } from "ethers-v6";
import Sm from "just-clone";
import { ERC20__factory as ta } from "./contracts/lib/ethers-v6/index.js";
var bm = (r, e) => r.length === e.length && r.every((t, n) => t === e[n]),
    cs = bm;
var Me = class r {
    balances;
    requirements = [];
    nativeCryptocurrency;
    provider;
    signer;
    logger;
    constructor(e, t, n, a, o) {
        (this.balances = e),
            (this.nativeCryptocurrency = t),
            (this.provider = n),
            (this.signer = a),
            (this.logger = o);
    }
    registerRequirement(e) {
        this.requirements.push(e);
    }
    setExtraBalance(e, t, n) {
        let a = this.balances[e];
        if (!a) throw Error(`Can't set extra balance. Asset ${e} not found`);
        a[n] = a[n].plus(t);
    }
    async checkResetRequired(e, t) {
        let n = await this.signer.getAddress(),
            o = await ta
                .connect(e, this.provider)
                .approve.populateTransaction(t, ea.MaxUint256);
        o.from = n;
        let c = !1;
        try {
            await this.provider.estimateGas(o);
        } catch {
            c = !0;
        }
        return c;
    }
    static aggregateBalanceRequirements(e) {
        return e.reduce((t, n) => {
            let a = t.find(
                (o) =>
                    o.asset.address === n.asset.address &&
                    cs(o.sources, n.sources) &&
                    o.spenderAddress === n.spenderAddress,
            );
            return a
                ? ((a.items = { ...a.items, [n.reason]: n.amount }), t)
                : [
                    ...t,
                    {
                        asset: n.asset,
                        sources: n.sources,
                        spenderAddress: n.spenderAddress,
                        items: { [n.reason]: n.amount },
                    },
                ];
        }, []);
    }
    fixAllAutofixableBalanceIssues = async (e) => {
        let t = async (a) => {
                let o = ta.connect(a.asset.address, this.provider),
                    c = async ({ spenderAddress: i, targetAmount: s }) => {
                        let d = new xt(s),
                            m = await o.approve.populateTransaction(
                                i,
                                d.isZero() ? "0" : ea.MaxUint256,
                            ),
                            l = await this.signer.getAddress(),
                            p = await this.provider.getTransactionCount(l, "pending"),
                            { gasPrice: u, maxFeePerGas: S } =
                                await this.provider.getFeeData(),
                            f = await this.provider.getNetwork();
                        u !== null &&
                        S !== null &&
                        ((m.gasPrice = u), (m.maxFeePerGas = S)),
                            (m.chainId = f.chainId),
                            (m.nonce = p),
                            (m.from = l);
                        let h = await this.provider.estimateGas(m);
                        (m.gasLimit = h), this.logger?.("Approve transaction signing...");
                        let b = await this.signer.signTransaction(m),
                            g = await this.provider.broadcastTransaction(b);
                        this.logger?.(
                            `${a.asset.name} approve transaction sent ${g.hash}. Waiting for confirmation...`,
                        ),
                            await g.wait(),
                            this.logger?.(`${a.asset.name} approve transaction confirmed.`);
                    };
                await a.fixes?.reduce(async (i, s) => {
                    if ((await i, s.type === "byApprove")) {
                        await c(s);
                        return;
                    }
                    await i;
                }, Promise.resolve());
            },
            n = e.filter((a) => a.fixes);
        return (
            await n.reduce(async (a, o) => {
                await a, await t(o);
            }, Promise.resolve()),
                e.filter((a) => !n.includes(a))
        );
    };
    async check(e) {
        this.logger?.(
            `Balance requirements: ${this.requirements.map((p) => `${p.amount} ${p.asset.name} for '${p.reason}' from [${p.sources.join(" + ")}]`).join(", ")}`,
        );
        let t = Sm(this.balances),
            n = r.aggregateBalanceRequirements(this.requirements),
            a = { asset: this.nativeCryptocurrency, sources: ["wallet"], items: {} },
            o = [],
            c = Object.values(n).flatMap((p) => p);
        n.filter(({ sources: p }) => p.length === 1 && p[0] === "exchange").forEach(
            ({ asset: p, items: u }) => {
                let S = t[p.name];
                if (!S) throw new Error(`No ${p.name} balance`);
                let f = Object.values(u).reduce(
                    (h, b) => (b !== void 0 ? h.plus(b) : h),
                    new xt(0),
                );
                if (((S.exchange = S.exchange.minus(f)), S.exchange.lt(0))) {
                    let h = S.exchange.abs(),
                        b = this.balances[p.name]?.exchange;
                    o.push({
                        asset: p,
                        sources: ["exchange"],
                        message: `Not enough ${p.name} on exchange balance. Needed: ${f.toString()}, available: ${(b ?? "[UNDEFINED]").toString()}. You need to deposit at least ${h.toString()} ${p.name} into exchange contract`,
                    });
                }
            },
        );
        let s = n.filter(
                ({ sources: p }) => p[0] === "exchange" && p[1] === "wallet",
            ),
            d = await this.signer.getAddress();
        await Promise.all(
            s.map(async ({ asset: p, spenderAddress: u, items: S }) => {
                let f = t[p.name];
                if (!f) throw new Error(`No ${p.name} balance`);
                let h = Object.values(S).reduce(
                    (b, g) => (g !== void 0 ? b.plus(g) : b),
                    new xt(0),
                );
                if (((f.exchange = f.exchange.minus(h)), f.exchange.lt(0))) {
                    let b = f.exchange.abs(),
                        g;
                    if (p.address === ea.ZeroAddress) g = f.wallet;
                    else {
                        if (u === void 0)
                            throw new Error(`Spender address is required for ${p.name}`);
                        let C = ta.connect(p.address, this.provider),
                            N = await C.decimals(),
                            U = await C.allowance(d, u);
                        g = H(U, N);
                    }
                    let y = xt.min(f.wallet, g);
                    if (b.lte(y)) f.wallet = f.wallet.minus(b);
                    else {
                        let N = (f.wallet.gt(y) ? f.wallet.minus(y) : new xt(0)).gte(b),
                            U = y.plus(b),
                            D = this.balances[p.name]?.exchange,
                            $ = D?.plus(y),
                            W = `Not enough ${p.name} on exchange + wallet balance. Needed: ${h.toString()}, available: ${($ ?? "[UNDEFINED]").toString()} (exchange: ${(D ?? "[UNKNOWN]").toString()}, available (approved): ${y.toString()}). ${N ? `You need approve at least ${b.toString()} ${p.name}` : "Approve is not helpful"}`;
                        if (N) {
                            if (u === void 0)
                                throw new Error(`Spender address is required for ${p.name}`);
                            let ie = await this.checkResetRequired(p.address, u),
                                { gasPrice: Ae } = await this.provider.getFeeData(),
                                Ce = BigInt(8e4) * (Ae ?? 0n),
                                F = H(Ce, BigInt(18));
                            (a.items = {
                                ...a.items,
                                ...(ie && {
                                    [`Reset ${p.name} from 'wallet' to ${u}`]: F.toString(),
                                }),
                                [`Approve ${p.name} from 'wallet' to ${u}`]: F.toString(),
                            }),
                                o.push({
                                    asset: p,
                                    sources: ["exchange", "wallet"],
                                    fixes: [
                                        ...(ie
                                            ? [
                                                {
                                                    type: "byApprove",
                                                    targetAmount: 0,
                                                    spenderAddress: u,
                                                },
                                            ]
                                            : []),
                                        { type: "byApprove", targetAmount: U, spenderAddress: u },
                                    ],
                                    message: W,
                                });
                        } else
                            o.push({ asset: p, sources: ["exchange", "wallet"], message: W });
                    }
                }
            }),
        );
        let m = c.filter(
            ({ sources: p, asset: u }) =>
                p[0] === "wallet" && u.name !== this.nativeCryptocurrency.name,
        );
        if (
            (await Promise.all(
                m.map(async ({ asset: p, spenderAddress: u, items: S }) => {
                    let f = t[p.name];
                    if (!f) throw new Error(`No ${p.name} balance`);
                    let h = Object.values(S).reduce(
                            (y, C) => (C !== void 0 ? y.plus(C) : y),
                            new xt(0),
                        ),
                        b;
                    if (p.address === ea.ZeroAddress) b = f.wallet;
                    else {
                        if (u === void 0)
                            throw new Error(`Spender address is required for ${p.name}`);
                        let y = ta.connect(p.address, this.provider),
                            C = await y.decimals(),
                            N = await y.allowance(d, u);
                        b = H(N, C);
                    }
                    let g = xt.min(f.wallet, b);
                    if (h.lte(g)) f.wallet = f.wallet.minus(h);
                    else {
                        let y = h.minus(g).abs(),
                            N = (f.wallet.gt(g) ? f.wallet.minus(g) : new xt(0)).gte(y),
                            U = g.plus(y),
                            D = `Not enough ${p.name} on wallet balance. Needed: ${h.toString()}, available (approved): ${g.toString()}. ${N ? `You need approve at least ${y.toString()} ${p.name}` : "Approve is not helpful"}`;
                        if (N) {
                            if (u === void 0)
                                throw new Error(`Spender address is required for ${p.name}`);
                            let $ = await this.checkResetRequired(p.address, u),
                                { gasPrice: W } = await this.provider.getFeeData(),
                                ie = BigInt(8e4) * (W ?? 0n),
                                Ae = H(ie, BigInt(18));
                            (a.items = {
                                ...a.items,
                                ...($ && {
                                    [`Reset ${p.name} from 'wallet' to ${u}`]: Ae.toString(),
                                }),
                                [`Approve ${p.name} from 'wallet' to ${u}`]: Ae.toString(),
                            }),
                                o.push({
                                    asset: p,
                                    sources: ["wallet"],
                                    fixes: [
                                        ...($
                                            ? [
                                                {
                                                    type: "byApprove",
                                                    targetAmount: 0,
                                                    spenderAddress: u,
                                                },
                                            ]
                                            : []),
                                        { type: "byApprove", targetAmount: U, spenderAddress: u },
                                    ],
                                    message: D,
                                });
                        } else o.push({ asset: p, sources: ["wallet"], message: D });
                    }
                }),
            ),
                c
                    .filter(
                        ({ sources: p, asset: u }) =>
                            p[0] === "wallet" && u.name === this.nativeCryptocurrency.name,
                    )
                    .forEach(({ asset: p, items: u }) => {
                        let S = t[p.name];
                        if (!S) throw new Error(`No ${p.name} balance`);
                        let f = Object.values({ ...u, ...a.items }).reduce(
                            (h, b) => (b !== void 0 ? h.plus(b) : h),
                            new xt(0),
                        );
                        if (((S.wallet = S.wallet.minus(f)), S.wallet.lt(0))) {
                            let h = S.wallet.abs();
                            o.push({
                                asset: p,
                                sources: ["wallet"],
                                message: `Not enough ${p.name} on wallet balance. You need to deposit at least ${h.toString()} ${p.name} into wallet contract`,
                            });
                        }
                    }),
            e !== void 0 && e)
        ) {
            let p = await this.fixAllAutofixableBalanceIssues(o);
            if (p.length > 0)
                throw new Error(
                    `Balance issues: ${p.map((u, S) => `${S + 1}. ${u.message}`).join(`
`)}`,
                );
        } else if (o.length > 0)
            throw new Error(
                `Balance issues (address ${d}): ${o.map(
                    (p, u) => `${u + 1}. ${p.message}`,
                ).join(`
`)}`,
            );
    }
};
import { simpleFetch as ds } from "simple-typed-fetch";
async function Oo({ asset: r, amount: e, signer: t, unit: n }) {
    if (r === "") throw new Error("Asset can not be empty");
    let a = new vo(e);
    if (a.isNaN()) throw new Error(`Amount '${a.toString()}' is not a number`);
    if (a.lte(0))
        throw new Error(`Amount '${a.toString()}' should be greater than 0`);
    let o = await t.getAddress(),
        { blockchainService: c, aggregator: i, provider: s, chainId: d } = n,
        { exchangeContractAddress: m, assetToAddress: l } = await ds(c.getInfo)(),
        p = Ne(l),
        u = ym.connect(m, s),
        S = await ds(c.getGasPriceWei)(),
        f = l[r];
    if (f === void 0) throw new Error(`Asset '${r}' not found`);
    let h = await it({ [r]: f, [p]: ko.ZeroAddress }, i, o, u, s),
        b = new Me(h, { name: p, address: ko.ZeroAddress }, s, t);
    b.registerRequirement({
        reason: "Amount",
        asset: { name: r, address: f },
        amount: a.toString(),
        spenderAddress: m,
        sources: ["wallet"],
    });
    let g;
    r === p
        ? ((g = await u.deposit.populateTransaction()),
            (g.value = K(e, 18, vo.ROUND_CEIL)),
            (g.gasLimit = BigInt(7e6)))
        : ((g = await u.depositAsset.populateTransaction(
            f,
            K(e, 8, vo.ROUND_CEIL),
        )),
            (g.gasLimit = BigInt(15e4)));
    let y = BigInt(g.gasLimit) * BigInt(S),
        C = H(y, BigInt(18));
    b.registerRequirement({
        reason: "Network fee",
        asset: { name: p, address: ko.ZeroAddress },
        amount: C.toString(),
        sources: ["wallet"],
    }),
        (g.chainId = parseInt(d, 10)),
        (g.gasPrice = BigInt(S)),
        (g.from = o),
        await b.check(!0);
    let N = await s.getTransactionCount(o, "pending");
    g.nonce = N;
    // let U = await t.signTransaction(g);
    try {
        let D = await t.sendTransaction(g);
        console.log(`Deposit tx sent: ${D.hash}. Waiting for confirmation...`),
            (await D.wait())?.status !== void 0
                ? console.log("Deposit tx confirmed")
                : console.log("Deposit tx failed");
    } catch (D) {
        if (!(D instanceof Error)) throw new Error("e is not an Error");
        console.error(`Deposit tx failed: ${D.message}`, { unsignedTx: g });
    }
}
import { BigNumber as Am } from "bignumber.js";
import { ethers as Ro } from "ethers-v6";
import { simpleFetch as ur } from "simple-typed-fetch";
async function Co({
                      type: r,
                      assetIn: e,
                      assetOut: t,
                      amount: n,
                      feeAsset: a,
                      blockchainService: o,
                      aggregator: c,
                      options: i,
                      walletAddress: s,
                  }) {
    if (n === "") throw new Error("Amount can not be empty");
    if (e === "") throw new Error("AssetIn can not be empty");
    if (t === "") throw new Error("AssetOut can not be empty");
    if (a === "") throw new Error("Fee asset can not be empty");
    let d = new Am(n);
    if (d.isNaN()) throw new Error(`Amount '${d.toString()}' is not a number`);
    if (d.lte(0))
        throw new Error(`Amount '${d.toString()}' should be greater than 0`);
    let { assetToAddress: m } = await ur(o.getInfo)(),
        l = Ne(m),
        p = await ur(o.getPlatformFees)({
            walletAddress: s,
            assetIn: e,
            assetOut: t,
        }),
        u = await ur(o.getPricesWithQuoteAsset)(),
        S = await ur(o.getGasPriceWei)(),
        f = Ro.formatUnits(S, "gwei").toString();
    if (m[e] === void 0) throw new Error(`Asset '${e}' not found`);
    let b = m[a];
    if (b === void 0)
        throw new Error(
            `Fee asset '${a}' not found. Available assets: ${Object.keys(p).join(", ")}`,
        );
    let g = await ur(c.getSwapInfo)(
            r,
            e,
            t,
            d.toString(),
            i?.instantSettlement,
            i?.poolOnly !== void 0 && i.poolOnly ? "pools" : void 0,
        ),
        { exchanges: y } = g,
        { factories: C } = await ur(o.getPoolsConfig)(),
        N = C !== void 0 ? Object.keys(C) : [],
        [U] = y,
        D;
    if (
        ((i?.poolOnly !== void 0 && i.poolOnly) ||
        (N.length > 0 && y.length === 1 && U !== void 0 && N.some(($) => $ === U))
            ? (D = "pool")
            : (D = "aggregator"),
        D === "pool")
    ) {
        let $ = BigInt(6e5) * BigInt(S),
            W = H($, BigInt(18));
        return {
            route: D,
            swapInfo: g,
            fee: {
                assetName: l,
                assetAddress: Ro.ZeroAddress,
                networkFeeInFeeAsset: W.toString(),
                protocolFeeInFeeAsset: void 0,
            },
        };
    }
    if (g.orderInfo !== null) {
        let [$] = g.orderInfo.assetPair.split("-");
        if ($ === void 0) throw new Error("Base asset name is undefined");
        let W = m[$];
        if (W === void 0) throw new Error(`No asset address for ${$}`);
        let ie = p[a];
        if (ie === void 0) throw new Error(`Fee asset ${a} not available`);
        let { serviceFeeInFeeAsset: Ae, networkFeeInFeeAsset: Ce } = Bt(
            g.orderInfo.amount,
            f,
            ie,
            W,
            Ro.ZeroAddress,
            b,
            u.prices,
        );
        return {
            route: D,
            swapInfo: g,
            fee: {
                assetName: a,
                assetAddress: b,
                networkFeeInFeeAsset: Ce,
                protocolFeeInFeeAsset: Ae,
            },
        };
    }
    return {
        route: D,
        swapInfo: g,
        fee: {
            assetName: a,
            assetAddress: b,
            networkFeeInFeeAsset: void 0,
            protocolFeeInFeeAsset: void 0,
        },
    };
}
import { ethers as Ts, ZeroAddress as Ft } from "ethers-v6";
import _m from "lodash.clonedeep";
var qt = class r extends Array {
    static from(e) {
        return new r(e);
    }
    constructor(e) {
        super(e.length);
        for (let t in e) {
            let n = e[t];
            if (n === void 0)
                throw new Error("Array passed to constructor has undefined values");
            this[t] = n;
        }
    }
    toArray() {
        return [...this];
    }
    map(e, t) {
        return new r(super.map(e, t));
    }
    filter(e, t) {
        return new r(super.filter(e, t));
    }
    get(e) {
        let t = this.at(e);
        if (t === void 0) throw new Error(`Element at index ${e} is undefined.`);
        return t;
    }
    last() {
        return this.get(this.length - 1);
    }
    first() {
        return this.get(0);
    }
};
function Kt(r, e, t) {
    let n = r[e];
    if (n === void 0)
        throw new Error(
            `Key '${e.toString()}' not found in object. Available keys: ${Object.keys(r).join(", ")}.${t ? ` ${t}` : ""}`,
        );
    return n;
}
var ms = "Requirement not met";
function ra(r, e) {
    if (r) return;
    let t = typeof e == "function" ? e() : e,
        n = t ? `${ms}: ${t}` : ms;
    throw new Error(n);
}
import { simpleFetch as Nm } from "simple-typed-fetch";
import { SwapExecutor__factory as us } from "./contracts/lib/ethers-v6/index.js";
import { concat as gs, ethers as hs, toBeHex as Em } from "ethers-v6";
import {
    ERC20__factory as wm,
    SwapExecutor__factory as ps,
} from "./contracts/lib/ethers-v6/index.js";
import { ethers as de } from "ethers-v6";
var Im = "func_70LYiww";
function Pt(r, e, t = { skipCallDataPatching: !1, skipValuePatching: !0 }) {
    let n = ps.createInterface(),
        a = xm(r, t);
    return (
        (r = n.encodeFunctionData("patchCallWithTokenBalance", [
            r,
            a,
            e,
            de.MaxUint256,
        ])),
            he(r)
    );
}
function he(r, e) {
    let t = 0;
    if (e) {
        if (e.value !== void 0) {
            t += 16;
            let a = de.solidityPacked(["uint128"], [e.value]);
            r = de.hexlify(de.concat([a, r]));
        }
        if (e.target !== void 0) {
            t += 32;
            let a = de.solidityPacked(["address"], [e.target]);
            r = de.hexlify(de.concat([a, r]));
        }
        if (e.gaslimit !== void 0) {
            t += 64;
            let a = de.solidityPacked(["uint32"], [e.gaslimit]);
            r = de.hexlify(de.concat([a, r]));
        }
        e.isMandatory !== void 0 && (t += 128);
    }
    let n = de.solidityPacked(["uint8"], [t]);
    return (r = de.hexlify(de.concat([n, r]))), r;
}
function xm(r, e) {
    let t = 0,
        n = de.solidityPacked(["uint256"], [(r.length - 4) / 2 - 32]);
    (n = de.dataSlice(n, 1)),
    e &&
    (e.skipOnZeroAmount !== void 0 && e.skipOnZeroAmount === !1 && (t += 32),
    e.skipCallDataPatching !== void 0 && e.skipCallDataPatching && (t += 64),
    e.skipValuePatching !== void 0 && e.skipValuePatching && (t += 128));
    let a = de.solidityPacked(["uint8"], [t]);
    return (n = de.hexlify(de.concat([a, n]))), n;
}
function ls(r) {
    return (
        "0x" +
        ps.createInterface().encodeFunctionData(Im, [de.ZeroAddress, r]).slice(74)
    );
}
async function _o(r, e, t) {
    return (await Pm(r, e, t)) / BigInt(10) ** 8n;
}
async function Pm(r, e, t) {
    console.log('token address', r);
    (r = await r), typeof r != "string" && (r = await r.getAddress());
    let n = 18n;
    console.log('befor erc-20 contract connect');
    if (r !== de.ZeroAddress) {
        let a = wm.connect(r, t);
        console.log('after erc-20 contract connect:', a);
        n = BigInt(await a.decimals());
        console.log('after erc-20 contract decimals()');
    }
    console.log('before return');
    return BigInt(e) * BigInt(10) ** n;
}
async function No(r, e) {
    let t = us.createInterface(),
        n = [];
    if (r.length > 1)
        for (let c = 0; c < r.length - 1; ++c) {
            let i = r.get(c),
                s = r.get(c + 1),
                d = await na(i.pool, i.assetIn, i.assetOut, s.pool);
            n.push(d);
        }
    let a = r.last(),
        o = t.encodeFunctionData("swapUniV2", [
            a.pool,
            a.assetIn,
            a.assetOut,
            hs.AbiCoder.defaultAbiCoder().encode(["uint256"], [gs(["0x03", e])]),
        ]);
    return n.push(he(o)), n;
}
function na(r, e, t, n, a = 3) {
    let c = us
        .createInterface()
        .encodeFunctionData("swapUniV2", [
            r,
            e,
            t,
            hs.AbiCoder.defaultAbiCoder().encode(["uint256"], [gs([Em(a), n])]),
        ]);
    return he(c);
}
import {
    SwapExecutor__factory as aa,
    UniswapV3Pool__factory as Tm,
} from "./contracts/lib/ethers-v6/index.js";
import { ethers as gr } from "ethers-v6";
async function fs(r, e, t, n) {
    typeof e > "u" && (e = 0);
    let a = await oa(r.pool, r.assetIn, r.assetOut, n),
        c = aa
            .createInterface()
            .encodeFunctionData("uniswapV3SingleSwapTo", [a, t, e]);
    return he(c);
}
async function bs(r, e, t, n) {
    e === void 0 && (e = 0);
    let a = await oa(r.pool, r.assetIn, r.assetOut, n),
        c = aa
            .createInterface()
            .encodeFunctionData("orionV3SingleSwapTo", [a, t, e]);
    return he(c);
}
async function Ss(r, e, t, n) {
    let a = [];
    for (let i of r) {
        let s = await oa(i.pool, i.assetIn, i.assetOut, n);
        a.push(s);
    }
    let c = aa.createInterface().encodeFunctionData("uniswapV3SwapTo", [a, t, e]);
    return (c = he(c)), [c];
}
async function ys(r, e, t, n) {
    let a = [];
    for (let i of r) {
        let s = await oa(i.pool, i.assetIn, i.assetOut, n);
        a.push(s);
    }
    let c = aa.createInterface().encodeFunctionData("orionV3SwapTo", [a, t, e]);
    return (c = he(c)), [c];
}
async function oa(r, e, t, n) {
    let a = Tm.connect(r, n),
        c = (await a.token0()).toLowerCase() === e.toLowerCase(),
        i = t === gr.ZeroAddress,
        s = gr.solidityPacked(["uint256"], [await a.getAddress()]);
    s = gr.dataSlice(s, 1);
    let d = 0;
    i && (d += 32), c || (d += 128);
    let m = gr.solidityPacked(["uint8"], [d]);
    return (s = gr.hexlify(gr.concat([m, s]))), s;
}
import { SwapExecutor__factory as As } from "./contracts/lib/ethers-v6/index.js";
function ia(r, e, t, n) {
    let o = As.createInterface().encodeFunctionData("safeTransfer", [r, e, t]);
    return he(o, n);
}
function ws(r, e, t, n) {
    let o = As.createInterface().encodeFunctionData("safeApprove", [r, e, t]);
    return he(o, n);
}
import {
    SwapExecutor__factory as vm,
    CurveRegistry__factory as km,
    ERC20__factory as Om,
} from "./contracts/lib/ethers-v6/index.js";
import { MaxUint256 as Rm } from "ethers-v6";
async function Bo(r, e, t, n, a, o, c = !1) {
    let i = vm.createInterface(),
        s = km.connect(o, n),
        { pool: d, assetIn: m, assetOut: l } = t,
        u = await Om.connect(m, n).allowance(a, d),
        S = [];
    if (u <= BigInt(r)) {
        let g = await ws(m, d, Rm);
        S.push(g);
    }
    let [f, h] = await s.get_coin_indices(d, m, l),
        b = i.encodeFunctionData("curveSwapStableAmountIn", [d, l, f, h, e, r]);
    return (b = he(b)), c && (b = Pt(b, t.assetIn)), S.push(b), S;
}
import { SwapExecutor__factory as Is } from "./contracts/lib/ethers-v6/index.js";
function xs(r, e) {
    let n = Is.createInterface().encodeFunctionData("wrapAndTransfer", [r]);
    return he(n, e);
}
function Ps(r, e, t) {
    let a = Is.createInterface().encodeFunctionData("unwrapAndTransfer", [r, e]);
    return he(a, t);
}
import { SwapExecutor__factory as Cm } from "./contracts/lib/ethers-v6/index.js";
function Es(r, e, t, n) {
    let o = Cm.createInterface().encodeFunctionData("payFeeToMatcher", [r, e, t]);
    return he(o, n);
}
async function vs({
                      amount: r,
                      minReturnAmount: e,
                      initiatorAddress: t,
                      receiverAddress: n,
                      path: a,
                      matcher: o = Ft,
                      feeToken: c = Ft,
                      fee: i = 0,
                      unit: s,
                  }) {
    if (a == null || a.length == 0) throw new Error("Empty path");
    let d = Kt(s.contracts, "WETH"),
        m = Kt(s.contracts, "curveRegistry"),
        {
            assetToAddress: l,
            swapExecutorContractAddress: p,
            exchangeContractAddress: u,
        } = await Nm(s.blockchainService.getInfo)(),
        S = _m(a),
        f = qt.from(S);
    return (
        (f = qt
            .from(S)
            .map(
                (h) => (
                    (h.assetIn = l[h.assetIn] ?? h.assetIn),
                        (h.assetOut = l[h.assetOut] ?? h.assetOut),
                        (h.assetIn = h.assetIn.toLowerCase()),
                        (h.assetOut = h.assetOut.toLowerCase()),
                        h
                ),
            )),
            await hr({
                amount: r,
                minReturnAmount: e,
                receiverAddress: n,
                initiatorAddress: t,
                path: f,
                matcher: o,
                feeToken: c,
                fee: i,
                exchangeContractAddress: u,
                wethAddress: d,
                curveRegistryAddress: m,
                swapExecutorContractAddress: p,
                provider: s.provider,
            })
    );
}
async function hr({
                      amount: r,
                      minReturnAmount: e,
                      initiatorAddress: t,
                      receiverAddress: n,
                      path: a,
                      matcher: o = Ft,
                      feeToken: c = Ft,
                      fee: i = 0,
                      exchangeContractAddress: s,
                      wethAddress: d,
                      curveRegistryAddress: m,
                      swapExecutorContractAddress: l,
                      provider: p,
                  }) {
    console.log('start generateSwapCalldata');
    console.log('path:', a);
    let u = await ge(d),
        S = await ge(m),
        f = await ge(l),
        h = await ge(c),
        b = await ge(o),
        g = qt
            .from(a)
            .map(
                (F) => (
                    // (F.assetIn = F.assetIn.toLowerCase()),
                    // (F.assetOut = F.assetOut.toLowerCase()),
                    F
                ),
            );
    console.log('lowered path:', g[0].assetOut);
    let { assetIn: y } = g.first(),
        { assetOut: C } = g.last();
    console.log('g.first', g.first().assetIn);
    console.log('g.last', g.last().assetOut);
    console.log('C', C)
    let N = {
        srcToken: y,
        dstToken: C,
        srcReceiver: f,
        dstReceiver: n,
        amount: r,
        minReturnAmount: e,
        flags: 0,
    };
    console.log('after LibValidator.SwapDescriptionStruct swapDescription: ', N);
    let U = await _o(y, r, p);
    console.log('after first exchangeToNativeDecimals of srcToken, amount, provider');
    let D = await _o(h, i, p);
    console.log('after second exchangeToNativeDecimals of feeToken, fee, provider');

    g = qt
        .from(a)
        .map(
            (F) => (
                F.assetIn == Ts.ZeroAddress && (F.assetIn = u),
                F.assetOut == Ts.ZeroAddress && (F.assetOut = u),
                    F
            ),
        );
    console.log('path: ', g);
    console.log('second path output');
    let $;
    console.log('before processSwaps swapDescription:', N);
    ({ swapDescription: N, calls: $ } = await Bm(N, g, U, b, h, D, u, f, S, p));
    console.log('after processSwaps swapDescription:', N);
    let W = ls($),
        { useExchangeBalance: ie, additionalTransferAmount: Ae } = await Fm(
            y,
            t,
            s,
            U,
            p,
        );
    console.log('after shouldUserExchangeBlance');
    ie && (N.flags = 1n << 255n);
    let Ce = y == Ft ? Ae : 0n;
    console.log('swapDescription:', N);
    console.log('calldata:', W);
    console.log('value:', Ce);

    return { swapDescription: N, calldata: W, value: Ce };
}
async function Bm(r, e, t, n, a, o, c, i, s, d) {
    let { factory: m } = e.first(),
        l = e.every((u) => u.factory === m),
        p;
    return (
        l
            ? ({ swapDescription: r, calls: p } = await Um(m, r, e, t, i, s, d))
            : ({ swapDescription: r, calls: p } = await Lm(r, e, t, i, s, d)),
            ({ swapDescription: r, calls: p } = await Dm(n, a, o, p, r)),
            ({ swapDescription: r, calls: p } = $m(t, r, p, i, c)),
            { swapDescription: r, calls: p }
    );
}
async function Um(r, e, t, n, a, o, c) {
    let i = [];
    switch (r) {
        case "OrionV2": {
            (e.srcReceiver = t.first().pool), (i = await No(t, a));
            break;
        }
        case "UniswapV2": {
            (e.srcReceiver = t.first().pool), (i = await No(t, a));
            break;
        }
        case "UniswapV3": {
            i = await Ss(t, n, a, c);
            break;
        }
        case "OrionV3": {
            i = await ys(t, n, a, c);
            break;
        }
        case "Curve": {
            if (t.length > 1)
                throw new Error("Supporting only single stable swap on curve");
            i = await Bo(n, a, t.first(), c, a, o);
            break;
        }
        default:
            throw new Error(`Factory ${r} is not supported`);
    }
    return { swapDescription: e, calls: i };
}
async function Lm(r, e, t, n, a, o) {
    let c = [];
    for (let i of e)
        switch (i.factory) {
            case "OrionV2": {
                let s = ia(i.assetIn, i.pool, 0);
                s = Pt(s, i.assetIn);
                let d = na(i.pool, i.assetIn, i.assetOut, n);
                c.push(s, d);
                break;
            }
            case "UniswapV2": {
                let s = ia(i.assetIn, i.pool, 0);
                s = Pt(s, i.assetIn);
                let d = na(i.pool, i.assetIn, i.assetOut, n);
                c.push(s, d);
                break;
            }
            case "UniswapV3": {
                let s = await fs(i, 0, n, o);
                (s = Pt(s, i.assetIn)), c.push(s);
                break;
            }
            case "OrionV3": {
                let s = await bs(i, 0, n, o);
                (s = Pt(s, i.assetIn)), c.push(s);
                break;
            }
            case "Curve": {
                let s = await Bo(t, n, i, o, n, a, !0);
                c.push(...s);
                break;
            }
            default:
                throw new Error(`Factory ${i.factory} is not supported`);
        }
    return { swapDescription: r, calls: c };
}
async function Dm(r, e, t, n, a) {
    if (BigInt(t) !== 0n && e === a.dstToken) {
        let o = Es(r, e, t);
        n.push(o);
    }
    return { swapDescription: a, calls: n };
}
function $m(r, e, t, n, a) {
    let { dstReceiver: o, srcReceiver: c, srcToken: i, dstToken: s } = e;
    if (i === Ft) {
        let d = xs(c, { value: r });
        (e.srcReceiver = n), (t = [d].concat(t));
    }
    if (s === Ft) {
        let d = Ps(o, 0);
        (d = Pt(d, a)), t.push(d);
    } else {
        let d = ia(s, o, 0);
        (d = Pt(d, s)), t.push(d);
    }
    return { swapDescription: e, calls: t };
}
async function Fm(r, e, t, n, a) {
    let { walletBalance: o, exchangeBalance: c } = await ss(r, e, t, a),
        i = await is(r, e, t, a);
    if (o + c < n)
        throw new Error(
            `Not enough balance to make swap, totalBalance - ${o + c} swapAmount - ${n}`,
        );
    let s = !0,
        d = 0n;
    if (o >= n || c == 0n) (s = !1), (d = n);
    else if (((d = c >= n ? 0n : n - c), r !== Ft && d > i))
        throw new Error(
            `Not enough allowance to make swap, allowance - ${i} needed allowance - ${d}`,
        );
    return { useExchangeBalance: s, additionalTransferAmount: d };
}
import { BigNumber as ks } from "bignumber.js";
import { ethers as Uo } from "ethers-v6";
import { Exchange__factory as jm } from "./contracts/lib/ethers-v6/index.js";
import { simpleFetch as Os } from "simple-typed-fetch";
async function Lo({ asset: r, amount: e, signer: t, unit: n }) {
    if (r === "") throw new Error("Asset can not be empty");
    let a = new ks(e);
    if (a.isNaN()) throw new Error(`Amount '${a.toString()}' is not a number`);
    if (a.lte(0))
        throw new Error(`Amount '${a.toString()}' should be greater than 0`);
    let o = await t.getAddress(),
        { blockchainService: c, aggregator: i, provider: s, chainId: d } = n,
        { exchangeContractAddress: m, assetToAddress: l, assetToDecimals } = await Os(c.getInfo)(),
        decimal = assetToDecimals[r],
        p = Ne(l),
        u = jm.connect(m, s),
        S = await Os(c.getGasPriceWei)(),
        f = l[r];
    if (f === void 0) throw new Error(`Asset '${r}' not found`);
    let h = await it({ [r]: f, [p]: Uo.ZeroAddress }, i, o, u, s),
        b = new Me(h, { name: p, address: Uo.ZeroAddress }, s, t);
    b.registerRequirement({
        reason: "Amount",
        asset: { name: r, address: f },
        amount: a.toString(),
        sources: ["exchange"],
    });
    let g = await u.withdraw.populateTransaction(
        f,
        K(e, decimal, ks.ROUND_FLOOR).toString(),
    );
    g.gasLimit = BigInt(15e4);
    let y = BigInt(g.gasLimit) * BigInt(S),
        C = H(y, BigInt(18));
    b.registerRequirement({
        reason: "Network fee",
        asset: { name: p, address: Uo.ZeroAddress },
        amount: C.toString(),
        sources: ["wallet"],
    }),
        (g.chainId = BigInt(d)),
        (g.gasPrice = BigInt(S)),
        (g.from = o),
        await b.check(!0);
    let N = await s.getTransactionCount(o, "pending");
    g.nonce = N;
    // let U = await t.signTransaction(g),
    //     D = await s.broadcastTransaction(U);
    let D = await t.sendTransaction(g);
    console.log(`Withdraw tx sent: ${D.hash}. Waiting for confirmation...`);
    try {
        // (await D.wait())?.status !== void 0
        (await D.wait())?.status !== void 0
            ? console.log("Withdraw tx confirmed")
            : console.log("Withdraw tx failed");
    } catch ($) {
        if (!($ instanceof Error)) throw new Error("e is not an Error");
        console.error(`Deposit tx failed: ${$.message}`, { unsignedTx: g });
    }
}
import { BigNumber as Ie } from "bignumber.js";
import { ethers as br } from "ethers-v6";
import { Exchange__factory as tp } from "./contracts/lib/ethers-v6/index.js";
import { ethers as Hm } from "ethers-v6";
function Be(r, e, t) {
    switch (t) {
        case "aggregator":
            return e === Hm.ZeroAddress ? ["exchange"] : ["exchange", "wallet"];
        case "pool":
            return r === "network_fee" ? ["wallet"] : ["exchange", "wallet"];
        default:
            throw new Error("Unknown route item");
    }
}
var _s = {};
ae(_s, { signCancelOrder: () => Cs, signOrder: () => fr });
import { ethers as zm } from "ethers-v6";
var Rs = {
    name: "Orion Exchange",
    version: "1",
    salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a557",
};
var Wm = rn.parse(Rs);
function Vm(r) {
    let e = {};
    for (let [t, n] of Object.entries(r)) n !== void 0 && (e[t] = n);
    return e;
}
var Gm = (r) => ({ ...Vm(Wm), chainId: r }),
    sa = Gm;
var qm = async (r, e, t, n) => {
        let a = { id: e, senderAddress: r },
            c = await t.signTypedData(sa(n), La, a),
            i = zm.Signature.from(c).serialized;
        return { ...a, signature: i };
    },
    Cs = qm;
import { BigNumber as $o } from "bignumber.js";
import { ethers as Ym } from "ethers-v6";
import { ethers as Km, keccak256 as Jm } from "ethers-v6";
var Qm = "0xb5132db62dfceb466f2f8aee7a039db36a99772e5a9771d28388a5f9baad7c54";
function Do(r) {
    let e = Km.AbiCoder.defaultAbiCoder(),
        {
            senderAddress: t,
            matcherAddress: n,
            baseAsset: a,
            quoteAsset: o,
            matcherFeeAsset: c,
            amount: i,
            price: s,
            matcherFee: d,
            nonce: m,
            expiration: l,
            buySide: p,
        } = r,
        u = e.encode(
            [
                "bytes32",
                "address",
                "address",
                "address",
                "address",
                "address",
                "uint64",
                "uint64",
                "uint64",
                "uint64",
                "uint64",
                "uint8",
            ],
            [Qm, t, n, a, o, c, i, s, d, m, l, p],
        );
    return Jm(u);
}
var Zm = 29 * 24 * 60 * 60 * 1e3,
    Xm = async (r, e, t, n, a, o, c, i, s, d, m) => {
        let l = Date.now(),
            p = l + Zm,
            u = {
                senderAddress: c,
                matcherAddress: i,
                baseAsset: r,
                quoteAsset: e,
                matcherFeeAsset: s,
                amount: Number(K(a, 8, $o.ROUND_FLOOR)),
                price: Number(K(n, 8, $o.ROUND_FLOOR)),
                matcherFee: Number(K(o, 8, $o.ROUND_CEIL)),
                nonce: l,
                expiration: p,
                buySide: t === "BUY" ? 1 : 0,
            },
            f = await d.signTypedData(sa(m), Da, u),
            h = Ym.Signature.from(f).serialized;
        return { ...u, id: Do(u), signature: h };
    },
    fr = Xm;
import { simpleFetch as Et } from "simple-typed-fetch";
var ep = (r) => _r.some((e) => e === r),
    ca = ep;
var rp = (r) => ca(r.factory);
async function Fo({
                      type: r,
                      assetIn: e,
                      assetOut: t,
                      price: n,
                      amount: a,
                      feeAsset: o,
                      signer: c,
                      unit: i,
                      options: s,
                  }) {
    if (
        (s?.developer &&
        s.logger?.("YOU SPECIFIED A DEVELOPER OPTIONS. BE CAREFUL!"),
        a === "")
    )
        throw new Error("Amount can not be empty");
    if (e === "") throw new Error("AssetIn can not be empty");
    if (t === "") throw new Error("AssetOut can not be empty");
    if (o === "") throw new Error("Fee asset can not be empty");
    if (n === "") throw new Error("Price can not be empty");
    let d = new Ie(a);
    if (d.isNaN()) throw new Error(`Amount '${d.toString()}' is not a number`);
    if (d.lte(0))
        throw new Error(`Amount '${d.toString()}' should be greater than 0`);
    let m = new Ie(n);
    if (m.isNaN()) throw new Error(`Price '${m.toString()}' is not a number`);
    if (m.lte(0)) throw new Error("Price should be greater than 0");
    let l = await c.getAddress();
    s?.logger?.(`Wallet address is ${l}`);
    let { blockchainService: p, aggregator: u, provider: S, chainId: f } = i,
        {
            exchangeContractAddress: h,
            matcherAddress: b,
            assetToAddress: g,
            swapExecutorContractAddress: y,
            assetToDecimals
        } = await Et(p.getInfo)(),
        decimalIn = assetToDecimals[e],
        decimalOut = assetToDecimals[t],
        C = Ne(g),
        N = tp.connect(h, S),
        U = await Et(p.getPlatformFees)({
            walletAddress: l,
            assetIn: e,
            assetOut: t,
        }),
        D = await Et(p.getPricesWithQuoteAsset)(),
        $ = await Et(p.getGasPriceWei)(),
        { factories: W, WETHAddress: ie } = await Et(p.getPoolsConfig)();
    ra(ie, "WETHAddress is not defined");
    let Ae = W !== void 0 ? Object.keys(W) : [],
        Ce = br.formatUnits($, "gwei").toString(),
        F = g[e];
    if (F === void 0) throw new Error(`Asset '${e}' not found`);
    let Q = g[o];
    if (Q === void 0)
        throw new Error(
            `Fee asset '${o}' not found. Available assets: ${Object.keys(U).join(", ")}`,
        );
    let dt = await it({ [e]: F, [o]: Q, [C]: br.ZeroAddress }, u, l, N, S),
        re = new Me(dt, { name: C, address: br.ZeroAddress }, S, c, s?.logger),
        A = await Et(u.getSwapInfo)(
            r,
            e,
            t,
            d.toString(),
            s?.instantSettlement,
            s?.poolOnly !== void 0 && s.poolOnly ? "pools" : void 0,
        ),
        { exchanges: Qe, exchangeContractPath: wr } = A,
        [we] = Qe;
    if (
        (Qe.length > 0 && s?.logger?.(`Swap exchanges: ${Qe.join(", ")}`),
        A.type === "exactReceive" && d.lt(A.minAmountOut))
    )
        throw new Error(
            `Amount is too low. Min amountOut is ${A.minAmountOut} ${t}`,
        );
    if (A.type === "exactSpend" && d.lt(A.minAmountIn))
        throw new Error(`Amount is too low. Min amountIn is ${A.minAmountIn} ${e}`);
    if (A.orderInfo === null) throw new Error(A.executionInfo);
    let [xe, pe] = A.orderInfo.assetPair.split("-");
    if (xe === void 0) throw new Error("Base asset name is undefined");
    if (pe === void 0) throw new Error("Quote asset name is undefined");
    let We = await Et(u.getPairConfig)(`${xe}-${pe}`),
        St = new Ie(We.minQty),
        kt = new Ie(We.qtyPrecision),
        Ye = new Ie(We.pricePrecision),
        mt = new Ie(We.minPrice),
        De = new Ie(We.maxPrice),
        yt = d.dp(),
        Pe = m.dp();
    if (yt === null)
        throw new Error(
            "Qty decimal places is null. Likely amount is -Infinity, +Infinity or NaN",
        );
    if (kt.lt(yt))
        throw new Error(
            `Actual amount decimal places (${yt}) is greater than max allowed decimal places (${kt.toString()}) on pair ${xe}-${pe}.`,
        );
    if (Pe === null)
        throw new Error(
            "Price decimal places is null. Likely price is -Infinity, +Infinity or NaN",
        );
    if (Ye.lt(Pe))
        throw new Error(
            `Actual price decimal places (${Pe}) is greater than max allowed decimal places (${Ye.toString()}) on pair ${xe}-${pe}.`,
        );
    if (m.lt(mt))
        throw new Error(`Price is too low. Min price is ${mt.toString()} ${pe}`);
    if (m.gt(De))
        throw new Error(`Price is too high. Max price is ${De.toString()} ${pe}`);
    s?.logger?.(`Safe price is ${A.orderInfo.safePrice} ${pe}`);
    let pt =
        r === "exactSpend"
            ? m.lte(A.orderInfo.safePrice)
            : m.gte(A.orderInfo.safePrice);
    s?.logger?.(
        `Your price ${m.toString()} is ${pt ? "better than or equal" : "worse than"} market price ${A.orderInfo.safePrice}`,
    );
    let $e;
    if (s?.developer?.route !== void 0) {
        if (s.developer.route === "pool" && !pt)
            throw new Error(
                'CONFLICT: Pool execution is not available for this swap. Price is worse than market price. Please unset "route" option or set it to "aggregator"',
            );
        ($e = s.developer.route),
            s.logger?.(`Swap is through ${$e} (because route forced to ${$e})`);
    } else if (s?.poolOnly !== void 0 && s.poolOnly) {
        if (!pt)
            throw new Error(
                'CONFLICT: Pool execution is not available for this swap. Price is worse than market price. Please disable "poolOnly" option',
            );
        s.logger?.('Swap is through pool (because "poolOnly" option is true)'),
            ($e = "pool");
    } else
        Ae.length > 0 &&
        Qe.length === 1 &&
        we !== void 0 &&
        Ae.some((_e) => _e === we) &&
        pt
            ? (s?.logger?.(
                `Swap is through pool [via ${we}] (detected by "exchanges" field)`,
            ),
                ($e = "pool"))
            : ($e = "aggregator");
    if ($e === "pool") {
        let _e;
        W &&
        we !== void 0 &&
        ((_e = W[we]),
        _e !== void 0 &&
        s?.logger?.(`Factory address is ${_e}. Exchange is ${we}`));
        let ve =
            A.type === "exactSpend"
                ? A.amountIn
                : new Ie(A.orderInfo.amount).multipliedBy(A.orderInfo.safePrice);
        re.registerRequirement({
            reason: "Amount spend",
            asset: { name: e, address: F },
            amount: ve.toString(),
            spenderAddress: h,
            sources: Be("amount", F, "pool"),
        });
        let Rt =
                A.type === "exactReceive"
                    ? A.amountOut
                    : new Ie(A.orderInfo.amount).multipliedBy(A.orderInfo.safePrice),
            // V = K(ve, decimalIn, Ie.ROUND_CEIL),
            // ke = K(Rt, decimalOut, Ie.ROUND_FLOOR),
            V = K(ve, 8, Ie.ROUND_CEIL),
            ke = K(Rt, 8, Ie.ROUND_FLOOR),
            {
                calldata: lt,
                swapDescription: Ct,
                value: Ve,
            } = await hr({
                amount: V,
                minReturnAmount: ke,
                path: wr.filter(rp),
                initiatorAddress: l,
                receiverAddress: l,
                provider: S,
                matcher: b,
                feeToken: Q,
                fee: 0,
                exchangeContractAddress: h,
                swapExecutorContractAddress: y,
                wethAddress: ie,
                curveRegistryAddress: Kt(i.contracts, "curveRegistry"),
            }),
            Ze = await N.swap.populateTransaction(y, Ct, new Uint8Array(0), lt, {
                value: Ve,
            });
        (Ze.chainId = BigInt(parseInt(f, 10))),
            (Ze.gasPrice = BigInt($)),
            (Ze.from = l);
        let Ir = new Ie(ve),
            nr = new Ie(0),
            xr = dt[e]?.exchange;
        if (xr === void 0)
            throw new Error(`Asset '${e}' exchange balance is not found`);
        e === C && Ir.gt(xr) && (nr = Ir.minus(xr)),
            (Ze.value = K(nr.dp(8, Ie.ROUND_CEIL), 18, Ie.ROUND_CEIL)),
            (Ze.gasLimit = BigInt(6e5));
        let Na = BigInt(6e5) * BigInt($),
            Ba = H(Na, BigInt(18));
        re.registerRequirement({
            reason: "Network fee",
            asset: { name: C, address: br.ZeroAddress },
            amount: Ba.toString(),
            sources: Be("network_fee", br.ZeroAddress, "pool"),
        }),
            await re.check(s?.autoApprove);
        let ar = await S.getTransactionCount(l, "pending");
        (Ze.nonce = ar), s?.logger?.("Signing transaction...");
        console.log('unsignedTransaction', Ze);
        let tn = await c.sendTransaction(Ze);
        return (
            s?.logger?.(`Transaction sent. Tx hash: ${tn.hash}`),
                {
                    amountOut: A.amountOut,
                    wait: tn.wait.bind(tn),
                    through: "pool",
                    txHash: tn.hash,
                }
        );
    }
    if ((s?.logger?.("Swap through aggregator"), d.lt(St)))
        throw new Error(`Amount is too low. Min amount is ${St.toString()} ${xe}`);
    let Ot = g[xe];
    if (Ot === void 0) throw new Error(`No asset address for ${xe}`);
    let tr = g[pe];
    if (tr === void 0) throw new Error(`No asset address for ${pe}`);
    let Ht = m.decimalPlaces(
        We.pricePrecision,
        A.orderInfo.side === "BUY" ? Ie.ROUND_CEIL : Ie.ROUND_FLOOR,
    );
    re.registerRequirement({
        reason: "Amount",
        asset: { name: e, address: F },
        amount:
            A.orderInfo.side === "SELL"
                ? A.orderInfo.amount.toString()
                : Ht.multipliedBy(A.orderInfo.amount).toString(),
        spenderAddress: h,
        sources: Be("amount", F, "aggregator"),
    });
    let rr = U[o];
    if (rr === void 0) throw new Error(`Fee asset ${o} not available`);
    let {
        serviceFeeInFeeAsset: Mt,
        networkFeeInFeeAsset: At,
        totalFeeInFeeAsset: Ee,
    } = Bt(A.orderInfo.amount, Ce, rr, Ot, br.ZeroAddress, Q, D.prices);
    o === t &&
    (s?.logger?.(
        "Fee asset equals received asset. The fee can be paid from the amount received",
    ),
        s?.logger?.(`Set extra balance: + ${A.amountOut} ${t} to exchange`),
        re.setExtraBalance(o, A.amountOut, "exchange")),
        re.registerRequirement({
            reason: "Network fee",
            asset: { name: o, address: Q },
            amount: At.toString(),
            spenderAddress: h,
            sources: Be("network_fee", Q, "aggregator"),
        }),
        re.registerRequirement({
            reason: "Service fee",
            asset: { name: o, address: Q },
            amount: Mt.toString(),
            spenderAddress: h,
            sources: Be("service_fee", Q, "aggregator"),
        }),
        await re.check(s?.autoApprove);
    let Te = await fr(
        Ot,
        tr,
        A.orderInfo.side,
        Ht.toString(),
        A.orderInfo.amount,
        Ee,
        l,
        b,
        Q,
        c,
        f,
    );
    if (!(await N.validateOrder(Te))) throw new Error("Order is not valid");
    let { orderId: at } = await Et(u.placeOrder)(Te, !1);
    return (
        s?.logger?.(`Order placed. Order id: ${at}`),
            {
                amountOut: d.multipliedBy(Ht).toNumber(),
                wait: () =>
                    new Promise((_e, ve) => {
                        let Rt = setTimeout(() => {
                                ve(new Error("Timeout"));
                            }, 6e4),
                            V = setInterval(() => {
                                Et(u.getOrder)(at)
                                    .then((ke) => {
                                        ke.order.status === "SETTLED"
                                            ? (s?.logger?.(`Order ${at} settled`),
                                                clearTimeout(Rt),
                                                clearInterval(V),
                                                _e(ke))
                                            : s?.logger?.(`Order ${at} status: ${ke.order.status}`);
                                    })
                                    .catch((ke) => {
                                        if (!(ke instanceof Error)) throw new Error("Not an error");
                                        s?.logger?.(
                                            `Error while getting order status: ${ke.message}`,
                                        );
                                    });
                            }, 1e3);
                    }),
                through: "aggregator",
                id: at,
            }
    );
}
import { BigNumber as fe } from "bignumber.js";
import { ethers as Sr } from "ethers-v6";
import { Exchange__factory as np } from "./contracts/lib/ethers-v6/index.js";
import { simpleFetch as Tt } from "simple-typed-fetch";
var ap = (r) => ca(r.factory);
async function jo({
                      type: r,
                      assetIn: e,
                      assetOut: t,
                      amount: n,
                      feeAsset: a,
                      slippagePercent: o,
                      signer: c,
                      unit: i,
                      options: s,
                  }) {
    if (
        (s?.developer &&
        s.logger?.("YOU SPECIFIED A DEVELOPER OPTIONS. BE CAREFUL!"),
        n === "")
    )
        throw new Error("Amount can not be empty");
    if (e === "") throw new Error("AssetIn can not be empty");
    if (t === "") throw new Error("AssetOut can not be empty");
    if (a === "") throw new Error("Fee asset can not be empty");
    if (o === "") throw new Error("Slippage percent can not be empty");
    let d = new fe(n);
    if (d.isNaN()) throw new Error(`Amount '${d.toString()}' is not a number`);
    if (d.lte(0))
        throw new Error(`Amount '${d.toString()}' should be greater than 0`);
    let m = new fe(o);
    if (m.isNaN())
        throw new Error(`Slippage percent '${m.toString()}' is not a number`);
    if (m.lte(0)) throw new Error("Slippage percent should be greater than 0");
    if (m.gte(50)) throw new Error("Slippage percent should be less than 50");
    let l = await c.getAddress();
    s?.logger?.(`Wallet address is ${l}`);
    let { blockchainService: p, aggregator: u, provider: S, chainId: f } = i,
        {
            exchangeContractAddress: h,
            matcherAddress: b,
            assetToAddress: g,
            swapExecutorContractAddress: y,
            assetToDecimals,
        } = await Tt(p.getInfo)(),
        decimalIn = assetToDecimals[e],
        decimalOut = assetToDecimals[t],
        C = Ne(g),
        N = np.connect(h, S),
        U = await Tt(p.getPlatformFees)({
            walletAddress: l,
            assetIn: e,
            assetOut: t,
        }),
        D = await Tt(p.getPricesWithQuoteAsset)(),
        $ = await Tt(p.getGasPriceWei)(),
        { factories: W, WETHAddress: ie } = await Tt(p.getPoolsConfig)();
    console.log('WETHADDRESS:', ie);
    ra(ie, "WETHAddress is not defined");
    let Ae = W !== void 0 ? Object.keys(W) : [],
        Ce = Sr.formatUnits($, "gwei").toString(),
        F = g[e];
    if (F === void 0) throw new Error(`Asset '${e}' not found`);
    let Q = g[a];
    if (Q === void 0)
        throw new Error(
            `Fee asset '${a}' not found. Available assets: ${Object.keys(U).join(", ")}`,
        );
    let dt = await it({ [e]: F, [a]: Q, [C]: Sr.ZeroAddress }, u, l, N, S),
        re = new Me(dt, { name: C, address: Sr.ZeroAddress }, S, c, s?.logger),
        A = await Tt(u.getSwapInfo)(
            r,
            e,
            t,
            d.toString(),
            s?.instantSettlement,
            s?.poolOnly !== void 0 && s.poolOnly ? "pools" : void 0,
        ),
        { exchanges: Qe, exchangeContractPath: wr } = A,
        [we] = Qe;
    if (wr.length > 0) {
        let length = wr.length;
        let assetIn = wr[0].assetIn;
        let assetOut = wr[length - 1].assetOut;
        wr[0].assetIn = g[assetIn];
        wr[length - 1].assetOut = g[assetOut];
    }
    console.log('swapInfo', A);
    if (
        (Qe.length > 0 && s?.logger?.(`Swap exchanges: ${Qe.join(", ")}`),
        A.type === "exactReceive" && d.lt(A.minAmountOut))
    )
        throw new Error(
            `Amount is too low. Min amountOut is ${A.minAmountOut} ${t}`,
        );
    if (A.type === "exactSpend" && d.lt(A.minAmountIn))
        throw new Error(`Amount is too low. Min amountIn is ${A.minAmountIn} ${e}`);
    if (A.orderInfo === null) throw new Error(A.executionInfo);
    let [xe, pe] = A.orderInfo.assetPair.split("-");
    if (xe === void 0) throw new Error("Base asset name is undefined");
    if (pe === void 0) throw new Error("Quote asset name is undefined");
    let We = await Tt(u.getPairConfig)(`${xe}-${pe}`),
        St = new fe(We.qtyPrecision),
        kt = d.dp();
    if (kt === null)
        throw new Error(
            "Qty decimal places is null. Likely amount is -Infinity, +Infinity or NaN",
        );
    if (St.lt(kt))
        throw new Error(
            `Actual amount decimal places (${kt}) is greater than max allowed decimal places (${St.toString()}) on pair ${xe}-${pe}.`,
        );
    let Ye,
        mt = new fe(o).div(100);
    if (
        (s?.developer?.route !== void 0
            ? ((Ye = s.developer.route),
                s.logger?.(`Swap is through ${Ye} (because route forced to ${Ye})`))
            : s?.poolOnly !== void 0 && s.poolOnly
                ? (s.logger?.(
                    'Swap is through pool (because "poolOnly" option is true)',
                ),
                    (Ye = "pool"))
                : Ae.length > 0 &&
                Qe.length === 1 &&
                we !== void 0 &&
                Ae.some((Te) => Te === we)
                    ? (s?.logger?.(
                        `Swap is through pool [via ${we}] (detected by "exchanges" field)`,
                    ),
                        (Ye = "pool"))
                    : (Ye = "aggregator"),
        Ye === "pool")
    ) {
        let Te;
        W &&
        we !== void 0 &&
        ((Te = W[we]),
        Te !== void 0 &&
        s?.logger?.(`Factory address is ${Te}. Exchange is ${we}`));
        let ne = new fe(A.amountOut).multipliedBy(new fe(1).minus(mt)).toString(),
            at = new fe(A.amountIn).multipliedBy(new fe(1).plus(mt)).toString(),
            _e = A.type === "exactSpend" ? A.amountIn : at;
        console.log('pt0');
        re.registerRequirement({
            reason: "Amount spend",
            asset: { name: e, address: F },
            amount: _e.toString(),
            spenderAddress: h,
            sources: Be("amount", F, "pool"),
        });
        console.log('pt1');
        let ve = A.type === "exactReceive" ? A.amountOut : ne,
            Rt = K(_e, decimalIn, fe.ROUND_CEIL),
            V = K(ve, decimalOut, fe.ROUND_FLOOR),
            {
                calldata: ke,
                swapDescription: lt,
                value: Ct,
            } = await hr({
                amount: Rt,
                minReturnAmount: V,
                path: wr.filter(ap),
                initiatorAddress: l,
                receiverAddress: l,
                provider: S,
                matcher: b,
                feeToken: Q,
                fee: 0,
                exchangeContractAddress: h,
                swapExecutorContractAddress: y,
                wethAddress: ie,
                curveRegistryAddress: Kt(i.contracts, "curveRegistry"),
            }); console.log('before swap populateTransaction');
        let Ve = await N.swap.populateTransaction(y, lt, new Uint8Array(0), ke, {
            value: Ct,
        });
        console.log('pt2');
        (Ve.chainId = BigInt(parseInt(f, 10))),
            (Ve.gasPrice = BigInt($)),
            (Ve.from = l);
        let Ze = new fe(_e),
            Ir = new fe(0),
            nr = dt[e]?.exchange;
        if (nr === void 0)
            throw new Error(`Asset '${e}' exchange balance is not found`);
        e === C && Ze.gt(nr) && (Ir = Ze.minus(nr)),
            (Ve.value = K(Ir.dp(8, fe.ROUND_CEIL), 18, fe.ROUND_CEIL)),
            (Ve.gasLimit = BigInt(6e5));
        let xr = BigInt(6e5) * BigInt($),
            Na = H(xr, BigInt(18));
        re.registerRequirement({
            reason: "Network fee",
            asset: { name: C, address: Sr.ZeroAddress },
            amount: Na.toString(),
            sources: Be("network_fee", Sr.ZeroAddress, "pool"),
        }),
            await re.check(s?.autoApprove);
        let Ba = await S.getTransactionCount(l, "pending");
        (Ve.nonce = Ba), s?.logger?.("Signing transaction...");
        let ar = await c.sendTransaction(Ve);
        console.log('after sendTransaction');
        return (
            s?.logger?.(`Transaction sent. Tx hash: ${ar.hash}`),
                {
                    amountOut: A.amountOut,
                    wait: ar.wait.bind(ar),
                    through: "pool",
                    txHash: ar.hash,
                }
        );
    }
    s?.logger?.("Swap through aggregator");
    let De = new fe(1).plus(A.orderInfo.side === "SELL" ? mt.negated() : mt),
        yt = mt.isZero()
            ? A.orderInfo.safePrice
            : new fe(A.orderInfo.safePrice).multipliedBy(De).toString(),
        Pe = g[xe];
    if (Pe === void 0) throw new Error(`No asset address for ${xe}`);
    let pt = g[pe];
    if (pt === void 0) throw new Error(`No asset address for ${pe}`);
    let $e = new fe(yt).decimalPlaces(
        We.pricePrecision,
        A.orderInfo.side === "BUY" ? fe.ROUND_CEIL : fe.ROUND_FLOOR,
    );
    re.registerRequirement({
        reason: "Amount",
        asset: { name: e, address: F },
        amount:
            A.orderInfo.side === "SELL"
                ? A.orderInfo.amount.toString()
                : $e.multipliedBy(A.orderInfo.amount).toString(),
        spenderAddress: h,
        sources: Be("amount", F, "aggregator"),
    });
    let Ot = U[a];
    if (Ot === void 0) throw new Error(`Fee asset ${a} not available`);
    let {
        serviceFeeInFeeAsset: tr,
        networkFeeInFeeAsset: Ht,
        totalFeeInFeeAsset: rr,
    } = Bt(A.orderInfo.amount, Ce, Ot, Pe, Sr.ZeroAddress, Q, D.prices);
    a === t &&
    (s?.logger?.(
        "Fee asset equals received asset. The fee can be paid from the amount received",
    ),
        s?.logger?.(`Set extra balance: + ${A.amountOut} ${t} to exchange`),
        re.setExtraBalance(a, A.amountOut, "exchange")),
        re.registerRequirement({
            reason: "Network fee",
            asset: { name: a, address: Q },
            amount: Ht.toString(),
            spenderAddress: h,
            sources: Be("network_fee", Q, "aggregator"),
        }),
        re.registerRequirement({
            reason: "Service fee",
            asset: { name: a, address: Q },
            amount: tr.toString(),
            spenderAddress: h,
            sources: Be("service_fee", Q, "aggregator"),
        }),
        await re.check(s?.autoApprove);
    let Mt = await fr(
        Pe,
        pt,
        A.orderInfo.side,
        $e.toString(),
        A.orderInfo.amount,
        rr,
        l,
        b,
        Q,
        c,
        f,
    );
    if (!(await N.validateOrder(Mt))) throw new Error("Order is not valid");
    let { orderId: Ee } = await Tt(u.placeOrder)(Mt, !1);
    return (
        s?.logger?.(`Order placed. Order id: ${Ee}`),
            {
                amountOut: A.amountOut,
                wait: () =>
                    new Promise((Te, ne) => {
                        let at = setTimeout(() => {
                                ne(new Error("Timeout"));
                            }, 6e4),
                            _e = setInterval(() => {
                                Tt(u.getOrder)(Ee)
                                    .then((ve) => {
                                        ve.order.status === "SETTLED"
                                            ? (s?.logger?.(`Order ${Ee} settled`),
                                                clearTimeout(at),
                                                clearInterval(_e),
                                                Te(ve))
                                            : s?.logger?.(`Order ${Ee} status: ${ve.order.status}`);
                                    })
                                    .catch((ve) => {
                                        if (!(ve instanceof Error)) throw new Error("Not an error");
                                        s?.logger?.(
                                            `Error while getting order status: ${ve.message}`,
                                        );
                                    });
                            }, 1e3);
                    }),
                through: "aggregator",
                id: Ee,
            }
    );
}
var Vr = class {
    unit;
    constructor(e) {
        this.unit = e;
    }
    getSwapInfo(e) {
        return Co({
            aggregator: this.unit.aggregator,
            blockchainService: this.unit.blockchainService,
            ...e,
        });
    }
    deposit(e) {
        return Oo({ ...e, unit: this.unit });
    }
    withdraw(e) {
        return Lo({ ...e, unit: this.unit });
    }
    generateSwapCalldata(e) {
        return vs({ ...e, unit: this.unit });
    }
    swapLimit(e) {
        return Fo({ ...e, unit: this.unit });
    }
    swapMarket(e) {
        return jo({ ...e, unit: this.unit });
    }
};
var zo = {};
ae(zo, { IndexerService: () => Gr, schemas: () => Vo });
var Vo = {};
ae(Vo, {
    PoolV2InfoResponseSchema: () => fa,
    environmentResponseSchema: () => ma,
    getPoolResponseSchema: () => la,
    listAmountResponseSchema: () => Sa,
    listNFTOrderResponseSchema: () => pa,
    listPoolResponseSchema: () => ha,
    listPoolV2ResponseSchema: () => ua,
    listPoolV3ResponseSchema: () => ga,
    testIncrementorSchema: () => Aa,
    veORNInfoResponseSchema: () => ba,
    votingInfoResponseSchema: () => ya,
});
import { z as da } from "zod";
import { ethers as Ns } from "ethers-v6";
import { z as Bs } from "zod";
var _ = Bs.string().refine(Ns.isAddress, (r) => ({
        message: `${r} is not a valid address`,
    })),
    zw = Bs.string().refine(Ns.isHexString, (r) => ({
        message: `${r} is not a valid hex string`,
    }));
import { z as yr } from "zod";
import { ethers as op } from "ethers-v6";
var ip = yr.object({
        blockNumber: yr.number().int().nonnegative(),
        blockHash: yr
            .string()
            .refine((r) => r.length === 0 || op.isHexString(r), {
                message: "blockHash must be a valid hex string or empty",
            }),
        timeRequest: yr.number().int().nonnegative(),
        timeAnswer: yr.number().int().nonnegative(),
        changes: yr.number().int().nonnegative(),
    }),
    X = ip;
var sp = da.object({
        result: da.object({
            chainId: da.number().int().nonnegative(),
            nativeToken: da.string(),
            ORN: _,
            WETH9: _,
            OrionV3Factory: _.optional(),
            OrionV2Factory: _.optional(),
            OrionV3NFTManager: _.optional(),
            SwapRouterV3: _.optional(),
            OrionFarmV3: _.optional(),
            OrionFarmV2: _.optional(),
            OrionVoting: _.optional(),
            veORN: _.optional(),
        }),
        info: X,
    }),
    ma = sp;
import { z as Ls } from "zod";
import { z as oe } from "zod";
var cp = oe.object({
        tokenId: _,
        token0: oe.string().nonempty(),
        token1: oe.string().nonempty(),
        token0Address: _,
        token1Address: _,
        token0Decimals: oe.number().int().nonnegative().max(18),
        token1Decimals: oe.number().int().nonnegative().max(18),
        amount: oe.number().nonnegative(),
        amount0: oe.number().nonnegative(),
        amount1: oe.number().nonnegative(),
        from: oe.number().nonnegative(),
        to: oe.number().nonnegative(),
        fee: oe.number().nonnegative(),
        collectFee: oe.number().nonnegative(),
        reward: oe.number().nonnegative(),
        apr: oe.number().nonnegative(),
        boost: oe.number().int().nonnegative(),
        isStaked: oe.boolean(),
        poolFee: oe.number().nonnegative(),
        poolAddress: _,
        veOrnForMaxBoost: oe.number().nonnegative(),
        veOrnMaxBoost: oe.number().nonnegative(),
        veORNCurrent: oe.number().nonnegative(),
        time: oe.number().int().nonnegative(),
    }),
    Us = cp;
var dp = Ls.object({ result: Ls.array(Us), info: X }),
    pa = dp;
import { z as Jt } from "zod";
import { z as me } from "zod";
var mp = me.object({
        poolAddress: _,
        isInitialized: me.boolean(),
        liquidity: me.number().nonnegative(),
        liquidityInUSD: me.number().nonnegative(),
        liquidityShare: me.number().nonnegative(),
        isFarming: me.boolean(),
        rewardsTotal: me.number().nonnegative(),
        rewardsPerPeriod: me.number().nonnegative(),
        rewardsShare: me.number().nonnegative(),
        feePerPeriod: me.number().nonnegative(),
        feeTotal: me.number().nonnegative(),
        feeShare: me.number().nonnegative(),
        tickMultiplier: me.number().nonnegative(),
        MAX_TICK: me.number().nonnegative().int(),
        minAPR: me.number().nonnegative(),
        maxAPR: me.number().nonnegative(),
        avgAPR: me.number().nonnegative(),
        maxBoost: me.number().nonnegative().int(),
        feeRate: me.array(me.number().nonnegative()),
    }),
    jt = mp;
var pp = Jt.object({
        result: Jt.object({
            token0: Jt.string().nonempty(),
            token1: Jt.string().nonempty(),
            token0Address: _,
            token1Address: _,
            totalLiquidity: Jt.number().nonnegative(),
            WETH9: _,
            pools: Jt.record(Jt.number(), jt.nullable()),
        }),
        info: X,
    }),
    la = pp;
import { z as Ds } from "zod";
import { z as v } from "zod";
var Ho = v.object({
        pair: v.string(),
        token0: v.string().nonempty(),
        token1: v.string().nonempty(),
        name: v.string(),
        name0: v.string(),
        name1: v.string(),
        token0Address: _,
        token1Address: _,
        token0Decimals: v.number().int().nonnegative().max(18),
        token1Decimals: v.number().int().nonnegative().max(18),
        WETH9: _,
        farmAddress: v.string().optional(),
        weight: v.number(),
        liquidity0: v.number(),
        liquidity1: v.number(),
        token0Price: v.number(),
        token1Price: v.number(),
        totalLPSupply: v.number(),
        totalLPStake: v.number(),
        totalLPStakeInUSD: v.number(),
        userLPStaked: v.number(),
        userLPStakedInUSD: v.number(),
        lpPriceInUSD: v.number(),
        lpPriceInORN: v.number(),
        userReward: v.number(),
        weeklyReward: v.number(),
        userAPR: v.number(),
        lockMaxMultiplier: v.number(),
        veornMaxMultiplier: v.number(),
        veornBoostScaleFactor: v.number(),
        lockTimeForMaxMultiplier: v.number(),
        userBoost: v.number(),
        userTimeDeposit: v.number(),
        userLockTimeStart: v.number(),
        userLockTimePeriod: v.number(),
        userVeORN: v.number(),
        userORN: v.number(),
        userRewardToPool: v.number(),
        boostTotalVeORN: v.number(),
        boostCurrentPoolReward: v.number(),
        boostTotalLiquidity: v.number(),
        boostCurrentLiquidity: v.number(),
        boostCurrentVeORN: v.number(),
        boostTotalReward: v.number(),
        ...jt.shape,
        type: v.string().nonempty(),
    }),
    lp = v.object({ result: v.array(Ho), info: X }),
    ua = lp;
import { z as Ue } from "zod";
var Mo = Ue.object({
        token0: Ue.string().nonempty(),
        token1: Ue.string().nonempty(),
        name: Ue.string(),
        name0: Ue.string(),
        name1: Ue.string(),
        token0Address: _,
        token1Address: _,
        token0Decimals: Ue.number().int().nonnegative().max(18),
        token1Decimals: Ue.number().int().nonnegative().max(18),
        WETH9: _,
        poolFee: Ue.number(),
        weeklyReward: Ue.number(),
        weight: Ue.number(),
        totalLPStakeInUSD: Ue.number(),
        ...jt.shape,
        type: Ue.literal("v3"),
    }),
    up = Ue.object({ result: Ue.array(Mo), info: X }),
    ga = up;
var gp = Ds.object({ result: Ds.array(Ho.or(Mo)), info: X }),
    ha = gp;
import { z as P } from "zod";
var hp = P.object({
        pair: P.string(),
        name: P.string(),
        token0: P.string(),
        token1: P.string(),
        name0: P.string(),
        name1: P.string(),
        token0Address: _,
        token1Address: _,
        token0Decimals: P.number().int().nonnegative().max(18),
        token1Decimals: P.number().int().nonnegative().max(18),
        WETH9: P.string(),
        farmAddress: P.string().optional(),
        weight: P.number(),
        liquidity0: P.number(),
        liquidity1: P.number(),
        token0Price: P.number(),
        token1Price: P.number(),
        userLPBalance: P.number(),
        userLPBalanceStr: P.string(),
        totalLPSupply: P.number(),
        totalLPStake: P.number(),
        totalLPStakeInUSD: P.number(),
        userLPStaked: P.number(),
        userLPStakedInUSD: P.number(),
        lpPriceInUSD: P.number(),
        lpPriceInORN: P.number(),
        userReward: P.number(),
        userWeeklyReward: P.number(),
        userRewardToPool: P.number(),
        weeklyReward: P.number(),
        userAPR: P.number(),
        lockMaxMultiplier: P.number(),
        veornMaxMultiplier: P.number(),
        veornBoostScaleFactor: P.number(),
        lockTimeForMaxMultiplier: P.number(),
        userBoost: P.number(),
        userTimeDeposit: P.number(),
        userLockTimeStart: P.number(),
        userLockTimePeriod: P.number(),
        userVeORN: P.number(),
        userORN: P.number(),
        boostTotalVeORN: P.number(),
        boostCurrentPoolReward: P.number(),
        boostTotalLiquidity: P.number(),
        boostCurrentLiquidity: P.number(),
        boostCurrentVeORN: P.number(),
        boostTotalReward: P.number(),
        type: P.literal("v2"),
        ...jt.shape,
    }),
    fp = P.object({ result: hp, info: X }),
    fa = fp;
import { z as Le } from "zod";
var bp = Le.object({
        avgAPR: Le.number(),
        minAPR: Le.number(),
        maxAPR: Le.number(),
        veTokenAddress: _,
        totalORNLocked: Le.number(),
        totalVeORN: Le.number(),
        weeklyReward: Le.number(),
        userAPR: Le.number(),
        userVeORN: Le.number(),
        userORNLocked: Le.number(),
        userLockEndDate: Le.number(),
        userReward: Le.number(),
        userWeeklyReward: Le.number(),
        userMinLockPeriod: Le.number(),
    }),
    Sp = Le.object({ result: bp, info: X }),
    ba = Sp;
import { z as Wo } from "zod";
var yp = Wo.object({ result: Wo.record(Wo.number()), info: X }),
    Sa = yp;
import { z as ee } from "zod";
var Ap = ee.object({
        allVote: ee.number(),
        name: ee.string(),
        poolAddress: ee.string(),
        type: ee.string(),
        userVote: ee.number(),
        token0: ee.string(),
        token1: ee.string(),
        name0: ee.string(),
        name1: ee.string(),
        poolFee: ee.number(),
        userWeight: ee.number(),
        weight: ee.number(),
    }),
    wp = ee.object({
        absoluteVeTokenInVoting: ee.number(),
        pools: ee.array(Ap),
        userVeTokenBalance: ee.number(),
        userVeTokenInVoting: ee.number(),
        veTokenAddress: ee.string(),
        votingAddress: ee.string(),
        weeklyReward: ee.number(),
    }),
    Ip = ee.object({ result: wp, info: X }),
    ya = Ip;
import { z as $s } from "zod";
var xp = $s.object({ result: $s.number().int(), info: X }),
    Aa = xp;
import { fetchWithValidation as st } from "simple-typed-fetch";
import { BigNumber as Qt } from "bignumber.js";
var Gr = class {
    apiUrl;
    chainId;
    get api() {
        return this.apiUrl;
    }
    constructor(e, t) {
        (this.apiUrl = e),
            (this.chainId = t),
            (this.getEnvironment = this.getEnvironment.bind(this)),
            (this.listNFTOrder = this.listNFTOrder.bind(this)),
            (this.getPoolInfo = this.getPoolInfo.bind(this)),
            (this.getListPool = this.getListPool.bind(this)),
            (this.listPoolV2 = this.listPoolV2.bind(this)),
            (this.poolV2Info = this.poolV2Info.bind(this)),
            (this.listPoolV3 = this.listPoolV3.bind(this)),
            (this.veORNInfo = this.veORNInfo.bind(this)),
            (this.listAmount = this.listAmount.bind(this)),
            (this.getAmountByORN = this.getAmountByORN.bind(this)),
            (this.getAmountAt = this.getAmountAt.bind(this)),
            (this.getAmountAtCurrent = this.getAmountAtCurrent.bind(this)),
            (this.getVotingInfo = this.getVotingInfo.bind(this));
    }
    makeRPCPayload = (e) =>
        JSON.stringify({ ...e, chainId: this.chainId, jsonrpc: "1.0" });
    veORNInfo = (e) =>
        st(this.apiUrl, ba, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "veORN",
                method: "info",
                params: [e],
            }),
        });
    getAmountAt = (e, t = Date.now()) => {
        let n = t / 1e3;
        return Qt(e).dividedBy(this.getK(n));
    };
    getAmountAtCurrent = (e) => {
        let t = Date.now() / 1e3;
        return Qt(e).dividedBy(this.getK(t));
    };
    getAmountByORN = (e, t) => {
        let n = 730 / (30 - Math.sqrt(104.28571428571429)) ** 0.3333333333333333,
            a = Qt(t);
        if (a.lte(0)) return Qt(0);
        let o = a.dividedBy(7).sqrt(),
            c = a.dividedBy(n).pow(3);
        return Qt(e).multipliedBy(o.plus(c));
    };
    getVotingInfo = (e) =>
        st(this.apiUrl, ya, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "OrionVoting",
                method: "info",
                params: [e],
            }),
        });
    getEnvironment = () =>
        st(this.apiUrl, ma, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "Environment",
                method: "getEnvironment",
                params: [],
            }),
        });
    listNFTOrder = (e) =>
        st(this.apiUrl, pa, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "OrionV3NFTManager",
                method: "listNFTOrder",
                params: [e],
            }),
        });
    getListPool = (e) =>
        st(this.apiUrl, ha, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "OrionVoting",
                method: "listPool",
                params: [e],
            }),
        });
    getPoolInfo = (e, t, n) =>
        st(this.apiUrl, la, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "OrionV3Factory",
                method: "getPoolInfo",
                params: [e, t, n],
            }),
        });
    listPoolV2 = (e) =>
        st(this.apiUrl, ua, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "OrionFarmV2",
                method: "listPool",
                params: [e],
            }),
        });
    poolV2Info = (e, t, n) =>
        st(this.apiUrl, fa, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "OrionV2Factory",
                method: "getPoolInfo",
                params: [e, t, n],
            }),
        });
    listPoolV3 = (e) =>
        st(this.apiUrl, ga, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "OrionFarmV3",
                method: "listPool",
                params: [e],
            }),
        });
    listAmount = (e) =>
        st(this.apiUrl, Sa, {
            method: "POST",
            body: this.makeRPCPayload({ model: e, method: "listAmount", params: [] }),
        });
    testRetrieve = () =>
        st(this.apiUrl, Aa, {
            method: "POST",
            body: this.makeRPCPayload({
                model: "Incrementer",
                method: "retrieve",
                params: [],
            }),
        });
    getK = (e) => {
        let t = e < 1690848e3 ? 1690848e3 : e,
            n = Qt(t).minus(1690848e3).dividedBy(31536e3);
        return 2 ** Qt(n).multipliedBy(2).toNumber();
    };
};
import "zod";
import { simpleFetch as Pp } from "simple-typed-fetch";
import { ethers as Ep } from "ethers-v6";
import { BigNumber as Tp } from "bignumber.js";
import { ERC20__factory as vp } from "./contracts/lib/ethers-v6/index.js";
var Fs = [
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "info", type: "uint256" },
                    { internalType: "address", name: "makerAsset", type: "address" },
                    { internalType: "address", name: "takerAsset", type: "address" },
                    { internalType: "address", name: "maker", type: "address" },
                    { internalType: "address", name: "allowedSender", type: "address" },
                    { internalType: "uint256", name: "makingAmount", type: "uint256" },
                    { internalType: "uint256", name: "takingAmount", type: "uint256" },
                ],
                internalType: "struct OrderRFQLib.OrderRFQ",
                name: "order",
                type: "tuple",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
            { internalType: "uint256", name: "flagsAndAmount", type: "uint256" },
        ],
        name: "fillOrderRFQ",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
var zr = class {
    unit;
    provider;
    contractAddress;
    constructor(e) {
        (this.unit = e), (this.provider = e.provider), (this.contractAddress = "");
    }
    isInitialized() {
        return this.contractAddress !== "";
    }
    async init() {
        if (this.isInitialized()) return;
        let { orionPMMRouterContractAddress: e } = await Pp(
            this.unit.blockchainService.getPmmInfo,
        )();
        this.contractAddress = e;
    }
    async getContractAddress() {
        return await this.init(), this.contractAddress;
    }
    async setAllowance(e, t, n) {
        await this.init();
        let a = new Tp(t),
            o = await n.getAddress(),
            i = await vp
                .connect(e, this.unit.provider)
                .approve.populateTransaction(this.contractAddress, a.toString()),
            s = await this.provider.getTransactionCount(o, "pending"),
            { gasPrice: d, maxFeePerGas: m } = await this.provider.getFeeData(),
            l = await this.provider.getNetwork();
        d !== null && (i.gasPrice = d),
        m !== null && (i.maxFeePerGas = m),
            (i.chainId = l.chainId),
            (i.nonce = s),
            (i.from = o);
        let p = await this.provider.estimateGas(i);
        i.gasLimit = p;
        let u = await n.signTransaction(i);
        await (await this.provider.broadcastTransaction(u)).wait();
    }
    async fillRFQOrder(e, t) {
        if ((await this.init(), !e.success)) throw Error("Invalid order provided");
        return new Ep.Contract(this.contractAddress, Fs, t).fillOrderRFQ(
            e.order,
            e.signature,
            BigInt(0),
        );
    }
};
var Ar = class {
    networkCode;
    chainId;
    provider;
    blockchainService;
    indexer;
    aggregator;
    pmm;
    priceFeed;
    exchange;
    config;
    contracts;
    logger;
    constructor(e, t) {
        if (((this.logger = t), "env" in e)) {
            let o = ot[e.env];
            if (!o)
                throw new Error(
                    `Invalid environment: ${e.env}. Available environments: ${Object.keys(ot).join(", ")}`,
                );
            let c = qe[e.chainId];
            if (!c)
                throw new Error(
                    `Invalid chainId: ${e.chainId}. Available chainIds: ${Object.keys(qe).join(", ")}`,
                );
            let i = o.networks[e.chainId];
            if (!i)
                throw new Error(
                    `Invalid chainId: ${e.chainId}. Available chainIds: ${Object.keys(o.networks).join(", ")}`,
                );
            this.config = {
                chainId: e.chainId,
                nodeJsonRpc: i.rpc ?? c.rpc,
                services: {
                    blockchainService: { http: i.api + i.services.blockchain.http },
                    aggregator: {
                        http: i.api + i.services.aggregator.http,
                        ws: i.api + i.services.aggregator.ws,
                    },
                    priceFeed: { api: i.api + i.services.priceFeed.all },
                    indexer: { api: i.api + i.services.indexer?.http },
                },
            };
        } else this.config = e;
        let n = qe[e.chainId];
        if (!n) throw new Error("Chain info is required");
        (this.chainId = e.chainId),
            (this.networkCode = n.code),
            (this.contracts = n.contracts);
        let a = parseInt(this.chainId, 10);
        if (Number.isNaN(a))
            throw new Error("Invalid chainId (not a number)" + this.chainId);
        (this.provider = new kp(this.config.nodeJsonRpc, a)),
            (this.provider.pollingInterval = 1e3),
            (this.blockchainService = new $r(
                this.config.services.blockchainService.http,
                this.config.basicAuth,
            )),
            (this.indexer = this.config.services.indexer
                ? new Gr(this.config.services.indexer.api, a)
                : void 0),
            (this.aggregator = new Br(
                this.config.services.aggregator.http,
                this.config.services.aggregator.ws,
                this.config.basicAuth,
                t,
            )),
            (this.priceFeed = new Mr(
                this.config.services.priceFeed.api,
                this.config.basicAuth,
            )),
            (this.exchange = new Vr(this)),
            (this.pmm = new zr(this));
    }
};
import { merge as el } from "merge-anything";
var Yo = {};
ae(Yo, { ReferralSystem: () => Jr, schemas: () => Qo });
import { z as Wp } from "zod";
import { fetchWithValidation as ye } from "simple-typed-fetch";
var Qo = {};
ae(Qo, {
    aggregatedHistorySchema: () => ka,
    allTimeLeadersSchema: () => Ra,
    claimInfoSchema: () => va,
    contractsAddressesSchema: () => Oa,
    distinctAnalyticsSchema: () => wa,
    errorSchema: () => nt,
    globalAnalyticsSchema: () => Ta,
    inviteCodeLinkSchema: () => Kr,
    linkSchema: () => Yt,
    miniStatsSchema: () => Ia,
    ratingSchema: () => qr,
    rewardsClaimedSchema: () => Ea,
    rewardsMappingSchema: () => xa,
});
import { z as qo } from "zod";
var Op = qo.object({ status: qo.string(), referer: qo.string() }),
    Yt = Op;
import { z as J } from "zod";
var Rp = J.object({
        referer: J.string(),
        refs_info: J.record(
            J.string(),
            J.object({
                referral_address: J.string(),
                referral_earned_fees: J.number(),
                referer_earned_fees: J.number(),
                relative_ref_level: J.number(),
                reward_record_hash: J.string(),
                timestamp: J.number(),
                latest_timestamp: J.number(),
                latest_block: J.number(),
            }),
        ),
        total_sent_to_governance: J.number(),
        total_earned: J.number(),
        total_volume: J.number(),
        total_trades: J.number(),
        all_time_earnings_boost_only: J.number(),
        all_time_earnings_boost_only_usd: J.number(),
        all_time_earnings: J.number(),
        all_time_earnings_usd: J.number(),
        all_weekly_earnings: J.number(),
        all_weekly_earnings_usd: J.number(),
    }),
    wa = Rp;
import { z as Ko } from "zod";
var Cp = Ko.object({ status: Ko.string(), message: Ko.string() }),
    nt = Cp;
import { z as Zt } from "zod";
var _p = Zt.object({
        earned_on_referrals_token: Zt.number(),
        earned_on_referrals_usd: Zt.number(),
        token_usd: Zt.number(),
        registered_via_link_count: Zt.number(),
        earned_in_a_week_token: Zt.number(),
        earned_in_a_week_usd: Zt.number(),
    }),
    Ia = _p;
import { z as j } from "zod";
var Np = j.object({
        data: j.array(
            j.object({
                distribution: j.object({
                    dist: j.object({
                        underlying_token: j.number(),
                        referers_list: j.array(j.number()),
                    }),
                    address_to_reward_mapping: j.record(j.string(), j.number()),
                    ref_offset_to_rewarded_actors: j.record(j.string(), j.string()),
                    governance_reward_only: j.number(),
                    total_reward: j.number(),
                    trade_initiator: j.string(),
                }),
                timestamp_ms: j.number(),
                block_height: j.number(),
                tx_hash: j.string(),
                price_feed_meta_info: j
                    .record(j.string(), j.record(j.string(), j.number()))
                    .nullable(),
            }),
        ),
        pagination_info: j.object({
            c_page: j.number().int().nonnegative(),
            t_pages: j.number().int().nonnegative(),
        }),
    }),
    xa = Np;
import { z as Pa } from "zod";
var Bp = Pa.object({
        referer: Pa.string(),
        amount: Pa.string(),
        signature: Pa.string(),
    }),
    Ea = Bp;
import { z as bt } from "zod";
var Up = bt.object({
        ref_to_rewards: bt.record(bt.string(), bt.number()),
        total_earned_by_refs: bt.number(),
        total_sent_to_governance: bt.number(),
        reward_dist_count_in_general: bt.record(bt.string(), bt.number()),
        total_ref_system_actors: bt.number(),
    }),
    Ta = Up;
import { z as O } from "zod";
var Lp = O.object({
        info: O.object({
            weekly_boost_budget: O.string(),
            weekly_boost_budget_fmt: O.number(),
            monthly_boost_budget: O.string(),
            monthly_boost_budget_fmt: O.number(),
            displayed_boost_budget_fmt: O.number(),
            time_left_for_the_reward: O.number(),
            time_left_for_the_reward_local: O.string(),
            time_left_for_the_reward_utc: O.string(),
            personal_info: O.object({
                rank_id: O.number(),
                wallet: O.string(),
                staked_ve_token: O.string(),
                staked_ve_token_fmt: O.number(),
                staked_ve_token_weight: O.string(),
                staked_ve_token_weight_fmt: O.number(),
                weighted_volume: O.string(),
                weighted_volume_fmt: O.number(),
                total_weight: O.string(),
                total_weight_fmt: O.number(),
                reward: O.string(),
                reward_fmt: O.number(),
            }).nullable(),
        }),
        list: O.array(
            O.object({
                rank_id: O.number(),
                wallet: O.string(),
                staked_ve_token: O.string(),
                staked_ve_token_fmt: O.number(),
                staked_ve_token_weight: O.string(),
                staked_ve_token_weight_fmt: O.number(),
                weighted_volume: O.string(),
                weighted_volume_fmt: O.number(),
                total_weight: O.string(),
                total_weight_fmt: O.number(),
                total_volume_fmt: O.number(),
                weekly_earnings_fmt: O.number(),
                total_earnings_fmt: O.number(),
                referrals_count_fmt: O.number(),
                total_trades_fmt: O.number(),
                reward: O.string(),
                reward_fmt: O.number(),
            }),
        ),
    }),
    qr = Lp;
import { z as te } from "zod";
var Dp = te.object({
        global: te.object({
            total_non_accrued: te.number(),
            total_non_accrued_token: te.number(),
            total_non_accrued_usd: te.number(),
        }),
        chain_to_reward_info: te.record(
            te.string(),
            te.object({
                total_accrued: te.number(),
                total_accrued_token: te.number(),
                total_accrued_usd: te.number(),
                total_non_accrued: te.number(),
                total_non_accrued_token: te.number(),
                total_non_accrued_usd: te.number(),
                total_earned: te.number(),
            }),
        ),
        mini_stats: te.object({
            earned_on_referrals_token: te.number(),
            earned_on_referrals_usd: te.number(),
            token_usd: te.number(),
            registered_via_link_count: te.number(),
            earned_in_a_week_token: te.number(),
            earned_in_a_week_usd: te.number(),
        }),
    }),
    va = Dp;
import { z as be } from "zod";
var $p = be.object({
        data: be.array(
            be.object({
                history_type: be.string(),
                chain_type: be.string(),
                chain_comp: be.string(),
                chain_id: be.number(),
                date_unix: be.number(),
                date_time_local: be.string(),
                date_time_utc: be.string(),
                amount_token: be.string(),
                amount_token_fmt: be.number(),
                amount_usd: be.string(),
                amount_usd_fmt: be.number(),
                token_price: be.string(),
                token_price_fmt: be.number(),
            }),
        ),
        pagination_info: be.object({ c_page: be.number(), t_pages: be.number() }),
    }),
    ka = $p;
import { z as Jo } from "zod";
import { ethers as Fp } from "ethers-v6";
var jp = Jo.record(Jo.nativeEnum(Ge), Jo.string().refine(Fp.isAddress)),
    Oa = jp;
import { z as ct } from "zod";
var Hp = ct.object({
        link: ct.object({ referer: ct.string(), ref_link: ct.string() }).nullable(),
        invite: ct
            .object({
                code: ct.string(),
                data: ct.null(),
                limits: ct.object({
                    tag: ct.string(),
                    max_invites: ct.number(),
                    max_ref_depth: ct.number(),
                }),
            })
            .nullable(),
    }),
    Kr = Hp;
import { z as Xt } from "zod";
var Mp = Xt.array(
        Xt.object({
            wallet: Xt.string(),
            total_earnings_fmt: Xt.number(),
            referrals_count_fmt: Xt.number(),
            total_trades_fmt: Xt.number(),
            weekly_earnings_fmt: Xt.number(),
        }),
    ),
    Ra = Mp;
var Jr = class {
    apiUrl;
    get api() {
        return this.apiUrl;
    }
    constructor(e) {
        (this.apiUrl = e),
            (this.getLink = this.getLink.bind(this)),
            (this.getDistinctAnalytics = this.getDistinctAnalytics.bind(this)),
            (this.createReferralLink = this.createReferralLink.bind(this)),
            (this.subscribeToReferral = this.subscribeToReferral.bind(this)),
            (this.getMyReferral = this.getMyReferral.bind(this)),
            (this.getMyInviteCodeAndLink = this.getMyInviteCodeAndLink.bind(this)),
            (this.submitInviteCodeWithLink =
                this.submitInviteCodeWithLink.bind(this)),
            (this.getGlobalAnalytics = this.getGlobalAnalytics.bind(this)),
            (this.getMiniStats = this.getMiniStats.bind(this)),
            (this.getRewardsMapping = this.getRewardsMapping.bind(this)),
            (this.claimRewards = this.claimRewards.bind(this)),
            (this.getLeaderboard = this.getLeaderboard.bind(this)),
            (this.getLeaderboardSingleChain =
                this.getLeaderboardSingleChain.bind(this)),
            (this.getAllTimeLeaders = this.getAllTimeLeaders.bind(this)),
            (this.getContractsAddresses = this.getContractsAddresses.bind(this)),
            (this.getClaimInfo = this.getClaimInfo.bind(this)),
            (this.getAggregatedHistory = this.getAggregatedHistory.bind(this)),
            (this.submitTransactionDataForWidget =
                this.submitTransactionDataForWidget.bind(this));
    }
    getLink = (e) =>
        ye(`${this.apiUrl}/referer/view/link`, Yt, {
            headers: { "referer-address": e },
        });
    getMyReferral = (e) =>
        ye(`${this.apiUrl}/referral/view/link`, Yt, { headers: { referral: e } });
    getMyInviteCodeAndLink = (e, t = !1) =>
        ye(
            `${this.apiUrl}/referer/invite/status2?suppress_error=${Number(t)}`,
            Kr,
            { headers: { "referer-address": e } },
        );
    submitInviteCodeWithLink = ({ inviteCode: e, referer: t }) =>
        ye(`${this.apiUrl}/referer/invite/submit-code2`, Kr, {
            headers: { "Content-type": "application/json", "invite-code": e },
            method: "POST",
            body: JSON.stringify({ referer: t }),
        });
    getDistinctAnalytics = (e) =>
        ye(
            `${this.apiUrl}/referer/view/distinct-analytics`,
            wa,
            { headers: { "referer-address": e } },
            nt,
        );
    getGlobalAnalytics = () =>
        ye(`${this.apiUrl}/referer/view/global-analytics`, Ta);
    getMiniStats = (e) =>
        ye(
            `${this.apiUrl}/referer/view/mini-latest-stats`,
            Ia,
            { headers: { "referer-address": e } },
            nt,
        );
    getRewardsMapping = (e, t = 1, n = 10) =>
        ye(
            `${this.apiUrl}/referer/view/rewards-mapping?n_per_page=${n}&page=${t}`,
            xa,
            { headers: { referral: e } },
        );
    claimRewards = (e, t) =>
        ye(`${this.apiUrl}/referer/governance/claim-rewards`, Ea, {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({ payload: e, signature: t }),
        });
    createReferralLink = (e) =>
        ye(`${this.apiUrl}/referer/create2`, Yt, {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify(e),
        });
    subscribeToReferral = (e) =>
        ye(
            `${this.apiUrl}/referer/subscribe2`,
            Yt,
            {
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify(e),
            },
            nt,
        );
    getLeaderboard = (e) =>
        ye(
            `${this.apiUrl}/referer/ve/rating-table-leaderboard?tag=aggregated`,
            qr,
            { headers: e !== void 0 ? { "referer-address": e } : {} },
            nt,
        );
    getLeaderboardSingleChain = (e, t) =>
        ye(
            `${this.apiUrl}/referer/ve/rating-table-leaderboard?chain_id=${t}`,
            qr,
            { headers: e !== void 0 ? { "referer-address": e } : {} },
            nt,
        );
    getAllTimeLeaders = (e) =>
        ye(
            `${this.apiUrl}/referer/ve/leaderboard-lifetime`,
            Ra,
            { headers: e !== void 0 ? { "referer-address": e } : {} },
            nt,
        );
    getContractsAddresses = () =>
        ye(`${this.apiUrl}/referer/view/contracts`, Oa, void 0, nt);
    getClaimInfo = (e) =>
        ye(
            `${this.apiUrl}/referer/view/claim-info-with-stats?&suppress_error=1`,
            va,
            { headers: { "referer-address": e } },
            nt,
        );
    getAggregatedHistory = (e, t, n, a, o) => {
        let c = { n_per_page: a, page: o, suppress_error: 1 };
        t !== void 0 && (c.chain_id = t),
        n !== void 0 && (c.history_filter = encodeURIComponent(n.join(",")));
        let i = Object.entries(c)
            .map(([s, d]) => `${s}=${d}`)
            .join("&");
        return ye(
            `${this.apiUrl}/referer/view/aggregated-history?${i}`,
            ka,
            { headers: { "referer-address": e } },
            nt,
        );
    };
    submitTransactionDataForWidget = (e) =>
        ye(`${this.apiUrl}/referer/widget/submit`, Wp.unknown(), {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify(e),
        });
};
import { simpleFetch as Vs } from "simple-typed-fetch";
import { ethers as Kp } from "ethers-v6";
import { ethers as Vp } from "ethers-v6";
import { simpleFetch as Zo } from "simple-typed-fetch";
import Gp from "bson-objectid";
var zp = Gp,
    qp = async (r, e, t = 1e3) => {
        if (!Vp.isAddress(e)) throw new Error(`Invalid address: ${e}`);
        let n = await Promise.all(
                r.map(async ({ blockchainService: s, aggregator: d, chainId: m }) => {
                    let l = await Zo(s.getSourceAtomicSwapHistory)({
                            limit: t,
                            sender: e,
                        }),
                        p = await Zo(s.getTargetAtomicSwapHistory)({
                            limit: t,
                            receiver: e,
                        }),
                        u = await Zo(d.getHistoryAtomicSwaps)(e, t),
                        S = l.data.reduce((b, g) => {
                            let { secretHash: y } = g,
                                C = y.toLowerCase();
                            return (b[C] = { ...g, sourceChainId: m }), b;
                        }, {}),
                        f = p.data.reduce((b, g) => {
                            let { secretHash: y } = g,
                                C = y.toLowerCase();
                            return (b[C] = { ...g, targetChainId: m }), b;
                        }, {}),
                        h = u.reduce((b, g) => {
                            let { secretHash: y } = g.lockOrder,
                                C = y.toLowerCase();
                            return (b[C] = { ...g, chainId: m }), b;
                        }, {});
                    return {
                        sourceNetworkHistory: S,
                        targetNetworkHistory: f,
                        network: m,
                        aggregatorHistoryAtomicSwaps: h,
                    };
                }),
            ),
            a = n.reduce((s, d) => {
                let { sourceNetworkHistory: m } = d;
                return { ...s, ...m };
            }, {}),
            o = n.reduce((s, d) => {
                let { targetNetworkHistory: m } = d;
                return { ...s, ...m };
            }, {}),
            c = n.reduce((s, d) => {
                let { aggregatorHistoryAtomicSwaps: m } = d;
                return { ...s, ...m };
            }, {});
        return Object.entries(a).reduce((s, [d, m]) => {
            if (m === void 0)
                throw new Error(`Item is undefined for secretHash: ${d}`);
            let l = o[d],
                p = c[d],
                u = m.targetChainId.toString();
            if (!Ut(u)) throw new Error(`Invalid targetChainId: ${u}`);
            let f = {
                creationDate: zp(m._id).getTimestamp(),
                sourceChainId: m.sourceChainId,
                targetChainId: l?.targetChainId ?? u,
                used: m.used,
                claimed: m.claimed,
                isAggApplied: m.isAggApplied,
                asset: m.asset,
                sender: m.sender,
                secretHash: d,
                receiver: m.receiver ?? l?.receiver,
                secret: m.secret ?? l?.secret,
                timestamp: { ...m.timestamp, ...l?.timestamp },
                expiration: { ...m.expiration, ...l?.expiration },
                transactions: { ...m.transactions, ...l?.transactions },
                amountToReceive: m.amountToReceive,
                amountToSpend: m.amountToSpend,
                status: { source: m.state, target: l?.state, aggregator: p?.status },
                lockOrder: p?.lockOrder,
                redeemOrder: p?.redeemOrder,
            };
            return (s[d] = f), s;
        }, {});
    },
    js = qp;
import { BigNumber as Qr } from "bignumber.js";
import { ethers as er } from "ethers-v6";
import { Exchange__factory as Hs } from "./contracts/lib/ethers-v6/index.js";
import { simpleFetch as Yr } from "simple-typed-fetch";
async function Xo({
                      amount: r,
                      assetName: e,
                      sourceChain: t,
                      targetChain: n,
                      signer: a,
                      options: o,
                      unitsArray: c,
                  }) {
    let i = Date.now();
    if (r === "") throw new Error("Amount can not be empty");
    if (e === "") throw new Error("AssetIn can not be empty");
    let s = new Qr(r);
    if (s.isNaN()) throw new Error(`Amount '${s.toString()}' is not a number`);
    if (s.lte(0))
        throw new Error(`Amount '${s.toString()}' should be greater than 0`);
    let d = c.find(({ chainId: V }) => V === t),
        m = c.find(({ chainId: V }) => V === n);
    if (d === void 0) throw new Error(`Source chain '${t}' not found`);
    if (m === void 0) throw new Error(`Target chain '${n}' not found`);
    let { blockchainService: l, aggregator: p, provider: u, chainId: S } = d,
        { aggregator: f, blockchainService: h, provider: b } = m,
        g = await Yr(l.getAtomicSwapAssets)(),
        y = await Yr(h.getAtomicSwapAssets)(),
        C = g.filter((V) => y.includes(V));
    if (!g.includes(e) || !y.includes(e))
        throw new Error(
            `Asset '${e}' not available for swap between ${t} and ${n} chains. Available assets: ${C.join(", ")}`,
        );
    let N = await new Promise((V, ke) => {
            let lt = setTimeout(() => {
                    ke(new Error("Can't get brokers balances. Timeout"));
                }, 1e4),
                Ct = f.ws.subscribe("btasabus", {
                    callback: (Ve) => {
                        f.ws.unsubscribe(Ct), f.ws.destroy(), clearTimeout(lt), V(Ve);
                    },
                });
        }),
        U = await a.getAddress();
    o?.logger?.(`Wallet address is ${U}`);
    let D = N[e];
    if (D === void 0)
        throw new Error(`Asset '${e}' not found in brokers balances`);
    if (D === 0) throw new Error(`Asset '${e}' is not available for swap`);
    let { exchangeContractAddress: $, assetToAddress: W } = await Yr(l.getInfo)(),
        ie = Ne(W),
        Ae = Hs.connect($, u),
        Ce = W[e];
    if (Ce === void 0) throw new Error(`Asset '${e}' not found in source chain`);
    let { exchangeContractAddress: F, assetToAddress: Q } = await Yr(h.getInfo)(),
        dt = Q[e];
    if (dt === void 0) throw new Error(`Asset '${e}' not found in target chain`);
    let re = Ne(Q),
        A = Hs.connect(F, b),
        Qe = await it({ [e]: Ce, [ie]: er.ZeroAddress }, p, U, Ae, u),
        wr = await it({ [e]: dt, [re]: er.ZeroAddress }, f, U, A, b),
        we = new Me(Qe, { name: ie, address: er.ZeroAddress }, u, a, o?.logger),
        xe = new Me(wr, { name: re, address: er.ZeroAddress }, b, a, o?.logger);
    we.registerRequirement({
        reason: "Amount",
        asset: { name: e, address: Ce },
        amount: s.toString(),
        spenderAddress: $,
        sources: Be("amount", Ce, "pool"),
    });
    let pe = K(r, 8, Qr.ROUND_FLOOR),
        We = cr(),
        St = er.keccak256(We);
    o?.logger?.(`Secret is ${We}`), o?.logger?.(`Secret hash is ${St}`);
    let kt = 60 * 60 * 24,
        Ye = 4,
        mt = BigInt(Date.now() + kt * Ye * 1e3),
        De = await Ae.lockAtomic.populateTransaction({
            amount: pe,
            asset: Ce,
            expiration: mt,
            secretHash: St,
            sender: U,
            targetChainId: BigInt(n),
        }),
        yt,
        Pe = await d.provider.getFeeData();
    if (Pe.gasPrice !== null) (De.gasPrice = Pe.gasPrice), (yt = Pe.gasPrice);
    else if (Pe.maxFeePerGas !== null && Pe.maxPriorityFeePerGas !== null)
        (De.maxFeePerGas = Pe.maxFeePerGas),
            (De.maxPriorityFeePerGas = Pe.maxPriorityFeePerGas),
            (yt = Pe.maxFeePerGas);
    else throw new Error("Can't get gas price");
    (De.chainId = BigInt(S)), (De.from = U);
    let pt = new Qr(0),
        $e = Qe[e]?.exchange;
    if ($e === void 0)
        throw new Error(`Asset '${e}' exchange balance is not found`);
    e === ie && s.gt($e) && (pt = s.minus($e)),
        (De.value = K(pt.dp(8, Qr.ROUND_CEIL), 18, Qr.ROUND_CEIL)),
        (De.gasLimit = BigInt(2e5));
    let Ot = BigInt(2e5) * yt,
        tr = H(Ot, BigInt(18));
    we.registerRequirement({
        reason: "Network fee",
        asset: { name: ie, address: er.ZeroAddress },
        amount: tr.toString(),
        sources: ["wallet"],
    }),
        await we.check(o?.autoApprove);
    let Ht = await u.getTransactionCount(U, "pending");
    (De.nonce = Ht), o?.logger?.("Signing lock tx transaction...");
    let rr = await a.signTransaction(De),
        Mt = await d.provider.broadcastTransaction(rr);
    o?.logger?.(
        `Lock tx sent. Tx hash: ${Mt.hash}. Waiting for tx to be mined...`,
    ),
        await Mt.wait(),
        o?.logger?.("Lock tx mined."),
        o?.logger?.("Placing atomic swap...");
    let At = await new Promise((V, ke) => {
        let lt = () =>
                Yr(f.placeAtomicSwap)(St, gt(d.networkCode))
                    .then((Ze) => {
                        clearInterval(Ct), clearTimeout(Ve), V(Ze);
                    })
                    .catch(console.error),
            Ct = setInterval(() => {
                lt().catch(console.error);
            }, 2e3),
            Ve = setTimeout(
                () => {
                    clearInterval(Ct), ke(new Error("Atomic swap placing timeout"));
                },
                1e3 * 60 * 5,
            );
    });
    o?.logger?.("Atomic swap placed.");
    let Ee = await A.redeemAtomic.populateTransaction(
            {
                amount: pe,
                asset: dt,
                claimReceiver: At.redeemOrder.claimReceiver,
                expiration: At.redeemOrder.expiration,
                receiver: At.redeemOrder.receiver,
                secretHash: At.redeemOrder.secretHash,
                sender: At.redeemOrder.sender,
                signature: At.redeemOrder.signature,
            },
            We,
        ),
        Te,
        ne = await m.provider.getFeeData();
    if (ne.gasPrice !== null) (Ee.gasPrice = ne.gasPrice), (Te = ne.gasPrice);
    else if (ne.maxFeePerGas !== null && ne.maxPriorityFeePerGas !== null)
        (Ee.maxFeePerGas = ne.maxFeePerGas),
            (Ee.maxPriorityFeePerGas = ne.maxPriorityFeePerGas),
            (Te = ne.maxFeePerGas);
    else throw new Error("Can't get gas price");
    (Ee.chainId = BigInt(parseInt(n, 10))),
        (Ee.from = U),
        (Ee.gasLimit = BigInt(2e5));
    let at = BigInt(2e5) * Te,
        _e = H(at, BigInt(18));
    xe.registerRequirement({
        reason: "Network fee",
        asset: { name: re, address: er.ZeroAddress },
        amount: _e.toString(),
        sources: ["wallet"],
    }),
        await xe.check(o?.autoApprove),
        (Ee.nonce = await b.getTransactionCount(U, "pending")),
        o?.logger?.("Signing redeem tx transaction...");
    let ve = await a.signTransaction(Ee),
        Rt = await m.provider.broadcastTransaction(ve);
    if (
        (o?.logger?.(
            `Redeem tx sent. Tx hash: ${Rt.hash}. Waiting for tx to be mined...`,
        ),
            await Rt.wait(),
            o?.logger?.("Redeem tx mined."),
            o?.logger?.("Atomic swap completed."),
        o?.withdrawToWallet !== void 0 && o.withdrawToWallet)
    ) {
        o.logger?.("Withdrawing to wallet...");
        let V = await A.withdraw.populateTransaction(dt, pe);
        if (ne.gasPrice !== null) (V.gasPrice = ne.gasPrice), (Te = ne.gasPrice);
        else if (ne.maxFeePerGas !== null && ne.maxPriorityFeePerGas !== null)
            (V.maxFeePerGas = ne.maxFeePerGas),
                (V.maxPriorityFeePerGas = ne.maxPriorityFeePerGas),
                (Te = ne.maxFeePerGas);
        else throw new Error("Can't get gas price");
        (V.chainId = BigInt(parseInt(n, 10))),
            (V.gasLimit = BigInt(15e4)),
            (V.from = U),
            (V.nonce = await b.getTransactionCount(U, "pending"));
        let ke = await a.signTransaction(V),
            lt = await b.broadcastTransaction(ke);
        o.logger?.(
            `Withdraw tx sent. Tx hash: ${lt.hash}. Waiting for tx to be mined...`,
        ),
            await lt.wait(),
            o.logger?.("Withdraw tx mined.");
    }
    o?.logger?.(`Total processing time: ${Date.now() - i} ms`);
}
import { BigNumber as Jp } from "bignumber.js";
import { isPresent as Qp } from "ts-is-present";
function Zr(r, e) {
    if (!r)
        throw typeof e > "u"
            ? new Error("Invariant failed")
            : typeof e == "string"
                ? new Error(e)
                : new Error(e(r));
}
import { simpleFetch as Yp } from "simple-typed-fetch";
var Zp = 60 * 60 * 24,
    Xp = 4,
    Xr = class {
        constructor(e) {
            this.unitsArray = e;
        }
        EXTERNAL_ATOMICS_DATA_CACHE_TIME_MS = 5 * 1e3;
        externalAtomicSwaps = {};
        ADDRESS_TO_ASSET_CACHE_TIME_MS = 5 * 60 * 1e3;
        addressToAsset = { lastUpdate: 0, data: {} };
        registerRedeemOrder(e, t) {
            let n = this.externalAtomicSwaps[t.sender],
                a = this.externalAtomicSwaps[t.receiver];
            if (n !== void 0) {
                let o = n.data[e];
                o !== void 0 && (o.redeemOrder = t);
            }
            if (a !== void 0) {
                let o = a.data[e];
                o !== void 0 && (o.redeemOrder = t);
            }
        }
        async getCombinedAddressToAsset() {
            let { lastUpdate: e, data: t } = this.addressToAsset;
            if (!(e + this.EXTERNAL_ATOMICS_DATA_CACHE_TIME_MS < Date.now()))
                return t;
            let a = {};
            return (
                await Promise.all(
                    this.unitsArray.map(async (o) => {
                        let { blockchainService: c, chainId: i } = o,
                            { assetToAddress: s } = await Yp(c.getInfo)();
                        Object.entries(s).forEach(([d, m]) => {
                            if (m !== void 0) {
                                let l = a[m];
                                l !== void 0 ? (l[i] = d) : (a[m] = { [i]: d });
                            }
                        });
                    }),
                ),
                    (this.addressToAsset = { lastUpdate: Date.now(), data: a }),
                    a
            );
        }
        async combineLocalAndExternalData(e, t, n) {
            let a = new Map(),
                o = new Map();
            n.forEach((d) => {
                if ((d.hash !== void 0 && a.set(d.hash, d), d.payload)) {
                    let { type: m, data: l } = d.payload;
                    if (
                        m === "BRIDGE_LOCK" ||
                        m === "BRIDGE_REDEEM" ||
                        m === "BRIDGE_REFUND"
                    ) {
                        let p = o.get(l.secretHash);
                        o.set(l.secretHash, {
                            ...p,
                            lockTx: m === "BRIDGE_LOCK" ? d : p?.lockTx,
                            redeemTx: m === "BRIDGE_REDEEM" ? d : p?.redeemTx,
                            refundTx: m === "BRIDGE_REFUND" ? d : p?.refundTx,
                        });
                    }
                }
            });
            let c = await this.getHistory(e),
                i = await this.getCombinedAddressToAsset(),
                s = new Map();
            return (
                Object.values(c)
                    .filter(Qp)
                    .forEach((d) => {
                        let { lock: m, redeem: l, refund: p } = d.transactions ?? {},
                            u = m !== void 0 ? { hash: m, status: "settled" } : void 0,
                            S = l !== void 0 ? { hash: l, status: "settled" } : void 0,
                            f = p !== void 0 ? { hash: p, status: "settled" } : void 0,
                            h = !1;
                        d.redeemOrder && Date.now() > d.redeemOrder.expiration && (h = !0);
                        let b = i[d.asset]?.[d.sourceChainId],
                            g = d.amountToReceive ?? d.amountToSpend;
                        Zr(d.expiration?.lock, "Lock expiration must be defined"),
                            s.set(d.secretHash, {
                                ...d,
                                walletAddress: d.sender,
                                creationDate: d.creationDate.getTime(),
                                assetName: b,
                                lockTx: u,
                                amount: g !== void 0 ? g.toString() : void 0,
                                redeemTx: S,
                                refundTx: f,
                                lockExpiration: d.expiration.lock,
                                redeemExpired: h,
                            });
                    }),
                    t.forEach((d) => {
                        let m = s.get(d.secretHash),
                            {
                                liquidityMigrationTxHash: l,
                                redeemSettlement: p,
                                secretHash: u,
                            } = d,
                            S = o.get(u),
                            f;
                        p &&
                        (p.type === "own_tx"
                            ? (f = S?.redeemTx)
                            : p.result
                                ? (f = {
                                    status: p.result.value === "success" ? "settled" : "failed",
                                })
                                : p.requestedAt !== void 0 && (f = { status: "pending" }));
                        let h = l !== void 0 ? a.get(l) : void 0,
                            b =
                                d.amount !== void 0
                                    ? new Jp(d.amount).div(10 ** 8).toString()
                                    : void 0;
                        m
                            ? s.set(d.secretHash, {
                                ...m,
                                ...d,
                                lockExpiration: m.lockExpiration,
                                targetChainId: m.targetChainId,
                                sourceChainId: m.sourceChainId,
                                amount: m.amount ?? b,
                                lockTx: m.lockTx ?? S?.lockTx,
                                redeemTx: m.redeemTx ?? f,
                                refundTx: m.refundTx ?? S?.refundTx,
                                liquidityMigrationTx: m.liquidityMigrationTx ?? h,
                            })
                            : (Zr(d.targetChainId, "Target chain id is not defined"),
                                Zr(d.sourceChainId, "Source chain id is not defined"),
                                Zr(d.lockExpiration, "Lock expiration is not defined"),
                                s.set(d.secretHash, {
                                    ...d,
                                    sourceChainId: d.sourceChainId,
                                    targetChainId: d.targetChainId,
                                    lockExpiration: d.lockExpiration,
                                    lockTx: S?.lockTx,
                                    redeemTx: f,
                                    refundTx: S?.refundTx,
                                    liquidityMigrationTx: h,
                                }));
                    }),
                    s
            );
        }
        makeAtomicSwap(e, t, n, a, o, c) {
            let i = cr(),
                s = Kp.keccak256(i),
                d = Date.now() + Zp * Xp * 1e3;
            return {
                sourceChainId: t,
                targetChainId: n,
                amount: a,
                walletAddress: e,
                secret: i,
                secretHash: s,
                assetName: o,
                creationDate: Date.now(),
                lockExpiration: d,
                env: c,
            };
        }
        async getHistory(e, t = 1e3) {
            let n = this.externalAtomicSwaps[e],
                a;
            return (
                n !== void 0 &&
                (n.lastUpdate + this.EXTERNAL_ATOMICS_DATA_CACHE_TIME_MS <
                    Date.now() ||
                    (a = n.data)),
                a === void 0 &&
                ((a = await js(this.unitsArray, e, t)),
                    (this.externalAtomicSwaps[e] = { lastUpdate: Date.now(), data: a })),
                    a
            );
        }
        swap(e, t, n, a, o, c) {
            return Xo({
                amount: t,
                assetName: e,
                sourceChain: n,
                targetChain: a,
                signer: o,
                unitsArray: this.unitsArray,
                options: c,
            });
        }
    };
var ti = {};
ae(ti, { Frontage: () => en, schemas: () => ei });
import { fetchWithValidation as Ws } from "simple-typed-fetch";
var ei = {};
ae(ei, { tickerSchema: () => Ms, tickersSchema: () => Ca });
import { z as vt } from "zod";
var Ms = vt.object({
        pair: vt.string(),
        volume24: vt.number(),
        change24: vt.number(),
        lastPrice: vt.number(),
        pricePrecision: vt.number(),
        networks: vt.array(vt.nativeEnum(Ge)),
    }),
    Ca = vt.array(Ms);
var en = class {
    apiUrl;
    constructor(e) {
        this.apiUrl = e;
    }
    searchTickers = ({
                         searchValue: e,
                         currentNetwork: t,
                         targetNetwork: n,
                         sortBy: a,
                         sortType: o,
                         offset: c,
                         limit: i,
                     }) => {
        let s = new URL(this.apiUrl),
            d = new URLSearchParams();
        return (
            d.set("searchValue", encodeURIComponent(e)),
            t !== void 0 &&
            d.set("currentNetwork", encodeURIComponent(t).toUpperCase()),
            n !== void 0 &&
            d.set("targetNetwork", encodeURIComponent(n).toUpperCase()),
            a !== void 0 && d.set("sortBy", encodeURIComponent(a)),
            o !== void 0 && d.set("sortType", encodeURIComponent(o)),
            c !== void 0 && d.set("offset", c.toString()),
            i !== void 0 && d.set("limit", i.toString()),
                (s.pathname += "/api/v1/tickers/search"),
                (s.search = d.toString()),
                Ws(s.toString(), Ca)
        );
    };
    getTickers = ({
                      category: e,
                      currentNetwork: t,
                      targetNetwork: n,
                      sortBy: a,
                      sortType: o,
                      offset: c,
                      limit: i,
                      tickers: s,
                  }) => {
        let d = new URL(this.apiUrl),
            m = new URLSearchParams();
        return (
            e === "FAVORITES" && s !== void 0 && m.set("tickers", s),
            e !== "FAVORITES" && m.set("category", e),
            t !== void 0 &&
            m.set("currentNetwork", encodeURIComponent(t).toUpperCase()),
            n !== void 0 &&
            m.set("targetNetwork", encodeURIComponent(n).toUpperCase()),
            a !== void 0 && m.set("sortBy", encodeURIComponent(a)),
            o !== void 0 && m.set("sortType", encodeURIComponent(o)),
            c !== void 0 && m.set("offset", c.toString()),
            i !== void 0 && m.set("limit", i.toString()),
                e === "FAVORITES" && s !== void 0
                    ? (d.pathname += "/api/v1/tickers/get/favourites")
                    : (d.pathname += "/api/v1/tickers/get/category"),
                (d.search = m.toString()),
                Ws(d.toString(), Ca)
        );
    };
};
var _a = class {
    env;
    units;
    referralSystem;
    bridge;
    frontage;
    logger;
    constructor(e = "production", t, n) {
        this.logger = n;
        let a;
        if (typeof e == "string") {
            let o = ot[e];
            if (!o)
                throw new Error(
                    `Invalid environment: ${e}. Available environments: ${Object.keys(ot).join(", ")}`,
                );
            (this.env = e),
                (a = {
                    analyticsAPI: o?.analyticsAPI,
                    referralAPI: o.referralAPI,
                    frontageAPI: o.frontageAPI,
                    networks: Object.entries(o.networks)
                        .map(([c, i]) => {
                            if (!Ut(c)) throw new Error(`Invalid chainId: ${c}`);
                            let s = qe[c];
                            if (!s)
                                throw new Error(
                                    `Chain config not found: ${c}. Available chains: ${Object.keys(qe).join(", ")}`,
                                );
                            return {
                                env: e,
                                chainId: c,
                                api: i.api,
                                nodeJsonRpc: i.rpc ?? s.rpc,
                                services: {
                                    blockchainService: {
                                        http: i.api + i.services.blockchain.http,
                                    },
                                    aggregator: {
                                        http: i.api + i.services.aggregator.http,
                                        ws: i.api + i.services.aggregator.ws,
                                    },
                                    priceFeed: { api: i.api + i.services.priceFeed.all },
                                    indexer: { api: i.api + i.services.indexer?.http },
                                },
                            };
                        })
                        .reduce((c, i) => ((c[i.chainId] = i), c), {}),
                }),
            t && (a = el(a, t));
        } else a = e;
        (this.referralSystem = new Jr(a.referralAPI)),
            (this.units = Object.entries(a.networks).reduce((o, [c, i]) => {
                if (!Ut(c)) throw new Error(`Invalid chainId: ${c}`);
                if (!qe[c]) throw new Error(`Chain config not found: ${c}`);
                let d = new Ar(
                    { chainId: c, nodeJsonRpc: i.nodeJsonRpc, services: i.services },
                    n,
                );
                return { ...o, [c]: d };
            }, {})),
            (this.bridge = new Xr(this.unitsArray)),
            (this.frontage = new en(a.frontageAPI));
    }
    get unitsArray() {
        return Object.entries(this.units).map(([, e]) => e);
    }
    getUnit(e) {
        let t;
        if (
            (Ut(e)
                ? (t = this.units[e])
                : (t = this.unitsArray.find((n) => n.networkCode === e)),
                !t)
        )
            throw new Error(
                `Invalid network code: ${e}. Available network codes: ${this.unitsArray.map((n) => n.networkCode).join(", ")}`,
            );
        return t;
    }
    getSiblingsOf(e) {
        return this.unitsArray.filter((t) => t.chainId !== e);
    }
    async getAssets(e = !0) {
        let t = {};
        if (
            (await Promise.all(
                this.unitsArray.map(async (n) => {
                    let { assetToAddress: a } = await Vs(n.blockchainService.getInfo)();
                    Object.entries(a).forEach(([o, c]) => {
                        if (c === void 0)
                            throw new Error(`Address is undefined for asset: ${o}`);
                        t[o] = { ...t[o], [n.chainId]: { address: c } };
                    });
                }),
            ),
                e)
        ) {
            let n = {},
                a = await this.getPairs("spot");
            Object.entries(a).forEach(([o, c]) => {
                let [i, s] = o.split("-");
                if (c === void 0)
                    throw new Error(`ChainIds is undefined for pair: ${o}`);
                if (i === void 0 || s === void 0) throw new Error(`Invalid pair: ${o}`);
                let d = t[i];
                if (d === void 0) {
                    let l = c.map((p) => qe[p]?.label).join(", ");
                    console.error(
                        `Asset found in Aggregator, but not in BlockchainService (base): ${i} (${o}). Networks: ${l}`,
                    );
                } else n[i] = d;
                let m = t[s];
                if (m === void 0) {
                    let l = c.map((p) => qe[p]?.label).join(", ");
                    console.error(
                        `Asset found in Aggregator, but not in BlockchainService (quote): ${s} (${o}). Networks: ${l}`,
                    );
                } else n[s] = m;
            });
        }
        return t;
    }
    async getPairs(...e) {
        let t = {};
        return (
            await Promise.all(
                this.unitsArray.map(async (n) => {
                    (await Vs(n.aggregator.getPairsList)(...e)).forEach((o) => {
                        t[o] = [...(t[o] ?? []), n.chainId];
                    });
                }),
            ),
                t
        );
    }
};
var Gs = {};
ae(Gs, {
    aggregator: () => lo,
    blockchainService: () => wo,
    frontage: () => ti,
    indexer: () => zo,
    priceFeed: () => Eo,
    referralSystem: () => Yo,
});
tl.config({ EXPONENTIAL_AT: 1e9 });
export {
    Tl as ADD_LIQUIDITY_GAS_LIMIT,
    Fa as APPROVE_ERC20_GAS_LIMIT,
    jl as DAY,
    Dl as DEFAULT_GAS_LIMIT,
    mi as DEPOSIT_ERC20_GAS_LIMIT,
    di as DEPOSIT_ETH_GAS_LIMIT,
    kl as FARMING_CLAIM_GAS_LIMIT,
    Ol as FARMING_EXIT_GAS_LIMIT,
    vl as FARMING_STAKE_GAS_LIMIT,
    Rl as FARMING_WITHDRAW_GAS_LIMIT,
    pi as FILL_ORDERS_GAS_LIMIT,
    Cl as GOVERNANCE_GET_REWARD_GAS_LIMIT,
    _l as GOVERNANCE_STAKE_GAS_LIMIT,
    Nl as GOVERNANCE_UNSTAKE_GAS_LIMIT,
    Bl as GOVERNANCE_VOTE_GAS_LIMIT,
    ai as HistoryTransactionStatus,
    q as INTERNAL_PROTOCOL_PRECISION,
    Ll as LIQUIDITY_MIGRATE_GAS_LIMIT,
    ja as LOCKATOMIC_GAS_LIMIT,
    Ul as MIGRATE_GAS_LIMIT,
    G as NATIVE_CURRENCY_PRECISION,
    _a as Orion,
    Ha as REDEEMATOMIC_GAS_LIMIT,
    Ml as SERVICE_TOKEN,
    Pl as STAKE_ERC20_GAS_LIMIT,
    _t as SWAP_THROUGH_ORION_POOL_GAS_LIMIT,
    Ge as SupportedChainId,
    $l as TOKEN_EXCEPTIONS,
    oi as TxStatus,
    ii as TxType,
    Ar as Unit,
    El as VOTE_ERC20_GAS_LIMIT,
    li as WEEK_DAYS,
    an as WITHDRAW_GAS_LIMIT,
    ui as YEAR,
    La as cancelOrderTypes,
    hi as config,
    _s as crypt,
    Al as developmentChains,
    $a as exchanges,
    tc as exchangesMap,
    _r as factories,
    hr as generateSwapCalldata,
    Pr as networkCodes,
    ir as orderStatuses,
    Da as orderTypes,
    wl as productionChains,
    Gs as services,
    Wt as subOrderStatuses,
    Ei as utils,
};
