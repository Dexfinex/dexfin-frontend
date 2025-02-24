import {ResolutionMapping} from "../types/chart.type.ts";

export const mapResolutionToTimeRange: ResolutionMapping = {
    "60": "1H",
    "1D": "1D",
    "1W": "1W",
    "1M": "1M",
    "1Y": "1Y",
};

export const mapTimeRangeToResolution: ResolutionMapping = {
    "1H": "60",
    "1D": "1D",
    "1W": "1W",
    "1M": "1M",
    "1Y": "1Y",
};
