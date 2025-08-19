import { defineStore } from 'pinia'
// import { /*mandeApi,*/ mandeDirectApi } from '@/api/mandeApi.ts';
import { TradePairData } from '@/stores/types.ts';
import { marketDataMock } from '@/stores/mocks/marketDataMock.ts';

interface State {
  data: TradePairData[];
  initialFetch: boolean;
  isFetching: boolean;
  error: boolean;
}

export const useMarketDataStore = defineStore('marketData', {
  state: (): State => {
    return {
      data: [],
      initialFetch: true,
      isFetching: false,
      error: false,
    }
  },

  actions: {
    async fetchMarketData() {
      this.isFetching = true;
      this.error = false;
      try {
        // this.data = await mandeApi.get<TradePairData[]>('/market');
        // this.data = await mandeDirectApi.get<TradePairData[]>('/market?username=user26614');

        const response = new Promise((resolve) => {
          setTimeout(() => {
          resolve('');
          }, 1000);
        });
        await response;
        this.data = marketDataMock as TradePairData[];
      } catch {
        this.error = true;
      } finally {
        this.initialFetch = false;
        this.isFetching = false;
      }
    },
  },
})
