import { defineStore } from 'pinia';
import { CurrencyConfig } from '@/stores/types.ts';
import axiosApi from '@/api/axiosApi.ts';
import { CanceledError } from 'axios';

interface State {
  data: CurrencyConfig[];
  tickersMap: Record<string, { ticker: string; icon: string; fractionDigits: number }>;
  initialFetch: boolean;
  isFetching: boolean;
  error: boolean;
  abortController: AbortController | null;
}
export const useCurrencyConfigStore = defineStore('currencyConfig', {
  state: (): State => {
    return {
      data: [],
      tickersMap: {},
      initialFetch: true,
      isFetching: false,
      error: false,
      abortController: null,
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
      if (this.data.length === 0) {
        this.initialFetch = true;
      }

      try {
        if (this.abortController) {
          this.abortController.abort();
        }

        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        const response = await axiosApi.get<CurrencyConfig[]>('/test/api/currency', { signal });

        this.createTickersMap(response.data);
        this.data = response.data;
      } catch (error) {
        if (error instanceof CanceledError) return;
        this.error = true;
      } finally {
        this.initialFetch = false;
        this.isFetching = false;
        this.abortController = null;
      }
    },
  },
});
