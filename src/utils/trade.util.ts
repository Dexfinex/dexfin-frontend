import moment from "moment/moment";
import { EXCHANGE_ICONS_URL } from "../constants/mock/tradepairs";

// Type definitions
type NumberFormat = string | undefined;
type ExchangeKey = string;

/**
 * Converts a number into a formatted string with appropriate suffix (k, M, B, T)
 * @param number - The number to format
 * @returns Formatted string with suffix
 */
export function convertNumberIntoFormat(number: number): NumberFormat {
    const num = Number(number);
    
    if (num < 1e3) {
        return formatNumberByFrac(num);
    } else if (num >= 1e3 && num < 1e6) {
        return (Math.floor((num / 1e3) * 100) / 100).toFixed(2) + 'k';
    } else if (num >= 1e6 && num < 1e9) {
        return (Math.floor((num / 1e6) * 100) / 100).toFixed(2) + 'M';
    } else if (num >= 1e9 && num < 1e12) {
        return (Math.floor((num / 1e9) * 100) / 100).toFixed(2) + 'B';
    } else if (num >= 1e12) {
        return (Math.floor((num / 1e12) * 100) / 100).toFixed(2) + 'T';
    }
}

/**
 * Formats a number with appropriate decimal places
 * @param num - The number to format
 * @param fixedCount - Number of decimal places
 * @returns Formatted number string
 */
export const formatNumberByFrac = (num: number | string, fixedCount = 2): string => {
    const threshold = 0.01;
    const minThreshold = 0.000001;
    const parsedNum = parseFloat(String(num));

    const getFixedNum = (value: number, decimals: number): string => {
        const multipleValue = 10 ** decimals;
        return (Math.floor(value * multipleValue) / multipleValue).toString();
    };

    if (Number.isInteger(parsedNum) || 
        (Math.abs(parsedNum) < threshold && Math.abs(parsedNum) > minThreshold)) {
        const lengthAfterDecimal = Math.ceil(Math.log10(1 / parsedNum));
        if (parsedNum > 0 && lengthAfterDecimal > 0) {
            return getFixedNum(parsedNum, lengthAfterDecimal + 2);
        }
    }

    return getFixedNum(parsedNum, fixedCount);
};

/**
 * Converts a number to fixed precision float
 * @param number - The number to convert
 * @param precision - Decimal precision
 * @returns Formatted float string
 */
export function toFixedFloat(number: number | string, precision?: number): string {
    const num = Number(number);
    const decimals = Math.min(precision ?? 2, 6);
    return parseFloat(num.toFixed(decimals)).toString();
}

/**
 * Formats a date using moment.js
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | number): string => {
    return moment(date).format('M/D/YYYY h:mm:ss A');
};

/**
 * Gets a formatted exchange description from an exchange key
 * @param exchangeKey - The exchange identifier
 * @returns Formatted exchange description
 */
export function getRealExchangeDescription(exchangeKey: ExchangeKey): string {
    if (!exchangeKey) {
        return '';
    }

    const terms = exchangeKey.split('_');
    let realExchange = terms[0].charAt(0).toUpperCase() + 
                      terms[0].slice(1).toLowerCase();

    if (terms[1]) {
        const realVersion = `v${terms[1].replace(/[V,v]/g, '')}`;
        realExchange += ' ' + realVersion;
    }

    if (terms[2]) {
        const realFee = terms[2] + (terms[3] ? `.${terms[3]}` : '') + '%';
        realExchange += ' ' + realFee;
    }

    return realExchange;
}

/**
 * Gets the exchange icon URL from an exchange key
 * @param exchangeKey - The exchange identifier
 * @returns Exchange icon URL
 */
export function getExchangeIconUrlFrom(exchangeKey: ExchangeKey): string {
    if (!exchangeKey) {
        return '';
    }

    const terms = exchangeKey.split('_');
    const realExchange = terms[0].toLowerCase();

    return `${EXCHANGE_ICONS_URL}${realExchange}.svg`;
}