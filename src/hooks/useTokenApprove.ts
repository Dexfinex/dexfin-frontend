import {BigNumber, ethers} from 'ethers';
import {useContext, useState} from 'react';
import {erc20Abi} from 'viem'
import {nativeAddress, NULL_ADDRESS} from '../constants';
import {useQuery} from '@tanstack/react-query';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {providers} from "../config/rpcs.ts";
import {mapChainId2ProviderChainName} from "../config/networks.ts";

const oldErc = [
	'0xdAC17F958D2ee523a2206206994597C13D831ec7'.toLowerCase(), // USDT
	'0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32'.toLowerCase() // LDO
];

export const myABI = [  {
	"constant": false,
	"inputs": [
		{ "name": "_spender", "type": "address" },
		{ "name": "_value", "type": "uint256" }
	],
	"name": "approve",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}];

export async function getAllowance({
	token,
	chain,
	address,
	spender
}: {
	token?: string;
	chain: string;
	address?: `0x${string}`;
	spender?: `0x${string}`;
}) {
	if (!spender || !token || !address || token === ethers.constants.AddressZero) {
		return null;
	}
	try {
		const provider = providers[chain];
		const tokenContract = new ethers.Contract(token, erc20Abi, provider);
		 
		return (await tokenContract.allowance(address, spender)) as ethers.BigNumber;
	} catch (error) {
		throw new Error(error instanceof Error ? `[Allowance]:${error.message}` : '[Allowance]: Failed to fetch allowance');
	}
}

export const useGetAllowance = ({
	token,
	spender,
	amount,
	chain
}: {
	token?: `0x${string}`;
	spender?: `0x${string}`;
	amount?: string;
	chain: string;
}) => {
	const { address } = useContext(Web3AuthContext);

	const isOld = token ? oldErc.includes(token?.toLowerCase()) : false;

	const {
		data: allowance,
		refetch,
		isRefetching,
		error: errorFetchingAllowance
	} = useQuery({
			queryKey: ['token-allowance', address, token, chain, spender],
			queryFn: () =>
				getAllowance({
					token,
					chain,
					address: address as `0x${string}`,
					spender
				}),
			retry: 2,
			refetchInterval: 3000
		}
	);

	const shouldRemoveApproval =
		isOld &&
		allowance &&
		amount &&
		!Number.isNaN(Number(amount)) &&
		allowance.lt(BigNumber.from(amount)) &&
		!allowance.eq(0);

	return { allowance, shouldRemoveApproval, refetch, isRefetching, errorFetchingAllowance };
};

export const useTokenApprove = ({
	token,
	spender,
	amount,
	chainId,
}: {
	token?: `0x${string}`;
	spender?: `0x${string}`;
	amount?: string;
	chainId: number;
}) => {

	const [isConfirmingApproval, setIsConfirmingApproval] = useState(false);
	const [isConfirmingInfiniteApproval, setIsConfirmingInfiniteApproval] = useState(false);
	const [isConfirmingResetApproval, setIsConfirmingResetApproval] = useState(false);

	const { address, signer } = useContext(Web3AuthContext);
	const chain = mapChainId2ProviderChainName[chainId]

	const { allowance, shouldRemoveApproval, refetch, errorFetchingAllowance } = useGetAllowance({
		token,
		spender,
		amount,
		chain
	});

	const normalizedAmount = !Number.isNaN(Number(amount)) ? amount : '0';

	const mainApproveFunc = async (approveAmount: BigNumber) => {
		try {
			if (token === ethers.constants.AddressZero || token === NULL_ADDRESS) {
				return
			}

			const erc20 = new ethers.Contract(
				token as `0x${string}`,
				myABI,
				signer
			);

			 
			(await erc20.approve(spender, approveAmount)).wait();
			// success?
			setIsConfirmingApproval(false);

		} catch(e) {
			console.log(e);
			setIsConfirmingApproval(false);
		}
	}
	const approve = (additionalAmount: string = '0') => {
		setIsConfirmingApproval(true);
		(async () => {
			const baseAmount = normalizedAmount ? BigNumber.from(normalizedAmount) : ethers.constants.MaxUint256;
			const totalAmount = baseAmount.add(BigNumber.from(additionalAmount));
			await mainApproveFunc(totalAmount);
		})();
	};
	const isInfiniteLoading = false;
	const approveInfinite = () => {
		setIsConfirmingInfiniteApproval(true);
		(async() => {
			await mainApproveFunc(ethers.constants.MaxUint256);
		})()
	}


	const isResetLoading = false;
	const approveReset = () => {
		setIsConfirmingResetApproval(true);
		(async() => {
			await mainApproveFunc(BigNumber.from('0'));
		})()
	}

	if (token === ethers.constants.AddressZero || token?.toLowerCase() === nativeAddress.toLowerCase())
		return {
		isApproved: true
	};

	if (!address || !allowance) return { isApproved: false, errorFetchingAllowance };

	if (allowance.toString() === ethers.constants.MaxUint256.toString())
		return {
			isApproved: true,
			allowance,
			approve,
			approveInfinite,
			approveReset
		};

	if (normalizedAmount && allowance.gte(BigNumber.from(normalizedAmount)))
		return {
			isApproved: true,
			allowance,
			approve,
			approveInfinite,
			approveReset
	};

	return {
		isApproved: false,
		approve: approve,
		approveInfinite: approveInfinite,
		approveReset: approveReset,
		isLoading: isConfirmingApproval,
		isConfirmingApproval,
		isInfiniteLoading: isInfiniteLoading || isConfirmingInfiniteApproval,
		isConfirmingInfiniteApproval,
		isResetLoading: isResetLoading || isConfirmingResetApproval,
		isConfirmingResetApproval,
		refetch,
		allowance,
		shouldRemoveApproval
	};
};
