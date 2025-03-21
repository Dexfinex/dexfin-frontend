/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "_token0",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "_token1",
 "type": "address"
 },
 {
 "internalType": "uint24",
 "name": "_fee",
 "type": "uint24"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "constructor"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "name": "BitmapIndex",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ErrorTransfer",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InvalidAmount",
 "type": "error"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "name": "InvalidBalance",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InvalidFee",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InvalidOrder",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "LiquidityEmpty",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "MaxAmount",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "MinAmount",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "OrderDisable",
 "type": "error"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "name": "TickIndex",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "WasInit",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "WasLock",
 "type": "error"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "owner",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint32",
 "name": "orderId",
 "type": "uint32"
 },
 {
 "indexed": true,
 "internalType": "int24",
 "name": "indexFrom",
 "type": "int24"
 },
 {
 "indexed": true,
 "internalType": "int24",
 "name": "indexTo",
 "type": "int24"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount1",
 "type": "uint256"
 }
 ],
 "name": "Burn",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "owner",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint32",
 "name": "orderId",
 "type": "uint32"
 },
 {
 "indexed": true,
 "internalType": "int24",
 "name": "indexFrom",
 "type": "int24"
 },
 {
 "indexed": true,
 "internalType": "int24",
 "name": "indexTo",
 "type": "int24"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 }
 ],
 "name": "Collect",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "indexed": true,
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 }
 ],
 "name": "CollectProtocol",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 }
 ],
 "name": "Initialize",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "indexed": true,
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint32",
 "name": "orderId",
 "type": "uint32"
 },
 {
 "indexed": true,
 "internalType": "int24",
 "name": "indexFrom",
 "type": "int24"
 },
 {
 "indexed": true,
 "internalType": "int24",
 "name": "indexTo",
 "type": "int24"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount1",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint48",
 "name": "time",
 "type": "uint48"
 }
 ],
 "name": "Mint",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "indexed": true,
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount1",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "int128",
 "name": "liquidity",
 "type": "int128"
 },
 {
 "indexed": false,
 "internalType": "int128",
 "name": "index",
 "type": "int128"
 }
 ],
 "name": "Swap",
 "type": "event"
 },
 {
 "stateMutability": "payable",
 "type": "fallback"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "from",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "to",
 "type": "int128"
 }
 ],
 "name": "GetAvgRate",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "MAX_AMOUNT",
 "outputs": [
 {
 "internalType": "int128",
 "name": "",
 "type": "int128"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "MAX_TICK",
 "outputs": [
 {
 "internalType": "int24",
 "name": "",
 "type": "int24"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 }
 ],
 "name": "addCounter",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "amount0",
 "type": "int128"
 },
 {
 "internalType": "int24",
 "name": "indexFrom",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "indexTo",
 "type": "int24"
 }
 ],
 "name": "addLiqByIndex",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 },
 {
 "internalType": "int128",
 "name": "addAmount",
 "type": "int128"
 }
 ],
 "name": "addLiqToTick",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 },
 {
 "internalType": "int128",
 "name": "addAmount",
 "type": "int128"
 }
 ],
 "name": "addTickAmount",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "uint32",
 "name": "orderIndex",
 "type": "uint32"
 }
 ],
 "name": "burn",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "liquidity",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amount1",
 "type": "uint256"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "index",
 "type": "int128"
 }
 ],
 "name": "calcAmount0",
 "outputs": [
 {
 "internalType": "int128",
 "name": "",
 "type": "int128"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "index",
 "type": "int128"
 }
 ],
 "name": "calcAmount1",
 "outputs": [
 {
 "internalType": "int128",
 "name": "",
 "type": "int128"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "amount",
 "type": "int128"
 },
 {
 "internalType": "int24",
 "name": "indexFrom",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "indexTo",
 "type": "int24"
 }
 ],
 "name": "calcAmounts",
 "outputs": [
 {
 "internalType": "int128",
 "name": "amount0",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "amount1",
 "type": "int128"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "uint32",
 "name": "orderIndex",
 "type": "uint32"
 }
 ],
 "name": "collect",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 }
 ],
 "name": "collectProtocol",
 "outputs": [
 {
 "internalType": "uint128",
 "name": "amount0",
 "type": "uint128"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "uint32",
 "name": "orderIndex",
 "type": "uint32"
 },
 {
 "internalType": "int128",
 "name": "amount",
 "type": "int128"
 }
 ],
 "name": "decreaseLiquidity",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "liquidity",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amount1",
 "type": "uint256"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "x",
 "type": "int128"
 }
 ],
 "name": "doTestLog2",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "x",
 "type": "int128"
 }
 ],
 "name": "doTestLog3",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "index",
 "type": "int128"
 }
 ],
 "name": "do_calcAmount0",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "index",
 "type": "int128"
 }
 ],
 "name": "do_calcAmount1",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "factory",
 "outputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getCurrent",
 "outputs": [
 {
 "components": [
 {
 "internalType": "uint128",
 "name": "totalAmount",
 "type": "uint128"
 },
 {
 "internalType": "uint128",
 "name": "amount",
 "type": "uint128"
 },
 {
 "internalType": "uint128",
 "name": "pool",
 "type": "uint128"
 },
 {
 "internalType": "uint128",
 "name": "swap",
 "type": "uint128"
 },
 {
 "internalType": "int24",
 "name": "indexFrom",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "indexTo",
 "type": "int24"
 },
 {
 "internalType": "int128",
 "name": "index",
 "type": "int128"
 },
 {
 "internalType": "uint32",
 "name": "totalOrders",
 "type": "uint32"
 }
 ],
 "internalType": "struct CurrentInfo",
 "name": "",
 "type": "tuple"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "x",
 "type": "int128"
 }
 ],
 "name": "getExp2",
 "outputs": [
 {
 "internalType": "int128",
 "name": "",
 "type": "int128"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "x",
 "type": "int128"
 }
 ],
 "name": "getExp3",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "x",
 "type": "int128"
 }
 ],
 "name": "getExp3_2",
 "outputs": [
 {
 "internalType": "int128",
 "name": "",
 "type": "int128"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "rate",
 "type": "uint256"
 }
 ],
 "name": "getIndex",
 "outputs": [
 {
 "internalType": "int24",
 "name": "",
 "type": "int24"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "rate",
 "type": "uint256"
 }
 ],
 "name": "getIndexByRate",
 "outputs": [
 {
 "internalType": "int24",
 "name": "",
 "type": "int24"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "from",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "to",
 "type": "int24"
 }
 ],
 "name": "getIntegralRate128",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "x",
 "type": "int128"
 }
 ],
 "name": "getLog2",
 "outputs": [
 {
 "internalType": "int128",
 "name": "",
 "type": "int128"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "x",
 "type": "int128"
 }
 ],
 "name": "getLog3",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "x",
 "type": "int128"
 }
 ],
 "name": "getLog4",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getMagic_a1",
 "outputs": [
 {
 "internalType": "int128",
 "name": "",
 "type": "int128"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getMagic_math",
 "outputs": [
 {
 "internalType": "uint128",
 "name": "",
 "type": "uint128"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint8",
 "name": "index",
 "type": "uint8"
 }
 ],
 "name": "getMapBits",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "direct",
 "type": "int24"
 }
 ],
 "name": "getNextTick",
 "outputs": [
 {
 "internalType": "int24",
 "name": "",
 "type": "int24"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint32",
 "name": "secondsAgo",
 "type": "uint32"
 }
 ],
 "name": "getOracle",
 "outputs": [
 {
 "internalType": "int128",
 "name": "",
 "type": "int128"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "owner",
 "type": "address"
 },
 {
 "internalType": "uint32",
 "name": "index",
 "type": "uint32"
 }
 ],
 "name": "getOrder",
 "outputs": [
 {
 "components": [
 {
 "internalType": "uint96",
 "name": "amountLow",
 "type": "uint96"
 },
 {
 "internalType": "uint96",
 "name": "feeLow",
 "type": "uint96"
 },
 {
 "internalType": "int16",
 "name": "indexFrom",
 "type": "int16"
 },
 {
 "internalType": "int16",
 "name": "indexTo",
 "type": "int16"
 },
 {
 "internalType": "uint32",
 "name": "OrdersCounter",
 "type": "uint32"
 },
 {
 "internalType": "uint32",
 "name": "amountHigh",
 "type": "uint32"
 },
 {
 "internalType": "uint32",
 "name": "feeHigh",
 "type": "uint32"
 },
 {
 "internalType": "uint8",
 "name": "disable",
 "type": "uint8"
 },
 {
 "internalType": "int128",
 "name": "collectFee",
 "type": "int128"
 }
 ],
 "internalType": "struct OrderData",
 "name": "",
 "type": "tuple"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getPoolInfo",
 "outputs": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "token0",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "token1",
 "type": "address"
 },
 {
 "internalType": "uint24",
 "name": "fee",
 "type": "uint24"
 },
 {
 "internalType": "int128",
 "name": "tickMultiplier",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "denominator0",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "denominator1",
 "type": "int128"
 }
 ],
 "internalType": "struct PoolInfo",
 "name": "",
 "type": "tuple"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getPriceTick",
 "outputs": [
 {
 "internalType": "int16",
 "name": "",
 "type": "int16"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 }
 ],
 "name": "getRateByIndex",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "result",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 }
 ],
 "name": "getRateByIndex128",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "result",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getRootBits",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getTWAP",
 "outputs": [
 {
 "components": [
 {
 "internalType": "uint32",
 "name": "priceTime",
 "type": "uint32"
 },
 {
 "internalType": "uint48",
 "name": "priceTW",
 "type": "uint48"
 }
 ],
 "internalType": "struct TWItem",
 "name": "Item",
 "type": "tuple"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getTWAPPos",
 "outputs": [
 {
 "internalType": "uint16",
 "name": "",
 "type": "uint16"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "uint32",
 "name": "orderIndex",
 "type": "uint32"
 },
 {
 "internalType": "int128",
 "name": "amount",
 "type": "int128"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "increaseLiquidity",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amount1",
 "type": "uint256"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 }
 ],
 "name": "initialize",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "isInit",
 "outputs": [
 {
 "internalType": "bool",
 "name": "",
 "type": "bool"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "isLock",
 "outputs": [
 {
 "internalType": "uint8",
 "name": "",
 "type": "uint8"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "from",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "to",
 "type": "int24"
 }
 ],
 "name": "listAmount",
 "outputs": [
 {
 "internalType": "int128[]",
 "name": "",
 "type": "int128[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "from",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "to",
 "type": "int24"
 }
 ],
 "name": "listBitmap",
 "outputs": [
 {
 "internalType": "int128[]",
 "name": "",
 "type": "int128[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "from",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "to",
 "type": "int24"
 }
 ],
 "name": "listCumulFee",
 "outputs": [
 {
 "internalType": "int128[]",
 "name": "",
 "type": "int128[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "from",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "to",
 "type": "int24"
 }
 ],
 "name": "listFee",
 "outputs": [
 {
 "internalType": "int128[]",
 "name": "",
 "type": "int128[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "owner",
 "type": "address"
 },
 {
 "internalType": "uint32",
 "name": "indexFrom",
 "type": "uint32"
 },
 {
 "internalType": "uint32",
 "name": "count",
 "type": "uint32"
 }
 ],
 "name": "listOrder",
 "outputs": [
 {
 "components": [
 {
 "internalType": "int128",
 "name": "amount",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "fee",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "collectFee",
 "type": "int128"
 },
 {
 "internalType": "int24",
 "name": "indexFrom",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "indexTo",
 "type": "int24"
 },
 {
 "internalType": "uint8",
 "name": "disable",
 "type": "uint8"
 }
 ],
 "internalType": "struct OrderView[]",
 "name": "",
 "type": "tuple[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "indexFrom",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "count",
 "type": "uint256"
 }
 ],
 "name": "listTWAP",
 "outputs": [
 {
 "components": [
 {
 "internalType": "uint32",
 "name": "priceTime",
 "type": "uint32"
 },
 {
 "internalType": "uint48",
 "name": "priceTW",
 "type": "uint48"
 }
 ],
 "internalType": "struct TWItem[]",
 "name": "",
 "type": "tuple[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "int24",
 "name": "indexFrom",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "indexTo",
 "type": "int24"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "mint",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "amount0",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amount1",
 "type": "uint256"
 },
 {
 "internalType": "uint32",
 "name": "id",
 "type": "uint32"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 }
 ],
 "name": "removeCounter",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint32",
 "name": "orderIndex",
 "type": "uint32"
 }
 ],
 "name": "removeLiq",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 },
 {
 "internalType": "int128",
 "name": "removeAmount",
 "type": "int128"
 }
 ],
 "name": "removeLiqFromTick",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint24",
 "name": "fee",
 "type": "uint24"
 }
 ],
 "name": "setFee",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 },
 {
 "internalType": "int128",
 "name": "addAmount",
 "type": "int128"
 }
 ],
 "name": "setTickAmount",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "name": "speed_Integral",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "rate0",
 "type": "uint256"
 }
 ],
 "name": "speed_getIndex",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 },
 {
 "internalType": "int24",
 "name": "direct",
 "type": "int24"
 }
 ],
 "name": "speed_getNextTick",
 "outputs": [
 {
 "internalType": "int24",
 "name": "",
 "type": "int24"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int24",
 "name": "index",
 "type": "int24"
 }
 ],
 "name": "speed_getRate",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "bool",
 "name": "zeroForOne",
 "type": "bool"
 },
 {
 "internalType": "int256",
 "name": "amountSpecified",
 "type": "int256"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "swap",
 "outputs": [
 {
 "internalType": "int256",
 "name": "amount0",
 "type": "int256"
 },
 {
 "internalType": "int256",
 "name": "amount1",
 "type": "int256"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "amount0",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "direct",
 "type": "int128"
 }
 ],
 "name": "swap1",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int128",
 "name": "amount0",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "amount1",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "direct",
 "type": "int128"
 }
 ],
 "name": "swap2",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "totalFee",
 "outputs": [
 {
 "internalType": "uint128",
 "name": "",
 "type": "uint128"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "stateMutability": "payable",
 "type": "receive"
 }
]

export = data