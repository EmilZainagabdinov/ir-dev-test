import { vi, afterEach } from 'vitest';

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  Title: {},
  Tooltip: {},
  Legend: {},
  LineElement: {},
  PointElement: {},
  CategoryScale: {},
  LinearScale: {},
  Filler: {},
}));

vi.mock('vue-chartjs', () => ({
  Line: {
    name: 'Line',
    template: '<div class="mock-chart"></div>',
  },
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
});
