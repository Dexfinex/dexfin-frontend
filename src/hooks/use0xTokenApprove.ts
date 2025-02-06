import {BigNumber, ethers} from 'ethers';
import {useContext, useState} from 'react';
import {NULL_ADDRESS} from '../constants';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {mapChainId2ProviderChainName} from "../config/networks.ts";
import {myABI, useGetAllowance} from "./useTokenApprove.ts";
import {GaslessQuoteResponse, SignatureType} from "../types/swap.type.ts";
import {splitSignature} from "../utils/signature.util.ts";

export const use0xTokenApprove = ({
                                      token,
                                      spender,
                                      amount,
                                      chainId,
                                      gaslessQuote,
                                      isGaslessApprove,
                                      gaslessApprovalAvailable,
                                  }: {
    token?: `0x${string}`;
    spender?: `0x${string}`;
    amount?: string;
    chainId: number;
    gaslessQuote: GaslessQuoteResponse;
    isGaslessApprove: boolean;
    gaslessApprovalAvailable: boolean;
}) => {

    const [isConfirmingApproval, setIsConfirmingApproval] = useState(false);
    const [approvalDataToSubmit, setApprovalDataToSubmit] = useState(undefined);
    const [tradeDataToSubmit, setTradeDataToSubmit] = useState(undefined);


    const {signer, walletClient} = useContext(Web3AuthContext);
    const chain = mapChainId2ProviderChainName[chainId]

    const {allowance, shouldRemoveApproval, refetch} = useGetAllowance({
        token,
        spender,
        amount,
        chain
    });

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

    const signApprovalObject = async (): Promise<any> => {
        // Logic to sign approval object
        const approvalSignature = await walletClient!.signTypedData({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            types: gaslessQuote.approval?.eip712.types,
            domain: gaslessQuote.approval?.eip712.domain,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            message: gaslessQuote.approval?.eip712.message,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            primaryType: gaslessQuote.approval?.eip712.primaryType,
        });
        console.log("🖊️ approvalSignature: ", approvalSignature);
        return approvalSignature;
    }

    async function approvalSplitSigDataToSubmit(object: any): Promise<any> {
        // split approval signature and package data to submit
        const approvalSplitSig = await splitSignature(object);
        return {
            type: gaslessQuote.approval?.type,
            eip712: gaslessQuote.approval?.eip712,
            signature: {
                ...approvalSplitSig,
                v: Number(approvalSplitSig.v),
                signatureType: SignatureType.EIP712,
            },
        }; // Return approval object with split signature
    }

    // Helper functions
    async function signTradeObject(): Promise<any> {
        // Logic to sign trade object
        const tradeSignature = await walletClient!.signTypedData({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            types: gaslessQuote.trade?.eip712.types,
            domain: gaslessQuote.trade?.eip712.domain,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            message: gaslessQuote.trade?.eip712.message,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            primaryType: gaslessQuote.trade?.eip712.primaryType,
        });
        console.log("🖊️ tradeSignature: ", tradeSignature);
        return tradeSignature;
    }

    async function tradeSplitSigDataToSubmit(object: any): Promise<any> {
        // split trade signature and package data to submit
        const tradeSplitSig = await splitSignature(object);
        return {
            type: gaslessQuote.trade!.type,
            eip712: gaslessQuote.trade!.eip712,
            signature: {
                ...tradeSplitSig,
                v: Number(tradeSplitSig.v),
                signatureType: SignatureType.EIP712,
            },
        }; // Return trade object with split signature
    }


    const approve = () => {
        setIsConfirmingApproval(true);
        (async() => {
            if (isGaslessApprove) {
                if (gaslessApprovalAvailable) {
                    const approvalSignature = await signApprovalObject(); // Function to sign approval object
                    if (approvalSignature) {
                        const _approvalDataToSubmit = await approvalSplitSigDataToSubmit(
                            approvalSignature
                        );
                        setApprovalDataToSubmit(_approvalDataToSubmit)
                    }

                    const tradeSignature = await signTradeObject(); // Function to sign trade object
                    const _tradeDataToSubmit = await tradeSplitSigDataToSubmit(tradeSignature);
                    setTradeDataToSubmit(_tradeDataToSubmit)
                    setIsConfirmingApproval(false);
                } else {
                    mainApproveFunc(ethers.constants.MaxUint256);
                }
            } else {
                mainApproveFunc(ethers.constants.MaxUint256);
            }
        })()
    }

    return {
        isApproved: false, // because we don't use it actually
        approvalDataToSubmit,
        tradeDataToSubmit,
        isReadyToSubmit: approvalDataToSubmit && tradeDataToSubmit,
        approve: approve,
        isLoading: isConfirmingApproval,
        isConfirmingApproval,
        refetch,
        allowance,
        shouldRemoveApproval
    };
};
