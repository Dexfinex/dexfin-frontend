import {Connection} from "@solana/web3.js";

export const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=5706e2e7-5ce7-4915-970a-91b4a4f092f8', {
    wsEndpoint: 'wss://mainnet.helius-rpc.com/?api-key=5706e2e7-5ce7-4915-970a-91b4a4f092f8',
    commitment: 'confirmed',
})