export interface mintPriceResponseItemType {
  value: number
  updateUnixTime: number
  updateHumanTime: string
  priceInNative: number
  priceChange24h: number
}

export type mintPriceResponse = Record<string, mintPriceResponseItemType>