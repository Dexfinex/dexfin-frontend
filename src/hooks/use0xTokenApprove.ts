import {BigNumber, ethers} from 'ethers';
import {useContext, useState} from 'react';
import {nativeAddress, NULL_ADDRESS} from '../constants';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {mapChainId2ProviderChainName} from "../config/networks.ts";
import {myABI, useGetAllowance} from "./useTokenApprove.ts";

export const use0xTokenApprove = ({
                                      token,
                                      spender,
                                      amount,
                                      chainId,
                                      isGaslessApprove,
                                      gaslessApprovalAvailable,
                                  }: {
    token?: `0x${string}`;
    spender?: `0x${string}`;
    amount?: string;
    chainId: number;
    isGaslessApprove: boolean;
    gaslessApprovalAvailable: boolean;
}) => {

    const [isConfirmingApproval, setIsConfirmingApproval] = useState(false);

    const {address, signer, walletClient} = useContext(Web3AuthContext);
    const chain = mapChainId2ProviderChainName[chainId]

    const {allowance, shouldRemoveApproval, refetch, errorFetchingAllowance} = useGetAllowance({
        token,
        spender,
        amount,
        chain
    });

    const normalizedAmount = !Number.isNaN(Number(amount)) ? amount : '0';

    const mainApproveFunc = (approveAmount: BigNumber) => {
        (async () => {
            try {
                if (token === ethers.constants.AddressZero || token === NULL_ADDRESS) {
                    return
                }

                const erc20 = new ethers.Contract(
                    token as `0x${string}`,
                    myABI,
                    signer
                );

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                (await erc20.approve(spender, approveAmount)).wait();
                // success?
                setIsConfirmingApproval(false);

            } catch (e) {
                console.log(e);
                setIsConfirmingApproval(false);
            }
        })()
    }

    const approve = () => {
        setIsConfirmingApproval(true);
        if (isGaslessApprove) {
            if (gaslessApprovalAvailable) {

            } else {
                mainApproveFunc(ethers.constants.MaxUint256);
            }
        } else {
            mainApproveFunc(ethers.constants.MaxUint256);
        }
    }

    if (token === ethers.constants.AddressZero || token?.toLowerCase() === nativeAddress.toLowerCase())
        return {
            isApproved: true
        };

    if (!address || !allowance) return {isApproved: false, errorFetchingAllowance};

    if (allowance.toString() === ethers.constants.MaxUint256.toString())
        return {
            isApproved: true,
            allowance,
            approve,
        };

    if (normalizedAmount && allowance.gte(BigNumber.from(normalizedAmount)))
        return {
            isApproved: true,
            allowance,
            approve,
        };

    return {
        isApproved: false,
        approve: approve,
        isLoading: isConfirmingApproval,
        isConfirmingApproval,
        refetch,
        allowance,
        shouldRemoveApproval
    };
};
