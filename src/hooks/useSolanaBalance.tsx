import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {PublicKey} from '@solana/web3.js';
import {MintLayout, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {NATIVE_MINT} from "../constants/solana.constants.ts";
import {connection} from "../config/solana.ts";
import {useContext} from "react";
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";


interface IGetBalance {
	publicKey: string;
	mintAddress: string;
}


const getSolanaBalance = async ({ publicKey, mintAddress }: IGetBalance) => {
	const ownerPublicKey = new PublicKey(publicKey);
	const tokenMintPublicKey = new PublicKey(mintAddress);

	try {

		if (mintAddress === NATIVE_MINT.toString()) {
			// Get SOL balance
			const balance = await connection.getBalance(ownerPublicKey);
			return {
				value: balance,
				decimals: 9,
				formatted: balance / 1e9
			};
		}

		const tokenInfo = await connection.getAccountInfo(tokenMintPublicKey);
		const parsedTokenInfo = MintLayout.decode(tokenInfo!.data);
		// console.log("parsedTokenInfo", parsedTokenInfo);

		const accounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
			programId: TOKEN_PROGRAM_ID,
			mint: tokenMintPublicKey,
		});

		if (accounts.value.length === 0) {
			console.log('No token accounts found for the specified owner and token mint.');
			return {
				value: 0,
				formatted: 0,
				decimals: parsedTokenInfo.decimals
			};
		}

		let balance = 0;
		accounts.value.forEach((accountInfo) => {
			balance += parseInt(accountInfo.account.data.parsed.info.tokenAmount.amount, 10);
		});

		console.log(`Total balance for token ${mintAddress} is:`, balance);
		return {
			value: balance,
			formatted: balance / Math.pow(10, parsedTokenInfo.decimals),
			decimals: parsedTokenInfo.decimals
		};

	} catch (error) {
		console.error('Error getting balance:', error);
		throw error;
	}
};


export const useSolanaBalance = ({mintAddress}: {mintAddress?: string}): UseQueryResult<any> => {
	const {solanaWalletInfo} = useContext(Web3AuthContext);

	const isEnabled = !!solanaWalletInfo && !!mintAddress;

	return useQuery({
		queryKey: ['solanaBalance', solanaWalletInfo?.publicKey, mintAddress],
		queryFn: () => getSolanaBalance({publicKey: solanaWalletInfo!.publicKey, mintAddress: mintAddress!}),
		enabled: isEnabled,
		refetchInterval: 20_000,
	});
};
