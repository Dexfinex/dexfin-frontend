import axios from "axios";
import { COINGECKO_API_KEY, COINGECKO_BASE_URL, COINGECKO_BASE_URL_2, ZEROX_BASE_URL, CRYPTONEWS_BASE_URL, DEFILLAMA_BASE_URL, FEARGREED_BASE_URL, GECKOTERMINAL_BASE_URL } from "../constants";

export const coinGeckoApi = axios.create({
<<<<<<< HEAD
  baseURL: COINGECKO_BASE_URL,
  headers: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    'x-cg-pro-api-key': COINGECKO_API_KEY,
  },
=======
    baseURL: COINGECKO_BASE_URL,
    headers: {
         
        'x-cg-pro-api-key': COINGECKO_API_KEY,
    },
>>>>>>> 13bb32e ([Feat]: transfer tokens in wallet screen)
});

export const zeroxApi = axios.create({
  baseURL: ZEROX_BASE_URL,
});

export const cryptoNewsApi = axios.create({
  baseURL: CRYPTONEWS_BASE_URL,
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