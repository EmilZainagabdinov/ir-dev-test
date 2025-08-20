<template>
  <div class="wrapper">
    <div class="filtersBar">
      <div class="searchFieldWrapper">
        <Search color="#646469" :size="18" class="searchFieldIcon" />
        <input id="marketSearch" class="searchField" type="text" placeholder="Search..." v-model="search" />
      </div>
    </div>
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
            v-for="item in filteredMarketList"
            :key="item.pair.primary"
            :trade-pair-data="item"
          />
          <MarketTableSkeleton v-else />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Search } from 'lucide-vue-next';
import { watchDebounced } from '@vueuse/core';
import { useCurrencyConfigStore } from '@/stores/currencyConfig.ts';
import { useMarketDataStore } from '@/stores/marketData.ts';

import MarketTableRow from './MarketTableRow.vue';
import MarketTableSkeleton from '@/components/MarketTable/MarketTableSkeleton.vue';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';
import { storeToRefs } from 'pinia';
import { TradePairData } from '@/stores/types.ts';

const currencyConfig = useCurrencyConfigStore();
const marketData = useMarketDataStore();
const { isSm, isXl } = useBreakpoints();
let pollingInterval: ReturnType<typeof setTimeout>;
const { data: marketDataList } = storeToRefs(marketData);

const search = ref('');
const debouncedSearch = ref('');
const filteredMarketList = ref<TradePairData[]>([]);

watchDebounced(
  search,
  () => {
    debouncedSearch.value = search.value.trim().toLowerCase();
  },
  { debounce: 500 },
);

const isFetching = computed(() => currencyConfig.initialFetch || marketData.initialFetch);

watch([marketDataList, debouncedSearch], () => {
  let marketListCopy = [...marketDataList.value];

  if (debouncedSearch.value) {
    marketListCopy = marketListCopy.filter(
      (tradePair) =>
        tradePair.pair.primary.toLowerCase().includes(debouncedSearch.value) ||
        currencyConfig.tickersMap?.[tradePair.pair.primary]?.ticker.toLowerCase().includes(debouncedSearch.value),
    );
  }

  filteredMarketList.value = [...marketListCopy];
});

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
.wrapper {
  margin: 48px 0 96px;
  @media (width <= 768px) {
    margin: 24px 0 48px;
  }
  @media (width <= 480px) {
    margin: 12px 0 24px;
  }
}
.filtersBar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.searchFieldWrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 240px;
  height: 40px;
  background-color: #e6e6e6;
  border-radius: 8px;
  border: 1px solid #bebebe;
  padding: 0 12px;
  &:focus-within {
    outline: solid 3px #a0a0a0;
  }
}
.searchField {
  all: unset;
  min-width: 0;
  color: #2d2d2d;
  font-weight: 500;
  &::placeholder {
    color: #a0a0a0;
  }
}
.searchFieldIcon {
  flex-shrink: 0;
}
.tableWrapper {
  color: #1e1e1e;
  border: 1px solid #bebebe;
  border-radius: 16px;
  margin-top: 24px;
  @media (width <= 1280px) {
    width: 100%;
  }
  @media (width <= 768px) {
    margin-top: 16px;
  }
  @media (width <= 480px) {
    margin-top: 12px;
  }
}
.marketTable {
  border-collapse: collapse;
  table-layout: fixed;
  white-space: nowrap;
  width: 100%;
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
      padding: 12px;
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
      padding: 12px;
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
