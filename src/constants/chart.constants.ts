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
    "1H": 259200,
    "1D": 604800,
    "1W": 2592000,
    "1M": 7776000,
    "1Y": 15552000,
};

export const mapTimeRangeToExactSeconds: Record<string, number> = {
    "1H": 3600,
    "1D": 86400,
    "1W": 604800,
    "1M": 2592000,
    "1Y": 31536000,
};

export const mapTimeRangeToSecondsForBirdEye: Record<string, number> = {
    "1H": 2592000,
    "1D": 6048000,
    "1W": 25920000,
    "1M": 77760000,
    "1Y": 155520000,
};

export const mapTimeRangeToResolution: ResolutionMapping = {
    "1H": "60",
    "1D": "1D",
    "1W": "1W",
    "1M": "1M",
    "1Y": "12M",
};
