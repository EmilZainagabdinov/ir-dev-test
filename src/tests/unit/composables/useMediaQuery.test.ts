import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useMediaQuery } from '@vueuse/core';
import type { Ref } from 'vue';

vi.mock('@vueuse/core', () => ({
  useMediaQuery: vi.fn(),
}));

describe('useBreakpoints', () => {
  let useBreakpoints: () => {
    isXs: Ref<boolean>;
    isSm: Ref<boolean>;
    isMd: Ref<boolean>;
    isLg: Ref<boolean>;
    isXl: Ref<boolean>;
  };

  const createMockRef = (value: boolean): Ref<boolean> =>
    ({
      value,
      __v_isRef: true,
    }) as unknown as Ref<boolean>;

  const createAllMockRefs = (values: [boolean, boolean, boolean, boolean, boolean]) => {
    const [xsValue, smValue, mdValue, lgValue, xlValue] = values;
    return {
      mockIsXs: createMockRef(xsValue),
      mockIsSm: createMockRef(smValue),
      mockIsMd: createMockRef(mdValue),
      mockIsLg: createMockRef(lgValue),
      mockIsXl: createMockRef(xlValue),
    };
  };

  const setupMockReturns = (mocks: ReturnType<typeof createAllMockRefs>) => {
    vi.mocked(useMediaQuery).mockReturnValueOnce(mocks.mockIsXs);
    vi.mocked(useMediaQuery).mockReturnValueOnce(mocks.mockIsSm);
    vi.mocked(useMediaQuery).mockReturnValueOnce(mocks.mockIsMd);
    vi.mocked(useMediaQuery).mockReturnValueOnce(mocks.mockIsLg);
    vi.mocked(useMediaQuery).mockReturnValueOnce(mocks.mockIsXl);
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    vi.resetModules();
    const module = await import('@/composables/useMediaQuery');
    useBreakpoints = module.useBreakpoints;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('breakpoint queries', () => {
    it('should call useMediaQuery with correct breakpoint queries', () => {
      const mocks = createAllMockRefs([false, false, false, false, false]);
      setupMockReturns(mocks);

      useBreakpoints();

      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width < 480px)');
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width < 768px)');
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width < 1024px)');
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width < 1280px)');
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width >= 1280px)');
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledTimes(5);
    });

    it('should return all breakpoint refs', () => {
      const mocks = createAllMockRefs([true, false, true, false, true]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result).toHaveProperty('isXs');
      expect(result).toHaveProperty('isSm');
      expect(result).toHaveProperty('isMd');
      expect(result).toHaveProperty('isLg');
      expect(result).toHaveProperty('isXl');
    });
  });

  describe('breakpoint values', () => {
    it('should return correct boolean values for each breakpoint', () => {
      const mocks = createAllMockRefs([true, false, true, false, true]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result.isXs.value).toBe(true);
      expect(result.isSm.value).toBe(false);
      expect(result.isMd.value).toBe(true);
      expect(result.isLg.value).toBe(false);
      expect(result.isXl.value).toBe(true);
    });

    it('should handle all breakpoints being false', () => {
      const mocks = createAllMockRefs([false, false, false, false, false]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result.isXs.value).toBe(false);
      expect(result.isSm.value).toBe(false);
      expect(result.isMd.value).toBe(false);
      expect(result.isLg.value).toBe(false);
      expect(result.isXl.value).toBe(false);
    });

    it('should handle all breakpoints being true', () => {
      const mocks = createAllMockRefs([true, true, true, true, true]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result.isXs.value).toBe(true);
      expect(result.isSm.value).toBe(true);
      expect(result.isMd.value).toBe(true);
      expect(result.isLg.value).toBe(true);
      expect(result.isXl.value).toBe(true);
    });
  });

  describe('composable structure', () => {
    it('should return an object with all breakpoint properties', () => {
      const mockRefs = Array(5)
        .fill(null)
        .map(() => createMockRef(false));

      mockRefs.forEach((mockRef) => {
        vi.mocked(useMediaQuery).mockReturnValueOnce(mockRef);
      });

      const result = useBreakpoints();

      expect(result).toBeTypeOf('object');
      expect(Object.keys(result)).toHaveLength(5);
      expect(Object.keys(result)).toEqual(['isXs', 'isSm', 'isMd', 'isLg', 'isXl']);
    });

    it('should return new ref instances on each call', () => {
      const firstMockRefs = Array(5)
        .fill(null)
        .map(() => createMockRef(false));
      const secondMockRefs = Array(5)
        .fill(null)
        .map(() => createMockRef(false));

      firstMockRefs.forEach((mockRef) => {
        vi.mocked(useMediaQuery).mockReturnValueOnce(mockRef);
      });

      const firstCall = useBreakpoints();

      secondMockRefs.forEach((mockRef) => {
        vi.mocked(useMediaQuery).mockReturnValueOnce(mockRef);
      });

      const secondCall = useBreakpoints();

      expect(firstCall).not.toBe(secondCall);
      expect(firstCall.isXs).not.toBe(secondCall.isXs);
      expect(firstCall.isSm).not.toBe(secondCall.isSm);
      expect(firstCall.isMd).not.toBe(secondCall.isMd);
      expect(firstCall.isLg).not.toBe(secondCall.isLg);
      expect(firstCall.isXl).not.toBe(secondCall.isXl);
    });
  });

  describe('breakpoint logic', () => {
    it('should handle mobile-first responsive design pattern', () => {
      const mocks = createAllMockRefs([true, false, false, false, false]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result.isXs.value).toBe(true);
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width < 480px)');
    });

    it('should handle tablet breakpoint (width < 768px)', () => {
      const mocks = createAllMockRefs([false, true, false, false, false]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result.isSm.value).toBe(true);
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width < 768px)');
    });

    it('should handle desktop breakpoint (width < 1024px)', () => {
      const mocks = createAllMockRefs([false, false, true, false, false]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result.isMd.value).toBe(true);
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width < 1024px)');
    });

    it('should handle large desktop breakpoint (width < 1280px)', () => {
      const mocks = createAllMockRefs([false, false, false, true, false]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result.isLg.value).toBe(true);
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width < 1280px)');
    });

    it('should handle extra large breakpoint (width >= 1280px)', () => {
      const mocks = createAllMockRefs([false, false, false, false, true]);
      setupMockReturns(mocks);

      const result = useBreakpoints();

      expect(result.isXl.value).toBe(true);
      expect(vi.mocked(useMediaQuery)).toHaveBeenCalledWith('(width >= 1280px)');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined refs gracefully', () => {
      const mockUndefinedRef = undefined as unknown as Ref<boolean>;

      vi.mocked(useMediaQuery).mockReturnValue(mockUndefinedRef);

      const result = useBreakpoints();

      expect(result.isXs).toBeUndefined();
      expect(result.isSm).toBeUndefined();
      expect(result.isMd).toBeUndefined();
      expect(result.isLg).toBeUndefined();
      expect(result.isXl).toBeUndefined();
    });

    it('should handle null refs gracefully', () => {
      const mockNullRef = null as unknown as Ref<boolean>;

      vi.mocked(useMediaQuery).mockReturnValue(mockNullRef);

      const result = useBreakpoints();

      expect(result.isXs).toBeNull();
      expect(result.isSm).toBeNull();
      expect(result.isMd).toBeNull();
      expect(result.isLg).toBeNull();
      expect(result.isXl).toBeNull();
    });

    it('should work with different ref value types', () => {
      const mockStringRef = { value: 'true', __v_isRef: true } as unknown as Ref<boolean>;
      const mockNumberRef = { value: 1, __v_isRef: true } as unknown as Ref<boolean>;

      vi.mocked(useMediaQuery).mockReturnValueOnce(mockStringRef);
      vi.mocked(useMediaQuery).mockReturnValueOnce(mockNumberRef);
      vi.mocked(useMediaQuery).mockReturnValue(createMockRef(false));

      const result = useBreakpoints();

      expect(result.isXs.value).toBe('true');
      expect(result.isSm.value).toBe(1);
    });
  });
});
