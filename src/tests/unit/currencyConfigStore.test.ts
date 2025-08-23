import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCurrencyConfigStore } from '@/stores/currencyConfig';
import { CurrencyConfig } from '@/stores/types';
import axiosApi from '@/api/axiosApi';
import { CanceledError } from 'axios';

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

describe('useCurrencyConfigStore', () => {
  let store: ReturnType<typeof useCurrencyConfigStore>;

  const mockCurrencyConfig: CurrencyConfig[] = [
    {
      code: 'BTC',
      sort_order: 1,
      ticker: 'BTC',
      type: 'crypto',
      decimals_places: 8,
      icon: 'btc-icon',
    },
    {
      code: 'ETH',
      sort_order: 2,
      ticker: 'ETH',
      type: 'crypto',
      decimals_places: 18,
      icon: 'eth-icon',
    },
    {
      code: 'USD',
      sort_order: 3,
      ticker: 'USD',
      type: 'fiat',
      decimals_places: 2,
      icon: 'usd-icon',
    },
  ];

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCurrencyConfigStore();

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(store.data).toEqual([]);
      expect(store.tickersMap).toEqual({});
      expect(store.initialFetch).toBe(true);
      expect(store.isFetching).toBe(false);
      expect(store.error).toBe(false);
      expect(store.abortController).toBe(null);
    });
  });

  describe('createTickersMap', () => {
    it('should create tickers map from currency config', () => {
      store.createTickersMap(mockCurrencyConfig);

      expect(store.tickersMap).toEqual({
        BTC: {
          ticker: 'BTC',
          icon: 'btc-icon',
          fractionDigits: 8,
        },
        ETH: {
          ticker: 'ETH',
          icon: 'eth-icon',
          fractionDigits: 18,
        },
        USD: {
          ticker: 'USD',
          icon: 'usd-icon',
          fractionDigits: 2,
        },
      });
    });

    it('should not overwrite existing tickers in map', () => {
      store.tickersMap.BTC = {
        ticker: 'EXISTING_BTC',
        icon: 'existing-icon',
        fractionDigits: 10,
      };

      store.createTickersMap(mockCurrencyConfig);

      expect(store.tickersMap.BTC).toEqual({
        ticker: 'EXISTING_BTC',
        icon: 'existing-icon',
        fractionDigits: 10,
      });

      expect(store.tickersMap.ETH).toEqual({
        ticker: 'ETH',
        icon: 'eth-icon',
        fractionDigits: 18,
      });
    });

    it('should handle empty config array', () => {
      store.createTickersMap([]);
      expect(store.tickersMap).toEqual({});
    });

    it('should handle config with duplicate codes', () => {
      const configWithDuplicates: CurrencyConfig[] = [
        ...mockCurrencyConfig,
        {
          code: 'BTC',
          sort_order: 4,
          ticker: 'NEW_BTC',
          type: 'crypto',
          decimals_places: 6,
          icon: 'new-btc-icon',
        },
      ];

      store.createTickersMap(configWithDuplicates);

      expect(store.tickersMap.BTC).toEqual({
        ticker: 'BTC',
        icon: 'btc-icon',
        fractionDigits: 8,
      });
    });
  });

  describe('fetchCurrencyConfig', () => {
    it('should fetch currency config successfully', async () => {
      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: mockCurrencyConfig,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<CurrencyConfig[]>);

      await store.fetchCurrencyConfig();

      expect(store.data).toEqual(mockCurrencyConfig);
      expect(store.initialFetch).toBe(false);
      expect(store.isFetching).toBe(false);
      expect(store.error).toBe(false);
      expect(store.abortController).toBe(null);

      expect(store.tickersMap).toEqual({
        BTC: {
          ticker: 'BTC',
          icon: 'btc-icon',
          fractionDigits: 8,
        },
        ETH: {
          ticker: 'ETH',
          icon: 'eth-icon',
          fractionDigits: 18,
        },
        USD: {
          ticker: 'USD',
          icon: 'usd-icon',
          fractionDigits: 2,
        },
      });

      expect(vi.mocked(axiosApi.get)).toHaveBeenCalledWith('/test/api/currency', {
        signal: expect.any(AbortSignal),
      });
      expect(vi.mocked(axiosApi.get)).toHaveBeenCalledTimes(1);
    });

    it('should set loading state during fetch', async () => {
      let resolvePromise: ((value: MockAxiosResponse<CurrencyConfig[]>) => void) | undefined;
      const mockPromise = new Promise<MockAxiosResponse<CurrencyConfig[]>>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(axiosApi.get).mockReturnValueOnce(mockPromise);

      const fetchPromise = store.fetchCurrencyConfig();

      expect(store.isFetching).toBe(true);
      expect(store.error).toBe(false);

      if (resolvePromise) {
        resolvePromise({
          data: mockCurrencyConfig,
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

      await store.fetchCurrencyConfig();

      expect(store.error).toBe(true);
      expect(store.isFetching).toBe(false);
      expect(store.abortController).toBe(null);
      expect(store.data).toEqual([]);
      expect(store.tickersMap).toEqual({});
    });

    it('should handle CanceledError without setting error state', async () => {
      const canceledError = new CanceledError('Request canceled');
      vi.mocked(axiosApi.get).mockRejectedValueOnce(canceledError);

      await store.fetchCurrencyConfig();

      expect(store.error).toBe(false);
      expect(store.isFetching).toBe(false);
      expect(store.abortController).toBe(null);
    });

    it('should abort previous request when starting new one', async () => {
      const firstRequest = new Promise(() => {
        // This promise never resolves, simulating a hanging request
      });

      vi.mocked(axiosApi.get).mockReturnValueOnce(firstRequest);

      store.fetchCurrencyConfig();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(store.abortController).toBeInstanceOf(AbortController);

      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: mockCurrencyConfig,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<CurrencyConfig[]>);

      await store.fetchCurrencyConfig();

      expect(store.data).toEqual(mockCurrencyConfig);
      expect(store.isFetching).toBe(false);
      expect(store.abortController).toBe(null);
    });

    it('should handle multiple rapid requests correctly', async () => {
      const responses = mockCurrencyConfig.map(
        (_, index) =>
          ({
            data: [{ ...mockCurrencyConfig[index] }],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          }) as MockAxiosResponse<CurrencyConfig[]>,
      );

      vi.mocked(axiosApi.get).mockResolvedValueOnce(responses[0]).mockResolvedValueOnce(responses[1]);

      const promises = [store.fetchCurrencyConfig(), store.fetchCurrencyConfig()];

      await Promise.all(promises);

      expect(store.data).toEqual(responses[1].data);
      expect(store.isFetching).toBe(false);
      expect(store.abortController).toBe(null);
    });

    it('should preserve existing data on error', async () => {
      store.data = mockCurrencyConfig;
      store.createTickersMap(mockCurrencyConfig);

      vi.mocked(axiosApi.get).mockRejectedValueOnce(new Error('Network error'));

      await store.fetchCurrencyConfig();

      expect(store.data).toEqual(mockCurrencyConfig);
      expect(store.tickersMap).toEqual({
        BTC: {
          ticker: 'BTC',
          icon: 'btc-icon',
          fractionDigits: 8,
        },
        ETH: {
          ticker: 'ETH',
          icon: 'eth-icon',
          fractionDigits: 18,
        },
        USD: {
          ticker: 'USD',
          icon: 'usd-icon',
          fractionDigits: 2,
        },
      });
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

      await store.fetchCurrencyConfig();

      expect(store.data).toEqual([]);
      expect(store.tickersMap).toEqual({});
      expect(store.initialFetch).toBe(false);
      expect(store.isFetching).toBe(false);
      expect(store.error).toBe(false);
    });

    it('should handle response with malformed currency config data', async () => {
      const malformedConfig = [
        {
          code: 'MALFORMED',
          sort_order: 1,
          ticker: 'MALFORMED',
          type: 'crypto',
          decimals_places: 0,
          icon: 'malformed-icon',
        },
        {
          code: 'INVALID',
          sort_order: 2,
        } as unknown as CurrencyConfig,
      ];

      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: malformedConfig,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<CurrencyConfig[]>);

      await store.fetchCurrencyConfig();

      expect(store.data).toEqual(malformedConfig);
      expect(store.tickersMap).toEqual({
        MALFORMED: {
          ticker: 'MALFORMED',
          icon: 'malformed-icon',
          fractionDigits: 0,
        },
        INVALID: {
          ticker: undefined,
          icon: undefined,
          fractionDigits: undefined,
        },
      });
      expect(store.initialFetch).toBe(false);
      expect(store.isFetching).toBe(false);
      expect(store.error).toBe(false);
    });
  });

  describe('abort controller behavior', () => {
    it('should create new AbortController for each request', async () => {
      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: mockCurrencyConfig,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<CurrencyConfig[]>);

      await store.fetchCurrencyConfig();

      expect(store.abortController).toBe(null);
      expect(vi.mocked(axiosApi.get)).toHaveBeenCalledWith('/test/api/currency', {
        signal: expect.any(AbortSignal),
      });
    });

    it('should abort previous request when starting new one', async () => {
      const mockPromise = new Promise<MockAxiosResponse<CurrencyConfig[]>>((resolve) => resolve);

      vi.mocked(axiosApi.get).mockReturnValueOnce(mockPromise);

      store.fetchCurrencyConfig();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const firstAbortController = store.abortController;
      expect(firstAbortController).toBeInstanceOf(AbortController);

      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: mockCurrencyConfig,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<CurrencyConfig[]>);

      await store.fetchCurrencyConfig();

      expect(firstAbortController?.signal.aborted).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle store reinitialization', () => {
      const newStore = useCurrencyConfigStore();

      expect(newStore.data).toEqual([]);
      expect(newStore.tickersMap).toEqual({});
      expect(newStore.initialFetch).toBe(true);
      expect(newStore.isFetching).toBe(false);
      expect(newStore.error).toBe(false);
      expect(newStore.abortController).toBe(null);
    });

    it('should handle concurrent store instances', async () => {
      const store1 = useCurrencyConfigStore();
      const store2 = useCurrencyConfigStore();

      vi.mocked(axiosApi.get).mockResolvedValue({
        data: mockCurrencyConfig,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<CurrencyConfig[]>);

      await Promise.all([store1.fetchCurrencyConfig(), store2.fetchCurrencyConfig()]);

      expect(store1.data).toEqual(mockCurrencyConfig);
      expect(store2.data).toEqual(mockCurrencyConfig);
      expect(store1.tickersMap).toEqual(store2.tickersMap);
    });

    it('should handle currency config with missing optional fields', async () => {
      const minimalConfig: CurrencyConfig[] = [
        {
          code: 'MIN',
          sort_order: 1,
          ticker: 'MIN',
          type: 'crypto',
          decimals_places: 0,
          icon: 'min-icon',
        },
      ];

      vi.mocked(axiosApi.get).mockResolvedValueOnce({
        data: minimalConfig,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as MockAxiosResponse<CurrencyConfig[]>);

      await store.fetchCurrencyConfig();

      expect(store.data).toEqual(minimalConfig);
      expect(store.tickersMap.MIN).toEqual({
        ticker: 'MIN',
        icon: 'min-icon',
        fractionDigits: 0,
      });
    });
  });
});
