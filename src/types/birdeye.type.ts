export interface mintPriceResponseItemType {
    value: number
    updateUnixTime: number
    updateHumanTime: string
    priceInNative: number
    priceChange24h: number
}

export type mintPriceResponse = { data: Record<string, mintPriceResponseItemType> }