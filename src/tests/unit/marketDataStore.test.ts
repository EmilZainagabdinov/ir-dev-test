import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMarketDataStore } from '@/stores/marketData';
import { TradePairData, PriceChangeEnum } from '@/stores/types';
import axiosApi from '@/api/axiosApi';
import { CanceledError } from 'axios';

// Type for mock axios response
type MockAxiosResponse<T = unknown> = {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, unknown>;
  config: Record<string, unknown>;
};

vi.mock('@/api/axiosApi', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useMarketDataStore', () => {
  let store: ReturnType<typeof useMarketDataStore>;

  const mockMarketData: TradePairData[] = [
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
  ];

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useMarketDataStore();

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(store.data).toEqual([]);
      expect(store.initialFetch).toBe(true);
      expect(store.isFetching).toBe(false);
      expect(store.error).toBe(false);
      expect(store.abortController).toBe(null);
    });
  });

  describe('fetchMarketData', () => {
    it('should fetch market data successfully', async () => {
      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: mockMarketData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<TradePairData[]>);

      await store.fetchMarketData();

      expect(store.data).toEqual(mockMarketData);
      expect(store.initialFetch).toBe(false);
      expect(store.isFetching).toBe(false);
      expect(store.error).toBe(false);
      expect(store.abortController).toBe(null);

      expect(vi.mocked(axiosApi.get)).toHaveBeenCalledWith('/test/api/market', {
        signal: expect.any(AbortSignal),
      });
      expect(vi.mocked(axiosApi.get)).toHaveBeenCalledTimes(1);
    });

    it('should set loading state during fetch', async () => {
      let resolvePromise:
        | ((value: {
            data: TradePairData[];
            status: number;
            statusText: string;
            headers: Record<string, unknown>;
            config: Record<string, unknown>;
          }) => void)
        | undefined;
      const mockPromise = new Promise<{
        data: TradePairData[];
        status: number;
        statusText: string;
        headers: Record<string, unknown>;
        config: Record<string, unknown>;
      }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(axiosApi.get).mockReturnValueOnce(mockPromise);

      const fetchPromise = store.fetchMarketData();

      expect(store.isFetching).toBe(true);
      expect(store.error).toBe(false);

      if (resolvePromise) {
        resolvePromise({
          data: mockMarketData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        });
      }

      await fetchPromise;

      expect(store.isFetching).toBe(false);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      vi.mocked(axiosApi.get).mockRejectedValueOnce(mockError);

      await store.fetchMarketData();

      expect(store.error).toBe(true);
      expect(store.isFetching).toBe(false);
      expect(store.abortController).toBe(null);
      expect(store.data).toEqual([]);
    });

    it('should handle CanceledError without setting error state', async () => {
      const canceledError = new CanceledError('Request canceled');
      vi.mocked(axiosApi.get).mockRejectedValueOnce(canceledError);

      await store.fetchMarketData();

      expect(store.error).toBe(false);
      expect(store.isFetching).toBe(false);
      expect(store.abortController).toBe(null);
    });

    it('should abort previous request when starting new one', async () => {
      const firstRequest = new Promise(() => {
        // This promise never resolves, simulating a hanging request
      });

      vi.mocked(axiosApi.get).mockReturnValueOnce(firstRequest);

      store.fetchMarketData();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(store.abortController).toBeInstanceOf(AbortController);

      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: mockMarketData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<TradePairData[]>);

      await store.fetchMarketData();

      expect(store.data).toEqual(mockMarketData);
      expect(store.isFetching).toBe(false);
      expect(store.abortController).toBe(null);
    });

    it('should handle multiple rapid requests correctly', async () => {
      const responses = mockMarketData.map(
        (_, index) =>
          ({
            data: [{ ...mockMarketData[index] }],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          }) as MockAxiosResponse<TradePairData[]>,
      );

      vi.mocked(axiosApi.get).mockResolvedValueOnce(responses[0]).mockResolvedValueOnce(responses[1]);

      const promises = [store.fetchMarketData(), store.fetchMarketData()];

      await Promise.all(promises);

      expect(store.data).toEqual(responses[1].data);
      expect(store.isFetching).toBe(false);
      expect(store.abortController).toBe(null);
    });

    it('should preserve existing data on error', async () => {
      store.data = mockMarketData;

      vi.mocked(axiosApi.get).mockRejectedValueOnce(new Error('Network error'));

      await store.fetchMarketData();

      expect(store.data).toEqual(mockMarketData);
      expect(store.error).toBe(true);
    });

    it('should handle empty response data', async () => {
      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<never[]>);

      await store.fetchMarketData();

      expect(store.data).toEqual([]);
      expect(store.initialFetch).toBe(false);
      expect(store.isFetching).toBe(false);
      expect(store.error).toBe(false);
    });

    it('should handle response with null/undefined data', async () => {
      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<null>);

      await store.fetchMarketData();

      expect(store.data).toBeNull();
      expect(store.initialFetch).toBe(false);
      expect(store.isFetching).toBe(false);
      expect(store.error).toBe(false);
    });
  });

  describe('abort controller behavior', () => {
    it('should create new AbortController for each request', async () => {
      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: mockMarketData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<TradePairData[]>);

      await store.fetchMarketData();

      expect(store.abortController).toBe(null);
      expect(vi.mocked(axiosApi.get)).toHaveBeenCalledWith('/test/api/market', {
        signal: expect.any(AbortSignal),
      });
    });

    it('should abort previous request when starting new one', async () => {
      const mockPromise = new Promise((resolve) => resolve);

      vi.mocked(axiosApi.get).mockReturnValueOnce(mockPromise);

      store.fetchMarketData();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const firstAbortController = store.abortController;
      expect(firstAbortController).toBeInstanceOf(AbortController);

      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: mockMarketData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<TradePairData[]>);

      await store.fetchMarketData();

      expect(firstAbortController?.signal.aborted).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle store reinitialization', () => {
      const newStore = useMarketDataStore();

      expect(newStore.data).toEqual([]);
      expect(newStore.initialFetch).toBe(true);
      expect(newStore.isFetching).toBe(false);
      expect(newStore.error).toBe(false);
      expect(newStore.abortController).toBe(null);
    });

    it('should handle concurrent store instances', async () => {
      const store1 = useMarketDataStore();
      const store2 = useMarketDataStore();

      vi.mocked(axiosApi.get).mockResolvedValue({
        data: mockMarketData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<TradePairData[]>);

      await Promise.all([store1.fetchMarketData(), store2.fetchMarketData()]);

      expect(store1.data).toEqual(mockMarketData);
      expect(store2.data).toEqual(mockMarketData);
    });
  });
});
