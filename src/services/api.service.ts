import axios from "axios";

import { COINGECKO_BASE_URL, ZEROX_BASE_URL, CRYPTONEWS_BASE_URL, DEFILLAMA_BASE_URL, FEARGREED_BASE_URL, GECKOTERMINAL_BASE_URL, DEXFIN_BACKEND_BASE_URL, BRIAN_BASE_URL, ENSO_BASE_URL, BIRDEYE_BASE_URL, OPENAI_BASE_URL, CALENDAR_BASE_URL, USERAUTH_BASE_URL, TechnicalAnalysis_BASE_URL } from "../constants";

export const zeroxApi = axios.create({
  baseURL: ZEROX_BASE_URL,
});

export const coinGeckoApi = axios.create({
  baseURL: COINGECKO_BASE_URL,
});

export const birdeyeApi = axios.create({
  baseURL: BIRDEYE_BASE_URL,
});

export const defillamaApi = axios.create({
  baseURL: DEFILLAMA_BASE_URL,
});

export const fearGreedApi = axios.create({
  baseURL: FEARGREED_BASE_URL,
});

export const marketSentimentApi = axios.create({

})

export const geckoTerminalApi = axios.create({
  baseURL: GECKOTERMINAL_BASE_URL,
});

export const dexfinv3Api = axios.create({
  baseURL: DEXFIN_BACKEND_BASE_URL,
});
export const brianApi = axios.create({
  baseURL: BRIAN_BASE_URL,
});

export const openaiApi = axios.create({
  baseURL: OPENAI_BASE_URL,
});

export const cryptoNewsApi = axios.create({
  baseURL: CRYPTONEWS_BASE_URL,
});

export const enSoApi = axios.create({
  baseURL: ENSO_BASE_URL,
});

export const calendarApi = axios.create({
  baseURL: CALENDAR_BASE_URL,
})

export const userAuthApi = axios.create({
  baseURL: USERAUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});
export const technicalanalysisApi = axios.create({
  baseURL: TechnicalAnalysis_BASE_URL
})