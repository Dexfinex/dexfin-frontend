import axios from "axios";
import { COINGECKO_API_KEY, COINGECKO_BASE_URL, COINGECKO_BASE_URL_2, ZEROX_BASE_URL, CRYPTONEWS_BASE_URL, DEFILLAMA_BASE_URL, FEARGREED_BASE_URL, GECKOTERMINAL_BASE_URL, DEXFIN_BACKEND_BASE_URL, BRIAN_BASE_URL } from "../constants";

export const coinGeckoApi = axios.create({
    baseURL: COINGECKO_BASE_URL,
    headers: {
         
        'x-cg-pro-api-key': COINGECKO_API_KEY,
    },
});

export const zeroxApi = axios.create({
  baseURL: ZEROX_BASE_URL,
});

export const coinGeckoApi2 = axios.create({
  baseURL: COINGECKO_BASE_URL_2,
});

export const defillamaApi = axios.create({
  baseURL: DEFILLAMA_BASE_URL,
});

export const fearGreedApi = axios.create({
  baseURL: FEARGREED_BASE_URL,
});

export const geckoTerminalApi = axios.create({
  baseURL: GECKOTERMINAL_BASE_URL,
});

export const dexfinv3Api = axios.create({
    baseURL: DEXFIN_BACKEND_BASE_URL,
});
export const brianApi = axios.create({
  baseURL: BRIAN_BASE_URL,
});

export const cryptoNewsApi = axios.create({
    baseURL: CRYPTONEWS_BASE_URL,
});