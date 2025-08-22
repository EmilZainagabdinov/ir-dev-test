<template>
  <div class="wrapper">
    <div class="filtersBar">
      <Select
        v-model="filter"
        :options="filterOptions"
        placeholder="Select filter..."
        :width="isSm ? '100%' : '200px'"
      />
      <Input
        id="marketTableSearch"
        v-model="search"
        :icon="Search"
        placeholder="Search..."
        :width="isSm ? '100%' : '300px'"
      />
    </div>
    <div class="tableWrapper">
      <table class="marketTable">
        <thead class="marketTableHead">
          <tr>
            <th class="coinHeader">Coin</th>
            <th class="priceHeader">Price</th>
            <th class="changeHeader">Change</th>
            <th v-if="!isSm" class="volumeHeader">Volume</th>
            <th v-if="isXl">Price chart</th>
          </tr>
        </thead>
        <tbody class="marketTableBody">
          <MarketTableSkeleton v-if="isFetching" />
          <MarketTablePlaceholder
            v-else-if="!isFetching && filteredMarketList.length === 0"
            :no-filters="noActiveFilters"
          />
          <MarketTableRow v-else v-for="item in filteredMarketList" :key="item.pair.primary" :trade-pair-data="item" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { watchDebounced, useWindowFocus } from '@vueuse/core';
import { Search } from 'lucide-vue-next';
import { useCurrencyConfigStore } from '@/stores/currencyConfig.ts';
import { useMarketDataStore } from '@/stores/marketData.ts';
import { PriceChangeEnum, TradePairData } from '@/stores/types.ts';
import { useBreakpoints } from '@/composables/useMediaQuery.ts';

import Select from '@/components/UI/Select.vue';
import Input from '@/components/UI/Input.vue';
import MarketTableRow from './MarketTableRow.vue';
import MarketTableSkeleton from '@/components/MarketTable/MarketTableSkeleton.vue';
import { SelectOptions } from '@/components/UI/types.ts';
import MarketTablePlaceholder from '@/components/MarketTable/MarketTablePlaceholder.vue';

const currencyConfig = useCurrencyConfigStore();
const marketData = useMarketDataStore();
const { data: marketDataList } = storeToRefs(marketData);
const { isSm, isXl } = useBreakpoints();
const tabFocused = useWindowFocus();

let pollingInterval: ReturnType<typeof setTimeout>;

const search = ref('');
const debouncedSearch = ref('');
const filter = ref('');
const filteredMarketList = ref<TradePairData[]>([]);

watchDebounced(
  search,
  () => {
    debouncedSearch.value = search.value.trim().toLowerCase();
  },
  { debounce: 500 },
);

const isFetching = computed(() => currencyConfig.initialFetch || marketData.initialFetch);
const noActiveFilters = computed(() => !debouncedSearch.value && !filter.value);
const filterOptions: SelectOptions[] = [
  { label: 'Gaining', value: PriceChangeEnum.UP },
  { label: 'Losing', value: PriceChangeEnum.DOWN },
];

const { stop: stopFilterWatch } = watch([marketDataList, filter, debouncedSearch], () => {
  let marketListCopy = [...marketDataList.value];

  if (debouncedSearch.value) {
    marketListCopy = marketListCopy.filter(
      (tradePair) =>
        tradePair.pair.primary.toLowerCase().includes(debouncedSearch.value) ||
        currencyConfig.tickersMap?.[tradePair.pair.primary]?.ticker.toLowerCase().includes(debouncedSearch.value),
    );
  }

  if (filter.value) {
    marketListCopy = marketListCopy.filter((tradePair) => tradePair.price.change.direction === filter.value);
  }

  filteredMarketList.value = [...marketListCopy];
});

onMounted(() => {
  currencyConfig.fetchCurrencyConfig();
  marketData.fetchMarketData();

  pollingInterval = setInterval(() => {
    if (tabFocused.value) {
      currencyConfig.fetchCurrencyConfig();
      marketData.fetchMarketData();
    }
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  stopFilterWatch();
});
</script>

<style scoped>
.wrapper {
  margin: 48px 0 96px;
  @media (width < 768px) {
    margin: 24px 0 48px;
  }
  @media (width < 480px) {
    margin: 12px 0 24px;
  }
}
.filtersBar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  @media (width < 768px) {
    flex-direction: column;
    gap: 12px;
  }
}
.tableWrapper {
  color: #1e1e1e;
  border: 1px solid #bebebe;
  border-radius: 16px;
  margin-top: 24px;
  @media (width < 1280px) {
    width: 100%;
  }
  @media (width < 768px) {
    margin-top: 16px;
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
.priceHeader {
  @media (width < 1280px) {
    text-align: right;
  }
}
.changeHeader {
  @media (width < 768px) {
    text-align: center;
  }
  @media (width < 480px) {
    text-align: right;
  }
}
.volumeHeader {
  @media (width < 1280px) {
    text-align: right;
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
