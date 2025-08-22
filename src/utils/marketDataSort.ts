import { TradePairData } from '@/stores/types.ts';
import { SortValue } from '@/components/MarketTable/types.ts';

export const marketDataSort = (sortValue: SortValue | '', data: TradePairData[], tickers: Record<string, { ticker: string; icon: string; fractionDigits: number }>) => {
  switch (sortValue) {
    case 'name_asc':
      data.sort((a, b) => {
        const valueA = tickers?.[a.pair.primary]?.ticker.toLowerCase() || a.pair.primary.toLowerCase();
        const valueB = tickers?.[b.pair.primary]?.ticker.toLowerCase()  || b.pair.primary.toLowerCase();

        if (valueA < valueB) {
          return -1;
        }
        if (valueA > valueB) {
          return 1;
        }
        return 0;
      });
      break;
    case 'name_desc': {
      data.sort((a, b) => {
        const valueA = tickers?.[a.pair.primary]?.ticker.toLowerCase() || a.pair.primary.toLowerCase();
        const valueB = tickers?.[b.pair.primary]?.ticker.toLowerCase() || b.pair.primary.toLowerCase();

        if (valueA < valueB) {
          return 1;
        }
        if (valueA > valueB) {
          return -1;
        }
        return 0;
      });
      break;
    }

    case 'price_asc': {
      data.sort((a, b) => {
        const valueA = parseFloat(a.price.last);
        const valueB = parseFloat(b.price.last);

        if (valueA < valueB) {
          return -1;
        }
        if (valueA > valueB) {
          return 1;
        }
        return 0;
      });
      break;
    }
    case 'price_desc': {
      data.sort((a, b) => {
        const valueA = parseFloat(a.price.last);
        const valueB = parseFloat(b.price.last);

        if (valueA < valueB) {
          return 1;
        }
        if (valueA > valueB) {
          return -1;
        }
        return 0;
      });
      break;
    }

    case 'priceChange_asc': {
      data.sort((a, b) => {
        const valueA = parseFloat(a.price.change.amount);
        const valueB = parseFloat(b.price.change.amount);

        if (valueA < valueB) {
          return -1;
        }
        if (valueA > valueB) {
          return 1;
        }
        return 0;
      });
      break;
    }
    case 'priceChange_desc': {
      data.sort((a, b) => {
        const valueA = parseFloat(a.price.change.amount);
        const valueB = parseFloat(b.price.change.amount);

        if (valueA < valueB) {
          return 1;
        }
        if (valueA > valueB) {
          return -1;
        }
        return 0;
      });
      break;
    }
    case 'volume_asc': {
      data.sort((a, b) => {
        const valueA = parseFloat(a.volume.secondary);
        const valueB = parseFloat(b.volume.secondary);

        if (valueA < valueB) {
          return -1;
        }
        if (valueA > valueB) {
          return 1;
        }
        return 0;
      });
      break;
    }
    case 'volume_desc': {
      data.sort((a, b) => {
        const valueA = parseFloat(a.volume.secondary);
        const valueB = parseFloat(b.volume.secondary);

        if (valueA < valueB) {
          return 1;
        }
        if (valueA > valueB) {
          return -1;
        }
        return 0;
      });
      break;
    }
    default:
      break;
  }
};
