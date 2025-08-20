<template>
  <div class="tableWrapper">
    <table class="marketTable">
      <thead class="marketTableHead">
        <tr>
          <th class="coinHeader">Coin</th>
          <th>Price</th>
          <th>Change</th>
          <th v-if="!isSm">Volume</th>
          <th v-if="isXl">Price chart</th>
        </tr>
      </thead>
      <tbody class="marketTableBody">
        <MarketTableRow
          v-if="!isFetching"
          v-for="item in marketData.data"
          :key="item.pair.primary"
          :trade-pair-data="item"
        />
        <MarketTableSkeleton v-else />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useCurrencyConfigStore } from '@/stores/currencyConfig.ts';
import { useMarketDataStore } from '@/stores/marketData.ts';

import MarketTableRow from './MarketTableRow.vue';
import MarketTableSkeleton from '@/components/MarketTable/MarketTableSkeleton.vue';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';

const currencyConfig = useCurrencyConfigStore();
const marketData = useMarketDataStore();

let pollingInterval: ReturnType<typeof setTimeout>;

const isFetching = computed(() => currencyConfig.initialFetch || marketData.initialFetch);
const { isSm, isXl } = useBreakpoints();

onMounted(() => {
  currencyConfig.fetchCurrencyConfig();
  marketData.fetchMarketData();

  pollingInterval = setInterval(() => {
    currencyConfig.fetchCurrencyConfig();
    marketData.fetchMarketData();
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});
</script>

<style scoped>
.tableWrapper {
  margin: 48px auto;
  color: #1e1e1e;
  width: max-content;
  border: 1px solid #bebebe;
  border-radius: 16px;
  @media (width <= 1280px) {
    margin: 48px 40px;
    width: auto;
  }
  @media (width <= 768px) {
    margin: 24px;
  }
  @media (width <= 480px) {
    margin: 12px;
  }
}
.marketTable {
  border-collapse: collapse;
  table-layout: fixed;
  width: 1200px;
  white-space: nowrap;
  @media (width < 1280px) {
    width: 100%;
  }
  @media (width < 1024px) {
    font-size: 16px;
  }
  @media (width < 768px) {
    font-size: 14px;
  }
}
.marketTableHead {
  background-color: #dcdce1;
  color: #646469;

  & th {
    padding: 16px 32px;
    border-bottom: 1px solid #bebebe;
    @media (width < 1024px) {
      padding: 12px 18px;
    }
    @media (width < 768px) {
      padding: 12px 12px;
      &:not(.coinHeader) {
        text-align: right;
      }
    }
  }
  & th:first-child {
    border-top-left-radius: 16px;
  }
  & th:last-child {
    border-top-right-radius: 16px;
  }
}
.coinHeader {
  width: 400px;
  text-align: left;
  @media (width < 1280px) {
    width: 20%;
  }
  @media (width < 1024px) {
    width: auto;
  }
}
</style>

<style>
.marketTableBody {
  background-color: #e6e6e6;
  & tr {
    cursor: pointer;
    &:hover {
      background-color: #ebebeb;
    }
  }
  & td {
    padding: 16px 32px;
    border-bottom: 1px solid #bebebe;
    font-weight: 550;
    @media (width < 1024px) {
      padding: 12px 18px;
    }
    @media (width < 768px) {
      padding: 12px 8px;
    }
  }
  & tr:last-child td {
    border-bottom: none;

    &:first-child {
      border-bottom-left-radius: 16px;
    }
    &:last-child {
      border-bottom-right-radius: 16px;
    }
  }
}
</style>
