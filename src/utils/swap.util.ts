// Helper functions
import {splitSignature} from "./signature.util.ts";
import {GaslessQuoteResponse, SignatureType} from "../types/swap.type.ts";
import {WalletClient} from "viem";

export async function signTradeObject(walletClient: WalletClient, quote: GaslessQuoteResponse): Promise<any> {
    // Logic to sign trade object
    const tradeSignature = await walletClient.signTypedData({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        types: quote.trade?.eip712.types,
        domain: quote.trade?.eip712.domain,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        message: quote.trade?.eip712.message,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        primaryType: quote.trade?.eip712.primaryType,
    });
    console.log("🖊️ tradeSignature: ", tradeSignature);
    return tradeSignature;
}

export async function tradeSplitSigDataToSubmit(object: any, quote: GaslessQuoteResponse): Promise<any> {
    // split trade signature and package data to submit
    const tradeSplitSig = await splitSignature(object);
    return {
        type: quote.trade!.type,
        eip712: quote.trade!.eip712,
        signature: {
            ...tradeSplitSig,
            v: Number(tradeSplitSig.v),
            signatureType: SignatureType.EIP712,
        },
    }; // Return trade object with split signature
}
