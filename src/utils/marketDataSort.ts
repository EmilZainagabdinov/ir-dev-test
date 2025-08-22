import { TradePairData } from '@/stores/types.ts';
import { SortColumns, SortOrder, SortValue } from '@/components/MarketTable/types.ts';

export const marketDataSort = (sortValue: SortValue | '', data: TradePairData[], tickers: Record<string, { ticker: string; icon: string; fractionDigits: number }>) => {
  if (!sortValue) return;

  const [sortKey, sortDirection] = sortValue.split('_') as [SortColumns, SortOrder];
  const isAscending = sortDirection === 'asc';

  const sortData = (getValue: (item: TradePairData) => number | string) => {
    data.sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);
      
      if (valueA < valueB) return isAscending ? -1 : 1;
      if (valueA > valueB) return isAscending ? 1 : -1;
      return 0;
    });
  };

  const sortKeyMap = {
    name: (item: TradePairData) => 
      tickers?.[item.pair.primary]?.ticker.toLowerCase() || item.pair.primary.toLowerCase(),
    price: (item: TradePairData) => parseFloat(item.price.last),
    priceChange: (item: TradePairData) => parseFloat(item.price.change.amount),
    volume: (item: TradePairData) => parseFloat(item.volume.secondary),
  };

  const valueExtractor = sortKeyMap[sortKey as keyof typeof sortKeyMap];
  if (valueExtractor) {
    sortData(valueExtractor);
  }
};
