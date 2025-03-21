import {secp256k1} from "@noble/curves/secp256k1";
import {Hex, hexToNumber, Signature, toHex} from "viem";

export type SignatureExtended = Signature & {
    recoveryParam: number;
};

/**
 * Valid signature types on 0x
 */
/*
export enum SignatureType {
    Illegal = 0,
    Invalid = 1,
    EIP712 = 2,
    EthSign = 3,
}
*/

export async function splitSignature(signatureHex: Hex) {
    const { r, s } = secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
    const v = hexToNumber(`0x${signatureHex.slice(130)}`);
    // const signatureType = SignatureType.EIP712;

    return padSignature({
        v: BigInt(v),
        r: toHex(r),
        s: toHex(s),
        recoveryParam: 1 - (v % 2),
    });

    /**
     * Sometimes signatures are split without leading bytes on the `r` and/or `s` fields.
     *
     * Add them if they don't exist.
     */
    function padSignature(signature: SignatureExtended): SignatureExtended {
        const hexLength = 64;

        const result = { ...signature };

        const hexExtractor = /^0(x|X)(?<hex>\w+)$/;
        const rMatch = signature.r.match(hexExtractor);
        const rHex = rMatch?.groups?.hex;
        if (rHex) {
            if (rHex.length !== hexLength) {
                result.r = `0x${rHex.padStart(hexLength, "0")}`;
            }
        }

        const sMatch = signature.s.match(hexExtractor);
        const sHex = sMatch?.groups?.hex;
        if (sHex) {
            if (sHex.length !== hexLength) {
                result.s = `0x${sHex.padStart(hexLength, "0")}`;
            }
        }
        return result;
    }
}