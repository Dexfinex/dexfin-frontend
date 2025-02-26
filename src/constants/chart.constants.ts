import {ResolutionMapping} from "../types/chart.type.ts";

export const mapResolutionToTimeRange: ResolutionMapping = {
    "60": "1H",
    "1D": "1D",
    "1W": "1W",
    "1M": "1M",
    "12M": "1Y",
};

export const mapResolutionToSeconds: Record<string, number> = {
    "60": 3600,
    "1D": 86400,
    "1W": 604800,
    "1M": 2592000,
    "12M": 31536000,
};

export const mapTimeRangeToSeconds: Record<string, number> = {
    "1H": 3600,
    "1D": 86400,
    "1W": 604800,
    "1M": 2592000,
    "1Y": 31536000,
};

export const mapTimeRangeToResolution: ResolutionMapping = {
    "1H": "60",
    "1D": "1D",
    "1W": "1W",
    "1M": "1M",
    "1Y": "12M",
};
