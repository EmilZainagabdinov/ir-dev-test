import { describe, it, expect, beforeEach } from 'vitest';
import { marketDataSort } from '@/utils/marketDataSort.ts';
import { TradePairData, PriceChangeEnum } from '@/stores/types.ts';
import { SortColumns, SortOrder } from '@/components/MarketTable/types.ts';

describe('marketDataSort', () => {
  let mockData: TradePairData[];
  let mockTickers: Record<string, { ticker: string; icon: string; fractionDigits: number }>;

  beforeEach(() => {
    mockData = [
      {
        pair: { primary: 'BTC', secondary: 'USD' },
        price: {
          last: '50000.00',
          bestBid: '49999.00',
          bestOffer: '50001.00',
          change: { direction: PriceChangeEnum.UP, percent: '5.2', amount: '2500.00' },
        },
        volume: { primary: '100.0', secondary: '5000000.00' },
        priceHistory: ['47500', '48000', '49000', '50000'],
      },
      {
        pair: { primary: 'ETH', secondary: 'USD' },
        price: {
          last: '3000.00',
          bestBid: '2999.00',
          bestOffer: '3001.00',
          change: { direction: PriceChangeEnum.DOWN, percent: '-2.1', amount: '-64.50' },
        },
        volume: { primary: '500.0', secondary: '1500000.00' },
        priceHistory: ['3064.50', '3050', '3020', '3000'],
      },
      {
        pair: { primary: 'ADA', secondary: 'USD' },
        price: {
          last: '1.50',
          bestBid: '1.49',
          bestOffer: '1.51',
          change: { direction: PriceChangeEnum.UP, percent: '15.0', amount: '0.20' },
        },
        volume: { primary: '10000.0', secondary: '15000.00' },
        priceHistory: ['1.30', '1.35', '1.45', '1.50'],
      },
    ];

    mockTickers = {
      BTC: { ticker: 'BTC', icon: 'btc-icon', fractionDigits: 2 },
      ETH: { ticker: 'ETH', icon: 'eth-icon', fractionDigits: 2 },
      ADA: { ticker: 'ADA', icon: 'ada-icon', fractionDigits: 4 },
    };
  });

  describe('when no sort value is provided', () => {
    it('should not modify the data array', () => {
      const originalData = [...mockData];
      marketDataSort('', mockData, mockTickers);

      expect(mockData).toEqual(originalData);
    });
  });

  describe('sorting by name', () => {
    it('should sort by name in ascending order', () => {
      marketDataSort(`${SortColumns.NAME}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ADA');
      expect(mockData[1].pair.primary).toBe('BTC');
      expect(mockData[2].pair.primary).toBe('ETH');
    });

    it('should sort by name in descending order', () => {
      marketDataSort(`${SortColumns.NAME}_${SortOrder.DESC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ETH');
      expect(mockData[1].pair.primary).toBe('BTC');
      expect(mockData[2].pair.primary).toBe('ADA');
    });

    it('should use ticker from tickers map when available', () => {
      mockTickers.BTC.ticker = 'ZBC';
      mockTickers.ETH.ticker = 'AETH';

      marketDataSort(`${SortColumns.NAME}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ADA');
      expect(mockData[1].pair.primary).toBe('ETH');
      expect(mockData[2].pair.primary).toBe('BTC');
    });

    it('should fallback to primary code when ticker not in map', () => {
      delete mockTickers.ETH;

      marketDataSort(`${SortColumns.NAME}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ADA');
      expect(mockData[1].pair.primary).toBe('BTC');
      expect(mockData[2].pair.primary).toBe('ETH');
    });

    it('should handle case-insensitive sorting', () => {
      mockTickers.BTC.ticker = 'btc';
      mockTickers.ETH.ticker = 'ETH';
      mockTickers.ADA.ticker = 'ada';

      marketDataSort(`${SortColumns.NAME}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ADA');
      expect(mockData[1].pair.primary).toBe('BTC');
      expect(mockData[2].pair.primary).toBe('ETH');
    });
  });

  describe('sorting by price', () => {
    it('should sort by price in ascending order', () => {
      marketDataSort(`${SortColumns.PRICE}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ADA');
      expect(mockData[1].pair.primary).toBe('ETH');
      expect(mockData[2].pair.primary).toBe('BTC');
    });

    it('should sort by price in descending order', () => {
      marketDataSort(`${SortColumns.PRICE}_${SortOrder.DESC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('BTC');
      expect(mockData[1].pair.primary).toBe('ETH');
      expect(mockData[2].pair.primary).toBe('ADA');
    });

    it('should handle string price values correctly', () => {
      mockData[0].price.last = '100.50';
      mockData[1].price.last = '50.25';
      mockData[2].price.last = '75.00';

      marketDataSort(`${SortColumns.PRICE}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ETH');
      expect(mockData[1].pair.primary).toBe('ADA');
      expect(mockData[2].pair.primary).toBe('BTC');
    });
  });

  describe('sorting by price change', () => {
    it('should sort by price change amount in ascending order', () => {
      marketDataSort(`${SortColumns.PRICE_CHANGE}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ETH');
      expect(mockData[1].pair.primary).toBe('ADA');
      expect(mockData[2].pair.primary).toBe('BTC');
    });

    it('should sort by price change amount in descending order', () => {
      marketDataSort(`${SortColumns.PRICE_CHANGE}_${SortOrder.DESC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('BTC');
      expect(mockData[1].pair.primary).toBe('ADA');
      expect(mockData[2].pair.primary).toBe('ETH');
    });

    it('should handle negative and positive changes correctly', () => {
      expect(mockData[1].price.change.amount).toBe('-64.50');
      expect(mockData[0].price.change.amount).toBe('2500.00');
      expect(mockData[2].price.change.amount).toBe('0.20');
    });
  });

  describe('sorting by volume', () => {
    it('should sort by volume in ascending order', () => {
      marketDataSort(`${SortColumns.VOLUME}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ADA');
      expect(mockData[1].pair.primary).toBe('ETH');
      expect(mockData[2].pair.primary).toBe('BTC');
    });

    it('should sort by volume in descending order', () => {
      marketDataSort(`${SortColumns.VOLUME}_${SortOrder.DESC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('BTC');
      expect(mockData[1].pair.primary).toBe('ETH');
      expect(mockData[2].pair.primary).toBe('ADA');
    });
  });

  describe('edge cases', () => {
    it('should handle empty data array', () => {
      const emptyData: TradePairData[] = [];
      marketDataSort(`${SortColumns.NAME}_${SortOrder.ASC}`, emptyData, mockTickers);

      expect(emptyData).toEqual([]);
    });

    it('should handle single item array', () => {
      const singleItem = [mockData[0]];
      marketDataSort(`${SortColumns.PRICE}_${SortOrder.DESC}`, singleItem, mockTickers);

      expect(singleItem).toHaveLength(1);
      expect(singleItem[0]).toBe(mockData[0]);
    });

    it('should handle missing tickers map', () => {
      const dataCopy = [...mockData];
      marketDataSort(`${SortColumns.NAME}_${SortOrder.ASC}`, dataCopy, {});

      expect(dataCopy[0].pair.primary).toBe('ADA');
      expect(dataCopy[1].pair.primary).toBe('BTC');
      expect(dataCopy[2].pair.primary).toBe('ETH');
    });

    it('should handle null/undefined tickers map', () => {
      const dataCopy = [...mockData];
      marketDataSort(`${SortColumns.NAME}_${SortOrder.ASC}`, dataCopy, {});

      expect(dataCopy[0].pair.primary).toBe('ADA');
      expect(dataCopy[1].pair.primary).toBe('BTC');
      expect(dataCopy[2].pair.primary).toBe('ETH');
    });

    it('should handle invalid sort values gracefully', () => {
      const dataCopy = [...mockData];
      const originalData = [...dataCopy];

      marketDataSort('invalid_asc' as `${SortColumns}_${SortOrder}`, dataCopy, mockTickers);
      expect(dataCopy).toEqual(originalData);
    });

    it('should handle numeric string parsing edge cases', () => {
      mockData[0].price.last = '0.0000001';
      mockData[1].price.last = '999999999.99';
      mockData[2].price.last = '0';

      marketDataSort(`${SortColumns.PRICE}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData[0].pair.primary).toBe('ADA');
      expect(mockData[1].pair.primary).toBe('BTC');
      expect(mockData[2].pair.primary).toBe('ETH');
    });
  });

  describe('data mutation behavior', () => {
    it('should mutate the original array', () => {
      const originalData = [...mockData];
      marketDataSort(`${SortColumns.NAME}_${SortOrder.ASC}`, mockData, mockTickers);

      expect(mockData).not.toEqual(originalData);
      expect(mockData).toHaveLength(originalData.length);
    });

    it('should preserve all data properties', () => {
      marketDataSort(`${SortColumns.PRICE}_${SortOrder.DESC}`, mockData, mockTickers);

      mockData.forEach((item) => {
        expect(item).toHaveProperty('pair');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('volume');
        expect(item).toHaveProperty('priceHistory');
      });
    });
  });
});
