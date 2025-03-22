import moment from 'moment/moment';
import { ethers } from 'ethers';
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { SOLANA_CHAIN_ID } from "../constants/solana.constants.ts";
import { formatDistanceToNow } from 'date-fns';
import { mainnet } from 'viem/chains';

const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-zZ]{32,44}$/;
const bitcoinAddressRegex = /^(1[a-km-zA-HJ-NP-Z1-9]{25,33}|3[a-km-zA-HJ-NP-Z1-9]{25,33}|bc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{8,87})$/;

export const isValidAddress = (address: string, chainId: number): boolean => {
    if (chainId === 0)
        return bitcoinAddressRegex.test(address);
    else if (chainId === SOLANA_CHAIN_ID)
        return solanaAddressRegex.test(address);
    return ethAddressRegex.test(address);
};

export const isNativeTokenAddress = (chainId: number, address: string): boolean => {
    return mapChainId2NativeAddress[chainId]?.toLowerCase() === address?.toLowerCase()
}

export const extractAddress = (fullAddress: string): string => {
    if (!fullAddress) return ""
    const match = fullAddress.match(/0x[a-fA-F0-9]{40}/);
    const address = match ? match[0] : "";
    return address;
}


export const downloadBase64File = (base64Data: string, fileName: string, fileType: string) => {
    // Convert Base64 to a Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });

    // Create a temporary link element and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

export const getEnsName = async (address: string): Promise<string> => {
    const provider = new ethers.providers.JsonRpcProvider(mainnet.rpcUrls.default.http[0]);

    try {
        const ensName = await provider.lookupAddress(address);
        // console.log("ENS Name:", ensName || "No ENS name found");
        const result = (ensName ? ensName : "");

        return result
    } catch (error) {
        console.error("Error fetching ENS name:", error);
    }

    return "";
}

export const getChatHistoryDate = (timestamp: number) => {
    if (timestamp == 0) return ""

    const date = new Date(timestamp);
    const now = new Date();

    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diffDays <= 0) {
        return timeString; // Show only hour and minutes if today
    } else {
        return `${diffDays} days ago, ${timeString}`; // Show x days ago + time
    }
}

export const getHourAndMinute = (timestamp: number) => {
    if (timestamp == 0) return ""

    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return timeString;
}

export const getMonthDayHour = (timestamp: number) => {
    if (timestamp == 0) return ""

    const date = new Date(timestamp);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();

    return `${hours}:${minutes} , ${month} ${day}`;
}

export const getMonthDayYear = (timestamp: number) => {
    if (timestamp == 0) return ""

    const date = new Date(timestamp);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

export const getFullDate = (timestamp: number) => {
    if (timestamp == 0) return ""

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('en-US', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return formattedDate;
}

/**
 * Compares two wallet addresses in uppercase.
 * @param address1 - The first wallet address.
 * @param address2 - The second wallet address.
 * @returns boolean - Returns true if the addresses are the same (case-insensitive), otherwise false.
 */
export const compareWalletAddresses = (
    address1: string,
    address2: string,
): boolean => {
    // if (!ethers.utils.isAddress(address1) || !ethers.utils.isAddress(address2)) {
    //     return false;
    // }
    if (!address1 || !address2) return false;

    // Convert both addresses to uppercase.
    const normalizedAddress1 = address1.toUpperCase();
    const normalizedAddress2 = address2.toUpperCase();

    // Compare the normalized addresses.
    return normalizedAddress1 === normalizedAddress2;
};

/**
 * Formats a given Date object into a string with the format "MMM DD, YYYY, hh:mm A".
 *
 * @param {Date} date - The JavaScript Date object to format.
 * @returns {string} - The formatted date string.
 *
 * Example usage:
 * const date = new Date('2024-09-19T18:45:00');
 * console.log(formatDate(date)); // Output: Sep 19, 2024, 06:45 PM
 */
export const formatDate = (date: Date | string) => {
    return moment(date).format('MMM DD, YYYY, hh:mm A');
};

/**
 * Shortens an Ethereum address by keeping the first 6 and last 4 characters,
 * and replacing the middle with ellipses ('...').
 *
 * @param {string} address - The Ethereum address to shorten.
 * @param length
 * @returns {string} - The shortened address, or the original address if it's less than 10 characters long.
 *
 * Example usage:
 * const fullAddress = "0x1234567890abcdef1234567890abcdef12345678";
 * console.log(shrinkAddress(fullAddress)); // Output: 0x1234...5678
 */
export const shrinkAddress = (address: string, length: number = 5): string => {
    if (!address || address.length < 12) {
        return address; // Return as-is if too short
    }
    return `${address.slice(0, length)}...${address.slice(-length + 1)}`;
};

/**
 * Formats a given number to a specified number of decimal places.
 *
 * @param {number | undefined} num - The number to be formatted. If undefined, defaults to '0'.
 * @param {number} [fixedCount=2] - The number of decimal places to format the number to. Default is 2.
 * @returns {string} - The number formatted to the specified decimal places as a string.
 *
 * @remarks
 * - If the input number is an integer or its absolute value is between 0.01 and 0.000001,
 *   determines the number of digits after the decimal point needed for precision, then adds 2 more decimal places.
 * - Uses the `Math.round` method to ensure proper rounding according to the specified decimal places.
 */
export const formatNumberByFrac = (
    num: number | undefined,
    fixedCount: number = 2,
): string => {
    if (num === undefined) return '0';

    const threshold = 0.01;
    const minThreshold = 0.000001;
    num = parseFloat(num.toString());

    const getFixedNum = (num: number, fixedCount: number): string => {
        const multipleValue = 10 ** fixedCount;
        return (Math.round(num * multipleValue) / multipleValue).toString();
    };

    if (
        Number.isInteger(num) ||
        (Math.abs(num) < threshold && Math.abs(num) > minThreshold)
    ) {
        const lengthAfterDecimal = Math.ceil(Math.log10(1 / num));
        if (num > 0 && lengthAfterDecimal > 0) {
            return getFixedNum(num, lengthAfterDecimal + 2);
        }
    }

    return getFixedNum(num, fixedCount);
};

export const formatNumberByRepeat = (
    num: number,
    fixedCount: number = 2,
): { prev: string, current: string, next: string } => {
    const string = formatNumberByFrac(num, fixedCount);
    const decimalIndex = string.indexOf('.');
    const threshold = 0.01;

    if (decimalIndex !== -1 && Math.abs(num) < threshold) {
        const decimalPart = string.slice(decimalIndex + 1); // Get the decimal part

        let significantDigitPosition = decimalPart.search(/[1-9]/); // Find the first non-zero digit

        if (significantDigitPosition === -1) {
            // Handle case when there's no significant digit
            return { prev: string, current: "", next: "" };
        }

        const leadingZeros = decimalPart.slice(0, significantDigitPosition); // Leading zeros before the significant digit
        const significantDigit = decimalPart.charAt(significantDigitPosition); // The significant digit itself
        const remainingDigits = decimalPart.slice(significantDigitPosition + 1); // Any remaining digits after the significant digit
        // return `0.0(${leadingZeros.length})${significantDigit}${remainingDigits}`; // Return the formatted string
        return { prev: "0.0", current: leadingZeros.length + "", next: `${significantDigit}${remainingDigits}` };
    }
    return { prev: string, current: "", next: "" };
};

export const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T"; // Trillion
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"; // Billion
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"; // Million
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"; // Thousand
    return num.toString(); // Less than 1K
}

export const formatHealthFactor = (num: number) => {
    if (num > 1e9) {
        return "∞";
    }
    return formatNumberByFrac(num);
}

export const getTimeAgo = (time: string) => {
    const v = formatDistanceToNow(new Date(time), { addSuffix: false });
    const result = v.replace("about ", "").replace(' ago', '').
        replace("seconds", 's').replace('second', 's').
        replace("less than a minute", '< 1m').
        replace("minutes", 'm').replace('minute', 'm').
        replace("hours", 'h').replace('hour', 'h').
        replace('days', 'd').replace('day', 'd').
        replace('months', 'mo').replace('month', 'mo');
    return result;
}