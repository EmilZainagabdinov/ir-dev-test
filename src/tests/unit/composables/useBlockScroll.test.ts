import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const mockBody = {
  style: {
    overflow: 'visible',
    color: 'black',
    fontSize: '14px',
  } as CSSStyleDeclaration,
};

Object.defineProperty(document, 'body', {
  value: mockBody,
  writable: true,
});

describe('useBlockScroll', () => {
  let useBlockScroll: () => { blockScroll: () => void; releaseScroll: () => void };

  beforeEach(async () => {
    mockBody.style.overflow = 'visible';

    vi.resetModules();
    const module = await import('@/composables/useBlockScroll');
    useBlockScroll = module.useBlockScroll;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('blockScroll', () => {
    it('should set body overflow to hidden', () => {
      const { blockScroll } = useBlockScroll();

      expect(mockBody.style.overflow).toBe('visible');

      blockScroll();

      expect(mockBody.style.overflow).toBe('hidden');
    });

    it('should not affect other body style properties', () => {
      const { blockScroll } = useBlockScroll();

      mockBody.style.color = 'red';
      mockBody.style.fontSize = '16px';

      blockScroll();

      expect(mockBody.style.overflow).toBe('hidden');
      expect(mockBody.style.color).toBe('red');
      expect(mockBody.style.fontSize).toBe('16px');
    });
  });

  describe('releaseScroll', () => {
    it('should set body overflow to visible', () => {
      const { releaseScroll } = useBlockScroll();

      mockBody.style.overflow = 'hidden';

      releaseScroll();

      expect(mockBody.style.overflow).toBe('visible');
    });

    it('should work correctly when called multiple times', () => {
      const { blockScroll, releaseScroll } = useBlockScroll();

      blockScroll();
      blockScroll();
      blockScroll();

      expect(mockBody.style.overflow).toBe('hidden');

      releaseScroll();
      releaseScroll();
      releaseScroll();

      expect(mockBody.style.overflow).toBe('visible');
    });
  });

  describe('composable structure', () => {
    it('should return an object with blockScroll and releaseScroll functions', () => {
      const result = useBlockScroll();

      expect(result).toBeTypeOf('object');
      expect(result).toHaveProperty('blockScroll');
      expect(result).toHaveProperty('releaseScroll');
      expect(typeof result.blockScroll).toBe('function');
      expect(typeof result.releaseScroll).toBe('function');
    });

    it('should return new function instances on each call', () => {
      const firstCall = useBlockScroll();
      const secondCall = useBlockScroll();

      expect(firstCall).not.toBe(secondCall);
      expect(firstCall.blockScroll).not.toBe(secondCall.blockScroll);
      expect(firstCall.releaseScroll).not.toBe(secondCall.releaseScroll);
    });
  });

  describe('function behavior', () => {
    it('should block and release scroll in sequence correctly', () => {
      const { blockScroll, releaseScroll } = useBlockScroll();

      expect(mockBody.style.overflow).toBe('visible');

      blockScroll();
      expect(mockBody.style.overflow).toBe('hidden');

      releaseScroll();
      expect(mockBody.style.overflow).toBe('visible');

      blockScroll();
      expect(mockBody.style.overflow).toBe('hidden');
    });

    it('should handle rapid successive calls', () => {
      const { blockScroll, releaseScroll } = useBlockScroll();

      blockScroll();
      blockScroll();
      blockScroll();
      releaseScroll();
      releaseScroll();
      blockScroll();

      expect(mockBody.style.overflow).toBe('hidden');
    });
  });

  describe('edge cases', () => {
    it('should work when body style is initially undefined', () => {
      const { blockScroll, releaseScroll } = useBlockScroll();

      const originalOverflow = mockBody.style.overflow;
      (mockBody.style as unknown as Record<string, unknown>).overflow = undefined;

      blockScroll();
      expect(mockBody.style.overflow).toBe('hidden');

      releaseScroll();
      expect(mockBody.style.overflow).toBe('visible');

      mockBody.style.overflow = originalOverflow;
    });

    it('should work with different overflow values', () => {
      const { blockScroll, releaseScroll } = useBlockScroll();

      const testValues = ['auto', 'scroll', 'hidden', 'visible', 'initial', 'inherit'];

      testValues.forEach((initialValue) => {
        mockBody.style.overflow = initialValue;

        blockScroll();
        expect(mockBody.style.overflow).toBe('hidden');

        releaseScroll();
        expect(mockBody.style.overflow).toBe('visible');
      });
    });
  });
});
