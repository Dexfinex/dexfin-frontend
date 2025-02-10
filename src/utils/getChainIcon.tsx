import EthereumChainIcon from "./assets/ethereum-chain.svg"

export function getChainIcon(chainId?: number) {
    switch (chainId) {
        case 1:
            return EthereumChainIcon;
        default:
            return null;
    }
}