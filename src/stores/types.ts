export interface CurrencyConfig {
  code: string;
  sort_order: number;
  ticker: string;
  type: string;
  decimals_places: number;
  icon: string;
}

export enum PriceChangeEnum {
  UP = 'Up',
  DOWN = 'Down',
}

export interface TradePairData {
  pair: {
    primary: string;
    secondary: string;
  }
  price: {
    last: string;
    bestBid: string;
    bestOffer: string;
    change: {
      direction: PriceChangeEnum;
      percent: string;
      amount: string;
    }
  }
  volume: {
    primary: string;
    secondary: string;
  }
  priceHistory: string[];
}