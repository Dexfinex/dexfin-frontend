import {ResolutionMapping} from "../types/chart.type.ts";

export const mapResolutionToTimeRange: ResolutionMapping = {
    "1": "1m",
    "5": "5m",
    "15": "15m",
    "30": "30m",
    "60": "1H",
    "240": "4H",
    "1D": "1D",
    "1W": "1W"
};

export const mapTimeRangeToResolution: ResolutionMapping = {
    "1m": "1",
    "5m": "5",
    "15m": "15",
    "30m": "30",
    "1H": "60",
    "4H": "240",
    "1D": "1D",
    "1W": "1W"
};
