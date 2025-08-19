import { useMediaQuery } from '@vueuse/core';

export const useBreakpoints = () => {
  const isXs = useMediaQuery('(width < 480px)');
  const isSm = useMediaQuery('(width < 768px)');
  const isMd = useMediaQuery('(width < 1024px)');
  const isLg = useMediaQuery('(width < 1280px)');
  const isXl = useMediaQuery('(width >= 1280px)');

  return { isXs, isSm, isMd, isLg, isXl };
};
