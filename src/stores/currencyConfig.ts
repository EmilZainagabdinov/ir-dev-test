import { defineStore } from 'pinia';
// import { /*mandeApi,*/ mandeDirectApi } from '@/api/mandeApi.ts';
import { CurrencyConfig } from '@/stores/types.ts';
import { currencyConfigMock } from '@/stores/mocks/currencyMock.ts';

interface State {
  data: CurrencyConfig[];
  tickersMap: Record<string, { ticker: string; icon: string, fractionDigits: number }>;
  initialFetch: boolean;
  isFetching: boolean;
  error: boolean;
}
export const useCurrencyConfigStore = defineStore('currencyConfig', {
  state: (): State => {
    return {
      data: [],
      tickersMap: {},
      initialFetch: true,
      isFetching: false,
      error: false,
    };
  },

  actions: {
    createTickersMap(config: CurrencyConfig[]): void {
      config.forEach((item) => {
        if (this.tickersMap[item.code]) return;

        this.tickersMap[item.code] = { ticker: item.ticker, icon: item.icon, fractionDigits: item.decimals_places };
      });
    },
    async fetchCurrencyConfig() {
      this.isFetching = true;
      this.error = false;
      try {
        // this.data = await mandeApi.get<CurrencyConfig[]>('/currency');
        // const response = await mandeDirectApi.get<CurrencyConfig[]>('/currency?username=user26614');

        // this.createTickersMap(response);
        // this.data = response;

        const response = new Promise((resolve) => {
          setTimeout(() => {
            resolve('');
          }, 1500);
        });
        await response;
        this.createTickersMap(currencyConfigMock);
        this.data = currencyConfigMock;
      } catch {
        this.error = true;
      } finally {
        this.initialFetch = false;
        this.isFetching = false;
      }
    },
  },
});
