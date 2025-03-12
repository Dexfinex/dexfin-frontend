import axios, {AxiosInstance} from "axios";

import {
  COINGECKO_BASE_URL,
  ZEROX_BASE_URL,
  CRYPTONEWS_BASE_URL,
  DEFILLAMA_BASE_URL,
  FEARGREED_BASE_URL,
  GECKOTERMINAL_BASE_URL,
  DEXFIN_BACKEND_BASE_URL,
  BRIAN_BASE_URL,
  ENSO_BASE_URL,
  BIRDEYE_BASE_URL,
  OPENAI_BASE_URL,
  CALENDAR_BASE_URL,
  USERAUTH_BASE_URL,
  TECHNICALANALYSIS_BASE_URL,
  GAME_SYSTEM_BASEURL,
  WS_CONNECTION_URL,
  ALERT_BASE_URL,
  SWAPKIT_BASE_URL,
  NOTIFICATION_BASE_URL
} from "../constants";

export const zeroxApi = axios.create({
    baseURL: ZEROX_BASE_URL,
});

export const swapkitApi = axios.create({
    baseURL: SWAPKIT_BASE_URL,
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
});

export const TechnicalAnalysisApi = axios.create({
    baseURL: TECHNICALANALYSIS_BASE_URL
})

export const WS_BASE_URL = WS_CONNECTION_URL;
export const GameSystemApi = axios.create({
    baseURL: GAME_SYSTEM_BASEURL
})

export const AlertBaseApi = axios.create({
    baseURL: ALERT_BASE_URL
})

export const NotificationApi = axios.create({
  baseURL: NOTIFICATION_BASE_URL
})

// List of API instances that need authorization
const authorizedApis: AxiosInstance[] = [
    userAuthApi,
    dexfinv3Api,
    GameSystemApi,
    AlertBaseApi,
    TechnicalAnalysisApi,
    zeroxApi,
    swapkitApi,
    calendarApi,
    // Add any other APIs that need authorization
];

// Utility function to set auth token for all APIs
export const setAuthToken = (token: string | null) => {
    if (token) {
        // Set for all authorized APIs
        authorizedApis.forEach(api => {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        });
    } else {
        // Clear token if null is passed
        authorizedApis.forEach(api => {
            delete api.defaults.headers.common['Authorization'];
        });
    }
};
