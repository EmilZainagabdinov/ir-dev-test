# IR Dev Test - Cryptocurrency Market Overview

A test task demonstrating Vue 3 development practices for building a cryptocurrency market data app. This project
showcases responsive design, real-time data handling, and interactive UI components.

## 🚀 Features

- **Interactive Market Table**: Sortable columns by coin name, price, price change, and volume
- **Filtering**: Filter table data by gaining/losing coins and search by coin name (search input has 500ms debounce)
- **Responsive Design**: Responsive app layout with breakpoint-based layouts
- **Price Charts**: Interactive line charts for price history visualization
- **Redundant request guardrails**: Data refresh request skipping while tab is unfocused. Also polling requests are
  skipped while the app is waiting for an initial response from both apis
- **TypeScript Support**: Full type safety throughout the application
- **Pre-commit linter hook**: Prevention of bad code being commited and pushed to repo
- **Unit tests**: Critical logic covered with tests

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite 6
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Charts**: Chart.js with vue-chartjs
- **UI Components**: Custom components with Reka UI
- **Icons**: Lucide Vue Next
- **Styling**: CSS with responsive breakpoints
- **Linting**: ESLint with Vue and TypeScript support
- **Tests:**: Vitest

## 📁 Project Structure

```
src/
├── api/                  # API configuration (Axios setup)
├── components/           # Vue components
│   ├── Footer/           # Footer component
│   ├── Header/           # Header component
│   ├── MarketTable/      # Market table components
│   └── UI/               # Reusable UI components
├── composables/          # Vue composables
├── router/               # Vue Router configuration
├── stores/               # Pinia stores
├── tests/                # Tests
│   └── unit/             # Unit tests
├── utils/                # Utility functions
├── views/                # Page components
└── main.ts               # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ir_dev_test
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Or use the provided install script:

   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with auto-fix
- `npm run test:run` - Run all tests
- `npm run test:coverage` - Run all tests with coverage summary

## 🔧 Configuration

### Development Server

The development server runs on port 3000 with automatic proxy configuration for API calls:

```
// vite.config.ts
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/test/api': {
                target: 'https://user26614.requestly.tech/',
                changeOrigin: true,
            },
        },
    }
```

- In case you need to use another api URL open `./vite.config.ts` configuration file. Change `target`'s value to desired url.
- In case you need to hit api directly, remove proxy configuration in vite's config file. Go to `.src/api/axiosConfig.ts` and change baseUrl value from `'/'` to desired api url.

### API Endpoints

- **Market Data**: `/test/api/market` - Fetches cryptocurrency trading pairs
- **Currency Config**: `/test/api/currency` - Fetches currency configuration

## 🔄 State Management

### Pinia Stores

- **Market Data Store**: Manages cryptocurrency trading data
- **Currency Config Store**: Manages currency configuration and additional data map with tickers, icons and fraction digits number.

### Features

- **Automatic Polling**: 10-second intervals for live data updates
- **Tab Focus Detection**: Only updates when tab is active
- **Request Cancellation**: Aborts previous requests on new fetches
- **Filtering/Sorting**: Ability to filter and sort market data

## 📱 Responsive Design

The application uses custom breakpoints for responsive design:

- **Mobile (xs)**: < 480px
- **Small tablet (sm)**: < 768px
- **Tablet (md)**: < 1024px
- **Desktop (lg)**: < 1280px
- **Large Desktop (xl)**: >= 1280px

## 🚀 Deployment

### Vercel

The project includes `vercel.json` for deployment to Vercel via their web page GUI.

### Other Platforms

Build the project and deploy the `dist` folder:

```bash
  npm run build
```

## 🧪 Development

### Code Quality

- **ESLint**: Configured with Vue 3 and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking enabled

### Best Practices

- **Composition API**: Modern Vue 3 patterns
- **Type Safety**: Full TypeScript integration
- **Component Composition**: Reusable UI components
- **Performance**: Debounced search, request cancellation
