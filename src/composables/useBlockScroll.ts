export const useBlockScroll = () => {
  const body = document.body;

  const blockScroll= () => body.style.overflow = 'hidden';
  const releaseScroll= () => body.style.overflow = 'visible';

  return {blockScroll, releaseScroll}
}