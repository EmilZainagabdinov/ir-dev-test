import { defineStore } from 'pinia';
import { TradePairData } from '@/stores/types.ts';
import axiosApi from '@/api/axiosApi.ts';
import { CanceledError } from 'axios';

interface State {
  data: TradePairData[];
  initialFetch: boolean;
  isFetching: boolean;
  error: boolean;
  abortController: AbortController | null;
}

export const useMarketDataStore = defineStore('marketData', {
  state: (): State => ({
    data: [],
    initialFetch: true,
    isFetching: false,
    error: false,
    abortController: null,
  }),

  actions: {
    async fetchMarketData() {
      this.isFetching = true;
      this.error = false;

      try {
        if (this.abortController) {
          this.abortController.abort();
        }

        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        const response = await axiosApi.get<TradePairData[]>('/test/api/market', { signal });
        this.data = response.data;
        this.initialFetch = false;
      } catch (error: unknown) {
        if (error instanceof CanceledError) return;
        this.error = true;
      } finally {
        this.isFetching = false;
        this.abortController = null;
      }
    },
  },
});
