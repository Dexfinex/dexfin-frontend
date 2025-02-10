import moment from "moment/moment";
import { EXCHANGE_ICONS_URL } from "../constants/mock/tradepairs";
export function convertNumberIntoFormat(number : number) {

    number = Number(number);
    if (number < 1e3) {
        return formatNumberByFrac(number); // for numbers less than 1000, return the number itself
    } else if (number >= 1e3 && number < 1e6) {
        return (Math.floor((number / 1e3) * 100) / 100).toFixed(2) + 'k'; // for thousands
    } else if (number >= 1e6 && number < 1e9) {
        return (Math.floor((number / 1e6) * 100) / 100).toFixed(2) + 'M'; // for millions
    } else if (number >= 1e9 && number < 1e12) {
        return (Math.floor((number / 1e9) * 100) / 100).toFixed(2) + 'B'; // for billions
    } else if (number >= 1e12) {
        return (Math.floor((number / 1e12) * 100) / 100).toFixed(2) + 'T'; // for trillions
    }
}

export const formatNumberByFrac = (num : any, fixedCount = 2) => {
    // Define the threshold below which numbers are shown as-is
    const threshold = 0.01;
    const minThreshold = 0.000001;
    num = parseFloat(num);

    const getFixedNum = (num : any, fixedCount : any) => {
        const multipleValue = (10 ** fixedCount);
        return (Math.floor(num * multipleValue) / multipleValue).toString();
    }

    // If the number is less than the threshold, keep it as-is, otherwise use toFixed()
    if (Number.isInteger(num) || (Math.abs(num) < threshold && Math.abs(num) > minThreshold )) {
        const lengthAfterDecimal = Math.ceil(Math.log10(1 / num));
        if (num > 0 && lengthAfterDecimal > 0) {
            return getFixedNum(num, lengthAfterDecimal + 2);
        }
    }

    return getFixedNum(num, fixedCount);
}

export function toFixedFloat(number : any, precision : any) {
    number = Number(number);
    return parseFloat(number.toFixed(Math.min(precision ? precision : 2, 6))).toString();
}

export const formatDate = (date : any) => {
    return moment(date).format('M/D/YYYY h:mm:ss A');
}
export function getRealExchangeDescription(exchangeKey) {

    if (!exchangeKey)
        return '';

    // Split the exchangeKey into its components.
    const terms = exchangeKey.split('_');

    // Reformat each part of the key for the final description.
    let realExchange = terms[0].charAt(0).toUpperCase() + terms[0].slice(1).toLowerCase(); // Capitalize only the first letter

    if (terms[1]) {
        let realVersion = '';
        realVersion = `v${terms[1].replace(/[V,v]/g, '')}`; // Replace underscores with dots and add 'v'
        realExchange += ' ' + realVersion;
    }

    if (terms[2]) {
        let realFee = '';
        realFee = terms[2] + (terms[3] ? `.${terms[3]}` : '') + '%';
        realExchange += ' ' + realFee;
    }

    return realExchange
}

export function getExchangeIconUrlFrom(exchangeKey) {

    if (!exchangeKey)
        return '';

    // Split the exchangeKey into its components.
    const terms = exchangeKey.split('_');

    // Reformat each part of the key for the final description.
    const realExchange = terms[0].toLowerCase(); // Capitalize only the first letter

    return EXCHANGE_ICONS_URL + realExchange + '.svg';
}
