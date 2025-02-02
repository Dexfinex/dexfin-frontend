import axios from "axios";
import {COINGECKO_API_KEY, COINGECKO_BASE_URL, ZEROX_BASE_URL} from "../constants";

export const coinGeckoApi = axios.create({
    baseURL: COINGECKO_BASE_URL,
    headers: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        'x-cg-pro-api-key': COINGECKO_API_KEY,
    },
});

export const zeroxApi = axios.create({
    baseURL: ZEROX_BASE_URL,
});
